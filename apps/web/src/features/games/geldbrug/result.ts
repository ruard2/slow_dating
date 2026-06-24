import {
  compassPillars,
  moneyScales,
  moneyScenarios,
} from "./content";
import type { GeldbrugState } from "./contracts";

export function serializeGeldbrugResult(state: GeldbrugState) {
  const memberIds = [
    ...new Set([
      ...state.readyInstallationIds,
      ...Object.keys(state.compassByPerson),
      ...Object.keys(state.reflectionsByPerson),
      ...Object.keys(state.scalesByPerson),
      ...Object.keys(state.christianReflections),
      ...state.commitmentConfirmedIds,
    ]),
  ];
  const scenarioResults = state.scenarioIds.map((scenarioId) => {
    const scenario = moneyScenarios.find((item) => item.id === scenarioId);
    const answers = state.scenarioAnswers[scenarioId] ?? {};
    const choices = memberIds.map((id) => answers[id]?.choice).filter(Boolean);
    const needs = memberIds.map((id) => answers[id]?.need).filter(Boolean);
    return {
      id: scenarioId,
      title: scenario?.title ?? scenarioId,
      situation: scenario?.situation ?? "",
      answersByPerson: answers,
      sameChoice: choices.length >= 2 && new Set(choices).size === 1,
      sharedNeed: needs.length >= 2 && new Set(needs).size === 1 ? needs[0] : null,
    };
  });
  const scaleDifferences = moneyScales.map((scale) => {
    const values = memberIds.map(
      (id) => state.scalesByPerson[id]?.[scale.id] ?? 50,
    );
    return {
      id: scale.id,
      left: scale.left,
      right: scale.right,
      valuesByPerson: Object.fromEntries(
        memberIds.map((id, index) => [id, values[index]]),
      ),
      distance: values.length >= 2 ? Math.abs(values[0]! - values[1]!) : 0,
    };
  });
  const strongestAgreement = [...scaleDifferences].sort(
    (a, b) => a.distance - b.distance,
  )[0];
  const largestDifference = [...scaleDifferences].sort(
    (a, b) => b.distance - a.distance,
  )[0];
  return {
    schemaVersion: 1,
    gameId: "geldbrug",
    compassPillars: compassPillars.map((pillar) => ({
      id: pillar.id,
      title: pillar.title,
      description: pillar.description,
    })),
    compassByPerson: state.compassByPerson,
    reflectionsByPerson: state.reflectionsByPerson,
    scenarios: scenarioResults,
    scales: scaleDifferences,
    strongestAgreement,
    largestDifference,
    christianReflections: state.christianReflections,
    acceptedCommitment:
      state.commitment &&
      state.commitmentConfirmedIds.length >= memberIds.length
        ? state.commitment
        : null,
    commitmentConfirmedIds: state.commitmentConfirmedIds,
    completedAt: new Date().toISOString(),
  };
}
