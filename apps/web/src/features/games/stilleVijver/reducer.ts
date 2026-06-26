import {
  type StilleVijverAction,
  type StilleVijverState,
  stilleVijverStateSchema,
} from "./contracts";

export function createInitialStilleVijverState(): StilleVijverState {
  return {
    schemaVersion: 1,
    choiceByPlayer: {},
    reflectieByPlayer: {},
    completedInstallationIds: [],
  };
}

export function normalizeStilleVijverState(input: unknown): StilleVijverState {
  const result = stilleVijverStateSchema.safeParse(input);
  return result.success ? result.data : createInitialStilleVijverState();
}

export function stilleVijverReducer(
  state: StilleVijverState,
  action: StilleVijverAction,
): StilleVijverState {
  switch (action.type) {
    case "stille-vijver.choice.submitted":
      return {
        ...state,
        choiceByPlayer: {
          ...state.choiceByPlayer,
          [action.actorId]: { modus: action.modus, keuze: action.keuze },
        },
      };
    case "stille-vijver.reflectie.submitted":
      return {
        ...state,
        reflectieByPlayer: {
          ...state.reflectieByPlayer,
          [action.actorId]: action.tekst,
        },
      };
    case "stille-vijver.game.completed":
      if (state.completedInstallationIds.includes(action.actorId)) return state;
      return {
        ...state,
        completedInstallationIds: [
          ...state.completedInstallationIds,
          action.actorId,
        ],
      };
    default:
      return state;
  }
}

export function addDeveloperStilleVijverPartner(
  state: StilleVijverState,
  action: StilleVijverAction,
  partnerId: string,
): StilleVijverState {
  if (action.type === "stille-vijver.choice.submitted") {
    const devKeuze = [...action.keuze].reverse();
    return {
      ...state,
      choiceByPlayer: {
        ...state.choiceByPlayer,
        [partnerId]: { modus: action.modus, keuze: devKeuze },
      },
    };
  }
  if (action.type === "stille-vijver.reflectie.submitted") {
    return {
      ...state,
      reflectieByPlayer: {
        ...state.reflectieByPlayer,
        [partnerId]: "Dit is een test-antwoord van de gesimuleerde partner.",
      },
    };
  }
  return state;
}
