import { missions } from "./content";
import type { VrolijkeOpenPlekState } from "./contracts";
import { selectedMission } from "./reducer";

const missionTitle = (id: string) =>
  missions.find((mission) => mission.id === id)?.title ?? id;

export function serializeVrolijkeOpenPlekResult(
  state: VrolijkeOpenPlekState,
  memberIds: string[],
) {
  const selected = selectedMission(state, memberIds);
  return {
    schemaVersion: 1,
    selectedMission: selected,
    // Leesbare titels naast de kale ids, zodat de profiel-AI ze begrijpt.
    selectedMissionTitle: selected ? missionTitle(selected) : null,
    completedMissionTitles: state.completedMissionIds.map(missionTitle),
    completedMissionIds: state.completedMissionIds,
    missionChoices: state.missionChoices,
    reflections: state.reflections,
    playSignals: {
      bluffGuesses: state.bluffGuesses,
      duelChoices: state.duelChoices,
      setbackChoices: state.setbackChoices,
      racePositions: state.racePositions,
      raceHitCounts: state.raceHitCounts,
      raceWinnerId: state.raceWinnerId,
      tictactoeTurns: state.tictactoeTurn,
    },
    completedAt: new Date().toISOString(),
  };
}
