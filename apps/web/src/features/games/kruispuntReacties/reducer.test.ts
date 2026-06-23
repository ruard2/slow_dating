import { describe, expect, it } from "vitest";

import {
  activeReactionCardId,
  createInitialKruispuntReactiesState,
  kruispuntReactiesReducer,
} from "./reducer";

const members = ["a", "b"];

function ready() {
  let state = createInitialKruispuntReactiesState();
  state = kruispuntReactiesReducer(
    state,
    {
      type: "kruispunt-reacties.ready",
      actorId: "a",
      startedAt: "2026-06-14T12:00:00.000Z",
    },
    members,
  );
  return kruispuntReactiesReducer(
    state,
    {
      type: "kruispunt-reacties.ready",
      actorId: "b",
      startedAt: "2026-06-14T12:00:01.000Z",
    },
    members,
  );
}

describe("kruispunt van reacties reducer", () => {
  it("start met tien unieke kaarten zodra beiden klaar zijn", () => {
    const state = ready();
    expect(state.roundCardIds).toHaveLength(10);
    expect(new Set(state.roundCardIds)).toHaveLength(10);
    expect(state.cardStartedAt).toBe("2026-06-14T12:00:01.000Z");
  });

  it("onthoudt antwoorden per persoon en gaat pas daarna door", () => {
    let state = ready();
    const cardId = activeReactionCardId(state)!;
    for (const [actorId, optionIndex] of [["a", 1], ["b", 3]] as const) {
      state = kruispuntReactiesReducer(
        state,
        {
          type: "kruispunt-reacties.answered",
          actorId,
          cardId,
          optionIndex,
          answeredAt: "2026-06-14T12:00:03.000Z",
        },
        members,
      );
    }
    state = kruispuntReactiesReducer(
      state,
      {
        type: "kruispunt-reacties.card.advanced",
        actorId: "a",
        cardId,
        startedAt: "2026-06-14T12:00:05.000Z",
      },
      members,
    );
    expect(state.answers[cardId]?.a?.optionIndex).toBe(1);
    expect(state.answers[cardId]?.b?.optionIndex).toBe(3);
    expect(state.currentCardIndex).toBe(1);
  });

  it("gebruikt gespeelde kaarten niet opnieuw", () => {
    let state = ready();
    const firstRound = [...state.roundCardIds];
    state = { ...state, currentCardIndex: 10 };
    for (const actorId of members) {
      state = kruispuntReactiesReducer(
        state,
        {
          type: "kruispunt-reacties.round.voted",
          actorId,
          vote: "again",
          revisitCardId: firstRound[0]!,
          startedAt: "2026-06-14T12:01:00.000Z",
        },
        members,
      );
    }
    expect(state.roundCardIds.some((id) => firstRound.includes(id))).toBe(false);
    expect(state.roundNumber).toBe(2);
  });
});
