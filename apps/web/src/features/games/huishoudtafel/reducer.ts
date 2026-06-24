import {
  comparisonReactions,
  experimentTemplates,
  houseTasks,
  ownershipParts,
} from "./content";
import type {
  HuishoudtafelAction,
  HuishoudtafelState,
  TaskOwner,
  TaskPlacement,
} from "./contracts";
import { huishoudtafelStateSchema } from "./contracts";

export function createInitialHuishoudtafelState(
  readyInstallationIds: string[] = [],
): HuishoudtafelState {
  return {
    schemaVersion: 2,
    readyInstallationIds,
    placementsByPerson: {},
    skippedByPerson: {},
    submittedIds: [],
    comparisonReactions: {},
    comparisonSubmittedIds: [],
    ownershipDetailsByPerson: {},
    detailsSubmittedIds: [],
    faithByPerson: {},
    faithSubmittedIds: [],
    experiments: [],
    experimentConfirmedIds: [],
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

export function handledTaskIds(state: HuishoudtafelState, actorId: string) {
  return new Set([
    ...Object.keys(state.placementsByPerson[actorId] ?? {}),
    ...(state.skippedByPerson[actorId] ?? []),
  ]);
}

export function getComparisonTaskIds(
  state: HuishoudtafelState,
  firstId: string,
  secondId: string,
  limit = 5,
) {
  const first = state.placementsByPerson[firstId] ?? {};
  const second = state.placementsByPerson[secondId] ?? {};
  const firstSkipped = new Set(state.skippedByPerson[firstId] ?? []);
  const secondSkipped = new Set(state.skippedByPerson[secondId] ?? []);
  return houseTasks
    .map((task, index) => {
      const a = first[task.id];
      const b = second[task.id];
      let score = 0;
      if (Boolean(a) !== Boolean(b)) score += 6;
      if (firstSkipped.has(task.id) !== secondSkipped.has(task.id)) score += 5;
      if (a && b && a.owner !== b.owner) score += 4;
      if (a && b && a.rhythm !== b.rhythm) score += 2;
      return { id: task.id, score, index };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.id);
}

export function huishoudtafelReducer(
  current: HuishoudtafelState,
  action: HuishoudtafelAction,
): HuishoudtafelState {
  const state = normalizeHuishoudtafelState(current);
  if (
    action.type === "huishoudtafel.game.completed" ||
    action.type === "huishoudtafel.game.replayed"
  ) {
    return state;
  }
  if (action.type === "huishoudtafel.task.placed") {
    if (state.submittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      placementsByPerson: {
        ...state.placementsByPerson,
        [action.actorId]: {
          ...(state.placementsByPerson[action.actorId] ?? {}),
          [action.taskId]: {
            owner: action.owner,
            rhythm: action.rhythm,
          },
        },
      },
      skippedByPerson: {
        ...state.skippedByPerson,
        [action.actorId]: (state.skippedByPerson[action.actorId] ?? []).filter(
          (id) => id !== action.taskId,
        ),
      },
    };
  }
  if (action.type === "huishoudtafel.task.skipped") {
    if (state.submittedIds.includes(action.actorId)) return state;
    const placements = { ...(state.placementsByPerson[action.actorId] ?? {}) };
    delete placements[action.taskId];
    return {
      ...state,
      placementsByPerson: {
        ...state.placementsByPerson,
        [action.actorId]: placements,
      },
      skippedByPerson: {
        ...state.skippedByPerson,
        [action.actorId]: [
          ...new Set([
            ...(state.skippedByPerson[action.actorId] ?? []),
            action.taskId,
          ]),
        ],
      },
    };
  }
  if (action.type === "huishoudtafel.distribution.submitted") {
    const requiredTaskIds = action.requiredTaskIds ?? houseTasks.map((task) => task.id);
    const handled = handledTaskIds(state, action.actorId);
    if (requiredTaskIds.some((taskId) => !handled.has(taskId))) {
      return state;
    }
    return {
      ...state,
      submittedIds: [...new Set([...state.submittedIds, action.actorId])],
    };
  }
  if (action.type === "huishoudtafel.comparison.reacted") {
    return {
      ...state,
      comparisonReactions: {
        ...state.comparisonReactions,
        [action.actorId]: {
          ...(state.comparisonReactions[action.actorId] ?? {}),
          [action.taskId]: action.reaction,
        },
      },
    };
  }
  if (action.type === "huishoudtafel.comparison.submitted") {
    return {
      ...state,
      comparisonSubmittedIds: [
        ...new Set([...state.comparisonSubmittedIds, action.actorId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.ownership.set") {
    return {
      ...state,
      ownershipDetailsByPerson: {
        ...state.ownershipDetailsByPerson,
        [action.actorId]: {
          ...(state.ownershipDetailsByPerson[action.actorId] ?? {}),
          [action.taskId]: {
            notice:
              state.ownershipDetailsByPerson[action.actorId]?.[action.taskId]
                ?.notice ?? "self",
            plan:
              state.ownershipDetailsByPerson[action.actorId]?.[action.taskId]
                ?.plan ?? "self",
            execute:
              state.ownershipDetailsByPerson[action.actorId]?.[action.taskId]
                ?.execute ?? "self",
            [action.part]: action.owner,
          },
        },
      },
    };
  }
  if (action.type === "huishoudtafel.details.submitted") {
    return {
      ...state,
      detailsSubmittedIds: [
        ...new Set([...state.detailsSubmittedIds, action.actorId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.faith.submitted") {
    return {
      ...state,
      faithByPerson: {
        ...state.faithByPerson,
        [action.actorId]: {
          taskId: action.taskId,
          risk: action.risk,
          reflection: action.reflection.trim(),
        },
      },
      faithSubmittedIds: [
        ...new Set([...state.faithSubmittedIds, action.actorId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.experiments.proposed") {
    return {
      ...state,
      experiments: action.experiments.map((experiment) => ({
        ...experiment,
        proposedBy: action.actorId,
      })),
      experimentConfirmedIds: [],
    };
  }
  if (action.type === "huishoudtafel.experiments.confirmed") {
    if (!state.experiments.length) return state;
    return {
      ...state,
      experimentConfirmedIds: [
        ...new Set([...state.experimentConfirmedIds, action.actorId]),
      ],
    };
  }
  return state;
}

function opposite(owner: TaskOwner): TaskOwner {
  return owner === "self" ? "partner" : "self";
}

export function addDeveloperHuishoudtafelPartner(
  state: HuishoudtafelState,
  action: HuishoudtafelAction,
  partnerId: string,
) {
  if (action.type === "huishoudtafel.distribution.submitted") {
    const own = state.placementsByPerson[action.actorId] ?? {};
    const partnerPlacements: Record<string, TaskPlacement> = {};
    const partnerSkipped: string[] = [];
    const requiredTaskIds = action.requiredTaskIds ?? houseTasks.map((task) => task.id);
    const tasks = requiredTaskIds
      .map((taskId) => houseTasks.find((task) => task.id === taskId))
      .filter((task): task is (typeof houseTasks)[number] => Boolean(task));
    tasks.forEach((task, index) => {
      const placement = own[task.id];
      if (!placement) {
        if (index % 4 === 0) {
          partnerPlacements[task.id] = {
            owner: index % 2 ? "self" : "partner",
            rhythm: task.rhythm,
          };
        } else {
          partnerSkipped.push(task.id);
        }
        return;
      }
      partnerPlacements[task.id] = {
        owner: index % 5 === 0 ? opposite(placement.owner) : placement.owner,
        rhythm:
          index % 7 === 0
            ? placement.rhythm === "daily"
              ? "weekly"
              : "sometimes"
            : placement.rhythm,
      };
    });
    return {
      ...state,
      placementsByPerson: {
        ...state.placementsByPerson,
        [partnerId]: partnerPlacements,
      },
      skippedByPerson: {
        ...state.skippedByPerson,
        [partnerId]: partnerSkipped,
      },
      submittedIds: [...new Set([...state.submittedIds, partnerId])],
    };
  }
  if (action.type === "huishoudtafel.comparison.submitted") {
    const memberIds = [action.actorId, partnerId];
    const taskIds = getComparisonTaskIds(
      state,
      memberIds[0]!,
      memberIds[1]!,
    );
    return {
      ...state,
      comparisonReactions: {
        ...state.comparisonReactions,
        [partnerId]: Object.fromEntries(
          taskIds.map((id, index) => [
            id,
            comparisonReactions[(index + 1) % comparisonReactions.length],
          ]),
        ) as Record<string, string>,
      },
      comparisonSubmittedIds: [
        ...new Set([...state.comparisonSubmittedIds, partnerId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.details.submitted") {
    const taskIds = Object.keys(
      state.ownershipDetailsByPerson[action.actorId] ?? {},
    );
    return {
      ...state,
      ownershipDetailsByPerson: {
        ...state.ownershipDetailsByPerson,
        [partnerId]: Object.fromEntries(
          taskIds.map((taskId, index) => [
            taskId,
            Object.fromEntries(
              ownershipParts.map((part, partIndex) => [
                part.id,
                (index + partIndex) % 3 === 0 ? "partner" : "self",
              ]),
            ),
          ]),
        ) as Record<
          string,
          { notice: TaskOwner; plan: TaskOwner; execute: TaskOwner }
        >,
      },
      detailsSubmittedIds: [
        ...new Set([...state.detailsSubmittedIds, partnerId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.faith.submitted") {
    return {
      ...state,
      faithByPerson: {
        ...state.faithByPerson,
        [partnerId]: {
          taskId: action.taskId,
          risk: "Onzichtbaarheid",
          reflection: "",
        },
      },
      faithSubmittedIds: [
        ...new Set([...state.faithSubmittedIds, partnerId]),
      ],
    };
  }
  if (action.type === "huishoudtafel.experiments.proposed") {
    return {
      ...state,
      experiments:
        state.experiments.length > 0
          ? state.experiments
          : [
              {
                taskId: action.experiments[0]?.taskId ?? houseTasks[0]!.id,
                text:
                  action.experiments[0]?.text ?? experimentTemplates[0]!,
                proposedBy: action.actorId,
              },
            ],
      experimentConfirmedIds: [],
    };
  }
  if (action.type === "huishoudtafel.experiments.confirmed") {
    return huishoudtafelReducer(state, {
      type: "huishoudtafel.experiments.confirmed",
      actorId: partnerId,
    });
  }
  return state;
}
