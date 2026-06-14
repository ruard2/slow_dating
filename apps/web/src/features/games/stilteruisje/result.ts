import type { StilteruisjeState } from "./contracts";

export function serializeStilteruisjeResult(state: StilteruisjeState) {
  return {
    schemaVersion: 1,
    mixes: state.mixes,
    supportByActor: state.supportByActor,
    completedAt: new Date().toISOString(),
  };
}
