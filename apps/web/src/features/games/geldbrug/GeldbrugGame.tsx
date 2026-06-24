import { useEffect, useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  christianQuestions,
  commitmentOptions,
  compassPillars,
  moneyScales,
  moneyScenarios,
  reflectionPrompts,
  scenarioFears,
  scenarioNeeds,
} from "./content";
import type {
  GeldbrugAction,
  GeldbrugState,
  ScenarioAnswer,
} from "./contracts";
import {
  compassTotal,
  selectScenarioIds,
} from "./reducer";
import styles from "./GeldbrugGame.module.css";

function Progress({
  current,
  label,
  total = 5,
}: {
  current: number;
  label: string;
  total?: number;
}) {
  return (
    <div className={styles.progress} aria-label={label}>
      <span style={{ width: `${Math.max(8, (current / total) * 100)}%` }} />
      <small>{label}</small>
    </div>
  );
}

function PauseButton({
  pauseGame,
  pending,
}: {
  pauseGame: (() => void) | undefined;
  pending: boolean;
}) {
  if (!pauseGame) return null;
  return (
    <button
      className={styles.pause}
      disabled={pending}
      onClick={pauseGame}
      type="button"
    >
      Bewaar en ga later verder
    </button>
  );
}

function Waiting({
  partnerName,
  pauseGame,
  pending,
  restartGame,
}: {
  partnerName: string;
  pauseGame: (() => void) | undefined;
  pending: boolean;
  restartGame: (() => void) | undefined;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.waiting}>
        <span className={styles.kicker}>Even wachten op elkaar</span>
        <h1>Jouw deel van de brug staat</h1>
        <p>We gaan verder zodra {partnerName} ook klaar is.</p>
        <div className={styles.actions}>
          <PauseButton pauseGame={pauseGame} pending={pending} />
          {restartGame && (
            <button className={styles.secondary} onClick={restartGame} type="button">
              Hele spel opnieuw starten
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function CompassComparison({
  memberIds,
  ownId,
  partnerName,
  state,
}: {
  memberIds: string[];
  ownId: string;
  partnerName: string;
  state: GeldbrugState;
}) {
  const partnerId = memberIds.find((id) => id !== ownId) ?? "";
  return (
    <div className={styles.compassComparison}>
      {compassPillars.map((pillar) => {
        const own = state.compassByPerson[ownId]?.[pillar.id] ?? 0;
        const partner = state.compassByPerson[partnerId]?.[pillar.id] ?? 0;
        return (
          <div className={styles.comparePillar} key={pillar.id}>
            <span>{pillar.icon}</span>
            <strong>{pillar.title}</strong>
            <div>
              <label>
                Jij <b>{own}</b>
                <i style={{ width: `${own * 4}%` }} />
              </label>
              <label>
                {partnerName} <b>{partner}</b>
                <i style={{ width: `${partner * 4}%` }} />
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GeldbrugGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  pauseGame,
  partnerName,
  pending,
  restartGame,
  state,
}: GameComponentProps<GeldbrugState, GeldbrugAction>) {
  const [started, setStarted] = useState(
    () => Boolean(state.scenarioIds.length || state.compassByPerson[installationId]),
  );
  const [scenarioDraft, setScenarioDraft] = useState<
    Partial<ScenarioAnswer>
  >({});
  const [commitmentText, setCommitmentText] = useState(
    state.commitment?.text ?? "",
  );
  const [compassStep, setCompassStep] = useState<"coins" | "reflection">(
    () =>
      Object.keys(state.reflectionsByPerson[installationId] ?? {}).length
        ? "reflection"
        : "coins",
  );
  const [compassComparisonSeen, setCompassComparisonSeen] = useState(
    () =>
      Object.values(state.scenarioAnswers).some(
        (answers) => Boolean(answers?.[installationId]),
      ) || state.scenariosSubmittedIds.includes(installationId),
  );
  const [scenarioBreatherPassed, setScenarioBreatherPassed] = useState(
    () =>
      Object.values(state.scenarioAnswers).filter(
        (answers) => Boolean(answers?.[installationId]),
      ).length > 2,
  );
  const [scalesIntroSeen, setScalesIntroSeen] = useState(
    () => Object.keys(state.scalesByPerson[installationId] ?? {}).length > 0,
  );
  const [faithPage, setFaithPage] = useState<1 | 2>(
    () =>
      Object.keys(state.christianReflections[installationId] ?? {}).some(
        (id) => Number(id.replace("faith-", "")) > 4,
      )
        ? 2
        : 1,
  );
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const ownCompass = {
    ...Object.fromEntries(compassPillars.map((pillar) => [pillar.id, 0])),
    ...(state.compassByPerson[installationId] ?? {}),
  };
  const ownReflections = state.reflectionsByPerson[installationId] ?? {};
  const ownCompassSubmitted = state.compassSubmittedIds.includes(installationId);
  const bothCompassSubmitted = memberIds.every((id) =>
    state.compassSubmittedIds.includes(id),
  );
  const ownScenariosSubmitted =
    state.scenariosSubmittedIds.includes(installationId);
  const bothScenariosSubmitted = memberIds.every((id) =>
    state.scenariosSubmittedIds.includes(id),
  );
  const ownScalesSubmitted = state.scalesSubmittedIds.includes(installationId);
  const bothScalesSubmitted = memberIds.every((id) =>
    state.scalesSubmittedIds.includes(id),
  );
  const ownChristianSubmitted =
    state.christianSubmittedIds.includes(installationId);
  const bothChristianSubmitted =
    !christianLayer ||
    memberIds.every((id) => state.christianSubmittedIds.includes(id));
  const remainingCoins = 25 - compassTotal(ownCompass);
  const reflectionComplete = reflectionPrompts.every(
    (prompt) => ownReflections[prompt.id],
  );
  const ownScenarioAnswers = Object.fromEntries(
    state.scenarioIds.map((id) => [
      id,
      state.scenarioAnswers[id]?.[installationId],
    ]),
  );
  const currentScenarioId = state.scenarioIds.find(
    (id) => !ownScenarioAnswers[id],
  );
  const currentScenario = moneyScenarios.find(
    (scenario) => scenario.id === currentScenarioId,
  );
  const answeredScenarioCount = Object.values(ownScenarioAnswers).filter(
    Boolean,
  ).length;
  const scales = state.scalesByPerson[installationId] ?? {};
  const scaleComplete = moneyScales.every(
    (scale) => typeof scales[scale.id] === "number",
  );
  const christianAnswers = state.christianReflections[installationId] ?? {};
  const christianAnsweredCount = Object.values(christianAnswers).filter(
    (value) => value.trim().length > 0,
  ).length;
  const commitmentConfirmed = state.commitmentConfirmedIds.includes(
    installationId,
  );
  const allCommitmentConfirmed =
    Boolean(state.commitment) &&
    memberIds.every((id) => state.commitmentConfirmedIds.includes(id));

  useEffect(() => {
    if (!started || state.scenarioIds.length) return;
    void dispatch({
      type: "geldbrug.session.started",
      actorId: installationId,
      scenarioIds: selectScenarioIds(
        `${installationId}:${Date.now()}:${Math.random()}`,
        5,
      ),
    });
  }, [dispatch, installationId, started, state.scenarioIds.length]);

  useEffect(() => {
    setCommitmentText(state.commitment?.text ?? "");
  }, [state.commitment?.text]);

  const comparisonInsights = useMemo(() => {
    if (!bothScalesSubmitted) return null;
    const distances = moneyScales.map((scale) => ({
      scale,
      distance: Math.abs(
        (state.scalesByPerson[installationId]?.[scale.id] ?? 50) -
          (state.scalesByPerson[partnerId]?.[scale.id] ?? 50),
      ),
    }));
    return {
      closest: [...distances].sort((a, b) => a.distance - b.distance)[0],
      furthest: [...distances].sort((a, b) => b.distance - a.distance)[0],
    };
  }, [bothScalesSubmitted, installationId, partnerId, state.scalesByPerson]);

  if (!started) {
    return (
      <section className={styles.game}>
        <div className={styles.intro}>
          <span className={styles.kicker}>De Geldbrug</span>
          <h1>Geld is nooit alleen een bedrag</h1>
          <p>
            Geld kan rust, vrijheid, plezier, macht, schaamte, zorg of
            zekerheid betekenen. Jullie vullen geen inkomen, saldo of
            rekeningnummer in. Dit spel onderzoekt wat jullie met geld proberen
            te beschermen en welke afspraken vertrouwen mogelijk maken.
          </p>
          <figure>
            <img
              alt="Een geschilderde stenen brug met vijf pijlers en lege schalen voor het Geldkompas"
              src="/assets/geldbrug-scene.png"
            />
          </figure>
          <div className={styles.introRules}>
            <span>🪙 Verdeel precies 25 munten</span>
            <span>🧱 Draag samen vijf situaties</span>
            <span>⚖️ Vergelijk grenzen en vrijheid</span>
            <span>🔑 Bevestig één gezamenlijke afspraak</span>
          </div>
          <p className={styles.gentle}>
            Dit is geen financieel advies en de eindafspraak is geen contract.
            Het is een eerlijk gesprek en een gezamenlijk experiment.
          </p>
          <button className={styles.primary} onClick={() => setStarted(true)} type="button">
            Stap de brug op
          </button>
        </div>
      </section>
    );
  }

  if (!ownCompassSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Pijler 1 · Jouw Geldkompas</span>
          <Progress
            current={compassStep === "coins" ? 1 : 2}
            label={`Geldkompas · stap ${compassStep === "coins" ? 1 : 2} van 2`}
            total={2}
          />
          <h1>
            {compassStep === "coins"
              ? "Waar moeten jouw 25 munten staan?"
              : "Wat vertelt jouw verdeling?"}
          </h1>
          <p className={styles.lead}>
            {compassStep === "coins"
              ? "Verdeel alle munten vrij. Een pijler mag nul krijgen en een andere heel veel. Juist de scheve verdeling vertelt iets."
              : "Je munten staan. Kies nu vijf korte zinnen die helpen begrijpen waarom jouw kompas zo is geworden."}
          </p>
          {compassStep === "coins" && (
            <>
              <div className={styles.coinPool} aria-label={`${remainingCoins} munten over`}>
                <strong>{remainingCoins}</strong>
                <span>munten nog te verdelen</span>
                <div aria-hidden="true">
                  {Array.from({ length: 25 }, (_, index) => (
                    <i data-used={index >= remainingCoins} key={index} />
                  ))}
                </div>
              </div>
              <div className={styles.pillars}>
                {compassPillars.map((pillar) => {
                  const value = ownCompass[pillar.id] ?? 0;
                  return (
                    <section className={styles.pillar} key={pillar.id}>
                      <span className={styles.pillarIcon}>{pillar.icon}</span>
                      <h2>{pillar.title}</h2>
                      <p>{pillar.description}</p>
                      <div>
                        <button
                          aria-label={`Minder munten voor ${pillar.title}`}
                          disabled={value <= 0 || pending}
                          onClick={() =>
                            dispatch({
                              type: "geldbrug.compass.coin.moved",
                              actorId: installationId,
                              pillarId: pillar.id,
                              delta: -1,
                            })
                          }
                          type="button"
                        >
                          −
                        </button>
                        <strong>{value}</strong>
                        <button
                          aria-label={`Meer munten voor ${pillar.title}`}
                          disabled={remainingCoins <= 0 || pending}
                          onClick={() =>
                            dispatch({
                              type: "geldbrug.compass.coin.moved",
                              actorId: installationId,
                              pillarId: pillar.id,
                              delta: 1,
                            })
                          }
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}
          {compassStep === "reflection" && (
            <div className={styles.reflections}>
              <div className={styles.miniCompass}>
                {compassPillars.map((pillar) => (
                  <span key={pillar.id}>
                    {pillar.icon} {pillar.title} <b>{ownCompass[pillar.id]}</b>
                  </span>
                ))}
              </div>
              {reflectionPrompts.map((prompt) => (
                <label key={prompt.id}>
                  <span>{prompt.question}</span>
                  <select
                    onChange={(event) =>
                      dispatch({
                        type: "geldbrug.reflection.answered",
                        actorId: installationId,
                        promptId: prompt.id,
                        value: event.target.value,
                      })
                    }
                    value={ownReflections[prompt.id] ?? ""}
                  >
                    <option value="">Kies wat het dichtst bij je ligt</option>
                    {prompt.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          <div className={styles.actions}>
            {compassStep === "coins" ? (
              <button
                className={styles.primary}
                disabled={remainingCoins !== 0 || pending}
                onClick={() => setCompassStep("reflection")}
                type="button"
              >
                Mijn 25 munten staan
              </button>
            ) : (
              <>
                <button
                  className={styles.primary}
                  disabled={!reflectionComplete || pending}
                  onClick={() =>
                    dispatch({
                      type: "geldbrug.compass.submitted",
                      actorId: installationId,
                    })
                  }
                  type="button"
                >
                  Leg mijn kompas naast dat van {partnerName}
                </button>
                <button
                  className={styles.secondary}
                  onClick={() => setCompassStep("coins")}
                  type="button"
                >
                  Munten aanpassen
                </button>
              </>
            )}
            <PauseButton pauseGame={pauseGame} pending={pending} />
          </div>
        </div>
      </section>
    );
  }

  if (!bothCompassSubmitted) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
        restartGame={restartGame}
      />
    );
  }

  if (!compassComparisonSeen) {
    return (
      <section className={styles.game}>
        <div className={styles.checkpoint}>
          <span className={styles.kicker}>Eerste rustpunt</span>
          <h1>Twee kompassen, geen goed of fout</h1>
          <p>
            Kijk eerst alleen naar het patroon. Waar lijken jullie op elkaar?
            Waar probeert ieder iets anders te beschermen?
          </p>
          <CompassComparison
            memberIds={memberIds}
            ownId={installationId}
            partnerName={partnerName}
            state={state}
          />
          <div className={styles.actions}>
            <button
              className={styles.primary}
              onClick={() => setCompassComparisonSeen(true)}
              type="button"
            >
              Verder naar vijf situaties
            </button>
            <PauseButton pauseGame={pauseGame} pending={pending} />
          </div>
        </div>
      </section>
    );
  }

  if (!ownScenariosSubmitted) {
    if (!currentScenario) {
      return (
        <section className={styles.game}>
          <div className={styles.panel}>
            <span className={styles.kicker}>Pijler 2 · De brug onder belasting</span>
            <h1>Je hebt vijf brugstenen gelegd</h1>
            <p className={styles.lead}>
              Je antwoorden zijn opgeslagen. Pas wanneer jullie allebei klaar
              zijn, leggen we de keuzes naast elkaar.
            </p>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "geldbrug.scenarios.submitted",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Vergelijk onze keuzes
            </button>
          </div>
        </section>
      );
    }
    const scenarioNumber =
      state.scenarioIds.findIndex((id) => id === currentScenario.id) + 1;
    const draftComplete =
      scenarioDraft.choice &&
      scenarioDraft.need &&
      scenarioDraft.fear &&
      scenarioDraft.trust;
    if (answeredScenarioCount === 2 && !scenarioBreatherPassed) {
      return (
        <section className={styles.game}>
          <div className={styles.checkpoint}>
            <span className={styles.kicker}>Tussenstop · 2 van 5</span>
            <h1>Even van beslissen naar begrijpen</h1>
            <p>
              Je hebt twee situaties gedragen. Let eens op: koos je vooral
              vanuit veiligheid, vrijheid, rechtvaardigheid of zorg voor de
              ander? Je hoeft daar nu niets mee op te lossen.
            </p>
            <Progress current={2} label="Twee van vijf situaties voltooid" />
            <div className={styles.actions}>
              <button
                className={styles.primary}
                onClick={() => setScenarioBreatherPassed(true)}
                type="button"
              >
                Ik ben klaar voor de volgende drie
              </button>
              <PauseButton pauseGame={pauseGame} pending={pending} />
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <Progress
            current={scenarioNumber}
            label={`Situatie ${scenarioNumber} van ${state.scenarioIds.length}`}
          />
          <span className={styles.kicker}>
            Situatie {scenarioNumber} van {state.scenarioIds.length}
          </span>
          <h1>{currentScenario.title}</h1>
          <p className={styles.scenarioText}>{currentScenario.situation}</p>
          <fieldset className={styles.choiceGrid}>
            <legend>Wat zou je het liefst doen?</legend>
            {currentScenario.choices.map((choice) => (
              <button
                data-active={scenarioDraft.choice === choice}
                key={choice}
                onClick={() =>
                  setScenarioDraft((current) => ({ ...current, choice }))
                }
                type="button"
              >
                {choice}
              </button>
            ))}
          </fieldset>
          <div className={styles.scenarioDepth}>
            <label>
              <span>Wat wil je hiermee vooral beschermen?</span>
              <select
                onChange={(event) =>
                  setScenarioDraft((current) => ({
                    ...current,
                    need: event.target.value,
                  }))
                }
                value={scenarioDraft.need ?? ""}
              >
                <option value="">Kies een behoefte</option>
                {scenarioNeeds.map((need) => (
                  <option key={need} value={need}>{need}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Waar ben je in deze situatie het meest bang voor?</span>
              <select
                onChange={(event) =>
                  setScenarioDraft((current) => ({
                    ...current,
                    fear: event.target.value,
                  }))
                }
                value={scenarioDraft.fear ?? ""}
              >
                <option value="">Kies een zorg</option>
                {scenarioFears.map((fear) => (
                  <option key={fear} value={fear}>{fear}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Hoeveel vertrouwen zou je hebben in deze keuze?</span>
              <div className={styles.rating}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    data-active={scenarioDraft.trust === value}
                    key={value}
                    onClick={() =>
                      setScenarioDraft((current) => ({ ...current, trust: value }))
                    }
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </label>
          </div>
          <button
            className={styles.primary}
            disabled={!draftComplete || pending}
            onClick={async () => {
              await dispatch({
                type: "geldbrug.scenario.answered",
                actorId: installationId,
                scenarioId: currentScenario.id,
                answer: scenarioDraft as ScenarioAnswer,
              });
              setScenarioDraft({});
            }}
            type="button"
          >
            Leg deze steen op de brug
          </button>
        </div>
      </section>
    );
  }

  if (!bothScenariosSubmitted) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
        restartGame={restartGame}
      />
    );
  }

  if (!scalesIntroSeen) {
    return (
      <section className={styles.game}>
        <div className={styles.checkpoint}>
          <span className={styles.kicker}>Tweede rustpunt</span>
          <h1>Dezelfde keuze kan iets anders betekenen</h1>
          <p>
            Lees dit eerst samen. Een verschil is geen storing in de brug; het
            laat zien waar uitleg, vrijheid of een afspraak nodig kan zijn.
          </p>
          <div className={styles.scenarioComparison}>
            {state.scenarioIds.map((scenarioId) => {
              const scenario = moneyScenarios.find((item) => item.id === scenarioId);
              const ownAnswer = state.scenarioAnswers[scenarioId]?.[installationId];
              const partnerAnswer = state.scenarioAnswers[scenarioId]?.[partnerId];
              const same = ownAnswer?.choice === partnerAnswer?.choice;
              return (
                <article data-same={same} key={scenarioId}>
                  <strong>{scenario?.title}</strong>
                  <span>Jij: {ownAnswer?.choice}</span>
                  <span>{partnerName}: {partnerAnswer?.choice}</span>
                  <small>
                    {same
                      ? `Zelfde route${ownAnswer?.need === partnerAnswer?.need ? " én dezelfde behoefte" : ", mogelijk om een andere reden"}.`
                      : ownAnswer?.need === partnerAnswer?.need
                        ? `Andere route, maar jullie beschermen allebei ${ownAnswer?.need}.`
                        : "Andere route én een andere behoefte. Hier is gesprek belangrijker dan snel compromis."}
                  </small>
                </article>
              );
            })}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              onClick={() => setScalesIntroSeen(true)}
              type="button"
            >
              Verder naar ruimte en grenzen
            </button>
            <PauseButton pauseGame={pauseGame} pending={pending} />
          </div>
        </div>
      </section>
    );
  }

  if (!ownScalesSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Pijler 3 · Ruimte en grenzen</span>
          <h1>Waar ligt voor jou een werkbare balans?</h1>
          <p className={styles.lead}>
            Zet iedere schaal op jouw eigen positie. Het doel is niet om nu al
            hetzelfde antwoord te geven.
          </p>
          <div className={styles.scales}>
            {moneyScales.map((scale) => (
              <label key={scale.id}>
                <div>
                  <span>{scale.left}</span>
                  <em>
                    {typeof scales[scale.id] === "number"
                      ? `${scales[scale.id]} van 100`
                      : "nog kiezen"}
                  </em>
                  <span>{scale.right}</span>
                </div>
                <input
                  max={100}
                  min={0}
                  onChange={(event) =>
                    dispatch({
                      type: "geldbrug.scale.changed",
                      actorId: installationId,
                      scaleId: scale.id,
                      value: Number(event.target.value),
                    })
                  }
                  type="range"
                  value={scales[scale.id] ?? 50}
                />
              </label>
            ))}
          </div>
          {!scaleComplete && (
            <p className={styles.gentle}>
              Beweeg iedere schuif minimaal één keer. Het midden mag natuurlijk
              echt jouw antwoord zijn.
            </p>
          )}
          <button
            className={styles.primary}
            disabled={!scaleComplete || pending}
            onClick={() =>
              dispatch({
                type: "geldbrug.scales.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            Toon waar we ruimte en afspraken nodig hebben
          </button>
        </div>
      </section>
    );
  }

  if (!bothScalesSubmitted) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
        restartGame={restartGame}
      />
    );
  }

  if (christianLayer && !ownChristianSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Christelijke verdieping</span>
          <Progress
            current={faithPage}
            label={`Verdieping · deel ${faithPage} van 2`}
            total={2}
          />
          <h1>Wat draagt jullie vertrouwen?</h1>
          <p className={styles.lead}>
            Beantwoord minimaal drie vragen. Niet om het geestelijk juiste
            antwoord te geven, maar om eerlijk te zien waar geld zekerheid,
            macht, vrijheid of dienstbaarheid raakt.
          </p>
          <div className={styles.faithQuestions}>
            {christianQuestions
              .slice(faithPage === 1 ? 0 : 4, faithPage === 1 ? 4 : 7)
              .map((question, localIndex) => {
                const index = faithPage === 1 ? localIndex : localIndex + 4;
                return (
              <label key={question}>
                <span>{question}</span>
                <textarea
                  maxLength={500}
                  onChange={(event) =>
                    dispatch({
                      type: "geldbrug.christian.answered",
                      actorId: installationId,
                      questionId: `faith-${index + 1}`,
                      value: event.target.value,
                    })
                  }
                  rows={3}
                  value={christianAnswers[`faith-${index + 1}`] ?? ""}
                />
              </label>
                );
              })}
          </div>
          <div className={styles.actions}>
            {faithPage === 1 ? (
              <button
                className={styles.primary}
                onClick={() => setFaithPage(2)}
                type="button"
              >
                Verder naar deel 2
              </button>
            ) : (
              <>
                <button
                  className={styles.primary}
                  disabled={christianAnsweredCount < 3 || pending}
                  onClick={() =>
                    dispatch({
                      type: "geldbrug.christian.submitted",
                      actorId: installationId,
                    })
                  }
                  type="button"
                >
                  Deel mijn geloofsreflectie met {partnerName}
                </button>
                <button
                  className={styles.secondary}
                  onClick={() => setFaithPage(1)}
                  type="button"
                >
                  Terug naar deel 1
                </button>
              </>
            )}
            <PauseButton pauseGame={pauseGame} pending={pending} />
          </div>
          <p className={styles.gentle}>
            {christianAnsweredCount} van minimaal 3 vragen beantwoord. Meer mag,
            maar hoeft niet.
          </p>
        </div>
      </section>
    );
  }

  if (!bothChristianSubmitted) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
        restartGame={restartGame}
      />
    );
  }

  if (!allCommitmentConfirmed) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Pijler 4 · De sluitsteen</span>
          <h1>Maak één afspraak die klein genoeg is om echt te doen</h1>
          {comparisonInsights && (
            <div className={styles.bridgeInsights}>
              <p>
                <strong>Dichtst bij elkaar:</strong>{" "}
                {comparisonInsights.closest?.scale.left} ↔{" "}
                {comparisonInsights.closest?.scale.right}
              </p>
              <p>
                <strong>Meeste afstemming nodig:</strong>{" "}
                {comparisonInsights.furthest?.scale.left} ↔{" "}
                {comparisonInsights.furthest?.scale.right}
              </p>
            </div>
          )}
          <div className={styles.commitmentOptions}>
            {commitmentOptions.map((option) => (
              <button
                data-active={commitmentText === option}
                key={option}
                onClick={() => setCommitmentText(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
          <label className={styles.customCommitment}>
            <span>Of schrijf jullie eigen afspraak</span>
            <textarea
              maxLength={320}
              onChange={(event) => setCommitmentText(event.target.value)}
              rows={3}
              value={commitmentText}
            />
          </label>
          {state.commitment && (
            <div className={styles.proposal}>
              <span>Huidig gezamenlijk voorstel</span>
              <strong>{state.commitment.text}</strong>
              <small>
                Versie {state.commitment.revision + 1}. Een wijziging vraagt
                opnieuw bevestiging van jullie allebei.
              </small>
            </div>
          )}
          <div className={styles.actions}>
            <button
              className={styles.secondary}
              disabled={!commitmentText.trim() || pending}
              onClick={() =>
                dispatch({
                  type: "geldbrug.commitment.proposed",
                  actorId: installationId,
                  text: commitmentText,
                })
              }
              type="button"
            >
              {state.commitment ? "Werk voorstel bij" : "Doe dit voorstel"}
            </button>
            <button
              className={styles.primary}
              disabled={!state.commitment || commitmentConfirmed || pending}
              onClick={() =>
                dispatch({
                  type: "geldbrug.commitment.confirmed",
                  actorId: installationId,
                })
              }
              type="button"
            >
              {commitmentConfirmed
                ? "Jij hebt bevestigd"
                : "Ik wil dit samen 30 dagen proberen"}
            </button>
            <PauseButton pauseGame={pauseGame} pending={pending} />
          </div>
          <p className={styles.gentle}>
            Geen contract en geen bewijs van liefde. Jullie mogen deze afspraak
            later aanpassen wanneer de praktijk iets anders vraagt.
          </p>
        </div>
      </section>
    );
  }

  const conversation = `Onze Geldbrug-afspraak: ${state.commitment?.text ?? ""}`;
  return (
    <section className={styles.game}>
      <div className={styles.end}>
        <span className={styles.kicker}>De Geldbrug staat</span>
        <h1>Jullie hebben niet alleen gepraat, maar samen gekozen</h1>
        <p>
          Jullie weten nu beter wat geld voor ieder probeert te beschermen,
          waar vrijheid nodig is en waar duidelijke afspraken juist rust geven.
        </p>
        <div className={styles.finalCommitment}>
          <span>Jullie afspraak voor de komende 30 dagen</span>
          <strong>{state.commitment?.text}</strong>
        </div>
        {christianLayer && (
          <p className={styles.faithOutcome}>
            De christelijke verdieping is opgeslagen als gesprek over
            vertrouwen, rentmeesterschap, macht en vrijgevigheid—niet als een
            score op goed geloof.
          </p>
        )}
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={() => openChat?.(conversation)} type="button">
            Bespreek de afspraak in chat
          </button>
          <button className={styles.secondary} onClick={() => openCall?.()} type="button">
            Bel elkaar
          </button>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "geldbrug.game.completed",
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
                type: "geldbrug.game.replayed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Opnieuw spelen met andere situaties
          </button>
        </div>
      </div>
    </section>
  );
}
