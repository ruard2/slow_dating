import { describe, expect, it } from "vitest";

import type { KernkwadrantenAction, KernkwadrantenState } from "./contracts";
import {
  addDeveloperKernkwadrantenPartner,
  createInitialKernkwadrantenState,
  kernkwadrantenReducer,
} from "./reducer";

const members = ["a", "b"];

function reduce(
  state: KernkwadrantenState,
  action: KernkwadrantenAction,
) {
  return kernkwadrantenReducer(state, action, members);
}

function preparedState() {
  let state = createInitialKernkwadrantenState(members);
  state = reduce(state, {
    type: "kernkwadranten.profile.confirmed",
    actorId: "a",
    qualities: ["Daadkracht", "Empathie"],
    allergy: "Passiviteit",
  });
  state = reduce(state, {
    type: "kernkwadranten.profile.confirmed",
    actorId: "b",
    qualities: ["Geduld", "Creativiteit"],
    allergy: "Starheid",
  });
  state = reduce(state, {
    type: "kernkwadranten.explanation.ready",
    actorId: "a",
  });
  return reduce(state, {
    type: "kernkwadranten.explanation.ready",
    actorId: "b",
  });
}

function selectRound(
  state: KernkwadrantenState,
  actorId: string,
  values: Record<"pitfall" | "challenge" | "allergy", string>,
) {
  let next = state;
  for (const [field, value] of Object.entries(values)) {
    next = reduce(next, {
      type: "kernkwadranten.choice.selected",
      actorId,
      field: field as keyof typeof values,
      value,
    });
  }
  return reduce(next, {
    type: "kernkwadranten.round.submitted",
    actorId,
  });
}

describe("kernkwadranten reducer", () => {
  it("bewaart persoonlijke profielen en uitlegstatus per speler", () => {
    const state = preparedState();
    expect(state.profiles.a?.qualities).toEqual(["Daadkracht", "Empathie"]);
    expect(state.profiles.b?.allergy).toBe("Starheid");
    expect(state.explanationReadyIds).toEqual(["a", "b"]);
  });

  it("onthult de vergelijking pas nadat beide kwadranten zijn ingediend", () => {
    let state = preparedState();
    state = selectRound(state, "a", {
      pitfall: "Drammerigheid",
      challenge: "Geduld",
      allergy: "Passiviteit",
    });
    expect(state.rounds[0]?.a).toEqual({
      quality: "Daadkracht",
      pitfall: "Drammerigheid",
      challenge: "Geduld",
      allergy: "Passiviteit",
    });
    expect(state.rounds[0]?.b).toBeUndefined();
    expect(state.currentRound).toBe(0);

    state = selectRound(state, "b", {
      pitfall: "Traagheid",
      challenge: "Daadkracht",
      allergy: "Drammerigheid",
    });
    expect(state.rounds[0]?.b?.quality).toBe("Geduld");
  });

  it("gaat pas na een gesprek van beide spelers naar de volgende ronde", () => {
    let state = preparedState();
    state = selectRound(state, "a", {
      pitfall: "Drammerigheid",
      challenge: "Geduld",
      allergy: "Passiviteit",
    });
    state = selectRound(state, "b", {
      pitfall: "Traagheid",
      challenge: "Daadkracht",
      allergy: "Drammerigheid",
    });
    state = reduce(state, {
      type: "kernkwadranten.round.discussed",
      actorId: "a",
    });
    expect(state.currentRound).toBe(0);
    state = reduce(state, {
      type: "kernkwadranten.round.discussed",
      actorId: "b",
    });
    expect(state.currentRound).toBe(1);
  });

  it("werkt in de derde ronde terug vanuit de gekozen allergie", () => {
    let state = { ...preparedState(), currentRound: 2 };
    for (const [field, value] of Object.entries({
      quality: "Daadkracht",
      pitfall: "Drammerigheid",
      challenge: "Geduld",
    })) {
      state = reduce(state, {
        type: "kernkwadranten.choice.selected",
        actorId: "a",
        field: field as "quality" | "pitfall" | "challenge",
        value,
      });
    }
    state = reduce(state, {
      type: "kernkwadranten.round.submitted",
      actorId: "a",
    });
    expect(state.rounds[2]?.a).toEqual({
      quality: "Daadkracht",
      pitfall: "Drammerigheid",
      challenge: "Geduld",
      allergy: "Passiviteit",
    });
  });

  it("simuleert in ontwikkelaarsmodus de tweede speler", () => {
    let state = createInitialKernkwadrantenState(members);
    const action = {
      type: "kernkwadranten.profile.confirmed",
      actorId: "a",
      qualities: ["Daadkracht", "Empathie"],
      allergy: "Passiviteit",
    } satisfies KernkwadrantenAction;
    state = reduce(state, action);
    state = addDeveloperKernkwadrantenPartner(
      state,
      action,
      "b",
      members,
    );
    expect(state.profiles.b).toEqual({
      qualities: ["Empathie", "Daadkracht"],
      allergy: "Passiviteit",
    });
  });
});
