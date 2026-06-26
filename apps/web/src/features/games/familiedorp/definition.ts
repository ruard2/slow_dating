import type { GameDefinition } from "@slow-dating/game-kit";

import type { FamiliedorpAction, FamiliedorpState } from "./contracts";
import { FamiliedorpGame } from "./FamiliedorpGame";
import { createInitialFamiliedorpState } from "./reducer";
import { serializeFamiliedorpResult } from "./result";

export const familiedorpDefinition: GameDefinition<
  FamiliedorpState,
  ReturnType<typeof serializeFamiliedorpResult>,
  FamiliedorpAction
> = {
  id: "familiedorp",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialFamiliedorpState,
  validateContent() {},
  serializeResult: serializeFamiliedorpResult,
  Component: FamiliedorpGame,
};
