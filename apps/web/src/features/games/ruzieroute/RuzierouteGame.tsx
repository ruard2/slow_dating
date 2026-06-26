import { useState, type ReactNode } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import { FaithLayer } from "../FaithLayer";
import {
  accelerations,
  christianQuestions,
  contractOptions,
  endpoints,
  exits,
  inners,
  interpretations,
  needs,
  outers,
  repairSentences,
  routeNameOptions,
  triggers,
  type AccelerationId,
  type EndpointId,
  type ExitId,
  type InnerId,
  type InterpretationId,
  type NeedId,
  type OuterId,
  type TriggerId,
} from "./content";
import type {
  RuzierouteAction,
  RuzierouteJoint,
  RuzieroutePersonal,
  RuzierouteState,
} from "./contracts";
import { normalizeRuzierouteState } from "./reducer";
import { routeSentence } from "./result";
import styles from "./RuzierouteGame.module.css";

function Scene({ children, step }: { children: ReactNode; step: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) {
  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <div className={styles.progress} aria-label={`Stap ${step} van 7`}>
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <span data-active={item <= step} key={item} />
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}

function Waiting({ partnerName, step }: { partnerName: string; step: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) {
  return (
    <Scene step={step}>
      <span className={styles.kicker}>Even wachten</span>
      <h1>{partnerName} tekent nog</h1>
      <p className={styles.lead}>
        Jouw route ligt klaar. Straks kijken jullie niet wie fout zat, maar
        waar de route jullie kwijtraakt.
      </p>
      <div className={styles.waitingLine}><span /></div>
    </Scene>
  );
}

function toggle<T extends string>(values: T[], value: T, max: number) {
  if (values.includes(value)) return values.filter((item) => item !== value);
  return values.length >= max ? [...values.slice(1), value] : [...values, value];
}

function Choice<T extends string>({
  id,
  selected,
  subtitle,
  title,
  onClick,
}: {
  id: T;
  selected: boolean;
  subtitle?: string;
  title: string;
  onClick: (id: T) => void;
}) {
  return (
    <button
      className={styles.choice}
      data-selected={selected}
      onClick={() => onClick(id)}
      type="button"
    >
      <b>{title}</b>
      {subtitle ? <small>{subtitle}</small> : null}
    </button>
  );
}

function PersonalSummary({
  label,
  personal,
}: {
  label: string;
  personal: RuzieroutePersonal;
}) {
  return (
    <article className={styles.summary}>
      <span className={styles.kicker}>{label}</span>
      <h2>{triggers[personal.triggerIds[0] ?? "toon"].title}</h2>
      <p>
        <span className={styles.pill}>{personal.innerIds.map((id) => inners[id].title).join(", ")}</span>
      </p>
      <p>
        De ander ziet:{" "}
        {personal.outerIds.map((id) => outers[id].title.toLowerCase()).join(", ")}.
      </p>
      <p>
        Jij denkt misschien: <strong>{interpretations[personal.interpretationId]}</strong>.
      </p>
      <p>
        Eronder zit: {personal.needIds.map((id) => needs[id]).join(", ")}.
      </p>
    </article>
  );
}

export function RuzierouteGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<RuzierouteState, RuzierouteAction>) {
  const gameState = normalizeRuzierouteState(state);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const own = gameState.personals[installationId];
  const partner = gameState.personals[partnerId];
  const introSeen = gameState.introSeenIds.includes(installationId);
  const bothPersonal = memberIds.every((id) => Boolean(gameState.personals[id]));

  const [triggerIds, setTriggerIds] = useState<TriggerId[]>(["toon"]);
  const [innerIds, setInnerIds] = useState<InnerId[]>(["angst", "boosheid"]);
  const [outerIds, setOuterIds] = useState<OuterId[]>(["aandringen"]);
  const [interpretationId, setInterpretationId] =
    useState<InterpretationId>("laat-alleen");
  const [needIds, setNeedIds] = useState<NeedId[]>(["geruststelling"]);
  const [hiddenMeaning, setHiddenMeaning] = useState(
    "Ik reageer zo niet omdat ik tegen je ben, maar omdat ik bang ben dat we elkaar kwijtraken.",
  );
  const [endpointId, setEndpointId] = useState<EndpointId>("contact-kwijt");
  const [accelerationId, setAccelerationId] = useState<AccelerationId>("duwen");
  const [exitId, setExitId] = useState<ExitId>("oranje");
  const [repairSentence, setRepairSentence] = useState(
    repairSentences[1] ?? "Ik ben geraakt, maar ik ben niet tegen jou.",
  );
  const [miniContract, setMiniContract] = useState(
    contractOptions[2] ?? "Als jij oranje zegt, pauzeren we zonder discussie.",
  );
  const [routeName, setRouteName] = useState(
    routeNameOptions[1] ?? "De Terugkomroute",
  );
  const [faithReflection, setFaithReflection] = useState("");

  const personalComplete =
    triggerIds.length > 0 &&
    innerIds.length > 0 &&
    outerIds.length > 0 &&
    needIds.length > 0 &&
    hiddenMeaning.trim().length >= 12;
  const jointComplete =
    repairSentence.trim().length >= 8 &&
    miniContract.trim().length >= 12 &&
    routeName.trim().length >= 3;

  if (!introSeen) {
    return (
      <Scene step={1}>
        <span className={styles.kicker}>Onze ruzieroute</span>
        <h1>Welke route trekt ons uit contact?</h1>
        <p className={styles.lead}>
          Elke ruzie heeft een route. Vandaag tekenen jullie niet wie fout zat,
          maar waar jullie elkaar kwijtraken — en waar de weg terug begint.
        </p>
        <div className={styles.grid}>
          <article className={styles.card}>
            <h2>Niet jij tegen mij</h2>
            <p>We leggen het patroon buiten jullie: wij samen tegen de route.</p>
          </article>
          <article className={styles.card}>
            <h2>Bescherming onder gedrag</h2>
            <p>Onder mijn reactie zit meestal iets dat beschermd wil worden.</p>
          </article>
        </div>
        {christianLayer && (
          <FaithLayer
            prompts={christianQuestions}
            title="Christelijke laag"
          />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() => dispatch({ type: "ruzieroute.intro.seen", actorId: installationId })}
          type="button"
        >
          Teken de route
        </button>
      </Scene>
    );
  }

  if (!own) {
    return (
      <Scene step={2}>
        <span className={styles.kicker}>Stap 1 — ingang</span>
        <h1>Waar raakt het eerste steentje los?</h1>
        <p className={styles.lead}>Kies één of twee ingangen. Wat klein lijkt, kan voor de ander al het begin zijn.</p>
        <div className={styles.grid}>
          {(Object.entries(triggers) as [TriggerId, (typeof triggers)[TriggerId]][]).map(([id, item]) => (
            <Choice id={id} key={id} onClick={(value) => setTriggerIds(toggle(triggerIds, value, 2))} selected={triggerIds.includes(id)} subtitle={item.group} title={item.title} />
          ))}
        </div>
        <span className={styles.kicker}>Stap 2 — binnenkant</span>
        <h2>Wat gebeurt er voordat de ander iets ziet?</h2>
        <div className={styles.grid}>
          {(Object.entries(inners) as [InnerId, (typeof inners)[InnerId]][]).map(([id, item]) => (
            <Choice id={id} key={id} onClick={(value) => setInnerIds(toggle(innerIds, value, 3))} selected={innerIds.includes(id)} subtitle={item.kind} title={item.title} />
          ))}
        </div>
        <span className={styles.kicker}>Stap 3 — buitenkant</span>
        <h2>Wat ziet de ander?</h2>
        <p>Dit is wat de ander ziet. Niet per se wat jij bedoelt.</p>
        <div className={styles.grid}>
          {(Object.entries(outers) as [OuterId, (typeof outers)[OuterId]][]).map(([id, item]) => (
            <Choice id={id} key={id} onClick={(value) => setOuterIds(toggle(outerIds, value, 3))} selected={outerIds.includes(id)} subtitle={item.route} title={item.title} />
          ))}
        </div>
        <span className={styles.kicker}>Stap 4 — misverstand</span>
        <h2>Wat vul jij dan misschien in?</h2>
        <div className={styles.grid}>
          {(Object.entries(interpretations) as [InterpretationId, string][]).map(([id, title]) => (
            <Choice id={id} key={id} onClick={setInterpretationId} selected={interpretationId === id} title={title} />
          ))}
        </div>
        <h2>Wat zit eronder?</h2>
        <div className={styles.grid}>
          {(Object.entries(needs) as [NeedId, string][]).map(([id, title]) => (
            <Choice id={id} key={id} onClick={(value) => setNeedIds(toggle(needIds, value, 2))} selected={needIds.includes(id)} title={title} />
          ))}
        </div>
        <label>
          <span className={styles.kicker}>Maar wat ik eigenlijk bedoel of voel is...</span>
          <textarea className={styles.textarea} onChange={(event) => setHiddenMeaning(event.target.value)} value={hiddenMeaning} />
        </label>
        <button
          className={styles.primary}
          disabled={pending || !personalComplete}
          onClick={() =>
            dispatch({
              type: "ruzieroute.personal.submitted",
              actorId: installationId,
              personal: {
                triggerIds,
                innerIds,
                outerIds,
                interpretationId,
                needIds,
                hiddenMeaning: hiddenMeaning.trim(),
              },
            })
          }
          type="button"
        >
          Leg mijn route neer
        </button>
      </Scene>
    );
  }

  if (!bothPersonal) {
    return <Waiting partnerName={partnerName} step={3} />;
  }

  if (!gameState.joint) {
    return (
      <Scene step={5}>
        <span className={styles.kicker}>Stap 5 — jullie route</span>
        <h1>Zo trekt de route</h1>
        <div className={styles.two}>
          <PersonalSummary label="Jij" personal={own} />
          {partner && <PersonalSummary label={partnerName} personal={partner} />}
        </div>
        <div className={styles.route}>
          <article className={styles.routeCard}><strong>Jouw routezin</strong><p>{routeSentence(own, partner)}</p></article>
          {partner && <article className={styles.routeCard}><strong>{partnerName}</strong><p>{routeSentence(partner, own)}</p></article>}
        </div>
        <span className={styles.kicker}>Stap 6 — waar wordt het rood?</span>
        <h2>Waar versnelt jullie route?</h2>
        <p className={styles.warning}>Groen: spanning met contact. Oranje: we raken elkaar kwijt. Rood: we vechten vooral om bescherming.</p>
        <div className={styles.grid}>
          {(Object.entries(accelerations) as [AccelerationId, string][]).map(([id, title]) => (
            <Choice id={id} key={id} onClick={setAccelerationId} selected={accelerationId === id} title={title} />
          ))}
        </div>
        <h2>Waar eindigen jullie meestal?</h2>
        <div className={styles.grid}>
          {(Object.entries(endpoints) as [EndpointId, string][]).map(([id, title]) => (
            <Choice id={id} key={id} onClick={setEndpointId} selected={endpointId === id} title={title} />
          ))}
        </div>
        <span className={styles.kicker}>Stap 7 — de afslag</span>
        <h2>Wat is de eerste realistische afslag terug?</h2>
        <div className={styles.grid}>
          {(Object.entries(exits) as [ExitId, string][]).map(([id, title]) => (
            <Choice id={id} key={id} onClick={setExitId} selected={exitId === id} title={title} />
          ))}
        </div>
        <h2>Herstelzin</h2>
        <div className={styles.grid}>
          {repairSentences.map((sentence) => (
            <Choice id={sentence} key={sentence} onClick={setRepairSentence} selected={repairSentence === sentence} title={sentence} />
          ))}
        </div>
        <h2>Mini-contract</h2>
        <div className={styles.grid}>
          {contractOptions.map((contract) => (
            <Choice id={contract} key={contract} onClick={setMiniContract} selected={miniContract === contract} title={contract} />
          ))}
        </div>
        <h2>Geef jullie route een naam</h2>
        <div className={styles.grid}>
          {routeNameOptions.map((name) => (
            <Choice id={name} key={name} onClick={setRouteName} selected={routeName === name} title={name} />
          ))}
        </div>
        {christianLayer && (
          <label>
            <span className={styles.kicker}>Dieper kijken</span>
            <textarea
              className={styles.textarea}
              onChange={(event) => setFaithReflection(event.target.value)}
              placeholder="Waar vraagt deze route om nederigheid, waarheid in liefde, vergeving of verantwoordelijkheid?"
              value={faithReflection}
            />
          </label>
        )}
        <button
          className={styles.primary}
          disabled={pending || !jointComplete}
          onClick={() => {
            const joint: RuzierouteJoint = {
              endpointId,
              accelerationId,
              exitId,
              repairSentence: repairSentence.trim(),
              miniContract: miniContract.trim(),
              routeName: routeName.trim(),
              faithReflection: faithReflection.trim() || undefined,
            };
            dispatch({ type: "ruzieroute.joint.submitted", actorId: installationId, joint });
          }}
          type="button"
        >
          Bewaar onze ruzieroute
        </button>
      </Scene>
    );
  }

  return (
    <Scene step={7}>
      <span className={styles.kicker}>Opgeslagen voor jullie profiel</span>
      <h1>{gameState.joint.routeName}</h1>
      <p className={styles.lead}>
        Een goede afslag lost niet alles op. Maar hij voorkomt dat jullie
        dezelfde kloof weer inlopen.
      </p>
      <div className={styles.route}>
        <article className={styles.routeCard}><strong>Jullie versnellingspunt</strong><p>{accelerations[gameState.joint.accelerationId]}</p></article>
        <article className={styles.routeCard}><strong>Waar het vaak eindigt</strong><p>{endpoints[gameState.joint.endpointId]}</p></article>
        <article className={styles.routeCard}><strong>Onze afslag</strong><p>{exits[gameState.joint.exitId]}</p></article>
        <article className={styles.routeCard}><strong>Herstelzin</strong><p>{gameState.joint.repairSentence}</p></article>
        <article className={styles.routeCard}><strong>Mini-contract</strong><p>{gameState.joint.miniContract}</p></article>
      </div>
      <div className={styles.two}>
        <PersonalSummary label="Jij" personal={own} />
        {partner && <PersonalSummary label={partnerName} personal={partner} />}
      </div>
      <button
        className={styles.primary}
        disabled={pending}
        onClick={() => dispatch({ type: "ruzieroute.game.completed", actorId: installationId })}
        type="button"
      >
        Terug naar kaart
      </button>
    </Scene>
  );
}
