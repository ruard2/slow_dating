import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type {
  OudeEikAction,
  OudeEikPortrait,
  OudeEikState,
} from "./contracts";
import {
  atmosphereOptions,
  christianPrompts,
  conversationQuestions,
  messageOptions,
  needOptions,
  responseOptions,
  roleOptions,
} from "./content";
import { FaithLayer } from "../FaithLayer";
import styles from "./OudeEikGame.module.css";

type Option = { id: string; label: string };

function label(options: readonly Option[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

function Waiting({ partnerName }: { partnerName: string }) {
  return (
    <div className={styles.waiting}>
      <h2>Even onder de oude eik</h2>
      <p>{partnerName} maakt het eigen verhaal af.</p>
    </div>
  );
}

export function OudeEikGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  priorFamilyData,
  state,
}: GameComponentProps<OudeEikState, OudeEikAction>) {
  const [portrait, setPortrait] = useState<Partial<OudeEikPortrait>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const own = state.portraits[installationId];
  const partner = state.portraits[partnerId];
  const bothSubmitted = memberIds.every((id) => Boolean(state.portraits[id]));
  const allUnderstood = memberIds.every((id) => state.understoodIds.includes(id));
  const allDone = memberIds.every((id) =>
    state.conversationDoneIds.includes(id),
  );
  const familySummary =
    priorFamilyData &&
    typeof priorFamilyData === "object" &&
    !Array.isArray(priorFamilyData)
      ? priorFamilyData
      : null;

  function choose<K extends keyof OudeEikPortrait>(
    key: K,
    value: OudeEikPortrait[K],
  ) {
    setPortrait((current) => ({ ...current, [key]: value }));
  }

  if (!own) {
    const complete =
      portrait.atmosphere &&
      portrait.message &&
      portrait.role &&
      portrait.response &&
      portrait.need &&
      portrait.keep?.trim() &&
      portrait.change?.trim();
    const questions = [
      ["Hoe voelde de sfeer thuis meestal?", "atmosphere", atmosphereOptions],
      ["Welke ongeschreven regel leerde je?", "message", messageOptions],
      ["Welke plek nam jij vaak in?", "role", roleOptions],
      ["Wat doe je nu automatisch als nabijheid spannend wordt?", "response", responseOptions],
      ["Wat heb je op zo'n moment eigenlijk nodig?", "need", needOptions],
    ] as const;
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Oude Eik</span>
          <h1>Wat heeft jou gevormd?</h1>
          <p className={styles.lead}>
            Familiedorp liet zien wie en wat er om je heen stond. Hier kijken
            we voorzichtig naar wat je daar leerde over nabijheid, spanning en
            zorg. Het gaat niet om schuld, maar om begrijpen wat je ooit hielp
            en wat je nu bewust anders kunt kiezen.
          </p>
          {familySummary && (
            <div className={styles.roots}>
              <div className={styles.root}>
                <strong>Je eerdere familiedorp is bewaard</strong>
                <span>
                  Gebruik wat je daar opviel als vertrekpunt. Je hoeft niets
                  opnieuw op te bouwen.
                </span>
              </div>
              <div className={styles.root}>
                <strong>Kijk met mildheid</strong>
                <span>
                  Een oude reactie was vaak ooit een slimme manier om erbij te
                  horen, rust te bewaren of jezelf te beschermen.
                </span>
              </div>
            </div>
          )}
          {questions.map(([title, key, options]) => (
            <div className={styles.question} key={key}>
              <h2>{title}</h2>
              <div className={styles.options}>
                {options.map((option) => (
                  <button
                    data-selected={portrait[key] === option.id}
                    key={option.id}
                    onClick={() =>
                      choose(
                        key,
                        option.id as OudeEikPortrait[typeof key],
                      )
                    }
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.question}>
            <h2>Wat wil je graag meenemen uit jouw thuis?</h2>
            <textarea
              maxLength={180}
              onChange={(event) => choose("keep", event.target.value)}
              placeholder="Een kwaliteit, gewoonte of vorm van liefde..."
              value={portrait.keep ?? ""}
            />
          </div>
          <div className={styles.question}>
            <h2>Welke oude regel wil je in deze relatie losser maken?</h2>
            <textarea
              maxLength={180}
              onChange={(event) => choose("change", event.target.value)}
              placeholder="Bijvoorbeeld: ik hoef niet alles alleen op te lossen..."
              value={portrait.change ?? ""}
            />
          </div>
          <button
            className={styles.primary}
            disabled={pending || !complete}
            onClick={() =>
              dispatch({
                type: "oude-eik.portrait.submitted",
                actorId: installationId,
                portrait: portrait as OudeEikPortrait,
              })
            }
            type="button"
          >
            Leg mijn wortels onder de eik
          </button>
        </div>
      </section>
    );
  }

  if (!bothSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <Waiting partnerName={partnerName} />
        </div>
      </section>
    );
  }

  if (!allUnderstood) {
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Naast elkaar, niet tegenover elkaar</span>
          <h1>Twee geschiedenissen aan dezelfde tafel</h1>
          <p className={styles.lead}>
            Een automatische reactie zegt vaak meer over bescherming dan over
            onwil. Lees eerst om te begrijpen; ga nog niet verbeteren.
          </p>
          <div className={styles.comparison}>
            {[
              ["Jij", own],
              [partnerName, partner],
            ].map(([name, item]) => {
              const value = item as OudeEikPortrait;
              return (
                <article className={styles.portrait} key={String(name)}>
                  <h2>{String(name)}</h2>
                  <dl>
                    <div><dt>Sfeer</dt><dd>{label(atmosphereOptions, value.atmosphere)}</dd></div>
                    <div><dt>Geleerde regel</dt><dd>{label(messageOptions, value.message)}</dd></div>
                    <div><dt>Oude rol</dt><dd>{label(roleOptions, value.role)}</dd></div>
                    <div><dt>Onder spanning</dt><dd>{label(responseOptions, value.response)}</dd></div>
                    <div><dt>Behoefte eronder</dt><dd>{label(needOptions, value.need)}</dd></div>
                    <div><dt>Meenemen</dt><dd>{value.keep}</dd></div>
                    <div><dt>Anders kiezen</dt><dd>{value.change}</dd></div>
                  </dl>
                </article>
              );
            })}
          </div>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({ type: "oude-eik.understood", actorId: installationId })
            }
            type="button"
          >
            Ik heb eerst geprobeerd te begrijpen
          </button>
        </div>
      </section>
    );
  }

  if (!allDone) {
    const question =
      conversationQuestions[questionIndex % conversationQuestions.length]!;
    return (
      <section className={styles.game}>
        <div className={styles.panel}>
          <span className={styles.kicker}>Een gesprek met zachte randen</span>
          <h1>Van oude reflex naar nieuwe keuze</h1>
          <div className={styles.prompt}>{question}</div>
          <div className={styles.actions}>
            <button className={styles.secondary} onClick={() => setQuestionIndex((value) => value + 1)} type="button">Andere vraag</button>
            <button className={styles.secondary} onClick={() => openChat?.(question)} type="button">Open chat</button>
            <button className={styles.secondary} onClick={() => openCall?.()} type="button">Bel elkaar</button>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "oude-eik.conversation.done",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Gesprek afgerond
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <span className={styles.kicker}>Bewaard in jullie profiel</span>
        <h1>Jullie wortels zijn zichtbaarder</h1>
        <p className={styles.lead}>
          De app bewaart afzonderlijk wat ieder meeneemt, hoe spanning zich
          kan uiten en welke behoefte daaronder ligt. Dat helpt latere
          oefeningen beter aansluiten zonder van patronen vaste etiketten te
          maken.
        </p>
        {christianLayer && (
          <FaithLayer
            intro="Wat je meedraagt uit je familie mag je ook in geloof onderzoeken."
            prompts={[...christianPrompts]}
          />
        )}
        <button
          className={styles.primary}
          disabled={pending}
          onClick={() =>
            dispatch({ type: "oude-eik.game.completed", actorId: installationId })
          }
          type="button"
        >
          Terug naar kaart 2
        </button>
      </div>
    </section>
  );
}
