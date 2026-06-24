import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  WinkelmandjeAction,
  WinkelmandjeState,
} from "./contracts";
import { WinkelmandjeGame } from "./WinkelmandjeGame";
import { createInitialWinkelmandjeState } from "./reducer";
import { serializeWinkelmandjeResult } from "./result";

export const winkelmandjeDefinition: GameDefinition<
  WinkelmandjeState,
  ReturnType<typeof serializeWinkelmandjeResult>,
  WinkelmandjeAction
> = {
  id: "winkelmandje",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialWinkelmandjeState,
  validateContent() {},
  serializeResult: serializeWinkelmandjeResult,
  Component: WinkelmandjeGame,
};

