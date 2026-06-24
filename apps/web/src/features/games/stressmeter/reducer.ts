import type {
  StressmeterAction,
  StressmeterState,
} from "./contracts";
import { stressmeterStateSchema } from "./contracts";

export function createInitialStressmeterState(
  readyInstallationIds: string[] = [],
): StressmeterState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    roundsByPerson: {},
    completedIds: [],
  };
}

export function normalizeStressmeterState(input: unknown) {
  const parsed = stressmeterStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialStressmeterState(readyInstallationIds);
}

export function stressmeterReducer(
  current: StressmeterState,
  action: StressmeterAction,
): StressmeterState {
  const state = normalizeStressmeterState(current);
  if (action.type === "stressmeter.round.finished") {
    const existing = state.roundsByPerson[action.actorId] ?? [];
    if (existing.some((round) => round.roundId === action.summary.roundId)) {
      return state;
    }
    return {
      ...state,
      roundsByPerson: {
        ...state.roundsByPerson,
        [action.actorId]: [...existing, action.summary],
      },
    };
  }
  if (action.type === "stressmeter.game.completed") {
    return {
      ...state,
      completedIds: [...new Set([...state.completedIds, action.actorId])],
    };
  }
  if (action.type === "stressmeter.game.replayed") {
    return state;
  }
  return state;
}

export function addDeveloperStressmeterPartner(
  state: StressmeterState,
  action: StressmeterAction,
  partnerId: string,
): StressmeterState {
  if (action.type === "stressmeter.round.finished") {
    const partnerRounds = state.roundsByPerson[partnerId] ?? [];
    const partnerSummary = {
      ...action.summary,
      roundId: `${action.summary.roundId}-partner`,
      actorId: partnerId,
      winner: action.summary.winner === "self" ? "partner" : "self",
      selfHitsTaken: action.summary.partnerHitsTaken,
      partnerHitsTaken: action.summary.selfHitsTaken,
      shotsFired: Math.max(5, action.summary.shotsFired - 2),
      stressSignals: {
        riskTaking: Math.max(15, 100 - action.summary.stressSignals.riskTaking),
        distanceKeeping: Math.max(
          10,
          100 - action.summary.stressSignals.distanceKeeping,
        ),
        pressureBursts: Math.max(
          0,
          action.summary.stressSignals.pressureBursts - 1,
        ),
      },
    } as const;
    return {
      ...state,
      roundsByPerson: {
        ...state.roundsByPerson,
        [partnerId]: partnerRounds.some(
          (round) => round.roundId === partnerSummary.roundId,
        )
          ? partnerRounds
          : [...partnerRounds, partnerSummary],
      },
    };
  }
  if (action.type === "stressmeter.game.completed") {
    return {
      ...state,
      completedIds: [...new Set([...state.completedIds, partnerId])],
    };
  }
  return state;
}
