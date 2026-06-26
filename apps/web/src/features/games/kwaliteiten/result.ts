import type { KwaliteitenState } from "./contracts";

export function serializeKwaliteitenResult(state: KwaliteitenState) {
  const entries = Object.entries(state.selectionByPlayer);
  const [firstId, firstSel] = entries[0] ?? [];
  const [secondId, secondSel] = entries[1] ?? [];
  return {
    schemaVersion: 1,
    own:
      firstId && firstSel
        ? { kwaliteiten: firstSel.kwaliteiten, allergie: firstSel.allergie }
        : null,
    partner:
      secondId && secondSel
        ? { kwaliteiten: secondSel.kwaliteiten, allergie: secondSel.allergie }
        : null,
    completedAt: new Date().toISOString(),
  };
}
