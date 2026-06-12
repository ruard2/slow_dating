import { z } from "zod";
import {
  valueIdSchema,
  waardenResultSchema,
  type ValueId,
  type WaardenResult,
} from "@slow-dating/contracts";

export const waardenStateSchema = z.object({
  schemaVersion: z.literal(1),
  readyInstallationIds: z.array(z.string()).default([]),
  selections: z.record(z.string(), z.array(valueIdSchema).max(3)).default({}),
  submittedInstallationIds: z.array(z.string()).default([]),
});

export const waardenActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("waarden.value.toggled"),
    actorId: z.string().min(1),
    valueId: valueIdSchema,
  }),
  z.object({
    type: z.literal("waarden.selection.submitted"),
    actorId: z.string().min(1),
  }),
  z.object({
    type: z.literal("waarden.game.completed"),
    actorId: z.string().min(1),
  }),
]);

export type WaardenState = z.infer<typeof waardenStateSchema>;
export type WaardenAction = z.infer<typeof waardenActionSchema>;
export {
  valueIdSchema,
  waardenResultSchema,
  type ValueId,
  type WaardenResult,
};
