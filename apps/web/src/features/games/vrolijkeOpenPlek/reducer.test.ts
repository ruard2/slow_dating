import { describe, expect, it } from "vitest";

import type {
  VrolijkeOpenPlekAction,
  VrolijkeOpenPlekState,
} from "./contracts";
import {
  addDeveloperVrolijkeOpenPlekPartner,
  createInitialVrolijkeOpenPlekState,
  selectedMission,
  tictactoeWinner,
  vrolijkeOpenPlekReducer,
} from "./reducer";

const members = ["a", "b"];

function reduce(
  state: VrolijkeOpenPlekState,
  action: VrolijkeOpenPlekAction,
) {
  return vrolijkeOpenPlekReducer(state, action, members);
}

describe("vrolijke open plek reducer", () => {
  it("vindt altijd een gezamenlijke opdracht bij twee keuzes van drie uit vijf", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.missions.chosen",
      actorId: "a",
      missions: ["video", "tictactoe", "setback"],
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.missions.chosen",
      actorId: "b",
      missions: ["bluff", "duel", "video"],
    });
    expect(selectedMission(state, members)).toBe("video");
  });

  it("bewaakt de beurtvolgorde van drie-op-een-rij", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.tictactoe.moved",
      actorId: "b",
      cell: 0,
    });
    expect(state.tictactoeBoard[0]).toBeNull();
    state = reduce(state, {
      type: "vrolijke-open-plek.tictactoe.moved",
      actorId: "a",
      cell: 0,
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.tictactoe.moved",
      actorId: "b",
      cell: 3,
    });
    expect(state.tictactoeBoard.slice(0, 4)).toEqual(["x", null, null, "o"]);
  });

  it("accepteert alleen veilige YouTube-links", () => {
    const initial = createInitialVrolijkeOpenPlekState(members);
    const rejected = reduce(initial, {
      type: "vrolijke-open-plek.video.set",
      actorId: "a",
      url: "javascript:alert(1)",
    });
    const accepted = reduce(initial, {
      type: "vrolijke-open-plek.video.set",
      actorId: "a",
      url: "https://youtu.be/example",
    });
    expect(rejected.videoUrl).toBe("");
    expect(accepted.videoUrl).toBe("https://youtu.be/example");
  });

  it("herkent winst en voorkomt verdere zetten", () => {
    const state: VrolijkeOpenPlekState = {
      ...createInitialVrolijkeOpenPlekState(members),
      tictactoeBoard: ["x", "x", "x", "o", "o", null, null, null, null],
      tictactoeTurn: 5,
    };
    expect(tictactoeWinner(state)).toBe("x");
    expect(
      reduce(state, {
        type: "vrolijke-open-plek.tictactoe.moved",
        actorId: "b",
        cell: 5,
      }),
    ).toEqual(state);
  });

  it("slaat persoonlijk ontspanningsgedrag apart op", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.reflection.submitted",
      actorId: "a",
      reflection: {
        lighter: 5,
        relief: "together",
        pressure: "tease",
        support: "join",
      },
    });
    expect(state.reflections.a).toEqual({
      lighter: 5,
      relief: "together",
      pressure: "tease",
      support: "join",
    });
    expect(state.reflections.b).toBeUndefined();
  });

  it("houdt bluf, duel en tegenslag per speler gescheiden", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.bluff.submitted",
      actorId: "a",
      prompt: "Een vreemde gewoonte",
      claim: "Ik zing tegen de waterkoker.",
      truthful: true,
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.bluff.guessed",
      actorId: "b",
      truthful: false,
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.duel.chosen",
      actorId: "a",
      choice: "scissors",
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.setback.chosen",
      actorId: "b",
      choice: "pause",
    });
    expect(state.bluffClaims.a?.truthful).toBe(true);
    expect(state.bluffGuesses.b).toBe(false);
    expect(state.duelChoices.a).toBe("scissors");
    expect(state.setbackChoices.b).toBe("pause");
  });

  it("registreert gezamenlijk afronden zonder persoonlijke reflecties te mengen", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.mission.ready",
      actorId: "a",
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.mission.ready",
      actorId: "b",
    });
    state = reduce(state, {
      type: "vrolijke-open-plek.conversation.done",
      actorId: "a",
    });
    expect(state.missionReadyIds).toEqual(["a", "b"]);
    expect(state.conversationDoneIds).toEqual(["a"]);
  });

  it("simuleert een complete maar afwijkende testpartner", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    const action = {
      type: "vrolijke-open-plek.missions.chosen",
      actorId: "a",
      missions: ["video", "tictactoe", "setback"],
    } satisfies VrolijkeOpenPlekAction;
    state = reduce(state, action);
    state = addDeveloperVrolijkeOpenPlekPartner(state, action, "b", members);
    expect(state.missionChoices.b).toEqual(["bluff", "duel", "video"]);
    expect(selectedMission(state, members)).toBe("video");
  });
});
