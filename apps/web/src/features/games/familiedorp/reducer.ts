import type { FamiliedorpAction, FamiliedorpState, VillageData } from "./contracts";
import { familiedorpStateSchema } from "./contracts";

export function createInitialFamiliedorpState(): FamiliedorpState {
  return {
    schemaVersion: 1,
    villageByPlayer: {},
    completedInstallationIds: [],
  };
}

export function normalizeFamiliedorpState(input: unknown): FamiliedorpState {
  const result = familiedorpStateSchema.safeParse(input);
  if (result.success) return result.data;
  return createInitialFamiliedorpState();
}

export function familiedorpReducer(
  current: FamiliedorpState,
  action: FamiliedorpAction,
): FamiliedorpState {
  switch (action.type) {
    case "familiedorp.village.submitted":
      return {
        ...current,
        villageByPlayer: {
          ...current.villageByPlayer,
          [action.actorId]: action.village,
        },
      };
    case "familiedorp.game.completed":
      if (current.completedInstallationIds.includes(action.actorId))
        return current;
      return {
        ...current,
        completedInstallationIds: [
          ...current.completedInstallationIds,
          action.actorId,
        ],
      };
    default:
      return current;
  }
}

export function addDeveloperFamiliedorpPartner(
  state: FamiliedorpState,
  action: FamiliedorpAction,
  partnerId: string,
): FamiliedorpState {
  if (action.type === "familiedorp.village.submitted") {
    const myVillage: VillageData = action.village;
    const partnerVillage: VillageData = {
      placedItems: myVillage.placedItems.map((item, i) => ({
        ...item,
        uid: `partner_${i}`,
        x: Math.min(0.95, Math.max(0.05, item.x + (i % 2 === 0 ? 0.08 : -0.08))),
        y: Math.min(0.95, Math.max(0.05, item.y + (i % 3 === 0 ? 0.06 : -0.06))),
        name: item.name ? `${item.name}*` : "",
      })),
      sfeer: ["chaotisch maar warm", "veel humor", "altijd iemand te laat"],
      zin: "Heb je wel genoeg gegeten?",
    };
    return {
      ...state,
      villageByPlayer: {
        ...state.villageByPlayer,
        [partnerId]: partnerVillage,
      },
    };
  }
  if (action.type === "familiedorp.game.completed") {
    if (state.completedInstallationIds.includes(partnerId)) return state;
    return {
      ...state,
      completedInstallationIds: [...state.completedInstallationIds, partnerId],
    };
  }
  return state;
}
