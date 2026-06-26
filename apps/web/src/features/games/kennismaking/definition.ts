import type { GameDefinition } from "@slow-dating/game-kit";

import type { KennismakingAction, KennismakingState } from "./contracts";
import { KennismakingGame } from "./KennismakingGame";
import { createInitialKennismakingState } from "./reducer";
import { serializeKennismakingResult } from "./result";

export const kennismakingDefinition: GameDefinition<
  KennismakingState,
  ReturnType<typeof serializeKennismakingResult>,
  KennismakingAction
> = {
  id: "kennismaking",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialKennismakingState,
  validateContent() {},
  serializeResult: serializeKennismakingResult,
  Component: KennismakingGame,
};
