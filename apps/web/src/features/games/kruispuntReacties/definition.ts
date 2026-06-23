import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  KruispuntReactiesAction,
  KruispuntReactiesState,
} from "./contracts";
import { KruispuntReactiesGame } from "./KruispuntReactiesGame";
import { createInitialKruispuntReactiesState } from "./reducer";
import { serializeKruispuntReactiesResult } from "./result";

export const kruispuntReactiesDefinition: GameDefinition<
  KruispuntReactiesState,
  ReturnType<typeof serializeKruispuntReactiesResult>,
  KruispuntReactiesAction
> = {
  id: "kruispunt-reacties",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialKruispuntReactiesState,
  validateContent() {},
  serializeResult: serializeKruispuntReactiesResult,
  Component: KruispuntReactiesGame,
};

