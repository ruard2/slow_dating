import type { SpiegelvijverAction, SpiegelvijverState } from "./contracts";
import { spiegelvijverStateSchema } from "./contracts";

export function createInitialSpiegelvijverState(
  readyInstallationIds: string[] = [],
): SpiegelvijverState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    selfPortraits: {},
    observations: {},
    recognitions: {},
    conversationDoneIds: [],
  };
}

export function normalizeSpiegelvijverState(input: unknown) {
  const parsed = spiegelvijverStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialSpiegelvijverState(readyInstallationIds);
}

export function spiegelvijverReducer(
  current: SpiegelvijverState,
  action: SpiegelvijverAction,
): SpiegelvijverState {
  const state = normalizeSpiegelvijverState(current);
  if (action.type === "spiegelvijver.self.submitted") {
    return {
      ...state,
      selfPortraits: {
        ...state.selfPortraits,
        [action.actorId]: action.portrait,
      },
    };
  }
  if (action.type === "spiegelvijver.observation.submitted") {
    return {
      ...state,
      observations: {
        ...state.observations,
        [action.actorId]: action.observation,
      },
    };
  }
  if (action.type === "spiegelvijver.recognition.submitted") {
    return {
      ...state,
      recognitions: {
        ...state.recognitions,
        [action.actorId]: action.recognition,
      },
    };
  }
  if (action.type === "spiegelvijver.conversation.done") {
    return {
      ...state,
      conversationDoneIds: [
        ...new Set([...state.conversationDoneIds, action.actorId]),
      ],
    };
  }
  return state;
}

export function addDeveloperSpiegelvijverPartner(
  state: SpiegelvijverState,
  action: SpiegelvijverAction,
  partnerId: string,
) {
  if (action.type === "spiegelvijver.self.submitted") {
    return spiegelvijverReducer(state, {
      ...action,
      actorId: partnerId,
      portrait: {
        openness: "open-not-deep",
        origin: "Vroeger viel ik op als ik vrolijk was, dus dat werd mijn manier.",
        surface: ["vrolijk", "grappig"],
        deeper: ["behoefte aan bevestiging", "gevoeligheid"],
        hidden: ["waarom ik snel help"],
      },
    });
  }
  if (action.type === "spiegelvijver.observation.submitted") {
    return spiegelvijverReducer(state, {
      ...action,
      actorId: partnerId,
      observation: {
        reading: "feels-more",
        seenIn: "Aan hoe je het gesprek soms net iets te snel licht maakt.",
        gentleNote: "Ik denk dat ik dit al een beetje bij jou zie.",
      },
    });
  }
  if (action.type === "spiegelvijver.recognition.submitted") {
    return spiegelvijverReducer(state, {
      ...action,
      actorId: partnerId,
      recognition: {
        recognises: "partly",
        reflection: "Ik laat makkelijk iets zien, maar vaak vooral de buitenkant.",
      },
    });
  }
  if (action.type === "spiegelvijver.conversation.done") {
    return spiegelvijverReducer(state, { ...action, actorId: partnerId });
  }
  return state;
}
