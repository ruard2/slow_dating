import type { GameDefinition } from "@slow-dating/game-kit";

import type { DramadriehoekAction, DramadriehoekState } from "./contracts";
import { DramadriehoekGame } from "./DramadriehoekGame";
import { createInitialDramadriehoekState } from "./reducer";
import { serializeDramadriehoekResult } from "./result";

export const dramadriehoekDefinition: GameDefinition<
  DramadriehoekState,
  ReturnType<typeof serializeDramadriehoekResult>,
  DramadriehoekAction
> = {
  id: "dramadriehoek",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialDramadriehoekState,
  validateContent() {},
  serializeResult: serializeDramadriehoekResult,
  Component: DramadriehoekGame,
};
