import { useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import { api } from "../../../lib/api";
import {
  conversationStarters,
  dateObjects,
  maxDateObjects,
  tableSpots,
  type DateObject,
} from "./content";
import type { KleineDateAction, KleineDateState } from "./contracts";
import styles from "./KleineDateGame.module.css";

const categories = [
  "Alles",
  "Eten & drinken",
  "Knus & rustig",
  "Buiten & natuur",
  "Actief & avontuurlijk",
  "Cultuur & stad",
  "Persoonlijk & sfeer",
  "Christelijke laag",
] as const;

function joinNice(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} en ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} en ${items.at(-1)}`;
}

function lower(label: string) {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

function generateDateSummary(objects: DateObject[]) {
  const labels = objects.map((object) => lower(object.label));
  const hasFaith = objects.some((object) => object.requiresChristianLayer);
  const outdoor = objects.find((object) => object.tags.includes("buiten"));
  const active = objects.some((object) => object.tags.includes("actief"));
  const quiet = objects.some((object) => object.tags.includes("rustig"));
  const foodObjects = objects.filter((object) => object.tags.includes("eten") || object.tags.includes("drinken"));
  const music = objects.find((object) => object.tags.includes("muziek"));
  const culture = objects.find((object) => object.category === "Cultuur & stad");
  const cozy = objects.find((object) => object.category === "Knus & rustig");
  const opener = joinNice(labels.slice(0, 2));
  const extras = joinNice(labels.slice(2, 6));
  const snackJoke = foodObjects.length >= 4
    ? "Er is opvallend veel eten bij, wat verstandig is: honger is zelden romantisch."
    : foodObjects.length >= 2
      ? "Er is genoeg lekkers om het niet alleen bij diepe blikken te laten."
      : "";
  const rhythm = active && quiet
    ? "Het wordt rustig beginnen en daarna toch iets doen; precies genoeg avontuur zonder survivalcursus."
    : active
      ? "Jullie hoeven dus niet de hele tijd tegenover elkaar te zitten alsof iemand notulen maakt."
      : "Het blijft klein, warm en gelukkig niet zo'n sollicitatiegesprek met kaarslicht.";
  const faithLine = hasFaith
    ? " Geloof mag warm en gewoon meedoen, zonder preekstem of plechtige pauzemuziek."
    : "";
  const cultureLine = culture ? ` ${culture.label} geeft iets om samen te bekijken als het gesprek even moet opwarmen.` : "";
  const musicLine = music ? ` Met ${lower(music.label)} krijgt het net wat extra filmgevoel, maar zonder eindcredits.` : "";
  const cozyLine = cozy ? ` ${cozy.label} maakt het zachter en minder prestatie-date.` : "";
  const outsideLine = outdoor ? ` ${outdoor.label} trekt jullie naar buiten; als het regent, noemen jullie het gewoon sfeer.` : "";

  return `Jullie date: begin met ${opener || "iets kleins"}${extras ? `, en laat ${extras} rustig aansluiten` : ""}. ${rhythm} ${snackJoke}${outsideLine}${cultureLine}${cozyLine}${musicLine}${faithLine}`.replace(/\s+/g, " ").trim();
}

function objectById(id: string) {
  return dateObjects.find((object) => object.id === id);
}

function PickRow({
  label,
  selections,
}: {
  label: string;
  selections: KleineDateState["selections"];
}) {
  return (
    <section className={styles.pickRow}>
      <strong>{label}</strong>
      <div>
        {selections.map((selection) => {
          const object = objectById(selection.objectId);
          if (!object) return null;
          return (
            <span key={`${selection.objectId}-${selection.turn}`} title={object.label}>
              <i>{object.icon}</i>
              <small>{object.label}</small>
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function KleineDateGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pauseGame,
  pending,
  state,
}: GameComponentProps<KleineDateState, KleineDateAction>) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Alles");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [starter, setStarter] = useState("");
  const [tableHot, setTableHot] = useState(false);
  const [summaryPending, setSummaryPending] = useState(false);
  const selectedIds = new Set(state.selections.map((selection) => selection.objectId));
  const turnActorId = memberIds[state.selections.length % Math.max(1, memberIds.length)] ?? installationId;
  const ownTurn = turnActorId === installationId || memberIds.length < 2;
  const isDone = state.selections.length >= maxDateObjects;
  const hasSummary = Boolean(state.summary);
  const chosenObjects = state.selections
    .map((selection) => objectById(selection.objectId))
    .filter((object): object is DateObject => Boolean(object));
  const ownSelections = state.selections.filter(
    (selection) => selection.actorId === installationId,
  );
  const partnerSelections = state.selections.filter(
    (selection) => selection.actorId !== installationId,
  );

  const visibleObjects = useMemo(
    () =>
      dateObjects.filter((object) => {
        if (object.requiresChristianLayer && !christianLayer) return false;
        if (activeCategory !== "Alles" && object.category !== activeCategory) return false;
        return true;
      }),
    [activeCategory, christianLayer],
  );

  const placeObject = async (objectId: string) => {
    if (!ownTurn || pending || isDone || selectedIds.has(objectId) || state.summary) return;
    const object = objectById(objectId);
    if (!object || (object.requiresChristianLayer && !christianLayer)) return;
    await dispatch({
      type: "kleine-date.object.placed",
      actorId: installationId,
      objectId,
    });
  };

  const removeObject = async (objectId: string) => {
    if (pending || state.summary) return;
    await dispatch({
      type: "kleine-date.object.removed",
      actorId: installationId,
      objectId,
    });
  };

  const makeDate = async () => {
    if (pending || summaryPending || state.summary || chosenObjects.length < 2) return;
    setSummaryPending(true);
    try {
      let summary = generateDateSummary(chosenObjects);
      try {
        const response = await api.generateDateSummary(
          chosenObjects.map((object) => ({
            label: object.label,
            category: object.category,
            tags: object.tags,
            christian: Boolean(object.requiresChristianLayer),
          })),
        );
        summary = response.summary;
      } catch (error) {
        console.warn(
          "AI-datebeschrijving niet beschikbaar; lokale fallback gebruikt.",
          error,
        );
      }
      await dispatch({
        type: "kleine-date.summary.generated",
        actorId: installationId,
        summary,
      });
    } finally {
      setSummaryPending(false);
    }
  };

  const finish = async () => {
    await dispatch({ type: "kleine-date.game.completed", actorId: installationId });
  };

  const replay = async () => {
    await dispatch({ type: "kleine-date.game.replayed", actorId: installationId });
  };

  const showStarter = () => {
    const next =
      conversationStarters[
        (state.selections.length + starter.length + Date.now()) %
          conversationStarters.length
      ] ?? conversationStarters[0]!;
    setStarter(next);
  };

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <span className={styles.kicker}>Laatste spel · Samen leven</span>
          <h1>{hasSummary ? "Ons voorstel voor jullie date" : "Plan een kleine date"}</h1>
          <p>
            {hasSummary
              ? "Een lichte samenvatting van wat jullie samen op tafel legden."
              : "Sleep of tik om de beurt 16 dingen naar jullie tafel."}
          </p>
        </header>

        <div className={styles.scene} data-summary={hasSummary}>
          {!hasSummary && (
            <>
              <div className={styles.status}>
                <span>{ownTurn ? "Jij bent aan de beurt" : `${partnerName} is aan de beurt`}</span>
                <strong>{state.selections.length}/{maxDateObjects}</strong>
              </div>
              <div
                className={styles.table}
                data-hot={tableHot}
                onDragOver={(event) => {
                  event.preventDefault();
                  setTableHot(true);
                }}
                onDragLeave={() => setTableHot(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setTableHot(false);
                  const objectId = draggedId || event.dataTransfer.getData("text/plain");
                  if (objectId) void placeObject(objectId);
                }}
              >
                {state.selections.map((selection, index) => {
                  const object = objectById(selection.objectId);
                  const spot = tableSpots[index % tableSpots.length]!;
                  if (!object) return null;
                  return (
                    <button
                      className={styles.placed}
                      key={`${selection.objectId}-${selection.turn}`}
                      onClick={() => removeObject(selection.objectId)}
                      style={{ left: `${spot[0]}%`, top: `${spot[1]}%` }}
                      title={`${object.label} verwijderen`}
                      type="button"
                    >
                      <span>{object.icon}</span>
                      <small>{object.label}</small>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {hasSummary && (
            <div className={styles.result}>
              <article className={styles.summary}>
                <span>Jullie datevoorstel</span>
                <p>{state.summary}</p>
                <div>
                  <button className={styles.primary} disabled={pending} onClick={finish} type="button">
                    Terug naar kaart
                  </button>
                  <button className={styles.secondary} disabled={pending} onClick={replay} type="button">
                    Opnieuw spelen
                  </button>
                </div>
              </article>
              <div className={styles.pickRows}>
                <PickRow label="Jij koos" selections={ownSelections} />
                <PickRow label={`${partnerName} koos`} selections={partnerSelections} />
              </div>
            </div>
          )}
        </div>

        {!hasSummary && (
          <>
            <nav className={styles.categories} aria-label="Date-categorieën">
              {categories
                .filter((category) => christianLayer || category !== "Christelijke laag")
                .map((category) => (
                  <button
                    data-active={activeCategory === category}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
            </nav>

            <div className={styles.drawer} aria-label="Date-objecten">
              {visibleObjects.map((object) => {
                const selected = selectedIds.has(object.id);
                return (
                  <button
                    className={styles.object}
                    data-selected={selected}
                    draggable={!selected && ownTurn && !isDone}
                    key={object.id}
                    onClick={() => placeObject(object.id)}
                    onDragEnd={() => setDraggedId(null)}
                    onDragStart={(event) => {
                      setDraggedId(object.id);
                      event.dataTransfer.setData("text/plain", object.id);
                    }}
                    type="button"
                  >
                    <span>{object.icon}</span>
                    <b>{object.label}</b>
                    <small>{object.category}</small>
                  </button>
                );
              })}
            </div>

            <footer className={styles.footer}>
              <button className={styles.secondary} onClick={showStarter} type="button">
                Conversationstarter
              </button>
              <button className={styles.secondary} onClick={pauseGame} type="button">
                Terug
              </button>
              <button
                className={styles.primary}
                disabled={pending || summaryPending || chosenObjects.length < 2}
                onClick={makeDate}
                type="button"
              >
                {summaryPending ? "Date brouwen..." : "Maak onze date"}
              </button>
            </footer>
          </>
        )}

        {starter && !hasSummary && (
          <div className={styles.starter}>
            <span>Perkamentje</span>
            <p>{starter}</p>
          </div>
        )}

      </div>
    </section>
  );
}
