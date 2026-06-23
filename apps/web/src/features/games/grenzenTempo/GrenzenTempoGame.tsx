import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  BoundaryLevel,
  GrenzenTempoAction,
  GrenzenTempoState,
  SmallNoResponse,
  TempoLevel,
} from "./contracts";
import {
  boundaryLevels,
  boundaryPhrases,
  boundaryScenarios,
  christianPrompts,
  optionLabel,
  responseOptions,
  smallNoScenarios,
  supportOptions,
  tempoAreas,
  tempoLevels,
} from "./content";
import { FaithLayer } from "../FaithLayer";
import styles from "./GrenzenTempoGame.module.css";

const boundaryRank: Record<BoundaryLevel, number> = {
  fine: 0,
  "ask-first": 1,
  later: 2,
  "not-okay": 3,
};

const tempoRank: Record<TempoLevel, number> = {
  slow: 0,
  calm: 1,
  average: 2,
  fast: 3,
};

function Scene({
  children,
  round,
  stage,
}: {
  children: ReactNode;
  round: 1 | 2 | 3;
  stage: string;
}) {
  const sceneRef = useRef<HTMLElement>(null);
  useEffect(() => {
    sceneRef.current?.scrollTo({ top: 0 });
  }, [stage]);

  return (
    <section className={styles.game} ref={sceneRef}>
      <div className={styles.forestEdge} aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={styles.panel}>
        <div className={styles.progress} aria-label={`Ronde ${round} van 3`}>
          {[1, 2, 3].map((step) => (
            <span data-active={step <= round} key={step}>
              {step}
            </span>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function Waiting({
  partnerName,
  round,
}: {
  partnerName: string;
  round: 1 | 2 | 3;
}) {
  return (
    <Scene round={round} stage={`waiting-${round}`}>
      <span className={styles.kicker}>Even ruimte laten</span>
      <h1>{partnerName} kiest nog</h1>
      <p className={styles.lead}>
        Jouw antwoorden staan veilig klaar. De vergelijking verschijnt zodra
        jullie allebei klaar zijn.
      </p>
      <div className={styles.waitingLine}>
        <span />
      </div>
    </Scene>
  );
}

function ConversationActions({
  chatText,
  openCall,
  openChat,
}: {
  chatText: string;
  openCall: (() => void) | undefined;
  openChat: ((text?: string) => void) | undefined;
}) {
  return (
    <div className={styles.conversationActions}>
      <button onClick={() => openChat?.(chatText)} type="button">
        Bespreek in chat
      </button>
      <button onClick={() => openCall?.()} type="button">
        Bespreek via bellen
      </button>
    </div>
  );
}

export function GrenzenTempoGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  state,
}: GameComponentProps<GrenzenTempoState, GrenzenTempoAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const ownBoundaries = state.boundaryAnswers[installationId];
  const partnerBoundaries = state.boundaryAnswers[partnerId];
  const ownTempo = state.tempoAnswers[installationId];
  const partnerTempo = state.tempoAnswers[partnerId];
  const ownNo = state.smallNos[installationId];
  const partnerNo = state.smallNos[partnerId];
  const ownResponse = state.smallNoResponses[installationId];
  const partnerResponse = state.smallNoResponses[partnerId];
  const bothBoundaries = memberIds.every((id) =>
    Boolean(state.boundaryAnswers[id]),
  );
  const bothBoundaryTalks = memberIds.every((id) =>
    state.boundaryDiscussedIds.includes(id),
  );
  const bothTempo = memberIds.every((id) => Boolean(state.tempoAnswers[id]));
  const bothTempoTalks = memberIds.every((id) =>
    state.tempoDiscussedIds.includes(id),
  );
  const bothNos = memberIds.every((id) => Boolean(state.smallNos[id]));
  const bothResponses = memberIds.every((id) =>
    Boolean(state.smallNoResponses[id]),
  );

  const [boundaryDraft, setBoundaryDraft] = useState<
    Record<string, BoundaryLevel>
  >({});
  const [tempoDraft, setTempoDraft] = useState<Record<string, TempoLevel>>({});
  const [scenario, setScenario] = useState("");
  const [phrase, setPhrase] = useState("");
  const [response, setResponse] = useState<
    Partial<SmallNoResponse>
  >({});

  const boundaryDifferences = useMemo(() => {
    if (!ownBoundaries || !partnerBoundaries) return [];
    return boundaryScenarios
      .map((item) => ({
        ...item,
        own: ownBoundaries[item.id],
        partner: partnerBoundaries[item.id],
        distance: Math.abs(
          boundaryRank[ownBoundaries[item.id] ?? "fine"] -
            boundaryRank[partnerBoundaries[item.id] ?? "fine"],
        ),
      }))
      .filter((item) => item.own && item.partner)
      .sort((a, b) => b.distance - a.distance);
  }, [ownBoundaries, partnerBoundaries]);

  const tempoDifferences = useMemo(() => {
    if (!ownTempo || !partnerTempo) return [];
    return tempoAreas
      .map((area) => ({
        ...area,
        own: ownTempo[area.id],
        partner: partnerTempo[area.id],
        distance: Math.abs(
          tempoRank[ownTempo[area.id] ?? "calm"] -
            tempoRank[partnerTempo[area.id] ?? "calm"],
        ),
      }))
      .filter((area) => area.own && area.partner && area.distance > 0)
      .sort((a, b) => b.distance - a.distance);
  }, [ownTempo, partnerTempo]);

  if (!ownBoundaries) {
    const complete = boundaryScenarios.every(
      (item) => boundaryDraft[item.id],
    );
    return (
      <Scene round={1} stage="boundaries-input">
        <span className={styles.kicker}>Grenzen & tempo</span>
        <h1>Waar begint jouw ruimte?</h1>
        <p className={styles.lead}>
          Nabijheid is niet alleen een kwestie van wel of niet. Soms is iets
          fijn, soms wil je eerst een vraag, meer tijd of een duidelijke grens.
          Kies apart wat nu bij jou past.
        </p>
        <div className={styles.scenarioList}>
          {boundaryScenarios.map((item, index) => (
            <article className={styles.scenario} key={item.id}>
              <div className={styles.scenarioText}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item.text}</p>
              </div>
              <div className={styles.segmented}>
                {boundaryLevels.map((level) => (
                  <button
                    data-selected={boundaryDraft[item.id] === level.id}
                    key={level.id}
                    onClick={() =>
                      setBoundaryDraft((current) => ({
                        ...current,
                        [item.id]: level.id,
                      }))
                    }
                    type="button"
                  >
                    {level.label}
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
              type: "grenzen-tempo.boundaries.submitted",
              actorId: installationId,
              answers: boundaryDraft,
            })
          }
          type="button"
        >
          Leg mijn grenslijn neer
        </button>
      </Scene>
    );
  }

  if (!bothBoundaries) {
    return <Waiting partnerName={partnerName} round={1} />;
  }

  if (!bothBoundaryTalks) {
    const highlights =
      boundaryDifferences.filter((item) => item.distance > 0).slice(0, 4);
    const visible = highlights.length > 0 ? highlights : boundaryDifferences.slice(0, 3);
    const chatText = [
      "Grenzen & tempo - onze grenslijn",
      ...visible.map(
        (item) =>
          `${item.text} Ik: ${optionLabel(boundaryLevels, item.own)}. ${partnerName}: ${optionLabel(boundaryLevels, item.partner)}.`,
      ),
      "Wat maakt dit voor ieder van ons veilig? Wat willen we vooraf vragen?",
    ].join("\n");
    return (
      <Scene round={1} stage="boundaries-compare">
        <span className={styles.kicker}>Jullie grenslijnen</span>
        <h1>Verschil is informatie</h1>
        <p className={styles.lead}>
          Niet één antwoord is de norm. Kijk vooral waar afstemmen belangrijk
          wordt voordat iemand dichterbij komt.
        </p>
        <div className={styles.comparisonList}>
          {visible.map((item) => (
            <article key={item.id}>
              <p>{item.text}</p>
              <div>
                <span>
                  Jij
                  <strong>{optionLabel(boundaryLevels, item.own)}</strong>
                </span>
                <i />
                <span>
                  {partnerName}
                  <strong>{optionLabel(boundaryLevels, item.partner)}</strong>
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.prompt}>
          <strong>Bespreek samen</strong>
          <p>Wat maakt dit veilig of onveilig?</p>
          <p>Wat wil je dat de ander eerst vraagt?</p>
        </div>
        <ConversationActions
          chatText={chatText}
          openCall={openCall}
          openChat={openChat}
        />
        {!state.boundaryDiscussedIds.includes(installationId) ? (
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "grenzen-tempo.boundaries.discussed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Wij hebben dit afgestemd
          </button>
        ) : (
          <div className={styles.softWaiting}>
            Wachten tot {partnerName} ook klaar is.
          </div>
        )}
      </Scene>
    );
  }

  if (!ownTempo) {
    const complete = tempoAreas.every((area) => tempoDraft[area.id]);
    return (
      <Scene round={2} stage="tempo-input">
        <span className={styles.kicker}>Ronde 2 · Tempo</span>
        <h1>Hoe snel voelt goed?</h1>
        <p className={styles.lead}>
          Een grens zegt waar je ruimte nodig hebt. Tempo zegt hoe je daar
          samen naartoe beweegt. Kies per gebied wat voor jou natuurlijk voelt.
        </p>
        <div className={styles.tempoGrid}>
          {tempoAreas.map((area) => (
            <article key={area.id}>
              <h2>{area.label}</h2>
              <div className={styles.tempoTrack}>
                {tempoLevels.map((level) => (
                  <button
                    data-selected={tempoDraft[area.id] === level.id}
                    key={level.id}
                    onClick={() =>
                      setTempoDraft((current) => ({
                        ...current,
                        [area.id]: level.id,
                      }))
                    }
                    type="button"
                  >
                    <i />
                    <span>{level.label}</span>
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
              type: "grenzen-tempo.tempo.submitted",
              actorId: installationId,
              answers: tempoDraft,
            })
          }
          type="button"
        >
          Bewaar mijn tempo
        </button>
      </Scene>
    );
  }

  if (!bothTempo) {
    return <Waiting partnerName={partnerName} round={2} />;
  }

  if (!bothTempoTalks) {
    const visible = tempoDifferences.slice(0, 4);
    const chatText =
      visible.length > 0
        ? [
            "Grenzen & tempo - waar ons tempo verschilt",
            ...visible.map(
              (area) =>
                `${area.label}: ik ${optionLabel(tempoLevels, area.own)}, ${partnerName} ${optionLabel(tempoLevels, area.partner)}.`,
            ),
            "Wat hebben we nodig om geen van beiden te haasten?",
          ].join("\n")
        : "Grenzen & tempo: ons tempo ligt dicht bij elkaar. Waar willen we toch bewust blijven afstemmen?";
    return (
      <Scene round={2} stage="tempo-compare">
        <span className={styles.kicker}>Jullie ritme</span>
        <h1>
          {visible.length > 0
            ? "Hier lopen jullie niet gelijk"
            : "Jullie tempo ligt dicht bij elkaar"}
        </h1>
        <p className={styles.lead}>
          Verschillend tempo betekent niet dat iemand te snel of te langzaam
          is. De vraag is hoe jullie bewegen zonder dat één van beiden zichzelf
          voorbijloopt.
        </p>
        {visible.length > 0 ? (
          <div className={styles.tempoComparison}>
            {visible.map((area) => (
              <article key={area.id}>
                <h2>{area.label}</h2>
                <div>
                  <span>
                    Jij
                    <strong>{optionLabel(tempoLevels, area.own)}</strong>
                  </span>
                  <span>
                    {partnerName}
                    <strong>{optionLabel(tempoLevels, area.partner)}</strong>
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.aligned}>
            De meeste keuzes liggen naast elkaar. Blijf vragen; hetzelfde tempo
            vandaag is geen automatische toestemming voor morgen.
          </div>
        )}
        <div className={styles.prompt}>
          <strong>Bespreek samen</strong>
          <p>Waar wil jij dat de ander jou laat leiden?</p>
          <p>Hoe merk je dat iets sneller gaat dan goed voelt?</p>
        </div>
        <ConversationActions
          chatText={chatText}
          openCall={openCall}
          openChat={openChat}
        />
        {!state.tempoDiscussedIds.includes(installationId) ? (
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "grenzen-tempo.tempo.discussed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Ons tempo is besproken
          </button>
        ) : (
          <div className={styles.softWaiting}>
            Wachten tot {partnerName} ook klaar is.
          </div>
        )}
      </Scene>
    );
  }

  if (!ownNo) {
    return (
      <Scene round={3} stage="small-no-input">
        <span className={styles.kicker}>Ronde 3 · De kleine nee</span>
        <h1>Een grens die niet breekt</h1>
        <p className={styles.lead}>
          Kies één kleine uitnodiging en geef daarop een vriendelijke,
          duidelijke nee. {partnerName} krijgt jouw antwoord straks precies zo
          te zien.
        </p>
        <div className={styles.noBuilder}>
          <div>
            <h2>Kies een uitnodiging</h2>
            {smallNoScenarios.map((item) => (
              <button
                data-selected={scenario === item}
                key={item}
                onClick={() => setScenario(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <div>
            <h2>Kies jouw begrenzing</h2>
            {boundaryPhrases.map((item) => (
              <button
                data-selected={phrase === item}
                key={item}
                onClick={() => setPhrase(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button
          className={styles.primary}
          disabled={pending || !scenario || !phrase}
          onClick={() =>
            dispatch({
              type: "grenzen-tempo.small-no.submitted",
              actorId: installationId,
              exercise: { scenario, phrase },
            })
          }
          type="button"
        >
          Geef mijn kleine nee
        </button>
      </Scene>
    );
  }

  if (!bothNos) {
    return <Waiting partnerName={partnerName} round={3} />;
  }

  if (!ownResponse && partnerNo) {
    return (
      <Scene round={3} stage="small-no-response">
        <span className={styles.kicker}>Ontvang de grens</span>
        <h1>Wat doe jij met een nee?</h1>
        <div className={styles.dialogue}>
          <p>{partnerNo.scenario}</p>
          <strong>{partnerName}: “{partnerNo.phrase}”</strong>
        </div>
        <p className={styles.lead}>
          Kies eerlijk je eerste reactie. Daarna zie je welk effect die reactie
          kan hebben; dit gaat niet om slagen, maar om leren herkennen.
        </p>
        <div className={styles.responseGrid}>
          {responseOptions.map((item) => (
            <button
              data-selected={response.responseId === item.id}
              key={item.id}
              onClick={() =>
                setResponse((current) => ({
                  ...current,
                  responseId: item.id,
                }))
              }
              type="button"
            >
              <strong>{item.label}</strong>
              {response.responseId === item.id && <small>{item.tone}</small>}
            </button>
          ))}
        </div>
        <div className={styles.support}>
          <h2>Wat helpt jou wanneer jij zelf nee zegt?</h2>
          <div>
            {supportOptions.map((item) => (
              <button
                data-selected={response.supportId === item.id}
                key={item.id}
                onClick={() =>
                  setResponse((current) => ({
                    ...current,
                    supportId: item.id,
                  }))
                }
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <button
          className={styles.primary}
          disabled={
            pending || !response.responseId || !response.supportId
          }
          onClick={() =>
            dispatch({
              type: "grenzen-tempo.small-no.responded",
              actorId: installationId,
              response: response as SmallNoResponse,
            })
          }
          type="button"
        >
          Leg mijn reactie ernaast
        </button>
      </Scene>
    );
  }

  if (!bothResponses) {
    return <Waiting partnerName={partnerName} round={3} />;
  }

  const partnerResponseLabel = partnerResponse
    ? optionLabel(responseOptions, partnerResponse.responseId)
    : "";
  const ownSupportLabel = ownResponse
    ? optionLabel(supportOptions, ownResponse.supportId)
    : "";
  const closingChat = [
    "Grenzen & tempo - wat we willen onthouden",
    `Mijn kleine nee: ${ownNo.phrase}`,
    `${partnerName} reageerde: ${partnerResponseLabel}`,
    `Wat mij helpt bij een nee: ${ownSupportLabel}`,
    "Hoe zorgen we dat een nee tussen ons veilig en warm kan blijven?",
  ].join("\n");

  return (
    <Scene round={3} stage="summary">
      <span className={styles.kicker}>Ruimte en richting</span>
      <h1>Dichterbij, zonder jezelf te verliezen</h1>
      <p className={styles.lead}>
        Jullie grenslijnen, tempo’s en reacties zijn bewaard. Niet als oordeel,
        maar als gebruiksaanwijzing voor zorgvuldige nabijheid.
      </p>
      <div className={styles.finalGrid}>
        <article>
          <span>Jouw kleine nee</span>
          <strong>“{ownNo.phrase}”</strong>
        </article>
        <article>
          <span>{partnerName} antwoordde</span>
          <strong>“{partnerResponseLabel}”</strong>
        </article>
        <article>
          <span>Wat jou helpt</span>
          <strong>{ownSupportLabel}</strong>
        </article>
      </div>
      <div className={styles.prompt}>
        <strong>Neem één zin mee</strong>
        <p>
          Een grens is geen afstand van de ander. Het is informatie over hoe je
          veilig dichterbij kunt komen.
        </p>
      </div>
      <ConversationActions
        chatText={closingChat}
        openCall={openCall}
        openChat={openChat}
      />
      {christianLayer && (
        <FaithLayer
          intro="Voor wie gelooft, raken grenzen en tempo ook aan reinheid, trouw en wachten."
          prompts={[...christianPrompts]}
        />
      )}
      <button
        className={styles.primary}
        disabled={pending}
        onClick={() =>
          dispatch({
            type: "grenzen-tempo.game.completed",
            actorId: installationId,
          })
        }
        type="button"
      >
        Terug naar kaart 2
      </button>
    </Scene>
  );
}
