import {
  type ValueId,
  type WaardenAction,
  type WaardenState,
  waardenStateSchema,
} from "./contracts";

export function createInitialWaardenState(
  readyInstallationIds: string[] = [],
): WaardenState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    selections: {},
    submittedInstallationIds: [],
  };
}

export function normalizeWaardenState(input: unknown): WaardenState {
  const parsed = waardenStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const legacyReady =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialWaardenState(legacyReady);
}

export function waardenReducer(
  current: WaardenState,
  action: WaardenAction,
): WaardenState {
  const state = normalizeWaardenState(current);
  if (action.type === "waarden.game.completed") return state;
  if (state.submittedInstallationIds.includes(action.actorId)) return state;

  if (action.type === "waarden.value.toggled") {
    const selection = state.selections[action.actorId] ?? [];
    const selected = selection.includes(action.valueId);
    if (!selected && selection.length >= 3) return state;
    return {
      ...state,
      selections: {
        ...state.selections,
        [action.actorId]: selected
          ? selection.filter((value) => value !== action.valueId)
          : [...selection, action.valueId],
      },
    };
  }

  const selection = state.selections[action.actorId] ?? [];
  if (selection.length !== 3) return state;
  return {
    ...state,
    submittedInstallationIds: [
      ...new Set([...state.submittedInstallationIds, action.actorId]),
    ],
  };
}

export function addDeveloperPartnerSelection(
  current: WaardenState,
  partnerId: string,
  ownSelection: ValueId[],
) {
  if (current.submittedInstallationIds.includes(partnerId)) return current;
  const preferred: ValueId[] = [
    ownSelection[0] ?? "eerlijkheid",
    "rust",
    "groei",
    "humor",
  ];
  const partnerSelection = [...new Set(preferred)].slice(0, 3);
  let state = current;
  for (const valueId of partnerSelection) {
    state = waardenReducer(state, {
      type: "waarden.value.toggled",
      actorId: partnerId,
      valueId,
    });
  }
  return waardenReducer(state, {
    type: "waarden.selection.submitted",
    actorId: partnerId,
  });
}
