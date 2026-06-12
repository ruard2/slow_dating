import { z } from "zod";

export const idSchema = z.string().uuid();

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.literal("api"),
  version: z.string().min(1),
  storage: z.enum(["local", "postgres"]),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const profileSchema = z.object({
  id: idSchema,
  displayName: z.string().trim().min(1).max(40),
  bio: z.string().trim().max(280),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Profile = z.infer<typeof profileSchema>;

export const accountSchema = z.object({
  id: idSchema,
  email: z.email(),
  emailVerified: z.boolean(),
  createdAt: z.string().datetime(),
});

export type Account = z.infer<typeof accountSchema>;

export const updateProfileSchema = profileSchema
  .pick({
    displayName: true,
    bio: true,
    avatarColor: true,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Geef minimaal één profielveld op.",
  });

export const guestSessionRequestSchema = z.object({
  installationSecret: z.string().min(32).max(256),
});

export const guestSessionSchema = z.object({
  accessToken: z.string().min(1),
  expiresAt: z.string().datetime(),
  installationId: idSchema,
  profile: profileSchema,
  account: accountSchema.nullable().default(null),
});

export type GuestSession = z.infer<typeof guestSessionSchema>;

const passwordSchema = z
  .string()
  .min(12)
  .max(128)
  .regex(/[a-z]/, "Gebruik minimaal één kleine letter.")
  .regex(/[A-Z]/, "Gebruik minimaal één hoofdletter.")
  .regex(/[0-9]/, "Gebruik minimaal één cijfer.");

export const registerAccountSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: passwordSchema,
  displayName: z.string().trim().min(1).max(40),
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export const requestPasswordResetSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const completePasswordResetSchema = z.object({
  token: z.string().min(32).max(512),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(32).max(512),
});

export const pairMemberSchema = z.object({
  installationId: idSchema,
  displayName: z.string().min(1),
  role: z.enum(["creator", "partner"]),
  online: z.boolean().default(false),
});

export const pairSchema = z.object({
  id: idSchema,
  code: z.string().regex(/^[A-HJ-KM-NP-Z2-9]{6}$/),
  developerMode: z.boolean().default(false),
  createdAt: z.string().datetime(),
  disconnectedAt: z.string().datetime().nullable().default(null),
  members: z.array(pairMemberSchema).max(2),
});

export type Pair = z.infer<typeof pairSchema>;

export const relationshipArchiveSchema = pairSchema.extend({
  messageCount: z.number().int().nonnegative(),
  completedGames: z.number().int().nonnegative(),
});

export type RelationshipArchive = z.infer<typeof relationshipArchiveSchema>;

export const joinPairSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-HJ-KM-NP-Z2-9]{6}$/),
});

export const messageSchema = z.object({
  id: idSchema,
  clientId: z.string().min(1).max(100),
  pairId: idSchema,
  senderInstallationId: idSchema,
  senderName: z.string().min(1),
  text: z.string().trim().min(1).max(2_000),
  sentAt: z.string().datetime(),
});

export const sendMessageSchema = messageSchema.pick({
  clientId: true,
  text: true,
});

export type Message = z.infer<typeof messageSchema>;

export const gameModeSchema = z.literal("couple");

export const gameRunSchema = z.object({
  id: idSchema,
  gameId: z.string().min(1),
  version: z.number().int().positive(),
  mode: gameModeSchema,
  pairId: idSchema.nullable(),
  installationId: idSchema,
  status: z.enum(["lobby", "active", "completed", "abandoned"]),
  revision: z.number().int().nonnegative(),
  state: z.record(z.string(), z.unknown()),
  result: z.record(z.string(), z.unknown()).nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export const createGameRunSchema = gameRunSchema.pick({
  gameId: true,
  version: true,
  mode: true,
});

export const updateGameRunSchema = z.object({
  state: z.record(z.string(), z.unknown()).optional(),
  result: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["active", "completed", "abandoned"]).optional(),
});

export type GameRun = z.infer<typeof gameRunSchema>;

export const gameActionRequestSchema = z.object({
  id: idSchema,
  expectedRevision: z.number().int().nonnegative(),
  type: z.string().min(1).max(100),
  payload: z.record(z.string(), z.unknown()).default({}),
  state: z.record(z.string(), z.unknown()),
  status: z.enum(["completed", "abandoned"]).optional(),
  result: z.record(z.string(), z.unknown()).optional(),
});

export type GameActionRequest = z.infer<typeof gameActionRequestSchema>;

export const activityCategorySchema = z.enum([
  "game",
  "waiting",
  "pair",
  "chat",
  "call",
  "profile",
  "world",
]);

export const activityEventSchema = z.object({
  id: idSchema,
  clientEventId: z.string().min(1).max(100),
  installationId: idSchema,
  pairId: idSchema.nullable(),
  gameRunId: idSchema.nullable(),
  gameId: z.string().min(1).max(100).nullable(),
  category: activityCategorySchema,
  type: z.string().min(1).max(100),
  payload: z.record(z.string(), z.unknown()),
  occurredAt: z.string().datetime(),
});

export const recordActivitySchema = z.object({
  clientEventId: z.string().min(1).max(100),
  category: activityCategorySchema,
  type: z.string().min(1).max(100),
  gameRunId: idSchema.optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export type ActivityEvent = z.infer<typeof activityEventSchema>;

export const worldProgressSchema = z.object({
  completedGames: z.number().int().nonnegative(),
  eligibleWorlds: z.array(z.number().int().min(1).max(5)),
  unlockedWorlds: z.array(z.number().int().min(1).max(5)),
  purchasedWorlds: z.array(z.number().int().min(1).max(5)),
});

export type WorldProgress = z.infer<typeof worldProgressSchema>;

export const waitingAnswerRequestSchema = z.object({
  gameRunId: idSchema,
  waitingGameId: z.string().min(1).max(100),
  answerId: z.string().min(1).max(100),
  answerLabel: z.string().min(1).max(200),
  shareLevel: z.enum(["private", "soft_share", "direct_share"]),
});

export const waitingSessionRequestSchema = z.object({
  gameRunId: idSchema,
});

export const waitingStatsSchema = z.object({
  totalWaitCount: z.number().int().nonnegative(),
  totalWaitSeconds: z.number().int().nonnegative(),
  totalGamesPlayed: z.number().int().nonnegative(),
  recentGameIds: z.array(z.string()),
  badges: z.array(z.string()),
});

export type WaitingStats = z.infer<typeof waitingStatsSchema>;

export const callAccessSchema = z.object({
  sharedSeconds: z.number().int().nonnegative(),
  messagesByMember: z.record(idSchema, z.number().int().nonnegative()),
  completedGames: z.number().int().nonnegative(),
  conditionsMet: z.boolean(),
  unlocked: z.boolean(),
  consentByMember: z.record(idSchema, z.enum(["yes", "no"]).nullable()),
  requestedBy: idSchema.nullable(),
  cooldownUntil: z.string().datetime().nullable(),
});

export type CallAccess = z.infer<typeof callAccessSchema>;

export const callConsentRequestSchema = z.object({
  answer: z.enum(["yes", "no"]),
  reason: z.string().trim().max(500).optional(),
});

export const realtimeEventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  version: z.number().int().positive(),
  pairId: z.string().min(1),
  gameRunId: z.string().min(1).optional(),
  sentAt: z.string().datetime(),
  payload: z.unknown(),
});

export interface RealtimeEvent<TPayload> {
  id: string;
  type: string;
  version: number;
  pairId: string;
  gameRunId?: string;
  sentAt: string;
  payload: TPayload;
}

export const realtimeClientEventSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("chat.send"),
    version: z.literal(1),
    payload: sendMessageSchema,
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("chat.typing"),
    version: z.literal(1),
    payload: z.object({ active: z.boolean() }),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("game.sync"),
    version: z.literal(1),
    payload: z.object({
      gameRunId: idSchema,
      state: z.record(z.string(), z.unknown()),
    }),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("game.state.updated"),
    version: z.literal(1),
    payload: z.object({
      gameRunId: idSchema,
      revision: z.number().int().nonnegative(),
    }),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("game.lobby.enter"),
    version: z.literal(1),
    payload: z.object({
      gameId: z.string().min(1),
      gameRunId: idSchema,
    }),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("call.signal"),
    version: z.literal(1),
    payload: z.object({
      signalType: z.enum(["offer", "answer", "ice", "hangup", "request", "accept", "decline"]),
      data: z.unknown().optional(),
    }),
  }),
]);

export type RealtimeClientEvent = z.infer<typeof realtimeClientEventSchema>;
