import { useState, type ReactNode } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  SpiegelvijverAction,
  SpiegelvijverObservation,
  SpiegelvijverRecognition,
  SpiegelvijverSelf,
  SpiegelvijverState,
} from "./contracts";
import {
  christianPrompts,
  conversationQuestions,
  deeperOptions,
  hiddenOptions,
  opennessOptions,
  readingOptions,
  recognitionOptions,
  surfaceOptions,
} from "./content";
import { FaithLayer } from "../FaithLayer";
import styles from "./SpiegelvijverGame.module.css";

type Option = { id: string; label: string };

function label(options: readonly Option[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

function Scene({
  step,
  total,
  children,
}: {
  step: number;
  total: number;
  children: ReactNode;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.panel} key={step}>
        <div className={styles.ripple} aria-hidden>
          {Array.from({ length: total }, (_, index) => (
            <span data-on={index < step} key={index} />
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function Talk({ lead }: { lead: string }) {
  return (
    <p className={styles.talk}>
      {lead} Blijf hier gerust even — bespreek het samen via de chat of bel
      elkaar.
    </p>
  );
}

function Waiting({ text }: { text: string }) {
  return (
    <Scene step={0} total={3}>
      <span className={styles.kicker}>Spiegelvijver</span>
      <h1 className={styles.soft}>Het water ligt stil</h1>
      <p className={styles.lead}>{text}</p>
    </Scene>
  );
}

export function SpiegelvijverGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<SpiegelvijverState, SpiegelvijverAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const ownSelf = state.selfPortraits[installationId];
  const ownObservation = state.observations[installationId];
  const partnerObservation = state.observations[partnerId];
  const ownRecognition = state.recognitions[installationId];

  const bothSelf = memberIds.every((id) => Boolean(state.selfPortraits[id]));
  const bothObservations = memberIds.every((id) =>
    Boolean(state.observations[id]),
  );
  const bothRecognitions = memberIds.every((id) =>
    Boolean(state.recognitions[id]),
  );

  const [self, setSelf] = useState<{
    openness?: SpiegelvijverSelf["openness"];
    origin: string;
    surface: string[];
    deeper: string[];
    hidden: string[];
  }>({ origin: "", surface: [], deeper: [], hidden: [] });
  const [observation, setObservation] = useState<{
    reading?: SpiegelvijverObservation["reading"];
    seenIn: string;
    gentleNote: string;
  }>({ seenIn: "", gentleNote: "" });
  const [recognition, setRecognition] = useState<{
    recognises?: SpiegelvijverRecognition["recognises"];
    reflection: string;
  }>({ reflection: "" });

  function toggleLayer(layer: "surface" | "deeper" | "hidden", value: string) {
    setSelf((current) => {
      const list = current[layer];
      if (list.includes(value)) {
        return { ...current, [layer]: list.filter((item) => item !== value) };
      }
      if (list.length >= 3) return current;
      return { ...current, [layer]: [...list, value] };
    });
  }

  // Ronde 1 — Mijn eigen beeld
  if (!ownSelf) {
    const complete =
      self.openness &&
      self.origin.trim() &&
      self.surface.length > 0 &&
      self.deeper.length > 0 &&
      self.hidden.length > 0;
    return (
      <Scene step={1} total={3}>
        <span className={styles.kicker}>Onder de oppervlakte · Ronde 1</span>
        <h1>Zoals ik mijzelf zie</h1>
        <p className={styles.lead}>
          Je staat met {partnerName} bij een stille vijver. Maak eerst een klein
          zelfportret — niet met foto's, maar met keuzes.
        </p>

        <div className={styles.choices}>
          {opennessOptions.map((option) => (
            <button
              data-selected={self.openness === option.id}
              key={option.id}
              onClick={() =>
                setSelf((current) => ({ ...current, openness: option.id }))
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.caption}>
          Als ik nieuwe mensen leer kennen, ben ik meestal…
        </p>

        <div className={styles.layers}>
          <div className={styles.layer} data-depth="1">
            <h2>Wat mensen snel aan mij zien</h2>
            <div className={styles.chips}>
              {surfaceOptions.map((option) => (
                <button
                  data-selected={self.surface.includes(option)}
                  key={option}
                  onClick={() => toggleLayer("surface", option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.layer} data-depth="2">
            <h2>Wat mensen pas later ontdekken</h2>
            <div className={styles.chips}>
              {deeperOptions.map((option) => (
                <button
                  data-selected={self.deeper.includes(option)}
                  key={option}
                  onClick={() => toggleLayer("deeper", option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.layer} data-depth="3">
            <h2>Wat ik zelf soms nog niet goed begrijp</h2>
            <div className={styles.chips}>
              {hiddenOptions.map((option) => (
                <button
                  data-selected={self.hidden.includes(option)}
                  key={option}
                  onClick={() => toggleLayer("hidden", option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <textarea
          className={styles.reflect}
          maxLength={240}
          onChange={(event) =>
            setSelf((current) => ({ ...current, origin: event.target.value }))
          }
          placeholder="Waar komt dat beeld vandaan, denk je? Is dat altijd zo geweest?"
          value={self.origin}
        />

        <button
          className={styles.primary}
          disabled={pending || !complete}
          onClick={() =>
            dispatch({
              type: "spiegelvijver.self.submitted",
              actorId: installationId,
              portrait: {
                openness: self.openness!,
                origin: self.origin.trim(),
                surface: self.surface,
                deeper: self.deeper,
                hidden: self.hidden,
              },
            })
          }
          type="button"
        >
          Laat mijn beeld in het water zien
        </button>
      </Scene>
    );
  }

  if (!bothSelf) {
    return (
      <Waiting text={`${partnerName} maakt het eigen zelfportret nog af.`} />
    );
  }

  // Ronde 2 — Wat jij al ziet
  if (!ownObservation) {
    const complete =
      observation.reading &&
      observation.seenIn.trim() &&
      observation.gentleNote.trim();
    return (
      <Scene step={2} total={3}>
        <span className={styles.kicker}>Onder de oppervlakte · Ronde 2</span>
        <h1>Wat zie jij al bij {partnerName}?</h1>
        <p className={styles.lead}>
          Niet wat {partnerName} zélf zei — maar wat jij tot nu toe werkelijk
          waarneemt. Blijf niet bij complimenten; word concreet.
        </p>

        <div className={styles.choices}>
          {readingOptions.map((option) => (
            <button
              data-selected={observation.reading === option.id}
              key={option.id}
              onClick={() =>
                setObservation((current) => ({
                  ...current,
                  reading: option.id,
                }))
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <textarea
          className={styles.reflect}
          maxLength={240}
          onChange={(event) =>
            setObservation((current) => ({
              ...current,
              seenIn: event.target.value,
            }))
          }
          placeholder="Ik zie dat vooral aan… (een moment, een blik, een manier van reageren)"
          value={observation.seenIn}
        />
        <textarea
          className={styles.reflect}
          maxLength={240}
          onChange={(event) =>
            setObservation((current) => ({
              ...current,
              gentleNote: event.target.value,
            }))
          }
          placeholder="Eén zachte zin erbij, bijv. 'Ik denk dat ik dit al een beetje bij jou zie…'"
          value={observation.gentleNote}
        />

        <button
          className={styles.primary}
          disabled={pending || !complete}
          onClick={() =>
            dispatch({
              type: "spiegelvijver.observation.submitted",
              actorId: installationId,
              observation: {
                reading: observation.reading!,
                seenIn: observation.seenIn.trim(),
                gentleNote: observation.gentleNote.trim(),
              },
            })
          }
          type="button"
        >
          Deel wat ik zie
        </button>
      </Scene>
    );
  }

  if (!bothObservations) {
    return (
      <Waiting
        text={`${partnerName} kijkt nog naar wat hen bij jou opvalt.`}
      />
    );
  }

  // Ronde 3 — Waar zit verschil?
  if (!ownRecognition) {
    return (
      <Scene step={3} total={3}>
        <span className={styles.kicker}>Onder de oppervlakte · Ronde 3</span>
        <h1>Waar zit het verschil?</h1>
        <p className={styles.lead}>
          Je eigen beeld, naast wat {partnerName} ziet. Soms lijk je open
          terwijl je nog veel binnenhoudt — juist dat verschil is interessant.
        </p>

        <div className={styles.mirror}>
          <article>
            <h2>Jij zegt</h2>
            <p>“{label(opennessOptions, ownSelf.openness)}”</p>
            <small>Snel zichtbaar: {ownSelf.surface.join(", ")}</small>
          </article>
          <article>
            <h2>{partnerName} ziet</h2>
            {partnerObservation && (
              <>
                <p>“{label(readingOptions, partnerObservation.reading)}”</p>
                <small>{partnerObservation.seenIn}</small>
              </>
            )}
          </article>
        </div>

        <div className={styles.choices}>
          {recognitionOptions.map((option) => (
            <button
              data-selected={recognition.recognises === option.id}
              key={option.id}
              onClick={() =>
                setRecognition((current) => ({
                  ...current,
                  recognises: option.id,
                }))
              }
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className={styles.caption}>
          Herken je dat verschil? Laat je makkelijk iets zien, of vooral de
          buitenkant ervan?
        </p>

        <textarea
          className={styles.reflect}
          maxLength={240}
          onChange={(event) =>
            setRecognition((current) => ({
              ...current,
              reflection: event.target.value,
            }))
          }
          placeholder="Wat klopt er wel, en wat niet?"
          value={recognition.reflection}
        />

        <button
          className={styles.primary}
          disabled={
            pending || !recognition.recognises || !recognition.reflection.trim()
          }
          onClick={() =>
            dispatch({
              type: "spiegelvijver.recognition.submitted",
              actorId: installationId,
              recognition: {
                recognises: recognition.recognises!,
                reflection: recognition.reflection.trim(),
              },
            })
          }
          type="button"
        >
          Leg mijn antwoord naast het hare
        </button>
      </Scene>
    );
  }

  if (!bothRecognitions) {
    return (
      <Waiting
        text={`${partnerName} kijkt nog naar het verschil tussen beeld en waarneming.`}
      />
    );
  }

  // Slot — het water klaart op
  const surfaceText = ownSelf.surface.join(", ");
  const deeperText = ownSelf.deeper.join(", ");
  const partnerReadingText = partnerObservation
    ? label(readingOptions, partnerObservation.reading).toLowerCase()
    : "wat er onder zit";
  const prompt =
    conversationQuestions[
      Math.abs(installationId.length) % conversationQuestions.length
    ]!;
  return (
    <Scene step={3} total={3}>
      <span className={styles.kicker}>Het water klaart op</span>
      <h1>Iets helderder dan daarnet</h1>
      <p className={styles.summary}>
        Jij laat snel <strong>{surfaceText}</strong> zien, maar daaronder lijkt
        ook <strong>{deeperText}</strong> te zitten. Wat {partnerName} vandaag
        beter van je begrijpt is dat {partnerReadingText}.
      </p>
      <p className={styles.prompt}>{prompt}</p>
      <Talk lead="Dit is het moment om elkaar echt te verstaan." />
      {christianLayer && (
        <FaithLayer
          intro="Onder de oppervlakte ligt ook hoe God jou ziet."
          prompts={[...christianPrompts]}
        />
      )}
      <button
        className={styles.primary}
        disabled={pending}
        onClick={() =>
          dispatch({
            type: "spiegelvijver.game.completed",
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
