import { z } from "zod";

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.literal("api"),
  version: z.string().min(1),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const realtimeEventSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  version: z.number().int().positive(),
  pairId: z.string().min(1),
  gameRunId: z.string().min(1).optional(),
  sentAt: z.string().datetime(),
  payload: z.unknown(),
});

export interface RealtimeEvent<TPayload> {
  id: string;
  type: string;
  version: number;
  pairId: string;
  gameRunId?: string;
  sentAt: string;
  payload: TPayload;
}
