import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type {
  ActivityEvent,
  CallAccess,
  GameRun,
  Introduction,
  Message,
  Pair,
  Profile,
  ProfileInsights,
  ProfileUpdate,
  RelationshipArchive,
  RelationshipGameResult,
  ReportReason,
  RouteInvitation,
  RouteInvitationsList,
  WorldProgress,
} from "@slow-dating/contracts";
import { profileSchema } from "@slow-dating/contracts";
import { isDiscoveryGameId } from "@slow-dating/content";

import { computeCoreProgress } from "./progress.js";
import {
  overlapScore,
  withinDistance,
  SUGGESTION_LIMIT,
  WEEK_MS,
  WEEKLY_INVITATION_LIMIT,
} from "./matching.js";

import {
  type AccountRecord,
  type AppRepository,
  type AuthTokenRecord,
  type DataState,
  DomainError,
  type BlockRecord,
  type InstallationRecord,
  type PairRecord,
  type ReportRecord,
  type RouteInvitationRecord,
} from "./domain.js";
import {
  buildProfileInsights,
  relationshipGameResults,
} from "./profileInsights.js";

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
  routeInvitations: [],
  blocks: [],
  reports: [],
  gameActions: [],
};

const CODE_CHARACTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

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
        gameRuns: (stored.gameRuns ?? []).map((run) => ({
          ...run,
          revision: run.revision ?? 0,
        })),
      };
    } catch {
      await this.persist();
    }
  }

  async close() {}

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
    const profile: Profile = profileSchema.parse({
      id: installation.id,
      displayName: "Nieuwe bezoeker",
      bio: "",
      avatarColor: "#B9D67A",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
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
    return profileSchema.parse(profile);
  }

  async updateProfile(installationId: string, changes: ProfileUpdate) {
    const profile = this.state.profiles.find(
      (candidate) => candidate.id === installationId,
    );
    if (!profile) {
      throw new DomainError("Profiel niet gevonden.", 404);
    }
    Object.assign(profile, changes, { updatedAt: now() });
    await this.persist();
    return profileSchema.parse(profile);
  }

  private installationsInActivePair() {
    const inPair = new Set<string>();
    for (const pair of this.state.pairs) {
      if (!pair.disconnectedAt) pair.memberIds.forEach((id) => inPair.add(id));
    }
    return inPair;
  }

  private blockedIdsFor(installationId: string) {
    const ids = new Set<string>();
    for (const block of this.state.blocks) {
      if (block.byInstallationId === installationId) {
        ids.add(block.blockedInstallationId);
      }
      if (block.blockedInstallationId === installationId) {
        ids.add(block.byInstallationId);
      }
    }
    return ids;
  }

  async blockInstallation(
    installationId: string,
    targetInstallationId: string,
  ): Promise<void> {
    if (installationId === targetInstallationId) {
      throw new DomainError("Je kunt jezelf niet blokkeren.", 400);
    }
    const already = this.state.blocks.some(
      (block) =>
        block.byInstallationId === installationId &&
        block.blockedInstallationId === targetInstallationId,
    );
    if (!already) {
      const block: BlockRecord = {
        id: randomUUID(),
        byInstallationId: installationId,
        blockedInstallationId: targetInstallationId,
        createdAt: now(),
      };
      this.state.blocks.push(block);
    }
    // Openstaande kennismakingen tussen beiden vervallen.
    for (const invitation of this.state.routeInvitations) {
      if (invitation.status !== "pending") continue;
      const between =
        (invitation.fromInstallationId === installationId &&
          invitation.toInstallationId === targetInstallationId) ||
        (invitation.fromInstallationId === targetInstallationId &&
          invitation.toInstallationId === installationId);
      if (between) {
        invitation.status = "expired";
        invitation.respondedAt = now();
      }
    }
    // Delen jullie een actieve route? Dan stopt die respectvol.
    const sharedPair = this.state.pairs.find(
      (pair) =>
        !pair.disconnectedAt &&
        pair.memberIds.includes(installationId) &&
        pair.memberIds.includes(targetInstallationId),
    );
    if (sharedPair) {
      await this.disconnectPair(installationId);
    } else {
      await this.persist();
    }
  }

  async listBlockedInstallationIds(installationId: string): Promise<string[]> {
    return this.state.blocks
      .filter((block) => block.byInstallationId === installationId)
      .map((block) => block.blockedInstallationId);
  }

  async reportInstallation(
    installationId: string,
    targetInstallationId: string,
    reason: ReportReason,
    note: string,
  ): Promise<void> {
    if (installationId === targetInstallationId) {
      throw new DomainError("Je kunt jezelf niet rapporteren.", 400);
    }
    const report: ReportRecord = {
      id: randomUUID(),
      byInstallationId: installationId,
      targetInstallationId,
      reason,
      note: note.trim(),
      createdAt: now(),
    };
    this.state.reports.push(report);
    await this.persist();
  }

  private weeklyOutgoingCount(installationId: string) {
    const since = Date.now() - WEEK_MS;
    return this.state.routeInvitations.filter(
      (invitation) =>
        invitation.fromInstallationId === installationId &&
        Date.parse(invitation.createdAt) >= since,
    ).length;
  }

  private weeklyIncomingCount(installationId: string) {
    const since = Date.now() - WEEK_MS;
    return this.state.routeInvitations.filter(
      (invitation) =>
        invitation.toInstallationId === installationId &&
        Date.parse(invitation.createdAt) >= since,
    ).length;
  }

  private buildIntroduction(
    viewer: Profile,
    candidate: Profile,
    nowYear: number,
  ): Introduction {
    const { score, reasons } = overlapScore(viewer, candidate, nowYear);
    return { installationId: candidate.id, profile: candidate, score, reasons };
  }

  async suggestIntroductions(installationId: string) {
    if (await this.getPairForInstallation(installationId)) return [];
    const viewer = await this.getProfile(installationId);
    const nowYear = new Date().getFullYear();
    const inPair = this.installationsInActivePair();
    const blocked = new Set<string>([installationId]);
    for (const invitation of this.state.routeInvitations) {
      if (
        invitation.status !== "pending" &&
        invitation.status !== "accepted"
      ) {
        continue;
      }
      if (invitation.fromInstallationId === installationId) {
        blocked.add(invitation.toInstallationId);
      }
      if (invitation.toInstallationId === installationId) {
        blocked.add(invitation.fromInstallationId);
      }
    }
    for (const id of this.blockedIdsFor(installationId)) blocked.add(id);
    return this.state.profiles
      .filter(
        (candidate) =>
          candidate.id !== installationId &&
          !inPair.has(candidate.id) &&
          !blocked.has(candidate.id),
      )
      .map((candidate) => profileSchema.parse(candidate))
      .filter((candidate) => withinDistance(viewer, candidate))
      .map((candidate) => this.buildIntroduction(viewer, candidate, nowYear))
      .sort((left, right) => right.score - left.score)
      .slice(0, SUGGESTION_LIMIT);
  }

  async listRouteInvitations(
    installationId: string,
  ): Promise<RouteInvitationsList> {
    const viewer = await this.getProfile(installationId);
    const nowYear = new Date().getFullYear();
    const view = (record: RouteInvitationRecord, otherId: string) => {
      const other = this.state.profiles.find(
        (candidate) => candidate.id === otherId,
      );
      if (!other) return null;
      return {
        invitation: { ...record },
        counterpart: this.buildIntroduction(
          viewer,
          profileSchema.parse(other),
          nowYear,
        ),
      };
    };
    const incoming = this.state.routeInvitations
      .filter(
        (invitation) =>
          invitation.toInstallationId === installationId &&
          invitation.status === "pending",
      )
      .map((invitation) => view(invitation, invitation.fromInstallationId))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    const outgoing = this.state.routeInvitations
      .filter(
        (invitation) =>
          invitation.fromInstallationId === installationId &&
          invitation.status === "pending",
      )
      .map((invitation) => view(invitation, invitation.toInstallationId))
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    return {
      incoming,
      outgoing,
      weeklyRemaining: Math.max(
        0,
        WEEKLY_INVITATION_LIMIT - this.weeklyOutgoingCount(installationId),
      ),
    };
  }

  async createRouteInvitation(
    installationId: string,
    toInstallationId: string,
    message: string,
  ): Promise<RouteInvitation> {
    if (installationId === toInstallationId) {
      throw new DomainError("Je kunt jezelf niet uitnodigen.", 400);
    }
    if (await this.getPairForInstallation(installationId)) {
      throw new DomainError("Je hebt al een actieve route.", 409);
    }
    const target = this.state.profiles.find(
      (candidate) => candidate.id === toInstallationId,
    );
    if (!target) throw new DomainError("Deze persoon bestaat niet.", 404);
    if (this.blockedIdsFor(installationId).has(toInstallationId)) {
      throw new DomainError("Deze kennismaking is niet mogelijk.", 403);
    }
    const inPair = this.installationsInActivePair();
    if (inPair.has(toInstallationId)) {
      throw new DomainError("Deze persoon is al op route.", 409);
    }
    if (this.weeklyOutgoingCount(installationId) >= WEEKLY_INVITATION_LIMIT) {
      throw new DomainError(
        "Je kennismakingen voor deze week zijn op. Neem even rust.",
        429,
      );
    }
    if (this.weeklyIncomingCount(toInstallationId) >= WEEKLY_INVITATION_LIMIT) {
      throw new DomainError(
        "Deze persoon heeft deze week al genoeg kennismakingen.",
        409,
      );
    }
    const existing = this.state.routeInvitations.find(
      (invitation) =>
        invitation.status === "pending" &&
        ((invitation.fromInstallationId === installationId &&
          invitation.toInstallationId === toInstallationId) ||
          (invitation.fromInstallationId === toInstallationId &&
            invitation.toInstallationId === installationId)),
    );
    if (existing) {
      throw new DomainError("Er loopt al een kennismaking.", 409);
    }
    const record: RouteInvitationRecord = {
      id: randomUUID(),
      fromInstallationId: installationId,
      toInstallationId,
      message: message.trim(),
      status: "pending",
      pairId: null,
      createdAt: now(),
      respondedAt: null,
    };
    this.state.routeInvitations.push(record);
    await this.persist();
    return { ...record };
  }

  async respondToRouteInvitation(
    installationId: string,
    invitationId: string,
    accept: boolean,
  ): Promise<{ invitation: RouteInvitation; pairId: string | null }> {
    const record = this.state.routeInvitations.find(
      (invitation) => invitation.id === invitationId,
    );
    if (!record) throw new DomainError("Kennismaking niet gevonden.", 404);
    if (record.toInstallationId !== installationId) {
      throw new DomainError("Dit is niet jouw kennismaking.", 403);
    }
    if (record.status !== "pending") {
      throw new DomainError("Deze kennismaking is al beantwoord.", 409);
    }
    record.respondedAt = now();
    if (!accept) {
      record.status = "declined";
      await this.persist();
      return { invitation: { ...record }, pairId: null };
    }
    const inPair = this.installationsInActivePair();
    if (
      inPair.has(installationId) ||
      inPair.has(record.fromInstallationId)
    ) {
      throw new DomainError("Eén van jullie is al op route.", 409);
    }
    let code = createCode();
    while (this.state.pairs.some((pair) => pair.code === code)) {
      code = createCode();
    }
    const pair: PairRecord = {
      id: randomUUID(),
      code,
      createdAt: now(),
      disconnectedAt: null,
      memberIds: [record.fromInstallationId, record.toInstallationId],
      sharedSeconds: 0,
      bothOnlineSince: null,
      callUnlocked: false,
      callRequestedBy: null,
      callConsent: {},
      callCooldownUntil: null,
    };
    this.state.pairs.push(pair);
    record.status = "accepted";
    record.pairId = pair.id;
    // Overige openstaande kennismakingen van beiden vervallen (exclusiviteit).
    for (const other of this.state.routeInvitations) {
      if (other.id === record.id || other.status !== "pending") continue;
      const involved = [
        record.fromInstallationId,
        record.toInstallationId,
      ];
      if (
        involved.includes(other.fromInstallationId) ||
        involved.includes(other.toInstallationId)
      ) {
        other.status = "expired";
        other.respondedAt = now();
      }
    }
    await this.persist();
    return { invitation: { ...record }, pairId: pair.id };
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
      this.state.profiles.push(
        profileSchema.parse({
          id: developer.id,
          displayName: "Testpartner",
          bio: "Lokale computerpartner voor ontwikkeling.",
          avatarColor: "#8FD069",
          createdAt: now(),
          updatedAt: now(),
        }),
      );
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
                (run) =>
                  run.pairId === pair.id &&
                  run.status === "completed" &&
                  isDiscoveryGameId(run.gameId),
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

  async listRelationshipGameResults(
    installationId: string,
    pairId: string,
  ): Promise<RelationshipGameResult[]> {
    const pair = this.state.pairs.find(
      (candidate) =>
        candidate.id === pairId &&
        candidate.memberIds.includes(installationId),
    );
    if (!pair) {
      throw new DomainError("Relatiearchief niet gevonden.", 404);
    }
    return relationshipGameResults(
      this.state.gameRuns.filter(
        (run) => run.pairId === pairId && run.status === "completed",
      ),
    );
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
        (run.status === "lobby" || run.status === "active"),
    );
    if (active) {
      const readyInstallationIds = new Set(
        Array.isArray(active.state.readyInstallationIds)
          ? active.state.readyInstallationIds.filter(
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
      active.state = {
        ...active.state,
        readyInstallationIds: [...readyInstallationIds],
      };
      const allReady = pair.members.every((member) =>
        readyInstallationIds.has(member.installationId),
      );
      if (!wasReady || (allReady && active.status === "lobby")) {
        active.revision += 1;
      }
      if (allReady) active.status = "active";
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
      status: pair.developerMode ? "active" : "lobby",
      revision: 0,
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
        (candidate.status === "lobby" || candidate.status === "active"),
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
    const run = this.requirePairGameRun(installationId, runId);
    const duplicate = this.state.gameActions.find(
      (candidate) => candidate.id === action.id,
    );
    if (duplicate) {
      if (duplicate.gameRunId !== runId) {
        throw new DomainError("Deze actie-ID hoort bij een ander spel.", 409);
      }
      return structuredClone(run);
    }
    if (run.status !== "active") {
      throw new DomainError("Deze spelsessie is niet meer actief.", 409);
    }
    if (run.revision !== action.expectedRevision) {
      throw new DomainError("De spelstatus is inmiddels gewijzigd.", 409);
    }
    run.revision += 1;
    run.state = structuredClone(action.state);
    if (action.result !== undefined) {
      run.result = structuredClone(action.result);
    }
    if (action.status !== undefined) {
      run.status = action.status;
      run.completedAt = action.status === "completed" ? now() : null;
    }
    this.state.gameActions.push({
      id: action.id,
      gameRunId: runId,
      installationId,
      revision: run.revision,
      type: action.type,
      payload: structuredClone(action.payload),
      createdAt: now(),
    });
    await this.persist();
    if (action.status === "completed") {
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

  async getProfileInsights(
    installationId: string,
  ): Promise<ProfileInsights> {
    const pairs = this.state.pairs.filter((pair) =>
      pair.memberIds.includes(installationId),
    );
    const pairIds = new Set(pairs.map((pair) => pair.id));
    const currentPair = pairs.find((pair) => !pair.disconnectedAt) ?? null;
    const partnerId = currentPair?.memberIds.find(
      (memberId) => memberId !== installationId,
    );
    const partner = partnerId
      ? this.state.profiles.find((profile) => profile.id === partnerId)
      : null;
    return buildProfileInsights({
      installationId,
      completedRuns: this.state.gameRuns.filter(
        (run) =>
          run.status === "completed" &&
          (run.installationId === installationId ||
            Boolean(run.pairId && pairIds.has(run.pairId))),
      ),
      waiting: await this.getWaitingStats(installationId),
      currentPair: currentPair
        ? {
            id: currentPair.id,
            memberIds: currentPair.memberIds,
            partnerName: partner?.displayName ?? "Je reisgenoot",
          }
        : null,
      generatedAt: now(),
    });
  }

  async getPairTempo(pairId: string) {
    const out: Record<
      string,
      { madeWaitSeconds: number; madeWaitCount: number }
    > = {};
    const pair = this.state.pairs.find((p) => p.id === pairId);
    if (!pair) return out;
    for (const member of pair.memberIds) {
      out[member] = { madeWaitSeconds: 0, madeWaitCount: 0 };
    }
    for (const session of this.state.waitingSessions) {
      if (session.pairId !== pairId || !session.endedAt) continue;
      const slow = pair.memberIds.find((m) => m !== session.userId);
      if (!slow || !out[slow]) continue;
      const dur =
        (Date.parse(session.endedAt) - Date.parse(session.startedAt)) / 1000;
      if (dur > 0) {
        out[slow].madeWaitSeconds += Math.round(dur);
        out[slow].madeWaitCount += 1;
      }
    }
    return out;
  }

  async getWorldProgress(installationId: string): Promise<WorldProgress> {
    const relationships = this.state.pairs.filter((pair) =>
      pair.memberIds.includes(installationId),
    );
    const relationshipIds = relationships.map((pair) => pair.id);
    const completedGameIds = new Set(
      this.state.gameRuns
        .filter(
          (run) =>
            run.status === "completed" &&
            isDiscoveryGameId(run.gameId) &&
            (run.installationId === installationId ||
              (run.pairId ? relationshipIds.includes(run.pairId) : false)),
        )
        .map((run) => run.gameId),
    );
    const activeRuns = this.state.gameRuns
      .filter(
        (run) =>
          run.status !== "completed" &&
          isDiscoveryGameId(run.gameId) &&
          (run.installationId === installationId ||
            (run.pairId ? relationshipIds.includes(run.pairId) : false)),
      )
      .map((run) => ({ gameId: run.gameId, revision: run.revision }));
    const core = computeCoreProgress([...completedGameIds], activeRuns);
    const { completedGames, eligibleWorlds, nabijheid } = core;
    const developerMode = relationships.some(
      (pair) => pair.developerMode && !pair.disconnectedAt,
    );
    if (developerMode) {
      const allWorlds = [1, 2, 3, 4, 5];
      return {
        completedGames,
        eligibleWorlds: allWorlds,
        purchasedWorlds: allWorlds,
        unlockedWorlds: allWorlds,
        nabijheid,
      };
    }
    const account = await this.getAccountForInstallation(installationId);
    const purchasedWorlds = [
      1,
      ...this.state.worldPurchases
        .filter((purchase) => purchase.accountId === account?.id)
        .map((purchase) => purchase.world),
    ];
    return {
      completedGames,
      eligibleWorlds,
      purchasedWorlds: [...new Set(purchasedWorlds)].sort(),
      unlockedWorlds: eligibleWorlds.filter((world) =>
        purchasedWorlds.includes(world),
      ),
      nabijheid,
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
        .filter(
          (run) =>
            run.pairId === pair.id &&
            run.status === "completed" &&
            isDiscoveryGameId(run.gameId),
        )
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
    const run = this.state.gameRuns.find(
      (candidate) => candidate.id === gameRunId,
    );
    const pair = run?.pairId
      ? this.state.pairs.find(
          (candidate) =>
            candidate.id === run.pairId &&
            !candidate.disconnectedAt &&
            candidate.memberIds.includes(installationId),
        )
      : null;
    if (!run || !pair) {
      throw new DomainError("Spelsessie niet gevonden.", 404);
    }
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
      christianLayer:
        pair.memberIds.length === 2 &&
        profiles.every((profile) => profile.christianLayer),
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
}
