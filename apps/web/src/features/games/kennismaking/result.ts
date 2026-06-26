import type { KennismakingState } from "./contracts";

export function serializeKennismakingResult(state: KennismakingState) {
  return {
    schemaVersion: 1,
    duurByPlayer: state.duurByPlayer,
    kennisByPlayer: state.kennisByPlayer,
    quizScores: state.quizScores,
    raadScore: state.raadScore,
    completedAt: new Date().toISOString(),
  };
}
