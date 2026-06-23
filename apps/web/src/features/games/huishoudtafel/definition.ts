import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  HuishoudtafelAction,
  HuishoudtafelState,
} from "./contracts";
import { HuishoudtafelGame } from "./HuishoudtafelGame";
import { createInitialHuishoudtafelState } from "./reducer";
import { serializeHuishoudtafelResult } from "./result";

export const huishoudtafelDefinition: GameDefinition<
  HuishoudtafelState,
  ReturnType<typeof serializeHuishoudtafelResult>,
  HuishoudtafelAction
> = {
  id: "huishoudtafel",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialHuishoudtafelState,
  validateContent() {},
  serializeResult: serializeHuishoudtafelResult,
  Component: HuishoudtafelGame,
};