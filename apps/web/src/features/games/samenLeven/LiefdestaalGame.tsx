import { useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import { FaithLayer } from "../FaithLayer";
import { samenLevenContent } from "./content";
import type { SamenLevenAction, SamenLevenState } from "./contracts";
import {
  loveRouteInfo,
} from "./liefdestaalContent";
import {
  buildLoveProfile,
  completeLovePrompts,
  scoreCompleteLoveRoutes,
} from "./liefdestaalQuestionnaire";
import styles from "./LiefdestaalGame.module.css";

const PAGE_SIZE = 3;

function RouteProfile({
  selections,
  title,
}: {
  selections: Record<string, string>;
  title: string;
}) {
  const scores = scoreCompleteLoveRoutes(selections);
  const max = Math.max(1, ...scores.map((entry) => entry.score));
  return (
    <section className={styles.profile}>
      <h2>{title}</h2>
      {scores.map((entry, index) => (
        <div className={styles.route} data-primary={index === 0} key={entry.route}>
          <span className={styles.routeIcon}>{entry.icon}</span>
          <div>
            <strong>{entry.title}</strong>
            <small>{entry.description}</small>
            <span className={styles.bar}>
              <i style={{ width: `${(entry.score / max) * 100}%` }} />
            </span>
          </div>
          <b>{entry.score}</b>
        </div>
      ))}
    </section>
  );
}

function MainRoutes({
  name,
  selections,
}: {
  name: string;
  selections: Record<string, string>;
}) {
  const profile = buildLoveProfile(selections);
  return (
    <section className={styles.mainRoutes}>
      <span className={styles.kicker}>{name}</span>
      <small className={styles.resultLabel}>Eerste liefdestaal</small>
      <h2>
        {profile.primary?.icon} {profile.primary?.title}
      </h2>
      <p>{profile.primary?.description}</p>
      <div className={styles.secondRoute}>
        <strong>
          Tweede liefdestaal: {profile.secondary?.icon}{" "}
          {profile.secondary?.title}
        </strong>
        <span>{profile.secondary?.description}</span>
      </div>
      <p className={styles.nuance}>
        {profile.closePair
          ? "Deze twee liggen dicht bij elkaar. Dat is heel normaal: de meeste mensen herkennen zich niet in één enkele liefdestaal."
          : "Dit zijn je twee sterkste routes in deze invulling. De andere drie blijven ook onderdeel van hoe je liefde kunt herkennen."}
      </p>
      <div className={styles.receiveGive}>
        <div>
          <small>Wat je het snelst als liefde herkent</small>
          <strong>
            {profile.receiving[0]?.icon} {profile.receiving[0]?.shortTitle}
          </strong>
        </div>
        <div>
          <small>Hoe je zelf meestal liefde laat zien</small>
          <strong>
            {profile.giving[0]?.icon} {profile.giving[0]?.shortTitle}
          </strong>
        </div>
      </div>
    </section>
  );
}

export function LiefdestaalGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  restartGame,
  state,
}: GameComponentProps<SamenLevenState, SamenLevenAction>) {
  const [started, setStarted] = useState(
    () => Object.keys(state.selections[installationId] ?? {}).length > 0,
  );
  const [page, setPage] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const content = samenLevenContent.liefdestaal;
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const own = state.selections[installationId] ?? {};
  const partner = state.selections[partnerId] ?? {};
  const ownSubmitted = state.submittedIds.includes(installationId);
  const partnerSubmitted = state.submittedIds.includes(partnerId);
  const ownDiscussionDone = state.discussionDoneIds.includes(installationId);
  const allDiscussionDone = memberIds.every((id) =>
    state.discussionDoneIds.includes(id),
  );
  const pages = Math.ceil(completeLovePrompts.length / PAGE_SIZE);
  const pagePrompts = completeLovePrompts.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );
  const pageComplete = pagePrompts.every((prompt) => own[prompt.id]);
  const allComplete = completeLovePrompts.every((prompt) => own[prompt.id]);
  const ownProfile = useMemo(() => buildLoveProfile(own), [own]);
  const partnerProfile = useMemo(() => buildLoveProfile(partner), [partner]);

  if (!started && !ownSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Liefdestaal of misverstand</span>
          <h1>Dezelfde liefde, een andere vertaling</h1>
          <p>
            Niet iedereen merkt liefde op dezelfde manier. De één hoort haar in
            lieve woorden, de ander ziet haar in hulp, tijd, nabijheid of een
            persoonlijk cadeau. Je krijgt steeds twee herkenbare situaties en
            kiest wat op dit moment het meest bij je past.
          </p>
          <figure>
            <img
              alt="Een leeg bankje onder een rozenboog met een houten hartpuzzel en symbolen van aandacht"
              src="/assets/liefdestaal-scene.png"
            />
          </figure>
          <div className={styles.routePreview}>
            {Object.entries(loveRouteInfo).map(([id, route]) => (
              <span key={id}>
                {route.icon} {route.title}
              </span>
            ))}
          </div>
          <p className={styles.note}>
            Meestal komen er twee liefdestalen duidelijker naar voren. Zie ze
            niet als vaste hokjes: wat je nodig hebt kan veranderen door
            leeftijd, stress, veiligheid, verlies, ouderschap of een nieuwe
            levensfase.
          </p>
          <button className={styles.primary} onClick={() => setStarted(true)} type="button">
            Begin de verkenning
          </button>
        </div>
      </section>
    );
  }

  if (!ownSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>
            Stap {page + 1} van {pages}
          </span>
          <h1>{page < 7 ? "Wat komt bij jou binnen?" : "Hoe geef jij liefde?"}</h1>
          <p className={styles.lead}>
            Kies wat het dichtst bij je ligt. Niet wat het mooiste klinkt.
          </p>
          <div className={styles.progress}>
            <i style={{ width: `${((page + 1) / pages) * 100}%` }} />
          </div>
          <div className={styles.questions}>
            {pagePrompts.map((prompt) => (
              <section className={styles.question} key={prompt.id}>
                <h2>{prompt.question}</h2>
                <div>
                  {prompt.options.map((option, optionIndex) => (
                    <button
                      data-active={own[prompt.id] === option}
                      key={option}
                      onClick={() =>
                        dispatch({
                          type: "samen-leven.option.selected",
                          actorId: installationId,
                          promptId: prompt.id,
                          value: option,
                        })
                      }
                      type="button"
                    >
                      <b>{optionIndex === 0 ? "A" : "B"}</b>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className={styles.actions}>
            {page > 0 && (
              <button className={styles.secondary} onClick={() => setPage(page - 1)} type="button">
                Vorige
              </button>
            )}
            {page < pages - 1 ? (
              <button
                className={styles.primary}
                disabled={!pageComplete}
                onClick={() => setPage(page + 1)}
                type="button"
              >
                Volgende
              </button>
            ) : (
              <button
                className={styles.primary}
                disabled={!allComplete || pending}
                onClick={() =>
                  dispatch({
                    type: "samen-leven.answers.submitted",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Vergelijk onze vertalingen
              </button>
            )}
            {restartGame && (
              <button className={styles.secondary} onClick={restartGame} type="button">
                Terug naar begin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!partnerSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.waiting}>
          <h1>Jouw vertaling is klaar</h1>
          <p>We openen de profielen zodra {partnerName} ook klaar is.</p>
          {restartGame && (
            <button className={styles.secondary} onClick={restartGame} type="button">
              Terug naar begin
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!ownDiscussionDone) {
    const ownPrimary = ownProfile.primary;
    const partnerPrimary = partnerProfile.primary;
    const ownTop = new Set(
      [ownProfile.primary?.route, ownProfile.secondary?.route].filter(
        (route): route is NonNullable<typeof route> => Boolean(route),
      ),
    );
    const partnerTop = new Set(
      [partnerProfile.primary?.route, partnerProfile.secondary?.route].filter(
        (route): route is NonNullable<typeof route> => Boolean(route),
      ),
    );
    const overlap = [...ownTop].filter((route) => partnerTop.has(route));
    const conversation = content.discussionQuestions[
      questionIndex % content.discussionQuestions.length
    ];
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Jullie vertaalkaart</span>
          <h1>Dit zijn jullie liefdestalen</h1>
          <p className={styles.resultIntro}>
            De eerste twee per persoon zijn het belangrijkst om samen te
            bespreken. De eerste scoorde het vaakst; de tweede ligt daar het
            dichtst achter. De andere drie horen nog steeds bij jullie.
          </p>
          <details className={styles.fullScores}>
            <summary>Bekijk alle vijf scores</summary>
            <p className={styles.scoreExplanation}>
              De cijfers laten zien hoe vaak je een antwoord uit die categorie
              koos. Samen tellen de vijf scores op tot 30. Een hogere score
              betekent dat je deze manier in de vragen vaker als liefde herkende.
            </p>
            <div className={styles.profiles}>
              <RouteProfile selections={own} title="Jij" />
              <RouteProfile selections={partner} title={partnerName} />
            </div>
          </details>
          <div className={styles.mainRouteGrid}>
            <MainRoutes name="Jij" selections={own} />
            <MainRoutes name={partnerName} selections={partner} />
          </div>
          <section className={styles.interpretation}>
            <h2>
              {overlap.length
                ? "Hier herkennen jullie elkaars liefde waarschijnlijk sneller"
                : "Jullie herkennen liefde nu op verschillende manieren"}
            </h2>
            {overlap.length ? (
              <p>
                In jullie sterkste twee zit overlap bij{" "}
                <strong>
                  {overlap
                    .map((route) =>
                      loveRouteInfo[route].title.toLowerCase(),
                    )
                    .join(" en ")}
                </strong>
                . Daar herkennen jullie elkaars bedoeling waarschijnlijk
                makkelijker. Dezelfde taal kan er praktisch nog steeds anders
                uitzien, dus blijf vragen wat precies fijn is.
              </p>
            ) : (
              <p>
                Jullie eerste twee liefdestalen overlappen nu niet. Dat betekent
                niet dat jullie minder van elkaar houden. Je kunt liefde geven
                op een manier die voor jou heel duidelijk is, terwijl die bij de
                ander minder hard binnenkomt. Stem daarom af in plaats van meer
                van hetzelfde te geven.
              </p>
            )}
            <div className={styles.translationTips}>
              <div>
                <strong>Zo kun jij beter aansluiten bij {partnerName}</strong>
                <span>{partnerPrimary?.tryThis}</span>
              </div>
              <div>
                <strong>Zo kan {partnerName} beter aansluiten bij jou</strong>
                <span>{ownPrimary?.tryThis}</span>
              </div>
            </div>
            <p className={styles.changeNote}>
              Deze uitslag is een foto van nu, geen permanente identiteit.
              Liefdestalen kunnen verschuiven door de jaren, bijvoorbeeld
              wanneer jullie relatie veiliger wordt, omstandigheden veranderen
              of een behoefte lange tijd weinig ruimte heeft gekregen.
            </p>
          </section>
          <section className={styles.translation}>
            <h2>Waar liefde onderweg gemist kan worden</h2>
            <p>
              Jij laat liefde zelf het makkelijkst zien via{" "}
              <strong>{ownProfile.giving[0]?.title.toLowerCase()}</strong>,
              terwijl {partnerName} liefde het snelst herkent via{" "}
              <strong>{partnerProfile.receiving[0]?.title.toLowerCase()}</strong>.
              Andersom geeft {partnerName} vaak via{" "}
              <strong>{partnerProfile.giving[0]?.title.toLowerCase()}</strong>,
              terwijl jij vooral{" "}
              <strong>{ownProfile.receiving[0]?.title.toLowerCase()}</strong>{" "}
              opmerkt.
              Verschil betekent niet dat liefde ontbreekt—wel dat goede
              bedoelingen soms ondertiteling nodig hebben.
            </p>
          </section>
          <section className={styles.conversation}>
            <span className={styles.kicker}>Gespreksvraag</span>
            <p>{conversation}</p>
            <div className={styles.actions}>
              <button className={styles.secondary} onClick={() => setQuestionIndex(questionIndex + 1)} type="button">
                Andere vraag
              </button>
              <button className={styles.secondary} onClick={() => openChat?.(conversation)} type="button">
                Open chat
              </button>
              <button className={styles.secondary} onClick={() => openCall?.()} type="button">
                Bel elkaar
              </button>
            </div>
          </section>
          {christianLayer && (
            <FaithLayer
              intro={content.christianIntro}
              prompts={[...content.christianPrompts]}
            />
          )}
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "samen-leven.discussion.done",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Gesprek afgerond
            </button>
            {restartGame && (
              <button className={styles.secondary} onClick={restartGame} type="button">
                Terug naar begin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!allDiscussionDone) {
    return (
      <section className={styles.game}>
        <div className={styles.waiting}>
          <h1>Bijna afgerond</h1>
          <p>We wachten nog even op {partnerName}.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.end}>
        <span className={styles.kicker}>Van misverstand naar vertaling</span>
        <h1>Liefde hoeft niet geraden te worden</h1>
        <p>
          Jullie kennen nu ieder de twee routes die op dit moment het snelst
          landen. Gebruik de uitslag niet als boodschappenlijst of bewijs dat
          de ander tekortschiet. Zie haar als een woordenboek: een manier om
          duidelijker te vragen, beter te herkennen en af en toe bewust in de
          taal van de ander te spreken.
        </p>
        <p className={styles.profileNote}>
          Deze uitslag wordt volledig opgeslagen. Zodra profiel 3 beschikbaar
          is, wordt zij samen met de andere spellen meegenomen in jullie
          groeiende profiel en de verdiepende profielduiding.
        </p>
        <div className={styles.endLesson}>
          <strong>Neem mee:</strong>
          <span>Vraag niet alleen “hou je van mij?”, maar ook “hoe kan ik het vandaag verstaanbaar maken?”</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "samen-leven.game.completed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Opslaan en terug naar kaart 3
          </button>
          <button
            className={styles.secondary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "samen-leven.game.replayed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Opnieuw invullen
          </button>
        </div>
      </div>
    </section>
  );
}
