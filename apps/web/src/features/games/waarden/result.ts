import type { WaardenResult, WaardenState } from "./contracts";
import { sharedValues } from "./selectors";

export function serializeWaardenResult(
  state: WaardenState,
  memberIds = Object.keys(state.selections),
): WaardenResult {
  return {
    schemaVersion: 1,
    selections: state.selections as WaardenResult["selections"],
    sharedValues: sharedValues(state, memberIds),
    completedAt: new Date().toISOString(),
  };
}
