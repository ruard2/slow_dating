import { z } from "zod";

export const stressmeterRoundSummarySchema = z.object({
  roundId: z.string(),
  actorId: z.string(),
  winner: z.enum(["self", "partner"]),
  durationMs: z.number().int().nonnegative(),
  selfHitsTaken: z.number().int().min(0).max(5),
  partnerHitsTaken: z.number().int().min(0).max(5),
  shotsFired: z.number().int().nonnegative(),
  powerUpsCollected: z.array(z.string()).default([]),
  questionsShown: z.array(z.string()).default([]),
  stormBursts: z.number().int().nonnegative().default(0),
  coopShipDefeated: z.boolean().default(false),
  coopHits: z.number().int().nonnegative().default(0),
  stressSignals: z.object({
    riskTaking: z.number().min(0).max(100),
    distanceKeeping: z.number().min(0).max(100),
    pressureBursts: z.number().int().nonnegative(),
  }),
});

export const stressmeterStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  roundsByPerson: z
    .record(z.string(), z.array(stressmeterRoundSummarySchema))
    .default({}),
  completedIds: z.array(z.string()).default([]),
});

export const stressmeterActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("stressmeter.round.finished"),
    actorId: z.string(),
    summary: stressmeterRoundSummarySchema,
  }),
  z.object({
    type: z.literal("stressmeter.game.completed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("stressmeter.game.replayed"),
    actorId: z.string(),
  }),
]);

export type StressmeterRoundSummary = z.infer<
  typeof stressmeterRoundSummarySchema
>;
export type StressmeterState = z.infer<typeof stressmeterStateSchema>;
export type StressmeterAction = z.infer<typeof stressmeterActionSchema>;
