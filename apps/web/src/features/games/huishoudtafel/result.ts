import { houseTasks, taskById } from "./content";
import type { HuishoudtafelState } from "./contracts";
import { getComparisonTaskIds } from "./reducer";

export function serializeHuishoudtafelResult(state: HuishoudtafelState) {
  const memberIds = [
    ...new Set([
      ...state.readyInstallationIds,
      ...Object.keys(state.placementsByPerson),
      ...state.submittedIds,
    ]),
  ];
  const [firstId = "", secondId = ""] = memberIds;
  const comparisonTaskIds =
    firstId && secondId
      ? getComparisonTaskIds(state, firstId, secondId, houseTasks.length)
      : [];
  return {
    schemaVersion: 2,
    gameId: "huishoudtafel",
    taskCatalog: houseTasks.map((task) => ({
      id: task.id,
      label: task.label,
      defaultRhythm: task.rhythm,
      detail: task.detail,
    })),
    people: Object.fromEntries(
      memberIds.map((id) => [
        id,
        {
          placements: state.placementsByPerson[id] ?? {},
          skippedTaskIds: state.skippedByPerson[id] ?? [],
          comparisonReactions: state.comparisonReactions[id] ?? {},
          ownershipDetails: state.ownershipDetailsByPerson[id] ?? {},
          faithReflection: state.faithByPerson[id] ?? null,
        },
      ]),
    ),
    differences: comparisonTaskIds.map((taskId) => ({
      taskId,
      taskLabel: taskById(taskId)?.label ?? taskId,
      placementsByPerson: Object.fromEntries(
        memberIds.map((id) => [
          id,
          state.placementsByPerson[id]?.[taskId] ?? null,
        ]),
      ),
      skippedByPerson: Object.fromEntries(
        memberIds.map((id) => [
          id,
          (state.skippedByPerson[id] ?? []).includes(taskId),
        ]),
      ),
      reactionsByPerson: Object.fromEntries(
        memberIds.map((id) => [
          id,
          state.comparisonReactions[id]?.[taskId] ?? null,
        ]),
      ),
    })),
    acceptedExperiments:
      state.experiments.length &&
      memberIds.every((id) => state.experimentConfirmedIds.includes(id))
        ? state.experiments
        : [],
    completedAt: new Date().toISOString(),
  };
}
