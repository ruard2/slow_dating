import {
  compassPillars,
  moneyScales,
  moneyScenarios,
  reflectionPrompts,
  scenarioFears,
  scenarioNeeds,
} from "./content";
import type { CompassPillarId } from "./content";
import type {
  GeldbrugAction,
  GeldbrugState,
  ScenarioAnswer,
} from "./contracts";
import { geldbrugStateSchema } from "./contracts";

const emptyCompass = () =>
  Object.fromEntries(compassPillars.map((pillar) => [pillar.id, 0])) as Record<
    (typeof compassPillars)[number]["id"],
    number
  >;

export function createInitialGeldbrugState(
  readyInstallationIds: string[] = [],
): GeldbrugState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    compassByPerson: {},
    reflectionsByPerson: {},
    compassSubmittedIds: [],
    scenarioIds: [],
    scenarioAnswers: {},
    scenariosSubmittedIds: [],
    scalesByPerson: {},
    scalesSubmittedIds: [],
    christianReflections: {},
    christianSubmittedIds: [],
    commitment: null,
    commitmentConfirmedIds: [],
  };
}

export function normalizeGeldbrugState(input: unknown) {
  const parsed = geldbrugStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialGeldbrugState(readyInstallationIds);
}

export function selectScenarioIds(seed: string, count = 5) {
  let hash = [...seed].reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );
  const pool = moneyScenarios.map((scenario) => scenario.id);
  const selected: string[] = [];
  while (pool.length && selected.length < count) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const index = hash % pool.length;
    selected.push(pool.splice(index, 1)[0]!);
  }
  return selected;
}

export function compassTotal(compass: Record<string, number> | undefined) {
  return Object.values(compass ?? {}).reduce((sum, value) => sum + value, 0);
}

export function geldbrugReducer(
  current: GeldbrugState,
  action: GeldbrugAction,
): GeldbrugState {
  const state = normalizeGeldbrugState(current);

  if (
    action.type === "geldbrug.game.completed" ||
    action.type === "geldbrug.game.replayed"
  ) {
    return state;
  }

  if (action.type === "geldbrug.session.started") {
    return state.scenarioIds.length
      ? state
      : { ...state, scenarioIds: action.scenarioIds };
  }

  if (action.type === "geldbrug.compass.coin.moved") {
    if (state.compassSubmittedIds.includes(action.actorId)) return state;
    const compass = {
      ...emptyCompass(),
      ...(state.compassByPerson[action.actorId] ?? {}),
    };
    const next = Math.max(0, compass[action.pillarId] + action.delta);
    const totalWithout = compassTotal(compass) - compass[action.pillarId];
    if (totalWithout + next > 25) return state;
    return {
      ...state,
      compassByPerson: {
        ...state.compassByPerson,
        [action.actorId]: { ...compass, [action.pillarId]: next },
      },
    };
  }

  if (action.type === "geldbrug.reflection.answered") {
    if (state.compassSubmittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      reflectionsByPerson: {
        ...state.reflectionsByPerson,
        [action.actorId]: {
          ...(state.reflectionsByPerson[action.actorId] ?? {}),
          [action.promptId]: action.value,
        },
      },
    };
  }

  if (action.type === "geldbrug.compass.submitted") {
    if (compassTotal(state.compassByPerson[action.actorId]) !== 25) return state;
    if (
      reflectionPrompts.some(
        (prompt) => !state.reflectionsByPerson[action.actorId]?.[prompt.id],
      )
    ) {
      return state;
    }
    return {
      ...state,
      compassSubmittedIds: [
        ...new Set([...state.compassSubmittedIds, action.actorId]),
      ],
    };
  }

  if (action.type === "geldbrug.scenario.answered") {
    if (state.scenariosSubmittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      scenarioAnswers: {
        ...state.scenarioAnswers,
        [action.scenarioId]: {
          ...(state.scenarioAnswers[action.scenarioId] ?? {}),
          [action.actorId]: action.answer,
        },
      },
    };
  }

  if (action.type === "geldbrug.scenarios.submitted") {
    const complete = state.scenarioIds.every(
      (scenarioId) => state.scenarioAnswers[scenarioId]?.[action.actorId],
    );
    return complete
      ? {
          ...state,
          scenariosSubmittedIds: [
            ...new Set([...state.scenariosSubmittedIds, action.actorId]),
          ],
        }
      : state;
  }

  if (action.type === "geldbrug.scale.changed") {
    if (state.scalesSubmittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      scalesByPerson: {
        ...state.scalesByPerson,
        [action.actorId]: {
          ...(state.scalesByPerson[action.actorId] ?? {}),
          [action.scaleId]: action.value,
        },
      },
    };
  }

  if (action.type === "geldbrug.scales.submitted") {
    const complete = moneyScales.every(
      (scale) =>
        typeof state.scalesByPerson[action.actorId]?.[scale.id] === "number",
    );
    return complete
      ? {
          ...state,
          scalesSubmittedIds: [
            ...new Set([...state.scalesSubmittedIds, action.actorId]),
          ],
        }
      : state;
  }

  if (action.type === "geldbrug.christian.answered") {
    if (state.christianSubmittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      christianReflections: {
        ...state.christianReflections,
        [action.actorId]: {
          ...(state.christianReflections[action.actorId] ?? {}),
          [action.questionId]: action.value,
        },
      },
    };
  }

  if (action.type === "geldbrug.christian.submitted") {
    const answeredCount = Object.values(
      state.christianReflections[action.actorId] ?? {},
    ).filter((value) => value.trim().length > 0).length;
    if (answeredCount < 3) return state;
    return {
      ...state,
      christianSubmittedIds: [
        ...new Set([...state.christianSubmittedIds, action.actorId]),
      ],
    };
  }

  if (action.type === "geldbrug.commitment.proposed") {
    const text = action.text.trim();
    if (!text) return state;
    return {
      ...state,
      commitment: {
        text,
        proposedBy: action.actorId,
        revision: (state.commitment?.revision ?? -1) + 1,
      },
      commitmentConfirmedIds: [],
    };
  }

  if (action.type === "geldbrug.commitment.confirmed") {
    if (!state.commitment) return state;
    return {
      ...state,
      commitmentConfirmedIds: [
        ...new Set([...state.commitmentConfirmedIds, action.actorId]),
      ],
    };
  }

  return state;
}

function rotate<T>(items: readonly T[], offset: number) {
  return items[offset % items.length] ?? items[0]!;
}

export function addDeveloperGeldbrugPartner(
  state: GeldbrugState,
  action: GeldbrugAction,
  partnerId: string,
) {
  if (action.type === "geldbrug.compass.submitted") {
    const own = state.compassByPerson[action.actorId] ?? emptyCompass();
    const values = compassPillars.map((pillar, index) => {
      const shifted =
        (own[compassPillars[(index + 2) % compassPillars.length]!.id] ?? 0) +
        (index === 0 ? 1 : 0);
      return Math.max(1, shifted);
    });
    let total = values.reduce((sum, value) => sum + value, 0);
    while (total > 25) {
      const index = values.findIndex((value) => value > 1);
      values[index] = values[index]! - 1;
      total--;
    }
    while (total < 25) {
      const index = total % values.length;
      values[index] = values[index]! + 1;
      total++;
    }
    const compass = Object.fromEntries(
      compassPillars.map((pillar, index) => [pillar.id, values[index]]),
    ) as Record<CompassPillarId, number>;
    const reflections = Object.fromEntries(
      reflectionPrompts.map((prompt, index) => [
        prompt.id,
        rotate(prompt.options, index + 1),
      ]),
    );
    return {
      ...state,
      compassByPerson: { ...state.compassByPerson, [partnerId]: compass },
      reflectionsByPerson: {
        ...state.reflectionsByPerson,
        [partnerId]: reflections,
      },
      compassSubmittedIds: [
        ...new Set([...state.compassSubmittedIds, partnerId]),
      ],
    };
  }

  if (action.type === "geldbrug.scenarios.submitted") {
    const scenarioAnswers = { ...state.scenarioAnswers };
    state.scenarioIds.forEach((scenarioId, index) => {
      const scenario = moneyScenarios.find((item) => item.id === scenarioId);
      if (!scenario) return;
      const answer: ScenarioAnswer = {
        choice: rotate(scenario.choices, index + 1),
        need: rotate(scenarioNeeds, index + 2),
        fear: rotate(scenarioFears, index + 1),
        trust: ((index + 2) % 5) + 1,
      };
      scenarioAnswers[scenarioId] = {
        ...(scenarioAnswers[scenarioId] ?? {}),
        [partnerId]: answer,
      };
    });
    return {
      ...state,
      scenarioAnswers,
      scenariosSubmittedIds: [
        ...new Set([...state.scenariosSubmittedIds, partnerId]),
      ],
    };
  }

  if (action.type === "geldbrug.scales.submitted") {
    const own = state.scalesByPerson[action.actorId] ?? {};
    const scales = Object.fromEntries(
      moneyScales.map((scale, index) => [
        scale.id,
        Math.max(
          0,
          Math.min(100, 100 - (own[scale.id] ?? 50) + (index - 2) * 5),
        ),
      ]),
    );
    return {
      ...state,
      scalesByPerson: { ...state.scalesByPerson, [partnerId]: scales },
      scalesSubmittedIds: [
        ...new Set([...state.scalesSubmittedIds, partnerId]),
      ],
    };
  }

  if (action.type === "geldbrug.christian.submitted") {
    return {
      ...state,
      christianReflections: {
        ...state.christianReflections,
        [partnerId]: {
          trust:
            "Ik wil zekerheid niet alleen uit controle halen, maar wel zorgvuldig blijven handelen.",
        },
      },
      christianSubmittedIds: [
        ...new Set([...state.christianSubmittedIds, partnerId]),
      ],
    };
  }

  if (action.type === "geldbrug.commitment.confirmed") {
    return geldbrugReducer(state, {
      ...action,
      actorId: partnerId,
    });
  }

  return state;
}
