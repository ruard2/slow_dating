import type { GameDefinition } from "@slow-dating/game-kit";

import type { OudeEikAction, OudeEikState } from "./contracts";
import { OudeEikGame } from "./OudeEikGame";
import { createInitialOudeEikState } from "./reducer";
import { serializeOudeEikResult } from "./result";

export const oudeEikDefinition: GameDefinition<
  OudeEikState,
  ReturnType<typeof serializeOudeEikResult>,
  OudeEikAction
> = {
  id: "oude-eik",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialOudeEikState,
  validateContent() {},
  serializeResult: serializeOudeEikResult,
  Component: OudeEikGame,
};
