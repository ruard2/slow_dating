import { PrismaPg } from "@prisma/adapter-pg";

import type { GameRun, Message, Pair, Profile } from "@slow-dating/contracts";

import { PrismaClient, type Prisma } from "./generated/prisma/client.js";
import {
  type AppRepository,
  DomainError,
  type InstallationRecord,
} from "./domain.js";

function toProfile(profile: {
  installationId: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  createdAt: Date;
  updatedAt: Date;
}): Profile {
  return {
    id: profile.installationId,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarColor: profile.avatarColor,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export class PrismaRepository implements AppRepository {
  private readonly prisma: PrismaClient;

  constructor(databaseUrl: string) {
    this.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
  }

  async initialize() {
    await this.prisma.$connect();
  }

  async findOrCreateInstallation(
    secretHash: string,
  ): Promise<InstallationRecord> {
    const installation = await this.prisma.installation.upsert({
      where: { secretHash },
      update: {},
      create: {
        secretHash,
        profile: { create: {} },
      },
    });
    return {
      id: installation.id,
      secretHash: installation.secretHash,
      createdAt: installation.createdAt.toISOString(),
      lastSeenAt: installation.lastSeenAt.toISOString(),
    };
  }

  async getProfile(installationId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { installationId },
    });
    if (!profile) {
      throw new DomainError("Profiel niet gevonden.", 404);
    }
    return toProfile(profile);
  }

  async updateProfile(
    installationId: string,
    changes: Partial<Pick<Profile, "avatarColor" | "bio" | "displayName">>,
  ) {
    const profile = await this.prisma.profile.update({
      where: { installationId },
      data: changes,
    });
    return toProfile(profile);
  }

  async createPair(installationId: string) {
    await this.disconnectPair(installationId);
    const pair = await this.prisma.pair.create({
      data: {
        code: await this.createUniqueCode(),
        members: {
          create: {
            installationId,
            role: "creator",
          },
        },
      },
    });
    return this.getPair(pair.id);
  }

  async joinPair(installationId: string, code: string) {
    const target = await this.prisma.pair.findUnique({
      where: { code },
      include: { members: true },
    });
    if (!target) {
      throw new DomainError("Koppelcode niet gevonden.", 404);
    }
    if (
      target.members.length >= 2 &&
      !target.members.some((member) => member.installationId === installationId)
    ) {
      throw new DomainError("Dit koppel is al compleet.", 409);
    }
    if (!target.members.some((member) => member.installationId === installationId)) {
      await this.disconnectPair(installationId);
      await this.prisma.pairMember.create({
        data: {
          pairId: target.id,
          installationId,
          role: "partner",
        },
      });
    }
    return this.getPair(target.id);
  }

  async getPairForInstallation(installationId: string) {
    const membership = await this.prisma.pairMember.findUnique({
      where: { installationId },
    });
    return membership ? this.getPair(membership.pairId) : null;
  }

  async disconnectPair(installationId: string) {
    const membership = await this.prisma.pairMember.findUnique({
      where: { installationId },
    });
    if (membership) {
      await this.prisma.pair.delete({ where: { id: membership.pairId } });
    }
  }

  async listMessages(installationId: string) {
    const pair = await this.requirePair(installationId);
    const messages = await this.prisma.message.findMany({
      where: { pairId: pair.id },
      orderBy: { sentAt: "asc" },
      include: { sender: { include: { profile: true } } },
    });
    return messages.map((message) => ({
      id: message.id,
      clientId: message.clientId,
      pairId: message.pairId,
      senderInstallationId: message.senderInstallationId,
      senderName: message.sender.profile?.displayName ?? "Onbekend",
      text: message.text,
      sentAt: message.sentAt.toISOString(),
    }));
  }

  async createMessage(
    installationId: string,
    clientId: string,
    text: string,
  ): Promise<Message> {
    const pair = await this.requirePair(installationId);
    const message = await this.prisma.message.upsert({
      where: {
        pairId_clientId: {
          pairId: pair.id,
          clientId,
        },
      },
      update: {},
      create: {
        pairId: pair.id,
        clientId,
        senderInstallationId: installationId,
        text,
      },
      include: { sender: { include: { profile: true } } },
    });
    return {
      id: message.id,
      clientId: message.clientId,
      pairId: message.pairId,
      senderInstallationId: message.senderInstallationId,
      senderName: message.sender.profile?.displayName ?? "Onbekend",
      text: message.text,
      sentAt: message.sentAt.toISOString(),
    };
  }

  async createGameRun(
    installationId: string,
    input: Pick<GameRun, "gameId" | "mode" | "version">,
  ) {
    const pair = await this.getPairForInstallation(installationId);
    if (input.mode === "couple" && (!pair || pair.members.length < 2)) {
      throw new DomainError("Koppelmodus vereist twee gekoppelde spelers.", 409);
    }
    const run = await this.prisma.gameRun.create({
      data: {
        installationId,
        pairId: input.mode === "couple" ? (pair?.id ?? null) : null,
        gameId: input.gameId,
        version: input.version,
        mode: input.mode,
        state: {},
      },
    });
    return this.toGameRun(run);
  }

  async updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ) {
    const run = await this.prisma.gameRun.findUnique({ where: { id: runId } });
    if (!run || run.installationId !== installationId) {
      throw new DomainError("Spelsessie niet gevonden.", 404);
    }
    const updated = await this.prisma.gameRun.update({
      where: { id: runId },
      data: {
        ...(changes.state === undefined
          ? {}
          : { state: changes.state as Prisma.InputJsonValue }),
        ...(changes.result === undefined
          ? {}
          : { result: changes.result as Prisma.InputJsonValue }),
        ...(changes.status === undefined ? {} : { status: changes.status }),
        ...(changes.status === "completed" ? { completedAt: new Date() } : {}),
      },
    });
    return this.toGameRun(updated);
  }

  async getWorldProgress(installationId: string) {
    const pair = await this.getPairForInstallation(installationId);
    const completedRuns = await this.prisma.gameRun.findMany({
      where: {
        status: "completed",
        OR: [
          { installationId },
          ...(pair ? [{ pairId: pair.id }] : []),
        ],
      },
      select: { gameId: true },
    });
    const completedGames = new Set(
      completedRuns.map((run) => run.gameId),
    ).size;
    return {
      completedGames,
      unlockedWorlds: [1, 2, 3, 4, 5].filter(
        (world) => world === 1 || completedGames >= (world - 1) * 5,
      ),
    };
  }

  async hasProcessedEvent(eventId: string) {
    return Boolean(
      await this.prisma.processedEvent.findUnique({ where: { id: eventId } }),
    );
  }

  async markEventProcessed(eventId: string) {
    await this.prisma.processedEvent.upsert({
      where: { id: eventId },
      update: {},
      create: { id: eventId },
    });
  }

  private async requirePair(installationId: string) {
    const pair = await this.getPairForInstallation(installationId);
    if (!pair) {
      throw new DomainError("Je bent nog niet gekoppeld.", 409);
    }
    return pair;
  }

  private async getPair(pairId: string): Promise<Pair> {
    const pair = await this.prisma.pair.findUnique({
      where: { id: pairId },
      include: {
        members: {
          orderBy: { joinedAt: "asc" },
          include: { installation: { include: { profile: true } } },
        },
      },
    });
    if (!pair) {
      throw new DomainError("Koppel niet gevonden.", 404);
    }
    return {
      id: pair.id,
      code: pair.code,
      createdAt: pair.createdAt.toISOString(),
      members: pair.members.map((member) => ({
        installationId: member.installationId,
        displayName:
          member.installation.profile?.displayName ?? "Nieuwe bezoeker",
        role: member.role,
        online: false,
      })),
    };
  }

  private toGameRun(run: {
    id: string;
    gameId: string;
    version: number;
    mode: "solo" | "couple";
    pairId: string | null;
    installationId: string;
    status: "active" | "completed" | "abandoned";
    state: unknown;
    result: unknown;
    startedAt: Date;
    completedAt: Date | null;
  }): GameRun {
    return {
      id: run.id,
      gameId: run.gameId,
      version: run.version,
      mode: run.mode,
      pairId: run.pairId,
      installationId: run.installationId,
      status: run.status,
      state: (run.state ?? {}) as Record<string, unknown>,
      result: run.result as Record<string, unknown> | null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    };
  }

  private async createUniqueCode() {
    const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const code = Array.from({ length: 6 }, () => {
        const index = Math.floor(Math.random() * characters.length);
        return characters[index];
      }).join("");
      if (!(await this.prisma.pair.findUnique({ where: { code } }))) {
        return code;
      }
    }
    throw new DomainError("Kon geen unieke koppelcode maken.", 500);
  }
}
