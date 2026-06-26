import type { GameDefinition } from "@slow-dating/game-kit";

import type { StilleVijverAction, StilleVijverState } from "./contracts";
import { StilleVijverGame } from "./StilleVijverGame";
import { createInitialStilleVijverState } from "./reducer";
import { serializeStilleVijverResult } from "./result";

export const stilleVijverDefinition: GameDefinition<
  StilleVijverState,
  ReturnType<typeof serializeStilleVijverResult>,
  StilleVijverAction
> = {
  id: "stille-vijver",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialStilleVijverState,
  validateContent() {},
  serializeResult: serializeStilleVijverResult,
  Component: StilleVijverGame,
};
