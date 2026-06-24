import { z } from "zod";

import { compassPillars } from "./content";

const pillarIdSchema = z.enum(
  compassPillars.map((pillar) => pillar.id) as [
    (typeof compassPillars)[number]["id"],
    ...(typeof compassPillars)[number]["id"][],
  ],
);

export const compassSchema = z.record(pillarIdSchema, z.number().int().min(0).max(25));

export const scenarioAnswerSchema = z.object({
  choice: z.string(),
  need: z.string(),
  fear: z.string(),
  trust: z.number().int().min(1).max(5),
});

export const commitmentProposalSchema = z.object({
  text: z.string().trim().min(1).max(320),
  proposedBy: z.string(),
  revision: z.number().int().nonnegative(),
});

export const geldbrugStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  compassByPerson: z.record(z.string(), compassSchema).default({}),
  reflectionsByPerson: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  compassSubmittedIds: z.array(z.string()).default([]),
  scenarioIds: z.array(z.string()).default([]),
  scenarioAnswers: z
    .record(z.string(), z.record(z.string(), scenarioAnswerSchema))
    .default({}),
  scenariosSubmittedIds: z.array(z.string()).default([]),
  scalesByPerson: z
    .record(z.string(), z.record(z.string(), z.number().int().min(0).max(100)))
    .default({}),
  scalesSubmittedIds: z.array(z.string()).default([]),
  christianReflections: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  christianSubmittedIds: z.array(z.string()).default([]),
  commitment: commitmentProposalSchema.nullable().default(null),
  commitmentConfirmedIds: z.array(z.string()).default([]),
});

export const geldbrugActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("geldbrug.session.started"),
    actorId: z.string(),
    scenarioIds: z.array(z.string()).min(5).max(6),
  }),
  z.object({
    type: z.literal("geldbrug.compass.coin.moved"),
    actorId: z.string(),
    pillarId: pillarIdSchema,
    delta: z.union([z.literal(-1), z.literal(1)]),
  }),
  z.object({
    type: z.literal("geldbrug.reflection.answered"),
    actorId: z.string(),
    promptId: z.string(),
    value: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.compass.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.scenario.answered"),
    actorId: z.string(),
    scenarioId: z.string(),
    answer: scenarioAnswerSchema,
  }),
  z.object({
    type: z.literal("geldbrug.scenarios.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.scale.changed"),
    actorId: z.string(),
    scaleId: z.string(),
    value: z.number().int().min(0).max(100),
  }),
  z.object({
    type: z.literal("geldbrug.scales.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.christian.answered"),
    actorId: z.string(),
    questionId: z.string(),
    value: z.string().trim().max(500),
  }),
  z.object({
    type: z.literal("geldbrug.christian.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.commitment.proposed"),
    actorId: z.string(),
    text: z.string().trim().min(1).max(320),
  }),
  z.object({
    type: z.literal("geldbrug.commitment.confirmed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.game.completed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("geldbrug.game.replayed"),
    actorId: z.string(),
  }),
]);

export type GeldbrugState = z.infer<typeof geldbrugStateSchema>;
export type GeldbrugAction = z.infer<typeof geldbrugActionSchema>;
export type ScenarioAnswer = z.infer<typeof scenarioAnswerSchema>;

