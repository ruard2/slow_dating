import type { GameDefinition } from "@slow-dating/game-kit";

import type { KleurkompasAction, KleurkompasState } from "./contracts";
import { KleurkompasGame } from "./KleurkompasGame";
import { createInitialKleurkompasState } from "./reducer";
import { serializeKleurkompasResult } from "./result";

export const kleurkompasDefinition: GameDefinition<
  KleurkompasState,
  ReturnType<typeof serializeKleurkompasResult>,
  KleurkompasAction
> = {
  id: "kleurkompas",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialKleurkompasState,
  validateContent() {},
  serializeResult: serializeKleurkompasResult,
  Component: KleurkompasGame,
};
