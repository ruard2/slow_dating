import { useState, type ReactNode } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import { FaithLayer } from "../FaithLayer";
import {
  christianPrompts,
  costs,
  feelings,
  gains,
  invitedRoles,
  pulls,
  roles,
  roleSentences,
  sceneCategories,
  scenes,
  shifts,
  type CostId,
  type DramaRole,
  type FeelingId,
  type GainId,
  type PullId,
  type SceneId,
  type ShiftId,
} from "./content";
import type {
  DramadriehoekAction,
  DramadriehoekProfile,
  DramadriehoekState,
} from "./contracts";
import { normalizeDramadriehoekState } from "./reducer";
import styles from "./DramadriehoekGame.module.css";

const sceneOrder = Object.keys(scenes) as SceneId[];
const feelingOrder = Object.keys(feelings) as FeelingId[];
const pullOrder = Object.keys(pulls) as PullId[];
const gainOrder = Object.keys(gains) as GainId[];
const costOrder = Object.keys(costs) as CostId[];
const shiftOrder = Object.keys(shifts) as ShiftId[];

function Scene({ children, step }: { children: ReactNode; step: 1 | 2 | 3 | 4 | 5 | 6 }) {
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
    <button className={styles.choice} data-selected={selected} onClick={() => onClick(id)} type="button">
      <b>{title}</b>
      {subtitle ? <small>{subtitle}</small> : null}
    </button>
  );
}

function RoleStage({ role, setRole }: { role: DramaRole; setRole: (role: DramaRole) => void }) {
  return (
    <div className={styles.stage}>
      <button className={`${styles.role} ${styles.victim}`} data-selected={role === "slachtoffer"} onClick={() => setRole("slachtoffer")} type="button">
        <strong>Slachtoffer</strong><small>Ik kan niet</small>
      </button>
      <button className={`${styles.role} ${styles.rescuer}`} data-selected={role === "redder"} onClick={() => setRole("redder")} type="button">
        <strong>Redder</strong><small>Ik moet jou helpen</small>
      </button>
      <button className={`${styles.role} ${styles.persecutor}`} data-selected={role === "aanklager"} onClick={() => setRole("aanklager")} type="button">
        <strong>Aanklager</strong><small>Jij doet fout</small>
      </button>
      <div className={styles.middle}>Volwassen plek</div>
    </div>
  );
}

function ProfileCard({ label, profile }: { label: string; profile: DramadriehoekProfile }) {
  return (
    <article className={styles.summary}>
      <span className={styles.kicker}>{label}</span>
      <h2>{roles[profile.role].title}</h2>
      <p><strong>Dramazin:</strong> {profile.roleSentence}</p>
      <p>{roles[profile.role].description}</p>
      <p><span className={styles.pill}>{shifts[profile.shiftId]}</span></p>
      <p><strong>Wat je date mag weten:</strong> {profile.whatDateMayKnow}</p>
    </article>
  );
}

export function DramadriehoekGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<DramadriehoekState, DramadriehoekAction>) {
  const gameState = normalizeDramadriehoekState(state);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const introSeen = gameState.introSeenIds.includes(installationId);

  const [showIntro, setShowIntro] = useState(true);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [profileStep, setProfileStep] = useState(0);
  const [sceneId, setSceneId] = useState<SceneId | null>(null);
  const [feelingIds, setFeelingIds] = useState<FeelingId[]>([]);
  const [pullIds, setPullIds] = useState<PullId[]>([]);
  const [role, setRole] = useState<DramaRole>("redder");
  const [roleSentence, setRoleSentence] = useState(roleSentences.redder[0] ?? "Ik regel het wel.");
  const [gainIds, setGainIds] = useState<GainId[]>([]);
  const [costIds, setCostIds] = useState<CostId[]>([]);
  const [shiftId, setShiftId] = useState<ShiftId>("redder-aanklager");
  const [whatDateMayKnow, setWhatDateMayKnow] = useState(
    "Als ik ga redden, vraag mij dan: heb je hier zelf eigenlijk ruimte voor?",
  );
  const [faithReflection, setFaithReflection] = useState("");

  const subjectIsPartner = subjectId === partnerId;
  const subjectLabel = subjectIsPartner ? partnerName : "jij";
  const subjectTitle = subjectIsPartner ? partnerName : "Jij";
  const selectedScene = sceneId ? scenes[sceneId] : null;
  const subjectProfile = subjectId ? gameState.profiles[subjectId] : undefined;
  const complete =
    Boolean(sceneId) &&
    feelingIds.length > 0 &&
    pullIds.length > 0 &&
    gainIds.length > 0 &&
    costIds.length > 0 &&
    roleSentence.trim().length > 2 &&
    whatDateMayKnow.trim().length >= 12;

  const goNextProfileStep = () => setProfileStep((step) => Math.min(step + 1, 5));
  const goPreviousProfileStep = () => setProfileStep((step) => Math.max(step - 1, 0));

  if (showIntro || !introSeen) {
    return (
      <Scene step={1}>
        <span className={styles.kicker}>De Dramadriehoek</span>
        <h1>Herken je patroon zonder schrik</h1>
        <p className={styles.lead}>
          Communicatie schiet soms in ongezonde patronen. Niet omdat jullie
          slecht zijn, maar omdat spanning nu eenmaal iets met mensen doet.
          Iedereen heeft dit in meer of mindere mate.
        </p>
        <article className={styles.card}>
          <h2>Wat gaan we doen?</h2>
          <p>
            Dit is een individueel spel dat je samen speelt. Eén van jullie
            staat centraal. De ander kijkt mee, luistert, stelt rustige vragen
            en helpt woorden vinden.
          </p>
          <p>
            Daarna kan de ander het spel ook doen. Zo krijg je niet alleen
            “ons patroon”, maar echt: jouw driehoek en die van je partner.
          </p>
          <p>
            De bedoeling is niet schuld zoeken. De bedoeling is taal krijgen
            voor een patroon, zodat je later op kaart 5 kunt oefenen met de
            volwassen plek.
          </p>
        </article>
        <p className={styles.warning}>
          Let op: dit spel gaat niet over misbruik, dwang of onveiligheid.
          Daar is bescherming en hulp nodig. Dit gaat over gewone patronen
          waarin we onze verantwoordelijkheid kwijtraken.
        </p>
        {christianLayer && (
          <FaithLayer prompts={christianPrompts} title="Christelijke laag" />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() => {
            setShowIntro(false);
            if (!introSeen) {
              dispatch({ type: "dramadriehoek.intro.seen", actorId: installationId });
            }
          }}
          type="button"
        >
          Kies wie deze ronde centraal staat
        </button>
      </Scene>
    );
  }

  if (!subjectId) {
    return (
      <Scene step={1}>
        <span className={styles.kicker}>Wie doet deze ronde?</span>
        <h1>Eén driehoek tegelijk</h1>
        <p className={styles.lead}>
          Degene die centraal staat kiest en vult in. De ander kijkt mee,
          praat mee en helpt verhelderen, maar neemt het antwoord niet over.
        </p>
        <div className={styles.two}>
          <button className={styles.subjectCard} onClick={() => setSubjectId(installationId)} type="button">
            <span className={styles.kicker}>Deze ronde</span>
            <strong>Ik doe mijn driehoek</strong>
            <small>De antwoorden worden opgeslagen bij jou.</small>
          </button>
          <button className={styles.subjectCard} disabled={!partnerId} onClick={() => setSubjectId(partnerId)} type="button">
            <span className={styles.kicker}>Deze ronde</span>
            <strong>{partnerName} doet de driehoek</strong>
            <small>De antwoorden worden opgeslagen bij {partnerName}.</small>
          </button>
        </div>
      </Scene>
    );
  }

  if (!subjectProfile) {
    if (profileStep === 0) {
      return (
        <Scene step={1}>
          <span className={styles.kicker}>Stap 1 — kies één situatie</span>
          <h1>Waar herkent {subjectLabel} drama?</h1>
          <p className={styles.lead}>
            Kies één situatie die bij {subjectLabel} iets oproept. Niet de
            “ergste”, maar eentje waarbij het automatische patroon zichtbaar wordt.
          </p>
          <div className={styles.categoryStack}>
            {sceneCategories.map((category) => (
              <section className={styles.categoryBlock} key={category}>
                <h2>{category}</h2>
                <div className={styles.grid}>
                  {sceneOrder
                    .filter((id) => scenes[id].category === category)
                    .map((id) => (
                      <Choice
                        id={id}
                        key={id}
                        onClick={setSceneId}
                        selected={sceneId === id}
                        subtitle={scenes[id].text}
                        title={scenes[id].title}
                      />
                    ))}
                </div>
              </section>
            ))}
          </div>
          {sceneId ? (
            <p className={styles.selectionLine}>{subjectTitle} koos: {scenes[sceneId].title}</p>
          ) : (
            <p className={styles.selectionLine}>Kies één situatie om mee verder te werken.</p>
          )}
          <button className={styles.primary} disabled={!sceneId} onClick={goNextProfileStep} type="button">
            Werk deze situatie uit
          </button>
        </Scene>
      );
    }

    if (profileStep === 1 && selectedScene && sceneId) {
      return (
        <Scene step={2}>
          <span className={styles.kicker}>Stap 2 — wat wordt geraakt?</span>
          <h1>Wat voelt {subjectLabel} hierbij?</h1>
          <p className={styles.lead}>Kies één tot drie woorden voor wat deze situatie raakt.</p>
          <article className={styles.focusCard}>
            <span className={styles.kicker}>{selectedScene.category}</span>
            <h2>{selectedScene.title}</h2>
            <p>{selectedScene.text}</p>
          </article>
          <div className={styles.grid}>
            {feelingOrder.map((id) => (
              <Choice id={id} key={id} onClick={(value) => setFeelingIds(toggle(feelingIds, value, 3))} selected={feelingIds.includes(id)} title={feelings[id]} />
            ))}
          </div>
          <div className={styles.navRow}>
            <button className={styles.secondary} onClick={goPreviousProfileStep} type="button">Terug</button>
            <button className={styles.primaryInline} disabled={feelingIds.length === 0} onClick={goNextProfileStep} type="button">Door naar neiging</button>
          </div>
        </Scene>
      );
    }

    if (profileStep === 2 && selectedScene) {
      return (
        <Scene step={3}>
          <span className={styles.kicker}>Stap 3 — automatische beweging</span>
          <h1>Wat doet {subjectLabel} bijna vanzelf?</h1>
          <p className={styles.lead}>Kies de eerste reflex in deze situatie.</p>
          <article className={styles.focusCard}>
            <span className={styles.kicker}>{selectedScene.category}</span>
            <h2>{selectedScene.title}</h2>
            <p>{selectedScene.text}</p>
          </article>
          <div className={styles.grid}>
            {pullOrder.map((id) => (
              <Choice id={id} key={id} onClick={(value) => setPullIds(toggle(pullIds, value, 3))} selected={pullIds.includes(id)} title={pulls[id]} />
            ))}
          </div>
          <div className={styles.navRow}>
            <button className={styles.secondary} onClick={goPreviousProfileStep} type="button">Terug</button>
            <button className={styles.primaryInline} disabled={pullIds.length === 0} onClick={goNextProfileStep} type="button">Door naar rol</button>
          </div>
        </Scene>
      );
    }

    if (profileStep === 3) {
      return (
        <Scene step={4}>
          <span className={styles.kicker}>Stap 4 — de hoek</span>
          <h1>Welke rol pakt {subjectLabel} dan?</h1>
          <p className={styles.lead}>
            De woorden klinken scherp, daarom staan ze hier precies uitgelegd.
            Kies de rol die de automatische stand het beste vangt.
          </p>
          <RoleStage role={role} setRole={(nextRole) => {
            setRole(nextRole);
            setRoleSentence(roleSentences[nextRole][0] ?? roles[nextRole].line);
          }} />
          <article className={styles.card}>
            <h2>{roles[role].title}</h2>
            <p><strong>{roles[role].line}</strong></p>
            <p>{roles[role].description}</p>
          </article>
          <h2>Welke dramazin past?</h2>
          <div className={styles.grid}>
            {roleSentences[role].map((sentence) => (
              <Choice id={sentence} key={sentence} onClick={setRoleSentence} selected={roleSentence === sentence} title={sentence} />
            ))}
          </div>
          <div className={styles.navRow}>
            <button className={styles.secondary} onClick={goPreviousProfileStep} type="button">Terug</button>
            <button className={styles.primaryInline} onClick={goNextProfileStep} type="button">Verder</button>
          </div>
        </Scene>
      );
    }

    if (profileStep === 4) {
      return (
        <Scene step={5}>
          <span className={styles.kicker}>Stap 5 — winst en prijs</span>
          <h1>Wat levert deze rol op — en wat kost hij?</h1>
          <p className={styles.lead}>
            Een rol blijft vaak bestaan omdat hij iets beschermt. Daarom kijken
            we eerlijk naar beide kanten.
          </p>
          <h2>Wat beschermt deze rol?</h2>
          <div className={styles.grid}>
            {gainOrder.map((id) => (
              <Choice id={id} key={id} onClick={(value) => setGainIds(toggle(gainIds, value, 3))} selected={gainIds.includes(id)} title={gains[id]} />
            ))}
          </div>
          <h2>Wat kost deze rol?</h2>
          <div className={styles.grid}>
            {costOrder.map((id) => (
              <Choice id={id} key={id} onClick={(value) => setCostIds(toggle(costIds, value, 3))} selected={costIds.includes(id)} title={costs[id]} />
            ))}
          </div>
          <article className={styles.card}>
            <h2>Wat gebeurt er met de ander?</h2>
            <p>{invitedRoles[role]}</p>
          </article>
          <div className={styles.navRow}>
            <button className={styles.secondary} onClick={goPreviousProfileStep} type="button">Terug</button>
            <button className={styles.primaryInline} disabled={gainIds.length === 0 || costIds.length === 0} onClick={goNextProfileStep} type="button">Verder</button>
          </div>
        </Scene>
      );
    }

    return (
      <Scene step={6}>
        <span className={styles.kicker}>Stap 6 — patroonzin</span>
        <h1>Wat mag later geholpen worden?</h1>
        <p className={styles.lead}>
          Maak het concreet genoeg dat je date er later iets vriendelijks mee kan.
        </p>
        <h2>Waar draait {subjectLabel} vaak naartoe?</h2>
        <div className={styles.grid}>
          {shiftOrder.map((id) => (
            <Choice id={id} key={id} onClick={setShiftId} selected={shiftId === id} title={shifts[id]} />
          ))}
        </div>
        <label>
          <span className={styles.kicker}>Wat mag je date later weten?</span>
          <textarea className={styles.textarea} onChange={(event) => setWhatDateMayKnow(event.target.value)} value={whatDateMayKnow} />
        </label>
        {christianLayer && (
          <label>
            <span className={styles.kicker}>Christelijke reflectie</span>
            <textarea
              className={styles.textarea}
              onChange={(event) => setFaithReflection(event.target.value)}
              placeholder="Waar maak ik mij kleiner, speel ik redder, of gebruik ik waarheid als wapen?"
              value={faithReflection}
            />
          </label>
        )}
        <button
          className={styles.primary}
          disabled={pending || !complete || !sceneId || !subjectId}
          onClick={() => {
            if (!sceneId || !subjectId) return;
            const profile: DramadriehoekProfile = {
              sceneIds: [sceneId],
              feelingIds,
              pullIds,
              sceneResponses: {
                [sceneId]: { feelingIds, pullIds },
              },
              role,
              roleSentence: roleSentence.trim(),
              gainIds,
              costIds,
              shiftId,
              whatDateMayKnow: whatDateMayKnow.trim(),
              faithReflection: faithReflection.trim() || undefined,
            };
            dispatch({ type: "dramadriehoek.profile.submitted", actorId: subjectId, profile });
          }}
          type="button"
        >
          Bewaar driehoek van {subjectTitle}
        </button>
        <button className={styles.backPlain} onClick={goPreviousProfileStep} type="button">Terug</button>
      </Scene>
    );
  }

  return (
    <Scene step={6}>
      <span className={styles.kicker}>Opgeslagen voor jullie profiel</span>
      <h1>Driehoek opgeslagen</h1>
      <p className={styles.lead}>
        De driehoek van {subjectTitle} is opgeslagen. Dit spel wordt nu
        afgerond; daarna kan de ander het spel ook doen.
      </p>
      <div className={styles.two}>
        <ProfileCard label={subjectTitle} profile={subjectProfile} />
      </div>
      <article className={styles.card}>
        <span className={styles.kicker}>Voor straks op kaart 5</span>
        <h2>De volwassen plek</h2>
        <p>{roles[subjectProfile.role].adultMove}</p>
      </article>
    </Scene>
  );
}
