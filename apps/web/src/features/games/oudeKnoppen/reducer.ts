import type { OudeKnoppenAction, OudeKnoppenState } from "./contracts";
import { oudeKnoppenStateSchema } from "./contracts";

export function createInitialOudeKnoppenState(
  readyInstallationIds: string[] = [],
): OudeKnoppenState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    introSeenIds: [],
    selections: {},
    reflections: {},
    repairs: {},
  };
}

export function normalizeOudeKnoppenState(input: unknown): OudeKnoppenState {
  const parsed = oudeKnoppenStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialOudeKnoppenState(readyInstallationIds);
}

function addOnce(values: string[], actorId: string) {
  return [...new Set([...values, actorId])];
}

export function oudeKnoppenReducer(
  current: OudeKnoppenState,
  action: OudeKnoppenAction,
): OudeKnoppenState {
  const state = normalizeOudeKnoppenState(current);
  if (action.type === "oude-knoppen.intro.seen") {
    return { ...state, introSeenIds: addOnce(state.introSeenIds, action.actorId) };
  }
  if (action.type === "oude-knoppen.selection.submitted") {
    return {
      ...state,
      selections: { ...state.selections, [action.actorId]: action.selection },
    };
  }
  if (action.type === "oude-knoppen.reflection.submitted") {
    return {
      ...state,
      reflections: { ...state.reflections, [action.actorId]: action.reflection },
    };
  }
  if (action.type === "oude-knoppen.repair.submitted") {
    return {
      ...state,
      repairs: { ...state.repairs, [action.actorId]: action.repair },
    };
  }
  return state;
}

export function addDeveloperOudeKnoppenPartner(
  state: OudeKnoppenState,
  action: OudeKnoppenAction,
  partnerId: string,
) {
  if (action.type === "oude-knoppen.intro.seen") {
    return oudeKnoppenReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "oude-knoppen.selection.submitted") {
    return oudeKnoppenReducer(state, {
      ...action,
      actorId: partnerId,
      selection: { domainId: "veilig", caseId: "wrong-tone" },
    });
  }
  if (action.type === "oude-knoppen.reflection.submitted") {
    return oudeKnoppenReducer(state, {
      ...action,
      actorId: partnerId,
      reflection: {
        reactionId: "freeze",
        needId: "veiligheid",
        protectionId: "stilvallen",
        oldButtonName: "Niet te veel zijn",
        bodySignal: "Mijn borst wordt strak en ik word stil.",
        memoryHint:
          "Ik herken dit van momenten waarop eerlijkheid vroeger snel spanning gaf.",
      },
    });
  }
  if (action.type === "oude-knoppen.repair.submitted") {
    return oudeKnoppenReducer(state, {
      ...action,
      actorId: partnerId,
      repair: {
        softSentence:
          "Ik val stil, maar ik ben niet weg. Ik heb even rust nodig en wil hier straks op terugkomen.",
        partnerHelp:
          "Vraag zacht of ik één zin kan zeggen, zonder meteen door te duwen.",
        pauseSignal: "Hand op hart",
        miniPractice:
          "Deze week benoem ik één keer vroeg dat iets me raakt, voordat ik dichtklap.",
      },
    });
  }
  return state;
}
