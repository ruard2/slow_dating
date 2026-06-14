import { describe, expect, it } from "vitest";

import type { StilteruisjeAction, StilteruisjeState } from "./contracts";
import {
  addDeveloperStilteruisjePartner,
  createInitialStilteruisjeState,
  stilteruisjeReducer,
} from "./reducer";

function reduce(state: StilteruisjeState, action: StilteruisjeAction) {
  return stilteruisjeReducer(state, action);
}

function completedDraft(actorId: string) {
  let state = createInitialStilteruisjeState(["a", "b"]);
  state = reduce(state, {
    type: "stilteruisje.need.changed",
    actorId,
    needId: "safety",
    level: 5,
  });
  state = reduce(state, {
    type: "stilteruisje.noise.selected",
    actorId,
    noise: "haste",
  });
  state = reduce(state, {
    type: "stilteruisje.invitation.selected",
    actorId,
    invitation: "walk",
  });
  return state;
}

describe("stilteruisje reducer", () => {
  it("bewaart een volledig persoonlijk openheidsmengpaneel", () => {
    let state = completedDraft("a");
    state = reduce(state, {
      type: "stilteruisje.mix.submitted",
      actorId: "a",
    });
    expect(state.mixes.a).toEqual({
      needs: {
        safety: 5,
        time: 3,
        clarity: 3,
        gentleness: 3,
        closeness: 3,
      },
      noise: "haste",
      invitation: "walk",
    });
  });

  it("weigert een mengpaneel zonder ruisbron en uitnodiging", () => {
    const initial = createInitialStilteruisjeState(["a", "b"]);
    const state = reduce(initial, {
      type: "stilteruisje.mix.submitted",
      actorId: "a",
    });
    expect(state.mixes.a).toBeUndefined();
  });

  it("bewaart steun, stiltemoment en gesprek per persoon", () => {
    let state = createInitialStilteruisjeState(["a", "b"]);
    state = reduce(state, {
      type: "stilteruisje.support.selected",
      actorId: "a",
      support: "listen",
    });
    state = reduce(state, {
      type: "stilteruisje.ritual.ready",
      actorId: "a",
    });
    state = reduce(state, {
      type: "stilteruisje.conversation.done",
      actorId: "a",
    });
    expect(state.supportByActor.a).toBe("listen");
    expect(state.ritualReadyIds).toEqual(["a"]);
    expect(state.conversationDoneIds).toEqual(["a"]);
  });

  it("maakt een afwijkend maar geldig profiel voor de testpartner", () => {
    let state = completedDraft("a");
    const action = {
      type: "stilteruisje.mix.submitted",
      actorId: "a",
    } satisfies StilteruisjeAction;
    state = reduce(state, action);
    state = addDeveloperStilteruisjePartner(state, action, "b");
    expect(state.mixes.b).toMatchObject({
      noise: "advice",
      invitation: "quiet",
      needs: { safety: 4, time: 4 },
    });
  });
});
