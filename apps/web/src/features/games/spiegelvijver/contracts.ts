import { z } from "zod";

export const spiegelvijverSelfSchema = z.object({
  openness: z.enum(["observe-first", "open-not-deep", "easy-but-guarded"]),
  origin: z.string().trim().min(1).max(240),
  surface: z.array(z.string()).min(1).max(3),
  deeper: z.array(z.string()).min(1).max(3),
  hidden: z.array(z.string()).min(1).max(3),
});

export const spiegelvijverObservationSchema = z.object({
  reading: z.enum(["feels-more", "safer-than-says", "more-careful"]),
  seenIn: z.string().trim().min(1).max(240),
  gentleNote: z.string().trim().min(1).max(240),
});

export const spiegelvijverRecognitionSchema = z.object({
  recognises: z.enum(["yes", "partly", "no"]),
  reflection: z.string().trim().min(1).max(240),
});

export const spiegelvijverStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  selfPortraits: z.record(z.string(), spiegelvijverSelfSchema).default({}),
  observations: z.record(z.string(), spiegelvijverObservationSchema).default({}),
  recognitions: z.record(z.string(), spiegelvijverRecognitionSchema).default({}),
  conversationDoneIds: z.array(z.string()).default([]),
});

export const spiegelvijverActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("spiegelvijver.self.submitted"),
    actorId: z.string(),
    portrait: spiegelvijverSelfSchema,
  }),
  z.object({
    type: z.literal("spiegelvijver.observation.submitted"),
    actorId: z.string(),
    observation: spiegelvijverObservationSchema,
  }),
  z.object({
    type: z.literal("spiegelvijver.recognition.submitted"),
    actorId: z.string(),
    recognition: spiegelvijverRecognitionSchema,
  }),
  z.object({
    type: z.literal("spiegelvijver.conversation.done"),
    actorId: z.string(),
  }),
  z.object({
    type: z.literal("spiegelvijver.game.completed"),
    actorId: z.string(),
  }),
]);

export type SpiegelvijverSelf = z.infer<typeof spiegelvijverSelfSchema>;
export type SpiegelvijverObservation = z.infer<
  typeof spiegelvijverObservationSchema
>;
export type SpiegelvijverRecognition = z.infer<
  typeof spiegelvijverRecognitionSchema
>;
export type SpiegelvijverState = z.infer<typeof spiegelvijverStateSchema>;
export type SpiegelvijverAction = z.infer<typeof spiegelvijverActionSchema>;
