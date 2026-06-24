import { shopDays, shopNeeds, shopProducts } from "./content";
import type { WinkelmandjeState } from "./contracts";
import {
  cartProductIds,
  cartTotal,
  needsBreakdown,
} from "./reducer";

export function serializeWinkelmandjeResult(state: WinkelmandjeState) {
  const memberIds = [
    ...new Set([
      ...state.readyInstallationIds,
      ...Object.keys(state.decisionsByPerson),
      ...state.submittedIds,
    ]),
  ];
  return {
    schemaVersion: 1,
    gameId: "winkelmandje",
    day: shopDays.find((day) => day.id === state.dayId) ?? null,
    productCatalog: state.productIds.map((id) => {
      const product = shopProducts.find((item) => item.id === id);
      return product
        ? {
            id: product.id,
            title: product.title,
            need: product.need,
            price: product.price,
          }
        : { id };
    }),
    people: Object.fromEntries(
      memberIds.map((id) => {
        const cart = cartProductIds(state, id);
        const total = cartTotal(state, id);
        const budget = state.budgetByPerson[id] ?? 0;
        const breakdown = needsBreakdown(state, id);
        const strongestNeed = Object.entries(breakdown).sort(
          (a, b) => b[1] - a[1],
        )[0];
        return [
          id,
          {
            decisions: state.decisionsByPerson[id] ?? {},
            cartProductIds: cart,
            savedProductIds: state.productIds.filter(
              (productId) =>
                state.decisionsByPerson[id]?.[productId] === "save",
            ),
            total,
            hiddenBudget: budget,
            difference: budget - total,
            overBudget: total > budget,
            needsBreakdown: breakdown,
            strongestNeed: strongestNeed
              ? {
                  id: strongestNeed[0],
                  title:
                    shopNeeds.find((need) => need.id === strongestNeed[0])
                      ?.title ?? strongestNeed[0],
                  amount: strongestNeed[1],
                }
              : null,
            chosenMeanings: state.meaningsByPerson[id] ?? {},
            reaction: state.reactionsByPerson[id] ?? "",
            faith: state.faithByPerson[id] ?? null,
          },
        ];
      }),
    ),
    partnerActionsByTarget: state.partnerActionsByTarget,
    conversationDoneByPerson: state.conversationDoneByPerson,
    supportLine:
      state.supportLine &&
      memberIds.every((id) => state.supportConfirmedIds.includes(id))
        ? state.supportLine
        : null,
    completedAt: new Date().toISOString(),
  };
}

