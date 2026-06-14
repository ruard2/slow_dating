import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  VrolijkeOpenPlekAction,
  VrolijkeOpenPlekState,
} from "./contracts";
import {
  bluffPrompts,
  conversationQuestions,
  isYouTubeUrl,
  missions,
  reflectionOptionsByMission,
  setbackOptions,
  type MissionId,
} from "./content";
import {
  availableCommonMissions,
  selectedMission,
  tictactoeWinner,
} from "./reducer";
import styles from "./VrolijkeOpenPlekGame.module.css";

function Waiting({ partnerName, text }: { partnerName: string; text?: string }) {
  return (
    <div className={styles.waiting}>
      <div className={styles.fire}><i /><i /><i /></div>
      <h2>Even aan het vuur</h2>
      <p>{text ?? `${partnerName} maakt het eigen deel af.`}</p>
    </div>
  );
}

function MissionHeader({ id }: { id: MissionId }) {
  const mission = missions.find((item) => item.id === id)!;
  return (
    <>
      <span className={styles.kicker}>Jullie gezamenlijke keuze</span>
      <div className={styles.missionTitle}>
        <b>{mission.icon}</b>
        <div><h1>{mission.title}</h1><p>{mission.summary}</p></div>
      </div>
    </>
  );
}

export function VrolijkeOpenPlekGame({
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  state,
}: GameComponentProps<VrolijkeOpenPlekState, VrolijkeOpenPlekAction>) {
  const existingChoices = state.missionChoices[installationId] ?? [];
  const [choices, setChoices] = useState<MissionId[]>(existingChoices);
  const [videoUrl, setVideoUrl] = useState(state.videoUrl);
  const [bluffPrompt, setBluffPrompt] = useState(bluffPrompts[0]);
  const [claim, setClaim] = useState("");
  const [truthful, setTruthful] = useState(true);
  const [lighter, setLighter] = useState(4);
  const [relief, setRelief] = useState<"absurdity" | "challenge" | "together" | "seen">("together");
  const [pressure, setPressure] = useState<"laugh" | "focus" | "tease" | "withdraw">("laugh");
  const [support, setSupport] = useState<"join" | "space" | "cheer" | "soften">("join");
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const mission = selectedMission(state, memberIds);
  const allChoices = memberIds.every((id) => Boolean(state.missionChoices[id]));
  const ownReady = state.missionReadyIds.includes(installationId);
  const allReady = memberIds.every((id) => state.missionReadyIds.includes(id));
  const ownReflection = state.reflections[installationId];
  const allReflected = memberIds.every((id) => Boolean(state.reflections[id]));
  const ownConversationDone = state.conversationDoneIds.includes(installationId);
  const allConversationDone = memberIds.every((id) =>
    state.conversationDoneIds.includes(id),
  );
  const remainingCommonMissions = availableCommonMissions(
    state,
    memberIds,
  ).filter((id) => id !== mission);
  const otherUnplayedMissions = missions.filter(
    ({ id }) =>
      id !== mission &&
      !state.completedMissionIds.includes(id) &&
      !remainingCommonMissions.includes(id),
  );
  const reflectionMission =
    state.completedMissionIds.at(-1) ?? mission ?? "tictactoe";
  const reflectionOptions = reflectionOptionsByMission[reflectionMission];

  function toggleMission(id: MissionId) {
    setChoices((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : [current[1]!, current[2]!, id],
    );
  }

  if (!state.missionChoices[installationId]) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Vrolijke Open Plek</span>
          <h1>Waar krijgen jullie lucht van?</h1>
          <p className={styles.lead}>
            Kies ieder drie vormen van spelen. Jullie overlap wordt de opdracht.
            Zo hoeven jullie niet te onderhandelen en ontdekken jullie meteen
            welke lichtheid van jullie samen is.
          </p>
          <div className={styles.missionGrid}>
            {missions.map((item) => (
              <button
                data-selected={choices.includes(item.id)}
                key={item.id}
                onClick={() => toggleMission(item.id)}
                type="button"
              >
                <b>{item.icon}</b>
                <span><strong>{item.title}</strong><small>{item.summary}</small></span>
                <em>{item.traits.join(" · ")}</em>
              </button>
            ))}
          </div>
          <div className={styles.choiceFooter}>
            <span>{choices.length} van 3 gekozen</span>
            <button
              className={styles.primary}
              disabled={pending || choices.length !== 3}
              onClick={() =>
                dispatch({
                  type: "vrolijke-open-plek.missions.chosen",
                  actorId: installationId,
                  missions: choices,
                })
              }
              type="button"
            >
              Ontdek onze overlap
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!allChoices || !mission) {
    return <section className={styles.game}><div className={styles.panel}><Waiting partnerName={partnerName} /></div></section>;
  }

  const winner = tictactoeWinner(state);
  const myTurn =
    memberIds[state.tictactoeTurn % memberIds.length] === installationId;
  const bothClaims = memberIds.every((id) => Boolean(state.bluffClaims[id]));
  const ownGuess = state.bluffGuesses[installationId];
  const bothDuel = memberIds.every((id) => Boolean(state.duelChoices[id]));
  const bothSetback = memberIds.every((id) => Boolean(state.setbackChoices[id]));
  const duelLabels = {
    rock: "steen",
    paper: "papier",
    scissors: "schaar",
  } as const;
  const ownDuel = state.duelChoices[installationId];
  const partnerDuel = state.duelChoices[partnerId];
  const duelResult =
    ownDuel && partnerDuel
      ? ownDuel === partnerDuel
        ? "Gelijkspel"
        : (ownDuel === "rock" && partnerDuel === "scissors") ||
            (ownDuel === "paper" && partnerDuel === "rock") ||
            (ownDuel === "scissors" && partnerDuel === "paper")
          ? "Jij wint deze ronde"
          : `${partnerName} wint deze ronde`
      : "";

  if (!state.missionsFinished && !allReady) {
    if (ownReady) {
      return <section className={styles.game}><div className={styles.panel}><Waiting partnerName={partnerName} text="Jouw speelronde is klaar. Zodra jullie allebei gereed zijn, kijken we wat dit over jullie zegt." /></div></section>;
    }
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <MissionHeader id={mission} />

          {mission === "video" && (
            <div className={styles.playArea}>
              <h2>Kies iets dat jou oprecht laat lachen</h2>
              <p>Plak een YouTube-link. Kijk samen, zonder ondertussen door te scrollen.</p>
              <input
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://www.youtube.com/..."
                value={videoUrl}
              />
              <button
                className={styles.secondary}
                disabled={!isYouTubeUrl(videoUrl)}
                onClick={() =>
                  dispatch({
                    type: "vrolijke-open-plek.video.set",
                    actorId: installationId,
                    url: videoUrl,
                  })
                }
                type="button"
              >
                Link voor ons klaarzetten
              </button>
              {state.videoUrl && (
                <a href={state.videoUrl} rel="noreferrer" target="_blank">
                  Open het filmpje samen ↗
                </a>
              )}
            </div>
          )}

          {mission === "tictactoe" && (
            <div className={styles.playArea}>
              <h2>
                {winner
                  ? winner === "draw"
                    ? "Gelijkspel"
                    : `${winner.toUpperCase()} wint`
                  : myTurn
                    ? "Jij bent aan de beurt"
                    : `${partnerName} is aan de beurt`}
              </h2>
              <div className={styles.board}>
                {state.tictactoeBoard.map((mark, index) => (
                  <button
                    aria-label={`Vak ${index + 1}${mark ? `: ${mark}` : ""}`}
                    disabled={Boolean(mark || winner || !myTurn)}
                    key={index}
                    onClick={() =>
                      dispatch({
                        type: "vrolijke-open-plek.tictactoe.moved",
                        actorId: installationId,
                        cell: index,
                      })
                    }
                    type="button"
                  >
                    {mark === "x" ? "×" : mark === "o" ? "○" : ""}
                  </button>
                ))}
              </div>
              <p className={styles.hint}>Kijk ook naar wat er gebeurt: vooruitdenken, plagen, fanatiek worden of juist ruimte geven.</p>
            </div>
          )}

          {mission === "bluff" && (
            <div className={styles.playArea}>
              {!state.bluffClaims[installationId] ? (
                <>
                  <h2>Maak je verhaal nét geloofwaardig genoeg</h2>
                  <select value={bluffPrompt} onChange={(event) => setBluffPrompt(event.target.value as typeof bluffPrompt)}>
                    {bluffPrompts.map((prompt) => <option key={prompt}>{prompt}</option>)}
                  </select>
                  <textarea value={claim} onChange={(event) => setClaim(event.target.value)} placeholder="Vertel in één of twee zinnen..." />
                  <div className={styles.segmented}>
                    <button data-selected={truthful} onClick={() => setTruthful(true)} type="button">Waar</button>
                    <button data-selected={!truthful} onClick={() => setTruthful(false)} type="button">Bluf</button>
                  </div>
                  <button
                    className={styles.secondary}
                    disabled={!claim.trim()}
                    onClick={() =>
                      dispatch({
                        type: "vrolijke-open-plek.bluff.submitted",
                        actorId: installationId,
                        prompt: bluffPrompt,
                        claim,
                        truthful,
                      })
                    }
                    type="button"
                  >
                    Leg mijn verhaal bij het vuur
                  </button>
                </>
              ) : !bothClaims ? (
                <Waiting partnerName={partnerName} />
              ) : ownGuess === undefined ? (
                <>
                  <h2>{partnerName} vertelt</h2>
                  <blockquote>{state.bluffClaims[partnerId]?.claim}</blockquote>
                  <div className={styles.segmented}>
                    <button onClick={() => dispatch({ type: "vrolijke-open-plek.bluff.guessed", actorId: installationId, truthful: true })} type="button">Dit is waar</button>
                    <button onClick={() => dispatch({ type: "vrolijke-open-plek.bluff.guessed", actorId: installationId, truthful: false })} type="button">Dit is bluf</button>
                  </div>
                </>
              ) : (
                <div className={styles.reveal}>
                  <strong>{ownGuess === state.bluffClaims[partnerId]?.truthful ? "Goed gezien." : "Mooi misleid."}</strong>
                  <p>Het verhaal was {state.bluffClaims[partnerId]?.truthful ? "waar" : "een bluf"}.</p>
                </div>
              )}
            </div>
          )}

          {mission === "duel" && (
            <div className={styles.playArea}>
              <h2>Kies zonder te overdenken</h2>
              {!state.duelChoices[installationId] ? (
                <div className={styles.gestures}>
                  {([["rock", "Steen", "●"], ["paper", "Papier", "▤"], ["scissors", "Schaar", "✂"]] as const).map(([choice, label, icon]) => (
                    <button key={choice} onClick={() => dispatch({ type: "vrolijke-open-plek.duel.chosen", actorId: installationId, choice })} type="button">
                      <b>{icon}</b><span>{label}</span>
                    </button>
                  ))}
                </div>
              ) : !bothDuel ? <Waiting partnerName={partnerName} /> : (
                <div className={styles.reveal}>
                  <strong>{duelResult}</strong>
                  <p>
                    Jij koos {duelLabels[ownDuel!]}, {partnerName} koos{" "}
                    {duelLabels[partnerDuel!]}. Belangrijker dan de winnaar:
                    wat deed je direct na de onthulling?
                  </p>
                </div>
              )}
            </div>
          )}

          {mission === "setback" && (
            <div className={styles.playArea}>
              <h2>De pion stond één vak voor de winst… en moet terug naar start</h2>
              <p>Wat helpt jou het snelst om niet in de ergernis te blijven hangen?</p>
              <div className={styles.responseGrid}>
                {setbackOptions.map((option) => (
                  <button
                    data-selected={state.setbackChoices[installationId] === option.id}
                    key={option.id}
                    onClick={() => dispatch({ type: "vrolijke-open-plek.setback.chosen", actorId: installationId, choice: option.id })}
                    type="button"
                  >
                    <strong>{option.label}</strong><small>{option.trait}</small>
                  </button>
                ))}
              </div>
              {bothSetback && (
                <div className={styles.reveal}>
                  <strong>Jullie herstelroute</strong>
                  <p>
                    Jij:{" "}
                    {setbackOptions.find(
                      ({ id }) => id === state.setbackChoices[installationId],
                    )?.label}
                    . {partnerName}:{" "}
                    {setbackOptions.find(
                      ({ id }) => id === state.setbackChoices[partnerId],
                    )?.label}
                    .
                  </p>
                  <p>Jullie hoeven tegenslag niet hetzelfde op te vangen. Dat verschil kennen voorkomt onnodige irritatie.</p>
                </div>
              )}
            </div>
          )}

          <button
            className={styles.primary}
            disabled={
              pending ||
              (mission === "video" && !state.videoUrl) ||
              (mission === "tictactoe" && !winner) ||
              (mission === "bluff" && ownGuess === undefined) ||
              (mission === "duel" && !bothDuel) ||
              (mission === "setback" && !bothSetback)
            }
            onClick={() => dispatch({ type: "vrolijke-open-plek.mission.ready", actorId: installationId })}
            type="button"
          >
            Verder
          </button>
        </div>
      </section>
    );
  }

  if (!state.missionsFinished && allReady) {
    const completedTitle = missions.find(({ id }) => id === mission)?.title;
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Opdracht afgerond</span>
          <h1>{completedTitle} zit erop</h1>
          <p className={styles.lead}>
            Willen jullie de open plek nog even houden, of is dit genoeg voor
            vandaag?
          </p>

          {remainingCommonMissions.length > 0 ? (
            <div className={styles.nextMissionBlock}>
              <h2>
                {remainingCommonMissions.length === 1
                  ? "Deze kozen jullie ook allebei"
                  : "Jullie andere gezamenlijke keuzes"}
              </h2>
              <p>
                Jullie kunnen de andere gezamenlijke keuzes nu ook spelen.
              </p>
              <div className={styles.nextMissionGrid}>
                {remainingCommonMissions.map((id) => {
                  const option = missions.find((item) => item.id === id)!;
                  return (
                    <button
                      disabled={pending}
                      key={id}
                      onClick={() =>
                        dispatch({
                          type: "vrolijke-open-plek.mission.next",
                          actorId: installationId,
                          missionId: id,
                        })
                      }
                      type="button"
                    >
                      <b>{option.icon}</b>
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.summary}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            otherUnplayedMissions.length > 0 && (
              <div className={styles.nextMissionBlock}>
                <h2>Nog eentje doen?</h2>
                <p>
                  Jullie hadden geen andere gezamenlijke keuze. Kies samen nog
                  één opdracht, of rond de open plek af.
                </p>
                <div className={styles.nextMissionGrid}>
                  {otherUnplayedMissions.map((option) => (
                    <button
                      disabled={pending}
                      key={option.id}
                      onClick={() =>
                        dispatch({
                          type: "vrolijke-open-plek.mission.next",
                          actorId: installationId,
                          missionId: option.id,
                        })
                      }
                      type="button"
                    >
                      <b>{option.icon}</b>
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.summary}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "vrolijke-open-plek.mission.next",
                actorId: installationId,
                missionId: null,
              })
            }
            type="button"
          >
            Naar de afronding
          </button>
        </div>
      </section>
    );
  }

  if (!allReflected) {
    if (ownReflection) {
      return <section className={styles.game}><div className={styles.panel}><Waiting partnerName={partnerName} /></div></section>;
    }
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Wat werkte voor jou?</span>
          <h1>Van lachen naar begrijpen</h1>
          <p className={styles.lead}>Vier korte keuzes maken deze lichte ervaring bruikbaar voor momenten waarop het minder licht voelt.</p>
          <div className={styles.rating}>
            <strong>Hoeveel lichter voel je je nu?</strong>
            <div>{[1,2,3,4,5].map((value) => <button data-selected={lighter === value} key={value} onClick={() => setLighter(value)} type="button">{value}</button>)}</div>
          </div>
          {[
            ["Wat gaf vooral lucht?", reflectionOptions.relief, relief, setRelief],
            ["Wat deed jij tijdens het spelen?", reflectionOptions.pressure, pressure, setPressure],
            ["Wat helpt jou dan van je partner?", reflectionOptions.support, support, setSupport],
          ].map(([title, options, value, setter]) => (
            <div className={styles.reflectionBlock} key={String(title)}>
              <h2>{String(title)}</h2>
              <div className={styles.responseGrid}>
                {(options as readonly { id: string; label: string }[]).map((option) => (
                  <button
                    data-selected={value === option.id}
                    key={option.id}
                    onClick={() => (setter as (next: never) => void)(option.id as never)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "vrolijke-open-plek.reflection.submitted",
                actorId: installationId,
                reflection: { lighter, relief, pressure, support },
              })
            }
            type="button"
          >
            Verder
          </button>
        </div>
      </section>
    );
  }

  if (!allConversationDone) {
    if (ownConversationDone) {
      return <section className={styles.game}><div className={styles.panel}><Waiting partnerName={partnerName} /></div></section>;
    }
    const question = conversationQuestions[questionIndex % conversationQuestions.length];
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Een laag dieper</span>
          <h1>Lichtheid is niet hetzelfde als wegkijken</h1>
          <div className={styles.prompt}>{question}</div>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => setQuestionIndex((value) => value + 1)} type="button">Andere vraag</button>
            <button className={styles.secondary} onClick={() => openChat?.(question)} type="button">Open chat</button>
            <button className={styles.secondary} onClick={() => openCall?.()} type="button">Bel elkaar</button>
            <button className={styles.primary} disabled={pending} onClick={() => dispatch({ type: "vrolijke-open-plek.conversation.done", actorId: installationId })} type="button">Gesprek afgerond</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <span className={styles.kicker}>Opgeslagen voor jullie profiel</span>
        <h1>Jullie luchtmakers zijn gevonden</h1>
        <p className={styles.lead}>De gezamenlijke spelkeuze en jullie persoonlijke reacties zijn bewaard. Zo kan de app later herkennen wat ontspant, wat spanning oproept en welke steun werkelijk helpt.</p>
        <button className={styles.primary} disabled={pending} onClick={() => dispatch({ type: "vrolijke-open-plek.game.completed", actorId: installationId })} type="button">Terug naar kaart 2</button>
      </div>
    </section>
  );
}
