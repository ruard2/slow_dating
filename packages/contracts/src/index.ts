import { z } from "zod";

export const idSchema = z.string().uuid();

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.literal("api"),
  version: z.string().min(1),
  storage: z.enum(["local", "postgres"]),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const relationIntentionSchema = z.enum([
  "verkennen",
  "serieus",
  "vriendschap",
]);
export type RelationIntention = z.infer<typeof relationIntentionSchema>;

export const lifeStageSchema = z.enum([
  "kinderwens",
  "ooit-misschien",
  "geen-kinderwens",
  "heeft-kinderen",
]);
export type LifeStage = z.infer<typeof lifeStageSchema>;

export const profileSchema = z.object({
  id: idSchema,
  displayName: z.string().trim().min(1).max(40),
  bio: z.string().trim().max(280),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // Dating-profiel (opgeslagen in Profile.legacyData; geen migratie nodig).
  photoUrl: z.string().trim().max(600).nullable().default(null),
  birthYear: z.number().int().min(1900).max(2100).nullable().default(null),
  city: z.string().trim().max(80).default(""),
  interests: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  coreValues: z.array(z.string().trim().min(1).max(60)).max(8).default([]),
  relationIntention: relationIntentionSchema.nullable().default(null),
  lifeStage: lifeStageSchema.nullable().default(null),
  prefAgeMin: z.number().int().min(18).max(120).nullable().default(null),
  prefAgeMax: z.number().int().min(18).max(120).nullable().default(null),
  prefMaxDistanceKm: z.number().int().min(1).max(2000).nullable().default(null),
  christianLayer: z.boolean().default(false),
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
    photoUrl: true,
    birthYear: true,
    city: true,
    interests: true,
    coreValues: true,
    relationIntention: true,
    lifeStage: true,
    prefAgeMin: true,
    prefAgeMax: true,
    prefMaxDistanceKm: true,
    christianLayer: true,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Geef minimaal één profielveld op.",
  });

export type ProfileUpdate = z.infer<typeof updateProfileSchema>;

// --- Slow-dating kennismakingen (§5A) ---
export const introductionSchema = z.object({
  installationId: z.string().min(1),
  profile: profileSchema,
  score: z.number().min(0).max(1),
  reasons: z.array(z.string()),
});
export type Introduction = z.infer<typeof introductionSchema>;

export const routeInvitationStatusSchema = z.enum([
  "pending",
  "accepted",
  "declined",
  "expired",
]);
export type RouteInvitationStatus = z.infer<typeof routeInvitationStatusSchema>;

export const routeInvitationSchema = z.object({
  id: idSchema,
  fromInstallationId: z.string().min(1),
  toInstallationId: z.string().min(1),
  message: z.string(),
  status: routeInvitationStatusSchema,
  pairId: idSchema.nullable(),
  createdAt: z.string().datetime(),
  respondedAt: z.string().datetime().nullable(),
});
export type RouteInvitation = z.infer<typeof routeInvitationSchema>;

export const routeInvitationViewSchema = z.object({
  invitation: routeInvitationSchema,
  counterpart: introductionSchema,
});
export type RouteInvitationView = z.infer<typeof routeInvitationViewSchema>;

export const routeInvitationsListSchema = z.object({
  incoming: z.array(routeInvitationViewSchema),
  outgoing: z.array(routeInvitationViewSchema),
  weeklyRemaining: z.number().int().nonnegative(),
});
export type RouteInvitationsList = z.infer<typeof routeInvitationsListSchema>;

export const createRouteInvitationSchema = z.object({
  toInstallationId: z.string().min(1),
  message: z.string().trim().max(400).default(""),
});

export const respondRouteInvitationSchema = z.object({
  accept: z.boolean(),
});

export const respondRouteInvitationResultSchema = z.object({
  invitation: routeInvitationSchema,
  pairId: idSchema.nullable(),
});
export type RespondRouteInvitationResult = z.infer<
  typeof respondRouteInvitationResultSchema
>;

// --- Veiligheid: blokkeren & rapporteren ---
export const reportReasonSchema = z.enum([
  "ongepast",
  "nep-profiel",
  "grensoverschrijdend",
  "spam",
  "anders",
]);
export type ReportReason = z.infer<typeof reportReasonSchema>;

export const createBlockSchema = z.object({
  installationId: z.string().min(1),
});

export const createReportSchema = z.object({
  installationId: z.string().min(1),
  reason: reportReasonSchema,
  note: z.string().trim().max(600).default(""),
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
  // Christelijke verdiepingslaag: alleen actief als beide partners die kozen.
  christianLayer: z.boolean().default(false),
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

export const valueIdSchema = z.enum([
  "eerlijkheid",
  "trouw",
  "familie",
  "humor",
  "respect",
  "avontuur",
  "geloof",
  "warmte",
  "vrijheid",
  "groei",
  "rust",
  "vriendschap",
  "ambitie",
  "verbinding",
  "dankbaarheid",
  "creativiteit",
]);

export type ValueId = z.infer<typeof valueIdSchema>;

export const waardenResultSchema = z.object({
  schemaVersion: z.literal(1),
  selections: z.record(idSchema, z.array(valueIdSchema).length(3)),
  sharedValues: z.array(valueIdSchema),
  completedAt: z.string().datetime(),
});

export type WaardenResult = z.infer<typeof waardenResultSchema>;

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

export const nabijheidSchema = z.object({
  fraction: z.number().min(0).max(1),
  growthLines: z.literal(9),
  // Interne groeilijnen (onder de ene zichtbare balk): aantal afgeronde
  // discovery-spellen per soort groei.
  lines: z.object({
    kennis: z.number().int().nonnegative(),
    vertrouwen: z.number().int().nonnegative(),
    zorg: z.number().int().nonnegative(),
    richting: z.number().int().nonnegative(),
  }),
});

export type Nabijheid = z.infer<typeof nabijheidSchema>;

export const worldProgressSchema = z.object({
  completedGames: z.number().int().nonnegative(),
  eligibleWorlds: z.array(z.number().int().min(1).max(5)),
  unlockedWorlds: z.array(z.number().int().min(1).max(5)),
  purchasedWorlds: z.array(z.number().int().min(1).max(5)),
  nabijheid: nabijheidSchema,
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

export const resultProvenanceSchema = z.object({
  gameRunId: idSchema,
  gameId: z.string().min(1),
  gameVersion: z.number().int().positive(),
  resultSchemaVersion: z.number().int().positive(),
  pairId: idSchema.nullable(),
  completedAt: z.string().datetime(),
});

export type ResultProvenance = z.infer<typeof resultProvenanceSchema>;

export const valueInsightSchema = z.object({
  valueId: valueIdSchema,
  occurrences: z.number().int().positive(),
  lastSeenAt: z.string().datetime(),
  sources: z.array(resultProvenanceSchema).min(1),
});

export const relationshipInsightsSchema = z.object({
  pairId: idSchema,
  partnerName: z.string().min(1),
  completedRuns: z.number().int().nonnegative(),
  sharedValues: z.array(valueIdSchema),
  differingValues: z.array(valueIdSchema),
  provenance: z.array(resultProvenanceSchema),
});

export type RelationshipInsights = z.infer<typeof relationshipInsightsSchema>;

export const profileEvidenceSchema = z.object({
  id: z.string().min(1),
  sourceGameId: z.string().min(1),
  sourceGameTitle: z.string().min(1),
  sourceRunId: idSchema,
  observedAt: z.string().datetime(),
  label: z.string().min(1),
});

export type ProfileEvidence = z.infer<typeof profileEvidenceSchema>;

export const profileNarrativeCardSchema = z.object({
  id: z.string().min(1),
  kind: z.enum([
    "portrait",
    "direction",
    "connection",
    "partner-view",
    "shared",
    "difference",
    "surprise",
    "challenge",
    "conversation",
    "unknown",
  ]),
  scope: z.enum(["personal", "relationship"]),
  title: z.string().min(1),
  body: z.string().min(1),
  confidence: z.enum(["observation", "pattern", "strong"]),
  evidence: z.array(profileEvidenceSchema),
  chatPrompt: z.string().min(1).optional(),
  isNew: z.boolean(),
});

export type ProfileNarrativeCard = z.infer<
  typeof profileNarrativeCardSchema
>;

export const profileTextBlockSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  evidence: z.array(profileEvidenceSchema).default([]),
});

export const profilePersonBlockSchema = z.object({
  personId: idSchema,
  label: z.string().min(1),
  profile: z.string().min(1),
  strengths: z.array(z.string().min(1)).default([]),
  watchouts: z.array(z.string().min(1)).default([]),
  evidence: z.array(profileEvidenceSchema).default([]),
});

export const profileConversationCardSchema = z.object({
  title: z.string().min(1),
  question: z.string().min(1),
  whyThisMatters: z.string().min(1).optional(),
  evidence: z.array(profileEvidenceSchema).default([]),
});

export const profileGameAppendixSchema = z.object({
  gameId: z.string().min(1),
  gameTitle: z.string().min(1),
  completedAt: z.string().datetime(),
  summary: z.string().min(1),
  result: z.record(z.string(), z.unknown()),
});

export const profileDataCoverageSchema = z.object({
  requiredGames: z.number().int().positive(),
  completedGameCount: z.number().int().nonnegative(),
  gamesUsed: z.array(z.string().min(1)),
  missingGames: z.array(z.string().min(1)),
});

export type ProfileTextBlock = z.infer<typeof profileTextBlockSchema>;
export type ProfilePersonBlock = z.infer<typeof profilePersonBlockSchema>;
export type ProfileConversationCard = z.infer<
  typeof profileConversationCardSchema
>;
export type ProfileGameAppendix = z.infer<typeof profileGameAppendixSchema>;
export type ProfileDataCoverage = z.infer<typeof profileDataCoverageSchema>;

export const profileChapterSchema = z.object({
  world: z.number().int().min(1).max(5),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  available: z.boolean(),
  status: z.enum(["locked", "provisional", "complete"]),
  requiredGames: z.number().int().positive(),
  completedGameIds: z.array(z.string().min(1)),
  completedGameCount: z.number().int().nonnegative(),
  generatedAt: z.string().datetime(),
  cards: z.array(profileNarrativeCardSchema),
  overviewSummary: z.string().min(1).optional(),
  coupleImage: z.string().min(1).optional(),
  personProfiles: z.array(profilePersonBlockSchema).optional(),
  relationshipStrengths: z.array(profileTextBlockSchema).optional(),
  relationshipChallenges: z.array(profileTextBlockSchema).optional(),
  relaxationChances: z.array(profileTextBlockSchema).optional(),
  practicalTips: z.array(profileTextBlockSchema).optional(),
  conversationCards: z.array(profileConversationCardSchema).optional(),
  gameResultAppendix: z.array(profileGameAppendixSchema).optional(),
  dataCoverage: profileDataCoverageSchema.optional(),
});

export type ProfileChapter = z.infer<typeof profileChapterSchema>;

export const profileInsightsSchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string().datetime(),
  personal: z.object({
    completedRuns: z.number().int().nonnegative(),
    values: z.array(valueInsightSchema),
    waiting: waitingStatsSchema,
    provenance: z.array(resultProvenanceSchema),
  }),
  currentRelationship: relationshipInsightsSchema.nullable(),
  chapters: z.array(profileChapterSchema),
});

export type ProfileInsights = z.infer<typeof profileInsightsSchema>;

export const relationshipGameResultSchema = z.object({
  provenance: resultProvenanceSchema,
  result: z.record(z.string(), z.unknown()),
});

export type RelationshipGameResult = z.infer<
  typeof relationshipGameResultSchema
>;

export const profileDataExportSchema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string().datetime(),
  profile: profileSchema,
  insights: profileInsightsSchema,
  currentRelationship: z
    .object({
      pair: pairSchema,
      messages: z.array(messageSchema),
      results: z.array(relationshipGameResultSchema),
    })
    .nullable(),
  relationships: z.array(
    z.object({
      archive: relationshipArchiveSchema,
      messages: z.array(messageSchema),
      results: z.array(relationshipGameResultSchema),
    }),
  ),
  activity: z.array(activityEventSchema),
});

export type ProfileDataExport = z.infer<typeof profileDataExportSchema>;

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
