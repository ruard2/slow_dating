import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  KernkwadrantenAction,
  KernkwadrantenState,
} from "./contracts";
import { KernkwadrantenGame } from "./KernkwadrantenGame";
import { qualityProfiles } from "./content";
import { createInitialKernkwadrantenState } from "./reducer";
import { serializeKernkwadrantenResult } from "./result";

export const kernkwadrantenDefinition: GameDefinition<
  KernkwadrantenState,
  ReturnType<typeof serializeKernkwadrantenResult>,
  KernkwadrantenAction
> = {
  id: "kernkwadranten",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialKernkwadrantenState,
  validateContent() {
    if (qualityProfiles.length < 24) {
      throw new Error("Kernkwadranten vereist een brede kwaliteitsbibliotheek.");
    }
  },
  serializeResult: serializeKernkwadrantenResult,
  Component: KernkwadrantenGame,
};

kernkwadrantenDefinition.validateContent();

