import { z } from "zod";

const profileSchema = z.object({
  qualities: z.array(z.string().min(1)).length(2),
  allergy: z.string().min(1),
});

const quadrantSchema = z.object({
  quality: z.string().min(1),
  pitfall: z.string().min(1),
  challenge: z.string().min(1),
  allergy: z.string().min(1),
});

export const kernkwadrantenStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  profiles: z.record(z.string(), profileSchema).default({}),
  explanationReadyIds: z.array(z.string()).default([]),
  currentRound: z.number().int().min(0).max(3).default(0),
  drafts: z.record(z.string(), z.record(z.string(), z.string())).default({}),
  rounds: z.array(z.record(z.string(), quadrantSchema)).default([{}, {}, {}]),
  discussedByRound: z.array(z.array(z.string())).default([[], [], []]),
});

export const kernkwadrantenActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("kernkwadranten.profile.confirmed"),
    actorId: z.string(),
    qualities: z.array(z.string()).length(2),
    allergy: z.string(),
  }),
  z.object({
    type: z.literal("kernkwadranten.explanation.ready"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("kernkwadranten.choice.selected"),
    actorId: z.string(),
    field: z.enum(["quality", "pitfall", "challenge", "allergy"]),
    value: z.string(),
  }),
  z.object({
    type: z.literal("kernkwadranten.round.submitted"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("kernkwadranten.round.discussed"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("kernkwadranten.game.completed"),
    actorId: z.string(),
  }),
]);

export type KernkwadrantenState = z.infer<typeof kernkwadrantenStateSchema>;
export type KernkwadrantenAction = z.infer<typeof kernkwadrantenActionSchema>;
export type Kernkwadrant = z.infer<typeof quadrantSchema>;
