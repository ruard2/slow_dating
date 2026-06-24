import { describe, expect, it } from "vitest";

import type { StressmeterRoundSummary } from "./contracts";
import {
  addDeveloperStressmeterPartner,
  createInitialStressmeterState,
  stressmeterReducer,
} from "./reducer";
import { serializeStressmeterResult } from "./result";

function summary(overrides: Partial<StressmeterRoundSummary> = {}) {
  return {
    roundId: "round-1",
    actorId: "a",
    winner: "self",
    durationMs: 65000,
    selfHitsTaken: 1,
    partnerHitsTaken: 3,
    shotsFired: 18,
    powerUpsCollected: ["speed", "shield"],
    questionsShown: ["Wat doe jij meestal als je onder druk staat?"],
    stormBursts: 1,
    coopShipDefeated: true,
    coopHits: 7,
    stressSignals: {
      riskTaking: 46,
      distanceKeeping: 25,
      pressureBursts: 2,
    },
    ...overrides,
  } satisfies StressmeterRoundSummary;
}

describe("stressmeter reducer", () => {
  it("slaat ronde-samenvattingen per speler op", () => {
    const state = stressmeterReducer(createInitialStressmeterState(["a"]), {
      type: "stressmeter.round.finished",
      actorId: "a",
      summary: summary(),
    });

    expect(state.roundsByPerson.a).toHaveLength(1);
    expect(state.roundsByPerson.a?.[0]?.shotsFired).toBe(18);
  });

  it("negeert dubbele ronde-id's", () => {
    let state = createInitialStressmeterState(["a"]);
    state = stressmeterReducer(state, {
      type: "stressmeter.round.finished",
      actorId: "a",
      summary: summary(),
    });
    state = stressmeterReducer(state, {
      type: "stressmeter.round.finished",
      actorId: "a",
      summary: summary({ shotsFired: 99 }),
    });

    expect(state.roundsByPerson.a).toHaveLength(1);
    expect(state.roundsByPerson.a?.[0]?.shotsFired).toBe(18);
  });

  it("markeert voltooiing apart van gespeelde rondes", () => {
    const state = stressmeterReducer(createInitialStressmeterState(["a"]), {
      type: "stressmeter.game.completed",
      actorId: "a",
    });

    expect(state.completedIds).toEqual(["a"]);
  });

  it("simuleert een partner in developer mode", () => {
    const state = stressmeterReducer(createInitialStressmeterState(["a", "b"]), {
      type: "stressmeter.round.finished",
      actorId: "a",
      summary: summary(),
    });
    const withPartner = addDeveloperStressmeterPartner(
      state,
      {
        type: "stressmeter.round.finished",
        actorId: "a",
        summary: summary(),
      },
      "b",
    );

    expect(withPartner.roundsByPerson.b).toHaveLength(1);
    expect(withPartner.roundsByPerson.b?.[0]?.actorId).toBe("b");
  });

  it("serialiseert AI-vriendelijk", () => {
    const state = stressmeterReducer(createInitialStressmeterState(["a"]), {
      type: "stressmeter.round.finished",
      actorId: "a",
      summary: summary(),
    });
    const result = serializeStressmeterResult(state);

    expect(result.gameId).toBe("stressmeter");
    expect(result.people.a?.rounds[0]?.stressSignals.riskTaking).toBe(46);
    expect(result.people.a?.rounds[0]?.coopShipDefeated).toBe(true);
    expect(result.catalog.powerUps).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "speed" })]),
    );
  });
});
