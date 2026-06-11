import type {
  Account,
  CallAccess,
  GameRun,
  Message,
  Pair,
  Profile,
  RelationshipArchive,
  WorldProgress,
} from "@slow-dating/contracts";

export interface InstallationRecord {
  id: string;
  secretHash: string;
  accountId?: string | null;
  createdAt: string;
  lastSeenAt: string;
}

export interface AccountRecord extends Account {
  passwordHash: string;
  primaryInstallationId: string;
}

export interface AuthTokenRecord {
  id: string;
  accountId: string;
  type: "refresh" | "verify_email" | "password_reset";
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
}

export interface PairRecord {
  id: string;
  code: string;
  createdAt: string;
  disconnectedAt: string | null;
  memberIds: string[];
  developerMode?: boolean;
  sharedSeconds?: number;
  bothOnlineSince?: string | null;
  callUnlocked?: boolean;
  callRequestedBy?: string | null;
  callConsent?: Record<string, "yes" | "no" | null>;
  callCooldownUntil?: string | null;
}

export interface DataState {
  installations: InstallationRecord[];
  accounts: AccountRecord[];
  authTokens: AuthTokenRecord[];
  profiles: Profile[];
  pairs: PairRecord[];
  messages: Message[];
  gameRuns: GameRun[];
  worldPurchases: Array<{
    id: string;
    accountId: string;
    world: number;
    purchasedAt: string;
  }>;
  mailOutbox: Array<{
    id: string;
    to: string;
    type: "verify_email" | "password_reset";
    token: string;
    createdAt: string;
  }>;
  processedEventIds: string[];
  legacyArchive?: {
    importedAt: string;
    profiles: unknown;
    callingStates: unknown;
    coupleProgress: unknown;
  };
}

export interface AppRepository {
  initialize(): Promise<void>;
  findOrCreateInstallation(secretHash: string): Promise<InstallationRecord>;
  getInstallation(installationId: string): Promise<InstallationRecord>;
  createAccount(
    installationId: string,
    email: string,
    passwordHash: string,
    displayName: string,
  ): Promise<AccountRecord>;
  getAccount(accountId: string): Promise<AccountRecord>;
  findAccountByEmail(email: string): Promise<AccountRecord | null>;
  getAccountForInstallation(installationId: string): Promise<AccountRecord | null>;
  markEmailVerified(accountId: string): Promise<void>;
  updateAccountPassword(accountId: string, passwordHash: string): Promise<void>;
  createAuthToken(
    accountId: string,
    type: AuthTokenRecord["type"],
    tokenHash: string,
    expiresAt: string,
  ): Promise<AuthTokenRecord>;
  consumeAuthToken(
    type: AuthTokenRecord["type"],
    tokenHash: string,
  ): Promise<AuthTokenRecord | null>;
  revokeRefreshTokens(accountId: string): Promise<void>;
  queueMail(
    to: string,
    type: "verify_email" | "password_reset",
    token: string,
  ): Promise<void>;
  listDevelopmentMail(): Promise<DataState["mailOutbox"]>;
  getProfile(installationId: string): Promise<Profile>;
  updateProfile(
    installationId: string,
    changes: Partial<Pick<Profile, "avatarColor" | "bio" | "displayName">>,
  ): Promise<Profile>;
  createPair(installationId: string): Promise<Pair>;
  activateDeveloperPair(installationId: string): Promise<Pair>;
  joinPair(installationId: string, code: string): Promise<Pair>;
  getPairForInstallation(installationId: string): Promise<Pair | null>;
  listRelationshipArchives(
    installationId: string,
  ): Promise<RelationshipArchive[]>;
  listRelationshipMessages(
    installationId: string,
    pairId: string,
  ): Promise<Message[]>;
  disconnectPair(installationId: string): Promise<void>;
  listMessages(installationId: string): Promise<Message[]>;
  createMessage(
    installationId: string,
    clientId: string,
    text: string,
  ): Promise<Message>;
  createGameRun(
    installationId: string,
    input: Pick<GameRun, "gameId" | "mode" | "version">,
  ): Promise<GameRun>;
  getActiveGameRun(
    installationId: string,
    gameId: string,
  ): Promise<GameRun | null>;
  updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ): Promise<GameRun>;
  getWorldProgress(installationId: string): Promise<WorldProgress>;
  purchaseWorld(installationId: string, world: number): Promise<WorldProgress>;
  getCallAccess(installationId: string): Promise<CallAccess>;
  requestCallAccess(installationId: string): Promise<CallAccess>;
  answerCallAccess(
    installationId: string,
    answer: "yes" | "no",
  ): Promise<CallAccess>;
  relockCalls(installationId: string): Promise<CallAccess>;
  markPresence(
    installationId: string,
    online: boolean,
  ): Promise<void>;
  hasProcessedEvent(eventId: string): Promise<boolean>;
  markEventProcessed(eventId: string): Promise<void>;
}

export class DomainError extends Error {
  constructor(
    message: string,
    readonly statusCode = 400,
  ) {
    super(message);
  }
}
