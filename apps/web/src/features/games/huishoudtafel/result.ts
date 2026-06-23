import type { HuishoudtafelState } from "./contracts";

export function serializeHuishoudtafelResult(state: HuishoudtafelState) {
  return {
    schemaVersion: 1,
    distributions: state.distributions,
    completedAt: new Date().toISOString(),
  };
}