import type { VrolijkeOpenPlekState } from "./contracts";
import { selectedMission } from "./reducer";

export function serializeVrolijkeOpenPlekResult(
  state: VrolijkeOpenPlekState,
  memberIds: string[],
) {
  return {
    schemaVersion: 1,
    selectedMission: selectedMission(state, memberIds),
    missionChoices: state.missionChoices,
    reflections: state.reflections,
    playSignals: {
      bluffGuesses: state.bluffGuesses,
      duelChoices: state.duelChoices,
      setbackChoices: state.setbackChoices,
      tictactoeTurns: state.tictactoeTurn,
    },
    completedAt: new Date().toISOString(),
  };
}
