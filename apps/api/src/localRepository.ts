import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ActivityEvent,
  CallAccess,
  GameRun,
  Message,
  Pair,
  Profile,
  RelationshipArchive,
  WorldProgress,
} from "@slow-dating/contracts";

import {
  type AccountRecord,
  type AppRepository,
  type AuthTokenRecord,
  type DataState,
  DomainError,
  type InstallationRecord,
  type PairRecord,
} from "./domain.js";

const EMPTY_STATE: DataState = {
  installations: [],
  accounts: [],
  authTokens: [],
  profiles: [],
  pairs: [],
  messages: [],
  gameRuns: [],
  worldPurchases: [],
  mailOutbox: [],
  processedEventIds: [],
  waitingSessions: [],
  waitingAnswers: [],
  activityEvents: [],
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

function waitingBadges(waits: number, seconds: number, games: number) {
  return [
    ...(waits >= 5 ? ["Geduldige vos"] : []),
    ...(waits >= 10 ? ["Kampvuurwachter"] : []),
    ...(waits >= 20 ? ["Brugbewaker"] : []),
    ...(seconds >= 1_800 ? ["Theedrinker van het Beginland"] : []),
    ...(games >= 10 ? ["Lachvonk"] : []),
  ];
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
      accountId: null,
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

  async getInstallation(installationId: string) {
    const installation = this.state.installations.find(
      (candidate) => candidate.id === installationId,
    );
    if (!installation) {
      throw new DomainError("Installatie niet gevonden.", 404);
    }
    return structuredClone(installation);
  }

  async createAccount(
    installationId: string,
    email: string,
    passwordHash: string,
    displayName: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.state.accounts.some((account) => account.email === normalizedEmail)) {
      throw new DomainError("Dit e-mailadres is al in gebruik.", 409);
    }
    const installation = this.state.installations.find(
      (candidate) => candidate.id === installationId,
    );
    if (!installation) {
      throw new DomainError("Installatie niet gevonden.", 404);
    }
    if (installation.accountId) {
      throw new DomainError("Deze installatie heeft al een account.", 409);
    }
    const timestamp = now();
    const account: AccountRecord = {
      id: randomUUID(),
      email: normalizedEmail,
      emailVerified: false,
      passwordHash,
      primaryInstallationId: installationId,
      createdAt: timestamp,
    };
    installation.accountId = account.id;
    this.state.accounts.push(account);
    const profile = this.state.profiles.find(
      (candidate) => candidate.id === installationId,
    );
    if (profile) {
      profile.displayName = displayName;
      profile.updatedAt = timestamp;
    }
    await this.persist();
    return structuredClone(account);
  }

  async findAccountByEmail(email: string) {
    const account = this.state.accounts.find(
      (candidate) => candidate.email === email.trim().toLowerCase(),
    );
    return account ? structuredClone(account) : null;
  }

  async getAccount(accountId: string) {
    return structuredClone(this.requireAccount(accountId));
  }

  async getAccountForInstallation(installationId: string) {
    const installation = this.state.installations.find(
      (candidate) => candidate.id === installationId,
    );
    const account = this.state.accounts.find(
      (candidate) => candidate.id === installation?.accountId,
    );
    return account ? structuredClone(account) : null;
  }

  async markEmailVerified(accountId: string) {
    const account = this.requireAccount(accountId);
    account.emailVerified = true;
    await this.persist();
  }

  async updateAccountPassword(accountId: string, passwordHash: string) {
    const account = this.requireAccount(accountId);
    account.passwordHash = passwordHash;
    await this.revokeRefreshTokens(accountId);
    await this.persist();
  }

  async createAuthToken(
    accountId: string,
    type: AuthTokenRecord["type"],
    tokenHash: string,
    expiresAt: string,
  ) {
    const token: AuthTokenRecord = {
      id: randomUUID(),
      accountId,
      type,
      tokenHash,
      expiresAt,
      usedAt: null,
      createdAt: now(),
    };
    this.state.authTokens.push(token);
    await this.persist();
    return structuredClone(token);
  }

  async consumeAuthToken(type: AuthTokenRecord["type"], tokenHash: string) {
    const token = this.state.authTokens.find(
      (candidate) =>
        candidate.type === type &&
        candidate.tokenHash === tokenHash &&
        !candidate.usedAt &&
        new Date(candidate.expiresAt).getTime() > Date.now(),
    );
    if (!token) {
      return null;
    }
    token.usedAt = now();
    await this.persist();
    return structuredClone(token);
  }

  async revokeRefreshTokens(accountId: string) {
    const timestamp = now();
    this.state.authTokens.forEach((token) => {
      if (token.accountId === accountId && token.type === "refresh" && !token.usedAt) {
        token.usedAt = timestamp;
      }
    });
    await this.persist();
  }

  async queueMail(
    to: string,
    type: "verify_email" | "password_reset",
    token: string,
  ) {
    this.state.mailOutbox.push({
      id: randomUUID(),
      to,
      type,
      token,
      createdAt: now(),
    });
    await this.persist();
  }

  async listDevelopmentMail() {
    return structuredClone(this.state.mailOutbox);
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
    if (await this.getPairForInstallation(installationId)) {
      throw new DomainError("Je hebt al een actieve koppeling.", 409);
    }
    let code = createCode();
    while (this.state.pairs.some((pair) => pair.code === code)) {
      code = createCode();
    }
    this.state.pairs.push({
      id: randomUUID(),
      code,
      createdAt: now(),
      disconnectedAt: null,
      memberIds: [installationId],
      sharedSeconds: 0,
      bothOnlineSince: null,
      callUnlocked: false,
      callRequestedBy: null,
      callConsent: {},
      callCooldownUntil: null,
    });
    await this.persist();
    return this.requirePair(installationId);
  }

  async activateDeveloperPair(installationId: string) {
    const current = await this.getPairForInstallation(installationId);
    if (current) {
      if (current.developerMode) return current;
      throw new DomainError("Ontkoppel eerst je huidige partner.", 409);
    }
    const secretHash = createHash("sha256")
      .update(`developer-partner:${installationId}`)
      .digest("hex");
    let developer = this.state.installations.find(
      (candidate) => candidate.secretHash === secretHash,
    );
    if (!developer) {
      developer = {
        id: randomUUID(),
        secretHash,
        accountId: null,
        createdAt: now(),
        lastSeenAt: now(),
      };
      this.state.installations.push(developer);
      this.state.profiles.push({
        id: developer.id,
        displayName: "Testpartner",
        bio: "Lokale computerpartner voor ontwikkeling.",
        avatarColor: "#8FD069",
        createdAt: now(),
        updatedAt: now(),
      });
    }
    let code = createCode();
    while (this.state.pairs.some((pair) => pair.code === code)) {
      code = createCode();
    }
    this.state.pairs.push({
      id: randomUUID(),
      code,
      developerMode: true,
      createdAt: now(),
      disconnectedAt: null,
      memberIds: [installationId, developer.id],
      sharedSeconds: 0,
      bothOnlineSince: now(),
      callUnlocked: true,
      callRequestedBy: null,
      callConsent: {
        [installationId]: "yes",
        [developer.id]: "yes",
      },
      callCooldownUntil: null,
    });
    await this.persist();
    return this.requirePair(installationId);
  }

  async joinPair(installationId: string, code: string) {
    const pair = this.state.pairs.find((candidate) => candidate.code === code);
    if (!pair || pair.disconnectedAt) {
      throw new DomainError("Koppelcode niet gevonden.", 404);
    }
    if (pair.memberIds.length >= 2 && !pair.memberIds.includes(installationId)) {
      throw new DomainError("Dit koppel is al compleet.", 409);
    }
    if (
      !pair.memberIds.includes(installationId) &&
      (await this.getPairForInstallation(installationId))
    ) {
      throw new DomainError("Ontkoppel eerst je huidige partner.", 409);
    }
    if (!pair.memberIds.includes(installationId)) {
      pair.memberIds.push(installationId);
    }
    await this.persist();
    return this.toPair(pair);
  }

  async getPairForInstallation(installationId: string) {
    const pair = this.state.pairs.find((candidate) =>
      !candidate.disconnectedAt && candidate.memberIds.includes(installationId),
    );
    return pair ? this.toPair(pair) : null;
  }

  async disconnectPair(installationId: string) {
    const pair = this.state.pairs.find(
      (candidate) =>
        !candidate.disconnectedAt &&
        candidate.memberIds.includes(installationId),
    );
    if (!pair) {
      return;
    }
    this.closePresenceWindow(pair);
    pair.disconnectedAt = now();
    await this.persist();
  }

  async listRelationshipArchives(
    installationId: string,
  ): Promise<RelationshipArchive[]> {
    return Promise.all(
      this.state.pairs
        .filter(
          (pair) =>
            Boolean(pair.disconnectedAt) &&
            pair.memberIds.includes(installationId),
        )
        .map(async (pair) => ({
          ...(await this.toPair(pair)),
          messageCount: this.state.messages.filter(
            (message) => message.pairId === pair.id,
          ).length,
          completedGames: new Set(
            this.state.gameRuns
              .filter(
                (run) => run.pairId === pair.id && run.status === "completed",
              )
              .map((run) => run.gameId),
          ).size,
        })),
    );
  }

  async listRelationshipMessages(installationId: string, pairId: string) {
    const pair = this.state.pairs.find(
      (candidate) =>
        candidate.id === pairId &&
        Boolean(candidate.disconnectedAt) &&
        candidate.memberIds.includes(installationId),
    );
    if (!pair) {
      throw new DomainError("Relatiearchief niet gevonden.", 404);
    }
    return this.state.messages
      .filter((message) => message.pairId === pairId)
      .sort((left, right) => left.sentAt.localeCompare(right.sentAt))
      .map((message) => structuredClone(message));
  }

  async listMessages(installationId: string) {
    const pair = this.requireCompletePairRecord(installationId);
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
    const pair = this.requireCompletePairRecord(installationId);
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
    if (!pair || pair.members.length < 2) {
      throw new DomainError("Koppelmodus vereist twee gekoppelde spelers.", 409);
    }
    const active = this.state.gameRuns.find(
      (run) =>
        run.pairId === pair.id &&
        run.gameId === input.gameId &&
        run.status === "active",
    );
    if (active) {
      const readyInstallationIds = new Set(
        Array.isArray(active.state.readyInstallationIds)
          ? active.state.readyInstallationIds.filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      );
      readyInstallationIds.add(installationId);
      if (pair.developerMode) {
        pair.members.forEach((member) =>
          readyInstallationIds.add(member.installationId),
        );
      }
      active.state = {
        ...active.state,
        readyInstallationIds: [...readyInstallationIds],
      };
      await this.persist();
      await this.recordActivity(installationId, {
        clientEventId: `game-entered:${active.id}`,
        category: "game",
        type: "game.entered",
        gameRunId: active.id,
        payload: {},
      });
      return structuredClone(active);
    }
    const run: GameRun = {
      id: randomUUID(),
      installationId,
      pairId: pair.id,
      gameId: input.gameId,
      mode: "couple",
      version: input.version,
      status: "active",
      state: {
        readyInstallationIds: pair.developerMode
          ? pair.members.map((member) => member.installationId)
          : [installationId],
      },
      result: null,
      startedAt: now(),
      completedAt: null,
    };
    this.state.gameRuns.push(run);
    await this.persist();
    await this.recordActivity(installationId, {
      clientEventId: `game-entered:${run.id}`,
      category: "game",
      type: "game.entered",
      gameRunId: run.id,
      payload: {},
    });
    return structuredClone(run);
  }

  async getActiveGameRun(installationId: string, gameId: string) {
    const pair = await this.getPairForInstallation(installationId);
    if (!pair) return null;
    const run = this.state.gameRuns.find(
      (candidate) =>
        candidate.pairId === pair.id &&
        candidate.gameId === gameId &&
        candidate.status === "active",
    );
    return run ? structuredClone(run) : null;
  }

  async updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ) {
    const run = this.state.gameRuns.find((candidate) => candidate.id === runId);
    const pair = run?.pairId
      ? this.state.pairs.find(
          (candidate) =>
            candidate.id === run.pairId &&
            candidate.memberIds.includes(installationId),
        )
      : null;
    if (!run || (!pair && run.installationId !== installationId)) {
      throw new DomainError("Spelsessie niet gevonden.", 404);
    }
    if (run.status === "completed") {
      if (changes.status === "completed") {
        await this.recordActivity(installationId, {
          clientEventId: `game-completed:${run.id}`,
          category: "game",
          type: "game.completed",
          gameRunId: run.id,
          payload: { result: run.result ?? {} },
        });
        return structuredClone(run);
      }
      throw new DomainError("Een afgeronde spelsessie kan niet worden gewijzigd.", 409);
    }
    if (run.status !== "active") {
      throw new DomainError("Deze spelsessie is niet meer actief.", 409);
    }
    Object.assign(run, changes);
    if (changes.status === "completed") {
      run.completedAt = now();
    }
    await this.persist();
    if (changes.status === "completed") {
      await this.recordActivity(installationId, {
        clientEventId: `game-completed:${run.id}`,
        category: "game",
        type: "game.completed",
        gameRunId: run.id,
        payload: { result: run.result ?? {} },
      });
    }
    return structuredClone(run);
  }

  async recordActivity(
    installationId: string,
    input: {
      clientEventId: string;
      category: ActivityEvent["category"];
      type: string;
      gameRunId?: string;
      payload: Record<string, unknown>;
    },
  ) {
    const existing = this.state.activityEvents.find(
      (event) =>
        event.installationId === installationId &&
        event.clientEventId === input.clientEventId,
    );
    if (existing) return structuredClone(existing);

    const run = input.gameRunId
      ? this.requirePairGameRun(installationId, input.gameRunId)
      : null;
    const pair = run?.pairId
      ? this.state.pairs.find((candidate) => candidate.id === run.pairId)
      : this.state.pairs.find(
          (candidate) =>
            !candidate.disconnectedAt &&
            candidate.memberIds.includes(installationId),
        );
    const activity: ActivityEvent = {
      id: randomUUID(),
      clientEventId: input.clientEventId,
      installationId,
      pairId: run?.pairId ?? pair?.id ?? null,
      gameRunId: run?.id ?? null,
      gameId: run?.gameId ?? null,
      category: input.category,
      type: input.type,
      payload: structuredClone(input.payload),
      occurredAt: now(),
    };
    this.state.activityEvents.push(activity);
    await this.persist();
    return structuredClone(activity);
  }

  async listActivity(installationId: string) {
    return this.state.activityEvents
      .filter((event) => event.installationId === installationId)
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
      .map((event) => structuredClone(event));
  }

  async getWorldProgress(installationId: string): Promise<WorldProgress> {
    const relationshipIds = this.state.pairs
      .filter((pair) => pair.memberIds.includes(installationId))
      .map((pair) => pair.id);
    const completedGameIds = new Set(
      this.state.gameRuns
        .filter(
          (run) =>
            run.status === "completed" &&
            (run.installationId === installationId ||
              (run.pairId ? relationshipIds.includes(run.pairId) : false)),
        )
        .map((run) => run.gameId),
    );
    const completedGames = completedGameIds.size;
    const account = await this.getAccountForInstallation(installationId);
    const purchasedWorlds = [
      1,
      ...this.state.worldPurchases
        .filter((purchase) => purchase.accountId === account?.id)
        .map((purchase) => purchase.world),
    ];
    const eligibleWorlds = [1, 2, 3, 4, 5].filter(
      (world) => world === 1 || completedGames >= (world - 1) * 5,
    );
    return {
      completedGames,
      eligibleWorlds,
      purchasedWorlds: [...new Set(purchasedWorlds)].sort(),
      unlockedWorlds: eligibleWorlds.filter((world) =>
        purchasedWorlds.includes(world),
      ),
    };
  }

  async startWaitingSession(installationId: string, gameRunId: string) {
    const run = this.requirePairGameRun(installationId, gameRunId);
    const existing = this.state.waitingSessions.find(
      (session) =>
        session.gameRunId === gameRunId && session.userId === installationId,
    );
    if (!existing) {
      const session = {
        id: randomUUID(),
        pairId: run.pairId as string,
        gameRunId,
        userId: installationId,
        startedAt: now(),
        endedAt: null,
      };
      this.state.waitingSessions.push(session);
      this.state.activityEvents.push({
        id: randomUUID(),
        clientEventId: `waiting-start:${session.id}`,
        installationId,
        pairId: session.pairId,
        gameRunId,
        gameId: run.gameId,
        category: "waiting",
        type: "waiting.started",
        payload: {},
        occurredAt: session.startedAt,
      });
      await this.persist();
    }
  }

  async endWaitingSession(installationId: string, gameRunId: string) {
    const session = this.state.waitingSessions.find(
      (candidate) =>
        candidate.gameRunId === gameRunId &&
        candidate.userId === installationId &&
        !candidate.endedAt,
    );
    if (session) {
      session.endedAt = now();
      const run = this.state.gameRuns.find(
        (candidate) => candidate.id === gameRunId,
      );
      this.state.activityEvents.push({
        id: randomUUID(),
        clientEventId: `waiting-end:${session.id}`,
        installationId,
        pairId: session.pairId,
        gameRunId,
        gameId: run?.gameId ?? null,
        category: "waiting",
        type: "waiting.ended",
        payload: {
          durationSeconds: Math.max(
            0,
            Math.floor(
              (new Date(session.endedAt).getTime() -
                new Date(session.startedAt).getTime()) /
                1_000,
            ),
          ),
        },
        occurredAt: session.endedAt,
      });
      await this.persist();
    }
  }

  async saveWaitingAnswer(
    installationId: string,
    input: {
      gameRunId: string;
      waitingGameId: string;
      answerId: string;
      answerLabel: string;
      shareLevel: "private" | "soft_share" | "direct_share";
    },
  ) {
    await this.startWaitingSession(installationId, input.gameRunId);
    const session = this.state.waitingSessions.find(
      (candidate) =>
        candidate.gameRunId === input.gameRunId &&
        candidate.userId === installationId,
    );
    if (!session) throw new DomainError("Wachtsessie niet gevonden.", 404);
    const answer = {
      id: randomUUID(),
      waitingSessionId: session.id,
      userId: installationId,
      waitingGameId: input.waitingGameId,
      answerId: input.answerId,
      answerLabel: input.answerLabel,
      shareLevel: input.shareLevel,
      createdAt: now(),
    };
    this.state.waitingAnswers.push(answer);
    const run = this.state.gameRuns.find(
      (candidate) => candidate.id === input.gameRunId,
    );
    this.state.activityEvents.push({
      id: randomUUID(),
      clientEventId: `waiting-answer:${answer.id}`,
      installationId,
      pairId: session.pairId,
      gameRunId: input.gameRunId,
      gameId: run?.gameId ?? null,
      category: "waiting",
      type: "waiting.answer.saved",
      payload: {
        waitingGameId: input.waitingGameId,
        answerId: input.answerId,
        answerLabel: input.answerLabel,
        shareLevel: input.shareLevel,
      },
      occurredAt: answer.createdAt,
    });
    await this.persist();
  }

  async getWaitingStats(installationId: string) {
    const sessions = this.state.waitingSessions.filter(
      (session) => session.userId === installationId,
    );
    const answers = this.state.waitingAnswers.filter(
      (answer) => answer.userId === installationId,
    );
    const totalWaitSeconds = sessions.reduce((total, session) => {
      const end = session.endedAt ? new Date(session.endedAt).getTime() : Date.now();
      return total + Math.max(0, Math.floor((end - new Date(session.startedAt).getTime()) / 1_000));
    }, 0);
    return {
      totalWaitCount: sessions.length,
      totalWaitSeconds,
      totalGamesPlayed: answers.length,
      recentGameIds: answers.slice(-5).reverse().map((answer) => answer.waitingGameId),
      badges: waitingBadges(sessions.length, totalWaitSeconds, answers.length),
    };
  }

  async purchaseWorld(installationId: string, world: number) {
    if (world < 2 || world > 5) {
      throw new DomainError("Ongeldige wereld.", 400);
    }
    const account = await this.getAccountForInstallation(installationId);
    if (!account) {
      throw new DomainError("Maak eerst een account om een wereld te kopen.", 403);
    }
    const progress = await this.getWorldProgress(installationId);
    if (!progress.eligibleWorlds.includes(world)) {
      throw new DomainError("Je hebt nog niet genoeg ontdekkingen.", 409);
    }
    if (!progress.unlockedWorlds.includes(world - 1)) {
      throw new DomainError("Open eerst de vorige wereld.", 409);
    }
    if (
      !this.state.worldPurchases.some(
        (purchase) =>
          purchase.accountId === account.id && purchase.world === world,
      )
    ) {
      this.state.worldPurchases.push({
        id: randomUUID(),
        accountId: account.id,
        world,
        purchasedAt: now(),
      });
      await this.persist();
    }
    return this.getWorldProgress(installationId);
  }

  async getCallAccess(installationId: string): Promise<CallAccess> {
    const pair = this.requireCompletePairRecord(installationId);
    const messageCounts = Object.fromEntries(
      pair.memberIds.map((memberId) => [
        memberId,
        this.state.messages.filter(
          (message) =>
            message.pairId === pair.id &&
            message.senderInstallationId === memberId,
        ).length,
      ]),
    );
    const completedGames = new Set(
      this.state.gameRuns
        .filter((run) => run.pairId === pair.id && run.status === "completed")
        .map((run) => run.gameId),
    ).size;
    const sharedSeconds =
      (pair.sharedSeconds ?? 0) +
      (pair.bothOnlineSince
        ? Math.floor(
            (Date.now() - new Date(pair.bothOnlineSince).getTime()) / 1_000,
          )
        : 0);
    return {
      sharedSeconds,
      messagesByMember: messageCounts,
      completedGames,
      conditionsMet:
        sharedSeconds >= 1_800 &&
        pair.memberIds.every((memberId) => (messageCounts[memberId] ?? 0) >= 10) &&
        completedGames >= 5,
      unlocked: pair.callUnlocked ?? false,
      consentByMember: Object.fromEntries(
        pair.memberIds.map((memberId) => [
          memberId,
          pair.callConsent?.[memberId] ?? null,
        ]),
      ),
      requestedBy: pair.callRequestedBy ?? null,
      cooldownUntil: pair.callCooldownUntil ?? null,
    };
  }

  async requestCallAccess(installationId: string) {
    const pair = this.requireCompletePairRecord(installationId);
    const access = await this.getCallAccess(installationId);
    if (!access.conditionsMet) {
      throw new DomainError("De belvoorwaarden zijn nog niet behaald.", 409);
    }
    if (
      access.cooldownUntil &&
      new Date(access.cooldownUntil).getTime() > Date.now()
    ) {
      throw new DomainError("De bedenktijd is nog actief.", 429);
    }
    pair.callRequestedBy = installationId;
    pair.callConsent = Object.fromEntries(
      pair.memberIds.map((memberId) => [
        memberId,
        memberId === installationId ? "yes" : null,
      ]),
    );
    await this.persist();
    return this.getCallAccess(installationId);
  }

  async answerCallAccess(installationId: string, answer: "yes" | "no") {
    const pair = this.requireCompletePairRecord(installationId);
    if (!pair.callRequestedBy) {
      throw new DomainError("Er is geen toestemmingsverzoek.", 409);
    }
    pair.callConsent ??= {};
    pair.callConsent[installationId] = answer;
    if (answer === "no") {
      pair.callUnlocked = false;
      pair.callRequestedBy = null;
      pair.callConsent = {};
      pair.callCooldownUntil = new Date(
        Date.now() + 30 * 60 * 1_000,
      ).toISOString();
    } else if (
      pair.memberIds.every((memberId) => pair.callConsent?.[memberId] === "yes")
    ) {
      pair.callUnlocked = true;
      pair.callRequestedBy = null;
      pair.callCooldownUntil = null;
    }
    await this.persist();
    return this.getCallAccess(installationId);
  }

  async relockCalls(installationId: string) {
    const pair = this.requireCompletePairRecord(installationId);
    pair.callUnlocked = false;
    pair.callRequestedBy = null;
    pair.callConsent = {};
    pair.callCooldownUntil = null;
    await this.persist();
    return this.getCallAccess(installationId);
  }

  async markPresence(installationId: string, online: boolean) {
    const pair = this.state.pairs.find(
      (candidate) =>
        !candidate.disconnectedAt &&
        candidate.memberIds.includes(installationId) &&
        candidate.memberIds.length === 2,
    );
    if (!pair) {
      return;
    }
    const onlineKey = `presence:${pair.id}`;
    const onlineMembers = new Set(
      this.state.processedEventIds
        .filter((value) => value.startsWith(`${onlineKey}:`))
        .map((value) => value.slice(onlineKey.length + 1)),
    );
    if (online) {
      onlineMembers.add(installationId);
    } else {
      onlineMembers.delete(installationId);
    }
    this.state.processedEventIds = this.state.processedEventIds.filter(
      (value) => !value.startsWith(`${onlineKey}:`),
    );
    this.state.processedEventIds.push(
      ...[...onlineMembers].map((memberId) => `${onlineKey}:${memberId}`),
    );
    if (onlineMembers.size === 2 && !pair.bothOnlineSince) {
      pair.bothOnlineSince = now();
    } else if (onlineMembers.size < 2) {
      this.closePresenceWindow(pair);
    }
    await this.persist();
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
      !candidate.disconnectedAt && candidate.memberIds.includes(installationId),
    );
    if (!pair) {
      throw new DomainError("Je bent nog niet gekoppeld.", 409);
    }
    return pair;
  }

  private requirePairGameRun(installationId: string, gameRunId: string) {
    const pair = this.requireCompletePairRecord(installationId);
    const run = this.state.gameRuns.find(
      (candidate) => candidate.id === gameRunId && candidate.pairId === pair.id,
    );
    if (!run) throw new DomainError("Spelsessie niet gevonden.", 404);
    return run;
  }

  private requireCompletePairRecord(installationId: string) {
    const pair = this.requirePairRecord(installationId);
    if (pair.memberIds.length !== 2) {
      throw new DomainError("Chat en bellen vereisen twee gekoppelde accounts.", 409);
    }
    return pair;
  }

  private requireAccount(accountId: string) {
    const account = this.state.accounts.find(
      (candidate) => candidate.id === accountId,
    );
    if (!account) {
      throw new DomainError("Account niet gevonden.", 404);
    }
    return account;
  }

  private closePresenceWindow(pair: PairRecord) {
    if (!pair.bothOnlineSince) {
      return;
    }
    pair.sharedSeconds =
      (pair.sharedSeconds ?? 0) +
      Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(pair.bothOnlineSince).getTime()) / 1_000,
        ),
      );
    pair.bothOnlineSince = null;
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
      developerMode: pair.developerMode ?? false,
      createdAt: pair.createdAt,
      disconnectedAt: pair.disconnectedAt,
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
