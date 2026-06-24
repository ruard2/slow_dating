import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import type { GameRun, Pair } from "@slow-dating/contracts";
import { findPlayableGame, worldPathForGame } from "@slow-dating/content";

import styles from "../../App.module.css";
import { LoadingScreen } from "../../app/LoadingScreen";
import { PartnerArrived, WaitingRoom } from "../../components/WaitingRoom";
import { api } from "../../lib/api";
import { useRealtime } from "../../providers/RealtimeProvider";
import { useSession } from "../../providers/SessionProvider";
import { useAppStore } from "../../store/appStore";
import type { WaardenAction } from "./waarden/contracts";
import { waardenDefinition } from "./waarden/definition";
import {
  addDeveloperPartnerSelection,
  normalizeWaardenState,
  waardenReducer,
} from "./waarden/reducer";
import { serializeWaardenResult } from "./waarden/result";
import type { KernkwadrantenAction } from "./kernkwadranten/contracts";
import { kernkwadrantenDefinition } from "./kernkwadranten/definition";
import {
  addDeveloperKernkwadrantenPartner,
  kernkwadrantenReducer,
  normalizeKernkwadrantenState,
} from "./kernkwadranten/reducer";
import { serializeKernkwadrantenResult } from "./kernkwadranten/result";
import type { StilteruisjeAction } from "./stilteruisje/contracts";
import { stilteruisjeDefinition } from "./stilteruisje/definition";
import {
  addDeveloperStilteruisjePartner,
  normalizeStilteruisjeState,
  stilteruisjeReducer,
} from "./stilteruisje/reducer";
import { serializeStilteruisjeResult } from "./stilteruisje/result";
import type { VrolijkeOpenPlekAction } from "./vrolijkeOpenPlek/contracts";
import { vrolijkeOpenPlekDefinition } from "./vrolijkeOpenPlek/definition";
import {
  addDeveloperVrolijkeOpenPlekPartner,
  normalizeVrolijkeOpenPlekState,
  vrolijkeOpenPlekReducer,
} from "./vrolijkeOpenPlek/reducer";
import { serializeVrolijkeOpenPlekResult } from "./vrolijkeOpenPlek/result";
import type { OudeEikAction } from "./oudeEik/contracts";
import { oudeEikDefinition } from "./oudeEik/definition";
import {
  addDeveloperOudeEikPartner,
  normalizeOudeEikState,
  oudeEikReducer,
} from "./oudeEik/reducer";
import { serializeOudeEikResult } from "./oudeEik/result";
import type { SpiegelvijverAction } from "./spiegelvijver/contracts";
import { spiegelvijverDefinition } from "./spiegelvijver/definition";
import {
  addDeveloperSpiegelvijverPartner,
  normalizeSpiegelvijverState,
  spiegelvijverReducer,
} from "./spiegelvijver/reducer";
import { serializeSpiegelvijverResult } from "./spiegelvijver/result";
import type { GrenzenTempoAction } from "./grenzenTempo/contracts";
import { grenzenTempoDefinition } from "./grenzenTempo/definition";
import {
  addDeveloperGrenzenTempoPartner,
  grenzenTempoReducer,
  normalizeGrenzenTempoState,
} from "./grenzenTempo/reducer";
import { serializeGrenzenTempoResult } from "./grenzenTempo/result";
import type { KruispuntReactiesAction } from "./kruispuntReacties/contracts";
import { kruispuntReactiesDefinition } from "./kruispuntReacties/definition";
import {
  addDeveloperKruispuntPartner,
  kruispuntReactiesReducer,
  normalizeKruispuntReactiesState,
} from "./kruispuntReacties/reducer";
import { serializeKruispuntReactiesResult } from "./kruispuntReacties/result";
import type { HuishoudtafelAction } from "./huishoudtafel/contracts";
import { huishoudtafelDefinition } from "./huishoudtafel/definition";
import {
  addDeveloperHuishoudtafelPartner,
  huishoudtafelReducer,
  normalizeHuishoudtafelState,
} from "./huishoudtafel/reducer";
import { serializeHuishoudtafelResult } from "./huishoudtafel/result";
import type { GeldbrugAction } from "./geldbrug/contracts";
import { geldbrugDefinition } from "./geldbrug/definition";
import {
  addDeveloperGeldbrugPartner,
  geldbrugReducer,
  normalizeGeldbrugState,
} from "./geldbrug/reducer";
import { serializeGeldbrugResult } from "./geldbrug/result";
import type { WinkelmandjeAction } from "./winkelmandje/contracts";
import { winkelmandjeDefinition } from "./winkelmandje/definition";
import {
  addDeveloperWinkelmandjePartner,
  normalizeWinkelmandjeState,
  winkelmandjeReducer,
} from "./winkelmandje/reducer";
import { serializeWinkelmandjeResult } from "./winkelmandje/result";
import type { StressmeterAction } from "./stressmeter/contracts";
import { stressmeterDefinition } from "./stressmeter/definition";
import {
  addDeveloperStressmeterPartner,
  normalizeStressmeterState,
  stressmeterReducer,
} from "./stressmeter/reducer";
import { serializeStressmeterResult } from "./stressmeter/result";
import type { KleineDateAction } from "./kleineDate/contracts";
import { kleineDateDefinition } from "./kleineDate/definition";
import {
  addDeveloperKleineDatePartner,
  kleineDateReducer,
  normalizeKleineDateState,
} from "./kleineDate/reducer";
import { serializeKleineDateResult } from "./kleineDate/result";
import type { SamenLevenAction } from "./samenLeven/contracts";
import {
  getSamenLevenRound,
  isSamenLevenGameId,
  samenLevenContent,
} from "./samenLeven/content";
import { samenLevenDefinitions } from "./samenLeven/definitions";
import {
  addDeveloperSamenLevenPartner,
  normalizeSamenLevenState,
  samenLevenReducer,
} from "./samenLeven/reducer";
import { serializeSamenLevenResult } from "./samenLeven/result";
export function GamePage({
  developerPartnerArriving,
  developerPartnerPresent,
  onDeveloperPartnerArrivalComplete,
  pair,
}: {
  developerPartnerArriving: boolean;
  developerPartnerPresent: boolean;
  onDeveloperPartnerArrivalComplete(): void;
  pair: Pair | null | undefined;
}) {
  const { session } = useSession();
  const { gameId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const enteredRef = useRef<string | null>(null);
  const completedRunRef = useRef<string | null>(null);
  const runRef = useRef<GameRun | null>(null);
  const actionQueueRef = useRef(Promise.resolve());
  const [arrivalComplete, setArrivalComplete] = useState(false);
  const [nativePending, setNativePending] = useState(false);
  const { connected, lastEvent, send } = useRealtime();
  const setDrawer = useAppStore((state) => state.setDrawer);
  const setChatContext = useAppStore((state) => state.setChatContext);
  const game = findPlayableGame(gameId);
  const worldPath = worldPathForGame(gameId);
  const relationshipResults = useQuery({
    queryKey: ["relationship-results", pair?.id],
    queryFn: () => api.getRelationshipResults(pair!.id),
    enabled: Boolean(pair?.id),
  });
  const activeRun = useQuery({
    queryKey: ["active-game-run", pair?.id, gameId],
    queryFn: () => api.getActiveGameRun(gameId),
    enabled: Boolean(game && pair?.members.length === 2),
    refetchInterval: (query) =>
      query.state.data?.status === "completed" ? false : 1_500,
  });
  const enterRun = useMutation({
    mutationFn: async () => {
      if (
        pair?.developerMode &&
        gameId === vrolijkeOpenPlekDefinition.id
      ) {
        const current = await api.getActiveGameRun(gameId);
        if (current) await api.abandonGameRun(current.id);
      }
      return api.createGameRun(gameId, game?.version ?? 1);
    },
    onSuccess: (run) => {
      queryClient.setQueryData(["active-game-run", pair?.id, gameId], run);
      send("game.lobby.enter", { gameId, gameRunId: run.id });
    },
  });
  const restartRun = useMutation({
    mutationFn: async () => {
      if (runRef.current) {
        await api.abandonGameRun(runRef.current.id);
      }
      return api.createGameRun(gameId, game?.version ?? 1);
    },
    onSuccess: (freshRun) => {
      runRef.current = freshRun;
      setArrivalComplete(false);
      queryClient.setQueryData(
        ["active-game-run", pair?.id, gameId],
        freshRun,
      );
      send("game.lobby.enter", { gameId, gameRunId: freshRun.id });
    },
  });
  const run = activeRun.data ?? enterRun.data;
  const readyInstallationIds = Array.isArray(run?.state.readyInstallationIds)
    ? run.state.readyInstallationIds.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const started = Boolean(
    run?.status === "active" &&
      ((pair?.developerMode && developerPartnerPresent) ||
        (pair &&
          !pair.developerMode &&
          readyInstallationIds.filter((id) =>
            pair.members.some((member) => member.installationId === id),
          ).length >= 2)),
  );
  const partner = pair?.members.find(
    (member) => member.installationId !== session?.installationId,
  );
  const hasWaited = Boolean(
    run &&
      (!pair?.developerMode || developerPartnerArriving) &&
      run.installationId === session?.installationId,
  );

  useEffect(() => {
    runRef.current = run ?? null;
  }, [run]);

  useEffect(() => {
    if (connected && run) {
      void activeRun.refetch();
    }
  }, [activeRun, connected, run]);

  useEffect(() => {
    if (
      !game ||
      pair?.members.length !== 2 ||
      enteredRef.current === `${pair.id}:${gameId}`
    ) {
      return;
    }
    enteredRef.current = `${pair.id}:${gameId}`;
    enterRun.mutate();
  }, [enterRun, game, gameId, pair]);

  useEffect(() => {
    if (!run || started) return;
    void api.startWaitingSession(run.id).catch(() => {
      // Pair teardown can race with the final waiting-room request.
    });
  }, [run, started]);

  useEffect(() => {
    if (!started || !run || !hasWaited || arrivalComplete) return;
    void api.endWaitingSession(run.id).catch(() => {
      // Pair teardown can race with the final waiting-room request.
    });
    const timeout = window.setTimeout(() => {
      setArrivalComplete(true);
      if (pair?.developerMode) onDeveloperPartnerArrivalComplete();
    }, 1_400);
    return () => clearTimeout(timeout);
  }, [
    arrivalComplete,
    hasWaited,
    onDeveloperPartnerArrivalComplete,
    pair?.developerMode,
    run,
    started,
  ]);

  useEffect(() => {
    if (lastEvent?.type === "game.lobby.enter") {
      const payload = lastEvent.payload as { gameId?: string };
      if (payload.gameId === gameId) {
        void queryClient.invalidateQueries({
          queryKey: ["active-game-run", pair?.id, gameId],
        });
      }
      return;
    }
    if (lastEvent?.type === "game.state.updated") {
      const payload = lastEvent.payload as { gameRunId?: string };
      if (payload.gameRunId === run?.id) {
        void activeRun.refetch();
      }
      return;
    }
    if (lastEvent?.type !== "game.sync") return;
    const payload = lastEvent.payload as {
      gameRunId?: string;
      state?: unknown;
    };
    frameRef.current?.contentWindow?.postMessage(
      { type: "slow-dating:legacy-event", payload: payload.state },
      window.location.origin,
    );
  }, [activeRun, gameId, lastEvent, pair?.id, queryClient, run?.id]);

  useEffect(() => {
    if (!run || !frameRef.current?.contentWindow) return;
    frameRef.current.contentWindow.postMessage(
      {
        type: "slow-dating:legacy-event",
        payload: {
          legacyEvent: "state_restored",
          data: run.state,
          revision: run.revision,
        },
      },
      window.location.origin,
    );
  }, [run]);

  const dispatchWaardenAction = useCallback(
    async (action: WaardenAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;

        const apply = () => {
          const currentState = normalizeWaardenState(current!.state);
          let nextState = waardenReducer(currentState, action);
          if (
            pair?.developerMode &&
            action.type === "waarden.selection.submitted"
          ) {
            const partnerId = pair.members.find(
              (member) => member.installationId !== action.actorId,
            )?.installationId;
            if (partnerId) {
              nextState = addDeveloperPartnerSelection(
                nextState,
                partnerId,
                nextState.selections[action.actorId] ?? [],
              );
            }
          }
          const completesRun = action.type === "waarden.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeWaardenResult(
                    nextState,
                    pair?.members.map((member) => member.installationId) ?? [],
                  ),
                }
              : {}),
          });
        };

        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "waarden.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchKernkwadrantenAction = useCallback(
    async (action: KernkwadrantenAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];

        const apply = () => {
          let nextState = kernkwadrantenReducer(
            normalizeKernkwadrantenState(current!.state),
            action,
            memberIds,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperKernkwadrantenPartner(
                nextState,
                action,
                partnerId,
                memberIds,
              );
            }
          }
          const completesRun =
            action.type === "kernkwadranten.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeKernkwadrantenResult(nextState),
                }
              : {}),
          });
        };

        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "kernkwadranten.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchStilteruisjeAction = useCallback(
    async (action: StilteruisjeAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];

        const apply = () => {
          let nextState = stilteruisjeReducer(
            normalizeStilteruisjeState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperStilteruisjePartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun = action.type === "stilteruisje.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeStilteruisjeResult(nextState),
                }
              : {}),
          });
        };

        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "stilteruisje.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchVrolijkeOpenPlekAction = useCallback(
    async (action: VrolijkeOpenPlekAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];

        const apply = () => {
          let nextState = vrolijkeOpenPlekReducer(
            normalizeVrolijkeOpenPlekState(current!.state),
            action,
            memberIds,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperVrolijkeOpenPlekPartner(
                nextState,
                action,
                partnerId,
                memberIds,
              );
            }
          }
          const completesRun =
            action.type === "vrolijke-open-plek.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeVrolijkeOpenPlekResult(
                    nextState,
                    memberIds,
                  ),
                }
              : {}),
          });
        };

        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "vrolijke-open-plek.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchOudeEikAction = useCallback(
    async (action: OudeEikAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = oudeEikReducer(
            normalizeOudeEikState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperOudeEikPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun = action.type === "oude-eik.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeOudeEikResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "oude-eik.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchSpiegelvijverAction = useCallback(
    async (action: SpiegelvijverAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = spiegelvijverReducer(
            normalizeSpiegelvijverState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperSpiegelvijverPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun = action.type === "spiegelvijver.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeSpiegelvijverResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "spiegelvijver.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchGrenzenTempoAction = useCallback(
    async (action: GrenzenTempoAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = grenzenTempoReducer(
            normalizeGrenzenTempoState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperGrenzenTempoPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun = action.type === "grenzen-tempo.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeGrenzenTempoResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "grenzen-tempo.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchKruispuntReactiesAction = useCallback(
    async (action: KruispuntReactiesAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = kruispuntReactiesReducer(
            normalizeKruispuntReactiesState(current!.state),
            action,
            memberIds,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperKruispuntPartner(
                nextState,
                action,
                partnerId,
                memberIds,
              );
            }
          }
          const completesRun =
            action.type === "kruispunt-reacties.game.completed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeKruispuntReactiesResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (action.type === "kruispunt-reacties.game.completed") {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          navigate(worldPath);
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchHuishoudtafelAction = useCallback(
    async (action: HuishoudtafelAction) => {
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = huishoudtafelReducer(
            normalizeHuishoudtafelState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperHuishoudtafelPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun =
            action.type === "huishoudtafel.game.completed" ||
            action.type === "huishoudtafel.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeHuishoudtafelResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "huishoudtafel.game.completed" ||
          action.type === "huishoudtafel.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "huishoudtafel.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? huishoudtafelDefinition.version,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchKleineDateAction = useCallback(
    async (action: KleineDateAction) => {
      if (gameId !== kleineDateDefinition.id) return;
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = kleineDateReducer(
            normalizeKleineDateState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperKleineDatePartner(
                nextState,
                action,
                partnerId,
                Boolean(pair.christianLayer),
              );
            }
          }
          const completesRun =
            action.type === "kleine-date.game.completed" ||
            action.type === "kleine-date.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeKleineDateResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "kleine-date.game.completed" ||
          action.type === "kleine-date.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "kleine-date.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? kleineDateDefinition.version,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchSamenLevenAction = useCallback(
    async (action: SamenLevenAction) => {
      if (!isSamenLevenGameId(gameId)) return;
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = samenLevenReducer(
            normalizeSamenLevenState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              const prompts = getSamenLevenRound(
                samenLevenContent[gameId],
                nextState.themeId,
              ).prompts;
              nextState = addDeveloperSamenLevenPartner(
                nextState,
                action,
                partnerId,
                Object.fromEntries(
                  prompts.map((prompt) => [prompt.id, prompt.options]),
                ),
              );
            }
          }
          const completesRun =
            action.type === "samen-leven.game.completed" ||
            action.type === "samen-leven.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: `${gameId}.${action.type}`,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeSamenLevenResult(gameId, nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "samen-leven.game.completed" ||
          action.type === "samen-leven.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "samen-leven.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? 1,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchGeldbrugAction = useCallback(
    async (action: GeldbrugAction) => {
      if (gameId !== geldbrugDefinition.id) return;
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = geldbrugReducer(
            normalizeGeldbrugState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperGeldbrugPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun =
            action.type === "geldbrug.game.completed" ||
            action.type === "geldbrug.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeGeldbrugResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "geldbrug.game.completed" ||
          action.type === "geldbrug.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "geldbrug.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? geldbrugDefinition.version,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchWinkelmandjeAction = useCallback(
    async (action: WinkelmandjeAction) => {
      if (gameId !== winkelmandjeDefinition.id) return;
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = winkelmandjeReducer(
            normalizeWinkelmandjeState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperWinkelmandjePartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun =
            action.type === "winkelmandje.game.completed" ||
            action.type === "winkelmandje.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeWinkelmandjeResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "winkelmandje.game.completed" ||
          action.type === "winkelmandje.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "winkelmandje.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? winkelmandjeDefinition.version,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  const dispatchStressmeterAction = useCallback(
    async (action: StressmeterAction) => {
      if (gameId !== stressmeterDefinition.id) return;
      setNativePending(true);
      const queued = actionQueueRef.current.then(async () => {
        let current = runRef.current;
        if (!current) return;
        const memberIds =
          pair?.members.map((member) => member.installationId) ?? [];
        const apply = () => {
          let nextState = stressmeterReducer(
            normalizeStressmeterState(current!.state),
            action,
          );
          if (pair?.developerMode) {
            const partnerId = memberIds.find((id) => id !== action.actorId);
            if (partnerId) {
              nextState = addDeveloperStressmeterPartner(
                nextState,
                action,
                partnerId,
              );
            }
          }
          const completesRun =
            action.type === "stressmeter.game.completed" ||
            action.type === "stressmeter.game.replayed";
          return api.applyGameAction(current!.id, {
            id: crypto.randomUUID(),
            expectedRevision: current!.revision,
            type: action.type,
            payload: action,
            state: nextState,
            ...(completesRun
              ? {
                  status: "completed" as const,
                  result: serializeStressmeterResult(nextState),
                }
              : {}),
          });
        };
        let updated: GameRun;
        try {
          updated = await apply();
        } catch {
          const refreshed = await activeRun.refetch();
          if (!refreshed.data) throw new Error("Spelsessie niet gevonden.");
          current = refreshed.data;
          runRef.current = current;
          updated = await apply();
        }
        runRef.current = updated;
        queryClient.setQueryData(
          ["active-game-run", pair?.id, gameId],
          updated,
        );
        send("game.state.updated", {
          gameRunId: updated.id,
          revision: updated.revision,
        });
        if (
          action.type === "stressmeter.game.completed" ||
          action.type === "stressmeter.game.replayed"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["progress"] });
          await queryClient.invalidateQueries({
            queryKey: ["relationship-results", pair?.id],
          });
          if (action.type === "stressmeter.game.replayed") {
            const freshRun = await api.createGameRun(
              gameId,
              game?.version ?? stressmeterDefinition.version,
            );
            runRef.current = freshRun;
            setArrivalComplete(false);
            queryClient.setQueryData(
              ["active-game-run", pair?.id, gameId],
              freshRun,
            );
            send("game.lobby.enter", {
              gameId,
              gameRunId: freshRun.id,
            });
          } else {
            navigate(worldPath);
          }
        }
      });
      actionQueueRef.current = queued.catch(() => undefined);
      try {
        await queued;
      } finally {
        setNativePending(false);
      }
    },
    [activeRun, game, gameId, navigate, pair, queryClient, send, worldPath],
  );

  useEffect(() => {
    function receiveLegacyMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        event.data?.source !== "slow-dating-legacy"
      ) {
        return;
      }
      const legacyEvent = String(event.data.legacyEvent ?? "");
      if (run) {
        void api
          .recordActivity({
            clientEventId: crypto.randomUUID(),
            category: "game",
            type: `legacy.${legacyEvent || "unknown"}`,
            gameRunId: run.id,
            payload:
              event.data.data &&
              typeof event.data.data === "object" &&
              !Array.isArray(event.data.data)
                ? event.data.data
                : { value: event.data.data ?? null },
          })
          .catch(() => {
            // The iframe can emit one final diagnostic event during teardown.
          });
      }
      if (legacyEvent === "open_chat") {
        const chatText =
          event.data.data &&
          typeof event.data.data === "object" &&
          !Array.isArray(event.data.data) &&
          typeof event.data.data.text === "string"
            ? event.data.data.text
            : "";
        const returnsToMap =
          event.data.data &&
          typeof event.data.data === "object" &&
          !Array.isArray(event.data.data) &&
          event.data.data.returnToMap === true;
        const autoSend =
          event.data.data &&
          typeof event.data.data === "object" &&
          !Array.isArray(event.data.data) &&
          event.data.data.autoSend === true;
        if (autoSend && chatText.trim()) {
          send("chat.send", {
            clientId: crypto.randomUUID(),
            text: chatText.trim(),
          });
          setChatContext("", returnsToMap);
        } else {
          setChatContext(chatText, returnsToMap);
        }
        setDrawer("chat");
        return;
      }
      if (legacyEvent === "open_call") {
        setDrawer("call");
        return;
      }
      if (legacyEvent === "open_pair") {
        setDrawer("pair");
        return;
      }
      if (run) {
        const completesRun =
          legacyEvent === "session_complete" &&
          completedRunRef.current !== run.id;
        if (legacyEvent === "session_complete" && !completesRun) return;
        if (completesRun) completedRunRef.current = run.id;
        const actionId = crypto.randomUUID();
        const payload =
          event.data.data &&
          typeof event.data.data === "object" &&
          !Array.isArray(event.data.data)
            ? event.data.data
            : { value: event.data.data ?? null };
        actionQueueRef.current = actionQueueRef.current.then(async () => {
          let current = runRef.current;
          if (!current) return;
          const apply = () =>
            api.applyGameAction(current!.id, {
              id: actionId,
              expectedRevision: current!.revision,
              type: `legacy.${legacyEvent || "unknown"}`,
              payload,
              state: {
                ...current!.state,
                lastLegacyEvent: {
                  type: legacyEvent,
                  data: event.data.data ?? {},
                },
              },
              ...(completesRun
                ? {
                    status: "completed" as const,
                    result: payload,
                  }
                : {}),
            });
          let updated: GameRun;
          try {
            updated = await apply();
          } catch {
            const refreshed = await activeRun.refetch();
            if (!refreshed.data) return;
            current = refreshed.data;
            runRef.current = current;
            updated = await apply();
          }
          runRef.current = updated;
          queryClient.setQueryData(
            ["active-game-run", pair?.id, gameId],
            updated,
          );
          send("game.state.updated", {
            gameRunId: updated.id,
            revision: updated.revision,
          });
          if (completesRun) {
            await queryClient.invalidateQueries({ queryKey: ["progress"] });
            await queryClient.invalidateQueries({
              queryKey: ["relationship-results", pair?.id],
            });
            navigate(worldPath);
          }
        }).catch(() => {
            if (completesRun) completedRunRef.current = null;
            void activeRun.refetch();
        });
      }
    }

    window.addEventListener("message", receiveLegacyMessage);
    return () => window.removeEventListener("message", receiveLegacyMessage);
  }, [
    activeRun,
    gameId,
    pair?.id,
    queryClient,
    run,
    send,
    setChatContext,
    setDrawer,
    navigate,
    worldPath,
  ]);

  if (!game) return <Navigate replace to="/" />;

  if (!pair || pair.members.length !== 2) {
    return (
      <main className={styles.gameWelcome}>
        <button
          className={styles.backButton}
          onClick={() => navigate(worldPath)}
          type="button"
        >
          Terug naar de kaart
        </button>
        <div className={styles.gameWelcomeCard}>
          <span>Samen ontdekken</span>
          <h1>{game.title}</h1>
          <p>Dit spel speel je uitsluitend samen. Koppel eerst met je partner.</p>
          <button
            className={styles.primaryButton}
            onClick={() => setDrawer("pair")}
            type="button"
          >
            Partner koppelen
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    if (!run) return <LoadingScreen />;
    return (
      <WaitingRoom
        gameRunId={run.id}
        partnerName={partner?.displayName ?? "Je partner"}
      />
    );
  }

  if (hasWaited && !arrivalComplete) {
    return (
      <PartnerArrived partnerName={partner?.displayName ?? "Je partner"} />
    );
  }

  if (game.status === "native" && game.id === waardenDefinition.id && run) {
    const WaardenComponent = waardenDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="waarden"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <WaardenComponent
          dispatch={dispatchWaardenAction}
          installationId={session?.installationId ?? ""}
          memberIds={pair.members.map((member) => member.installationId)}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeWaardenState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === kernkwadrantenDefinition.id &&
    run
  ) {
    if (relationshipResults.isFetching) return <LoadingScreen />;
    const KernkwadrantenComponent = kernkwadrantenDefinition.Component;
    const previous = relationshipResults.data?.find(
      ({ provenance }) => provenance.gameId === "kwaliteiten",
    )?.result;
    const own =
      previous?.own && typeof previous.own === "object"
        ? (previous.own as Record<string, unknown>)
        : {};
    const partnerResult =
      previous?.partner && typeof previous.partner === "object"
        ? (previous.partner as Record<string, unknown>)
        : {};
    const priorQualityOptions = [
      ...(Array.isArray(own.kwaliteiten) ? own.kwaliteiten : []),
      ...(Array.isArray(partnerResult.kwaliteiten)
        ? partnerResult.kwaliteiten
        : []),
    ].filter((value): value is string => typeof value === "string");
    const priorAllergyOptions = [
      own.allergie,
      partnerResult.allergie,
    ].filter((value): value is string => typeof value === "string");
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="kernkwadranten"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <KernkwadrantenComponent
          dispatch={dispatchKernkwadrantenAction}
          installationId={session?.installationId ?? ""}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          priorAllergyOptions={priorAllergyOptions}
          priorQualityOptions={priorQualityOptions}
          state={normalizeKernkwadrantenState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === geldbrugDefinition.id &&
    run
  ) {
    const GeldbrugComponent = geldbrugDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="geldbrug"
      >
        {pair.developerMode && (
          <button
            className={styles.restartGameButton}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <GeldbrugComponent
          christianLayer={pair.christianLayer}
          dispatch={dispatchGeldbrugAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeGeldbrugState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === winkelmandjeDefinition.id &&
    run
  ) {
    const WinkelmandjeComponent = winkelmandjeDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="winkelmandje"
      >
        {pair.developerMode && (
          <button
            className={styles.restartGameButton}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <WinkelmandjeComponent
          christianLayer={pair.christianLayer}
          dispatch={dispatchWinkelmandjeAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeWinkelmandjeState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === stressmeterDefinition.id &&
    run
  ) {
    const StressmeterComponent = stressmeterDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="stressmeter"
      >
        {pair.developerMode && (
          <button
            className={styles.restartGameButton}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <StressmeterComponent
          christianLayer={pair.christianLayer}
          dispatch={dispatchStressmeterAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeStressmeterState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === kleineDateDefinition.id &&
    run
  ) {
    const KleineDateComponent = kleineDateDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="kleine-date"
      >
        {pair.developerMode && (
          <button
            className={styles.restartGameButton}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <KleineDateComponent
          christianLayer={pair.christianLayer}
          dispatch={dispatchKleineDateAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeKleineDateState(run.state)}
        />
      </main>
    );
  }

  if (game.status === "native" && isSamenLevenGameId(game.id) && run) {
    const definition = samenLevenDefinitions[game.id];
    const SamenLevenComponent = definition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game={game.id}
      >
        {pair.developerMode && (
          <button
            className={styles.restartGameButton}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <SamenLevenComponent
          christianLayer={pair.christianLayer}
          dispatch={dispatchSamenLevenAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeSamenLevenState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === stilteruisjeDefinition.id &&
    run
  ) {
    const StilteruisjeComponent = stilteruisjeDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="stilteruisje"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <StilteruisjeComponent
          dispatch={dispatchStilteruisjeAction}
          installationId={session?.installationId ?? ""}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeStilteruisjeState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === vrolijkeOpenPlekDefinition.id &&
    run
  ) {
    const VrolijkeOpenPlekComponent = vrolijkeOpenPlekDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="vrolijke-open-plek"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <VrolijkeOpenPlekComponent
          dispatch={dispatchVrolijkeOpenPlekAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeVrolijkeOpenPlekState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === oudeEikDefinition.id &&
    run
  ) {
    if (relationshipResults.isFetching) return <LoadingScreen />;
    const OudeEikComponent = oudeEikDefinition.Component;
    const familyResult =
      relationshipResults.data?.find(
        ({ provenance }) => provenance.gameId === "familiedorp",
      )?.result ?? null;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="oude-eik"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <OudeEikComponent
          dispatch={dispatchOudeEikAction}
          installationId={session?.installationId ?? ""}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          priorFamilyData={familyResult}
          state={normalizeOudeEikState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === spiegelvijverDefinition.id &&
    run
  ) {
    const SpiegelvijverComponent = spiegelvijverDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="spiegelvijver"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <SpiegelvijverComponent
          dispatch={dispatchSpiegelvijverAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeSpiegelvijverState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === grenzenTempoDefinition.id &&
    run
  ) {
    const GrenzenTempoComponent = grenzenTempoDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="grenzen-tempo"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <GrenzenTempoComponent
          dispatch={dispatchGrenzenTempoAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeGrenzenTempoState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === kruispuntReactiesDefinition.id &&
    run
  ) {
    const KruispuntReactiesComponent = kruispuntReactiesDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="kruispunt-reacties"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <KruispuntReactiesComponent
          dispatch={dispatchKruispuntReactiesAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          state={normalizeKruispuntReactiesState(run.state)}
        />
      </main>
    );
  }

  if (
    game.status === "native" &&
    game.id === huishoudtafelDefinition.id &&
    run
  ) {
    const HuishoudtafelComponent = huishoudtafelDefinition.Component;
    return (
      <main
        className={styles.gameFramePage}
        data-game-revision={run.revision}
        data-game-run-id={run.id}
        data-native-game="huishoudtafel"
      >
        {pair.developerMode && (
          <button
            className={styles.developerRestartGame}
            disabled={restartRun.isPending}
            onClick={() => restartRun.mutate()}
            type="button"
          >
            Opnieuw starten
          </button>
        )}
        <HuishoudtafelComponent
          dispatch={dispatchHuishoudtafelAction}
          installationId={session?.installationId ?? ""}
          key={run.id}
          memberIds={pair.members.map((member) => member.installationId)}
          openCall={() => setDrawer("call")}
          openChat={(text = "") => {
            setChatContext(text, false);
            setDrawer("chat");
          }}
          pauseGame={() => navigate(worldPath)}
          partnerName={partner?.displayName ?? "je partner"}
          christianLayer={pair.christianLayer}
          pending={nativePending}
          restartGame={() => restartRun.mutate()}
          state={normalizeHuishoudtafelState(run.state)}
        />
      </main>
    );
  }

  if (!game.legacyPath) return <Navigate replace to="/" />;

  return (
    <main className={styles.gameFramePage}>
      <iframe
        className={styles.gameFrame}
        data-game-revision={run?.revision}
        data-game-run-id={run?.id}
        onLoad={() => {
          if (!run) return;
          frameRef.current?.contentWindow?.postMessage(
            {
              type: "slow-dating:legacy-event",
              payload: {
                legacyEvent: "state_restored",
                data: run.state,
                revision: run.revision,
              },
            },
            window.location.origin,
          );
        }}
        ref={frameRef}
        src={`/legacy/${game.legacyPath}?embedded=1&role=${
          session?.installationId === run?.installationId
            ? "creator"
            : "partner"
        }&code=${pair.developerMode ? "1111" : pair.code}`}
        title={game.title}
      />
    </main>
  );
}
