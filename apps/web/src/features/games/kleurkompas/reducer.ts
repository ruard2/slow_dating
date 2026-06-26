import {
  scenarios,
  stressBehaviors,
  translatePhrases,
  type KleurId,
} from "./content";
import type { KleurkompasAction, KleurkompasState } from "./contracts";
import { kleurkompasStateSchema } from "./contracts";

export function createInitialKleurkompasState(
  readyInstallationIds: string[] = [],
): KleurkompasState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    introSeenIds: [],
    scenarioAnswers: {},
    stressRatings: {},
    exercises: {},
    deepenings: {},
  };
}

export function normalizeKleurkompasState(input: unknown): KleurkompasState {
  const parsed = kleurkompasStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialKleurkompasState(readyInstallationIds);
}

function addOnce(values: string[], actorId: string) {
  return [...new Set([...values, actorId])];
}

export function kleurkompasReducer(
  current: KleurkompasState,
  action: KleurkompasAction,
): KleurkompasState {
  const state = normalizeKleurkompasState(current);

  if (action.type === "kleurkompas.intro.seen") {
    return {
      ...state,
      introSeenIds: addOnce(state.introSeenIds, action.actorId),
    };
  }
  if (action.type === "kleurkompas.scenarios.submitted") {
    return {
      ...state,
      scenarioAnswers: {
        ...state.scenarioAnswers,
        [action.actorId]: action.answers,
      },
    };
  }
  if (action.type === "kleurkompas.stress.submitted") {
    return {
      ...state,
      stressRatings: {
        ...state.stressRatings,
        [action.actorId]: action.ratings,
      },
    };
  }
  if (action.type === "kleurkompas.exercise.submitted") {
    return {
      ...state,
      exercises: {
        ...state.exercises,
        [action.actorId]: action.exercise,
      },
    };
  }
  if (action.type === "kleurkompas.deepening.submitted") {
    return {
      ...state,
      deepenings: {
        ...state.deepenings,
        [action.actorId]: action.deepening,
      },
    };
  }
  return state;
}

export function addDeveloperKleurkompasPartner(
  state: KleurkompasState,
  action: KleurkompasAction,
  partnerId: string,
) {
  if (action.type === "kleurkompas.intro.seen") {
    return kleurkompasReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "kleurkompas.scenarios.submitted") {
    const cycle: KleurId[] = ["Gr", "B", "G", "R"];
    const answers = Object.fromEntries(
      scenarios.map((scenario, index) => [scenario.id, cycle[index % cycle.length]]),
    ) as Record<string, KleurId>;
    return kleurkompasReducer(state, {
      ...action,
      actorId: partnerId,
      answers,
    });
  }
  if (action.type === "kleurkompas.stress.submitted") {
    const ratings = Object.fromEntries(
      stressBehaviors.map((behavior, index) => [
        behavior.id,
        index % 3 === 0 ? 2 : index % 2 === 0 ? 1 : 0,
      ]),
    );
    return kleurkompasReducer(state, {
      ...action,
      actorId: partnerId,
      ratings,
    });
  }
  if (action.type === "kleurkompas.exercise.submitted") {
    return kleurkompasReducer(state, {
      ...action,
      actorId: partnerId,
      exercise: {
        phraseId: translatePhrases[1]?.id ?? "you-never-listen",
        chosenColor: "Gr",
        ownReframe:
          "Ik vind dit spannend om te zeggen, maar ik wil graag rustig uitleggen wat er gebeurt.",
        partnerNeedGuess:
          "Ik denk dat jij vooral nodig hebt dat het concreet en veilig blijft.",
      },
    });
  }
  if (action.type === "kleurkompas.deepening.submitted") {
    return kleurkompasReducer(state, {
      ...action,
      actorId: partnerId,
      deepening: {
        ownQuestion: "Waar zeg ik te weinig om de vrede te bewaren?",
        ownAnswer:
          "Ik merk dat ik soms later pas zeg wat ik eigenlijk al voelde. Ik wil eerder één kleine zin oefenen.",
        heardWrongCardId: "space",
        heardWrongReflection:
          "Ruimte kan voor mij veilig voelen, maar voor de ander afstand. Ik wil duidelijker zeggen dat ik terugkom.",
        growthCard: "Vertaal kritiek naar zorg en stilte naar behoefte.",
        miniAgreement:
          "Als één van ons ruimte vraagt, noemen we ook wanneer we erop terugkomen.",
      },
    });
  }
  return state;
}
