import type { FamiliedorpState } from "./contracts";

export function serializeFamiliedorpResult(state: FamiliedorpState) {
  return {
    schemaVersion: 1,
    villageByPlayer: state.villageByPlayer,
    completedAt: new Date().toISOString(),
  };
}
