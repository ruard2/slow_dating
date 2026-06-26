import type { LachSamenState } from "./contracts";

export function serializeLachSamenResult(state: LachSamenState) {
  return {
    schemaVersion: 1,
    questionSeed: state.questionSeed,
    answersByPlayer: state.answersByPlayer,
    completedAt: new Date().toISOString(),
  };
}
