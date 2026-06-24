import type { GameDefinition } from "@slow-dating/game-kit";

import {
  samenLevenContent,
  samenLevenGameIds,
  type SamenLevenGameId,
} from "./content";
import type { SamenLevenAction, SamenLevenState } from "./contracts";
import { createInitialSamenLevenState } from "./reducer";
import { serializeSamenLevenResult } from "./result";
import { SamenLevenGame } from "./SamenLevenGame";
import { LiefdestaalGame } from "./LiefdestaalGame";

function createDefinition(
  gameId: SamenLevenGameId,
): GameDefinition<SamenLevenState, unknown, SamenLevenAction> {
  const content = samenLevenContent[gameId];
  return {
    id: gameId,
    version: 1,
    modes: ["couple"],
    createInitialState: createInitialSamenLevenState,
    validateContent() {},
    serializeResult: (state) => serializeSamenLevenResult(gameId, state),
    Component:
      gameId === "liefdestaal"
        ? LiefdestaalGame
        : (props) => <SamenLevenGame {...props} content={content} />,
  };
}

export const samenLevenDefinitions = Object.fromEntries(
  samenLevenGameIds.map((gameId) => [gameId, createDefinition(gameId)]),
) as Record<
  SamenLevenGameId,
  GameDefinition<SamenLevenState, unknown, SamenLevenAction>
>;
