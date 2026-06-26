import {
  colors,
  comboKey,
  comboText,
  deeperQuestions,
  growthCards,
  heardWrongCards,
  scenarios,
  stressBehaviors,
  translatePhrases,
  type KleurId,
} from "./content";
import type { KleurkompasState } from "./contracts";

const colorOrder: KleurId[] = ["R", "G", "Gr", "B"];

export function scoreScenarioAnswers(answers: Record<string, KleurId> = {}) {
  const totals: Record<KleurId, number> = { R: 0, G: 0, Gr: 0, B: 0 };
  Object.values(answers).forEach((color) => {
    totals[color] += 1;
  });
  return totals;
}

export function scoreStressRatings(ratings: Record<string, number> = {}) {
  const totals: Record<KleurId, number> = { R: 0, G: 0, Gr: 0, B: 0 };
  stressBehaviors.forEach((behavior) => {
    const rating = ratings[behavior.id] ?? 0;
    colorOrder.forEach((color) => {
      totals[color] += (behavior.scores[color] ?? 0) * rating;
    });
  });
  return totals;
}

function sortedColors(scores: Record<KleurId, number>) {
  return colorOrder
    .map((color) => ({ color, score: scores[color] }))
    .sort((left, right) => right.score - left.score);
}

export function kleurProfileFor(
  answers: Record<string, KleurId> = {},
  stressRatings: Record<string, number> = {},
) {
  const behaviorScores = scoreScenarioAnswers(answers);
  const stressScores = scoreStressRatings(stressRatings);
  const behaviorSorted = sortedColors(behaviorScores);
  const stressSorted = sortedColors(stressScores);
  const primary = behaviorSorted[0]?.color ?? "Gr";
  const secondary = behaviorSorted[1]?.color ?? "B";
  const stressColor = stressSorted[0]?.color ?? primary;
  return {
    primary,
    secondary,
    stressColor,
    behaviorScores,
    stressScores,
    primaryLabel: colors[primary].name,
    secondaryLabel: colors[secondary].name,
    stressLabel: colors[stressColor].name,
  };
}

export function serializeKleurkompasResult(
  state: KleurkompasState,
  memberIds: string[] = Object.keys(state.scenarioAnswers),
) {
  const profiles = Object.fromEntries(
    memberIds.map((memberId) => {
      const profile = kleurProfileFor(
        state.scenarioAnswers[memberId],
        state.stressRatings[memberId],
      );
      const chosenScenarios = scenarios.map((scenario) => {
        const chosenColor = state.scenarioAnswers[memberId]?.[scenario.id];
        return {
          id: scenario.id,
          situation: scenario.situation,
          chosenColor,
          chosenColorLabel: chosenColor ? colors[chosenColor].name : null,
          chosenText:
            scenario.answers.find((answer) => answer.color === chosenColor)?.text ??
            null,
        };
      });
      const stress = stressBehaviors.map((behavior) => ({
        id: behavior.id,
        text: behavior.text,
        rating: state.stressRatings[memberId]?.[behavior.id] ?? 0,
      }));
      const exercise = state.exercises[memberId];
      const deepening = state.deepenings[memberId];
      const phrase = exercise
        ? translatePhrases.find((item) => item.id === exercise.phraseId)
        : undefined;
      const heardWrong = deepening
        ? heardWrongCards.find((item) => item.id === deepening.heardWrongCardId)
        : undefined;
      return [
        memberId,
        {
          ...profile,
          primaryProfile: colors[profile.primary],
          secondaryProfile: colors[profile.secondary],
          stressProfile: colors[profile.stressColor],
          chosenScenarios,
          stress,
          exercise: exercise
            ? {
                ...exercise,
                phraseTheme: phrase?.theme ?? null,
                originalPhrase: phrase?.original ?? null,
                heardAs:
                  phrase?.hears[exercise.chosenColor] ??
                  null,
                betterPhrase:
                  phrase?.better[exercise.chosenColor] ??
                  null,
              }
            : null,
          deepening: deepening
            ? {
                ...deepening,
                primaryQuestionOptions: deeperQuestions[profile.primary],
                heardWrongPhrase: heardWrong?.phrase ?? null,
                heardWrongHiddenNeed: heardWrong?.hiddenNeed ?? null,
                heardWrongByColor: heardWrong?.hears ?? null,
              }
            : null,
        },
      ];
    }),
  );

  const [firstId, secondId] = memberIds;
  const first = firstId ? kleurProfileFor(state.scenarioAnswers[firstId], state.stressRatings[firstId]) : null;
  const second = secondId ? kleurProfileFor(state.scenarioAnswers[secondId], state.stressRatings[secondId]) : null;
  const key = first && second ? comboKey(first.primary, second.primary) : null;

  return {
    schemaVersion: 1,
    gameId: "kleurkompas",
    profiles,
    couple:
      key && first && second
        ? {
            comboKey: key,
            colors: [first.primary, second.primary],
            title: comboText[key]?.title ?? "Twee kleuren aan tafel",
            strength: comboText[key]?.strength ?? null,
            tension: comboText[key]?.tension ?? null,
            exercise: comboText[key]?.exercise ?? null,
            question: comboText[key]?.question ?? null,
            growthCards: growthCards[key] ?? [],
          }
        : null,
    raw: {
      scenarioAnswers: state.scenarioAnswers,
      stressRatings: state.stressRatings,
      exercises: state.exercises,
      deepenings: state.deepenings,
    },
    completedAt: new Date().toISOString(),
  };
}
