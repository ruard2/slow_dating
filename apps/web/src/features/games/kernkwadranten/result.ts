import type { KernkwadrantenState } from "./contracts";

export function serializeKernkwadrantenResult(state: KernkwadrantenState) {
  return {
    schemaVersion: 1,
    profiles: state.profiles,
    rounds: state.rounds,
    completedAt: new Date().toISOString(),
  };
}
