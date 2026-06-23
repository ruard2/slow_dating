import { z } from "zod";

const answerSchema = z.object({
  optionIndex: z.number().int().min(0).max(3).nullable(),
  answeredAt: z.string().datetime(),
});

export const kruispuntReactiesStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  usedCardIds: z.array(z.string()).default([]),
  roundNumber: z.number().int().min(1).max(5).default(1),
  roundCardIds: z.array(z.string()).max(10).default([]),
  currentCardIndex: z.number().int().min(0).max(10).default(0),
  cardStartedAt: z.string().datetime().nullable().default(null),
  answers: z
    .record(z.string(), z.record(z.string(), answerSchema))
    .default({}),
  repeatVotes: z.record(z.string(), z.enum(["again", "finish"])).default({}),
  revisitCardIds: z.record(z.string(), z.string()).default({}),
  finished: z.boolean().default(false),
});

export const kruispuntReactiesActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("kruispunt-reacties.ready"),
    actorId: z.string(),
    startedAt: z.string().datetime(),
  }),
  z.object({
    type: z.literal("kruispunt-reacties.answered"),
    actorId: z.string(),
    cardId: z.string(),
    optionIndex: z.number().int().min(0).max(3).nullable(),
    answeredAt: z.string().datetime(),
  }),
  z.object({
    type: z.literal("kruispunt-reacties.card.advanced"),
    actorId: z.string(),
    cardId: z.string(),
    startedAt: z.string().datetime(),
  }),
  z.object({
    type: z.literal("kruispunt-reacties.round.voted"),
    actorId: z.string(),
    vote: z.enum(["again", "finish"]),
    revisitCardId: z.string(),
    startedAt: z.string().datetime(),
  }),
  z.object({
    type: z.literal("kruispunt-reacties.game.completed"),
    actorId: z.string(),
  }),
]);

export type TimedAnswer = z.infer<typeof answerSchema>;
export type KruispuntReactiesState = z.infer<
  typeof kruispuntReactiesStateSchema
>;
export type KruispuntReactiesAction = z.infer<
  typeof kruispuntReactiesActionSchema
>;
