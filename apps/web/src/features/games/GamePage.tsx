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
    mutationFn: () => api.createGameRun(gameId, game?.version ?? 1),
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
          <span>Ontdekking</span>
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
          partnerName={partner?.displayName ?? "je partner"}
          pending={nativePending}
          priorAllergyOptions={priorAllergyOptions}
          priorQualityOptions={priorQualityOptions}
          state={normalizeKernkwadrantenState(run.state)}
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
          pending={nativePending}
          state={normalizeStilteruisjeState(run.state)}
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
