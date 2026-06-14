import { describe, expect, it } from "vitest";

import {
  findPlayableGame,
  gamePlacements,
  games,
  getWorldPlacements,
  isDiscoveryGameId,
  worldPathForGame,
  worlds,
} from "./index.js";

describe("world and game registry", () => {
  it("keeps every placement linked to a known world and game", () => {
    expect(gamePlacements).not.toHaveLength(0);
    for (const placement of gamePlacements) {
      expect(worlds.some((world) => world.id === placement.worldId)).toBe(true);
      expect(games.some((game) => game.id === placement.gameId)).toBe(true);
    }
    expect(getWorldPlacements(1)).toHaveLength(7);
    expect(getWorldPlacements(2)).toHaveLength(3);
  });

  it("only exposes available games and discovery scoring explicitly", () => {
    expect(findPlayableGame("waarden")?.status).toBe("native");
    expect(findPlayableGame("grot")).toBeUndefined();
    expect(findPlayableGame("profiel")).toBeUndefined();
    expect(isDiscoveryGameId("waarden")).toBe(true);
    expect(isDiscoveryGameId("profiel")).toBe(false);
  });

  it("returns the owning world route for every game", () => {
    expect(worldPathForGame("waarden")).toBe("/");
    expect(worldPathForGame("kernkwadranten")).toBe("/worlds/2");
    expect(worldPathForGame("stilteruisje")).toBe("/worlds/2");
    expect(worldPathForGame("vrolijke-open-plek")).toBe("/worlds/2");
  });
});
