import type { RuzierouteAction, RuzierouteState } from "./contracts";
import { ruzierouteStateSchema } from "./contracts";

export function createInitialRuzierouteState(
  readyInstallationIds: string[] = [],
): RuzierouteState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    introSeenIds: [],
    personals: {},
    joint: null,
  };
}

export function normalizeRuzierouteState(input: unknown): RuzierouteState {
  const parsed = ruzierouteStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialRuzierouteState(readyInstallationIds);
}

function addOnce(values: string[], actorId: string) {
  return [...new Set([...values, actorId])];
}

export function ruzierouteReducer(
  current: RuzierouteState,
  action: RuzierouteAction,
): RuzierouteState {
  const state = normalizeRuzierouteState(current);
  if (action.type === "ruzieroute.intro.seen") {
    return {
      ...state,
      introSeenIds: addOnce(state.introSeenIds, action.actorId),
    };
  }
  if (action.type === "ruzieroute.personal.submitted") {
    return {
      ...state,
      personals: {
        ...state.personals,
        [action.actorId]: action.personal,
      },
    };
  }
  if (action.type === "ruzieroute.joint.submitted") {
    return {
      ...state,
      joint: action.joint,
    };
  }
  return state;
}

export function addDeveloperRuzieroutePartner(
  state: RuzierouteState,
  action: RuzierouteAction,
  partnerId: string,
) {
  if (action.type === "ruzieroute.intro.seen") {
    return ruzierouteReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "ruzieroute.personal.submitted") {
    return ruzierouteReducer(state, {
      ...action,
      actorId: partnerId,
      personal: {
        triggerIds: ["druk", "toon"],
        innerIds: ["schaamte", "machteloos", "angst"],
        outerIds: ["stilvallen", "kort", "terugtrekken"],
        interpretationId: "laat-alleen",
        needIds: ["ruimte", "veiligheid"],
        hiddenMeaning:
          "Ik trek me terug omdat het snel te veel wordt. Niet omdat jij mij niets doet, maar omdat ik bang ben dat ik het erger maak.",
      },
    });
  }
  return state;
}
