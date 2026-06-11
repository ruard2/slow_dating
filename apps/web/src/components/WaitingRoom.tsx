import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { waitingGames } from "@slow-dating/content";

import styles from "../App.module.css";
import { api } from "../lib/api";

function selectGame(recentIds: string[], offset: number) {
  const available = waitingGames.filter((game) => !recentIds.includes(game.id));
  const pool = available.length ? available : waitingGames;
  return (pool[offset % pool.length] ?? waitingGames[0])!;
}

export function WaitingRoom({
  gameRunId,
  partnerName,
}: {
  gameRunId: string;
  partnerName: string;
}) {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(() => Math.floor(Math.random() * waitingGames.length));
  const [answer, setAnswer] = useState<string | null>(null);
  const [quiet, setQuiet] = useState(false);
  const stats = useQuery({
    queryKey: ["waiting-stats"],
    queryFn: api.getWaitingStats,
  });
  const game = useMemo(
    () => selectGame(stats.data?.recentGameIds ?? [], offset),
    [offset, stats.data?.recentGameIds],
  );
  const save = useMutation({
    mutationFn: (option: { id: string; label: string }) =>
      api.saveWaitingAnswer({
        gameRunId,
        waitingGameId: game.id,
        answerId: option.id,
        answerLabel: option.label,
        shareLevel: game.shareLevel,
      }),
    onSuccess: (_value, option) => {
      setAnswer(option.id);
      void queryClient.invalidateQueries({ queryKey: ["waiting-stats"] });
    },
  });

  const minutes = Math.floor((stats.data?.totalWaitSeconds ?? 0) / 60);
  const selected = game.options.find((option) => option.id === answer);
  const correct = answer && game.correctOptionId
    ? answer === game.correctOptionId
    : null;

  return (
    <main className={styles.waitingRoom}>
      <img className={styles.waitingBackground} src="/assets/waiting.webp" alt="" />
      <header className={styles.waitingHeader}>
        <span>Wachten op je reisgenoot...</span>
        <small>Doe alvast iets kleins.</small>
      </header>

      <section className={styles.waitingCard} aria-label="Wachtspelletje">
        {quiet ? (
          <>
            <span className={styles.waitingKicker}>Rustig wachten</span>
            <h1>Neem even de tijd</h1>
            <p>Het kampvuur brandt. {partnerName} is onderweg.</p>
          </>
        ) : (
          <>
            <span className={styles.waitingKicker}>{game.title}</span>
            <h1>{game.question}</h1>
            <div className={styles.waitingOptions}>
              {game.options.map((option) => (
                <button
                  data-selected={answer === option.id}
                  disabled={save.isPending || Boolean(answer)}
                  key={option.id}
                  onClick={() => save.mutate(option)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            {selected && (
              <p className={styles.waitingFeedback}>
                {correct === null
                  ? `Gekozen: ${selected.label}`
                  : correct
                    ? "Goed gevonden."
                    : `Bijna. Het antwoord is ${
                        game.options.find((option) => option.id === game.correctOptionId)?.label
                      }.`}
              </p>
            )}
          </>
        )}
      </section>

      <footer className={styles.waitingFooter}>
        <div>
          <strong>{stats.data?.totalWaitCount ?? 1}x gewacht</strong>
          <span>{minutes} kampvuurminuten</span>
        </div>
        <div className={styles.waitingActions}>
          <button
            disabled={!answer && !quiet}
            onClick={() => {
              setAnswer(null);
              setQuiet(false);
              setOffset((value) => value + 1);
            }}
            type="button"
          >
            Nog eentje
          </button>
          <button onClick={() => setQuiet(true)} type="button">Rustig wachten</button>
        </div>
        <div>
          <strong>{partnerName}</strong>
          <span>is onderweg...</span>
        </div>
      </footer>
    </main>
  );
}

export function PartnerArrived({ partnerName }: { partnerName: string }) {
  return (
    <main className={styles.waitingRoom}>
      <img className={styles.waitingBackground} src="/assets/waiting.webp" alt="" />
      <section className={styles.partnerArrived}>
        <span>Daar is je reisgenoot</span>
        <h1>{partnerName} is er!</h1>
        <p>Jullie kunnen beginnen.</p>
      </section>
    </main>
  );
}
