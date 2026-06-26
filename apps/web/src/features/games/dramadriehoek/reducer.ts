import type {
  DramadriehoekAction,
  DramadriehoekState,
} from "./contracts";
import { dramadriehoekStateSchema } from "./contracts";

export function createInitialDramadriehoekState(
  readyInstallationIds: string[] = [],
): DramadriehoekState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    introSeenIds: [],
    profiles: {},
  };
}

export function normalizeDramadriehoekState(input: unknown): DramadriehoekState {
  const parsed = dramadriehoekStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialDramadriehoekState(readyInstallationIds);
}

function addOnce(values: string[], actorId: string) {
  return [...new Set([...values, actorId])];
}

export function dramadriehoekReducer(
  current: DramadriehoekState,
  action: DramadriehoekAction,
): DramadriehoekState {
  const state = normalizeDramadriehoekState(current);
  if (action.type === "dramadriehoek.intro.seen") {
    return { ...state, introSeenIds: addOnce(state.introSeenIds, action.actorId) };
  }
  if (action.type === "dramadriehoek.profile.submitted") {
    return {
      ...state,
      profiles: { ...state.profiles, [action.actorId]: action.profile },
    };
  }
  return state;
}

export function addDeveloperDramadriehoekPartner(
  state: DramadriehoekState,
  action: DramadriehoekAction,
  partnerId: string,
) {
  if (action.type === "dramadriehoek.intro.seen") {
    return dramadriehoekReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "dramadriehoek.profile.submitted") {
    return dramadriehoekReducer(state, {
      ...action,
      actorId: partnerId,
      profile: {
        sceneIds: ["moeder-teleurgesteld"],
        feelingIds: ["schuldig", "druk"],
        pullIds: ["sussen", "wegcijferen"],
        sceneResponses: {
          "moeder-teleurgesteld": {
            feelingIds: ["schuldig", "druk"],
            pullIds: ["sussen", "wegcijferen"],
          },
        },
        role: "slachtoffer",
        roleSentence: "Ik doe het ook nooit goed.",
        gainIds: ["zorg-krijgen", "niet-kiezen"],
        costIds: ["kracht-verlies", "passief"],
        shiftId: "slachtoffer-aanklager",
        whatDateMayKnow:
          "Als ik slachtofferig word, heb ik meestal geen oplossing nodig maar hulp om één kleine stap te kiezen.",
      },
    });
  }
  return state;
}
