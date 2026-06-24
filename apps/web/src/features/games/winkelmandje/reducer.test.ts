import { describe, expect, it } from "vitest";

import { shopProducts } from "./content";
import {
  addDeveloperWinkelmandjePartner,
  cartTotal,
  createInitialWinkelmandjeState,
  hiddenBudgetFor,
  selectShopSession,
  winkelmandjeReducer,
} from "./reducer";
import { serializeWinkelmandjeResult } from "./result";

function startedState() {
  const session = selectShopSession("vaste testsessie");
  return winkelmandjeReducer(
    createInitialWinkelmandjeState(["a", "b"]),
    {
      type: "winkelmandje.session.started",
      actorId: "a",
      ...session,
      budget: 700,
    },
  );
}

describe("winkelmandje reducer", () => {
  it("kiest twaalf unieke producten en een reproduceerbare verborgen ruimte", () => {
    const first = selectShopSession("dezelfde dag");
    const second = selectShopSession("dezelfde dag");

    expect(first).toEqual(second);
    expect(first.productIds).toHaveLength(12);
    expect(new Set(first.productIds)).toHaveLength(12);
    expect(hiddenBudgetFor("a")).toBe(hiddenBudgetFor("a"));
  });

  it("bewaart iedere kaartbeslissing zonder prijs aan de actie toe te voegen", () => {
    const state = startedState();
    const productId = state.productIds[0]!;
    const next = winkelmandjeReducer(state, {
      type: "winkelmandje.product.decided",
      actorId: "a",
      productId,
      decision: "cart",
    });

    expect(next.decisionsByPerson.a?.[productId]).toBe("cart");
  });

  it("laat afrekenen pas toe nadat alle kaarten zijn behandeld", () => {
    let state = startedState();
    state = winkelmandjeReducer(state, {
      type: "winkelmandje.shopping.submitted",
      actorId: "a",
      budget: 700,
    });
    expect(state.submittedIds).not.toContain("a");

    for (const [index, productId] of state.productIds.entries()) {
      state = winkelmandjeReducer(state, {
        type: "winkelmandje.product.decided",
        actorId: "a",
        productId,
        decision: index % 2 ? "pass" : "cart",
      });
    }
    state = winkelmandjeReducer(state, {
      type: "winkelmandje.shopping.submitted",
      actorId: "a",
      budget: 700,
    });
    expect(state.submittedIds).toContain("a");
    expect(cartTotal(state, "a")).toBeGreaterThan(0);
  });

  it("simuleert de winkelkeuzes en partneractie in beheerdersmodus", () => {
    let state = startedState();
    state = addDeveloperWinkelmandjePartner(
      state,
      {
        type: "winkelmandje.session.started",
        actorId: "a",
        dayId: state.dayId!,
        productIds: state.productIds,
        budget: 700,
      },
      "b",
    );
    state = addDeveloperWinkelmandjePartner(
      state,
      {
        type: "winkelmandje.shopping.submitted",
        actorId: "a",
        budget: 700,
      },
      "b",
    );

    expect(Object.keys(state.decisionsByPerson.b ?? {})).toHaveLength(12);
    expect(state.submittedIds).toContain("b");
  });

  it("accepteert alleen een retour die het tekort werkelijk dekt", () => {
    let state = startedState();
    const expensive = [...state.productIds]
      .sort(
        (a, b) =>
          (shopProducts.find((p) => p.id === b)?.price ?? 0) -
          (shopProducts.find((p) => p.id === a)?.price ?? 0),
      )
      .slice(0, 4);
    state = {
      ...state,
      budgetByPerson: { ...state.budgetByPerson, a: 200 },
      decisionsByPerson: {
        a: Object.fromEntries(
          state.productIds.map((id) => [
            id,
            expensive.includes(id) ? "cart" : "pass",
          ]),
        ),
      },
    };
    const insufficient = winkelmandjeReducer(state, {
      type: "winkelmandje.partner-action.submitted",
      actorId: "b",
      targetId: "a",
      kind: "return",
      productIds: expensive.slice(0, 1),
      intention: "",
    });
    expect(insufficient.partnerActionsByTarget.a).toBeUndefined();

    const enough = winkelmandjeReducer(state, {
      type: "winkelmandje.partner-action.submitted",
      actorId: "b",
      targetId: "a",
      kind: "return",
      productIds: expensive,
      intention: "",
    });
    expect(enough.partnerActionsByTarget.a?.kind).toBe("return");
  });

  it("serialiseert prijzen, behoeftepatronen en partnerkeuzes voor latere AI-verwerking", () => {
    let state = startedState();
    const productId = state.productIds[0]!;
    state = {
      ...state,
      decisionsByPerson: {
        a: Object.fromEntries(
          state.productIds.map((id) => [id, id === productId ? "cart" : "pass"]),
        ),
      },
      submittedIds: ["a"],
      meaningsByPerson: { a: { [productId]: "freedom" } },
      partnerActionsByTarget: {
        a: {
          actorId: "b",
          kind: "gift",
          productIds: [productId],
          intention: "connection",
        },
      },
    };
    const result = serializeWinkelmandjeResult(state);
    const product = shopProducts.find((item) => item.id === productId)!;

    expect(result.people.a?.total).toBe(product.price);
    expect(result.people.a?.chosenMeanings[productId]).toBe("freedom");
    expect(result.partnerActionsByTarget.a?.kind).toBe("gift");
  });
});
