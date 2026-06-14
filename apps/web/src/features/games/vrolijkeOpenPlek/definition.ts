import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  VrolijkeOpenPlekAction,
  VrolijkeOpenPlekState,
} from "./contracts";
import { VrolijkeOpenPlekGame } from "./VrolijkeOpenPlekGame";
import { createInitialVrolijkeOpenPlekState } from "./reducer";
import { serializeVrolijkeOpenPlekResult } from "./result";

type Result = ReturnType<typeof serializeVrolijkeOpenPlekResult>;

export const vrolijkeOpenPlekDefinition: GameDefinition<
  VrolijkeOpenPlekState,
  Result,
  VrolijkeOpenPlekAction
> = {
  id: "vrolijke-open-plek",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialVrolijkeOpenPlekState,
  validateContent() {},
  serializeResult: (state) => serializeVrolijkeOpenPlekResult(state, []),
  Component: VrolijkeOpenPlekGame,
};
