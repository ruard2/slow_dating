import { describe, expect, it } from "vitest";

import { computeTraits, DOMAIN_LABEL } from "./traitEngine";

const A = "11111111-1111-4111-8111-111111111111";

function run(gameId: string, result: Record<string, unknown>) {
  return {
    provenance: {
      gameRunId: `run-${gameId}`,
      gameId,
      gameVersion: 1,
      resultSchemaVersion: 1,
      pairId: "pair",
      completedAt: "2026-06-14T12:00:00.000Z",
    },
    result,
  };
}

describe("computeTraits (v2)", () => {
  it("blijft bescheiden bij alleen profiel (alles voorlopig)", () => {
    const readings = computeTraits(
      A,
      [],
      {
        kernwaarden: ["rust", "trouw"],
        interesses: ["wandelen"],
        relatie_intentie: "serieus",
        levensfase: null,
      },
      { personSeconds: 0, totalSeconds: 0 },
    );
    expect(readings.length).toBeGreaterThan(0);
    // Eén bron (Profiel) → niets mag "stevig" zijn.
    expect(readings.every((r) => r.dekking === "voorlopig")).toBe(true);
  });

  it("bouwt op tot redelijke dekking als meer spellen convergeren", () => {
    const readings = computeTraits(
      A,
      [
        run("waarden", { selections: { [A]: ["rust", "trouw", "geloof"] } }),
        run("oude-eik", { portraits: { [A]: { response: "freeze", need: "space" } } }),
        run("stilteruisje", { mixes: { [A]: { needs: { closeness: 5, time: 4, safety: 4 } } } }),
        run("kwaliteiten", { own: { kwaliteiten: ["geduldig", "goed luisteren"] } }),
      ],
      {
        kernwaarden: ["rust", "trouw"],
        interesses: [],
        relatie_intentie: "serieus",
        levensfase: null,
      },
      { personSeconds: 110, totalSeconds: 130 },
    );

    const rust = readings.find((r) => r.domein === DOMAIN_LABEL.rust_tempo);
    expect(rust).toBeDefined();
    expect(rust!.dekking).not.toBe("voorlopig"); // meerdere bronnen
    expect(rust!.kernpunten.join(" ")).toContain("gewacht");

    // Geloof komt uit één bron (waarden) → blijft voorlopig.
    const zin = readings.find((r) => r.domein === DOMAIN_LABEL.zingeving);
    expect(zin?.dekking).toBe("voorlopig");
  });
});
