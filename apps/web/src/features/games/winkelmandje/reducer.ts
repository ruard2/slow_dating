import {
  shopDays,
  shopNeeds,
  shopProducts,
  supportLines,
} from "./content";
import type {
  ShopDecision,
  WinkelmandjeAction,
  WinkelmandjeState,
} from "./contracts";
import { winkelmandjeStateSchema } from "./contracts";

export function createInitialWinkelmandjeState(
  readyInstallationIds: string[] = [],
): WinkelmandjeState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    dayId: null,
    productIds: [],
    budgetByPerson: {},
    decisionsByPerson: {},
    submittedIds: [],
    meaningsByPerson: {},
    meaningsSubmittedIds: [],
    partnerActionsByTarget: {},
    reactionsByPerson: {},
    conversationDoneByPerson: {},
    faithByPerson: {},
    faithSubmittedIds: [],
    supportLine: null,
    supportConfirmedIds: [],
  };
}

export function normalizeWinkelmandjeState(input: unknown) {
  const parsed = winkelmandjeStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialWinkelmandjeState(readyInstallationIds);
}

function hashSeed(seed: string) {
  return [...seed].reduce(
    (value, character) => (value * 33 + character.charCodeAt(0)) >>> 0,
    5381,
  );
}

export function selectShopSession(seed: string) {
  let hash = hashSeed(seed);
  const day = shopDays[hash % shopDays.length]!;
  const pool = shopProducts.map((product) => product.id);
  const selected: string[] = [];
  while (selected.length < 12) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const id = pool.splice(hash % pool.length, 1)[0]!;
    selected.push(id);
  }
  return { dayId: day.id, productIds: selected };
}

export function hiddenBudgetFor(seed: string) {
  return 620 + (hashSeed(seed) % 181);
}

export function cartProductIds(state: WinkelmandjeState, personId: string) {
  const decisions = state.decisionsByPerson[personId] ?? {};
  return state.productIds.filter((id) => decisions[id] === "cart");
}

export function cartTotal(state: WinkelmandjeState, personId: string) {
  return cartProductIds(state, personId).reduce(
    (sum, id) =>
      sum + (shopProducts.find((product) => product.id === id)?.price ?? 0),
    0,
  );
}

export function needsBreakdown(state: WinkelmandjeState, personId: string) {
  const result = Object.fromEntries(shopNeeds.map((need) => [need.id, 0]));
  for (const id of cartProductIds(state, personId)) {
    const product = shopProducts.find((item) => item.id === id);
    if (product) result[product.need] = (result[product.need] ?? 0) + product.price;
  }
  return result;
}

export function winkelmandjeReducer(
  current: WinkelmandjeState,
  action: WinkelmandjeAction,
): WinkelmandjeState {
  const state = normalizeWinkelmandjeState(current);
  if (
    action.type === "winkelmandje.game.completed" ||
    action.type === "winkelmandje.game.replayed"
  ) {
    return state;
  }
  if (action.type === "winkelmandje.session.started") {
    return {
      ...state,
      dayId: state.dayId ?? action.dayId,
      productIds: state.productIds.length ? state.productIds : action.productIds,
      budgetByPerson: {
        ...state.budgetByPerson,
        [action.actorId]:
          state.budgetByPerson[action.actorId] ?? action.budget,
      },
    };
  }
  if (action.type === "winkelmandje.product.decided") {
    if (state.submittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      decisionsByPerson: {
        ...state.decisionsByPerson,
        [action.actorId]: {
          ...(state.decisionsByPerson[action.actorId] ?? {}),
          [action.productId]: action.decision,
        },
      },
    };
  }
  if (action.type === "winkelmandje.shopping.submitted") {
    const decisions = state.decisionsByPerson[action.actorId] ?? {};
    if (state.productIds.some((id) => !decisions[id])) return state;
    return {
      ...state,
      budgetByPerson: {
        ...state.budgetByPerson,
        [action.actorId]:
          state.budgetByPerson[action.actorId] ?? action.budget,
      },
      submittedIds: [...new Set([...state.submittedIds, action.actorId])],
    };
  }
  if (action.type === "winkelmandje.meaning.chosen") {
    return {
      ...state,
      meaningsByPerson: {
        ...state.meaningsByPerson,
        [action.actorId]: {
          ...(state.meaningsByPerson[action.actorId] ?? {}),
          [action.productId]: action.meaning,
        },
      },
    };
  }
  if (action.type === "winkelmandje.meanings.submitted") {
    const cart = cartProductIds(state, action.actorId).slice(0, 2);
    if (cart.some((id) => !state.meaningsByPerson[action.actorId]?.[id])) {
      return state;
    }
    return {
      ...state,
      meaningsSubmittedIds: [
        ...new Set([...state.meaningsSubmittedIds, action.actorId]),
      ],
    };
  }
  if (action.type === "winkelmandje.partner-action.submitted") {
    const targetTotal = cartTotal(state, action.targetId);
    const targetBudget = state.budgetByPerson[action.targetId] ?? 0;
    const targetCart = cartProductIds(state, action.targetId);
    const selectedProducts = action.productIds
      .map((id) => shopProducts.find((product) => product.id === id))
      .filter(
        (product): product is (typeof shopProducts)[number] =>
          Boolean(product),
      );
    if (targetTotal > targetBudget) {
      const selectedValue = selectedProducts.reduce(
        (sum, product) => sum + product.price,
        0,
      );
      if (
        action.kind !== "return" ||
        action.productIds.some((id) => !targetCart.includes(id)) ||
        selectedValue < targetTotal - targetBudget
      ) {
        return state;
      }
    } else if (
      action.kind !== "gift" ||
      selectedProducts.length !== 1 ||
      targetCart.includes(selectedProducts[0]!.id)
    ) {
      return state;
    }
    return {
      ...state,
      partnerActionsByTarget: {
        ...state.partnerActionsByTarget,
        [action.targetId]: {
          actorId: action.actorId,
          kind: action.kind,
          productIds: action.productIds,
          intention: action.intention,
        },
      },
    };
  }
  if (action.type === "winkelmandje.reaction.chosen") {
    return {
      ...state,
      reactionsByPerson: {
        ...state.reactionsByPerson,
        [action.actorId]: action.reaction,
      },
    };
  }
  if (action.type === "winkelmandje.conversation.done") {
    return {
      ...state,
      conversationDoneByPerson: {
        ...state.conversationDoneByPerson,
        [action.actorId]: [
          ...new Set([
            ...(state.conversationDoneByPerson[action.actorId] ?? []),
            action.cardIndex,
          ]),
        ],
      },
    };
  }
  if (action.type === "winkelmandje.faith.submitted") {
    return {
      ...state,
      faithByPerson: {
        ...state.faithByPerson,
        [action.actorId]: {
          goodDesire: action.goodDesire,
          heavyDesire: action.heavyDesire,
          practice: action.practice,
          reflection: action.reflection.trim(),
        },
      },
      faithSubmittedIds: [
        ...new Set([...state.faithSubmittedIds, action.actorId]),
      ],
    };
  }
  if (action.type === "winkelmandje.support.proposed") {
    const text = action.text.trim();
    if (!text) return state;
    return {
      ...state,
      supportLine: { text, proposedBy: action.actorId },
      supportConfirmedIds: [],
    };
  }
  if (action.type === "winkelmandje.support.confirmed") {
    if (!state.supportLine) return state;
    return {
      ...state,
      supportConfirmedIds: [
        ...new Set([...state.supportConfirmedIds, action.actorId]),
      ],
    };
  }
  return state;
}

function rotate<T>(items: readonly T[], offset: number) {
  return items[offset % items.length] ?? items[0]!;
}

export function addDeveloperWinkelmandjePartner(
  state: WinkelmandjeState,
  action: WinkelmandjeAction,
  partnerId: string,
) {
  if (action.type === "winkelmandje.session.started") {
    return {
      ...state,
      budgetByPerson: {
        ...state.budgetByPerson,
        [partnerId]: hiddenBudgetFor(`${partnerId}:${state.dayId}`),
      },
    };
  }
  if (action.type === "winkelmandje.shopping.submitted") {
    const decisions = Object.fromEntries(
      state.productIds.map((id, index) => [
        id,
        rotate<ShopDecision>(["cart", "save", "pass"], index + 1),
      ]),
    );
    return {
      ...state,
      decisionsByPerson: {
        ...state.decisionsByPerson,
        [partnerId]: decisions,
      },
      submittedIds: [...new Set([...state.submittedIds, partnerId])],
    };
  }
  if (action.type === "winkelmandje.meanings.submitted") {
    const meanings = Object.fromEntries(
      cartProductIds(state, partnerId)
        .slice(0, 2)
        .map((id, index) => [id, shopNeeds[(index + 2) % shopNeeds.length]!.id]),
    );
    return {
      ...state,
      meaningsByPerson: {
        ...state.meaningsByPerson,
        [partnerId]: meanings,
      },
      meaningsSubmittedIds: [
        ...new Set([...state.meaningsSubmittedIds, partnerId]),
      ],
    };
  }
  if (action.type === "winkelmandje.partner-action.submitted") {
    const targetId = action.actorId;
    const targetTotal = cartTotal(state, targetId);
    const targetBudget = state.budgetByPerson[targetId] ?? 700;
    const targetCart = cartProductIds(state, targetId);
    let productIds: string[] = [];
    if (targetTotal > targetBudget) {
      let returned = 0;
      for (const id of [...targetCart].sort(
        (a, b) =>
          (shopProducts.find((p) => p.id === b)?.price ?? 0) -
          (shopProducts.find((p) => p.id === a)?.price ?? 0),
      )) {
        if (returned >= targetTotal - targetBudget) break;
        productIds.push(id);
        returned += shopProducts.find((product) => product.id === id)?.price ?? 0;
      }
    } else {
      const gift = state.productIds
        .map((id) => shopProducts.find((product) => product.id === id))
        .find(
          (product) =>
            product &&
            !targetCart.includes(product.id),
        );
      if (gift) productIds = [gift.id];
    }
    const kind: "return" | "gift" =
      targetTotal > targetBudget ? "return" : "gift";
    return {
      ...state,
      partnerActionsByTarget: {
        ...state.partnerActionsByTarget,
        [targetId]: {
          actorId: partnerId,
          kind,
          productIds,
          intention: kind === "gift" ? shopNeeds[2]!.id : "",
        },
      },
    };
  }
  if (action.type === "winkelmandje.reaction.chosen") {
    return {
      ...state,
      reactionsByPerson: {
        ...state.reactionsByPerson,
        [partnerId]: "Dit verrast me.",
      },
    };
  }
  if (action.type === "winkelmandje.conversation.done") {
    return {
      ...state,
      conversationDoneByPerson: {
        ...state.conversationDoneByPerson,
        [partnerId]: [0, 1, 2],
      },
    };
  }
  if (action.type === "winkelmandje.faith.submitted") {
    return {
      ...state,
      faithByPerson: {
        ...state.faithByPerson,
        [partnerId]: {
          goodDesire: "Vakmanschap",
          heavyDesire: "Controle",
          practice: "Dankbaar genieten",
          reflection: "",
        },
      },
      faithSubmittedIds: [
        ...new Set([...state.faithSubmittedIds, partnerId]),
      ],
    };
  }
  if (action.type === "winkelmandje.support.confirmed") {
    return winkelmandjeReducer(state, {
      type: "winkelmandje.support.confirmed",
      actorId: partnerId,
    });
  }
  if (action.type === "winkelmandje.support.proposed") {
    return {
      ...state,
      supportLine: state.supportLine ?? {
        text: supportLines[0]!,
        proposedBy: partnerId,
      },
    };
  }
  return state;
}
