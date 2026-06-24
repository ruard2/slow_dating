import { describe, expect, it } from "vitest";

import { maxDateObjects } from "./content";
import {
  addDeveloperKleineDatePartner,
  createInitialKleineDateState,
  kleineDateReducer,
} from "./reducer";
import { serializeKleineDateResult } from "./result";

describe("kleine date reducer", () => {
  it("legt objecten op tafel zonder dubbelen", () => {
    let state = createInitialKleineDateState(["a", "b"]);
    state = kleineDateReducer(state, {
      type: "kleine-date.object.placed",
      actorId: "a",
      objectId: "coffee",
    });
    state = kleineDateReducer(state, {
      type: "kleine-date.object.placed",
      actorId: "b",
      objectId: "coffee",
    });

    expect(state.selections).toHaveLength(1);
    expect(state.selections[0]?.objectId).toBe("coffee");
  });

  it("begrensd de tafel op zestien objecten", () => {
    const ids = [
      "coffee", "tea", "wine", "beer", "icecream", "cake", "pizza", "sushi",
      "cook", "restaurant", "foodtruck", "picnic", "sofa", "blanket", "candles", "movie", "book",
    ];
    const state = ids.reduce(
      (current, objectId, index) =>
        kleineDateReducer(current, {
          type: "kleine-date.object.placed",
          actorId: index % 2 ? "b" : "a",
          objectId,
        }),
      createInitialKleineDateState(["a", "b"]),
    );

    expect(state.selections).toHaveLength(maxDateObjects);
  });

  it("laat de developer-partner automatisch meekiezen", () => {
    let state = createInitialKleineDateState(["a", "b"]);
    const action = {
      type: "kleine-date.object.placed" as const,
      actorId: "a",
      objectId: "coffee",
    };
    state = kleineDateReducer(state, action);
    state = addDeveloperKleineDatePartner(state, action, "b", true);

    expect(state.selections).toHaveLength(2);
    expect(state.selections[1]?.actorId).toBe("b");
  });

  it("serialiseert gekozen objecten ai-vriendelijk", () => {
    const state = kleineDateReducer(createInitialKleineDateState(["a"]), {
      type: "kleine-date.object.placed",
      actorId: "a",
      objectId: "coffee",
    });
    const result = serializeKleineDateResult(state);

    expect(result.gameId).toBe("kleine-date");
    expect(result.chosenObjects[0]).toMatchObject({
      objectId: "coffee",
      label: "Koffie",
      category: "Eten & drinken",
    });
  });
});
