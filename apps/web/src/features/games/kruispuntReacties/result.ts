import { cardById } from "./content";
import type { KruispuntReactiesState } from "./contracts";

/**
 * Leesbare vorm van de keuzes: per kaart het scenario en wélke optie ieder
 * koos (tekst, geen index). De content leeft hier in de web-app; door de
 * tekst in het resultaat op te slaan kan de profiel-AI (api) het lezen zonder
 * de kaartcontent te kennen. `null` = bewust geen reactie / getwijfeld.
 */
function buildReadableAnswers(state: KruispuntReactiesState) {
  const readable: Record<
    string,
    {
      category: string;
      scenario: string;
      choices: Record<string, string | null>;
    }
  > = {};
  for (const [cardId, perActor] of Object.entries(state.answers)) {
    const card = cardById(cardId);
    if (!card) continue;
    const choices: Record<string, string | null> = {};
    for (const [actorId, answer] of Object.entries(perActor)) {
      choices[actorId] =
        answer.optionIndex === null
          ? null
          : (card.options[answer.optionIndex] ?? null);
    }
    readable[cardId] = {
      category: card.category,
      scenario: card.scenario,
      choices,
    };
  }
  return readable;
}

export function serializeKruispuntReactiesResult(
  state: KruispuntReactiesState,
) {
  return {
    schemaVersion: 1,
    usedCardIds: state.usedCardIds,
    roundsPlayed: state.roundNumber,
    answers: state.answers,
    readableAnswers: buildReadableAnswers(state),
    revisitCardIds: state.revisitCardIds,
    completedAt: new Date().toISOString(),
  };
}
