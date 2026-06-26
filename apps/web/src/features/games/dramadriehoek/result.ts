import {
  costs,
  feelings,
  gains,
  invitedRoles,
  pulls,
  roles,
  scenes,
  shifts,
} from "./content";
import type { DramadriehoekProfile, DramadriehoekState } from "./contracts";

function serializeProfile(profile: DramadriehoekProfile) {
  return {
    ...profile,
    roleLabel: roles[profile.role].title,
    roleLine: roles[profile.role].line,
    roleDescription: roles[profile.role].description,
    adultMovePreview: roles[profile.role].adultMove,
    invitedRolePattern: invitedRoles[profile.role],
    scenes: profile.sceneIds.map((id) => ({ id, ...scenes[id] })),
    sceneResponses: Object.fromEntries(
      profile.sceneIds.map((id) => [
        id,
        {
          scene: scenes[id],
          feelings: (profile.sceneResponses[id]?.feelingIds ?? []).map((feelingId) => feelings[feelingId]),
          pulls: (profile.sceneResponses[id]?.pullIds ?? []).map((pullId) => pulls[pullId]),
        },
      ]),
    ),
    feelings: profile.feelingIds.map((id) => feelings[id]),
    pulls: profile.pullIds.map((id) => pulls[id]),
    gains: profile.gainIds.map((id) => gains[id]),
    costs: profile.costIds.map((id) => costs[id]),
    shift: shifts[profile.shiftId],
  };
}

export function serializeDramadriehoekResult(
  state: DramadriehoekState,
  memberIds: string[] = Object.keys(state.profiles),
) {
  const profiles = Object.fromEntries(
    memberIds.map((memberId) => [
      memberId,
      state.profiles[memberId]
        ? serializeProfile(state.profiles[memberId])
        : null,
    ]),
  );
  const roleCounts = memberIds.reduce<Record<string, number>>((acc, memberId) => {
    const role = state.profiles[memberId]?.role;
    if (role) acc[role] = (acc[role] ?? 0) + 1;
    return acc;
  }, {});
  return {
    schemaVersion: 1,
    gameId: "dramadriehoek",
    profiles,
    couple: {
      roleCounts,
      sharedRoles: Object.entries(roleCounts)
        .filter(([, count]) => count > 1)
        .map(([role]) => role),
      nextGameHint:
        "Op kaart 5 oefenen jullie in 'Uit de Driehoek' de beweging naar de volwassen plek.",
    },
    raw: { profiles: state.profiles },
    completedAt: new Date().toISOString(),
  };
}
