import type { ValueId, WaardenState } from "./contracts";
import { tensionQuestions, values } from "./content";

export function selectionFor(state: WaardenState, installationId: string) {
  return state.selections[installationId] ?? [];
}

export function allPlayersSubmitted(
  state: WaardenState,
  memberIds: string[],
) {
  return (
    memberIds.length === 2 &&
    memberIds.every((id) => state.submittedInstallationIds.includes(id))
  );
}

export function sharedValues(state: WaardenState, memberIds: string[]) {
  const [firstId, secondId] = memberIds;
  if (!firstId || !secondId) return [];
  const second = new Set(selectionFor(state, secondId));
  return selectionFor(state, firstId).filter((value) => second.has(value));
}

export function questionsFor(
  ownValues: ValueId[],
  partnerValues: ValueId[],
) {
  const all = new Set([...ownValues, ...partnerValues]);
  const tensions = tensionQuestions
    .filter(({ values: [left, right] }) => all.has(left) && all.has(right))
    .map(({ question }) => question);
  const questions = (ids: ValueId[]) =>
    ids.flatMap((id) => {
      const value = values.find((candidate) => candidate.id === id);
      return value ? [value.question] : [];
    });
  const own = [...questions(ownValues), ...tensions].slice(0, 5);
  const partner = [...questions(partnerValues), ...tensions]
    .filter((question) => !own.includes(question))
    .slice(0, 5);
  return { own, partner: partner.length ? partner : tensions.slice(0, 3) };
}
