import { describe, expect, it } from "vitest";

import {
  addDeveloperOudeEikPartner,
  createInitialOudeEikState,
  oudeEikReducer,
} from "./reducer";

const portrait = {
  atmosphere: "quiet",
  message: "do-not-burden",
  role: "observer",
  response: "withdraw",
  need: "reassurance",
  keep: "Aandacht voor kleine dingen.",
  change: "Eerder uitspreken wat ik nodig heb.",
} as const;

describe("oude eik reducer", () => {
  it("bewaart persoonlijke familiepatronen per persoon", () => {
    let state = createInitialOudeEikState(["a", "b"]);
    state = oudeEikReducer(state, {
      type: "oude-eik.portrait.submitted",
      actorId: "a",
      portrait,
    });
    expect(state.portraits.a).toEqual(portrait);
    expect(state.portraits.b).toBeUndefined();
  });

  it("simuleert een afwijkende partner in developer mode", () => {
    let state = createInitialOudeEikState(["a", "b"]);
    const action = {
      type: "oude-eik.portrait.submitted",
      actorId: "a",
      portrait,
    } as const;
    state = oudeEikReducer(state, action);
    state = addDeveloperOudeEikPartner(state, action, "b");
    expect(state.portraits.b?.response).toBe("withdraw");
    expect(state.portraits.b?.need).toBe("gentleness");
  });
});
