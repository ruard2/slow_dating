import { describe, expect, it } from "vitest";

import type { WaardenState } from "./contracts";
import {
  addDeveloperPartnerSelection,
  createInitialWaardenState,
  waardenReducer,
} from "./reducer";
import { allPlayersSubmitted, sharedValues } from "./selectors";

describe("waarden reducer", () => {
  it("selecteert maximaal drie unieke waarden", () => {
    let state = createInitialWaardenState(["a", "b"]);
    for (const valueId of ["eerlijkheid", "trouw", "familie", "humor"] as const) {
      state = waardenReducer(state, {
        type: "waarden.value.toggled",
        actorId: "a",
        valueId,
      });
    }
    expect(state.selections.a).toEqual(["eerlijkheid", "trouw", "familie"]);

    state = waardenReducer(state, {
      type: "waarden.value.toggled",
      actorId: "a",
      valueId: "trouw",
    });
    expect(state.selections.a).toEqual(["eerlijkheid", "familie"]);
  });

  it("bevriest een persoonlijke keuze na indienen", () => {
    let state = createInitialWaardenState(["a", "b"]);
    for (const valueId of ["eerlijkheid", "trouw", "familie"] as const) {
      state = waardenReducer(state, {
        type: "waarden.value.toggled",
        actorId: "a",
        valueId,
      });
    }
    state = waardenReducer(state, {
      type: "waarden.selection.submitted",
      actorId: "a",
    });
    const unchanged = waardenReducer(state, {
      type: "waarden.value.toggled",
      actorId: "a",
      valueId: "humor",
    });
    expect(unchanged).toEqual(state);
  });

  it("onthult pas als beide spelers hebben ingediend", () => {
    const state: WaardenState = {
      ...createInitialWaardenState(["a", "b"]),
      selections: {
        a: ["eerlijkheid", "trouw", "familie"],
        b: ["eerlijkheid", "rust", "groei"],
      },
      submittedInstallationIds: ["a", "b"],
    };
    expect(allPlayersSubmitted(state, ["a", "b"])).toBe(true);
    expect(sharedValues(state, ["a", "b"])).toEqual(["eerlijkheid"]);
  });

  it("maakt in developer mode een deterministische testpartnerkeuze", () => {
    const initial: WaardenState = {
      ...createInitialWaardenState(["a", "b"]),
      selections: { a: ["eerlijkheid", "trouw", "familie"] },
      submittedInstallationIds: ["a"],
    };
    const state = addDeveloperPartnerSelection(
      initial,
      "b",
      initial.selections.a!,
    );
    expect(state.selections.b).toEqual(["eerlijkheid", "rust", "groei"]);
    expect(allPlayersSubmitted(state, ["a", "b"])).toBe(true);
  });
});
