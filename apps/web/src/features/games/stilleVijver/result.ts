import type { StilleVijverState } from "./contracts";

export function serializeStilleVijverResult(state: StilleVijverState) {
  return {
    schemaVersion: 1,
    choiceByPlayer: state.choiceByPlayer,
    reflectieByPlayer: state.reflectieByPlayer,
    completedAt: new Date().toISOString(),
  };
}
