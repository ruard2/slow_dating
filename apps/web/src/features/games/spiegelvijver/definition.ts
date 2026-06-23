import type { GameDefinition } from "@slow-dating/game-kit";

import type { SpiegelvijverAction, SpiegelvijverState } from "./contracts";
import { createInitialSpiegelvijverState } from "./reducer";
import { serializeSpiegelvijverResult } from "./result";
import { SpiegelvijverGame } from "./SpiegelvijverGame";

export const spiegelvijverDefinition: GameDefinition<
  SpiegelvijverState,
  ReturnType<typeof serializeSpiegelvijverResult>,
  SpiegelvijverAction
> = {
  id: "spiegelvijver",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialSpiegelvijverState,
  validateContent() {},
  serializeResult: serializeSpiegelvijverResult,
  Component: SpiegelvijverGame,
};
