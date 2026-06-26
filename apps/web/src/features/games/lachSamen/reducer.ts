import type { LachSamenAction, LachSamenState } from "./contracts";
import { lachSamenStateSchema } from "./contracts";

export function createInitialLachSamenState(): LachSamenState {
  return {
    schemaVersion: 1,
    questionSeed: Math.floor(Math.random() * 1_000_000_000),
    answersByPlayer: {},
    completedInstallationIds: [],
  };
}

export function normalizeLachSamenState(input: unknown): LachSamenState {
  const result = lachSamenStateSchema.safeParse(input);
  if (result.success) return result.data;
  return createInitialLachSamenState();
}

export function lachSamenReducer(
  current: LachSamenState,
  action: LachSamenAction,
): LachSamenState {
  switch (action.type) {
    case "lach-samen.answer.submitted": {
      const existing = current.answersByPlayer[action.actorId] ?? [];
      if (existing.length > action.qIdx) return current; // already answered
      const updated = [...existing];
      updated[action.qIdx] = action.choice;
      return {
        ...current,
        answersByPlayer: {
          ...current.answersByPlayer,
          [action.actorId]: updated,
        },
      };
    }
    case "lach-samen.game.completed":
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

export function addDeveloperLachSamenPartner(
  state: LachSamenState,
  action: LachSamenAction,
  partnerId: string,
): LachSamenState {
  if (action.type === "lach-samen.answer.submitted") {
    const existing = state.answersByPlayer[partnerId] ?? [];
    if (existing.length > action.qIdx) return state;
    const updated = [...existing];
    updated[action.qIdx] = Math.random() < 0.5 ? "a" : "b";
    return {
      ...state,
      answersByPlayer: {
        ...state.answersByPlayer,
        [partnerId]: updated,
      },
    };
  }
  if (action.type === "lach-samen.game.completed") {
    if (state.completedInstallationIds.includes(partnerId)) return state;
    return {
      ...state,
      completedInstallationIds: [...state.completedInstallationIds, partnerId],
    };
  }
  return state;
}
