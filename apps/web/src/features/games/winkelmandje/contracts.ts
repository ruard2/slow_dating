import { z } from "zod";

const decisionSchema = z.enum(["cart", "save", "pass"]);

export const winkelmandjeStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  dayId: z.string().nullable().default(null),
  productIds: z.array(z.string()).default([]),
  budgetByPerson: z.record(z.string(), z.number().int()).default({}),
  decisionsByPerson: z
    .record(z.string(), z.record(z.string(), decisionSchema))
    .default({}),
  submittedIds: z.array(z.string()).default([]),
  meaningsByPerson: z
    .record(z.string(), z.record(z.string(), z.string()))
    .default({}),
  meaningsSubmittedIds: z.array(z.string()).default([]),
  partnerActionsByTarget: z.record(
    z.string(),
    z.object({
      actorId: z.string(),
      kind: z.enum(["return", "gift"]),
      productIds: z.array(z.string()),
      intention: z.string().default(""),
    }),
  ).default({}),
  reactionsByPerson: z.record(z.string(), z.string()).default({}),
  conversationDoneByPerson: z
    .record(z.string(), z.array(z.number().int()))
    .default({}),
  faithByPerson: z
    .record(z.string(), z.object({
      goodDesire: z.string().default(""),
      heavyDesire: z.string().default(""),
      practice: z.string().default(""),
      reflection: z.string().default(""),
    }))
    .default({}),
  faithSubmittedIds: z.array(z.string()).default([]),
  supportLine: z.object({
    text: z.string(),
    proposedBy: z.string(),
  }).nullable().default(null),
  supportConfirmedIds: z.array(z.string()).default([]),
});

export const winkelmandjeActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("winkelmandje.session.started"),
    actorId: z.string(),
    dayId: z.string(),
    productIds: z.array(z.string()).min(10).max(14),
    budget: z.number().int(),
  }),
  z.object({
    type: z.literal("winkelmandje.product.decided"),
    actorId: z.string(),
    productId: z.string(),
    decision: decisionSchema,
  }),
  z.object({ type: z.literal("winkelmandje.shopping.submitted"), actorId: z.string(), budget: z.number().int() }),
  z.object({ type: z.literal("winkelmandje.meaning.chosen"), actorId: z.string(), productId: z.string(), meaning: z.string() }),
  z.object({ type: z.literal("winkelmandje.meanings.submitted"), actorId: z.string() }),
  z.object({
    type: z.literal("winkelmandje.partner-action.submitted"),
    actorId: z.string(),
    targetId: z.string(),
    kind: z.enum(["return", "gift"]),
    productIds: z.array(z.string()),
    intention: z.string().default(""),
  }),
  z.object({ type: z.literal("winkelmandje.reaction.chosen"), actorId: z.string(), reaction: z.string() }),
  z.object({ type: z.literal("winkelmandje.conversation.done"), actorId: z.string(), cardIndex: z.number().int() }),
  z.object({
    type: z.literal("winkelmandje.faith.submitted"),
    actorId: z.string(),
    goodDesire: z.string(),
    heavyDesire: z.string(),
    practice: z.string(),
    reflection: z.string().max(500),
  }),
  z.object({ type: z.literal("winkelmandje.support.proposed"), actorId: z.string(), text: z.string().min(1).max(240) }),
  z.object({ type: z.literal("winkelmandje.support.confirmed"), actorId: z.string() }),
  z.object({ type: z.literal("winkelmandje.game.completed"), actorId: z.string() }),
  z.object({ type: z.literal("winkelmandje.game.replayed"), actorId: z.string() }),
]);

export type WinkelmandjeState = z.infer<typeof winkelmandjeStateSchema>;
export type WinkelmandjeAction = z.infer<typeof winkelmandjeActionSchema>;
export type ShopDecision = z.infer<typeof decisionSchema>;

