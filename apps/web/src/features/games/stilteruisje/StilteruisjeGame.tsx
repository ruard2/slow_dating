import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  StilteruisjeAction,
  StilteruisjeState,
} from "./contracts";
import {
  christianPrompts,
  conversationQuestions,
  invitations,
  labelFor,
  needs,
  noises,
  supportActions,
} from "./content";
import { FaithLayer } from "../FaithLayer";
import styles from "./StilteruisjeGame.module.css";

function Waiting({ partnerName }: { partnerName: string }) {
  return (
    <div className={styles.waiting}>
      <div className={styles.ripple} />
      <h2>Jouw mengpaneel staat klaar</h2>
      <p>We openen het pas wanneer {partnerName} ook klaar is.</p>
    </div>
  );
}

export function StilteruisjeGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  state,
}: GameComponentProps<StilteruisjeState, StilteruisjeAction>) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const draft = state.drafts[installationId] ?? {};
  const ownMix = state.mixes[installationId];
  const partnerMix = state.mixes[partnerId];
  const allMixed = memberIds.every((id) => Boolean(state.mixes[id]));
  const ownSupport = state.supportByActor[installationId];
  const allSupported = memberIds.every((id) => Boolean(state.supportByActor[id]));
  const ownRitualReady = state.ritualReadyIds.includes(installationId);
  const allRitualReady = memberIds.every((id) =>
    state.ritualReadyIds.includes(id),
  );
  const ownConversationDone =
    state.conversationDoneIds.includes(installationId);
  const allConversationDone = memberIds.every((id) =>
    state.conversationDoneIds.includes(id),
  );

  const levels = {
    safety: 3,
    time: 3,
    clarity: 3,
    gentleness: 3,
    closeness: 3,
    ...draft.needs,
  };

  if (!ownMix) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Stilteruisje</span>
          <h1>Wat heb jij nodig om open te zijn?</h1>
          <p className={styles.lead}>
            Niet iedereen opent op dezelfde manier. Stel vijf voorwaarden af
            alsof je een mengpaneel bedient. Er bestaat geen ideale stand:
            alleen de stand die nu bij jou past.
          </p>
          <div className={styles.mixer}>
            {needs.map((need) => (
              <article className={styles.channel} key={need.id}>
                <div>
                  <strong>{need.label}</strong>
                  <p>{need.description}</p>
                </div>
                <div
                  aria-label={`${need.label}: ${levels[need.id]} van 5`}
                  className={styles.scale}
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      aria-label={`${need.label} niveau ${level}`}
                      data-active={levels[need.id] >= level}
                      key={level}
                      onClick={() =>
                        dispatch({
                          type: "stilteruisje.need.changed",
                          actorId: installationId,
                          needId: need.id,
                          level,
                        })
                      }
                      type="button"
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.section}>
            <h2>Welke ruis wil je zachter zetten?</h2>
            <div className={styles.cards}>
              {noises.map((noise) => (
                <button
                  data-selected={draft.noise === noise.id}
                  key={noise.id}
                  onClick={() =>
                    dispatch({
                      type: "stilteruisje.noise.selected",
                      actorId: installationId,
                      noise: noise.id,
                    })
                  }
                  type="button"
                >
                  <strong>{noise.label}</strong>
                  <small>{noise.detail}</small>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Welke uitnodiging helpt jou beginnen?</h2>
            <div className={styles.cards}>
              {invitations.map((invitation) => (
                <button
                  data-selected={draft.invitation === invitation.id}
                  key={invitation.id}
                  onClick={() =>
                    dispatch({
                      type: "stilteruisje.invitation.selected",
                      actorId: installationId,
                      invitation: invitation.id,
                    })
                  }
                  type="button"
                >
                  <strong>{invitation.label}</strong>
                  <small>{invitation.detail}</small>
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.primary}
            disabled={pending || !draft.noise || !draft.invitation}
            onClick={() =>
              dispatch({
                type: "stilteruisje.mix.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            Zet mijn mengpaneel klaar
          </button>
        </div>
      </section>
    );
  }

  if (!allMixed) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}><Waiting partnerName={partnerName} /></div>
      </section>
    );
  }

  if (!allSupported && ownMix && partnerMix) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Twee openheidsprofielen</span>
          <h1>Luister naar het verschil</h1>
          <p className={styles.lead}>
            Een hogere stand betekent niet beter. Het laat zien waar iemand
            extra aandacht nodig heeft om vrij te kunnen spreken.
          </p>
          <div className={styles.comparison}>
            {needs.map((need) => (
              <article key={need.id}>
                <strong>{need.label}</strong>
                <div className={styles.bars}>
                  <div><span>Jij</span><i style={{ width: `${ownMix.needs[need.id] * 20}%` }} /></div>
                  <div><span>{partnerName}</span><i style={{ width: `${partnerMix.needs[need.id] * 20}%` }} /></div>
                </div>
              </article>
            ))}
          </div>
          <div className={styles.summary}>
            <p><small>Jouw ruis</small><strong>{labelFor(noises, ownMix.noise)}</strong></p>
            <p><small>{partnerName}s ruis</small><strong>{labelFor(noises, partnerMix.noise)}</strong></p>
            <p><small>Jouw uitnodiging</small><strong>{labelFor(invitations, ownMix.invitation)}</strong></p>
            <p><small>{partnerName}s uitnodiging</small><strong>{labelFor(invitations, partnerMix.invitation)}</strong></p>
          </div>
          <div className={styles.section}>
            <h2>Wat wil jij bewust voor {partnerName} doen?</h2>
            <div className={styles.cards}>
              {supportActions.map((action) => (
                <button
                  data-selected={ownSupport === action.id}
                  key={action.id}
                  onClick={() =>
                    dispatch({
                      type: "stilteruisje.support.selected",
                      actorId: installationId,
                      support: action.id,
                    })
                  }
                  type="button"
                >
                  <strong>{action.label}</strong>
                </button>
              ))}
            </div>
          </div>
          {ownSupport && <Waiting partnerName={partnerName} />}
        </div>
      </section>
    );
  }

  if (!allRitualReady) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          {!ownRitualReady ? (
            <>
              <span className={styles.kicker}>Een ander soort oefening</span>
              <h1>Laat de ruis even zakken</h1>
              <div className={styles.silence}>
                <div className={styles.rings}><i /><i /><i /></div>
                <p>
                  Leg allebei je telefoon neer. Blijf een minuut samen stil.
                  Niets oplossen, niets voorbereiden. Alleen merken wat er
                  ontstaat wanneer er even geen antwoord hoeft te komen.
                </p>
              </div>
              <button
                className={styles.primary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "stilteruisje.ritual.ready",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Wij hebben de stilte genomen
              </button>
            </>
          ) : (
            <Waiting partnerName={partnerName} />
          )}
        </div>
      </section>
    );
  }

  if (!allConversationDone) {
    const question =
      conversationQuestions[questionIndex % conversationQuestions.length];
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          {!ownConversationDone ? (
            <>
              <span className={styles.kicker}>Open gesprek</span>
              <h1>Nu mogen de woorden komen</h1>
              <div className={styles.prompt}>{question}</div>
              <p className={styles.promise}>
                Jouw belofte aan {partnerName}:{" "}
                <strong>{labelFor(supportActions, state.supportByActor[installationId] ?? "")}</strong>
              </p>
              <div className={styles.actions}>
                <button className={styles.secondary} onClick={() => setQuestionIndex((value) => value + 1)} type="button">Andere vraag</button>
                <button className={styles.secondary} onClick={() => openChat?.(question)} type="button">Open chat</button>
                <button className={styles.secondary} onClick={() => openCall?.()} type="button">Bel elkaar</button>
                <button
                  className={styles.primary}
                  disabled={pending}
                  onClick={() =>
                    dispatch({
                      type: "stilteruisje.conversation.done",
                      actorId: installationId,
                    })
                  }
                  type="button"
                >
                  Gesprek afgerond
                </button>
              </div>
            </>
          ) : (
            <Waiting partnerName={partnerName} />
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <span className={styles.kicker}>Bewaard voor jullie profiel</span>
        <h1>Jullie weten nu hoe openheid klinkt</h1>
        <p className={styles.lead}>
          De standen, ruisbronnen en steunafspraken zijn opgeslagen. Later
          kunnen we laten zien wat daarin verandert en wat juist constant
          blijft.
        </p>
        {christianLayer && (
          <FaithLayer
            intro="Openheid groeit ook in vertrouwen op God."
            prompts={[...christianPrompts]}
          />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() =>
            dispatch({
              type: "stilteruisje.game.completed",
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
