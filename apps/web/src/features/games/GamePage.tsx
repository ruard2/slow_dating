import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import type { Pair } from "@slow-dating/contracts";
import { findGame } from "@slow-dating/content";

import styles from "../../App.module.css";
import { LoadingScreen } from "../../app/LoadingScreen";
import { PartnerArrived, WaitingRoom } from "../../components/WaitingRoom";
import { api } from "../../lib/api";
import { useRealtime } from "../../providers/RealtimeProvider";
import { useSession } from "../../providers/SessionProvider";
import { useAppStore } from "../../store/appStore";

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
  const [arrivalComplete, setArrivalComplete] = useState(false);
  const { lastEvent, send } = useRealtime();
  const setDrawer = useAppStore((state) => state.setDrawer);
  const game = findGame(gameId);
  const activeRun = useQuery({
    queryKey: ["active-game-run", pair?.id, gameId],
    queryFn: () => api.getActiveGameRun(gameId),
    enabled: Boolean(game && pair?.members.length === 2),
    refetchInterval: 1_500,
  });
  const enterRun = useMutation({
    mutationFn: () => api.createGameRun(gameId, game?.version ?? 1),
    onSuccess: (run) => {
      queryClient.setQueryData(["active-game-run", pair?.id, gameId], run);
      send("game.lobby.enter", { gameId, gameRunId: run.id });
    },
  });
  const run = activeRun.data ?? enterRun.data;
  const readyInstallationIds = Array.isArray(run?.state.readyInstallationIds)
    ? run.state.readyInstallationIds.filter(
        (value): value is string => typeof value === "string",
      )
    : [];
  const started = Boolean(
    (pair?.developerMode && developerPartnerPresent) ||
      (pair &&
        !pair.developerMode &&
        readyInstallationIds.filter((id) =>
          pair.members.some((member) => member.installationId === id),
        ).length >= 2),
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
    void api.startWaitingSession(run.id);
  }, [run, started]);

  useEffect(() => {
    if (!started || !run || !hasWaited || arrivalComplete) return;
    void api.endWaitingSession(run.id);
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
    if (lastEvent?.type !== "game.sync") return;
    const payload = lastEvent.payload as {
      gameRunId?: string;
      state?: unknown;
    };
    frameRef.current?.contentWindow?.postMessage(
      { type: "slow-dating:legacy-event", payload: payload.state },
      window.location.origin,
    );
  }, [gameId, lastEvent, pair?.id, queryClient]);

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
        void api.recordActivity({
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
        });
      }
      if (legacyEvent === "open_chat") {
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
      if (
        legacyEvent === "session_complete" &&
        run &&
        completedRunRef.current !== run.id
      ) {
        completedRunRef.current = run.id;
        void api
          .completeGameRun(run.id, event.data.data ?? {})
          .then(() =>
            queryClient.invalidateQueries({ queryKey: ["progress"] }),
          )
          .catch(() => {
            completedRunRef.current = null;
          });
      }
      if (run) {
        send("game.sync", {
          gameRunId: run.id,
          state: {
            legacyEvent,
            data: event.data.data ?? {},
          },
        });
      }
    }

    window.addEventListener("message", receiveLegacyMessage);
    return () => window.removeEventListener("message", receiveLegacyMessage);
  }, [queryClient, run, send, setDrawer]);

  if (!game) return <Navigate replace to="/" />;

  if (!pair || pair.members.length !== 2) {
    return (
      <main className={styles.gameWelcome}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
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

  return (
    <main className={styles.gameFramePage}>
      <iframe
        className={styles.gameFrame}
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
