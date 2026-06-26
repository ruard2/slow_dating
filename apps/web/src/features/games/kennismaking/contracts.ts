import { z } from "zod";

export const kennismakingStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  // Niveau (how long together / how well they know each other) per player
  duurByPlayer: z.record(z.string(), z.union([z.literal(1), z.literal(2), z.literal(3)])).default({}),
  kennisByPlayer: z.record(z.string(), z.union([z.literal(1), z.literal(2), z.literal(3)])).default({}),
  // Seeds for reproducible question shuffles (set on first use of each mode)
  kaartSeed: z.number().default(0),
  quizSeed: z.number().default(0),
  raadSeed: z.number().default(0),
  // Quiz mode state
  quizRound: z.number().int().default(0),
  // Quiz answers per player: { installationId → { round, eigen, raad }[] }
  quizAnswers: z.record(z.string(), z.array(z.object({
    round: z.number().int(),
    eigen: z.string(),
    raad: z.string(),
  }))).default({}),
  quizScores: z.record(z.string(), z.number()).default({}),
  // Raad mode state
  raadIdx: z.number().int().default(0),
  raadFirstAntwoorder: z.string().default(""),
  // raad answers: { idx, antwoord, gok }[]
  raadAnswers: z.array(z.object({
    idx: z.number().int(),
    antwoord: z.string(),
    antwoorderId: z.string(),
    gok: z.string().default(""),
  })).default([]),
  raadScore: z.number().int().default(0),
  // Game completion
  completedInstallationIds: z.array(z.string()).default([]),
});

export const kennismakingActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("kennismaking.niveau.set"),
    actorId: z.string(),
    duur: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    kennis: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  z.object({
    type: z.literal("kennismaking.kaart.started"),
    actorId: z.string(),
    seed: z.number(),
  }),
  z.object({
    type: z.literal("kennismaking.quiz.started"),
    actorId: z.string(),
    seed: z.number(),
  }),
  z.object({
    type: z.literal("kennismaking.quiz.answer.submitted"),
    actorId: z.string(),
    round: z.number().int(),
    eigen: z.string(),
    raad: z.string(),
  }),
  z.object({
    type: z.literal("kennismaking.quiz.score.updated"),
    actorId: z.string(),
    round: z.number().int(),
    mijGoed: z.boolean(),
    partnerGoed: z.boolean(),
  }),
  z.object({
    type: z.literal("kennismaking.quiz.next.round"),
    actorId: z.string(),
    round: z.number().int(),
  }),
  z.object({
    type: z.literal("kennismaking.raad.started"),
    actorId: z.string(),
    seed: z.number(),
    firstAntwoorderId: z.string(),
  }),
  z.object({
    type: z.literal("kennismaking.raad.antwoord.submitted"),
    actorId: z.string(),
    idx: z.number().int(),
    antwoord: z.string(),
  }),
  z.object({
    type: z.literal("kennismaking.raad.gok.submitted"),
    actorId: z.string(),
    idx: z.number().int(),
    gok: z.string(),
  }),
  z.object({
    type: z.literal("kennismaking.raad.score"),
    actorId: z.string(),
    idx: z.number().int(),
    raak: z.boolean(),
  }),
  z.object({
    type: z.literal("kennismaking.game.completed"),
    actorId: z.string(),
  }),
]);

export type KennismakingState = z.infer<typeof kennismakingStateSchema>;
export type KennismakingAction = z.infer<typeof kennismakingActionSchema>;
