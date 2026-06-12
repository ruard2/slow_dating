import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type { ValueId, WaardenAction, WaardenState } from "./contracts";
import { selectionHotspots, values } from "./content";
import {
  allPlayersSubmitted,
  questionsFor,
  selectionFor,
} from "./selectors";
import styles from "./WaardenGame.module.css";

const ownSlots = [
  { left: 20.1, top: 27.2, width: 16.8, height: 6.1 },
  { left: 41.4, top: 27.5, width: 17.9, height: 5.5 },
  { left: 62.6, top: 27.5, width: 18.4, height: 5.5 },
];
const partnerSlots = [
  { left: 20.1, top: 40.1, width: 16.5, height: 5.0 },
  { left: 41.4, top: 40.0, width: 17.6, height: 5.1 },
  { left: 63.1, top: 40.0, width: 17.9, height: 5.6 },
];

function valueById(id: ValueId | undefined) {
  return values.find((value) => value.id === id);
}

function percentagePosition(position: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return {
    left: `${position.left}%`,
    top: `${position.top}%`,
    width: `${position.width}%`,
    height: `${position.height}%`,
  };
}

function RevealSlot({
  id,
  position,
}: {
  id: ValueId | undefined;
  position: { left: number; top: number; width: number; height: number };
}) {
  const value = valueById(id);
  return (
    <div className={styles.revealSlot} style={percentagePosition(position)}>
      {value && (
        <>
          <span>{value.emoji}</span>
          <strong>{value.name}</strong>
        </>
      )}
    </div>
  );
}

function QuestionZone({
  className,
  questions,
}: {
  className: string;
  questions: string[];
}) {
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, Math.max(questions.length - 1, 0));
  return (
    <div className={`${styles.questionZone} ${className}`}>
      <button
        aria-label="Vorige gespreksvraag"
        className={`${styles.questionButton} ${styles.previous}`}
        disabled={safeIndex === 0}
        onClick={() => setIndex((current) => Math.max(0, current - 1))}
        type="button"
      >
        ‹
      </button>
      <span>{questions[safeIndex] ?? "Neem even de tijd om te vergelijken."}</span>
      <button
        aria-label="Volgende gespreksvraag"
        className={`${styles.questionButton} ${styles.next}`}
        disabled={safeIndex >= questions.length - 1}
        onClick={() =>
          setIndex((current) => Math.min(questions.length - 1, current + 1))
        }
        type="button"
      >
        ›
      </button>
      <span className={styles.dots}>
        {questions.map((question, dotIndex) => (
          <i
            data-active={dotIndex === safeIndex}
            key={question}
          />
        ))}
      </span>
    </div>
  );
}

export function WaardenGame({
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<WaardenState, WaardenAction>) {
  const ownSelection = selectionFor(state, installationId);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const partnerSelection = selectionFor(state, partnerId);
  const ownSubmitted = state.submittedInstallationIds.includes(installationId);
  const reveal = allPlayersSubmitted(state, memberIds);

  if (reveal) {
    const questions = questionsFor(ownSelection, partnerSelection);
    return (
      <section aria-label="Onthulling van jullie waarden" className={styles.game}>
        <div className={styles.frame}>
          <img
            alt=""
            className={styles.background}
            src="/assets/onthulling.webp"
          />
          {ownSlots.map((position, index) => (
            <RevealSlot
              id={ownSelection[index]}
              key={`own-${position.left}`}
              position={position}
            />
          ))}
          {partnerSlots.map((position, index) => (
            <RevealSlot
              id={partnerSelection[index]}
              key={`partner-${position.left}`}
              position={position}
            />
          ))}
          <QuestionZone
            className={styles.questionOne!}
            questions={questions.own}
          />
          <QuestionZone
            className={styles.questionTwo!}
            questions={questions.partner}
          />
          <button
            className={styles.finish}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "waarden.game.completed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Ontdekking afronden
          </button>
        </div>
      </section>
    );
  }

  if (ownSubmitted) {
    return (
      <section className={styles.waiting}>
        <span>Jouw keuze is veilig opgeslagen</span>
        <h1>Wachten op {partnerName}</h1>
        <p>
          Zodra jullie allebei drie waarden hebben gekozen, verschijnt de
          onthulling automatisch.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Kies jouw drie waarden" className={styles.game}>
      <div className={styles.frame}>
        <img alt="" className={styles.background} src="/assets/waarden.webp" />
        <div className={`${styles.slot} ${styles.slotOne}`}>
          {valueById(ownSelection[0])?.emoji}
        </div>
        <div className={`${styles.slot} ${styles.slotTwo}`}>
          {valueById(ownSelection[1])?.emoji}
        </div>
        <div className={`${styles.slot} ${styles.slotThree}`}>
          {valueById(ownSelection[2])?.emoji}
        </div>
        {values.map((value, index) => {
          const hotspot = selectionHotspots[index]!;
          return (
            <button
              aria-label={`${value.name} ${
                ownSelection.includes(value.id) ? "gekozen" : "kiezen"
              }`}
              className={styles.choice}
              data-selected={ownSelection.includes(value.id)}
              disabled={pending}
              key={value.id}
              onClick={() =>
                dispatch({
                  type: "waarden.value.toggled",
                  actorId: installationId,
                  valueId: value.id,
                })
              }
              style={percentagePosition(hotspot)}
              type="button"
            />
          );
        })}
        <button
          aria-label="Dit zijn mijn drie waarden"
          className={styles.submit}
          disabled={pending || ownSelection.length !== 3}
          onClick={() =>
            dispatch({
              type: "waarden.selection.submitted",
              actorId: installationId,
            })
          }
          type="button"
        >
          Dit zijn mijn drie waarden
        </button>
        {pending && <span className={styles.status}>Keuze opslaan...</span>}
        {ownSelection.length !== 3 && (
          <span className={styles.submitHint}>
            Kies nog {3 - ownSelection.length}
          </span>
        )}
      </div>
    </section>
  );
}
