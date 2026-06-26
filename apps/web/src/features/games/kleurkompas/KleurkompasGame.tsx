import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  colors,
  comboKey,
  comboText,
  deeperQuestions,
  growthCards,
  heardWrongCards,
  scenarios,
  stressBehaviors,
  translatePhrases,
  uitlegCards,
  type KleurId,
} from "./content";
import type {
  KleurkompasAction,
  KleurkompasDeepening,
  KleurkompasExercise,
  KleurkompasState,
} from "./contracts";
import {
  kleurProfileFor,
  scoreScenarioAnswers,
  scoreStressRatings,
} from "./result";
import { normalizeKleurkompasState } from "./reducer";
import { FaithLayer } from "../FaithLayer";
import styles from "./KleurkompasGame.module.css";

type StyleVars = CSSProperties & Record<"--color" | "--value", string>;

const colorOrder: KleurId[] = ["R", "G", "Gr", "B"];
const colorAdjectives: Record<KleurId, string> = {
  R: "rode",
  G: "gele",
  Gr: "groene",
  B: "blauwe",
};

function Scene({
  children,
  step,
}: {
  children: ReactNode;
  step: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <div className={styles.progress} aria-label={`Stap ${step} van 6`}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <span data-active={item <= step} key={item} />
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function Waiting({
  partnerName,
  step,
}: {
  partnerName: string;
  step: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  return (
    <Scene step={step}>
      <span className={styles.kicker}>Even wachten</span>
      <h1>{partnerName} is nog bezig</h1>
      <p className={styles.lead}>
        Jouw keuzes staan klaar. De vergelijking verschijnt zodra jullie allebei
        deze stap hebben afgerond.
      </p>
      <div className={styles.waitingLine}>
        <span />
      </div>
    </Scene>
  );
}

function colorStyle(color: KleurId): StyleVars {
  return {
    "--color": colors[color].hex,
    "--value": "0%",
  };
}

function ScoreMeters({
  scores,
}: {
  scores: Record<KleurId, number>;
}) {
  const max = Math.max(1, ...Object.values(scores));
  return (
    <div className={styles.meter}>
      {colorOrder.map((color) => (
        <div className={styles.meterRow} key={color}>
          <strong style={{ color: colors[color].hex }}>{colors[color].name}</strong>
          <span className={styles.bar}>
            <i
              style={
                {
                  "--color": colors[color].hex,
                  "--value": `${Math.round((scores[color] / max) * 100)}%`,
                } as StyleVars
              }
            />
          </span>
          <span>{scores[color]}</span>
        </div>
      ))}
    </div>
  );
}

function ProfileCard({
  answers,
  title,
  stressRatings,
}: {
  answers: Record<string, KleurId>;
  stressRatings: Record<string, number>;
  title: string;
}) {
  const profile = kleurProfileFor(answers, stressRatings);
  const primary = colors[profile.primary];
  const secondary = colors[profile.secondary];
  const stress = colors[profile.stressColor];
  return (
    <article className={styles.profileCard}>
      <span className={styles.kicker}>{title}</span>
      <h2>
        <span className={styles.pill} style={colorStyle(profile.primary)}>
          {primary.name}
        </span>
        <span className={styles.pill} style={colorStyle(profile.secondary)}>
          {secondary.name}
        </span>
      </h2>
      <p>{primary.kernzin}</p>
      <p>
        <strong>Ook aanwezig:</strong> {secondary.name.toLowerCase()} —{" "}
        {secondary.label}.
      </p>
      <p>
        <strong>Onder spanning:</strong>{" "}
        <span style={{ color: stress.hex }}>{stress.name}</span>. {stress.stress}
      </p>
      <ScoreMeters scores={scoreScenarioAnswers(answers)} />
    </article>
  );
}

export function KleurkompasGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<KleurkompasState, KleurkompasAction>) {
  const gameState = normalizeKleurkompasState(state);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const ownAnswers = gameState.scenarioAnswers[installationId];
  const partnerAnswers = gameState.scenarioAnswers[partnerId];
  const ownStress = gameState.stressRatings[installationId];
  const partnerStress = gameState.stressRatings[partnerId];
  const ownExercise = gameState.exercises[installationId];
  const partnerExercise = gameState.exercises[partnerId];
  const ownDeepening = gameState.deepenings[installationId];
  const partnerDeepening = gameState.deepenings[partnerId];
  const introSeen = gameState.introSeenIds.includes(installationId);

  const [answers, setAnswers] = useState<Record<string, KleurId>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [phraseId, setPhraseId] = useState<string>(translatePhrases[0]?.id ?? "");
  const [chosenColor, setChosenColor] = useState<KleurId>("Gr");
  const [ownReframe, setOwnReframe] = useState("");
  const [partnerNeedGuess, setPartnerNeedGuess] = useState("");
  const [ownQuestion, setOwnQuestion] = useState("");
  const [ownAnswer, setOwnAnswer] = useState("");
  const [heardWrongCardId, setHeardWrongCardId] = useState<string>(
    heardWrongCards[0]?.id ?? "",
  );
  const [heardWrongReflection, setHeardWrongReflection] = useState("");
  const [growthCard, setGrowthCard] = useState("");
  const [miniAgreement, setMiniAgreement] = useState("");
  const [autoSavedDeepeningKey, setAutoSavedDeepeningKey] = useState("");

  const bothAnswers = memberIds.every((id) =>
    Boolean(gameState.scenarioAnswers[id]),
  );
  const bothStress = memberIds.every((id) =>
    Boolean(gameState.stressRatings[id]),
  );
  const bothExercises = memberIds.every((id) =>
    Boolean(gameState.exercises[id]),
  );
  const bothDeepenings = memberIds.every((id) =>
    Boolean(gameState.deepenings[id]),
  );
  const ownProfile = useMemo(
    () => kleurProfileFor(ownAnswers, ownStress),
    [ownAnswers, ownStress],
  );
  const partnerProfile = useMemo(
    () => kleurProfileFor(partnerAnswers, partnerStress),
    [partnerAnswers, partnerStress],
  );
  const combo = useMemo(() => {
    if (!ownAnswers || !partnerAnswers) return null;
    const key = comboKey(ownProfile.primary, partnerProfile.primary);
    return { key, ...comboText[key] };
  }, [ownAnswers, ownProfile.primary, partnerAnswers, partnerProfile.primary]);
  const selectedPhrase =
    translatePhrases.find((phrase) => phrase.id === phraseId) ??
    translatePhrases[0];
  const exerciseComplete =
    Boolean(phraseId) &&
    ownReframe.trim().length >= 8 &&
    partnerNeedGuess.trim().length >= 8;
  const ownDeeperQuestions = deeperQuestions[ownProfile.primary] ?? [];
  const currentGrowthCards = combo ? growthCards[combo.key] ?? [] : [];
  const selectedHeardWrong =
    heardWrongCards.find((card) => card.id === heardWrongCardId) ??
    heardWrongCards[0];
  const deepeningComplete =
    ownQuestion.trim().length >= 8 &&
    ownAnswer.trim().length >= 12 &&
    heardWrongCardId.length > 0 &&
    heardWrongReflection.trim().length >= 12 &&
    growthCard.trim().length >= 8 &&
    miniAgreement.trim().length >= 12;

  const deepeningPayload = useMemo<KleurkompasDeepening>(
    () => ({
      ownQuestion: ownQuestion.trim(),
      ownAnswer: ownAnswer.trim(),
      heardWrongCardId,
      heardWrongReflection: heardWrongReflection.trim(),
      growthCard: growthCard.trim(),
      miniAgreement: miniAgreement.trim(),
    }),
    [
      growthCard,
      heardWrongCardId,
      heardWrongReflection,
      miniAgreement,
      ownAnswer,
      ownQuestion,
    ],
  );

  useEffect(() => {
    if (ownDeepening || pending || !deepeningComplete) return;
    const key = JSON.stringify(deepeningPayload);
    if (autoSavedDeepeningKey === key) return;
    const timer = window.setTimeout(() => {
      setAutoSavedDeepeningKey(key);
      void dispatch({
        type: "kleurkompas.deepening.submitted",
        actorId: installationId,
        deepening: deepeningPayload,
      });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [
    autoSavedDeepeningKey,
    deepeningComplete,
    deepeningPayload,
    dispatch,
    installationId,
    ownDeepening,
    pending,
  ]);

  if (!introSeen) {
    return (
      <Scene step={1}>
        <span className={styles.kicker}>Kleurkompas</span>
        <h1>Welke kleur krijg jij onder spanning?</h1>
        <p className={styles.lead}>
          Dit spel gebruikt kleurentaal als korte route naar herkenning. Niet
          om elkaar vast te zetten, wel om sneller te snappen wat er gebeurt als
          een gesprek schuurt.
        </p>
        <div className={styles.introGrid}>
          {uitlegCards.map((card) => (
            <article className={styles.card} key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.colorLegend}>
          {colorOrder.map((color) => (
            <div
              className={styles.colorChip}
              key={color}
              style={colorStyle(color)}
            >
              <strong>{colors[color].name}</strong>
              <span>{colors[color].label}</span>
            </div>
          ))}
        </div>
        {christianLayer && (
          <FaithLayer
            intro="Kleurentaal is hier geen identiteit."
            prompts={[
              "Waar helpt jouw reactie onder spanning om liefde en waarheid vast te houden?",
              "Waar wordt jouw kleur juist een bescherming die de ander op afstand zet?",
              "Welke vrucht wil je oefenen: moed, geduld, zachtmoedigheid, trouw of zelfbeheersing?",
            ]}
            title="Christelijke laag"
          />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() =>
            dispatch({ type: "kleurkompas.intro.seen", actorId: installationId })
          }
          type="button"
        >
          Start de casussen
        </button>
      </Scene>
    );
  }

  if (!ownAnswers) {
    const complete = scenarios.every((scenario) => answers[scenario.id]);
    return (
      <Scene step={2}>
        <span className={styles.kicker}>Stap 1 — casussen</span>
        <h1>Kies wat jij waarschijnlijk doet</h1>
        <p className={styles.lead}>
          Kies niet wat het mooiste klinkt, maar wat jou het meest automatisch
          overkomt. Je mag straks nuanceren; eerst verzamelen we patroon.
        </p>
        <div className={styles.scenarioList}>
          {scenarios.map((scenario, index) => (
            <article className={styles.scenario} key={scenario.id}>
              <div className={styles.scenarioHeader}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{scenario.situation}</p>
              </div>
              <div className={styles.answers}>
                {scenario.answers.map((answer) => (
                  <button
                    data-selected={answers[scenario.id] === answer.color}
                    key={answer.color}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [scenario.id]: answer.color,
                      }))
                    }
                    style={colorStyle(answer.color)}
                    type="button"
                  >
                    <b>{colors[answer.color].name}</b>
                    {answer.text}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        <button
          className={styles.primary}
          disabled={pending || !complete}
          onClick={() =>
            dispatch({
              type: "kleurkompas.scenarios.submitted",
              actorId: installationId,
              answers,
            })
          }
          type="button"
        >
          Bewaar mijn kleurspoor
        </button>
      </Scene>
    );
  }

  if (!bothAnswers) {
    return <Waiting partnerName={partnerName} step={2} />;
  }

  if (!ownStress) {
    const complete = stressBehaviors.every(
      (behavior) => ratings[behavior.id] !== undefined,
    );
    return (
      <Scene step={3}>
        <span className={styles.kicker}>Stap 2 — stresskleur</span>
        <h1>Wat gebeurt er als het oploopt?</h1>
        <p className={styles.lead}>
          Je gewone kleur en je stresskleur kunnen verschillen. Geef per zin
          aan hoe herkenbaar dit voor jou is wanneer spanning, schaamte of druk
          toeneemt.
        </p>
        <ProfileCard
          answers={ownAnswers}
          stressRatings={{}}
          title="Je voorlopige spoor"
        />
        <div className={styles.stressList}>
          {stressBehaviors.map((behavior) => (
            <div className={styles.rating} key={behavior.id}>
              <p>{behavior.text}</p>
              <div>
                {[0, 1, 2].map((value) => (
                  <button
                    data-selected={ratings[behavior.id] === value}
                    key={value}
                    onClick={() =>
                      setRatings((current) => ({
                        ...current,
                        [behavior.id]: value,
                      }))
                    }
                    type="button"
                  >
                    {value === 0 ? "Nee" : value === 1 ? "Soms" : "Vaak"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className={styles.primary}
          disabled={pending || !complete}
          onClick={() =>
            dispatch({
              type: "kleurkompas.stress.submitted",
              actorId: installationId,
              ratings,
            })
          }
          type="button"
        >
          Bekijk mijn stresskleur
        </button>
      </Scene>
    );
  }

  if (!bothStress) {
    return <Waiting partnerName={partnerName} step={3} />;
  }

  const partnerAnswersReady = partnerAnswers ?? {};
  const partnerStressReady = partnerStress ?? {};

  if (!ownExercise) {
    return (
      <Scene step={4}>
        <span className={styles.kicker}>Stap 3 — samen lezen</span>
        <h1>Jullie kleurendans</h1>
        <p className={styles.lead}>
          Nu wordt het interessant: niet “wie ben jij?”, maar wat gebeurt er
          tussen jullie wanneer twee reacties elkaar raken?
        </p>
        <div className={styles.comparison}>
          <ProfileCard
            answers={ownAnswers}
            stressRatings={ownStress}
            title="Jij"
          />
          <ProfileCard
            answers={partnerAnswersReady}
            stressRatings={partnerStressReady}
            title={partnerName}
          />
        </div>
        {combo && (
          <article className={styles.comboCard}>
            <span className={styles.kicker}>Jullie combinatie</span>
            <h2>{combo.title}</h2>
            <p>
              <strong>Sterk:</strong> {combo.strength}
            </p>
            <p>
              <strong>Spanning:</strong> {combo.tension}
            </p>
            <p>
              <strong>Oefening:</strong> {combo.exercise}
            </p>
            <p>
              <strong>Vraag:</strong> {combo.question}
            </p>
          </article>
        )}
        <div className={styles.exerciseGrid}>
          <article className={styles.card}>
            <h2>Kies een zin die snel verkeerd kan landen</h2>
            <div className={styles.phraseList}>
              {translatePhrases.map((phrase) => (
                <button
                  className={styles.phraseButton}
                  data-selected={phraseId === phrase.id}
                  key={phrase.id}
                  onClick={() => setPhraseId(phrase.id)}
                  type="button"
                >
                  <span className={styles.kicker}>{phrase.theme}</span>
                  {phrase.original}
                </button>
              ))}
            </div>
          </article>
          {selectedPhrase && (
            <article className={styles.card}>
              <h2>Door welke kleur wil je hem oefenen?</h2>
              <div className={styles.colorLegend}>
                {colorOrder.map((color) => (
                  <button
                    className={styles.colorChip}
                    data-selected={chosenColor === color}
                    key={color}
                    onClick={() => setChosenColor(color)}
                    style={colorStyle(color)}
                    type="button"
                  >
                    <strong>{colors[color].name}</strong>
                    <span>{colors[color].label}</span>
                  </button>
                ))}
              </div>
              <p>
                <strong>Kan klinken als:</strong>{" "}
                {selectedPhrase.hears[chosenColor]}
              </p>
              <p>
                <strong>Zachter alternatief:</strong>{" "}
                {selectedPhrase.better[chosenColor]}
              </p>
            </article>
          )}
        </div>
        <label>
          <span className={styles.kicker}>Jouw eigen betere zin</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setOwnReframe(event.target.value)}
            placeholder="Schrijf hoe jij dit eerlijker, zachter of concreter zou kunnen zeggen."
            value={ownReframe}
          />
        </label>
        <label>
          <span className={styles.kicker}>Wat denk jij dat je partner hierin nodig heeft?</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setPartnerNeedGuess(event.target.value)}
            placeholder="Bijvoorbeeld: meer rust, meer directheid, eerst waardering, meer uitleg, minder druk..."
            value={partnerNeedGuess}
          />
        </label>
        <button
          className={styles.primary}
          disabled={pending || !exerciseComplete}
          onClick={() =>
            dispatch({
              type: "kleurkompas.exercise.submitted",
              actorId: installationId,
              exercise: {
                phraseId,
                chosenColor,
                ownReframe: ownReframe.trim(),
                partnerNeedGuess: partnerNeedGuess.trim(),
              } satisfies KleurkompasExercise,
            })
          }
          type="button"
        >
          Bewaar mijn oefening
        </button>
      </Scene>
    );
  }

  if (!bothExercises) {
    return <Waiting partnerName={partnerName} step={4} />;
  }

  if (!ownDeepening) {
    return (
      <Scene step={5}>
        <span className={styles.kicker}>Stap 4 — verdieping</span>
        <h1>Wat zit eronder?</h1>
        <p className={styles.lead}>
          Dit is de laag die Kleurkompas meer maakt dan een test. Kies één
          vraag die schuurt, onderzoek één zin die anders kan landen, en maak
          één kleine groeiafspraak.
        </p>
        <div className={styles.exerciseGrid}>
          <article className={styles.card}>
            <span className={styles.kicker}>
	              Jouw {colorAdjectives[ownProfile.primary]} onderlaag
            </span>
            <h2>Kies een vraag die je niet te snel wilt overslaan</h2>
            <div className={styles.phraseList}>
              {ownDeeperQuestions.map((question) => (
                <button
                  className={styles.phraseButton}
                  data-selected={ownQuestion === question}
                  key={question}
                  onClick={() => setOwnQuestion(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
            <textarea
              className={styles.textarea}
              onChange={(event) => setOwnAnswer(event.target.value)}
              placeholder="Antwoord eerlijk, niet perfect. Eén concreet voorbeeld is genoeg."
              value={ownAnswer}
            />
          </article>
          <article className={styles.card}>
            <span className={styles.kicker}>Wat hoort de ander?</span>
            <h2>Kies een zin die bij jullie makkelijk misgaat</h2>
            <div className={styles.phraseList}>
              {heardWrongCards.map((card) => (
                <button
                  className={styles.phraseButton}
                  data-selected={heardWrongCardId === card.id}
                  key={card.id}
                  onClick={() => setHeardWrongCardId(card.id)}
                  type="button"
                >
                  <span className={styles.kicker}>Onderliggend: {card.hiddenNeed}</span>
                  {card.phrase}
                </button>
              ))}
            </div>
            {selectedHeardWrong && (
              <div className={styles.comboGrid}>
                {colorOrder.map((color) => (
                  <div className={styles.miniColor} key={color} style={colorStyle(color)}>
                    <strong>{colors[color].name}</strong>
                    <span>{selectedHeardWrong.hears[color]}</span>
                  </div>
                ))}
              </div>
            )}
            <textarea
              className={styles.textarea}
              onChange={(event) => setHeardWrongReflection(event.target.value)}
              placeholder="Wat wil jij onthouden over hoe deze zin bij je partner kan landen?"
              value={heardWrongReflection}
            />
          </article>
        </div>
        <article className={styles.comboCard}>
          <span className={styles.kicker}>Kleine groeikaart</span>
          <h2>Kies één oefening die jullie echt kunnen doen</h2>
          <div className={styles.phraseList}>
            {(currentGrowthCards.length ? currentGrowthCards : [combo?.exercise ?? "Vat eerst samen voordat je reageert."]).map((card) => (
              <button
                className={styles.phraseButton}
                data-selected={growthCard === card}
                key={card}
                onClick={() => setGrowthCard(card)}
                type="button"
              >
                {card}
              </button>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            onChange={(event) => setMiniAgreement(event.target.value)}
            placeholder="Maak hem concreet: wanneer, hoe klein, en wat doen jullie als het misgaat?"
            value={miniAgreement}
          />
        </article>
        {christianLayer && (
          <FaithLayer
            prompts={[
              "Welke bescherming mag zachter worden zonder dat je jezelf kwijtraakt?",
              "Waar vraagt dit om belijden, vergeven, geduld oefenen of waarheid spreken in liefde?",
              "Welke kleine gewoonte helpt jullie om vrede niet te verwarren met vermijden?",
            ]}
            title="Christelijke laag"
          />
        )}
        <button
          className={styles.primary}
          disabled={pending || !deepeningComplete}
          onClick={() =>
            dispatch({
              type: "kleurkompas.deepening.submitted",
              actorId: installationId,
                deepening: deepeningPayload,
            })
          }
          type="button"
        >
          Bewaar verdieping
        </button>
      </Scene>
    );
  }

  if (!bothDeepenings) {
    return <Waiting partnerName={partnerName} step={5} />;
  }

  return (
    <Scene step={6}>
      <span className={styles.kicker}>Opgeslagen voor jullie profiel</span>
      <h1>Jullie kleurkompas ligt klaar</h1>
      <p className={styles.lead}>
        Jullie hebben niet alleen kleuren gevonden, maar ook gekeken naar
        stress, misverstanden, onderliggende behoeften en één concrete
        groeiafspraak. Dat is profielmateriaal waar latere AI echt iets mee kan.
      </p>
      <div className={styles.comparison}>
        <ProfileCard answers={ownAnswers} stressRatings={ownStress} title="Jij" />
        <ProfileCard
          answers={partnerAnswersReady}
          stressRatings={partnerStressReady}
          title={partnerName}
        />
      </div>
      {combo && (
        <article className={styles.comboCard}>
          <span className={styles.kicker}>Gespreksvraag</span>
          <h2>{combo.question}</h2>
          <p>{combo.exercise}</p>
        </article>
      )}
      <div className={styles.comparison}>
        <article className={styles.card}>
          <span className={styles.kicker}>Jouw verdieping</span>
          <h2>{ownDeepening.ownQuestion}</h2>
          <p>{ownDeepening.ownAnswer}</p>
          <p>
            <strong>Groeiafspraak:</strong> {ownDeepening.miniAgreement}
          </p>
        </article>
        <article className={styles.card}>
          <span className={styles.kicker}>{partnerName}</span>
          <h2>{partnerDeepening?.ownQuestion ?? "Verdieping"}</h2>
          <p>{partnerDeepening?.ownAnswer ?? "Nog niet zichtbaar."}</p>
          <p>
            <strong>Groeiafspraak:</strong>{" "}
            {partnerDeepening?.miniAgreement ?? "Nog niet zichtbaar."}
          </p>
        </article>
      </div>
      {christianLayer && (
        <FaithLayer
          prompts={[
            "Welke reactie helpt jullie om waarheid én liefde vast te houden?",
            "Waar vraagt deze combinatie om moed, geduld, vergeving of zachtheid?",
            "Welke kleine herstelzin past bij jullie als spanning oploopt?",
          ]}
          title="Christelijke laag"
        />
      )}
      <button
        className={styles.primary}
        disabled={pending}
        onClick={() =>
          dispatch({
            type: "kleurkompas.game.completed",
            actorId: installationId,
          })
        }
        type="button"
      >
        Terug naar kaart
      </button>
    </Scene>
  );
}
