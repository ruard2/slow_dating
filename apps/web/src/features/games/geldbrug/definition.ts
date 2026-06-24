import type { GameDefinition } from "@slow-dating/game-kit";

import type { GeldbrugAction, GeldbrugState } from "./contracts";
import { GeldbrugGame } from "./GeldbrugGame";
import { createInitialGeldbrugState } from "./reducer";
import { serializeGeldbrugResult } from "./result";

export const geldbrugDefinition: GameDefinition<
  GeldbrugState,
  ReturnType<typeof serializeGeldbrugResult>,
  GeldbrugAction
> = {
  id: "geldbrug",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialGeldbrugState,
  validateContent() {},
  serializeResult: serializeGeldbrugResult,
  Component: GeldbrugGame,
};

