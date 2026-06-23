import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  KruispuntReactiesAction,
  KruispuntReactiesState,
} from "./contracts";
import { cardById, categoryLabels, christianPrompts } from "./content";
import { FaithLayer } from "../FaithLayer";
import { activeReactionCardId, bothAnswered } from "./reducer";
import styles from "./KruispuntReactiesGame.module.css";

const answerTimeMs = 15_000;
const revealTimeMs = 2_600;

function nowIso() {
  return new Date().toISOString();
}

function choiceText(cardId: string, optionIndex: number | null | undefined) {
  if (optionIndex === null || optionIndex === undefined) return "Te laat gekozen";
  return cardById(cardId)?.options[optionIndex] ?? "Onbekende keuze";
}

export function KruispuntReactiesGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<KruispuntReactiesState, KruispuntReactiesAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const activeCardId = activeReactionCardId(state);
  const activeCard = activeCardId ? cardById(activeCardId) : undefined;
  const ownAnswer = activeCardId
    ? state.answers[activeCardId]?.[installationId]
    : undefined;
  const partnerAnswer = activeCardId
    ? state.answers[activeCardId]?.[partnerId]
    : undefined;
  const allAnswered = bothAnswered(state, memberIds);
  const roundComplete =
    state.roundCardIds.length > 0 &&
    state.currentCardIndex >= state.roundCardIds.length;
  const [remainingMs, setRemainingMs] = useState(answerTimeMs);
  const [revisitCardId, setRevisitCardId] = useState("");
  const timeoutSentRef = useRef("");
  const advanceSentRef = useRef("");
  const sceneRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (sceneRef.current) sceneRef.current.scrollTop = 0;
  }, [activeCardId, roundComplete, state.finished]);

  useEffect(() => {
    if (!activeCardId || !state.cardStartedAt || ownAnswer || allAnswered) return;
    const cardId = activeCardId;
    const deadline = Date.parse(state.cardStartedAt) + answerTimeMs;
    function tick() {
      const next = Math.max(0, deadline - Date.now());
      setRemainingMs(next);
      if (next > 0 || timeoutSentRef.current === cardId) return;
      timeoutSentRef.current = cardId;
      void dispatch({
        type: "kruispunt-reacties.answered",
        actorId: installationId,
        cardId,
        optionIndex: null,
        answeredAt: nowIso(),
      });
    }
    tick();
    const timer = window.setInterval(tick, 50);
    return () => window.clearInterval(timer);
  }, [
    activeCardId,
    allAnswered,
    dispatch,
    installationId,
    ownAnswer,
    state.cardStartedAt,
  ]);

  useEffect(() => {
    if (!activeCardId || !allAnswered) return;
    const key = `${state.roundNumber}:${activeCardId}`;
    if (advanceSentRef.current === key) return;
    const timer = window.setTimeout(() => {
      advanceSentRef.current = key;
      void dispatch({
        type: "kruispunt-reacties.card.advanced",
        actorId: installationId,
        cardId: activeCardId,
        startedAt: nowIso(),
      });
    }, revealTimeMs);
    return () => window.clearTimeout(timer);
  }, [
    activeCardId,
    allAnswered,
    dispatch,
    installationId,
    state.roundNumber,
  ]);

  const roundStats = useMemo(() => {
    const cards = state.roundCardIds
      .map((id) => cardById(id))
      .filter((card) => card !== undefined);
    let matches = 0;
    let ownTimeouts = 0;
    let partnerTimeouts = 0;
    const categoryDifferences = new Map<string, number>();
    for (const card of cards) {
      const own = state.answers[card.id]?.[installationId]?.optionIndex;
      const partner = state.answers[card.id]?.[partnerId]?.optionIndex;
      if (own === null) ownTimeouts += 1;
      if (partner === null) partnerTimeouts += 1;
      if (own !== null && own !== undefined && own === partner) matches += 1;
      if (
        own !== null &&
        own !== undefined &&
        partner !== null &&
        partner !== undefined &&
        own !== partner
      ) {
        categoryDifferences.set(
          card.category,
          (categoryDifferences.get(card.category) ?? 0) + 1,
        );
      }
    }
    const strongestDifference = [...categoryDifferences.entries()].sort(
      (left, right) => right[1] - left[1],
    )[0]?.[0];
    return { cards, matches, ownTimeouts, partnerTimeouts, strongestDifference };
  }, [
    installationId,
    partnerId,
    state.answers,
    state.roundCardIds,
  ]);

  if (state.finished) {
    const ownRevisit = cardById(state.revisitCardIds[installationId] ?? "");
    const partnerRevisit = cardById(state.revisitCardIds[partnerId] ?? "");
    return (
      <section className={styles.game} ref={sceneRef}>
        <div className={styles.crossroads} aria-hidden><i /><i /><i /></div>
        <div className={styles.panel}>
          <span className={styles.kicker}>Kruispunt van reacties</span>
          <h1>Jullie kozen zonder lang nadenken</h1>
          <p className={styles.lead}>
            Juist snelle reacties laten iets zien: waar jullie vanzelf
            meelachen, anders afslaan of elkaar praktisch aanvullen.
          </p>
          <div className={styles.finalCards}>
            <article>
              <span>Jij wilt nog eens terug naar</span>
              <strong>{ownRevisit?.scenario ?? "Geen kaart gekozen"}</strong>
            </article>
            <article>
              <span>{partnerName} koos</span>
              <strong>{partnerRevisit?.scenario ?? "Geen kaart gekozen"}</strong>
            </article>
          </div>
          {christianLayer && (
            <FaithLayer
              intro="Onze eerste reacties zeggen iets over ons hart."
              prompts={[...christianPrompts]}
            />
          )}
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "kruispunt-reacties.game.completed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Terug naar kaart 2
          </button>
        </div>
      </section>
    );
  }

  if (state.roundCardIds.length === 0) {
    return (
      <section className={styles.game} ref={sceneRef}>
        <div className={styles.crossroads} aria-hidden><i /><i /><i /></div>
        <div className={styles.panel}>
          <span className={styles.kicker}>Kruispunt van reacties</span>
          <h1>Welke afslag neem jij?</h1>
          <p className={styles.lead}>
            Tien onverwachte situaties. Vier mogelijke reacties. Jullie krijgen
            allebei precies vijftien seconden en zien elkaars keuze pas daarna.
            Niet overdenken: kies wat het eerst bij je opkomt.
          </p>
          <div className={styles.rules}>
            <article><b>10</b><span>scenario's per ronde</span></article>
            <article><b>15</b><span>seconden om te kiezen</span></article>
            <article><b>50</b><span>kaarten zonder herhaling</span></article>
          </div>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "kruispunt-reacties.ready",
                actorId: installationId,
                startedAt: nowIso(),
              })
            }
            type="button"
          >
            Start de eerste ronde
          </button>
        </div>
      </section>
    );
  }

  if (roundComplete) {
    const ownVote = state.repeatVotes[installationId];
    const differenceLabel = roundStats.strongestDifference
      ? categoryLabels[
          roundStats.strongestDifference as keyof typeof categoryLabels
        ]
      : null;
    return (
      <section className={styles.game} ref={sceneRef}>
        <div className={styles.crossroads} aria-hidden><i /><i /><i /></div>
        <div className={styles.panel}>
          <span className={styles.kicker}>
            Ronde {state.roundNumber} · Tien afslagen verder
          </span>
          <h1>Wat viel op?</h1>
          <div className={styles.summaryGrid}>
            <article>
              <b>{roundStats.matches}</b>
              <span>keer dezelfde afslag</span>
            </article>
            <article>
              <b>{roundStats.ownTimeouts}</b>
              <span>keer was jij te laat</span>
            </article>
            <article>
              <b>{roundStats.partnerTimeouts}</b>
              <span>keer was {partnerName} te laat</span>
            </article>
          </div>
          <p className={styles.observation}>
            {roundStats.ownTimeouts + roundStats.partnerTimeouts >= 5
              ? "Een paar afslagen gingen sneller dan jullie vingers. Ook dat zegt iets: sommige situaties vragen blijkbaar toch een halve tel extra."
              : differenceLabel
              ? `Jullie verschilden deze ronde het vaakst bij ${differenceLabel.toLowerCase()}. Dat is geen probleem; wel een leuke plek om nieuwsgierig te blijven.`
              : "Jullie kozen opvallend vaak hetzelfde. Kijk vooral ook waar dezelfde keuze misschien uit een andere reden kwam."}
          </p>
          <div className={styles.revisit}>
            <h2>Welke kaart wil jij later nog eens terugzien?</h2>
            <div>
              {roundStats.cards.map((card) => (
                <button
                  data-selected={revisitCardId === card.id}
                  key={card.id}
                  onClick={() => setRevisitCardId(card.id)}
                  type="button"
                >
                  {card.scenario}
                </button>
              ))}
            </div>
          </div>
          {!ownVote ? (
            <>
              <h2 className={styles.choiceTitle}>Nog een kruispunt?</h2>
              <div className={styles.roundActions}>
                <button
                  disabled={pending || !revisitCardId}
                  onClick={() =>
                    dispatch({
                      type: "kruispunt-reacties.round.voted",
                      actorId: installationId,
                      vote: "again",
                      revisitCardId,
                      startedAt: nowIso(),
                    })
                  }
                  type="button"
                >
                  Nog 10 kaarten
                </button>
                <button
                  disabled={pending || !revisitCardId}
                  onClick={() =>
                    dispatch({
                      type: "kruispunt-reacties.round.voted",
                      actorId: installationId,
                      vote: "finish",
                      revisitCardId,
                      startedAt: nowIso(),
                    })
                  }
                  type="button"
                >
                  Mooi geweest
                </button>
              </div>
            </>
          ) : (
            <div className={styles.waiting}>
              Jouw keuze staat. {partnerName} kiest nog...
            </div>
          )}
        </div>
      </section>
    );
  }

  if (!activeCard || !activeCardId) return null;

  const progress =
    ((state.currentCardIndex + (allAnswered ? 1 : 0)) /
      state.roundCardIds.length) *
    100;
  const seconds = Math.max(0, remainingMs / 1_000);
  const ownChoice = choiceText(activeCardId, ownAnswer?.optionIndex);
  const partnerChoice = choiceText(activeCardId, partnerAnswer?.optionIndex);

  return (
    <section className={styles.game} ref={sceneRef}>
      <div className={styles.crossroads} aria-hidden><i /><i /><i /></div>
      <div
        className={styles.panel}
        data-card-id={activeCardId}
        data-card-started-at={state.cardStartedAt ?? ""}
        data-reveal={allAnswered}
      >
        <div className={styles.topline}>
          <span>Ronde {state.roundNumber}</span>
          <strong>{state.currentCardIndex + 1} / 10</strong>
        </div>
        <div className={styles.progress}>
          <i style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.category}>
          {categoryLabels[activeCard.category]}
        </span>
        <h1 className={styles.scenario}>{activeCard.scenario}</h1>

        {!allAnswered ? (
          <>
            <div className={styles.timer} data-done={Boolean(ownAnswer)}>
              <b>{ownAnswer ? "✓" : seconds.toFixed(1)}</b>
              <span>{ownAnswer ? "Keuze vastgelegd" : "seconden"}</span>
              <i
                style={
                  {
                    "--timer": `${remainingMs / answerTimeMs}`,
                  } as CSSProperties
                }
              />
            </div>
            <div className={styles.options}>
              {activeCard.options.map((option, optionIndex) => (
                <button
                  disabled={Boolean(ownAnswer) || pending || remainingMs <= 0}
                  key={option}
                  onClick={() =>
                    dispatch({
                      type: "kruispunt-reacties.answered",
                      actorId: installationId,
                      cardId: activeCardId,
                      optionIndex,
                      answeredAt: nowIso(),
                    })
                  }
                  type="button"
                >
                  <b>{String.fromCharCode(65 + optionIndex)}</b>
                  <span>{option}</span>
                </button>
              ))}
            </div>
            {ownAnswer && !partnerAnswer && (
              <div className={styles.waiting}>
                Keuze dicht. {partnerName} heeft nog een ogenblik.
              </div>
            )}
          </>
        ) : (
          <div className={styles.reveal}>
            <div className={styles.signpost}>
              <article>
                <span>Jij</span>
                <strong>{ownChoice}</strong>
              </article>
              <i />
              <article>
                <span>{partnerName}</span>
                <strong>{partnerChoice}</strong>
              </article>
            </div>
            <p>
              {ownAnswer?.optionIndex === partnerAnswer?.optionIndex &&
              ownAnswer?.optionIndex !== null
                ? "Dezelfde afslag. Of jullie daar om dezelfde reden staan, blijft natuurlijk de vraag."
                : activeCard.insight}
            </p>
            <small>Volgende kaart komt eraan...</small>
          </div>
        )}
      </div>
    </section>
  );
}
