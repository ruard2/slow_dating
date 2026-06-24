import { describe, expect, it } from "vitest";

import {
  getSamenLevenRound,
  irritatieBingoBoardOrder,
  samenLevenContent,
} from "./content";

describe("Kleine-irritatiebingo content", () => {
  it("heeft zestien unieke klikbare onderwerpen", () => {
    const themes = samenLevenContent.irritatiebingo.themes ?? [];

    expect(themes).toHaveLength(16);
    expect(new Set(themes.map((theme) => theme.id)).size).toBe(16);
    expect(new Set(irritatieBingoBoardOrder).size).toBe(16);
    expect(irritatieBingoBoardOrder.every((id) =>
      themes.some((theme) => theme.id === id),
    )).toBe(true);
  });

  it("heeft per onderwerp casussen en een christelijke verdieping", () => {
    for (const theme of samenLevenContent.irritatiebingo.themes ?? []) {
      expect(theme.prompts.length).toBeGreaterThanOrEqual(3);
      expect(theme.prompts.every((prompt) => prompt.options.length >= 6)).toBe(
        true,
      );
      expect(theme.discussionQuestions.length).toBeGreaterThanOrEqual(3);
      expect(theme.christianPrompts.length).toBeGreaterThanOrEqual(3);
      expect(getSamenLevenRound(
        samenLevenContent.irritatiebingo,
        theme.id,
      ).theme?.id).toBe(theme.id);
    }
  });
});

