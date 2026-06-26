import { z } from "zod";

export const stilleVijverChoiceSchema = z.object({
  modus: z.enum(["woorden", "beelden"]),
  keuze: z.array(z.string()).max(3).default([]),
});

export const stilleVijverStateSchema = z.object({
  schemaVersion: z.literal(1),
  choiceByPlayer: z
    .record(z.string(), stilleVijverChoiceSchema)
    .default({}),
  reflectieByPlayer: z
    .record(z.string(), z.string())
    .default({}),
  completedInstallationIds: z.array(z.string()).default([]),
});

export type StilleVijverChoice = z.infer<typeof stilleVijverChoiceSchema>;
export type StilleVijverState = z.infer<typeof stilleVijverStateSchema>;

const actorBase = z.object({ actorId: z.string() });

export const stilleVijverActionSchema = z.discriminatedUnion("type", [
  actorBase.extend({
    type: z.literal("stille-vijver.choice.submitted"),
    modus: z.enum(["woorden", "beelden"]),
    keuze: z.array(z.string()).length(3),
  }),
  actorBase.extend({
    type: z.literal("stille-vijver.reflectie.submitted"),
    tekst: z.string(),
  }),
  actorBase.extend({
    type: z.literal("stille-vijver.game.completed"),
  }),
]);

export type StilleVijverAction = z.infer<typeof stilleVijverActionSchema>;
