import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { GameRun, Message, Pair, Profile } from "@slow-dating/contracts";

import {
  type AppRepository,
  type DataState,
  DomainError,
  type InstallationRecord,
  type PairRecord,
} from "./domain.js";

const EMPTY_STATE: DataState = {
  installations: [],
  profiles: [],
  pairs: [],
  messages: [],
  gameRuns: [],
  processedEventIds: [],
};

const CODE_CHARACTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const LEGACY_DATA_DIRECTORY = fileURLToPath(
  new URL("../../../legacy/koppel-backend/data/", import.meta.url),
);

function now() {
  return new Date().toISOString();
}

function createCode() {
  return Array.from({ length: 6 }, () => {
    const index = Math.floor(Math.random() * CODE_CHARACTERS.length);
    return CODE_CHARACTERS[index];
  }).join("");
}

export function hashInstallationSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export class LocalRepository implements AppRepository {
  private readonly filePath: string;
  private state: DataState = structuredClone(EMPTY_STATE);
  private writeQueue = Promise.resolve();

  constructor(filePath: string) {
    this.filePath = resolve(filePath);
  }

  async initialize() {
    await mkdir(dirname(this.filePath), { recursive: true });
    try {
      const stored = JSON.parse(
        await readFile(this.filePath, "utf8"),
      ) as Partial<DataState>;
      this.state = {
        ...structuredClone(EMPTY_STATE),
        ...stored,
      };
    } catch {
      await this.persist();
    }
    await this.importLegacyArchive();
  }

  async findOrCreateInstallation(secretHash: string) {
    const existing = this.state.installations.find(
      (installation) => installation.secretHash === secretHash,
    );
    if (existing) {
      existing.lastSeenAt = now();
      await this.persist();
      return existing;
    }

    const timestamp = now();
    const installation: InstallationRecord = {
      id: randomUUID(),
      secretHash,
      createdAt: timestamp,
      lastSeenAt: timestamp,
    };
    const profile: Profile = {
      id: installation.id,
      displayName: "Nieuwe bezoeker",
      bio: "",
      avatarColor: "#B9D67A",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.state.installations.push(installation);
    this.state.profiles.push(profile);
    await this.persist();
    return installation;
  }

  async getProfile(installationId: string) {
    const profile = this.state.profiles.find(
      (candidate) => candidate.id === installationId,
    );
    if (!profile) {
      throw new DomainError("Profiel niet gevonden.", 404);
    }
    return structuredClone(profile);
  }

  async updateProfile(
    installationId: string,
    changes: Partial<Pick<Profile, "avatarColor" | "bio" | "displayName">>,
  ) {
    const profile = this.state.profiles.find(
      (candidate) => candidate.id === installationId,
    );
    if (!profile) {
      throw new DomainError("Profiel niet gevonden.", 404);
    }
    Object.assign(profile, changes, { updatedAt: now() });
    await this.persist();
    return structuredClone(profile);
  }

  async createPair(installationId: string) {
    await this.disconnectPair(installationId);
    let code = createCode();
    while (this.state.pairs.some((pair) => pair.code === code)) {
      code = createCode();
    }
    this.state.pairs.push({
      id: randomUUID(),
      code,
      createdAt: now(),
      memberIds: [installationId],
    });
    await this.persist();
    return this.requirePair(installationId);
  }

  async joinPair(installationId: string, code: string) {
    const pair = this.state.pairs.find((candidate) => candidate.code === code);
    if (!pair) {
      throw new DomainError("Koppelcode niet gevonden.", 404);
    }
    if (pair.memberIds.length >= 2 && !pair.memberIds.includes(installationId)) {
      throw new DomainError("Dit koppel is al compleet.", 409);
    }
    await this.disconnectPair(installationId);
    if (!pair.memberIds.includes(installationId)) {
      pair.memberIds.push(installationId);
    }
    await this.persist();
    return this.toPair(pair);
  }

  async getPairForInstallation(installationId: string) {
    const pair = this.state.pairs.find((candidate) =>
      candidate.memberIds.includes(installationId),
    );
    return pair ? this.toPair(pair) : null;
  }

  async disconnectPair(installationId: string) {
    const pairIndex = this.state.pairs.findIndex((candidate) =>
      candidate.memberIds.includes(installationId),
    );
    if (pairIndex === -1) {
      return;
    }
    const pair = this.state.pairs[pairIndex];
    if (!pair) {
      return;
    }
    this.state.pairs.splice(pairIndex, 1);
    this.state.messages = this.state.messages.filter(
      (message) => message.pairId !== pair.id,
    );
    await this.persist();
  }

  async listMessages(installationId: string) {
    const pair = this.requirePairRecord(installationId);
    return this.state.messages
      .filter((message) => message.pairId === pair.id)
      .sort((left, right) => left.sentAt.localeCompare(right.sentAt))
      .map((message) => structuredClone(message));
  }

  async createMessage(
    installationId: string,
    clientId: string,
    text: string,
  ) {
    const pair = this.requirePairRecord(installationId);
    const duplicate = this.state.messages.find(
      (message) => message.pairId === pair.id && message.clientId === clientId,
    );
    if (duplicate) {
      return structuredClone(duplicate);
    }
    const profile = await this.getProfile(installationId);
    const message: Message = {
      id: randomUUID(),
      clientId,
      pairId: pair.id,
      senderInstallationId: installationId,
      senderName: profile.displayName,
      text,
      sentAt: now(),
    };
    this.state.messages.push(message);
    await this.persist();
    return structuredClone(message);
  }

  async createGameRun(
    installationId: string,
    input: Pick<GameRun, "gameId" | "mode" | "version">,
  ) {
    const pair = await this.getPairForInstallation(installationId);
    if (input.mode === "couple" && (!pair || pair.members.length < 2)) {
      throw new DomainError("Koppelmodus vereist twee gekoppelde spelers.", 409);
    }
    const run: GameRun = {
      id: randomUUID(),
      installationId,
      pairId: input.mode === "couple" ? (pair?.id ?? null) : null,
      gameId: input.gameId,
      mode: input.mode,
      version: input.version,
      status: "active",
      state: {},
      result: null,
      startedAt: now(),
      completedAt: null,
    };
    this.state.gameRuns.push(run);
    await this.persist();
    return structuredClone(run);
  }

  async updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ) {
    const run = this.state.gameRuns.find((candidate) => candidate.id === runId);
    if (!run || run.installationId !== installationId) {
      throw new DomainError("Spelsessie niet gevonden.", 404);
    }
    Object.assign(run, changes);
    if (changes.status === "completed") {
      run.completedAt = now();
    }
    await this.persist();
    return structuredClone(run);
  }

  async getWorldProgress(installationId: string) {
    const pair = await this.getPairForInstallation(installationId);
    const completedGameIds = new Set(
      this.state.gameRuns
        .filter(
          (run) =>
            run.status === "completed" &&
            (run.installationId === installationId ||
              (pair && run.pairId === pair.id)),
        )
        .map((run) => run.gameId),
    );
    const completedGames = completedGameIds.size;
    return {
      completedGames,
      unlockedWorlds: [1, 2, 3, 4, 5].filter(
        (world) => world === 1 || completedGames >= (world - 1) * 5,
      ),
    };
  }

  async hasProcessedEvent(eventId: string) {
    return this.state.processedEventIds.includes(eventId);
  }

  async markEventProcessed(eventId: string) {
    if (!this.state.processedEventIds.includes(eventId)) {
      this.state.processedEventIds.push(eventId);
      this.state.processedEventIds =
        this.state.processedEventIds.slice(-5_000);
      await this.persist();
    }
  }

  private requirePairRecord(installationId: string) {
    const pair = this.state.pairs.find((candidate) =>
      candidate.memberIds.includes(installationId),
    );
    if (!pair) {
      throw new DomainError("Je bent nog niet gekoppeld.", 409);
    }
    return pair;
  }

  private async requirePair(installationId: string) {
    return this.toPair(this.requirePairRecord(installationId));
  }

  private async toPair(pair: PairRecord): Promise<Pair> {
    const profiles = await Promise.all(
      pair.memberIds.map((installationId) => this.getProfile(installationId)),
    );
    return {
      id: pair.id,
      code: pair.code,
      createdAt: pair.createdAt,
      members: pair.memberIds.map((installationId, index) => ({
        installationId,
        displayName: profiles[index]?.displayName ?? "Onbekend",
        role: index === 0 ? "creator" : "partner",
        online: false,
      })),
    };
  }

  private persist() {
    this.writeQueue = this.writeQueue.then(async () => {
      const temporaryPath = `${this.filePath}.tmp`;
      await writeFile(temporaryPath, JSON.stringify(this.state, null, 2), "utf8");
      await rename(temporaryPath, this.filePath);
    });
    return this.writeQueue;
  }

  private async importLegacyArchive() {
    if (this.state.legacyArchive) {
      return;
    }
    const readJson = async (name: string) => {
      try {
        return JSON.parse(
          await readFile(resolve(LEGACY_DATA_DIRECTORY, name), "utf8"),
        ) as unknown;
      } catch {
        return {};
      }
    };
    this.state.legacyArchive = {
      importedAt: now(),
      profiles: await readJson("profiles.json"),
      callingStates: await readJson("calling_states.json"),
      coupleProgress: await readJson("couple_progress.json"),
    };
    await this.persist();
  }
}
