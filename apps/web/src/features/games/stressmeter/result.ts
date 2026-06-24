import { obstacleCatalog, powerUps } from "./content";
import type { StressmeterState } from "./contracts";

export function serializeStressmeterResult(state: StressmeterState) {
  const memberIds = [
    ...new Set([
      ...state.readyInstallationIds,
      ...Object.keys(state.roundsByPerson),
      ...state.completedIds,
    ]),
  ];
  return {
    schemaVersion: 1,
    gameId: "stressmeter",
    title: "De Spanningsvlucht",
    catalog: {
      powerUps: powerUps.map((item) => ({
        id: item.id,
        label: item.label,
        description: item.description,
      })),
      obstacles: obstacleCatalog.map((item) => ({
        id: item.id,
        label: item.label,
      })),
    },
    people: Object.fromEntries(
      memberIds.map((id) => [
        id,
        {
          rounds: state.roundsByPerson[id] ?? [],
          completed: state.completedIds.includes(id),
        },
      ]),
    ),
    completedAt: new Date().toISOString(),
  };
}
