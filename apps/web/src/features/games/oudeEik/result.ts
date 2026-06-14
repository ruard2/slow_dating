import type { OudeEikState } from "./contracts";

export function serializeOudeEikResult(state: OudeEikState) {
  return {
    schemaVersion: 1,
    portraits: state.portraits,
    completedAt: new Date().toISOString(),
  };
}
