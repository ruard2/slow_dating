import { z } from "zod";

export const taskCategorySchema = z.enum(["enjoy", "draining", "avoid"]);

export const taskDistributionSchema = z.record(
  z.string(),
  taskCategorySchema,
);

export const huishoudtafelStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  distributions: z.record(z.string(), taskDistributionSchema).default({}),
  discussionDoneIds: z.array(z.string()).default([]),
});

export const huishoudtafelActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("huishoudtafel.task.categorized"),
    actorId: z.string(),
    taskId: z.string(),
    category: taskCategorySchema,
  }),
  z.object({
    type: z.literal("huishoudtafel.distribution.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.discussion.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.game.completed"),
    actorId: z.string(),
  }),
]);

export type TaskCategory = z.infer<typeof taskCategorySchema>;
export type TaskDistribution = z.infer<typeof taskDistributionSchema>;
export type HuishoudtafelState = z.infer<typeof huishoudtafelStateSchema>;
export type HuishoudtafelAction = z.infer<typeof huishoudtafelActionSchema>;