import { z } from "zod";

export const taskOwnerSchema = z.enum(["self", "partner"]);
export const taskRhythmSchema = z.enum(["daily", "weekly", "sometimes"]);
export const taskPlacementSchema = z.object({
  owner: taskOwnerSchema,
  rhythm: taskRhythmSchema,
});

const ownershipDetailSchema = z.object({
  notice: taskOwnerSchema,
  plan: taskOwnerSchema,
  execute: taskOwnerSchema,
});

export const huishoudtafelStateSchema = z.object({
  schemaVersion: z.literal(2),
  readyInstallationIds: z.array(z.string()).default([]),
  placementsByPerson: z
    .record(z.string(), z.record(z.string(), taskPlacementSchema))
    .default({}),
  skippedByPerson: z
    .record(z.string(), z.array(z.string()))
    .default({}),
  submittedIds: z.array(z.string()).default([]),
  comparisonReactions: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  comparisonSubmittedIds: z.array(z.string()).default([]),
  ownershipDetailsByPerson: z
    .record(z.string(), z.record(z.string(), ownershipDetailSchema))
    .default({}),
  detailsSubmittedIds: z.array(z.string()).default([]),
  faithByPerson: z
    .record(
      z.string(),
      z.object({
        taskId: z.string(),
        risk: z.string(),
        reflection: z.string(),
      }),
    )
    .default({}),
  faithSubmittedIds: z.array(z.string()).default([]),
  experiments: z.array(
    z.object({
      taskId: z.string(),
      text: z.string(),
      proposedBy: z.string(),
    }),
  ).max(2).default([]),
  experimentConfirmedIds: z.array(z.string()).default([]),
});

export const huishoudtafelActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("huishoudtafel.task.placed"),
    actorId: z.string(),
    taskId: z.string(),
    owner: taskOwnerSchema,
    rhythm: taskRhythmSchema,
  }),
  z.object({
    type: z.literal("huishoudtafel.task.skipped"),
    actorId: z.string(),
    taskId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.distribution.submitted"),
    actorId: z.string(),
    requiredTaskIds: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal("huishoudtafel.comparison.reacted"),
    actorId: z.string(),
    taskId: z.string(),
    reaction: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.comparison.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.ownership.set"),
    actorId: z.string(),
    taskId: z.string(),
    part: z.enum(["notice", "plan", "execute"]),
    owner: taskOwnerSchema,
  }),
  z.object({
    type: z.literal("huishoudtafel.details.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.faith.submitted"),
    actorId: z.string(),
    taskId: z.string(),
    risk: z.string(),
    reflection: z.string().max(500),
  }),
  z.object({
    type: z.literal("huishoudtafel.experiments.proposed"),
    actorId: z.string(),
    experiments: z.array(z.object({
      taskId: z.string(),
      text: z.string().min(1).max(260),
    })).min(1).max(2),
  }),
  z.object({
    type: z.literal("huishoudtafel.experiments.confirmed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.game.completed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("huishoudtafel.game.replayed"),
    actorId: z.string(),
  }),
]);

export type TaskOwner = z.infer<typeof taskOwnerSchema>;
export type TaskRhythm = z.infer<typeof taskRhythmSchema>;
export type TaskPlacement = z.infer<typeof taskPlacementSchema>;
export type HuishoudtafelState = z.infer<typeof huishoudtafelStateSchema>;
export type HuishoudtafelAction = z.infer<typeof huishoudtafelActionSchema>;
