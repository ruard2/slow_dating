import { dateObjects } from "./content";
import type { KleineDateState } from "./contracts";

export function serializeKleineDateResult(state: KleineDateState) {
  const memberIds = [
    ...new Set([
      ...state.readyInstallationIds,
      ...state.selections.map((selection) => selection.actorId),
      ...state.completedIds,
    ]),
  ];
  return {
    schemaVersion: 1,
    gameId: "kleine-date",
    title: "Plan een kleine date",
    chosenObjects: state.selections.map((selection) => {
      const object = dateObjects.find((item) => item.id === selection.objectId);
      return {
        ...selection,
        label: object?.label ?? selection.objectId,
        category: object?.category ?? "Onbekend",
        tags: object?.tags ?? [],
        christian: Boolean(object?.requiresChristianLayer),
      };
    }),
    people: Object.fromEntries(
      memberIds.map((id) => [
        id,
        {
          objectIds: state.selections
            .filter((selection) => selection.actorId === id)
            .map((selection) => selection.objectId),
          completed: state.completedIds.includes(id),
        },
      ]),
    ),
    summary: state.summary,
    completedAt: new Date().toISOString(),
  };
}
