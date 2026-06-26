import { useState, type ReactNode } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  cases,
  christianPrompts,
  domains,
  needs,
  protections,
  reactions,
  repairStarts,
  type DomeinId,
  type NeedId,
  type ProtectionId,
  type ReactionId,
} from "./content";
import type {
  OudeKnoppenAction,
  OudeKnoppenReflection,
  OudeKnoppenRepair,
  OudeKnoppenSelection,
  OudeKnoppenState,
} from "./contracts";
import { FaithLayer } from "../FaithLayer";
import styles from "./OudeKnoppenGame.module.css";

function Scene({
  children,
  step,
}: {
  children: ReactNode;
  step: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <div className={styles.progress} aria-label={`Stap ${step} van 5`}>
          {[1, 2, 3, 4, 5].map((item) => (
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
  step: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <Scene step={step}>
      <span className={styles.kicker}>Even wachten</span>
      <h1>{partnerName} is nog bezig</h1>
      <p className={styles.lead}>
        Jouw laag staat veilig klaar. Straks leggen jullie niet elkaars fouten,
        maar elkaars gevoelige plekken naast elkaar.
      </p>
      <div className={styles.waitingLine}>
        <span />
      </div>
    </Scene>
  );
}

export function OudeKnoppenGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<OudeKnoppenState, OudeKnoppenAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const introSeen = state.introSeenIds.includes(installationId);
  const ownSelection = state.selections[installationId];
  const partnerSelection = state.selections[partnerId];
  const ownReflection = state.reflections[installationId];
  const partnerReflection = state.reflections[partnerId];
  const ownRepair = state.repairs[installationId];
  const partnerRepair = state.repairs[partnerId];
  const bothSelections = memberIds.every((id) => Boolean(state.selections[id]));
  const bothReflections = memberIds.every((id) => Boolean(state.reflections[id]));
  const bothRepairs = memberIds.every((id) => Boolean(state.repairs[id]));

  const [domainId, setDomainId] = useState<DomeinId>("gezien");
  const [caseId, setCaseId] = useState<(typeof cases)[number]["id"]>(
    cases[0].id,
  );
  const [reactionId, setReactionId] = useState<ReactionId>("fight");
  const [needId, setNeedId] = useState<NeedId>("erkenning");
  const [protectionId, setProtectionId] = useState<ProtectionId>("hard-worden");
  const [oldButtonName, setOldButtonName] = useState("");
  const [bodySignal, setBodySignal] = useState("");
  const [memoryHint, setMemoryHint] = useState("");
  const [softSentence, setSoftSentence] = useState("");
  const [partnerHelp, setPartnerHelp] = useState("");
  const [pauseSignal, setPauseSignal] = useState("");
  const [miniPractice, setMiniPractice] = useState("");

  const visibleCases = cases.filter((item) => item.domain === domainId);
  const selectedCase = cases.find((item) => item.id === caseId) ?? visibleCases[0];
  const reflectionComplete =
    oldButtonName.trim().length >= 3 &&
    bodySignal.trim().length >= 5 &&
    memoryHint.trim().length >= 8;
  const repairComplete =
    softSentence.trim().length >= 8 &&
    partnerHelp.trim().length >= 8 &&
    pauseSignal.trim().length >= 2 &&
    miniPractice.trim().length >= 8;

  if (!introSeen) {
    return (
      <Scene step={1}>
        <span className={styles.kicker}>Oude knoppen</span>
        <h1>Waarom raakt dit mij zo?</h1>
        <p className={styles.lead}>
          Sommige reacties zijn groter dan het moment. Dit spel helpt jullie
          veilig kijken naar gevoelige knoppen: wat wordt geraakt, hoe bescherm
          je jezelf, en wat helpt om zachter terug in contact te komen?
        </p>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Geen schuldkaart</h2>
            <p>
              Een oude knop is geen bewijs dat iemand fout is. Het is een plek
              waar iets sneller pijn doet dan de ander kan zien.
            </p>
          </article>
          <article className={styles.card}>
            <h2>Wel verantwoordelijkheid</h2>
            <p>
              Je hoeft je reactie niet te veroordelen, maar je mag wel leren
              hoe je haar eerder herkent en zachter brengt.
            </p>
          </article>
        </div>
        {christianLayer && (
          <FaithLayer
            prompts={christianPrompts}
            title="Christelijke laag"
          />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() =>
            dispatch({ type: "oude-knoppen.intro.seen", actorId: installationId })
          }
          type="button"
        >
          Rustig naar binnen
        </button>
      </Scene>
    );
  }

  if (!ownSelection) {
    return (
      <Scene step={2}>
        <span className={styles.kicker}>Stap 1 — kies ingang</span>
        <h1>Welke vraag raakt sneller?</h1>
        <p className={styles.lead}>
          Kies eerst een domein. Daarna kies je een herkenbare situatie. Je
          hoeft niet de zwaarste te kiezen; kies wat echt genoeg is.
        </p>
        <div className={styles.domainGrid}>
          {(Object.entries(domains) as [DomeinId, (typeof domains)[DomeinId]][]).map(
            ([id, domain]) => (
              <button
                className={styles.domain}
                data-selected={domainId === id}
                key={id}
                onClick={() => {
                  setDomainId(id);
                  setCaseId(
                    cases.find((item) => item.domain === id)?.id ?? cases[0].id,
                  );
                }}
                type="button"
              >
                <span>{domain.emoji}</span>
                <b>{domain.title}</b>
                <small>{domain.central}</small>
              </button>
            ),
          )}
        </div>
        <div className={styles.choiceList}>
          {visibleCases.map((item) => (
            <button
              className={styles.caseCard}
              data-selected={caseId === item.id}
              key={item.id}
              onClick={() => setCaseId(item.id)}
              type="button"
            >
              <span className={styles.kicker}>{domains[item.domain].title}</span>
              <h2>{item.title}</h2>
              <p>{item.story}</p>
            </button>
          ))}
        </div>
        <button
          className={styles.primary}
          disabled={pending || !selectedCase}
          onClick={() =>
            dispatch({
              type: "oude-knoppen.selection.submitted",
              actorId: installationId,
              selection: { domainId, caseId } satisfies OudeKnoppenSelection,
            })
          }
          type="button"
        >
          Deze situatie onderzoeken
        </button>
      </Scene>
    );
  }

  if (!bothSelections) {
    return <Waiting partnerName={partnerName} step={2} />;
  }

  if (!ownReflection) {
    const chosenCase =
      cases.find((item) => item.id === ownSelection.caseId) ?? selectedCase;
    return (
      <Scene step={3}>
        <span className={styles.kicker}>Stap 2 — jouw laag</span>
        <h1>Wat beschermt jouw reactie?</h1>
        <p className={styles.lead}>{chosenCase?.story}</p>
        <div className={styles.two}>
          <article className={styles.card}>
            <h2>Eerste reactie</h2>
            <div className={styles.choiceList}>
              {(Object.entries(reactions) as [ReactionId, (typeof reactions)[ReactionId]][]).map(
                ([id, reaction]) => (
                  <button
                    className={styles.choice}
                    data-selected={reactionId === id}
                    key={id}
                    onClick={() => setReactionId(id)}
                    type="button"
                  >
                    <b>{reaction.label}</b>
                    <small>{reaction.text}</small>
                  </button>
                ),
              )}
            </div>
          </article>
          <article className={styles.card}>
            <h2>Onderliggende behoefte</h2>
            <div className={styles.choiceList}>
              {(Object.entries(needs) as [NeedId, (typeof needs)[NeedId]][]).map(
                ([id, need]) => (
                  <button
                    className={styles.choice}
                    data-selected={needId === id}
                    key={id}
                    onClick={() => setNeedId(id)}
                    type="button"
                  >
                    <b>{need.label}</b>
                    <small>{need.text}</small>
                  </button>
                ),
              )}
            </div>
          </article>
        </div>
        <article className={styles.card}>
          <h2>Bescherming</h2>
          <div className={styles.choiceList}>
            {(Object.entries(protections) as [
              ProtectionId,
              (typeof protections)[ProtectionId],
            ][]).map(([id, protection]) => (
              <button
                className={styles.choice}
                data-selected={protectionId === id}
                key={id}
                onClick={() => setProtectionId(id)}
                type="button"
              >
                <b>{protection.label}</b>
                <small>{protection.text}</small>
              </button>
            ))}
          </div>
        </article>
        <label className={styles.field}>
          <span className={styles.kicker}>Naam voor deze knop</span>
          <input
            className={styles.input}
            onChange={(event) => setOldButtonName(event.target.value)}
            placeholder="Bijvoorbeeld: niet gezien worden, teveel zijn, alleen staan..."
            value={oldButtonName}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.kicker}>Lichaamssignaal</span>
          <input
            className={styles.input}
            onChange={(event) => setBodySignal(event.target.value)}
            placeholder="Waar merk je het aan? Keel, borst, buik, hoofd, handen..."
            value={bodySignal}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.kicker}>Waar lijkt dit oud of bekend?</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setMemoryHint(event.target.value)}
            placeholder="Geen analyse nodig. Een richting of herinnering is genoeg."
            value={memoryHint}
          />
        </label>
        <button
          className={styles.primary}
          disabled={pending || !reflectionComplete}
          onClick={() =>
            dispatch({
              type: "oude-knoppen.reflection.submitted",
              actorId: installationId,
              reflection: {
                reactionId,
                needId,
                protectionId,
                oldButtonName: oldButtonName.trim(),
                bodySignal: bodySignal.trim(),
                memoryHint: memoryHint.trim(),
              } satisfies OudeKnoppenReflection,
            })
          }
          type="button"
        >
          Bewaar mijn laag
        </button>
      </Scene>
    );
  }

  if (!bothReflections) {
    return <Waiting partnerName={partnerName} step={3} />;
  }

  if (!ownRepair) {
    return (
      <Scene step={4}>
        <span className={styles.kicker}>Stap 3 — herstelroute</span>
        <h1>Zachter terug in contact</h1>
        <p className={styles.lead}>
          Jouw knop heet <strong>{ownReflection.oldButtonName}</strong>. De
          bescherming is <strong>{protections[ownReflection.protectionId].label}</strong>;
          daaronder zit behoefte aan <strong>{needs[ownReflection.needId].label}</strong>.
        </p>
        <div className={styles.grid}>
          {repairStarts.map((start) => (
            <article className={styles.card} key={start}>
              <p>{start}</p>
            </article>
          ))}
        </div>
        <label className={styles.field}>
          <span className={styles.kicker}>Zachte zin</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setSoftSentence(event.target.value)}
            placeholder={protections[ownReflection.protectionId].softener}
            value={softSentence}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.kicker}>Wat helpt van je partner?</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setPartnerHelp(event.target.value)}
            placeholder="Wat kan je partner doen zonder jouw knop verder in te drukken?"
            value={partnerHelp}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.kicker}>Pauzesignaal</span>
          <input
            className={styles.input}
            onChange={(event) => setPauseSignal(event.target.value)}
            placeholder="Bijvoorbeeld: hand op hart, codewoord, glas water..."
            value={pauseSignal}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.kicker}>Mini-oefening deze week</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => setMiniPractice(event.target.value)}
            placeholder="Klein genoeg om echt te doen."
            value={miniPractice}
          />
        </label>
        <button
          className={styles.primary}
          disabled={pending || !repairComplete}
          onClick={() =>
            dispatch({
              type: "oude-knoppen.repair.submitted",
              actorId: installationId,
              repair: {
                softSentence: softSentence.trim(),
                partnerHelp: partnerHelp.trim(),
                pauseSignal: pauseSignal.trim(),
                miniPractice: miniPractice.trim(),
              } satisfies OudeKnoppenRepair,
            })
          }
          type="button"
        >
          Bewaar herstelroute
        </button>
      </Scene>
    );
  }

  if (!bothRepairs) {
    return <Waiting partnerName={partnerName} step={4} />;
  }

  return (
    <Scene step={5}>
      <span className={styles.kicker}>Opgeslagen voor jullie profiel</span>
      <h1>Twee knoppen, twee herstelroutes</h1>
      <p className={styles.lead}>
        Dit is geen eindconclusie, maar een bruikbare kaart: waar raakt het
        snel, wat beschermt ieder, en wat helpt om terug te keren.
      </p>
      <div className={styles.two}>
        <article className={styles.summary}>
          <span className={styles.kicker}>Jij</span>
          <h2>{ownReflection.oldButtonName}</h2>
          <span className={styles.pill}>{needs[ownReflection.needId].label}</span>
          <span className={styles.pill}>{protections[ownReflection.protectionId].label}</span>
          <p>{ownRepair.softSentence}</p>
          <p><strong>Help:</strong> {ownRepair.partnerHelp}</p>
        </article>
        <article className={styles.summary}>
          <span className={styles.kicker}>{partnerName}</span>
          <h2>{partnerReflection?.oldButtonName ?? "Oude knop"}</h2>
          {partnerReflection && (
            <>
              <span className={styles.pill}>{needs[partnerReflection.needId].label}</span>
              <span className={styles.pill}>{protections[partnerReflection.protectionId].label}</span>
            </>
          )}
          <p>{partnerRepair?.softSentence ?? "Nog niet zichtbaar."}</p>
          <p><strong>Help:</strong> {partnerRepair?.partnerHelp ?? "Nog niet zichtbaar."}</p>
        </article>
      </div>
      {christianLayer && (
        <FaithLayer
          prompts={christianPrompts}
          title="Christelijke laag"
        />
      )}
      <button
        className={styles.primary}
        disabled={pending}
        onClick={() =>
          dispatch({ type: "oude-knoppen.game.completed", actorId: installationId })
        }
        type="button"
      >
        Terug naar kaart
      </button>
    </Scene>
  );
}
