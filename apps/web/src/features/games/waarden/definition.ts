import type { GameDefinition } from "@slow-dating/game-kit";

import type {
  WaardenAction,
  WaardenResult,
  WaardenState,
} from "./contracts";
import { values } from "./content";
import { WaardenGame } from "./WaardenGame";
import { createInitialWaardenState } from "./reducer";
import { serializeWaardenResult } from "./result";

export const waardenDefinition: GameDefinition<
  WaardenState,
  WaardenResult,
  WaardenAction
> = {
  id: "waarden",
  version: 2,
  modes: ["couple"],
  createInitialState: createInitialWaardenState,
  validateContent() {
    if (values.length !== 16 || new Set(values.map((value) => value.id)).size !== 16) {
      throw new Error("Waarden vereist precies zestien unieke keuzes.");
    }
  },
  serializeResult: serializeWaardenResult,
  Component: WaardenGame,
};

waardenDefinition.validateContent();
