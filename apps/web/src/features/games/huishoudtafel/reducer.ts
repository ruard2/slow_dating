import type {
  HuishoudtafelAction,
  HuishoudtafelState,
  TaskDistribution,
} from "./contracts";
import { huishoudtafelStateSchema } from "./contracts";

export function createInitialHuishoudtafelState(
  readyInstallationIds: string[] = [],
): HuishoudtafelState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    distributions: {},
    discussionDoneIds: [],
  };
}

export function normalizeHuishoudtafelState(input: unknown) {
  const parsed = huishoudtafelStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialHuishoudtafelState(readyInstallationIds);
}

export function huishoudtafelReducer(
  current: HuishoudtafelState,
  action: HuishoudtafelAction,
): HuishoudtafelState {
  const state = normalizeHuishoudtafelState(current);
  if (
    action.type === "huishoudtafel.game.completed" ||
    state.discussionDoneIds.includes(action.actorId)
  ) {
    return state;
  }

  if (action.type === "huishoudtafel.task.categorized") {
    const currentDist = state.distributions[action.actorId] ?? {};
    return {
      ...state,
      distributions: {
        ...state.distributions,
        [action.actorId]: {
          ...currentDist,
          [action.taskId]: action.category,
        },
      },
    };
  }

  if (action.type === "huishoudtafel.distribution.submitted") {
    return state;
  }

  return {
    ...state,
    discussionDoneIds: [
      ...new Set([...state.discussionDoneIds, action.actorId]),
    ],
  };
}

export function addDeveloperHuishoudtafelPartner(
  state: HuishoudtafelState,
  action: HuishoudtafelAction,
  partnerId: string,
) {
  if (action.type === "huishoudtafel.distribution.submitted") {
    const own = state.distributions[action.actorId];
    if (!own) return state;
    const partnerDist: TaskDistribution = {};
    for (const taskId of Object.keys(own)) {
      const ownCat = own[taskId];
      if (ownCat === "enjoy") partnerDist[taskId] = "draining";
      else if (ownCat === "draining") partnerDist[taskId] = "avoid";
      else partnerDist[taskId] = "enjoy";
    }
    return {
      ...state,
      distributions: {
        ...state.distributions,
        [partnerId]: partnerDist,
      },
    };
  }
  if (action.type === "huishoudtafel.discussion.done") {
    return huishoudtafelReducer(state, { ...action, actorId: partnerId });
  }
  return state;
}