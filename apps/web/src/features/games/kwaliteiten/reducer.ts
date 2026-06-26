import {
  type KwaliteitenAction,
  type KwaliteitenState,
  kwaliteitenStateSchema,
} from "./contracts";

export function createInitialKwaliteitenState(): KwaliteitenState {
  return {
    schemaVersion: 1,
    selectionByPlayer: {},
    questionsByPlayer: {},
    completedInstallationIds: [],
  };
}

export function normalizeKwaliteitenState(input: unknown): KwaliteitenState {
  const result = kwaliteitenStateSchema.safeParse(input);
  return result.success ? result.data : createInitialKwaliteitenState();
}

export function kwaliteitenReducer(
  state: KwaliteitenState,
  action: KwaliteitenAction,
): KwaliteitenState {
  switch (action.type) {
    case "kwaliteiten.selection.submitted":
      return {
        ...state,
        selectionByPlayer: {
          ...state.selectionByPlayer,
          [action.actorId]: {
            kwaliteiten: action.kwaliteiten,
            allergie: action.allergie,
          },
        },
      };
    case "kwaliteiten.questions.submitted":
      return {
        ...state,
        questionsByPlayer: {
          ...state.questionsByPlayer,
          [action.actorId]: action.questions,
        },
      };
    case "kwaliteiten.game.completed":
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

export function addDeveloperKwaliteitenPartner(
  state: KwaliteitenState,
  action: KwaliteitenAction,
  partnerId: string,
): KwaliteitenState {
  if (action.type === "kwaliteiten.selection.submitted") {
    const devKwaliteiten = action.kwaliteiten.length >= 2
      ? [action.kwaliteiten[1] ?? action.kwaliteiten[0]!, action.kwaliteiten[0]!]
      : [...action.kwaliteiten];
    const devAllergie = action.allergie;
    return {
      ...state,
      selectionByPlayer: {
        ...state.selectionByPlayer,
        [partnerId]: { kwaliteiten: devKwaliteiten, allergie: devAllergie },
      },
    };
  }
  if (action.type === "kwaliteiten.questions.submitted") {
    const partnerSelection = state.selectionByPlayer[action.actorId];
    if (!partnerSelection) return state;
    const words = [
      ...partnerSelection.kwaliteiten,
      ...(partnerSelection.allergie ? [partnerSelection.allergie] : []),
    ];
    const devQuestions: Record<string, string> = {};
    for (const word of words) {
      devQuestions[word] = action.questions[word] ?? `Vertel meer over ${word}.`;
    }
    return {
      ...state,
      questionsByPlayer: {
        ...state.questionsByPlayer,
        [partnerId]: devQuestions,
      },
    };
  }
  return state;
}
