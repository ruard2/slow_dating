import { createHash } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";

import type {
  ActivityEvent,
  CallAccess,
  GameRun,
  Message,
  Pair,
  Profile,
  ProfileInsights,
  RelationshipArchive,
  RelationshipGameResult,
  WorldProgress,
} from "@slow-dating/contracts";
import { isDiscoveryGameId } from "@slow-dating/content";

import { PrismaClient, type Prisma } from "./generated/prisma/client.js";
import {
  type AccountRecord,
  type AppRepository,
  type AuthTokenRecord,
  DomainError,
  type InstallationRecord,
} from "./domain.js";
import {
  buildProfileInsights,
  relationshipGameResults,
} from "./profileInsights.js";

function waitingBadges(waits: number, seconds: number, games: number) {
  return [
    ...(waits >= 5 ? ["Geduldige vos"] : []),
    ...(waits >= 10 ? ["Kampvuurwachter"] : []),
    ...(waits >= 20 ? ["Brugbewaker"] : []),
    ...(seconds >= 1_800 ? ["Theedrinker van het Beginland"] : []),
    ...(games >= 10 ? ["Lachvonk"] : []),
  ];
}

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
  private readonly onlineMembers = new Map<string, Set<string>>();

  constructor(databaseUrl: string) {
    this.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
  }

  async initialize() {
    await this.prisma.$connect();
  }

  async close() {
    await this.prisma.$disconnect();
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
      accountId: installation.accountId,
      createdAt: installation.createdAt.toISOString(),
      lastSeenAt: installation.lastSeenAt.toISOString(),
    };
  }

  async getInstallation(installationId: string) {
    const installation = await this.prisma.installation.findUnique({
      where: { id: installationId },
    });
    if (!installation) {
      throw new DomainError("Installatie niet gevonden.", 404);
    }
    return {
      id: installation.id,
      secretHash: installation.secretHash,
      accountId: installation.accountId,
      createdAt: installation.createdAt.toISOString(),
      lastSeenAt: installation.lastSeenAt.toISOString(),
    };
  }

  async createAccount(
    installationId: string,
    email: string,
    passwordHash: string,
    displayName: string,
  ): Promise<AccountRecord> {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.prisma.account.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new DomainError("Dit e-mailadres is al in gebruik.", 409);
    }
    let account;
    try {
      account = await this.prisma.$transaction(async (transaction) => {
        const created = await transaction.account.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            primaryInstallationId: installationId,
          },
        });
        await transaction.installation.update({
          where: { id: installationId },
          data: { accountId: created.id },
        });
        await transaction.profile.update({
          where: { installationId },
          data: { displayName },
        });
        return created;
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new DomainError("Dit e-mailadres is al in gebruik.", 409);
      }
      throw error;
    }
    return this.toAccount(account);
  }

  async getAccount(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    if (!account) {
      throw new DomainError("Account niet gevonden.", 404);
    }
    return this.toAccount(account);
  }

  async findAccountByEmail(email: string) {
    const account = await this.prisma.account.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    return account ? this.toAccount(account) : null;
  }

  async getAccountForInstallation(installationId: string) {
    const installation = await this.prisma.installation.findUnique({
      where: { id: installationId },
    });
    return installation?.accountId
      ? this.getAccount(installation.accountId)
      : null;
  }

  async markEmailVerified(accountId: string) {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { emailVerified: true },
    });
  }

  async updateAccountPassword(accountId: string, passwordHash: string) {
    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: { passwordHash },
      }),
      this.prisma.authToken.updateMany({
        where: { accountId, type: "refresh", usedAt: null },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  async createAuthToken(
    accountId: string,
    type: AuthTokenRecord["type"],
    tokenHash: string,
    expiresAt: string,
  ) {
    const token = await this.prisma.authToken.create({
      data: {
        accountId,
        type,
        tokenHash,
        expiresAt: new Date(expiresAt),
      },
    });
    return this.toAuthToken(token);
  }

  async consumeAuthToken(type: AuthTokenRecord["type"], tokenHash: string) {
    return this.prisma.$transaction(async (transaction) => {
      const token = await transaction.authToken.findFirst({
        where: {
          type,
          tokenHash,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
      });
      if (!token) {
        return null;
      }
      const consumed = await transaction.authToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      });
      return this.toAuthToken(consumed);
    });
  }

  async revokeRefreshTokens(accountId: string) {
    await this.prisma.authToken.updateMany({
      where: { accountId, type: "refresh", usedAt: null },
      data: { usedAt: new Date() },
    });
  }

  async queueMail(
    to: string,
    type: "verify_email" | "password_reset",
    token: string,
  ) {
    await this.prisma.mailOutbox.create({
      data: { recipient: to, type, token },
    });
  }

  async listDevelopmentMail() {
    const messages = await this.prisma.mailOutbox.findMany({
      orderBy: { createdAt: "asc" },
    });
    return messages.map((message) => ({
      id: message.id,
      to: message.recipient,
      type: message.type as "verify_email" | "password_reset",
      token: message.token,
      createdAt: message.createdAt.toISOString(),
    }));
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
    if (await this.getPairForInstallation(installationId)) {
      throw new DomainError("Je hebt al een actieve koppeling.", 409);
    }
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

  async activateDeveloperPair(installationId: string) {
    const current = await this.getPairForInstallation(installationId);
    if (current) {
      if (current.developerMode) return current;
      throw new DomainError("Ontkoppel eerst je huidige partner.", 409);
    }
    const secretHash = createHash("sha256")
      .update(`developer-partner:${installationId}`)
      .digest("hex");
    const developer = await this.prisma.installation.upsert({
      where: { secretHash },
      update: {},
      create: {
        secretHash,
        profile: {
          create: {
            displayName: "Testpartner",
            bio: "Lokale computerpartner voor ontwikkeling.",
            avatarColor: "#8FD069",
          },
        },
      },
    });
    const pair = await this.prisma.pair.create({
      data: {
        code: await this.createUniqueCode(),
        developerMode: true,
        callUnlocked: true,
        bothOnlineSince: new Date(),
        callConsent: {
          [installationId]: "yes",
          [developer.id]: "yes",
        },
        members: {
          create: [
            { installationId, role: "creator" },
            { installationId: developer.id, role: "partner" },
          ],
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
    if (target.disconnectedAt) {
      throw new DomainError("Deze koppelcode is niet meer actief.", 410);
    }
    if (
      target.members.length >= 2 &&
      !target.members.some((member) => member.installationId === installationId)
    ) {
      throw new DomainError("Dit koppel is al compleet.", 409);
    }
    if (!target.members.some((member) => member.installationId === installationId)) {
      if (await this.getPairForInstallation(installationId)) {
        throw new DomainError("Ontkoppel eerst je huidige partner.", 409);
      }
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
    const membership = await this.prisma.pairMember.findFirst({
      where: { installationId, pair: { disconnectedAt: null } },
    });
    return membership ? this.getPair(membership.pairId) : null;
  }

  async disconnectPair(installationId: string) {
    const membership = await this.prisma.pairMember.findFirst({
      where: { installationId, pair: { disconnectedAt: null } },
    });
    if (membership) {
      await this.prisma.pair.update({
        where: { id: membership.pairId },
        data: { disconnectedAt: new Date(), bothOnlineSince: null },
      });
    }
  }

  async listRelationshipArchives(
    installationId: string,
  ): Promise<RelationshipArchive[]> {
    const memberships = await this.prisma.pairMember.findMany({
      where: {
        installationId,
        pair: { disconnectedAt: { not: null } },
      },
      include: {
        pair: {
          include: {
            _count: { select: { messages: true } },
            gameRuns: {
              where: { status: "completed" },
              select: { gameId: true },
            },
          },
        },
      },
    });
    return Promise.all(
      memberships.map(async ({ pair }) => ({
        ...(await this.getPair(pair.id)),
        messageCount: pair._count.messages,
        completedGames: new Set(
          pair.gameRuns
            .map((run) => run.gameId)
            .filter(isDiscoveryGameId),
        ).size,
      })),
    );
  }

  async listRelationshipMessages(installationId: string, pairId: string) {
    const membership = await this.prisma.pairMember.findFirst({
      where: {
        installationId,
        pairId,
      },
    });
    if (!membership) {
      throw new DomainError("Relatiearchief niet gevonden.", 404);
    }
    const messages = await this.prisma.message.findMany({
      where: { pairId },
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

  async listRelationshipGameResults(
    installationId: string,
    pairId: string,
  ): Promise<RelationshipGameResult[]> {
    const membership = await this.prisma.pairMember.findFirst({
      where: {
        installationId,
        pairId,
      },
    });
    if (!membership) {
      throw new DomainError("Relatiearchief niet gevonden.", 404);
    }
    const runs = await this.prisma.gameRun.findMany({
      where: { pairId, status: "completed" },
      orderBy: { completedAt: "desc" },
    });
    return relationshipGameResults(runs.map((run) => this.toGameRun(run)));
  }

  async listMessages(installationId: string) {
    const pair = await this.requireCompletePair(installationId);
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
    const pair = await this.requireCompletePair(installationId);
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
  ): Promise<GameRun> {
    const pair = await this.getPairForInstallation(installationId);
    if (!pair || pair.members.length < 2) {
      throw new DomainError("Koppelmodus vereist twee gekoppelde spelers.", 409);
    }
    const lobbyKey = `${pair.id}:${input.gameId}`;
    const active = await this.prisma.gameRun.findUnique({
      where: { lobbyKey },
    });
    if (active) {
      const state = (active.state ?? {}) as Record<string, unknown>;
      const readyInstallationIds = new Set(
        Array.isArray(state.readyInstallationIds)
          ? state.readyInstallationIds.filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      );
      const wasReady = readyInstallationIds.has(installationId);
      readyInstallationIds.add(installationId);
      if (pair.developerMode) {
        pair.members.forEach((member) =>
          readyInstallationIds.add(member.installationId),
        );
      }
      const allReady = pair.members.every((member) =>
        readyInstallationIds.has(member.installationId),
      );
      const updated = await this.prisma.gameRun.update({
        where: { id: active.id },
        data: {
          ...(!wasReady || (allReady && active.status === "lobby")
            ? { revision: { increment: 1 } }
            : {}),
          ...(allReady ? { status: "active" as const } : {}),
          state: {
            ...state,
            readyInstallationIds: [...readyInstallationIds],
          } as Prisma.InputJsonValue,
        },
      });
      await this.recordActivity(installationId, {
        clientEventId: `game-entered:${updated.id}`,
        category: "game",
        type: "game.entered",
        gameRunId: updated.id,
        payload: {},
      });
      return this.toGameRun(updated);
    }
    try {
      const run = await this.prisma.gameRun.create({
        data: {
          installationId,
          lobbyKey,
          pairId: pair.id,
          gameId: input.gameId,
          version: input.version,
          mode: "couple",
          status: pair.developerMode ? "active" : "lobby",
          state: {
            readyInstallationIds: pair.developerMode
              ? pair.members.map((member) => member.installationId)
              : [installationId],
          },
        },
      });
      await this.recordActivity(installationId, {
        clientEventId: `game-entered:${run.id}`,
        category: "game",
        type: "game.entered",
        gameRunId: run.id,
        payload: {},
      });
      return this.toGameRun(run);
    } catch (error) {
      const concurrentRun = await this.prisma.gameRun.findUnique({
        where: { lobbyKey },
      });
      if (concurrentRun) {
        return this.createGameRun(installationId, input);
      }
      throw error;
    }
  }

  async getActiveGameRun(installationId: string, gameId: string) {
    const pair = await this.getPairForInstallation(installationId);
    if (!pair) return null;
    const run = await this.prisma.gameRun.findUnique({
      where: { lobbyKey: `${pair.id}:${gameId}` },
    });
    return run ? this.toGameRun(run) : null;
  }

  async updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ) {
    const run = await this.prisma.gameRun.findUnique({ where: { id: runId } });
    const membership = run?.pairId
      ? await this.prisma.pairMember.findUnique({
          where: {
            pairId_installationId: {
              pairId: run.pairId,
              installationId,
            },
          },
        })
      : null;
    if (!run || (!membership && run.installationId !== installationId)) {
      throw new DomainError("Spelsessie niet gevonden.", 404);
    }
    if (run.status === "completed") {
      if (changes.status === "completed") {
        await this.recordActivity(installationId, {
          clientEventId: `game-completed:${run.id}`,
          category: "game",
          type: "game.completed",
          gameRunId: run.id,
          payload: {
            result: (run.result ?? {}) as Record<string, unknown>,
          },
        });
        return this.toGameRun(run);
      }
      throw new DomainError("Een afgeronde spelsessie kan niet worden gewijzigd.", 409);
    }
    if (run.status !== "active") {
      throw new DomainError("Deze spelsessie is niet meer actief.", 409);
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
        ...(changes.status === "completed"
          ? { completedAt: new Date(), lobbyKey: null }
          : changes.status === "abandoned"
            ? { lobbyKey: null }
            : {}),
      },
    });
    if (changes.status === "completed") {
      await this.recordActivity(installationId, {
        clientEventId: `game-completed:${updated.id}`,
        category: "game",
        type: "game.completed",
        gameRunId: updated.id,
        payload: {
          result: (updated.result ?? {}) as Record<string, unknown>,
        },
      });
    }
    return this.toGameRun(updated);
  }

  async applyGameAction(
    installationId: string,
    runId: string,
    action: {
      id: string;
      expectedRevision: number;
      type: string;
      payload: Record<string, unknown>;
      state: Record<string, unknown>;
      status?: "completed" | "abandoned";
      result?: Record<string, unknown>;
    },
  ) {
    await this.requirePairGameRun(installationId, runId);
    const duplicate = await this.prisma.gameAction.findUnique({
      where: { id: action.id },
    });
    if (duplicate) {
      if (duplicate.gameRunId !== runId) {
        throw new DomainError("Deze actie-ID hoort bij een ander spel.", 409);
      }
      const current = await this.prisma.gameRun.findUniqueOrThrow({
        where: { id: runId },
      });
      return this.toGameRun(current);
    }

    return this.prisma.$transaction(async (transaction) => {
      const updated = await transaction.gameRun.updateMany({
        where: {
          id: runId,
          status: "active",
          revision: action.expectedRevision,
        },
        data: {
          revision: { increment: 1 },
          state: action.state as Prisma.InputJsonValue,
          ...(action.result === undefined
            ? {}
            : { result: action.result as Prisma.InputJsonValue }),
          ...(action.status === undefined ? {} : { status: action.status }),
          ...(action.status === "completed"
            ? { completedAt: new Date(), lobbyKey: null }
            : action.status === "abandoned"
              ? { lobbyKey: null }
              : {}),
        },
      });
      if (updated.count !== 1) {
        throw new DomainError("De spelstatus is inmiddels gewijzigd.", 409);
      }
      const run = await transaction.gameRun.findUniqueOrThrow({
        where: { id: runId },
      });
      await transaction.gameAction.create({
        data: {
          id: action.id,
          gameRunId: runId,
          installationId,
          revision: run.revision,
          type: action.type,
          payload: action.payload as Prisma.InputJsonValue,
        },
      });
      if (action.status === "completed") {
        await transaction.activityEvent.upsert({
          where: {
            installationId_clientEventId: {
              installationId,
              clientEventId: `game-completed:${run.id}`,
            },
          },
          update: {},
          create: {
            clientEventId: `game-completed:${run.id}`,
            installationId,
            pairId: run.pairId,
            gameRunId: run.id,
            gameId: run.gameId,
            category: "game",
            type: "game.completed",
            payload: (action.result ?? {}) as Prisma.InputJsonValue,
          },
        });
      }
      return this.toGameRun(run);
    });
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
    const run = input.gameRunId
      ? await this.requirePairGameRun(installationId, input.gameRunId)
      : null;
    const membership = run
      ? null
      : await this.prisma.pairMember.findFirst({
          where: {
            installationId,
            pair: { disconnectedAt: null },
          },
          select: { pairId: true },
        });
    const event = await this.prisma.activityEvent.upsert({
      where: {
        installationId_clientEventId: {
          installationId,
          clientEventId: input.clientEventId,
        },
      },
      update: {},
      create: {
        clientEventId: input.clientEventId,
        installationId,
        pairId: run?.pairId ?? membership?.pairId ?? null,
        gameRunId: run?.id ?? null,
        gameId: run?.gameId ?? null,
        category: input.category,
        type: input.type,
        payload: input.payload as Prisma.InputJsonValue,
      },
    });
    return this.toActivityEvent(event);
  }

  async listActivity(installationId: string) {
    const events = await this.prisma.activityEvent.findMany({
      where: { installationId },
      orderBy: { occurredAt: "desc" },
    });
    return events.map((event) => this.toActivityEvent(event));
  }

  async getProfileInsights(
    installationId: string,
  ): Promise<ProfileInsights> {
    const memberships = await this.prisma.pairMember.findMany({
      where: { installationId },
      include: {
        pair: {
          include: {
            members: {
              include: { installation: { include: { profile: true } } },
            },
          },
        },
      },
    });
    const currentMembership =
      memberships.find(({ pair }) => pair.disconnectedAt === null) ?? null;
    const partner = currentMembership?.pair.members.find(
      (member) => member.installationId !== installationId,
    );
    const runs = await this.prisma.gameRun.findMany({
      where: {
        status: "completed",
        OR: [
          { installationId },
          ...(memberships.length
            ? [{ pairId: { in: memberships.map(({ pairId }) => pairId) } }]
            : []),
        ],
      },
      orderBy: { completedAt: "asc" },
    });
    return buildProfileInsights({
      installationId,
      completedRuns: runs.map((run) => this.toGameRun(run)),
      waiting: await this.getWaitingStats(installationId),
      currentPair: currentMembership
        ? {
            id: currentMembership.pair.id,
            memberIds: currentMembership.pair.members.map(
              (member) => member.installationId,
            ),
            partnerName:
              partner?.installation.profile?.displayName ?? "Je reisgenoot",
          }
        : null,
      generatedAt: new Date().toISOString(),
    });
  }

  async getWorldProgress(installationId: string): Promise<WorldProgress> {
    const memberships = await this.prisma.pairMember.findMany({
      where: { installationId },
      select: {
        pairId: true,
        pair: {
          select: {
            developerMode: true,
            disconnectedAt: true,
          },
        },
      },
    });
    const completedRuns = await this.prisma.gameRun.findMany({
      where: {
        status: "completed",
        OR: [
          { installationId },
          ...(memberships.length
            ? [{ pairId: { in: memberships.map(({ pairId }) => pairId) } }]
            : []),
        ],
      },
      select: { gameId: true },
    });
    const completedGames = new Set(
      completedRuns
        .map((run) => run.gameId)
        .filter(isDiscoveryGameId),
    ).size;
    const developerMode = memberships.some(
      ({ pair }) => pair.developerMode && !pair.disconnectedAt,
    );
    if (developerMode) {
      const allWorlds = [1, 2, 3, 4, 5];
      return {
        completedGames,
        eligibleWorlds: allWorlds,
        purchasedWorlds: allWorlds,
        unlockedWorlds: allWorlds,
      };
    }
    const account = await this.getAccountForInstallation(installationId);
    const purchases = account
      ? await this.prisma.worldPurchase.findMany({
          where: { accountId: account.id },
          select: { world: true },
        })
      : [];
    const purchasedWorlds = [
      1,
      ...purchases.map((purchase) => purchase.world),
    ];
    const eligibleWorlds = [1, 2, 3, 4, 5].filter(
      (world) => world === 1 || completedGames >= (world - 1) * 5,
    );
    return {
      completedGames,
      eligibleWorlds,
      purchasedWorlds,
      unlockedWorlds: eligibleWorlds.filter((world) =>
        purchasedWorlds.includes(world),
      ),
    };
  }

  async startWaitingSession(installationId: string, gameRunId: string) {
    const run = await this.requirePairGameRun(installationId, gameRunId);
    await this.prisma.$transaction(async (transaction) => {
      const session = await transaction.waitingSession.upsert({
        where: { gameRunId_userId: { gameRunId, userId: installationId } },
        update: {},
        create: {
          pairId: run.pairId as string,
          gameRunId,
          userId: installationId,
        },
      });
      await transaction.activityEvent.upsert({
        where: {
          installationId_clientEventId: {
            installationId,
            clientEventId: `waiting-start:${session.id}`,
          },
        },
        update: {},
        create: {
          clientEventId: `waiting-start:${session.id}`,
          installationId,
          pairId: run.pairId,
          gameRunId,
          gameId: run.gameId,
          category: "waiting",
          type: "waiting.started",
          payload: {},
          occurredAt: session.startedAt,
        },
      });
    });
  }

  async endWaitingSession(installationId: string, gameRunId: string) {
    await this.prisma.$transaction(async (transaction) => {
      const session = await transaction.waitingSession.findFirst({
        where: { gameRunId, userId: installationId, endedAt: null },
        include: { gameRun: true },
      });
      if (!session) return;
      const endedAt = new Date();
      await transaction.waitingSession.update({
        where: { id: session.id },
        data: { endedAt },
      });
      await transaction.activityEvent.upsert({
        where: {
          installationId_clientEventId: {
            installationId,
            clientEventId: `waiting-end:${session.id}`,
          },
        },
        update: {},
        create: {
          clientEventId: `waiting-end:${session.id}`,
          installationId,
          pairId: session.pairId,
          gameRunId,
          gameId: session.gameRun.gameId,
          category: "waiting",
          type: "waiting.ended",
          payload: {
            durationSeconds: Math.max(
              0,
              Math.floor(
                (endedAt.getTime() - session.startedAt.getTime()) / 1_000,
              ),
            ),
          },
          occurredAt: endedAt,
        },
      });
    });
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
    const session = await this.prisma.waitingSession.findUnique({
      where: {
        gameRunId_userId: {
          gameRunId: input.gameRunId,
          userId: installationId,
        },
      },
    });
    if (!session) throw new DomainError("Wachtsessie niet gevonden.", 404);
    await this.prisma.$transaction(async (transaction) => {
      const answer = await transaction.waitingAnswer.create({
        data: {
          waitingSessionId: session.id,
          userId: installationId,
          waitingGameId: input.waitingGameId,
          answerId: input.answerId,
          answerLabel: input.answerLabel,
          shareLevel: input.shareLevel,
        },
      });
      const run = await transaction.gameRun.findUniqueOrThrow({
        where: { id: input.gameRunId },
      });
      await transaction.activityEvent.create({
        data: {
          clientEventId: `waiting-answer:${answer.id}`,
          installationId,
          pairId: session.pairId,
          gameRunId: input.gameRunId,
          gameId: run.gameId,
          category: "waiting",
          type: "waiting.answer.saved",
          payload: {
            waitingGameId: input.waitingGameId,
            answerId: input.answerId,
            answerLabel: input.answerLabel,
            shareLevel: input.shareLevel,
          },
          occurredAt: answer.createdAt,
        },
      });
    });
  }

  async getWaitingStats(installationId: string) {
    const [sessions, answers] = await Promise.all([
      this.prisma.waitingSession.findMany({ where: { userId: installationId } }),
      this.prisma.waitingAnswer.findMany({
        where: { userId: installationId },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    const totalWaitSeconds = sessions.reduce((total, session) => {
      const end = session.endedAt?.getTime() ?? Date.now();
      return total + Math.max(0, Math.floor((end - session.startedAt.getTime()) / 1_000));
    }, 0);
    return {
      totalWaitCount: sessions.length,
      totalWaitSeconds,
      totalGamesPlayed: answers.length,
      recentGameIds: answers.slice(0, 5).map((answer) => answer.waitingGameId),
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
    await this.prisma.worldPurchase.upsert({
      where: { accountId_world: { accountId: account.id, world } },
      update: {},
      create: { accountId: account.id, world },
    });
    return this.getWorldProgress(installationId);
  }

  async getCallAccess(installationId: string): Promise<CallAccess> {
    const pair = await this.requireCompletePair(installationId);
    const record = await this.prisma.pair.findUnique({
      where: { id: pair.id },
      include: {
        members: true,
        messages: { select: { senderInstallationId: true } },
        gameRuns: {
          where: { status: "completed" },
          select: { gameId: true },
        },
      },
    });
    if (!record) {
      throw new DomainError("Koppeling niet gevonden.", 404);
    }
    const messagesByMember = Object.fromEntries(
      record.members.map((member) => [
        member.installationId,
        record.messages.filter(
          (message) =>
            message.senderInstallationId === member.installationId,
        ).length,
      ]),
    );
    const sharedSeconds =
      record.sharedSeconds +
      (record.bothOnlineSince
        ? Math.floor(
            (Date.now() - record.bothOnlineSince.getTime()) / 1_000,
          )
        : 0);
    const completedGames = new Set(
      record.gameRuns
        .map((run) => run.gameId)
        .filter(isDiscoveryGameId),
    ).size;
    const consent =
      (record.callConsent as Record<string, "yes" | "no" | null> | null) ?? {};
    return {
      sharedSeconds,
      messagesByMember,
      completedGames,
      conditionsMet:
        sharedSeconds >= 1_800 &&
        record.members.every(
          (member) => (messagesByMember[member.installationId] ?? 0) >= 10,
        ) &&
        completedGames >= 5,
      unlocked: record.callUnlocked,
      consentByMember: Object.fromEntries(
        record.members.map((member) => [
          member.installationId,
          consent[member.installationId] ?? null,
        ]),
      ),
      requestedBy: record.callRequestedBy,
      cooldownUntil: record.callCooldownUntil?.toISOString() ?? null,
    };
  }

  async requestCallAccess(installationId: string) {
    const pair = await this.requireCompletePair(installationId);
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
    await this.prisma.pair.update({
      where: { id: pair.id },
      data: {
        callRequestedBy: installationId,
        callConsent: Object.fromEntries(
          pair.members.map((member) => [
            member.installationId,
            member.installationId === installationId ? "yes" : null,
          ]),
        ),
      },
    });
    return this.getCallAccess(installationId);
  }

  async answerCallAccess(installationId: string, answer: "yes" | "no") {
    const pair = await this.requireCompletePair(installationId);
    const record = await this.prisma.pair.findUnique({
      where: { id: pair.id },
    });
    if (!record?.callRequestedBy) {
      throw new DomainError("Er is geen toestemmingsverzoek.", 409);
    }
    const consent =
      (record.callConsent as Record<string, "yes" | "no" | null> | null) ?? {};
    consent[installationId] = answer;
    const allYes = pair.members.every(
      (member) => consent[member.installationId] === "yes",
    );
    await this.prisma.pair.update({
      where: { id: pair.id },
      data:
        answer === "no"
          ? {
              callUnlocked: false,
              callRequestedBy: null,
              callConsent: {},
              callCooldownUntil: new Date(Date.now() + 30 * 60 * 1_000),
            }
          : {
              callConsent: consent,
              ...(allYes
                ? {
                    callUnlocked: true,
                    callRequestedBy: null,
                    callCooldownUntil: null,
                  }
                : {}),
            },
    });
    return this.getCallAccess(installationId);
  }

  async relockCalls(installationId: string) {
    const pair = await this.requireCompletePair(installationId);
    await this.prisma.pair.update({
      where: { id: pair.id },
      data: {
        callUnlocked: false,
        callRequestedBy: null,
        callConsent: {},
        callCooldownUntil: null,
      },
    });
    return this.getCallAccess(installationId);
  }

  async markPresence(installationId: string, online: boolean) {
    const pair = await this.getPairForInstallation(installationId);
    if (!pair || pair.members.length !== 2) {
      return;
    }
    const members = this.onlineMembers.get(pair.id) ?? new Set<string>();
    if (online) {
      members.add(installationId);
    } else {
      members.delete(installationId);
    }
    this.onlineMembers.set(pair.id, members);
    const record = await this.prisma.pair.findUnique({ where: { id: pair.id } });
    if (!record) {
      return;
    }
    if (members.size === 2 && !record.bothOnlineSince) {
      await this.prisma.pair.update({
        where: { id: pair.id },
        data: { bothOnlineSince: new Date() },
      });
    } else if (members.size < 2 && record.bothOnlineSince) {
      await this.prisma.pair.update({
        where: { id: pair.id },
        data: {
          sharedSeconds: {
            increment: Math.max(
              0,
              Math.floor(
                (Date.now() - record.bothOnlineSince.getTime()) / 1_000,
              ),
            ),
          },
          bothOnlineSince: null,
        },
      });
    }
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

  private async requirePairGameRun(installationId: string, gameRunId: string) {
    const run = await this.prisma.gameRun.findFirst({
      where: {
        id: gameRunId,
        pair: {
          disconnectedAt: null,
          members: { some: { installationId } },
        },
      },
    });
    if (!run) throw new DomainError("Spelsessie niet gevonden.", 404);
    return run;
  }

  private async requireCompletePair(installationId: string) {
    const pair = await this.requirePair(installationId);
    if (pair.members.length !== 2) {
      throw new DomainError("Chat en bellen vereisen twee gekoppelde accounts.", 409);
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
      developerMode: pair.developerMode,
      createdAt: pair.createdAt.toISOString(),
      disconnectedAt: pair.disconnectedAt?.toISOString() ?? null,
      members: pair.members.map((member) => ({
        installationId: member.installationId,
        displayName:
          member.installation.profile?.displayName ?? "Nieuwe bezoeker",
        role: member.role,
        online: false,
      })),
    };
  }

  private toAccount(account: {
    id: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    primaryInstallationId: string;
    createdAt: Date;
  }): AccountRecord {
    return {
      id: account.id,
      email: account.email,
      emailVerified: account.emailVerified,
      passwordHash: account.passwordHash,
      primaryInstallationId: account.primaryInstallationId,
      createdAt: account.createdAt.toISOString(),
    };
  }

  private toAuthToken(token: {
    id: string;
    accountId: string;
    type: "refresh" | "verify_email" | "password_reset";
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  }): AuthTokenRecord {
    return {
      id: token.id,
      accountId: token.accountId,
      type: token.type,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt.toISOString(),
      usedAt: token.usedAt?.toISOString() ?? null,
      createdAt: token.createdAt.toISOString(),
    };
  }

  private toGameRun(run: {
    id: string;
    lobbyKey: string | null;
    gameId: string;
    version: number;
    mode: "couple";
    pairId: string | null;
    installationId: string;
    status: "lobby" | "active" | "completed" | "abandoned";
    revision: number;
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
      revision: run.revision,
      state: (run.state ?? {}) as Record<string, unknown>,
      result: run.result as Record<string, unknown> | null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    };
  }

  private toActivityEvent(event: {
    id: string;
    clientEventId: string;
    installationId: string;
    pairId: string | null;
    gameRunId: string | null;
    gameId: string | null;
    category: string;
    type: string;
    payload: unknown;
    occurredAt: Date;
  }): ActivityEvent {
    return {
      id: event.id,
      clientEventId: event.clientEventId,
      installationId: event.installationId,
      pairId: event.pairId,
      gameRunId: event.gameRunId,
      gameId: event.gameId,
      category: event.category as ActivityEvent["category"],
      type: event.type,
      payload: (event.payload ?? {}) as Record<string, unknown>,
      occurredAt: event.occurredAt.toISOString(),
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
