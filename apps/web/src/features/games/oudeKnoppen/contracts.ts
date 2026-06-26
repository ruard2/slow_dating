import { z } from "zod";

export const domeinIdSchema = z.enum([
  "gezien",
  "veilig",
  "vrijheid",
  "betrouwbaar",
  "eerlijk",
  "nabij",
]);
export const reactionIdSchema = z.enum([
  "fight",
  "fix",
  "please",
  "freeze",
  "explain",
  "withdraw",
]);
export const needIdSchema = z.enum([
  "erkenning",
  "veiligheid",
  "ruimte",
  "zekerheid",
  "waarheid",
  "nabijheid",
]);
export const protectionIdSchema = z.enum([
  "hard-worden",
  "oplossen",
  "aanpassen",
  "stilvallen",
  "uitleggen",
  "afstand",
]);

export const oudeKnoppenSelectionSchema = z.object({
  domainId: domeinIdSchema,
  caseId: z.string().min(1),
});

export const oudeKnoppenReflectionSchema = z.object({
  reactionId: reactionIdSchema,
  needId: needIdSchema,
  protectionId: protectionIdSchema,
  oldButtonName: z.string().trim().min(1).max(140),
  bodySignal: z.string().trim().min(1).max(180),
  memoryHint: z.string().trim().min(1).max(420),
});

export const oudeKnoppenRepairSchema = z.object({
  softSentence: z.string().trim().min(1).max(500),
  partnerHelp: z.string().trim().min(1).max(500),
  pauseSignal: z.string().trim().min(1).max(180),
  miniPractice: z.string().trim().min(1).max(500),
});

export const oudeKnoppenStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  introSeenIds: z.array(z.string()).default([]),
  selections: z.record(z.string(), oudeKnoppenSelectionSchema).default({}),
  reflections: z.record(z.string(), oudeKnoppenReflectionSchema).default({}),
  repairs: z.record(z.string(), oudeKnoppenRepairSchema).default({}),
});

export const oudeKnoppenActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("oude-knoppen.intro.seen"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("oude-knoppen.selection.submitted"),
    actorId: z.string(),
    selection: oudeKnoppenSelectionSchema,
  }),
  z.object({
    type: z.literal("oude-knoppen.reflection.submitted"),
    actorId: z.string(),
    reflection: oudeKnoppenReflectionSchema,
  }),
  z.object({
    type: z.literal("oude-knoppen.repair.submitted"),
    actorId: z.string(),
    repair: oudeKnoppenRepairSchema,
  }),
  z.object({
    type: z.literal("oude-knoppen.game.completed"),
    actorId: z.string(),
  }),
]);

export type OudeKnoppenSelection = z.infer<typeof oudeKnoppenSelectionSchema>;
export type OudeKnoppenReflection = z.infer<typeof oudeKnoppenReflectionSchema>;
export type OudeKnoppenRepair = z.infer<typeof oudeKnoppenRepairSchema>;
export type OudeKnoppenState = z.infer<typeof oudeKnoppenStateSchema>;
export type OudeKnoppenAction = z.infer<typeof oudeKnoppenActionSchema>;
