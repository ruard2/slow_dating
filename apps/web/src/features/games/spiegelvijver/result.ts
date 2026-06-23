import type { SpiegelvijverState } from "./contracts";

export function serializeSpiegelvijverResult(state: SpiegelvijverState) {
  return {
    schemaVersion: 1,
    selfPortraits: state.selfPortraits,
    observations: state.observations,
    recognitions: state.recognitions,
    completedAt: new Date().toISOString(),
  };
}
