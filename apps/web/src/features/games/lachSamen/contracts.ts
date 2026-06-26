import { z } from "zod";

export const lachSamenStateSchema = z.object({
  schemaVersion: z.literal(1),
  questionSeed: z.number().int().default(0),
  answersByPlayer: z.record(z.string(), z.array(z.enum(["a", "b"]))).default({}),
  completedInstallationIds: z.array(z.string()).default([]),
});

export type LachSamenState = z.infer<typeof lachSamenStateSchema>;

const actorBase = z.object({ actorId: z.string() });

export const lachSamenActionSchema = z.discriminatedUnion("type", [
  actorBase.extend({
    type: z.literal("lach-samen.answer.submitted"),
    qIdx: z.number().int(),
    choice: z.enum(["a", "b"]),
  }),
  actorBase.extend({
    type: z.literal("lach-samen.game.completed"),
  }),
]);

export type LachSamenAction = z.infer<typeof lachSamenActionSchema>;
