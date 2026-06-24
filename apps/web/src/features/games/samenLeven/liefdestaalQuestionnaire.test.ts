import { describe, expect, it } from "vitest";

import {
  buildLoveProfile,
  completeLovePrompts,
  lovePairQuestions,
  scoreCompleteLoveRoutes,
} from "./liefdestaalQuestionnaire";

describe("originele liefdestaal-routeverkenning", () => {
  it("bevat dertig volledige A/B-keuzes", () => {
    expect(lovePairQuestions).toHaveLength(30);
    expect(completeLovePrompts).toHaveLength(30);
    expect(completeLovePrompts.every((prompt) => prompt.options.length === 2)).toBe(true);
    expect(lovePairQuestions.filter((question) => question.section === "ontvangen")).toHaveLength(20);
    expect(lovePairQuestions.filter((question) => question.section === "geven")).toHaveLength(10);
  });

  it("biedt iedere route exact twaalf keer aan", () => {
    const counts = new Map<string, number>();
    for (const question of lovePairQuestions) {
      for (const option of question.options) {
        counts.set(option.route, (counts.get(option.route) ?? 0) + 1);
      }
    }
    expect([...counts.values()]).toEqual([12, 12, 12, 12, 12]);
  });

  it("scoort uitsluitend de daadwerkelijk gekozen opties", () => {
    const selections = Object.fromEntries(
      lovePairQuestions.map((question) => [
        question.id,
        question.options[0].label,
      ]),
    );
    const total = scoreCompleteLoveRoutes(selections).reduce(
      (sum, route) => sum + route.score,
      0,
    );
    expect(total).toBe(30);
  });

  it("geeft per persoon twee hoofdtalen en aparte geef- en ontvangprofielen", () => {
    const selections = Object.fromEntries(
      lovePairQuestions.map((question) => [
        question.id,
        question.options[0].label,
      ]),
    );
    const profile = buildLoveProfile(selections);

    expect(profile.primary).toBeDefined();
    expect(profile.secondary).toBeDefined();
    expect(profile.primary?.route).not.toBe(profile.secondary?.route);
    expect(profile.receiving.reduce((sum, route) => sum + route.score, 0)).toBe(
      20,
    );
    expect(profile.giving.reduce((sum, route) => sum + route.score, 0)).toBe(
      10,
    );
  });
});
