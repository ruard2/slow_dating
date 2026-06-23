import { describe, expect, it } from "vitest";

import {
  addDeveloperGrenzenTempoPartner,
  createInitialGrenzenTempoState,
  grenzenTempoReducer,
} from "./reducer";

describe("grenzen en tempo reducer", () => {
  it("bewaart grens- en tempoantwoorden per persoon", () => {
    let state = createInitialGrenzenTempoState(["a", "b"]);
    state = grenzenTempoReducer(state, {
      type: "grenzen-tempo.boundaries.submitted",
      actorId: "a",
      answers: { "call-soon": "ask-first" },
    });
    state = grenzenTempoReducer(state, {
      type: "grenzen-tempo.tempo.submitted",
      actorId: "a",
      answers: { physical: "slow" },
    });

    expect(state.boundaryAnswers.a?.["call-soon"]).toBe("ask-first");
    expect(state.tempoAnswers.a?.physical).toBe("slow");
  });

  it("bewaart de kleine nee en de reactie afzonderlijk", () => {
    let state = createInitialGrenzenTempoState(["a", "b"]);
    state = grenzenTempoReducer(state, {
      type: "grenzen-tempo.small-no.submitted",
      actorId: "a",
      exercise: {
        scenario: "Zullen we bellen?",
        phrase: "Nu liever niet.",
      },
    });
    state = grenzenTempoReducer(state, {
      type: "grenzen-tempo.small-no.responded",
      actorId: "b",
      response: {
        responseId: "thank-you",
        supportId: "stay-warm",
      },
    });

    expect(state.smallNos.a?.phrase).toBe("Nu liever niet.");
    expect(state.smallNoResponses.b?.responseId).toBe("thank-you");
  });

  it("vult in ontwikkelmodus de partnerstappen aan", () => {
    const action = {
      type: "grenzen-tempo.boundaries.submitted" as const,
      actorId: "a",
      answers: { "call-soon": "fine" as const },
    };
    let state = grenzenTempoReducer(
      createInitialGrenzenTempoState(["a", "b"]),
      action,
    );
    state = addDeveloperGrenzenTempoPartner(state, action, "b");

    expect(Object.keys(state.boundaryAnswers.b ?? {}).length).toBeGreaterThan(5);
  });
});

