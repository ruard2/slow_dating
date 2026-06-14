import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  StilteruisjeAction,
  StilteruisjeState,
} from "./contracts";
import { StilteruisjeGame } from "./StilteruisjeGame";
import { createInitialStilteruisjeState } from "./reducer";
import { serializeStilteruisjeResult } from "./result";

export const stilteruisjeDefinition: GameDefinition<
  StilteruisjeState,
  ReturnType<typeof serializeStilteruisjeResult>,
  StilteruisjeAction
> = {
  id: "stilteruisje",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialStilteruisjeState,
  validateContent() {},
  serializeResult: serializeStilteruisjeResult,
  Component: StilteruisjeGame,
};
