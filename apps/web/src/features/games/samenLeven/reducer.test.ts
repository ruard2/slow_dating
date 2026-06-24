import { describe, expect, it } from "vitest";

import {
  addDeveloperSamenLevenPartner,
  createInitialSamenLevenState,
  samenLevenReducer,
} from "./reducer";

describe("samenLevenReducer", () => {
  it("opent een ronde pas wanneer beide partners hetzelfde vak kiezen", () => {
    const first = samenLevenReducer(createInitialSamenLevenState(), {
      type: "samen-leven.theme.selected",
      actorId: "a",
      themeId: "tijd-en-aandacht",
    });
    const matched = samenLevenReducer(first, {
      type: "samen-leven.theme.selected",
      actorId: "b",
      themeId: "tijd-en-aandacht",
    });

    expect(first.themeId).toBeNull();
    expect(matched.themeId).toBe("tijd-en-aandacht");
    expect(matched.themeChoices).toEqual({
      a: "tijd-en-aandacht",
      b: "tijd-en-aandacht",
    });
  });

  it("houdt twee verschillende keuzes zichtbaar tot opnieuw proberen", () => {
    const first = samenLevenReducer(createInitialSamenLevenState(), {
      type: "samen-leven.theme.selected",
      actorId: "a",
      themeId: "tijd-en-aandacht",
    });
    const mismatch = samenLevenReducer(first, {
      type: "samen-leven.theme.selected",
      actorId: "b",
      themeId: "huis-en-taken",
    });
    const retried = samenLevenReducer(mismatch, {
      type: "samen-leven.theme.retry",
      actorId: "a",
    });

    expect(mismatch.themeId).toBeNull();
    expect(mismatch.themeChoices).toEqual({
      a: "tijd-en-aandacht",
      b: "huis-en-taken",
    });
    expect(retried.themeChoices).toEqual({});
    expect(retried.themeAttempt).toBe(1);
  });

  it("bewaart keuzes per partner zonder ze voor de ander zichtbaar in te vullen", () => {
    const state = samenLevenReducer(createInitialSamenLevenState(), {
      type: "samen-leven.option.selected",
      actorId: "a",
      promptId: "security",
      value: "Als alles overzichtelijk is",
    });

    expect(state.selections.a?.security).toBe(
      "Als alles overzichtelijk is",
    );
    expect(state.selections.b).toBeUndefined();
  });

  it("markeert antwoorden en gesprek per partner als afgerond", () => {
    const submitted = samenLevenReducer(createInitialSamenLevenState(), {
      type: "samen-leven.answers.submitted",
      actorId: "a",
    });
    const discussed = samenLevenReducer(submitted, {
      type: "samen-leven.discussion.done",
      actorId: "a",
    });

    expect(discussed.submittedIds).toEqual(["a"]);
    expect(discussed.discussionDoneIds).toEqual(["a"]);
  });

  it("simuleert in ontwikkelmodus de gekoppelde partner", () => {
    const selected = samenLevenReducer(createInitialSamenLevenState(), {
      type: "samen-leven.option.selected",
      actorId: "a",
      promptId: "security",
      value: "Als we kunnen delen",
    });
    const submitted = samenLevenReducer(selected, {
      type: "samen-leven.answers.submitted",
      actorId: "a",
    });
    const withPartner = addDeveloperSamenLevenPartner(
      submitted,
      {
        type: "samen-leven.answers.submitted",
        actorId: "a",
      },
      "b",
      {
        security: [
          "Als we kunnen delen",
          "Als alles overzichtelijk is",
          "Als er ruim spaargeld is",
        ],
      },
    );

    expect(withPartner.selections.b?.security).toBe(
      "Als alles overzichtelijk is",
    );
    expect(withPartner.submittedIds).toContain("b");
  });
});
