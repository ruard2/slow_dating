import type { KennismakingAction, KennismakingState } from "./contracts";
import { kennismakingStateSchema } from "./contracts";
import { computeNiveau } from "./content";

export function createInitialKennismakingState(
  readyInstallationIds: string[] = [],
): KennismakingState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    duurByPlayer: {},
    kennisByPlayer: {},
    kaartSeed: 0,
    quizSeed: 0,
    raadSeed: 0,
    quizRound: 0,
    quizAnswers: {},
    quizScores: {},
    raadIdx: 0,
    raadFirstAntwoorder: "",
    raadAnswers: [],
    raadScore: 0,
    completedInstallationIds: [],
  };
}

export function normalizeKennismakingState(input: unknown): KennismakingState {
  const parsed = kennismakingStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (v): v is string => typeof v === "string",
        )
      : [];
  return createInitialKennismakingState(readyInstallationIds);
}

export function kennismakingReducer(
  current: KennismakingState,
  action: KennismakingAction,
): KennismakingState {
  const state = normalizeKennismakingState(current);

  if (action.type === "kennismaking.niveau.set") {
    return {
      ...state,
      duurByPlayer: { ...state.duurByPlayer, [action.actorId]: action.duur },
      kennisByPlayer: { ...state.kennisByPlayer, [action.actorId]: action.kennis },
    };
  }

  if (action.type === "kennismaking.kaart.started") {
    return { ...state, kaartSeed: state.kaartSeed || action.seed };
  }

  if (action.type === "kennismaking.quiz.started") {
    return {
      ...state,
      quizSeed: state.quizSeed || action.seed,
      quizRound: 0,
      quizAnswers: {},
      quizScores: {},
    };
  }

  if (action.type === "kennismaking.quiz.answer.submitted") {
    const existing = state.quizAnswers[action.actorId] ?? [];
    const filtered = existing.filter((a) => a.round !== action.round);
    return {
      ...state,
      quizAnswers: {
        ...state.quizAnswers,
        [action.actorId]: [
          ...filtered,
          { round: action.round, eigen: action.eigen, raad: action.raad },
        ],
      },
    };
  }

  if (action.type === "kennismaking.quiz.score.updated") {
    const mijnId = action.actorId;
    const scores = { ...state.quizScores };
    if (action.mijGoed) scores[mijnId] = (scores[mijnId] ?? 0) + 1;
    // Find partner id from quizAnswers keys
    const partnerIds = Object.keys(state.quizAnswers).filter((id) => id !== mijnId);
    if (action.partnerGoed && partnerIds[0]) {
      const pid = partnerIds[0];
      scores[pid] = (scores[pid] ?? 0) + 1;
    }
    return { ...state, quizScores: scores };
  }

  if (action.type === "kennismaking.quiz.next.round") {
    return { ...state, quizRound: Math.max(state.quizRound, action.round + 1) };
  }

  if (action.type === "kennismaking.raad.started") {
    return {
      ...state,
      raadSeed: state.raadSeed || action.seed,
      raadIdx: 0,
      raadFirstAntwoorder: state.raadFirstAntwoorder || action.firstAntwoorderId,
      raadAnswers: [],
      raadScore: 0,
    };
  }

  if (action.type === "kennismaking.raad.antwoord.submitted") {
    const existing = state.raadAnswers.filter((a) => a.idx !== action.idx);
    return {
      ...state,
      raadAnswers: [
        ...existing,
        { idx: action.idx, antwoord: action.antwoord, antwoorderId: action.actorId, gok: "" },
      ],
    };
  }

  if (action.type === "kennismaking.raad.gok.submitted") {
    return {
      ...state,
      raadAnswers: state.raadAnswers.map((a) =>
        a.idx === action.idx ? { ...a, gok: action.gok } : a,
      ),
    };
  }

  if (action.type === "kennismaking.raad.score") {
    return {
      ...state,
      raadScore: state.raadScore + (action.raak ? 1 : 0),
      raadIdx: Math.max(state.raadIdx, action.idx + 1),
    };
  }

  if (action.type === "kennismaking.game.completed") {
    if (state.completedInstallationIds.includes(action.actorId)) return state;
    return {
      ...state,
      completedInstallationIds: [...state.completedInstallationIds, action.actorId],
    };
  }

  return state;
}

export function addDeveloperKennismakingPartner(
  state: KennismakingState,
  action: KennismakingAction,
  partnerId: string,
): KennismakingState {
  if (action.type === "kennismaking.niveau.set") {
    return {
      ...state,
      duurByPlayer: { ...state.duurByPlayer, [partnerId]: action.duur },
      kennisByPlayer: { ...state.kennisByPlayer, [partnerId]: action.kennis },
    };
  }
  if (action.type === "kennismaking.quiz.answer.submitted") {
    const existing = state.quizAnswers[partnerId] ?? [];
    const filtered = existing.filter((a) => a.round !== action.round);
    return {
      ...state,
      quizAnswers: {
        ...state.quizAnswers,
        [partnerId]: [
          ...filtered,
          {
            round: action.round,
            eigen: `[Partner antwoord ronde ${action.round + 1}]`,
            raad: `[Partner gok ronde ${action.round + 1}]`,
          },
        ],
      },
    };
  }
  if (action.type === "kennismaking.raad.antwoord.submitted") {
    const existing = state.raadAnswers.filter((a) => a.idx !== action.idx);
    return {
      ...state,
      raadAnswers: [
        ...existing,
        { idx: action.idx, antwoord: "[Partner antwoord]", antwoorderId: partnerId, gok: "" },
      ],
    };
  }
  if (action.type === "kennismaking.raad.gok.submitted") {
    return {
      ...state,
      raadAnswers: state.raadAnswers.map((a) =>
        a.idx === action.idx ? { ...a, gok: "[Partner gok]" } : a,
      ),
    };
  }
  if (action.type === "kennismaking.game.completed") {
    if (state.completedInstallationIds.includes(partnerId)) return state;
    return {
      ...state,
      completedInstallationIds: [...state.completedInstallationIds, partnerId],
    };
  }
  return state;
}

export function getEffectiveNiveau(
  state: KennismakingState,
  installationId: string,
): 1 | 2 | 3 {
  const duur = state.duurByPlayer[installationId] ?? 1;
  const kennis = state.kennisByPlayer[installationId] ?? 1;
  return computeNiveau(duur, kennis);
}
