import { z } from "zod";

const boundaryLevelSchema = z.enum([
  "fine",
  "ask-first",
  "later",
  "not-okay",
]);
const tempoLevelSchema = z.enum(["slow", "calm", "average", "fast"]);

export const smallNoSchema = z.object({
  scenario: z.string().trim().min(1).max(160),
  phrase: z.string().trim().min(1).max(160),
});

export const smallNoResponseSchema = z.object({
  responseId: z.enum(["thank-you", "why-not", "meant-well", "withdraw"]),
  supportId: z.enum([
    "calm-acceptance",
    "no-explanation",
    "check-later",
    "stay-warm",
  ]),
});

export const grenzenTempoStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  boundaryAnswers: z
    .record(z.string(), z.record(z.string(), boundaryLevelSchema))
    .default({}),
  boundaryDiscussedIds: z.array(z.string()).default([]),
  tempoAnswers: z
    .record(z.string(), z.record(z.string(), tempoLevelSchema))
    .default({}),
  tempoDiscussedIds: z.array(z.string()).default([]),
  smallNos: z.record(z.string(), smallNoSchema).default({}),
  smallNoResponses: z
    .record(z.string(), smallNoResponseSchema)
    .default({}),
});

export const grenzenTempoActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("grenzen-tempo.boundaries.submitted"),
    actorId: z.string(),
    answers: z.record(z.string(), boundaryLevelSchema),
  }),
  z.object({
    type: z.literal("grenzen-tempo.boundaries.discussed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("grenzen-tempo.tempo.submitted"),
    actorId: z.string(),
    answers: z.record(z.string(), tempoLevelSchema),
  }),
  z.object({
    type: z.literal("grenzen-tempo.tempo.discussed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("grenzen-tempo.small-no.submitted"),
    actorId: z.string(),
    exercise: smallNoSchema,
  }),
  z.object({
    type: z.literal("grenzen-tempo.small-no.responded"),
    actorId: z.string(),
    response: smallNoResponseSchema,
  }),
  z.object({
    type: z.literal("grenzen-tempo.game.completed"),
    actorId: z.string(),
  }),
]);

export type BoundaryLevel = z.infer<typeof boundaryLevelSchema>;
export type TempoLevel = z.infer<typeof tempoLevelSchema>;
export type SmallNo = z.infer<typeof smallNoSchema>;
export type SmallNoResponse = z.infer<typeof smallNoResponseSchema>;
export type GrenzenTempoState = z.infer<typeof grenzenTempoStateSchema>;
export type GrenzenTempoAction = z.infer<typeof grenzenTempoActionSchema>;

