import type {
  OpennessMix,
  StilteruisjeAction,
  StilteruisjeState,
} from "./contracts";
import {
  opennessMixSchema,
  stilteruisjeStateSchema,
} from "./contracts";
import type { NeedId } from "./content";

const defaultNeeds: Record<NeedId, number> = {
  safety: 3,
  time: 3,
  clarity: 3,
  gentleness: 3,
  closeness: 3,
};

export function createInitialStilteruisjeState(
  readyInstallationIds: string[] = [],
): StilteruisjeState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    drafts: {},
    mixes: {},
    supportByActor: {},
    ritualReadyIds: [],
    conversationDoneIds: [],
  };
}

export function normalizeStilteruisjeState(input: unknown) {
  const parsed = stilteruisjeStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialStilteruisjeState(readyInstallationIds);
}

export function stilteruisjeReducer(
  current: StilteruisjeState,
  action: StilteruisjeAction,
): StilteruisjeState {
  const state = normalizeStilteruisjeState(current);
  if (
    action.type === "stilteruisje.game.completed" ||
    state.conversationDoneIds.includes(action.actorId)
  ) {
    return state;
  }

  if (action.type === "stilteruisje.need.changed") {
    const draft = state.drafts[action.actorId] ?? {};
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.actorId]: {
          ...draft,
          needs: {
            ...defaultNeeds,
            ...draft.needs,
            [action.needId]: action.level,
          },
        },
      },
    };
  }

  if (action.type === "stilteruisje.noise.selected") {
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.actorId]: {
          ...(state.drafts[action.actorId] ?? {}),
          noise: action.noise,
        },
      },
    };
  }

  if (action.type === "stilteruisje.invitation.selected") {
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.actorId]: {
          ...(state.drafts[action.actorId] ?? {}),
          invitation: action.invitation,
        },
      },
    };
  }

  if (action.type === "stilteruisje.mix.submitted") {
    const draft = state.drafts[action.actorId] ?? {};
    const parsed = opennessMixSchema.safeParse({
      ...draft,
      needs: { ...defaultNeeds, ...draft.needs },
    });
    if (!parsed.success) return state;
    return {
      ...state,
      mixes: { ...state.mixes, [action.actorId]: parsed.data },
    };
  }

  if (action.type === "stilteruisje.support.selected") {
    return {
      ...state,
      supportByActor: {
        ...state.supportByActor,
        [action.actorId]: action.support,
      },
    };
  }

  if (action.type === "stilteruisje.ritual.ready") {
    return {
      ...state,
      ritualReadyIds: [
        ...new Set([...state.ritualReadyIds, action.actorId]),
      ],
    };
  }

  return {
    ...state,
    conversationDoneIds: [
      ...new Set([...state.conversationDoneIds, action.actorId]),
    ],
  };
}

export function addDeveloperStilteruisjePartner(
  state: StilteruisjeState,
  action: StilteruisjeAction,
  partnerId: string,
) {
  if (action.type === "stilteruisje.mix.submitted") {
    const own = state.mixes[action.actorId];
    if (!own) return state;
    const partnerMix: OpennessMix = {
      needs: Object.fromEntries(
        Object.entries(own.needs).map(([id, level]) => [
          id,
          Math.max(1, Math.min(5, level + (id === "time" ? 1 : -1))),
        ]),
      ) as typeof own.needs,
      noise: own.noise === "haste" ? "advice" : "haste",
      invitation: own.invitation === "walk" ? "quiet" : "walk",
    };
    return {
      ...state,
      mixes: {
        ...state.mixes,
        [partnerId]: partnerMix,
      },
    };
  }
  if (action.type === "stilteruisje.support.selected") {
    return stilteruisjeReducer(state, {
      ...action,
      actorId: partnerId,
      support: action.support === "listen" ? "slow" : "listen",
    });
  }
  if (
    action.type === "stilteruisje.ritual.ready" ||
    action.type === "stilteruisje.conversation.done"
  ) {
    return stilteruisjeReducer(state, { ...action, actorId: partnerId });
  }
  return state;
}
