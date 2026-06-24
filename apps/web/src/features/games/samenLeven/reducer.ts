import type {
  SamenLevenAction,
  SamenLevenState,
} from "./contracts";
import { samenLevenStateSchema } from "./contracts";

export function createInitialSamenLevenState(
  readyInstallationIds: string[] = [],
): SamenLevenState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    themeId: null,
    themeChoices: {},
    themeAttempt: 0,
    selections: {},
    submittedIds: [],
    discussionDoneIds: [],
  };
}

export function normalizeSamenLevenState(input: unknown) {
  const parsed = samenLevenStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialSamenLevenState(readyInstallationIds);
}

export function samenLevenReducer(
  current: SamenLevenState,
  action: SamenLevenAction,
): SamenLevenState {
  const state = normalizeSamenLevenState(current);
  if (
    action.type === "samen-leven.game.completed" ||
    action.type === "samen-leven.game.replayed"
  ) {
    return state;
  }

  if (action.type === "samen-leven.theme.selected") {
    if (
      state.themeId ||
      state.submittedIds.length ||
      Object.keys(state.selections).length ||
      state.themeChoices[action.actorId]
    ) {
      return state;
    }
    const themeChoices = {
      ...state.themeChoices,
      [action.actorId]: action.themeId,
    };
    const choices = Object.values(themeChoices);
    return {
      ...state,
      themeChoices,
      themeId:
        choices.length >= 2 && choices.every((choice) => choice === choices[0])
          ? (choices[0] ?? null)
          : null,
    };
  }

  if (action.type === "samen-leven.theme.retry") {
    if (state.themeId || Object.keys(state.themeChoices).length < 2) {
      return state;
    }
    return {
      ...state,
      themeChoices: {},
      themeAttempt: state.themeAttempt + 1,
    };
  }

  if (action.type === "samen-leven.option.selected") {
    if (state.submittedIds.includes(action.actorId)) return state;
    return {
      ...state,
      selections: {
        ...state.selections,
        [action.actorId]: {
          ...(state.selections[action.actorId] ?? {}),
          [action.promptId]: action.value,
        },
      },
    };
  }

  if (action.type === "samen-leven.answers.submitted") {
    return {
      ...state,
      submittedIds: [...new Set([...state.submittedIds, action.actorId])],
    };
  }

  if (action.type === "samen-leven.discussion.done") {
    return {
      ...state,
      discussionDoneIds: [
        ...new Set([...state.discussionDoneIds, action.actorId]),
      ],
    };
  }

  return state;
}

export function addDeveloperSamenLevenPartner(
  state: SamenLevenState,
  action: SamenLevenAction,
  partnerId: string,
  optionsByPrompt: Record<string, readonly string[]> = {},
) {
  if (action.type === "samen-leven.theme.selected") {
    return samenLevenReducer(state, {
      ...action,
      actorId: partnerId,
    });
  }
  if (action.type === "samen-leven.answers.submitted") {
    const own = state.selections[action.actorId] ?? {};
    const partnerSelections: Record<string, string> = Object.fromEntries(
      Object.entries(own).map(([promptId, value]): [string, string] => {
        const options = optionsByPrompt[promptId] ?? [];
        const ownIndex = options.indexOf(value);
        const partnerValue =
          ownIndex >= 0 && options.length > 1
            ? (options[(ownIndex + 1) % options.length] ?? value)
            : value;
        return [promptId, partnerValue];
      }),
    );
    return {
      ...state,
      selections: {
        ...state.selections,
        [partnerId]: partnerSelections,
      },
      submittedIds: [...new Set([...state.submittedIds, partnerId])],
    };
  }
  if (action.type === "samen-leven.discussion.done") {
    return samenLevenReducer(state, { ...action, actorId: partnerId });
  }
  return state;
}
