import {
  getSamenLevenRound,
  samenLevenContent,
  type SamenLevenGameId,
} from "./content";
import type { SamenLevenState } from "./contracts";
import {
  buildLoveProfile,
  scoreCompleteLoveRoutes,
} from "./liefdestaalQuestionnaire";

export function serializeSamenLevenResult(
  gameId: SamenLevenGameId,
  state: SamenLevenState,
) {
  const content = samenLevenContent[gameId];
  const round = getSamenLevenRound(content, state.themeId);
  return {
    schemaVersion: 1,
    gameId,
    themeId: state.themeId,
    themeChoices: state.themeChoices,
    themeAttempt: state.themeAttempt,
    themeTitle: round.theme?.title ?? null,
    prompts: round.prompts.map((prompt) => ({
      id: prompt.id,
      question: prompt.question,
      options: [...prompt.options],
    })),
    selections: state.selections,
    ...(gameId === "liefdestaal"
      ? {
          routeScores: Object.fromEntries(
            Object.entries(state.selections).map(
              ([installationId, selections]) => [
                installationId,
                scoreCompleteLoveRoutes(selections).map(
                  ({ route, score, title }) => ({ route, score, title }),
                ),
              ],
            ),
          ),
          loveProfiles: Object.fromEntries(
            Object.entries(state.selections).map(
              ([installationId, selections]) => {
                const profile = buildLoveProfile(selections);
                return [
                  installationId,
                  {
                    primary: profile.primary,
                    secondary: profile.secondary,
                    receiving: profile.receiving[0],
                    giving: profile.giving[0],
                    closePair: profile.closePair,
                  },
                ];
              },
            ),
          ),
        }
      : {}),
    discussionQuestions: [...round.discussionQuestions],
    submittedIds: state.submittedIds,
    discussionDoneIds: state.discussionDoneIds,
    completedAt: new Date().toISOString(),
  };
}
