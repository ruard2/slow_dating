import type { GameDefinition } from "@slow-dating/game-kit";

import type { LachSamenAction, LachSamenState } from "./contracts";
import { LachSamenGame } from "./LachSamenGame";
import { createInitialLachSamenState } from "./reducer";
import { serializeLachSamenResult } from "./result";

export const lachSamenDefinition: GameDefinition<
  LachSamenState,
  ReturnType<typeof serializeLachSamenResult>,
  LachSamenAction
> = {
  id: "lach-samen",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialLachSamenState,
  validateContent() {},
  serializeResult: serializeLachSamenResult,
  Component: LachSamenGame,
};
