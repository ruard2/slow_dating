import { z } from "zod";

const needIdSchema = z.enum([
  "safety",
  "time",
  "clarity",
  "gentleness",
  "closeness",
]);
const levelSchema = z.number().int().min(1).max(5);

export const opennessMixSchema = z.object({
  needs: z.record(needIdSchema, levelSchema),
  noise: z.enum(["interruptions", "haste", "advice", "tension", "uncertainty"]),
  invitation: z.enum(["walk", "quiet", "question", "side-by-side", "direct"]),
});

export const stilteruisjeStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  drafts: z.record(z.string(), opennessMixSchema.partial()).default({}),
  mixes: z.record(z.string(), opennessMixSchema).default({}),
  supportByActor: z
    .record(z.string(), z.enum(["listen", "slow", "check", "soften"]))
    .default({}),
  ritualReadyIds: z.array(z.string()).default([]),
  conversationDoneIds: z.array(z.string()).default([]),
});

export const stilteruisjeActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("stilteruisje.need.changed"),
    actorId: z.string(),
    needId: needIdSchema,
    level: levelSchema,
  }),
  z.object({
    type: z.literal("stilteruisje.noise.selected"),
    actorId: z.string(),
    noise: opennessMixSchema.shape.noise,
  }),
  z.object({
    type: z.literal("stilteruisje.invitation.selected"),
    actorId: z.string(),
    invitation: opennessMixSchema.shape.invitation,
  }),
  z.object({
    type: z.literal("stilteruisje.mix.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("stilteruisje.support.selected"),
    actorId: z.string(),
    support: z.enum(["listen", "slow", "check", "soften"]),
  }),
  z.object({
    type: z.literal("stilteruisje.ritual.ready"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("stilteruisje.conversation.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("stilteruisje.game.completed"),
    actorId: z.string(),
  }),
]);

export type OpennessMix = z.infer<typeof opennessMixSchema>;
export type StilteruisjeState = z.infer<typeof stilteruisjeStateSchema>;
export type StilteruisjeAction = z.infer<typeof stilteruisjeActionSchema>;
