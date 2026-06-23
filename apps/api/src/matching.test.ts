import { describe, expect, it } from "vitest";

import { profileSchema, type Profile } from "@slow-dating/contracts";

import { overlapScore } from "./matching";

function profile(overrides: Partial<Profile>): Profile {
  return profileSchema.parse({
    id: "11111111-1111-4111-8111-111111111111",
    displayName: "Test",
    bio: "",
    avatarColor: "#B9D67A",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  });
}

describe("overlapScore", () => {
  it("scoort hoog bij veel inhoudelijke overlap", () => {
    const a = profile({
      coreValues: ["eerlijkheid", "trouw", "humor"],
      relationIntention: "serieus",
      christianLayer: true,
      birthYear: 1995,
      lifeStage: "kinderwens",
      prefAgeMin: 25,
      prefAgeMax: 40,
    });
    const b = profile({
      coreValues: ["eerlijkheid", "trouw", "rust"],
      relationIntention: "serieus",
      christianLayer: true,
      birthYear: 1994,
      lifeStage: "kinderwens",
      prefAgeMin: 25,
      prefAgeMax: 40,
    });
    const result = overlapScore(a, b, 2026);
    expect(result.score).toBeGreaterThan(0.7);
    expect(result.reasons.join(" ")).toContain("Zoekt hetzelfde");
  });

  it("scoort laag bij tegengestelde intentie en geen gedeelde waarden", () => {
    const a = profile({
      coreValues: ["avontuur"],
      relationIntention: "serieus",
      christianLayer: true,
    });
    const b = profile({
      coreValues: ["rust"],
      relationIntention: "vriendschap",
      christianLayer: false,
    });
    const result = overlapScore(a, b, 2026);
    expect(result.score).toBeLessThan(0.4);
  });

  it("valt buiten leeftijdswens = leeftijdsdeel nul", () => {
    const a = profile({ prefAgeMin: 30, prefAgeMax: 40, birthYear: 1990 });
    const young = profile({ birthYear: 2006, prefAgeMin: 18, prefAgeMax: 99 });
    const fitting = profile({ birthYear: 1992, prefAgeMin: 18, prefAgeMax: 99 });
    expect(overlapScore(a, fitting, 2026).score).toBeGreaterThan(
      overlapScore(a, young, 2026).score,
    );
  });
});
