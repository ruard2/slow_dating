import { describe, expect, it } from "vitest";

import type { WorldProgress } from "@slow-dating/contracts";

import { isWorldAccessible } from "./WorldMap";

const lockedProgress: WorldProgress = {
  completedGames: 0,
  eligibleWorlds: [1],
  unlockedWorlds: [1],
  purchasedWorlds: [1],
  nabijheid: {
    fraction: 0,
    growthLines: 9,
    lines: { kennis: 0, vertrouwen: 0, zorg: 0, richting: 0 },
  },
};

describe("isWorldAccessible", () => {
  it("wereld 1 is altijd toegankelijk", () => {
    expect(isWorldAccessible(lockedProgress, 1)).toBe(true);
  });

  it("vergrendelt betaalde kaarten zonder aankoop of voortgang", () => {
    expect(isWorldAccessible(lockedProgress, 2)).toBe(false);
    expect(isWorldAccessible(lockedProgress, 3)).toBe(false);
    expect(isWorldAccessible(lockedProgress, 4)).toBe(false);
    expect(isWorldAccessible(lockedProgress, 5)).toBe(false);
  });

  it("opent alle kaarten in beheerdersmodus", () => {
    expect(isWorldAccessible(lockedProgress, 2, true)).toBe(true);
    expect(isWorldAccessible(lockedProgress, 4, true)).toBe(true);
    expect(isWorldAccessible(lockedProgress, 5, true)).toBe(true);
  });
});
