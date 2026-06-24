import { describe, expect, it } from "vitest";

import { houseTasks } from "./content";
import {
  addDeveloperHuishoudtafelPartner,
  createInitialHuishoudtafelState,
  getComparisonTaskIds,
  huishoudtafelReducer,
} from "./reducer";
import { serializeHuishoudtafelResult } from "./result";

function completedBoard(actorId = "a") {
  let state = createInitialHuishoudtafelState(["a", "b"]);
  houseTasks.forEach((task, index) => {
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.task.placed",
      actorId,
      taskId: task.id,
      owner: index % 3 === 0 ? "partner" : "self",
      rhythm: task.rhythm,
    });
  });
  return state;
}

describe("huishoudtafel reducer", () => {
  it("bewaart persoon en ritme direct bij iedere taak", () => {
    const state = huishoudtafelReducer(
      createInitialHuishoudtafelState(["a", "b"]),
      {
        type: "huishoudtafel.task.placed",
        actorId: "a",
        taskId: "cooking",
        owner: "partner",
        rhythm: "daily",
      },
    );

    expect(state.placementsByPerson.a?.cooking).toEqual({
      owner: "partner",
      rhythm: "daily",
    });
  });

  it("laat een bord pas sluiten wanneer iedere taak geplaatst of weggeveegd is", () => {
    let state = createInitialHuishoudtafelState(["a", "b"]);
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.task.skipped",
      actorId: "a",
      taskId: houseTasks[0]!.id,
    });
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.distribution.submitted",
      actorId: "a",
    });
    expect(state.submittedIds).not.toContain("a");

    state = completedBoard();
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.distribution.submitted",
      actorId: "a",
    });
    expect(state.submittedIds).toContain("a");
  });

  it("zet verschillen in drager boven verschillen in ritme", () => {
    let state = completedBoard();
    state = {
      ...state,
      placementsByPerson: {
        ...state.placementsByPerson,
        b: {
          ...state.placementsByPerson.a,
          cooking: { owner: "partner", rhythm: "daily" },
          vacuum: { owner: "self", rhythm: "sometimes" },
        },
      },
    };
    const differences = getComparisonTaskIds(state, "a", "b");

    expect(differences[0]).toBe("cooking");
  });

  it("maakt voor de virtuele partner een volledig maar afwijkend bord", () => {
    let state = completedBoard();
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.distribution.submitted",
      actorId: "a",
    });
    state = addDeveloperHuishoudtafelPartner(
      state,
      {
        type: "huishoudtafel.distribution.submitted",
        actorId: "a",
      },
      "b",
    );

    expect(
      Object.keys(state.placementsByPerson.b ?? {}).length +
        (state.skippedByPerson.b ?? []).length,
    ).toBe(houseTasks.length);
    expect(state.submittedIds).toContain("b");
    expect(getComparisonTaskIds(state, "a", "b").length).toBeGreaterThan(0);
  });

  it("trekt bevestigingen in na een gewijzigd experiment", () => {
    let state = completedBoard();
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.experiments.proposed",
      actorId: "a",
      experiments: [
        { taskId: "cooking", text: "Twee weken één duidelijke eigenaar." },
      ],
    });
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.experiments.confirmed",
      actorId: "a",
    });
    state = huishoudtafelReducer(state, {
      type: "huishoudtafel.experiments.proposed",
      actorId: "b",
      experiments: [
        { taskId: "cooking", text: "Eerst twee weken observeren." },
      ],
    });

    expect(state.experimentConfirmedIds).toEqual([]);
  });

  it("bewaart de christelijke reflectie afzonderlijk per partner", () => {
    const state = huishoudtafelReducer(completedBoard(), {
      type: "huishoudtafel.faith.submitted",
      actorId: "a",
      taskId: "laundry-away",
      risk: "Stille bitterheid",
      reflection: "Dienen én eerder uitspreken wat ik nodig heb.",
    });

    expect(state.faithByPerson.a?.risk).toBe("Stille bitterheid");
    expect(state.faithSubmittedIds).toContain("a");
  });

  it("serialiseert taakbeelden, mentale last en bevestigde experimenten", () => {
    let state = completedBoard();
    state = {
      ...state,
      ownershipDetailsByPerson: {
        a: {
          cooking: {
            notice: "partner",
            plan: "partner",
            execute: "self",
          },
        },
      },
      experiments: [
        {
          taskId: "cooking",
          text: "Twee weken één duidelijke eigenaar.",
          proposedBy: "a",
        },
      ],
      experimentConfirmedIds: ["a", "b"],
    };
    const result = serializeHuishoudtafelResult(state);

    expect(
      result.people.a?.ownershipDetails.cooking?.execute,
    ).toBe("self");
    expect(result.acceptedExperiments).toHaveLength(1);
  });
});
