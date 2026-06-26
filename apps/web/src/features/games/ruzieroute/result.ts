import {
  accelerations,
  endpoints,
  exits,
  inners,
  interpretations,
  needs,
  outers,
  triggers,
  type OuterId,
  type ProtectionRoute,
} from "./content";
import type { RuzieroutePersonal, RuzierouteState } from "./contracts";

const routeLabels: Record<ProtectionRoute, string> = {
  vechten: "komt naar voren om niet machteloos te worden",
  vluchten: "neemt afstand om niet overspoeld te raken",
  bevriezen: "blokkeert wanneer het te veel wordt",
  pleasen: "past zich aan om verbinding niet te verliezen",
};

function dominantProtection(outerIds: OuterId[]) {
  const counts: Record<ProtectionRoute, number> = {
    vechten: 0,
    vluchten: 0,
    bevriezen: 0,
    pleasen: 0,
  };
  outerIds.forEach((id) => {
    counts[outers[id].route] += 1;
  });
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "vechten") as ProtectionRoute;
}

function serializePersonal(personal: RuzieroutePersonal) {
  const protection = dominantProtection(personal.outerIds);
  return {
    ...personal,
    triggers: personal.triggerIds.map((id) => triggers[id]),
    innerReactions: personal.innerIds.map((id) => inners[id]),
    visibleReactions: personal.outerIds.map((id) => ({
      id,
      ...outers[id],
    })),
    interpretation: interpretations[personal.interpretationId],
    needs: personal.needIds.map((id) => needs[id]),
    protectionRoute: protection,
    protectionRouteLabel: routeLabels[protection],
  };
}

export function routeSentence(
  own: RuzieroutePersonal,
  partner?: RuzieroutePersonal,
) {
  const firstTrigger = own.triggerIds[0] ?? "toon";
  const firstOuter = own.outerIds[0] ?? "aandringen";
  const firstPartnerOuter = partner?.outerIds[0] ?? "stilvallen";
  const trigger = triggers[firstTrigger]?.title ?? "spanning";
  const interpretation = interpretations[own.interpretationId];
  const outer = outers[firstOuter]?.title.toLowerCase() ?? "reageren";
  const partnerOuter = partner
    ? outers[firstPartnerOuter]?.title.toLowerCase()
    : "anders reageren";
  return `Wanneer ${trigger.toLowerCase()} gebeurt, denk ik: ${interpretation}. Dan ga ik ${outer}. Daardoor kan jij ${partnerOuter}, en zo raken we elkaar sneller kwijt.`;
}

export function serializeRuzierouteResult(
  state: RuzierouteState,
  memberIds: string[] = Object.keys(state.personals),
) {
  const profiles = Object.fromEntries(
    memberIds.map((memberId) => {
      const personal = state.personals[memberId];
      return [
        memberId,
        personal
          ? {
              ...serializePersonal(personal),
              routeSentence: routeSentence(
                personal,
                memberIds
                  .filter((id) => id !== memberId)
                  .map((id) => state.personals[id])
                  .find(Boolean),
              ),
            }
          : null,
      ];
    }),
  );
  const [firstId, secondId] = memberIds;
  const first = firstId ? state.personals[firstId] : undefined;
  const second = secondId ? state.personals[secondId] : undefined;
  return {
    schemaVersion: 1,
    gameId: "onze-ruzieroute",
    profiles,
    couple: state.joint
      ? {
          ...state.joint,
          endpoint: endpoints[state.joint.endpointId],
          acceleration: accelerations[state.joint.accelerationId],
          exit: exits[state.joint.exitId],
          routeSentences: {
            first: first ? routeSentence(first, second) : null,
            second: second ? routeSentence(second, first) : null,
          },
          polarity:
            first && second
              ? `${dominantProtection(first.outerIds)} ↔ ${dominantProtection(
                  second.outerIds,
                )}`
              : null,
        }
      : null,
    raw: {
      personals: state.personals,
      joint: state.joint,
    },
    completedAt: new Date().toISOString(),
  };
}
