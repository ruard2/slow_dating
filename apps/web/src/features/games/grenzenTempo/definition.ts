import type { GameDefinition } from "@slow-dating/game-kit";

import type { GrenzenTempoAction, GrenzenTempoState } from "./contracts";
import { GrenzenTempoGame } from "./GrenzenTempoGame";
import { createInitialGrenzenTempoState } from "./reducer";
import { serializeGrenzenTempoResult } from "./result";

export const grenzenTempoDefinition: GameDefinition<
  GrenzenTempoState,
  ReturnType<typeof serializeGrenzenTempoResult>,
  GrenzenTempoAction
> = {
  id: "grenzen-tempo",
  version: 1,
  modes: ["couple"],
  createInitialState: createInitialGrenzenTempoState,
  validateContent() {},
  serializeResult: serializeGrenzenTempoResult,
  Component: GrenzenTempoGame,
};

