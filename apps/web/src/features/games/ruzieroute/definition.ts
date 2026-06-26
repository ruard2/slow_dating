import type { GameDefinition } from "@slow-dating/game-kit";

import type { RuzierouteAction, RuzierouteState } from "./contracts";
import { RuzierouteGame } from "./RuzierouteGame";
import { createInitialRuzierouteState } from "./reducer";
import { serializeRuzierouteResult } from "./result";

export const ruzierouteDefinition: GameDefinition<
  RuzierouteState,
  ReturnType<typeof serializeRuzierouteResult>,
  RuzierouteAction
> = {
  id: "onze-ruzieroute",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialRuzierouteState,
  validateContent() {},
  serializeResult: serializeRuzierouteResult,
  Component: RuzierouteGame,
};
