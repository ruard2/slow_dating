import {
  cases,
  domains,
  needs,
  protections,
  reactions,
} from "./content";
import type { OudeKnoppenState } from "./contracts";

export function serializeOudeKnoppenResult(
  state: OudeKnoppenState,
  memberIds: string[] = Object.keys(state.reflections),
) {
  const profiles = Object.fromEntries(
    memberIds.map((memberId) => {
      const selection = state.selections[memberId];
      const reflection = state.reflections[memberId];
      const repair = state.repairs[memberId];
      const selectedCase = selection
        ? cases.find((item) => item.id === selection.caseId)
        : undefined;
      return [
        memberId,
        {
          selection: selection
            ? {
                ...selection,
                domain: domains[selection.domainId],
                case: selectedCase ?? null,
              }
            : null,
          reflection: reflection
            ? {
                ...reflection,
                reaction: reactions[reflection.reactionId],
                need: needs[reflection.needId],
                protection: protections[reflection.protectionId],
              }
            : null,
          repair: repair ?? null,
        },
      ];
    }),
  );

  const sharedDomains = memberIds
    .map((id) => state.selections[id]?.domainId)
    .filter(Boolean);
  const sharedNeeds = memberIds
    .map((id) => state.reflections[id]?.needId)
    .filter(Boolean);
  const sharedProtections = memberIds
    .map((id) => state.reflections[id]?.protectionId)
    .filter(Boolean);

  return {
    schemaVersion: 1,
    gameId: "oude-knoppen-conflict",
    profiles,
    couple: {
      selectedDomains: sharedDomains,
      needs: sharedNeeds,
      protections: sharedProtections,
      overlap: {
        sameDomain: new Set(sharedDomains).size === 1 && sharedDomains.length > 1,
        sameNeed: new Set(sharedNeeds).size === 1 && sharedNeeds.length > 1,
        sameProtection:
          new Set(sharedProtections).size === 1 && sharedProtections.length > 1,
      },
    },
    raw: {
      selections: state.selections,
      reflections: state.reflections,
      repairs: state.repairs,
    },
    completedAt: new Date().toISOString(),
  };
}
