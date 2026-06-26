import { z } from "zod";

export const kleurIdSchema = z.enum(["R", "G", "Gr", "B"]);
export const stressRatingSchema = z.number().int().min(0).max(2);

export const kleurkompasExerciseSchema = z.object({
  phraseId: z.string().min(1),
  chosenColor: kleurIdSchema,
  ownReframe: z.string().trim().min(1).max(420),
  partnerNeedGuess: z.string().trim().min(1).max(420),
});

export const kleurkompasDeepeningSchema = z.object({
  ownQuestion: z.string().trim().min(1).max(420),
  ownAnswer: z.string().trim().min(1).max(700),
  heardWrongCardId: z.string().min(1),
  heardWrongReflection: z.string().trim().min(1).max(700),
  growthCard: z.string().trim().min(1).max(700),
  miniAgreement: z.string().trim().min(1).max(700),
});

export const kleurkompasStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  introSeenIds: z.array(z.string()).default([]),
  scenarioAnswers: z.record(z.string(), z.record(z.string(), kleurIdSchema)).default({}),
  stressRatings: z
    .record(z.string(), z.record(z.string(), stressRatingSchema))
    .default({}),
  exercises: z.record(z.string(), kleurkompasExerciseSchema).default({}),
  deepenings: z.record(z.string(), kleurkompasDeepeningSchema).default({}),
});

export const kleurkompasActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("kleurkompas.intro.seen"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("kleurkompas.scenarios.submitted"),
    actorId: z.string(),
    answers: z.record(z.string(), kleurIdSchema),
  }),
  z.object({
    type: z.literal("kleurkompas.stress.submitted"),
    actorId: z.string(),
    ratings: z.record(z.string(), stressRatingSchema),
  }),
  z.object({
    type: z.literal("kleurkompas.exercise.submitted"),
    actorId: z.string(),
    exercise: kleurkompasExerciseSchema,
  }),
  z.object({
    type: z.literal("kleurkompas.deepening.submitted"),
    actorId: z.string(),
    deepening: kleurkompasDeepeningSchema,
  }),
  z.object({
    type: z.literal("kleurkompas.game.completed"),
    actorId: z.string(),
  }),
]);

export type KleurId = z.infer<typeof kleurIdSchema>;
export type KleurkompasExercise = z.infer<typeof kleurkompasExerciseSchema>;
export type KleurkompasDeepening = z.infer<typeof kleurkompasDeepeningSchema>;
export type KleurkompasState = z.infer<typeof kleurkompasStateSchema>;
export type KleurkompasAction = z.infer<typeof kleurkompasActionSchema>;
