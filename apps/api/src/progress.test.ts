import { describe, expect, it } from "vitest";

import { computeCoreProgress } from "./progress";

const WORLD1 = [
  "waarden",
  "lach-samen",
  "kennismaking",
  "familiedorp",
  "kwaliteiten",
];
const WORLD1_EXTRA = ["stille-vijver", "brug-ontdekking"];
const WORLD2 = [
  "kernkwadranten",
  "stilteruisje",
  "vrolijke-open-plek",
  "oude-eik",
  "spiegelvijver",
];

describe("computeCoreProgress", () => {
  it("begint op afstand", () => {
    const progress = computeCoreProgress([], []);
    expect(progress.nabijheid.fraction).toBe(0);
    expect(progress.nabijheid.growthLines).toBe(9);
    expect(progress.eligibleWorlds).toEqual([1]);
  });

  it("opent landschap 2 na 5 spellen op kaart 1 (groeilijn 1)", () => {
    const progress = computeCoreProgress(WORLD1, []);
    expect(progress.eligibleWorlds).toEqual([1, 2]);
    expect(progress.nabijheid.fraction).toBeCloseTo(0.2, 5);
  });

  it("telt extra spellen (6e/7e) op dezelfde kaart niet mee in de meter", () => {
    const progress = computeCoreProgress([...WORLD1, ...WORLD1_EXTRA], []);
    expect(progress.eligibleWorlds).toEqual([1, 2]);
    expect(progress.nabijheid.fraction).toBeCloseTo(0.2, 5);
    expect(progress.completedGames).toBe(7);
  });

  it("schuift fijnmazig op door acties in een lopend spel, zonder de groeilijn te passeren", () => {
    const progress = computeCoreProgress([], [{ gameId: "waarden", revision: 5 }]);
    expect(progress.nabijheid.fraction).toBeGreaterThan(0);
    expect(progress.nabijheid.fraction).toBeLessThan(0.2);
    expect(progress.eligibleWorlds).toEqual([1]);
  });

  it("meer acties = verder opgeschoven binnen het landschap", () => {
    const weinig = computeCoreProgress([], [{ gameId: "waarden", revision: 2 }]);
    const veel = computeCoreProgress([], [{ gameId: "waarden", revision: 6 }]);
    expect(veel.nabijheid.fraction).toBeGreaterThan(weinig.nabijheid.fraction);
  });

  it("bereikt groeilijn 2 nadat kaart 1 én 2 volledig zijn", () => {
    const progress = computeCoreProgress([...WORLD1, ...WORLD2], []);
    expect(progress.eligibleWorlds).toEqual([1, 2, 3]);
    expect(progress.nabijheid.fraction).toBeCloseTo(0.4, 5);
  });

  it("verdeelt afgeronde spellen over interne groeilijnen", () => {
    const progress = computeCoreProgress(
      ["waarden", "kennismaking", "spiegelvijver", "grenzen-tempo"],
      [],
    );
    expect(progress.nabijheid.lines.richting).toBe(1); // waarden
    expect(progress.nabijheid.lines.kennis).toBe(1); // kennismaking
    expect(progress.nabijheid.lines.vertrouwen).toBe(1); // spiegelvijver
    expect(progress.nabijheid.lines.zorg).toBe(1); // grenzen-tempo
  });

  it("negeert lopende acties zodra het spel al is afgerond", () => {
    const progress = computeCoreProgress(WORLD1, [
      { gameId: "waarden", revision: 9 },
    ]);
    expect(progress.nabijheid.fraction).toBeCloseTo(0.2, 5);
  });
});
