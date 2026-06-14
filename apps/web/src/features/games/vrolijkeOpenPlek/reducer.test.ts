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

  it("stuurt een geraakte racepion telkens terug naar start", () => {
    let state: VrolijkeOpenPlekState = {
      ...createInitialVrolijkeOpenPlekState(members),
      racePositions: { a: 2, b: 5 },
      raceTurn: 0,
    };
    state = reduce(state, {
      type: "vrolijke-open-plek.race.rolled",
      actorId: "a",
      roll: 3,
    });
    expect(state.racePositions).toEqual({ a: 5, b: -1 });
    expect(state.raceHitCounts.a).toBe(1);
    expect(state.raceLastHitActorId).toBe("b");
  });

  it("houdt beurtvolgorde, paddenstoelterugslag en finish bij", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    state = reduce(state, {
      type: "vrolijke-open-plek.race.rolled",
      actorId: "b",
      roll: 6,
    });
    expect(state.racePositions.b).toBeUndefined();

    state = reduce(state, {
      type: "vrolijke-open-plek.race.rolled",
      actorId: "a",
      roll: 5,
    });
    expect(state.racePositions.a).toBe(2);
    state = {
      ...state,
      racePositions: { ...state.racePositions, b: 22 },
    };
    state = reduce(state, {
      type: "vrolijke-open-plek.race.rolled",
      actorId: "b",
      roll: 4,
    });
    expect(state.racePositions.b).toBe(24);
    expect(state.raceWinnerId).toBe("b");
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

  it("doorloopt gezamenlijke opdrachten zonder een late klik te laten overslaan", () => {
    let state = createInitialVrolijkeOpenPlekState(members);
    for (const actorId of members) {
      state = reduce(state, {
        type: "vrolijke-open-plek.missions.chosen",
        actorId,
        missions: ["tictactoe", "video", "bluff"],
      });
      state = reduce(state, {
        type: "vrolijke-open-plek.mission.ready",
        actorId,
      });
    }

    state = reduce(state, {
      type: "vrolijke-open-plek.mission.next",
      actorId: "a",
      missionId: "video",
    });
    expect(state.completedMissionIds).toEqual(["tictactoe"]);
    expect(selectedMission(state, members)).toBe("video");
    expect(state.missionReadyIds).toEqual([]);

    const afterLateClick = reduce(state, {
      type: "vrolijke-open-plek.mission.next",
      actorId: "b",
      missionId: "bluff",
    });
    expect(afterLateClick).toEqual(state);
  });

  it("kan na de laatste opdracht bewust naar de reflectie", () => {
    let state: VrolijkeOpenPlekState = {
      ...createInitialVrolijkeOpenPlekState(members),
      activeMissionId: "duel",
      missionReadyIds: [...members],
    };
    state = reduce(state, {
      type: "vrolijke-open-plek.mission.next",
      actorId: "a",
      missionId: null,
    });
    expect(state.completedMissionIds).toEqual(["duel"]);
    expect(state.missionsFinished).toBe(true);
    expect(selectedMission(state, members)).toBeNull();
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
    expect(state.missionChoices.b).toEqual(["video", "tictactoe", "setback"]);
    expect(selectedMission(state, members)).toBe("video");
  });

  it("laat in developer mode iedere opdracht als eerste keuze testen", () => {
    for (const mission of [
      "video",
      "tictactoe",
      "bluff",
      "duel",
      "setback",
    ] as const) {
      let state = createInitialVrolijkeOpenPlekState(members);
      const alternatives = [
        "video",
        "tictactoe",
        "bluff",
        "duel",
        "setback",
      ].filter((id) => id !== mission).slice(0, 2) as typeof mission[];
      const action = {
        type: "vrolijke-open-plek.missions.chosen",
        actorId: "a",
        missions: [mission, ...alternatives],
      } satisfies VrolijkeOpenPlekAction;
      state = reduce(state, action);
      state = addDeveloperVrolijkeOpenPlekPartner(
        state,
        action,
        "b",
        members,
      );
      expect(selectedMission(state, members)).toBe(mission);
    }
  });
});
