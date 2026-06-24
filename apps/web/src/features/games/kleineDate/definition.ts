import type { GameDefinition } from "@slow-dating/game-kit";

import type { KleineDateAction, KleineDateState } from "./contracts";
import { KleineDateGame } from "./KleineDateGame";
import { createInitialKleineDateState } from "./reducer";
import { serializeKleineDateResult } from "./result";

export const kleineDateDefinition: GameDefinition<
  KleineDateState,
  ReturnType<typeof serializeKleineDateResult>,
  KleineDateAction
> = {
  id: "kleine-date",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialKleineDateState,
  validateContent() {},
  serializeResult: serializeKleineDateResult,
  Component: KleineDateGame,
};
