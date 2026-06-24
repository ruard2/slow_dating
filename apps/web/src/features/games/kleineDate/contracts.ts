import { z } from "zod";

export const placedDateObjectSchema = z.object({
  objectId: z.string(),
  actorId: z.string(),
  turn: z.number().int().nonnegative(),
  placedAt: z.string(),
});

export const kleineDateStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  selections: z.array(placedDateObjectSchema).default([]),
  summary: z.string().default(""),
  summaryGeneratedBy: z.string().nullable().default(null),
  completedIds: z.array(z.string()).default([]),
});

export const kleineDateActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("kleine-date.object.placed"),
    actorId: z.string(),
    objectId: z.string(),
  }),
  z.object({
    type: z.literal("kleine-date.object.removed"),
    actorId: z.string(),
    objectId: z.string(),
  }),
  z.object({
    type: z.literal("kleine-date.summary.generated"),
    actorId: z.string(),
    summary: z.string().min(1).max(900),
  }),
  z.object({ type: z.literal("kleine-date.game.completed"), actorId: z.string() }),
  z.object({ type: z.literal("kleine-date.game.replayed"), actorId: z.string() }),
]);

export type PlacedDateObject = z.infer<typeof placedDateObjectSchema>;
export type KleineDateState = z.infer<typeof kleineDateStateSchema>;
export type KleineDateAction = z.infer<typeof kleineDateActionSchema>;
