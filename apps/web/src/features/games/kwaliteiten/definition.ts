import type { GameDefinition } from "@slow-dating/game-kit";

import type { KwaliteitenAction, KwaliteitenState } from "./contracts";
import { KwaliteitenGame } from "./KwaliteitenGame";
import { createInitialKwaliteitenState } from "./reducer";
import { serializeKwaliteitenResult } from "./result";

export const kwaliteitenDefinition: GameDefinition<
  KwaliteitenState,
  ReturnType<typeof serializeKwaliteitenResult>,
  KwaliteitenAction
> = {
  id: "kwaliteiten",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialKwaliteitenState,
  validateContent() {},
  serializeResult: serializeKwaliteitenResult,
  Component: KwaliteitenGame,
};
