import type {
  GameRun,
  Message,
  Pair,
  Profile,
  WorldProgress,
} from "@slow-dating/contracts";

export interface InstallationRecord {
  id: string;
  secretHash: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface PairRecord {
  id: string;
  code: string;
  createdAt: string;
  memberIds: string[];
}

export interface DataState {
  installations: InstallationRecord[];
  profiles: Profile[];
  pairs: PairRecord[];
  messages: Message[];
  gameRuns: GameRun[];
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
  getProfile(installationId: string): Promise<Profile>;
  updateProfile(
    installationId: string,
    changes: Partial<Pick<Profile, "avatarColor" | "bio" | "displayName">>,
  ): Promise<Profile>;
  createPair(installationId: string): Promise<Pair>;
  joinPair(installationId: string, code: string): Promise<Pair>;
  getPairForInstallation(installationId: string): Promise<Pair | null>;
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
  updateGameRun(
    installationId: string,
    runId: string,
    changes: Partial<Pick<GameRun, "result" | "state" | "status">>,
  ): Promise<GameRun>;
  getWorldProgress(installationId: string): Promise<WorldProgress>;
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
