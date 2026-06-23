import { describe, expect, it } from "vitest";

import {
  addDeveloperSpiegelvijverPartner,
  createInitialSpiegelvijverState,
  spiegelvijverReducer,
} from "./reducer";

const portrait = {
  openness: "observe-first" as const,
  origin: "Thuis was het veiliger om eerst te kijken.",
  surface: ["rustig", "slim"],
  deeper: ["onzekerheid"],
  hidden: ["waarom ik afstand neem"],
};

const observation = {
  reading: "more-careful" as const,
  seenIn: "Aan hoe je eerst de kat uit de boom kijkt.",
  gentleNote: "Ik ben benieuwd of dit ook bij jou speelt.",
};

describe("spiegelvijver reducer", () => {
  it("bewaart het zelfbeeld per persoon", () => {
    let state = createInitialSpiegelvijverState(["a", "b"]);
    state = spiegelvijverReducer(state, {
      type: "spiegelvijver.self.submitted",
      actorId: "a",
      portrait,
    });
    expect(state.selfPortraits.a).toEqual(portrait);
    expect(state.selfPortraits.b).toBeUndefined();
  });

  it("bewaart de observatie van de ander apart van het zelfbeeld", () => {
    let state = createInitialSpiegelvijverState(["a", "b"]);
    state = spiegelvijverReducer(state, {
      type: "spiegelvijver.observation.submitted",
      actorId: "a",
      observation,
    });
    expect(state.observations.a).toEqual(observation);
    expect(state.selfPortraits.a).toBeUndefined();
  });

  it("markeert het gesprek per persoon zonder duplicaten", () => {
    let state = createInitialSpiegelvijverState(["a", "b"]);
    state = spiegelvijverReducer(state, {
      type: "spiegelvijver.conversation.done",
      actorId: "a",
    });
    state = spiegelvijverReducer(state, {
      type: "spiegelvijver.conversation.done",
      actorId: "a",
    });
    expect(state.conversationDoneIds).toEqual(["a"]);
  });

  it("simuleert een partner in developer mode", () => {
    let state = createInitialSpiegelvijverState(["a", "b"]);
    const action = {
      type: "spiegelvijver.self.submitted",
      actorId: "a",
      portrait,
    } as const;
    state = spiegelvijverReducer(state, action);
    state = addDeveloperSpiegelvijverPartner(state, action, "b");
    expect(state.selfPortraits.b?.openness).toBe("open-not-deep");
    expect(state.selfPortraits.b?.surface).toContain("vrolijk");
  });
});
