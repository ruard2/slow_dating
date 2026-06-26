import { z } from "zod";

export const kwaliteitenSelectionSchema = z.object({
  kwaliteiten: z.array(z.string()).max(2).default([]),
  allergie: z.string().nullable().default(null),
});

export const kwaliteitenStateSchema = z.object({
  schemaVersion: z.literal(1),
  selectionByPlayer: z
    .record(z.string(), kwaliteitenSelectionSchema)
    .default({}),
  questionsByPlayer: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  completedInstallationIds: z.array(z.string()).default([]),
});

export type KwaliteitenSelection = z.infer<typeof kwaliteitenSelectionSchema>;
export type KwaliteitenState = z.infer<typeof kwaliteitenStateSchema>;

const actorBase = z.object({ actorId: z.string() });

export const kwaliteitenActionSchema = z.discriminatedUnion("type", [
  actorBase.extend({
    type: z.literal("kwaliteiten.selection.submitted"),
    kwaliteiten: z.array(z.string()).min(1).max(2),
    allergie: z.string(),
  }),
  actorBase.extend({
    type: z.literal("kwaliteiten.questions.submitted"),
    questions: z.record(z.string(), z.string()),
  }),
  actorBase.extend({
    type: z.literal("kwaliteiten.game.completed"),
  }),
]);

export type KwaliteitenAction = z.infer<typeof kwaliteitenActionSchema>;
