import type { GrenzenTempoState } from "./contracts";

export function serializeGrenzenTempoResult(state: GrenzenTempoState) {
  return {
    schemaVersion: 1,
    boundaryAnswers: state.boundaryAnswers,
    tempoAnswers: state.tempoAnswers,
    smallNos: state.smallNos,
    smallNoResponses: state.smallNoResponses,
    completedAt: new Date().toISOString(),
  };
}

