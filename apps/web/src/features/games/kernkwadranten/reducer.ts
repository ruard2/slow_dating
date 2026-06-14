import type {
  KernkwadrantenAction,
  KernkwadrantenState,
} from "./contracts";
import { kernkwadrantenStateSchema } from "./contracts";

export function createInitialKernkwadrantenState(
  readyInstallationIds: string[] = [],
): KernkwadrantenState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    profiles: {},
    explanationReadyIds: [],
    currentRound: 0,
    drafts: {},
    rounds: [{}, {}, {}],
    discussedByRound: [[], [], []],
  };
}

export function normalizeKernkwadrantenState(input: unknown) {
  const parsed = kernkwadrantenStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialKernkwadrantenState(readyInstallationIds);
}

function roundSubject(state: KernkwadrantenState, actorId: string) {
  const profile = state.profiles[actorId];
  if (!profile) return "";
  return state.currentRound < 2
    ? profile.qualities[state.currentRound] ?? ""
    : profile.allergy;
}

export function kernkwadrantenReducer(
  current: KernkwadrantenState,
  action: KernkwadrantenAction,
  memberIds: string[],
): KernkwadrantenState {
  const state = normalizeKernkwadrantenState(current);
  if (action.type === "kernkwadranten.game.completed") return state;

  if (action.type === "kernkwadranten.profile.confirmed") {
    return {
      ...state,
      profiles: {
        ...state.profiles,
        [action.actorId]: {
          qualities: action.qualities,
          allergy: action.allergy,
        },
      },
    };
  }

  if (action.type === "kernkwadranten.explanation.ready") {
    return {
      ...state,
      explanationReadyIds: [
        ...new Set([...state.explanationReadyIds, action.actorId]),
      ],
    };
  }

  if (state.currentRound >= 3) return state;

  if (action.type === "kernkwadranten.choice.selected") {
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.actorId]: {
          ...(state.drafts[action.actorId] ?? {}),
          [action.field]: action.value,
        },
      },
    };
  }

  if (action.type === "kernkwadranten.round.submitted") {
    const draft = state.drafts[action.actorId] ?? {};
    const subject = roundSubject(state, action.actorId);
    const quality = state.currentRound < 2 ? subject : draft.quality;
    const allergy = state.currentRound < 2 ? draft.allergy : subject;
    if (!quality || !draft.pitfall || !draft.challenge || !allergy) {
      return state;
    }
    const rounds = state.rounds.map((round, index) =>
      index === state.currentRound
        ? {
            ...round,
            [action.actorId]: {
              quality,
              pitfall: draft.pitfall!,
              challenge: draft.challenge!,
              allergy,
            },
          }
        : round,
    );
    return { ...state, rounds, drafts: { ...state.drafts, [action.actorId]: {} } };
  }

  const discussed = [
    ...new Set([
      ...(state.discussedByRound[state.currentRound] ?? []),
      action.actorId,
    ]),
  ];
  const discussedByRound = state.discussedByRound.map((ids, index) =>
    index === state.currentRound ? discussed : ids,
  );
  const complete = memberIds.every((id) => discussed.includes(id));
  return {
    ...state,
    discussedByRound,
    currentRound: complete ? Math.min(3, state.currentRound + 1) : state.currentRound,
  };
}

export function addDeveloperKernkwadrantenPartner(
  state: KernkwadrantenState,
  action: KernkwadrantenAction,
  partnerId: string,
  memberIds: string[],
) {
  if (action.type === "kernkwadranten.profile.confirmed") {
    return kernkwadrantenReducer(
      state,
      {
        ...action,
        actorId: partnerId,
        qualities: [action.qualities[1]!, action.qualities[0]!],
      },
      memberIds,
    );
  }
  if (action.type === "kernkwadranten.explanation.ready") {
    return kernkwadrantenReducer(
      state,
      { ...action, actorId: partnerId },
      memberIds,
    );
  }
  if (action.type === "kernkwadranten.round.submitted") {
    const own = state.rounds[state.currentRound]?.[action.actorId];
    if (!own) return state;
    let next = state;
    for (const [field, value] of Object.entries({
      quality: own.quality,
      pitfall: own.pitfall,
      challenge: own.challenge,
      allergy: own.allergy,
    })) {
      if (
        (state.currentRound < 2 && field === "quality") ||
        (state.currentRound === 2 && field === "allergy")
      ) {
        continue;
      }
      next = kernkwadrantenReducer(
        next,
        {
          type: "kernkwadranten.choice.selected",
          actorId: partnerId,
          field: field as "quality" | "pitfall" | "challenge" | "allergy",
          value,
        },
        memberIds,
      );
    }
    return kernkwadrantenReducer(
      next,
      { ...action, actorId: partnerId },
      memberIds,
    );
  }
  if (action.type === "kernkwadranten.round.discussed") {
    return kernkwadrantenReducer(
      state,
      { ...action, actorId: partnerId },
      memberIds,
    );
  }
  return state;
}
