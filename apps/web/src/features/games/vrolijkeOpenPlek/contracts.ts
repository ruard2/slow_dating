import { z } from "zod";

export const missionIdSchema = z.enum([
  "video",
  "tictactoe",
  "bluff",
  "duel",
  "setback",
]);

const reflectionSchema = z.object({
  lighter: z.number().int().min(1).max(5),
  relief: z.enum(["absurdity", "challenge", "together", "seen"]),
  pressure: z.enum(["laugh", "focus", "tease", "withdraw"]),
  support: z.enum(["join", "space", "cheer", "soften"]),
});

export const vrolijkeOpenPlekStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  missionChoices: z.record(z.string(), z.array(missionIdSchema).length(3)).default({}),
  activeMissionId: missionIdSchema.nullable().default(null),
  completedMissionIds: z.array(missionIdSchema).default([]),
  missionsFinished: z.boolean().default(false),
  videoUrl: z.string().default(""),
  tictactoeBoard: z.array(z.enum(["x", "o"]).nullable()).length(9).default(
    Array.from({ length: 9 }, () => null),
  ),
  tictactoeTurn: z.number().int().nonnegative().default(0),
  bluffClaims: z.record(
    z.string(),
    z.object({ prompt: z.string(), claim: z.string().min(1), truthful: z.boolean() }),
  ).default({}),
  bluffGuesses: z.record(z.string(), z.boolean()).default({}),
  duelChoices: z.record(z.string(), z.enum(["rock", "paper", "scissors"])).default({}),
  setbackChoices: z.record(
    z.string(),
    z.enum(["laugh", "retry", "pause", "comfort"]),
  ).default({}),
  missionReadyIds: z.array(z.string()).default([]),
  reflections: z.record(z.string(), reflectionSchema).default({}),
  conversationDoneIds: z.array(z.string()).default([]),
});

export const vrolijkeOpenPlekActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("vrolijke-open-plek.missions.chosen"),
    actorId: z.string(),
    missions: z.array(missionIdSchema).length(3),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.video.set"),
    actorId: z.string(),
    url: z.string().max(500),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.tictactoe.moved"),
    actorId: z.string(),
    cell: z.number().int().min(0).max(8),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.bluff.submitted"),
    actorId: z.string(),
    prompt: z.string(),
    claim: z.string().min(1).max(300),
    truthful: z.boolean(),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.bluff.guessed"),
    actorId: z.string(),
    truthful: z.boolean(),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.duel.chosen"),
    actorId: z.string(),
    choice: z.enum(["rock", "paper", "scissors"]),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.setback.chosen"),
    actorId: z.string(),
    choice: z.enum(["laugh", "retry", "pause", "comfort"]),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.mission.ready"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.mission.next"),
    actorId: z.string(),
    missionId: missionIdSchema.nullable(),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.reflection.submitted"),
    actorId: z.string(),
    reflection: reflectionSchema,
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.conversation.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("vrolijke-open-plek.game.completed"),
    actorId: z.string(),
  }),
]);

export type VrolijkeOpenPlekState = z.infer<typeof vrolijkeOpenPlekStateSchema>;
export type VrolijkeOpenPlekAction = z.infer<typeof vrolijkeOpenPlekActionSchema>;
