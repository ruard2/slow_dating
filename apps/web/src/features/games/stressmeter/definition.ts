import type { GameDefinition } from "@slow-dating/game-kit";

import type { StressmeterAction, StressmeterState } from "./contracts";
import { StressmeterGame } from "./StressmeterGame";
import { createInitialStressmeterState } from "./reducer";
import { serializeStressmeterResult } from "./result";

export const stressmeterDefinition: GameDefinition<
  StressmeterState,
  ReturnType<typeof serializeStressmeterResult>,
  StressmeterAction
> = {
  id: "stressmeter",
  version: 3,
  modes: ["couple"],
  createInitialState: createInitialStressmeterState,
  validateContent() {},
  serializeResult: serializeStressmeterResult,
  Component: StressmeterGame,
};
