import { dateObjects, maxDateObjects } from "./content";
import type { KleineDateAction, KleineDateState } from "./contracts";
import { kleineDateStateSchema } from "./contracts";

export function createInitialKleineDateState(
  readyInstallationIds: string[] = [],
): KleineDateState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    selections: [],
    summary: "",
    summaryGeneratedBy: null,
    completedIds: [],
  };
}

export function normalizeKleineDateState(input: unknown) {
  const parsed = kleineDateStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialKleineDateState(readyInstallationIds);
}

export function kleineDateReducer(
  current: KleineDateState,
  action: KleineDateAction,
): KleineDateState {
  const state = normalizeKleineDateState(current);
  if (action.type === "kleine-date.object.placed") {
    if (state.summary || state.selections.length >= maxDateObjects) return state;
    if (!dateObjects.some((object) => object.id === action.objectId)) return state;
    if (state.selections.some((selection) => selection.objectId === action.objectId)) {
      return state;
    }
    return {
      ...state,
      selections: [
        ...state.selections,
        {
          objectId: action.objectId,
          actorId: action.actorId,
          turn: state.selections.length,
          placedAt: new Date().toISOString(),
        },
      ],
    };
  }
  if (action.type === "kleine-date.object.removed") {
    if (state.summary) return state;
    const index = state.selections.findLastIndex(
      (selection) => selection.objectId === action.objectId,
    );
    if (index < 0) return state;
    const next = state.selections.filter((_, selectionIndex) => selectionIndex !== index);
    return {
      ...state,
      selections: next.map((selection, turn) => ({ ...selection, turn })),
    };
  }
  if (action.type === "kleine-date.summary.generated") {
    return {
      ...state,
      summary: state.summary || action.summary,
      summaryGeneratedBy: state.summaryGeneratedBy ?? action.actorId,
    };
  }
  if (action.type === "kleine-date.game.completed") {
    return {
      ...state,
      completedIds: [...new Set([...state.completedIds, action.actorId])],
    };
  }
  if (action.type === "kleine-date.game.replayed") return state;
  return state;
}

function hashSeed(seed: string) {
  return [...seed].reduce(
    (value, character) => (value * 33 + character.charCodeAt(0)) >>> 0,
    5381,
  );
}

export function addDeveloperKleineDatePartner(
  state: KleineDateState,
  action: KleineDateAction,
  partnerId: string,
  christianLayer: boolean,
): KleineDateState {
  if (action.type !== "kleine-date.object.placed") {
    if (action.type === "kleine-date.summary.generated") {
      return {
        ...state,
        completedIds: [...new Set([...state.completedIds, partnerId])],
      };
    }
    return state;
  }
  if (state.summary || state.selections.length >= maxDateObjects) return state;
  const used = new Set(state.selections.map((selection) => selection.objectId));
  const pool = dateObjects.filter(
    (object) => !used.has(object.id) && (christianLayer || !object.requiresChristianLayer),
  );
  if (!pool.length) return state;
  const picked = pool[hashSeed(`${action.objectId}:${state.selections.length}`) % pool.length]!;
  return kleineDateReducer(state, {
    type: "kleine-date.object.placed",
    actorId: partnerId,
    objectId: picked.id,
  });
}
