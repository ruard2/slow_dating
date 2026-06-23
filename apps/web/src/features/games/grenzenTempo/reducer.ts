import type { GrenzenTempoAction, GrenzenTempoState } from "./contracts";
import { grenzenTempoStateSchema } from "./contracts";
import {
  boundaryScenarios,
  smallNoScenarios,
  tempoAreas,
} from "./content";

export function createInitialGrenzenTempoState(
  readyInstallationIds: string[] = [],
): GrenzenTempoState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    boundaryAnswers: {},
    boundaryDiscussedIds: [],
    tempoAnswers: {},
    tempoDiscussedIds: [],
    smallNos: {},
    smallNoResponses: {},
  };
}

export function normalizeGrenzenTempoState(input: unknown) {
  const parsed = grenzenTempoStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialGrenzenTempoState(readyInstallationIds);
}

function addOnce(values: string[], actorId: string) {
  return [...new Set([...values, actorId])];
}

export function grenzenTempoReducer(
  current: GrenzenTempoState,
  action: GrenzenTempoAction,
): GrenzenTempoState {
  const state = normalizeGrenzenTempoState(current);

  if (action.type === "grenzen-tempo.boundaries.submitted") {
    return {
      ...state,
      boundaryAnswers: {
        ...state.boundaryAnswers,
        [action.actorId]: action.answers,
      },
    };
  }
  if (action.type === "grenzen-tempo.boundaries.discussed") {
    return {
      ...state,
      boundaryDiscussedIds: addOnce(
        state.boundaryDiscussedIds,
        action.actorId,
      ),
    };
  }
  if (action.type === "grenzen-tempo.tempo.submitted") {
    return {
      ...state,
      tempoAnswers: {
        ...state.tempoAnswers,
        [action.actorId]: action.answers,
      },
    };
  }
  if (action.type === "grenzen-tempo.tempo.discussed") {
    return {
      ...state,
      tempoDiscussedIds: addOnce(state.tempoDiscussedIds, action.actorId),
    };
  }
  if (action.type === "grenzen-tempo.small-no.submitted") {
    return {
      ...state,
      smallNos: {
        ...state.smallNos,
        [action.actorId]: action.exercise,
      },
    };
  }
  if (action.type === "grenzen-tempo.small-no.responded") {
    return {
      ...state,
      smallNoResponses: {
        ...state.smallNoResponses,
        [action.actorId]: action.response,
      },
    };
  }
  return state;
}

export function addDeveloperGrenzenTempoPartner(
  state: GrenzenTempoState,
  action: GrenzenTempoAction,
  partnerId: string,
) {
  if (action.type === "grenzen-tempo.boundaries.submitted") {
    const answers = Object.fromEntries(
      boundaryScenarios.map((scenario, index) => [
        scenario.id,
        index % 4 === 0 ? "ask-first" : index % 5 === 0 ? "later" : "fine",
      ]),
    ) as GrenzenTempoState["boundaryAnswers"][string];
    return grenzenTempoReducer(state, {
      ...action,
      actorId: partnerId,
      answers,
    });
  }
  if (action.type === "grenzen-tempo.boundaries.discussed") {
    return grenzenTempoReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "grenzen-tempo.tempo.submitted") {
    const answers = Object.fromEntries(
      tempoAreas.map((area, index) => [
        area.id,
        index === 3 || index === 5 ? "slow" : "calm",
      ]),
    ) as GrenzenTempoState["tempoAnswers"][string];
    return grenzenTempoReducer(state, {
      ...action,
      actorId: partnerId,
      answers,
    });
  }
  if (action.type === "grenzen-tempo.tempo.discussed") {
    return grenzenTempoReducer(state, { ...action, actorId: partnerId });
  }
  if (action.type === "grenzen-tempo.small-no.submitted") {
    return grenzenTempoReducer(state, {
      ...action,
      actorId: partnerId,
      exercise: {
        scenario: smallNoScenarios[1],
        phrase: "Daar wil ik nog niet over praten.",
      },
    });
  }
  if (action.type === "grenzen-tempo.small-no.responded") {
    return grenzenTempoReducer(state, {
      ...action,
      actorId: partnerId,
      response: {
        responseId: "thank-you",
        supportId: "stay-warm",
      },
    });
  }
  return state;
}

