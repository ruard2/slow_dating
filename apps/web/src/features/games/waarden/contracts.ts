import { z } from "zod";

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

export const waardenStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  selections: z.record(z.string(), z.array(valueIdSchema).max(3)).default({}),
  submittedInstallationIds: z.array(z.string()).default([]),
});

export const waardenResultSchema = z.object({
  schemaVersion: z.literal(1),
  selections: z.record(z.string(), z.array(valueIdSchema).length(3)),
  sharedValues: z.array(valueIdSchema),
  completedAt: z.string().datetime(),
});

export const waardenActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("waarden.value.toggled"),
    actorId: z.string().min(1),
    valueId: valueIdSchema,
  }),
  z.object({
    type: z.literal("waarden.selection.submitted"),
    actorId: z.string().min(1),
  }),
  z.object({
    type: z.literal("waarden.game.completed"),
    actorId: z.string().min(1),
  }),
]);

export type ValueId = z.infer<typeof valueIdSchema>;
export type WaardenState = z.infer<typeof waardenStateSchema>;
export type WaardenResult = z.infer<typeof waardenResultSchema>;
export type WaardenAction = z.infer<typeof waardenActionSchema>;
