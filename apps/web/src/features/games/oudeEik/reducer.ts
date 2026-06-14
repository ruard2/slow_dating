import type { OudeEikAction, OudeEikState } from "./contracts";
import { oudeEikStateSchema } from "./contracts";

export function createInitialOudeEikState(
  readyInstallationIds: string[] = [],
): OudeEikState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    portraits: {},
    understoodIds: [],
    conversationDoneIds: [],
  };
}

export function normalizeOudeEikState(input: unknown) {
  const parsed = oudeEikStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialOudeEikState(readyInstallationIds);
}

export function oudeEikReducer(
  current: OudeEikState,
  action: OudeEikAction,
): OudeEikState {
  const state = normalizeOudeEikState(current);
  if (action.type === "oude-eik.portrait.submitted") {
    return {
      ...state,
      portraits: { ...state.portraits, [action.actorId]: action.portrait },
    };
  }
  if (action.type === "oude-eik.understood") {
    return {
      ...state,
      understoodIds: [...new Set([...state.understoodIds, action.actorId])],
    };
  }
  if (action.type === "oude-eik.conversation.done") {
    return {
      ...state,
      conversationDoneIds: [
        ...new Set([...state.conversationDoneIds, action.actorId]),
      ],
    };
  }
  return state;
}

export function addDeveloperOudeEikPartner(
  state: OudeEikState,
  action: OudeEikAction,
  partnerId: string,
) {
  if (action.type === "oude-eik.portrait.submitted") {
    return oudeEikReducer(state, {
      ...action,
      actorId: partnerId,
      portrait: {
        atmosphere: "warm",
        message: "keep-peace",
        role: "peacemaker",
        response: "withdraw",
        need: "gentleness",
        keep: "De vanzelfsprekende zorg voor elkaar.",
        change: "Eerder zeggen wat er werkelijk in mij gebeurt.",
      },
    });
  }
  if (
    action.type === "oude-eik.understood" ||
    action.type === "oude-eik.conversation.done"
  ) {
    return oudeEikReducer(state, { ...action, actorId: partnerId });
  }
  return state;
}
