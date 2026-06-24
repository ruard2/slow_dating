import { describe, expect, it } from "vitest";

import { compassPillars, reflectionPrompts } from "./content";
import {
  addDeveloperGeldbrugPartner,
  compassTotal,
  createInitialGeldbrugState,
  geldbrugReducer,
  selectScenarioIds,
} from "./reducer";
import { serializeGeldbrugResult } from "./result";

function completedCompassState(actorId = "a") {
  let state = createInitialGeldbrugState(["a", "b"]);
  for (let index = 0; index < 25; index++) {
    state = geldbrugReducer(state, {
      type: "geldbrug.compass.coin.moved",
      actorId,
      pillarId: compassPillars[index % compassPillars.length]!.id,
      delta: 1,
    });
  }
  for (const prompt of reflectionPrompts) {
    state = geldbrugReducer(state, {
      type: "geldbrug.reflection.answered",
      actorId,
      promptId: prompt.id,
      value: prompt.options[0],
    });
  }
  return state;
}

describe("geldbrug reducer", () => {
  it("vereist exact 25 vrij verdeelde munten voordat het kompas sluit", () => {
    let state = completedCompassState();
    state = geldbrugReducer(state, {
      type: "geldbrug.compass.coin.moved",
      actorId: "a",
      pillarId: "safety",
      delta: -1,
    });
    state = geldbrugReducer(state, {
      type: "geldbrug.compass.submitted",
      actorId: "a",
    });
    expect(state.compassSubmittedIds).not.toContain("a");

    state = geldbrugReducer(state, {
      type: "geldbrug.compass.coin.moved",
      actorId: "a",
      pillarId: "safety",
      delta: 1,
    });
    state = geldbrugReducer(state, {
      type: "geldbrug.compass.submitted",
      actorId: "a",
    });
    expect(state.compassSubmittedIds).toContain("a");
  });

  it("kiest vijf unieke scenario's en varieert per zaad", () => {
    const first = selectScenarioIds("eerste ronde");
    const second = selectScenarioIds("tweede ronde");

    expect(first).toHaveLength(5);
    expect(new Set(first)).toHaveLength(5);
    expect(second).not.toEqual(first);
  });

  it("maakt voor de virtuele partner een geldig kompas van 25 munten", () => {
    const own = completedCompassState();
    const submitted = geldbrugReducer(own, {
      type: "geldbrug.compass.submitted",
      actorId: "a",
    });
    const withPartner = addDeveloperGeldbrugPartner(
      submitted,
      { type: "geldbrug.compass.submitted", actorId: "a" },
      "b",
    );

    expect(compassTotal(withPartner.compassByPerson.b)).toBe(25);
    expect(withPartner.compassSubmittedIds).toContain("b");
  });

  it("trekt bevestigingen in zodra iemand de afspraak wijzigt", () => {
    let state = createInitialGeldbrugState(["a", "b"]);
    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.proposed",
      actorId: "a",
      text: "Iedere zondag tien minuten geldgesprek.",
    });
    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.confirmed",
      actorId: "a",
    });
    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.proposed",
      actorId: "b",
      text: "Iedere eerste zondag twintig minuten geldgesprek.",
    });

    expect(state.commitment?.revision).toBe(1);
    expect(state.commitmentConfirmedIds).toEqual([]);
  });

  it("neemt alleen een door beide partners bevestigde afspraak op in het resultaat", () => {
    let state = createInitialGeldbrugState(["a", "b"]);
    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.proposed",
      actorId: "a",
      text: "We spreken aankopen boven €100 vooraf door.",
    });
    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.confirmed",
      actorId: "a",
    });
    expect(serializeGeldbrugResult(state).acceptedCommitment).toBeNull();

    state = geldbrugReducer(state, {
      type: "geldbrug.commitment.confirmed",
      actorId: "b",
    });
    expect(serializeGeldbrugResult(state).acceptedCommitment?.text).toContain(
      "€100",
    );
  });
});
