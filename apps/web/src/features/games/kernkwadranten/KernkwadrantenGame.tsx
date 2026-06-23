import { useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  Kernkwadrant,
  KernkwadrantenAction,
  KernkwadrantenState,
} from "./contracts";
import {
  allAllergies,
  allQualities,
  christianPrompts,
  conversationQuestions,
  optionsFor,
  profileForAllergy,
  profileForQuality,
} from "./content";
import { FaithLayer } from "../FaithLayer";
import styles from "./KernkwadrantenGame.module.css";

function Waiting({ partnerName }: { partnerName: string }) {
  return (
    <div className={styles.waiting}>
      <i />
      <h2>Wachten op {partnerName}</h2>
      <p>Jouw deel is opgeslagen. Zodra jullie allebei klaar zijn, gaan we verder.</p>
    </div>
  );
}

function Quadrant({ value }: { value: Kernkwadrant }) {
  return (
    <div className={styles.quadrant}>
      {[
        ["Kwaliteit", value.quality],
        ["Valkuil", value.pitfall],
        ["Uitdaging", value.challenge],
        ["Allergie", value.allergy],
      ].map(([label, text]) => (
        <div key={label}>
          <small>{label}</small>
          <strong>{text}</strong>
        </div>
      ))}
    </div>
  );
}

export function KernkwadrantenGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  priorAllergyOptions = [],
  priorQualityOptions = [],
  state,
}: GameComponentProps<KernkwadrantenState, KernkwadrantenAction>) {
  const existing = state.profiles[installationId];
  const [qualities, setQualities] = useState<string[]>(
    existing?.qualities ?? priorQualityOptions.slice(0, 2),
  );
  const [allergy, setAllergy] = useState(
    existing?.allergy ?? priorAllergyOptions[0] ?? "",
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const bothProfiles = memberIds.every((id) => Boolean(state.profiles[id]));
  const explanationReady = state.explanationReadyIds.includes(installationId);
  const allExplained = memberIds.every((id) =>
    state.explanationReadyIds.includes(id),
  );
  const round = state.currentRound;
  const ownRound = state.rounds[round]?.[installationId];
  const partnerRound = state.rounds[round]?.[partnerId];
  const draft = state.drafts[installationId] ?? {};
  const profile = state.profiles[installationId];
  const subject =
    round < 2 ? profile?.qualities[round] ?? "" : profile?.allergy ?? "";
  const canonical = useMemo(
    () => (round < 2 ? profileForQuality(subject) : profileForAllergy(subject)),
    [round, subject],
  );
  const fields =
    round < 2
      ? (["pitfall", "challenge", "allergy"] as const)
      : (["quality", "pitfall", "challenge"] as const);
  const allDiscussed =
    round >= 3 ||
    memberIds.every((id) => state.discussedByRound[round]?.includes(id));

  function toggleQuality(value: string) {
    setQualities((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length < 2
          ? [...current, value]
          : [current[1]!, value],
    );
  }

  const suggestions = [...new Set([...priorQualityOptions, ...allQualities])];
  const allergySuggestions = [
    ...new Set([...priorAllergyOptions, ...allAllergies]),
  ];

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <div className={styles.progress}>
          {[0, 1, 2, 3].map((step) => (
            <i data-done={round >= step && bothProfiles} key={step} />
          ))}
        </div>
        {!existing && (
          <>
            <span className={styles.kicker}>Kernkwaliteitenhut</span>
            <h1>Klopt dit nog voor jou?</h1>
            <p className={styles.lead}>
              We beginnen met wat eerder is gekozen. Pas het hier aan wanneer
              iets niet meer klopt; je hoeft daarvoor niet terug naar kaart 1.
            </p>
            <div className={styles.section}>
              <h3>Kies twee kernkwaliteiten</h3>
              <div className={styles.chips}>
                {suggestions.map((value) => (
                  <button
                    className={styles.chip}
                    data-selected={qualities.includes(value)}
                    key={value}
                    onClick={() => toggleQuality(value)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <h3>Welke eigenschap roept bij jou snel weerstand op?</h3>
              <div className={styles.chips}>
                {allergySuggestions.map((value) => (
                  <button
                    className={styles.chip}
                    data-selected={allergy === value}
                    key={value}
                    onClick={() => setAllergy(value)}
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <button
              className={styles.primary}
              disabled={pending || qualities.length !== 2 || !allergy}
              onClick={() =>
                dispatch({
                  type: "kernkwadranten.profile.confirmed",
                  actorId: installationId,
                  qualities,
                  allergy,
                })
              }
              type="button"
            >
              Dit past nu bij mij
            </button>
          </>
        )}

        {existing && !bothProfiles && <Waiting partnerName={partnerName} />}

        {bothProfiles && !allExplained && !explanationReady && (
          <>
            <span className={styles.kicker}>Eerst de basis</span>
            <h1>Een kwaliteit heeft vier kanten</h1>
            <p className={styles.lead}>
              Het kernkwadrant helpt om kracht en irritatie niet los van elkaar
              te zien. Vaak ligt achter wat je stoort juist een kwaliteit die
              jij zelf mag ontwikkelen.
            </p>
            <div className={styles.explainGrid}>
              <article><strong>Kernkwaliteit</strong><p>Wat vanzelf goed in jou aanwezig is.</p></article>
              <article><strong>Valkuil</strong><p>Wat ontstaat als je te veel van die kwaliteit inzet.</p></article>
              <article><strong>Uitdaging</strong><p>De gezonde aanvulling die jou meer balans geeft.</p></article>
              <article><strong>Allergie</strong><p>Een doorgeschoten uitdaging die bij jou weerstand oproept.</p></article>
            </div>
            <div className={styles.step}><span>1</span><p>Je kiest per vak uit vier mogelijkheden. Eentje sluit het best aan bij de klassieke kernkwadrantlogica.</p></div>
            <div className={styles.step}><span>2</span><p>Jullie vullen ieder voor zichzelf in. Pas als beiden klaar zijn, worden de kwadranten naast elkaar gelegd.</p></div>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "kernkwadranten.explanation.ready",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Ik begrijp het
            </button>
          </>
        )}

        {bothProfiles && explanationReady && !allExplained && (
          <Waiting partnerName={partnerName} />
        )}

        {allExplained && round < 3 && !ownRound && (
          <>
            <span className={styles.kicker}>Ronde {round + 1} van 3</span>
            <h1>{round < 2 ? subject : `Vanuit jouw allergie: ${subject}`}</h1>
            <p className={styles.lead}>
              {round < 2
                ? "Bouw jouw eigen kwadrant. Kies niet wat mooi klinkt, maar wat je werkelijk herkent."
                : "Werk nu terug: welke gezonde kwaliteit en uitdaging kunnen onder deze irritatie liggen?"}
            </p>
            {fields.map((field) => (
              <div className={styles.field} key={field}>
                <strong>
                  {field === "quality"
                    ? "Bijpassende kwaliteit"
                    : field === "pitfall"
                      ? "Valkuil"
                      : field === "challenge"
                        ? "Uitdaging"
                        : "Allergie"}
                </strong>
                <div className={styles.options}>
                  {optionsFor(canonical, field).map((value) => (
                    <button
                      className={styles.option}
                      data-selected={draft[field] === value}
                      key={value}
                      onClick={() =>
                        dispatch({
                          type: "kernkwadranten.choice.selected",
                          actorId: installationId,
                          field,
                          value,
                        })
                      }
                      type="button"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              className={styles.primary}
              disabled={pending || fields.some((field) => !draft[field])}
              onClick={() =>
                dispatch({
                  type: "kernkwadranten.round.submitted",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Leg mijn kwadrant klaar
            </button>
          </>
        )}

        {allExplained && round < 3 && ownRound && !partnerRound && (
          <Waiting partnerName={partnerName} />
        )}

        {allExplained && round < 3 && ownRound && partnerRound && !allDiscussed && (
          <>
            <span className={styles.kicker}>Naast elkaar</span>
            <h1>Waar raken jullie elkaar?</h1>
            <div className={styles.compare}>
              <article><h3>Jij</h3><Quadrant value={ownRound} /></article>
              <article><h3>{partnerName}</h3><Quadrant value={partnerRound} /></article>
            </div>
            <div className={styles.question}>
              {conversationQuestions[questionIndex % conversationQuestions.length]}
            </div>
            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => setQuestionIndex((value) => value + 1)} type="button">Andere vraag</button>
              <button className={styles.secondary} onClick={() => openChat?.(conversationQuestions[questionIndex % conversationQuestions.length])} type="button">Open chat</button>
              <button className={styles.secondary} onClick={() => openCall?.()} type="button">Bel elkaar</button>
              <button
                className={styles.primary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "kernkwadranten.round.discussed",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Gesprek afgerond
              </button>
            </div>
          </>
        )}

        {allExplained && round < 3 && allDiscussed && <Waiting partnerName={partnerName} />}

        {round >= 3 && (
          <>
            <span className={styles.kicker}>Drie lagen dieper</span>
            <h1>Jullie kwadranten zijn bewaard</h1>
            <p className={styles.lead}>
              Jullie hebben twee kwaliteiten en een allergie onderzocht. Deze
              uitkomsten blijven beschikbaar voor het persoonlijke en
              gezamenlijke profiel.
            </p>
            {christianLayer && (
              <FaithLayer
                intro="Een kwaliteit die doorschiet, mag je ook in genade bekijken."
                prompts={[...christianPrompts]}
              />
            )}
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "kernkwadranten.game.completed",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Terug naar kaart 2
            </button>
          </>
        )}
      </div>
    </section>
  );
}
