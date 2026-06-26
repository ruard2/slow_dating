import type { GameDefinition } from "@slow-dating/game-kit";

import type { OudeKnoppenAction, OudeKnoppenState } from "./contracts";
import { OudeKnoppenGame } from "./OudeKnoppenGame";
import { createInitialOudeKnoppenState } from "./reducer";
import { serializeOudeKnoppenResult } from "./result";

export const oudeKnoppenDefinition: GameDefinition<
  OudeKnoppenState,
  ReturnType<typeof serializeOudeKnoppenResult>,
  OudeKnoppenAction
> = {
  id: "oude-knoppen-conflict",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialOudeKnoppenState,
  validateContent() {},
  serializeResult: serializeOudeKnoppenResult,
  Component: OudeKnoppenGame,
};
