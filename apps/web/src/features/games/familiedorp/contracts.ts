import { z } from "zod";

export const placedItemSchema = z.object({
  uid: z.string(),
  assetId: z.string(),
  role: z.string(),
  imgSrc: z.string(),
  name: z.string().default(""),
  label: z.string().default(""),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const villageDataSchema = z.object({
  placedItems: z.array(placedItemSchema).default([]),
  sfeer: z.array(z.string()).max(3).default([]),
  zin: z.string().default(""),
});

export const familiedorpStateSchema = z.object({
  schemaVersion: z.literal(1),
  villageByPlayer: z.record(z.string(), villageDataSchema).default({}),
  completedInstallationIds: z.array(z.string()).default([]),
});

export type PlacedItem = z.infer<typeof placedItemSchema>;
export type VillageData = z.infer<typeof villageDataSchema>;
export type FamiliedorpState = z.infer<typeof familiedorpStateSchema>;

const actorBase = z.object({ actorId: z.string() });

export const familiedorpActionSchema = z.discriminatedUnion("type", [
  actorBase.extend({
    type: z.literal("familiedorp.village.submitted"),
    village: villageDataSchema,
  }),
  actorBase.extend({
    type: z.literal("familiedorp.game.completed"),
  }),
]);

export type FamiliedorpAction = z.infer<typeof familiedorpActionSchema>;
