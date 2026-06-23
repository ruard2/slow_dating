import type {
  KruispuntReactiesAction,
  KruispuntReactiesState,
} from "./contracts";
import { kruispuntReactiesStateSchema } from "./contracts";
import { reactionCards } from "./content";

const cardsPerRound = 10;

export function createInitialKruispuntReactiesState(
  readyInstallationIds: string[] = [],
): KruispuntReactiesState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    usedCardIds: [],
    roundNumber: 1,
    roundCardIds: [],
    currentCardIndex: 0,
    cardStartedAt: null,
    answers: {},
    repeatVotes: {},
    revisitCardIds: {},
    finished: false,
  };
}

export function normalizeKruispuntReactiesState(input: unknown) {
  const parsed = kruispuntReactiesStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialKruispuntReactiesState(readyInstallationIds);
}

function nextCards(usedCardIds: string[]) {
  return reactionCards
    .map(({ id }) => id)
    .filter((id) => !usedCardIds.includes(id))
    .slice(0, cardsPerRound);
}

export function activeReactionCardId(state: KruispuntReactiesState) {
  return state.roundCardIds[state.currentCardIndex] ?? null;
}

export function bothAnswered(
  state: KruispuntReactiesState,
  memberIds: string[],
) {
  const cardId = activeReactionCardId(state);
  return Boolean(
    cardId &&
      memberIds.every((memberId) => state.answers[cardId]?.[memberId]),
  );
}

export function kruispuntReactiesReducer(
  current: KruispuntReactiesState,
  action: KruispuntReactiesAction,
  memberIds: string[],
): KruispuntReactiesState {
  const state = normalizeKruispuntReactiesState(current);
  if (state.finished || action.type === "kruispunt-reacties.game.completed") {
    return state;
  }

  if (action.type === "kruispunt-reacties.ready") {
    const readyInstallationIds = [
      ...new Set([...state.readyInstallationIds, action.actorId]),
    ];
    if (
      state.roundCardIds.length > 0 ||
      !memberIds.every((id) => readyInstallationIds.includes(id))
    ) {
      return { ...state, readyInstallationIds };
    }
    const roundCardIds = nextCards(state.usedCardIds);
    return {
      ...state,
      readyInstallationIds,
      roundCardIds,
      currentCardIndex: 0,
      cardStartedAt: action.startedAt,
    };
  }

  if (action.type === "kruispunt-reacties.answered") {
    const cardId = activeReactionCardId(state);
    if (!cardId || cardId !== action.cardId || state.answers[cardId]?.[action.actorId]) {
      return state;
    }
    return {
      ...state,
      answers: {
        ...state.answers,
        [cardId]: {
          ...state.answers[cardId],
          [action.actorId]: {
            optionIndex: action.optionIndex,
            answeredAt: action.answeredAt,
          },
        },
      },
    };
  }

  if (action.type === "kruispunt-reacties.card.advanced") {
    const cardId = activeReactionCardId(state);
    if (
      !cardId ||
      cardId !== action.cardId ||
      !bothAnswered(state, memberIds)
    ) {
      return state;
    }
    const currentCardIndex = state.currentCardIndex + 1;
    return {
      ...state,
      currentCardIndex,
      cardStartedAt:
        currentCardIndex < state.roundCardIds.length ? action.startedAt : null,
    };
  }

  if (action.type === "kruispunt-reacties.round.voted") {
    if (state.currentCardIndex < state.roundCardIds.length) return state;
    const repeatVotes = {
      ...state.repeatVotes,
      [action.actorId]: action.vote,
    };
    const revisitCardIds = {
      ...state.revisitCardIds,
      [action.actorId]: action.revisitCardId,
    };
    if (!memberIds.every((id) => repeatVotes[id])) {
      return { ...state, repeatVotes, revisitCardIds };
    }
    const usedCardIds = [
      ...new Set([...state.usedCardIds, ...state.roundCardIds]),
    ];
    const playAgain =
      memberIds.every((id) => repeatVotes[id] === "again") &&
      usedCardIds.length < reactionCards.length;
    if (!playAgain) {
      return {
        ...state,
        repeatVotes,
        revisitCardIds,
        usedCardIds,
        finished: true,
      };
    }
    return {
      ...state,
      usedCardIds,
      roundNumber: state.roundNumber + 1,
      roundCardIds: nextCards(usedCardIds),
      currentCardIndex: 0,
      cardStartedAt: action.startedAt,
      repeatVotes: {},
      revisitCardIds,
    };
  }

  return state;
}

export function addDeveloperKruispuntPartner(
  state: KruispuntReactiesState,
  action: KruispuntReactiesAction,
  partnerId: string,
  memberIds: string[],
) {
  if (action.type === "kruispunt-reacties.ready") {
    return kruispuntReactiesReducer(
      state,
      { ...action, actorId: partnerId },
      memberIds,
    );
  }
  if (action.type === "kruispunt-reacties.answered") {
    const seed =
      [...action.cardId].reduce((total, value) => total + value.charCodeAt(0), 0) %
      4;
    return kruispuntReactiesReducer(
      state,
      {
        ...action,
        actorId: partnerId,
        optionIndex: seed,
      },
      memberIds,
    );
  }
  if (action.type === "kruispunt-reacties.round.voted") {
    return kruispuntReactiesReducer(
      state,
      { ...action, actorId: partnerId },
      memberIds,
    );
  }
  return state;
}
