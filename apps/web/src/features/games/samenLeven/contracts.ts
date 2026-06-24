import { z } from "zod";

export const samenLevenStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  themeId: z.string().nullable().default(null),
  themeChoices: z.record(z.string(), z.string()).default({}),
  themeAttempt: z.number().int().nonnegative().default(0),
  selections: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  submittedIds: z.array(z.string()).default([]),
  discussionDoneIds: z.array(z.string()).default([]),
});

export const samenLevenActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("samen-leven.theme.selected"),
    actorId: z.string(),
    themeId: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.theme.retry"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.option.selected"),
    actorId: z.string(),
    promptId: z.string(),
    value: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.answers.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.discussion.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.game.completed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("samen-leven.game.replayed"),
    actorId: z.string(),
  }),
]);

export type SamenLevenState = z.infer<typeof samenLevenStateSchema>;
export type SamenLevenAction = z.infer<typeof samenLevenActionSchema>;
