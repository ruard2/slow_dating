import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  HuishoudtafelAction,
  HuishoudtafelState,
} from "./contracts";
import {
  categories,
  discussionQuestions,
  houseTasks,
  labelFor,
  emojiForTask,
} from "./content";
import styles from "./HuishoudtafelGame.module.css";

function Waiting({ partnerName }: { partnerName: string }) {
  return (
    <div className={styles.waiting}>
      <div className={styles.ripple} />
      <h2>Jouw taakverdeling staat klaar</h2>
      <p>We vergelijken pas wanneer {partnerName} ook klaar is.</p>
    </div>
  );
}

export function HuishoudtafelGame({
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  state,
}: GameComponentProps<HuishoudtafelState, HuishoudtafelAction>) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const ownDist = state.distributions[installationId] ?? {};
  const partnerDist = state.distributions[partnerId];
  const allDistributed = memberIds.every((id) =>
    Object.keys(state.distributions[id] ?? {}).length >= houseTasks.length * 0.6
  );
  const allDone = memberIds.every((id) =>
    Object.keys(state.distributions[id] ?? {}).length >= houseTasks.length
  );
  const ownSubmitted = allDone;
  const partnerSubmitted = partnerDist && Object.keys(partnerDist).length >= houseTasks.length;
  const ownDiscussionDone = state.discussionDoneIds.includes(installationId);
  const allDiscussionDone = memberIds.every((id) =>
    state.discussionDoneIds.includes(id),
  );

  const taskCountByCategory = (dist: Record<string, string>, cat: string) =>
    Object.values(dist).filter((v) => v === cat).length;

  // Phase 1: categoriseer taken
  if (!ownSubmitted) {
    const categorizedCount = Object.keys(ownDist).length;
    const totalTasks = houseTasks.length;
    const canSubmit = categorizedCount >= totalTasks;

    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>De Huishoudtafel</span>
          <h1>Wie doet wat?</h1>
          <p className={styles.lead}>
            Verdeel de taakkaartjes in drie vakken: wat je graag doet, wat je
            energie kost, en wat je snel vergeet of liever niet doet.
            Eerlijk zijn helpt — niet sociaal wenselijk.
          </p>

          {categorizedCount < totalTasks && (
            <p style={{ color: "#afbdaf", fontSize: ".82rem", marginBottom: ".6rem" }}>
              Nog {totalTasks - categorizedCount} taak{categorizedCount < totalTasks - 1 ? "en" : ""} te verdelen
            </p>
          )}

          <div className={styles.taskGrid}>
            {houseTasks.map((task) => {
              const cat = ownDist[task.id];
              return (
                <div className={styles.taskCard} key={task.id}>
                  <span className={styles.taskEmoji}>{task.emoji}</span>
                  <span className={styles.taskLabel}>{task.label}</span>
                  <span className={styles.taskDetail}>{task.detail}</span>
                  <div className={styles.catSelect}>
                    {categories.map((c) => (
                      <button
                        className={styles.catBtn}
                        data-active={cat === c.id}
                        data-cat={c.id}
                        key={c.id}
                        onClick={() =>
                          dispatch({
                            type: "huishoudtafel.task.categorized",
                            actorId: installationId,
                            taskId: task.id,
                            category: c.id,
                          })
                        }
                        type="button"
                      >
                        {c.emoji} {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={styles.submitBtn}
            disabled={pending || !canSubmit}
            onClick={() =>
              dispatch({
                type: "huishoudtafel.distribution.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            {canSubmit
              ? "Mijn verdeling is klaar"
              : `Nog ${totalTasks - categorizedCount} taken verdelen`}
          </button>
        </div>
      </section>
    );
  }

  // Wacht op partner
  if (!partnerSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}><Waiting partnerName={partnerName} /></div>
      </section>
    );
  }

  // Phase 2: vergelijking
  if (!ownDiscussionDone && partnerDist) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Twee manieren van kijken</span>
          <h1>Waar zitten de verschillen?</h1>
          <p className={styles.lead}>
            Jullie hebben allebei taken verdeeld. Vergelijk waar jullie
            overeenkomen en waar het schuurt — en ontdek welke verwachtingen
            onder de verdeling liggen.
          </p>

          <div className={styles.comparison}>
            <div className={styles.compareCol}>
              <h3>❤️ Jij</h3>
              <div style={{ fontSize: ".7rem", color: "#afbdaf", marginBottom: ".5rem" }}>
                {taskCountByCategory(ownDist, "enjoy")} graag &middot;
                {taskCountByCategory(ownDist, "draining")} kost energie &middot;
                {taskCountByCategory(ownDist, "avoid")} liever niet
              </div>
              {houseTasks.map((task) => {
                const cat = ownDist[task.id];
                if (!cat) return null;
                const tagClass =
                  cat === "enjoy" ? styles.tagEnjoy
                  : cat === "draining" ? styles.tagDraining
                  : styles.tagAvoid;
                const tagLabel = categories.find((c) => c.id === cat)?.emoji ?? "";
                return (
                  <div className={styles.taskRow} key={task.id}>
                    <span className={styles.emo}>{task.emoji}</span>
                    <span className={styles.name}>{task.label}</span>
                    <span className={`${styles.tag} ${tagClass}`}>{tagLabel}</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.compareCol}>
              <h3>💜 {partnerName}</h3>
              {partnerDist && (
                <div style={{ fontSize: ".7rem", color: "#afbdaf", marginBottom: ".5rem" }}>
                  {taskCountByCategory(partnerDist, "enjoy")} graag &middot;
                  {taskCountByCategory(partnerDist, "draining")} kost energie &middot;
                  {taskCountByCategory(partnerDist, "avoid")} liever niet
                </div>
              )}
              {houseTasks.map((task) => {
                const cat = partnerDist?.[task.id];
                if (!cat) return null;
                const tagClass =
                  cat === "enjoy" ? styles.tagEnjoy
                  : cat === "draining" ? styles.tagDraining
                  : styles.tagAvoid;
                const tagLabel = categories.find((c) => c.id === cat)?.emoji ?? "";
                return (
                  <div className={styles.taskRow} key={task.id}>
                    <span className={styles.emo}>{task.emoji}</span>
                    <span className={styles.name}>{task.label}</span>
                    <span className={`${styles.tag} ${tagClass}`}>{tagLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.discussion}>
            <h2>Gesprek</h2>
            <div className={styles.questionCard}>
              {discussionQuestions[questionIndex % discussionQuestions.length]}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.secondary}
                onClick={() => setQuestionIndex((i) => i + 1)}
                type="button"
              >
                Andere vraag
              </button>
              <button
                className={styles.secondary}
                onClick={() => openChat?.(discussionQuestions[questionIndex % discussionQuestions.length])}
                type="button"
              >
                Open chat
              </button>
              <button
                className={styles.secondary}
                onClick={() => openCall?.()}
                type="button"
              >
                Bel elkaar
              </button>
              <button
                className={styles.primary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "huishoudtafel.discussion.done",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Gesprek afgerond
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Wacht op partner na gesprek
  if (!allDiscussionDone) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}><Waiting partnerName={partnerName} /></div>
      </section>
    );
  }

  // Phase 3: completion
  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <div className={styles.summary}>
          <span className={styles.kicker}>Opgeslagen in jullie profiel</span>
          <h1>Jullie weten nu hoe de taken verdeeld voelen</h1>
          <p>
            Jullie voorkeuren, energiegevers en valkuilen zijn vastgelegd.
            De verdeling is niet voor altijd — maar dit is een eerlijk
            startpunt om samen verantwoordelijkheid te dragen.
          </p>
          <strong>Wat neem je mee?</strong>
          <p>
            Eerlijke taakverdeling begint niet bij wie wat doet, maar bij het
            gesprek over hoe het voelt.
          </p>
        </div>
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() =>
            dispatch({
              type: "huishoudtafel.game.completed",
              actorId: installationId,
            })
          }
          type="button"
        >
          Terug naar kaart 3
        </button>
      </div>
    </section>
  );
}