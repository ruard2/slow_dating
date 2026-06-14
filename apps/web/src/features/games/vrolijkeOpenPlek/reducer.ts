import type {
  VrolijkeOpenPlekAction,
  VrolijkeOpenPlekState,
} from "./contracts";
import { vrolijkeOpenPlekStateSchema } from "./contracts";
import { isYouTubeUrl, missions, type MissionId } from "./content";

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const;

export function createInitialVrolijkeOpenPlekState(
  readyInstallationIds: string[] = [],
): VrolijkeOpenPlekState {
  return {
    schemaVersion: 1,
    readyInstallationIds,
    missionChoices: {},
    videoUrl: "",
    tictactoeBoard: Array.from({ length: 9 }, () => null),
    tictactoeTurn: 0,
    bluffClaims: {},
    bluffGuesses: {},
    duelChoices: {},
    setbackChoices: {},
    missionReadyIds: [],
    reflections: {},
    conversationDoneIds: [],
  };
}

export function normalizeVrolijkeOpenPlekState(input: unknown) {
  const parsed = vrolijkeOpenPlekStateSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  const readyInstallationIds =
    input &&
    typeof input === "object" &&
    Array.isArray((input as Record<string, unknown>).readyInstallationIds)
      ? (input as { readyInstallationIds: unknown[] }).readyInstallationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  return createInitialVrolijkeOpenPlekState(readyInstallationIds);
}

export function selectedMission(
  state: VrolijkeOpenPlekState,
  memberIds: string[],
): MissionId | null {
  if (!memberIds.every((id) => state.missionChoices[id])) return null;
  const common = missions
    .map(({ id }) => id)
    .filter((id) =>
      memberIds.every((memberId) =>
        state.missionChoices[memberId]?.includes(id),
      ),
    );
  return (
    common.sort(
      (left, right) =>
        memberIds.reduce(
          (score, memberId) =>
            score + (state.missionChoices[memberId]?.indexOf(left) ?? 99),
          0,
        ) -
        memberIds.reduce(
          (score, memberId) =>
            score + (state.missionChoices[memberId]?.indexOf(right) ?? 99),
          0,
        ),
    )[0] ?? null
  );
}

export function tictactoeWinner(state: VrolijkeOpenPlekState) {
  for (const [a, b, c] of winningLines) {
    const mark = state.tictactoeBoard[a];
    if (mark && mark === state.tictactoeBoard[b] && mark === state.tictactoeBoard[c]) {
      return mark;
    }
  }
  return state.tictactoeBoard.every(Boolean) ? "draw" : null;
}

export function vrolijkeOpenPlekReducer(
  current: VrolijkeOpenPlekState,
  action: VrolijkeOpenPlekAction,
  memberIds: string[],
): VrolijkeOpenPlekState {
  const state = normalizeVrolijkeOpenPlekState(current);
  if (action.type === "vrolijke-open-plek.game.completed") return state;

  if (action.type === "vrolijke-open-plek.missions.chosen") {
    return {
      ...state,
      missionChoices: {
        ...state.missionChoices,
        [action.actorId]: [...new Set(action.missions)] as MissionId[],
      },
    };
  }

  if (action.type === "vrolijke-open-plek.video.set") {
    const videoUrl = action.url.trim();
    return isYouTubeUrl(videoUrl) ? { ...state, videoUrl } : state;
  }

  if (action.type === "vrolijke-open-plek.tictactoe.moved") {
    if (tictactoeWinner(state) || state.tictactoeBoard[action.cell]) return state;
    const expectedActor = memberIds[state.tictactoeTurn % memberIds.length];
    if (expectedActor !== action.actorId) return state;
    const board = [...state.tictactoeBoard];
    board[action.cell] = state.tictactoeTurn % 2 === 0 ? "x" : "o";
    return { ...state, tictactoeBoard: board, tictactoeTurn: state.tictactoeTurn + 1 };
  }

  if (action.type === "vrolijke-open-plek.bluff.submitted") {
    return {
      ...state,
      bluffClaims: {
        ...state.bluffClaims,
        [action.actorId]: {
          prompt: action.prompt,
          claim: action.claim.trim(),
          truthful: action.truthful,
        },
      },
    };
  }

  if (action.type === "vrolijke-open-plek.bluff.guessed") {
    return {
      ...state,
      bluffGuesses: { ...state.bluffGuesses, [action.actorId]: action.truthful },
    };
  }

  if (action.type === "vrolijke-open-plek.duel.chosen") {
    return {
      ...state,
      duelChoices: { ...state.duelChoices, [action.actorId]: action.choice },
    };
  }

  if (action.type === "vrolijke-open-plek.setback.chosen") {
    return {
      ...state,
      setbackChoices: { ...state.setbackChoices, [action.actorId]: action.choice },
    };
  }

  if (action.type === "vrolijke-open-plek.mission.ready") {
    return {
      ...state,
      missionReadyIds: [...new Set([...state.missionReadyIds, action.actorId])],
    };
  }

  if (action.type === "vrolijke-open-plek.reflection.submitted") {
    return {
      ...state,
      reflections: { ...state.reflections, [action.actorId]: action.reflection },
    };
  }

  return {
    ...state,
    conversationDoneIds: [
      ...new Set([...state.conversationDoneIds, action.actorId]),
    ],
  };
}

export function addDeveloperVrolijkeOpenPlekPartner(
  state: VrolijkeOpenPlekState,
  action: VrolijkeOpenPlekAction,
  partnerId: string,
  memberIds: string[],
) {
  if (action.type === "vrolijke-open-plek.missions.chosen") {
    return vrolijkeOpenPlekReducer(
      state,
      {
        ...action,
        actorId: partnerId,
        missions: action.missions,
      },
      memberIds,
    );
  }
  if (action.type === "vrolijke-open-plek.tictactoe.moved" && !tictactoeWinner(state)) {
    const cell = state.tictactoeBoard.findIndex((value) => value === null);
    return cell < 0
      ? state
      : vrolijkeOpenPlekReducer(
          state,
          { ...action, actorId: partnerId, cell },
          memberIds,
        );
  }
  if (action.type === "vrolijke-open-plek.bluff.submitted") {
    return vrolijkeOpenPlekReducer(
      state,
      {
        ...action,
        actorId: partnerId,
        prompt: "Een vreemde gewoonte die bijna niemand van mij kent",
        claim: "Ik praat soms tegen planten alsof ze advies teruggeven.",
        truthful: true,
      },
      memberIds,
    );
  }
  if (action.type === "vrolijke-open-plek.bluff.guessed") {
    return vrolijkeOpenPlekReducer(
      state,
      { ...action, actorId: partnerId, truthful: false },
      memberIds,
    );
  }
  if (action.type === "vrolijke-open-plek.duel.chosen") {
    return vrolijkeOpenPlekReducer(
      state,
      { ...action, actorId: partnerId, choice: action.choice === "rock" ? "paper" : "rock" },
      memberIds,
    );
  }
  if (action.type === "vrolijke-open-plek.setback.chosen") {
    return vrolijkeOpenPlekReducer(
      state,
      { ...action, actorId: partnerId, choice: "comfort" },
      memberIds,
    );
  }
  if (
    action.type === "vrolijke-open-plek.mission.ready" ||
    action.type === "vrolijke-open-plek.conversation.done"
  ) {
    return vrolijkeOpenPlekReducer(state, { ...action, actorId: partnerId }, memberIds);
  }
  if (action.type === "vrolijke-open-plek.reflection.submitted") {
    return vrolijkeOpenPlekReducer(
      state,
      {
        ...action,
        actorId: partnerId,
        reflection: {
          lighter: 4,
          relief: "together",
          pressure: "laugh",
          support: "join",
        },
      },
      memberIds,
    );
  }
  return state;
}
