import { z } from "zod";

export const oudeEikPortraitSchema = z.object({
  atmosphere: z.enum(["warm", "busy", "quiet", "careful", "unpredictable", "independent"]),
  message: z.enum(["be-strong", "keep-peace", "perform", "do-not-burden", "stay-close", "be-yourself"]),
  role: z.enum(["carer", "peacemaker", "achiever", "observer", "rebel", "connector"]),
  response: z.enum(["pursue", "withdraw", "solve", "please", "defend", "freeze"]),
  need: z.enum(["reassurance", "space", "clarity", "gentleness", "recognition", "reliability"]),
  keep: z.string().trim().min(1).max(180),
  change: z.string().trim().min(1).max(180),
});

export const oudeEikStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  portraits: z.record(z.string(), oudeEikPortraitSchema).default({}),
  understoodIds: z.array(z.string()).default([]),
  conversationDoneIds: z.array(z.string()).default([]),
});

export const oudeEikActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("oude-eik.portrait.submitted"),
    actorId: z.string(),
    portrait: oudeEikPortraitSchema,
  }),
  z.object({
    type: z.literal("oude-eik.understood"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("oude-eik.conversation.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("oude-eik.game.completed"),
    actorId: z.string(),
  }),
]);

export type OudeEikPortrait = z.infer<typeof oudeEikPortraitSchema>;
export type OudeEikState = z.infer<typeof oudeEikStateSchema>;
export type OudeEikAction = z.infer<typeof oudeEikActionSchema>;
