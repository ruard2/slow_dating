import { useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  baseHouseTasks,
  christianHouseTasks,
  comparisonReactions,
  experimentTemplates,
  faithRisks,
  ownershipParts,
  rhythms,
  taskById,
} from "./content";
import type {
  HuishoudtafelAction,
  HuishoudtafelState,
  TaskOwner,
  TaskRhythm,
} from "./contracts";
import {
  getComparisonTaskIds,
  handledTaskIds,
} from "./reducer";
import styles from "./HuishoudtafelGame.module.css";

function Pause({
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
}: {
  partnerName: string;
  pauseGame: (() => void) | undefined;
  pending: boolean;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.waiting}>
        <span className={styles.kicker}>Even wachten op elkaar</span>
        <h1>Jouw kant van de tafel ligt klaar</h1>
        <p>We schuiven de borden over elkaar zodra {partnerName} ook klaar is.</p>
        <Pause pauseGame={pauseGame} pending={pending} />
      </div>
    </section>
  );
}

function ownerLabel(
  owner: TaskOwner,
  ownName: string,
  partnerName: string,
) {
  return owner === "self" ? ownName : partnerName;
}

export function HuishoudtafelGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pauseGame,
  pending,
  state,
}: GameComponentProps<HuishoudtafelState, HuishoudtafelAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const visibleTasks = useMemo(
    () =>
      christianLayer
        ? [...baseHouseTasks, ...christianHouseTasks]
        : baseHouseTasks,
    [christianLayer],
  );
  const visibleTaskIds = useMemo(
    () => visibleTasks.map((task) => task.id),
    [visibleTasks],
  );
  const ownPlacements = state.placementsByPerson[installationId] ?? {};
  const partnerPlacements = state.placementsByPerson[partnerId] ?? {};
  const handled = handledTaskIds(state, installationId);
  const currentTask = visibleTasks.find((task) => !handled.has(task.id));
  const ownSubmitted = state.submittedIds.includes(installationId);
  const bothSubmitted = memberIds.every((id) => state.submittedIds.includes(id));
  const comparisonIds = useMemo(() => {
    const differences = getComparisonTaskIds(
      state,
      installationId,
      partnerId,
      5,
    );
    if (differences.length) return differences;
    return visibleTasks
      .filter(
        (task) =>
          ownPlacements[task.id] || partnerPlacements[task.id],
      )
      .slice(0, 3)
      .map((task) => task.id);
  }, [
    installationId,
    ownPlacements,
    partnerId,
    partnerPlacements,
    state,
    visibleTasks,
  ]);
  const ownComparisonDone = state.comparisonSubmittedIds.includes(
    installationId,
  );
  const bothComparisonDone = memberIds.every((id) =>
    state.comparisonSubmittedIds.includes(id),
  );
  const detailTaskIds = comparisonIds.slice(0, 3);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailDraft, setDetailDraft] = useState<
    Record<
      string,
      Partial<Record<"notice" | "plan" | "execute", TaskOwner>>
    >
  >({});
  const ownDetailsDone = state.detailsSubmittedIds.includes(installationId);
  const bothDetailsDone = memberIds.every((id) =>
    state.detailsSubmittedIds.includes(id),
  );
  const [faithTaskId, setFaithTaskId] = useState(detailTaskIds[0] ?? "");
  const [faithRisk, setFaithRisk] = useState("");
  const [faithReflection, setFaithReflection] = useState("");
  const ownFaithDone = state.faithSubmittedIds.includes(installationId);
  const bothFaithDone =
    !christianLayer ||
    memberIds.every((id) => state.faithSubmittedIds.includes(id));
  const [experimentTaskId, setExperimentTaskId] = useState(
    comparisonIds[0] ?? "",
  );
  const [experimentText, setExperimentText] = useState("");
  const [experimentDraft, setExperimentDraft] = useState<
    Array<{ taskId: string; text: string }>
  >([]);
  const [drag, setDrag] = useState<{
    startX: number;
    startY: number;
    x: number;
    y: number;
  } | null>(null);
  const ownExperimentConfirmed = state.experimentConfirmedIds.includes(
    installationId,
  );
  const allExperimentsConfirmed =
    state.experiments.length > 0 &&
    memberIds.every((id) => state.experimentConfirmedIds.includes(id));

  const placeTask = (
    taskId: string,
    owner: TaskOwner,
    rhythm: TaskRhythm,
  ) =>
    dispatch({
      type: "huishoudtafel.task.placed",
      actorId: installationId,
      taskId,
      owner,
      rhythm,
    });

  if (!ownSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.boardPanel}>
          <header className={styles.boardHeader}>
            <div>
              <span className={styles.kicker}>De Huishoudtafel</span>
              <h1>Wie draagt wat—en hoe vaak?</h1>
              <p>
                Pak de bovenste taak. Leg hem bij degene die meestal merkt dat
                het nodig is en zorgt dat het gebeurt.
                {christianLayer
                  ? " De christelijke taken liggen ook op tafel."
                  : ""}
              </p>
            </div>
            <div className={styles.counter}>
              <strong>{handled.size}</strong>
              <span>van {visibleTasks.length}</span>
            </div>
          </header>

          <div className={styles.playArea}>
          <div className={styles.tableBoard}>
            <div className={styles.corner}>Ritme</div>
            <div className={styles.personHead}>Jij</div>
            <div className={styles.personHead}>{partnerName}</div>
            {rhythms.map((rhythm) => (
              <div className={styles.boardRow} key={rhythm.id}>
                <div className={styles.rhythmHead}>
                  <span>{rhythm.icon}</span>
                  <b>{rhythm.label}</b>
                </div>
                {(["self", "partner"] as const).map((owner) => (
                  <button
                    aria-label={`Leg taak bij ${
                      owner === "self" ? "jou" : partnerName
                    }, ${rhythm.label.toLowerCase()}`}
                    className={styles.dropCell}
                    data-drop-owner={owner}
                    data-drop-rhythm={rhythm.id}
                    data-owner={owner}
                    disabled={pending}
                    key={`${rhythm.id}-${owner}`}
                    onClick={() => {
                      if (currentTask) {
                        void placeTask(currentTask.id, owner, rhythm.id);
                      }
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const taskId = event.dataTransfer.getData("text/task-id");
                      if (taskId) void placeTask(taskId, owner, rhythm.id);
                    }}
                    type="button"
                  >
                    <span className={styles.dropHint}>Leg hier</span>
                    <div>
                      {visibleTasks
                        .filter(
                          (task) =>
                            ownPlacements[task.id]?.owner === owner &&
                            ownPlacements[task.id]?.rhythm === rhythm.id,
                        )
                        .map((task) => (
                          <span
                            className={styles.miniTask}
                            key={task.id}
                            onClick={(event) => event.stopPropagation()}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              event.currentTarget.setPointerCapture(
                                event.pointerId,
                              );
                              event.currentTarget.dataset.startX = String(
                                event.clientX,
                              );
                              event.currentTarget.dataset.startY = String(
                                event.clientY,
                              );
                            }}
                            onPointerMove={(event) => {
                              const startX = Number(
                                event.currentTarget.dataset.startX,
                              );
                              const startY = Number(
                                event.currentTarget.dataset.startY,
                              );
                              if (!Number.isFinite(startX)) return;
                              event.currentTarget.style.transform = `translate(${
                                event.clientX - startX
                              }px, ${event.clientY - startY}px)`;
                            }}
                            onPointerUp={(event) => {
                              const target = document
                                .elementsFromPoint(
                                  event.clientX,
                                  event.clientY,
                                )
                                .find(
                                  (element) =>
                                    element instanceof HTMLElement &&
                                    element.dataset.dropOwner &&
                                    element.dataset.dropRhythm,
                                ) as HTMLElement | undefined;
                              event.currentTarget.style.transform = "";
                              delete event.currentTarget.dataset.startX;
                              delete event.currentTarget.dataset.startY;
                              if (!target) return;
                              void placeTask(
                                task.id,
                                target.dataset.dropOwner as TaskOwner,
                                target.dataset.dropRhythm as TaskRhythm,
                              );
                            }}
                          >
                            {task.emoji} {task.label}
                          </span>
                        ))}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {currentTask ? (
            <div className={styles.taskStack}>
              <div className={styles.stackShadow} />
              <article
                className={styles.activeTask}
                data-dragging={Boolean(drag)}
                onPointerCancel={() => setDrag(null)}
                onPointerDown={(event) => {
                  if (pending) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDrag({
                    startX: event.clientX,
                    startY: event.clientY,
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
                onPointerMove={(event) => {
                  if (!drag) return;
                  setDrag((current) =>
                    current
                      ? { ...current, x: event.clientX, y: event.clientY }
                      : null,
                  );
                }}
                onPointerUp={(event) => {
                  const target = document
                    .elementsFromPoint(event.clientX, event.clientY)
                    .find(
                      (element) =>
                        element instanceof HTMLElement &&
                        element.dataset.dropOwner &&
                        element.dataset.dropRhythm,
                    ) as HTMLElement | undefined;
                  setDrag(null);
                  if (!target) return;
                  void placeTask(
                    currentTask.id,
                    target.dataset.dropOwner as TaskOwner,
                    target.dataset.dropRhythm as TaskRhythm,
                  );
                }}
                style={
                  drag
                    ? {
                        transform: `translate(${
                          drag.x - drag.startX
                        }px, ${drag.y - drag.startY}px) rotate(${
                          (drag.x - drag.startX) / 45
                        }deg)`,
                      }
                    : undefined
                }
              >
                <span>{currentTask.emoji}</span>
                <div>
                  <h2>{currentTask.label}</h2>
                  <p>{currentTask.detail}</p>
                </div>
                <small>Sleep naar het bord of tik een vak</small>
              </article>
              <button
                className={styles.notOurs}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "huishoudtafel.task.skipped",
                    actorId: installationId,
                    taskId: currentTask.id,
                  })
                }
                type="button"
              >
                Niet bij ons
              </button>
            </div>
          ) : (
            <div className={styles.boardReady}>
              <span>✓</span>
              <h2>Alle taken liggen op tafel</h2>
              <p>Je kunt kaartjes nog verslepen of je bord klaarzetten.</p>
              <button
                className={styles.primary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "huishoudtafel.distribution.submitted",
                    actorId: installationId,
                    requiredTaskIds: visibleTaskIds,
                  })
                }
                type="button"
              >
                Mijn bord is klaar
              </button>
            </div>
          )}
          </div>
          <Pause pauseGame={pauseGame} pending={pending} />
        </div>
      </section>
    );
  }

  if (!bothSubmitted) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
      />
    );
  }

  if (!ownComparisonDone) {
    const unansweredId = comparisonIds.find(
      (taskId) => !state.comparisonReactions[installationId]?.[taskId],
    );
    if (unansweredId) {
      const task = taskById(unansweredId)!;
      const own = ownPlacements[unansweredId];
      const partnerView = partnerPlacements[unansweredId];
      return (
        <section className={styles.game}>
          <div className={styles.comparePanel}>
            <span className={styles.kicker}>Twee huishoudkaarten</span>
            <h1>{task.emoji} {task.label}</h1>
            <div className={styles.twoViews}>
              <article>
                <span>Jouw beeld</span>
                <strong>
                  {own
                    ? `${ownerLabel(own.owner, "Jij", partnerName)} · ${
                        rhythms.find((rhythm) => rhythm.id === own.rhythm)
                          ?.label
                      }`
                    : "Niet bij ons"}
                </strong>
              </article>
              <article>
                <span>Beeld van {partnerName}</span>
                <strong>
                  {partnerView
                    ? `${ownerLabel(
                        partnerView.owner,
                        partnerName,
                        "Jij",
                      )} · ${
                        rhythms.find(
                          (rhythm) => rhythm.id === partnerView.rhythm,
                        )?.label
                      }`
                    : "Niet bij ons"}
                </strong>
              </article>
            </div>
            <p>Wat is je eerste reactie op dit verschil?</p>
            <div className={styles.reactionCards}>
              {comparisonReactions.map((reaction) => (
                <button
                  disabled={pending}
                  key={reaction}
                  onClick={() =>
                    dispatch({
                      type: "huishoudtafel.comparison.reacted",
                      actorId: installationId,
                      taskId: unansweredId,
                      reaction,
                    })
                  }
                  type="button"
                >
                  {reaction}
                </button>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className={styles.game}>
        <div className={styles.checkpoint}>
          <span className={styles.kicker}>Eerste vergelijking klaar</span>
          <h1>Niet alles hoeft meteen anders</h1>
          <p>
            Jullie verschillen laten vooral zien wat zichtbaar of
            vanzelfsprekend voelt. De volgende stap kijkt bij enkele taken
            onder het woord “doen”.
          </p>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "huishoudtafel.comparison.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            Kijk naar zien, plannen en uitvoeren
          </button>
        </div>
      </section>
    );
  }

  if (!bothComparisonDone) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
      />
    );
  }

  if (!ownDetailsDone) {
    const taskId = detailTaskIds[detailIndex];
    if (taskId) {
      const task = taskById(taskId)!;
      const draft = detailDraft[taskId] ?? {};
      return (
        <section className={styles.game}>
          <div className={styles.detailPanel}>
            <span className={styles.kicker}>
              Onder de taak · {detailIndex + 1} van {detailTaskIds.length}
            </span>
            <h1>{task.emoji} {task.label}</h1>
            <p>Wie draagt ieder stukje volgens jou meestal?</p>
            <div className={styles.ownershipParts}>
              {ownershipParts.map((part) => (
                <article key={part.id}>
                  <span>{part.icon}</span>
                  <h2>{part.label}</h2>
                  <div>
                    {(["self", "partner"] as const).map((owner) => (
                      <button
                        data-active={draft[part.id] === owner}
                        key={owner}
                        onClick={() =>
                          setDetailDraft((current) => ({
                            ...current,
                            [taskId]: {
                              ...(current[taskId] ?? {}),
                              [part.id]: owner,
                            },
                          }))
                        }
                        type="button"
                      >
                        {owner === "self" ? "Jij" : partnerName}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <button
              className={styles.primary}
              disabled={
                ownershipParts.some((part) => !draft[part.id]) || pending
              }
              onClick={async () => {
                for (const part of ownershipParts) {
                  await dispatch({
                    type: "huishoudtafel.ownership.set",
                    actorId: installationId,
                    taskId,
                    part: part.id,
                    owner: draft[part.id]!,
                  });
                }
                setDetailIndex((index) => index + 1);
              }}
              type="button"
            >
              Volgende taak
            </button>
          </div>
        </section>
      );
    }
    return (
      <section className={styles.game}>
        <div className={styles.checkpoint}>
          <span className={styles.kicker}>De onzichtbare laag</span>
          <h1>Uitvoeren is maar één deel van dragen</h1>
          <p>
            Jullie antwoorden over signaleren, onthouden en uitvoeren zijn
            apart opgeslagen. Daardoor blijft mentale last later herkenbaar.
          </p>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "huishoudtafel.details.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            Naar de gezamenlijke tafel
          </button>
        </div>
      </section>
    );
  }

  if (!bothDetailsDone) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
      />
    );
  }

  if (christianLayer && !ownFaithDone) {
    return (
      <section className={styles.game}>
        <div className={styles.faithPanel}>
          <span className={styles.kicker}>Christelijke verdieping</span>
          <h1>Dienen zonder jezelf of de ander kleiner te maken</h1>
          <p>
            Kies één taak waar liefde en spanning dicht bij elkaar kunnen
            liggen.
          </p>
          <div className={styles.faithTasks}>
            {detailTaskIds.map((taskId) => {
              const task = taskById(taskId)!;
              return (
                <button
                  data-active={faithTaskId === taskId}
                  key={taskId}
                  onClick={() => setFaithTaskId(taskId)}
                  type="button"
                >
                  {task.emoji} {task.label}
                </button>
              );
            })}
          </div>
          <h2>Welk risico kan hier soms onder zitten?</h2>
          <div className={styles.faithRisks}>
            {faithRisks.map((risk) => (
              <button
                data-active={faithRisk === risk}
                key={risk}
                onClick={() => setFaithRisk(risk)}
                type="button"
              >
                {risk}
              </button>
            ))}
          </div>
          <label>
            <span>
              Wat zou verborgen liefde hier betekenen zonder iemand weg te
              cijferen?
            </span>
            <textarea
              maxLength={500}
              onChange={(event) => setFaithReflection(event.target.value)}
              rows={3}
              value={faithReflection}
            />
          </label>
          <button
            className={styles.primary}
            disabled={!faithTaskId || !faithRisk || pending}
            onClick={() =>
              dispatch({
                type: "huishoudtafel.faith.submitted",
                actorId: installationId,
                taskId: faithTaskId,
                risk: faithRisk,
                reflection: faithReflection,
              })
            }
            type="button"
          >
            Bewaar deze verdieping
          </button>
        </div>
      </section>
    );
  }

  if (!bothFaithDone) {
    return (
      <Waiting
        partnerName={partnerName}
        pauseGame={pauseGame}
        pending={pending}
      />
    );
  }

  if (!allExperimentsConfirmed) {
    const proposed = state.experiments.length > 0;
    return (
      <section className={styles.game}>
        <div className={styles.experimentPanel}>
          <span className={styles.kicker}>De tafel blijft beweeglijk</span>
          <h1>Kies hoogstens twee kleine experimenten</h1>
          <p>
            Geen definitieve eerlijke verdeling. Alleen iets concreets dat
            jullie twee weken kunnen proberen of observeren.
          </p>
          {!proposed && (
            <>
              <div className={styles.experimentTasks}>
                {comparisonIds.map((taskId) => {
                  const task = taskById(taskId)!;
                  return (
                    <button
                      data-active={experimentTaskId === taskId}
                      key={taskId}
                      onClick={() => setExperimentTaskId(taskId)}
                      type="button"
                    >
                      {task.emoji} {task.label}
                    </button>
                  );
                })}
              </div>
              <div className={styles.experimentTemplates}>
                {experimentTemplates.map((template) => (
                  <button
                    data-active={experimentText === template}
                    key={template}
                    onClick={() => setExperimentText(template)}
                    type="button"
                  >
                    {template}
                  </button>
                ))}
              </div>
              <div className={styles.draftExperiments}>
                {experimentDraft.map((experiment) => (
                  <article key={`${experiment.taskId}-${experiment.text}`}>
                    <b>{taskById(experiment.taskId)?.label}</b>
                    <span>{experiment.text}</span>
                  </article>
                ))}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.secondary}
                  disabled={
                    !experimentTaskId ||
                    !experimentText ||
                    experimentDraft.length >= 2
                  }
                  onClick={() => {
                    setExperimentDraft((current) => [
                      ...current.filter(
                        (item) => item.taskId !== experimentTaskId,
                      ),
                      { taskId: experimentTaskId, text: experimentText },
                    ].slice(0, 2));
                    setExperimentText("");
                  }}
                  type="button"
                >
                  Voeg experiment toe
                </button>
                <button
                  className={styles.primary}
                  disabled={!experimentDraft.length || pending}
                  onClick={() =>
                    dispatch({
                      type: "huishoudtafel.experiments.proposed",
                      actorId: installationId,
                      experiments: experimentDraft,
                    })
                  }
                  type="button"
                >
                  Leg dit voorstel op tafel
                </button>
              </div>
            </>
          )}
          {proposed && (
            <>
              <div className={styles.proposedExperiments}>
                {state.experiments.map((experiment) => (
                  <article key={`${experiment.taskId}-${experiment.text}`}>
                    <span>{taskById(experiment.taskId)?.emoji}</span>
                    <div>
                      <b>{taskById(experiment.taskId)?.label}</b>
                      <p>{experiment.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <button
                className={styles.primary}
                disabled={ownExperimentConfirmed || pending}
                onClick={() =>
                  dispatch({
                    type: "huishoudtafel.experiments.confirmed",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                {ownExperimentConfirmed
                  ? "Jij hebt bevestigd"
                  : "Dit wil ik samen proberen"}
              </button>
            </>
          )}
          <div className={styles.actions}>
            <button
              className={styles.secondary}
              onClick={() =>
                openChat?.(
                  "Welke huishoudtaak is voor jou minder zichtbaar dan voor mij?",
                )
              }
              type="button"
            >
              Open gesprek in chat
            </button>
            <button
              className={styles.secondary}
              onClick={() => openCall?.()}
              type="button"
            >
              Bel elkaar
            </button>
            <Pause pauseGame={pauseGame} pending={pending} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.endPanel}>
        <span className={styles.kicker}>De Huishoudtafel staat</span>
        <h1>Jullie hebben twee werkelijkheden zichtbaar gemaakt</h1>
        <p>
          Niet alleen wie iets uitvoert, maar ook wie het ziet, onthoudt en
          organiseert. De experimenten zijn geen contract; ze zijn een manier
          om samen nauwkeuriger te leren kijken.
        </p>
        <div className={styles.proposedExperiments}>
          {state.experiments.map((experiment) => (
            <article key={`${experiment.taskId}-${experiment.text}`}>
              <span>{taskById(experiment.taskId)?.emoji}</span>
              <div>
                <b>{taskById(experiment.taskId)?.label}</b>
                <p>{experiment.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "huishoudtafel.game.completed",
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
                type: "huishoudtafel.game.replayed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Tafel opnieuw leggen
          </button>
        </div>
      </div>
    </section>
  );
}
