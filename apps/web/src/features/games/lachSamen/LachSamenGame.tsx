import { useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type { LachSamenAction, LachSamenState } from "./contracts";
import { CAT_LABELS, pickQuestions } from "./content";
import styles from "./LachSamenGame.module.css";

export function LachSamenGame({
  state,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
}: GameComponentProps<LachSamenState, LachSamenAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";

  // Questions derived from seed — same for both players
  const questions = useMemo(
    () => pickQuestions(state.questionSeed),
    [state.questionSeed],
  );

  // Local view index: which question this player is currently looking at
  const [viewIdx, setViewIdx] = useState(() => {
    const myAnswers = state.answersByPlayer[installationId] ?? [];
    return Math.min(myAnswers.length, 14);
  });

  const isGameDone = viewIdx >= 15;

  const q = questions[viewIdx];
  const myAnswers = state.answersByPlayer[installationId] ?? [];
  const partnerAnswers = state.answersByPlayer[partnerId] ?? [];

  const myChoice = myAnswers[viewIdx] as "a" | "b" | undefined;
  const partnerChoice = partnerAnswers[viewIdx] as "a" | "b" | undefined;
  const bothAnswered = myChoice !== undefined && partnerChoice !== undefined;
  const waitingForPartner = myChoice !== undefined && partnerChoice === undefined;

  function choose(choice: "a" | "b") {
    if (myChoice !== undefined) return;
    void dispatch({
      type: "lach-samen.answer.submitted",
      actorId: installationId,
      qIdx: viewIdx,
      choice,
    });
  }

  function next() {
    if (viewIdx >= 14) {
      setViewIdx(15);
    } else {
      setViewIdx((i) => i + 1);
    }
  }

  function finish() {
    void dispatch({
      type: "lach-samen.game.completed",
      actorId: installationId,
    });
  }

  const progress = Math.min(viewIdx + 1, 15);
  const progressPct = (progress / 15) * 100;

  // ── Done screen ───────────────────────────────────────────
  if (isGameDone) {
    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />
        <div className={styles.doneWrap}>
          <div className={styles.doneIcon}>🎉</div>
          <div className={styles.doneTitle}>Alle 15 gedaan!</div>
          <div className={styles.doneSub}>
            Jullie hebben samen gelachen.
            <br />
            Volgende keer kiest de app andere vragen.
          </div>
          <button
            className={styles.btnMap}
            disabled={pending}
            onClick={finish}
          >
            Afronden →
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const myLabel = myChoice ? (myChoice === "a" ? q.a : q.b) : null;
  const partnerLabel = partnerChoice
    ? partnerChoice === "a"
      ? q.a
      : q.b
    : null;
  const isMatch = bothAnswered && myChoice === partnerChoice;
  const isLast = viewIdx >= 14;

  return (
    <div className={styles.root}>
      <div className={styles.bgLayer} />

      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>😄 Lach Samen</div>
        <div className={styles.progressText}>
          {progress} / 15
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question area */}
      <div className={styles.questionArea}>
        <span className={`${styles.catBadge} ${styles[`badge_${q.cat}`]}`}>
          {CAT_LABELS[q.cat]}
        </span>
        <div className={styles.questionText}>{q.v}</div>

        {/* Choice buttons */}
        <div className={styles.choiceGrid}>
          {(["a", "b"] as const).map((opt) => {
            const label = opt === "a" ? q.a : q.b;
            const isMyChoice = myChoice === opt;
            const isPartnerChoice = partnerChoice === opt;
            const isBoth = isMyChoice && isPartnerChoice;
            return (
              <button
                key={opt}
                className={[
                  styles.choiceBtn,
                  isMyChoice && !isBoth ? styles.chosenMe : "",
                  isPartnerChoice && !isBoth ? styles.chosenThem : "",
                  isBoth ? styles.chosenBoth : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={myChoice !== undefined}
                onClick={() => choose(opt)}
              >
                <span className={styles.choiceLabel}>
                  {opt.toUpperCase()}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Waiting dots */}
        {waitingForPartner && (
          <div className={styles.waitingDots}>
            <span />
            <span />
            <span />
            <span className={styles.waitingText}>
              Wacht op {partnerName}…
            </span>
          </div>
        )}

        {/* Reveal strip */}
        {bothAnswered && (
          <div className={styles.revealStrip}>
            <div className={styles.revealRow}>
              <div className={`${styles.revealPill} ${styles.revealMe}`}>
                <span className={styles.pillWho}>Jij</span>
                <span>{myLabel}</span>
              </div>
              <div className={`${styles.revealPill} ${styles.revealThem}`}>
                <span className={styles.pillWho}>{partnerName}</span>
                <span>{partnerLabel}</span>
              </div>
            </div>
            <div
              className={`${styles.matchMsg} ${isMatch ? styles.matchSame : ""}`}
            >
              {isMatch
                ? "🎉 Jullie kozen hetzelfde!"
                : "Jullie kozen anders — vertel waarom!"}
            </div>
            <button className={styles.nextBtn} onClick={next}>
              {isLast ? "Klaar! →" : "Volgende vraag →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
