import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import { FaithLayer } from "../FaithLayer";
import {
  getSamenLevenRound,
  irritatieBingoBoardOrder,
  type SamenLevenContent,
} from "./content";
import type { SamenLevenAction, SamenLevenState } from "./contracts";
import styles from "./SamenLevenGame.module.css";

export function SamenLevenGame({
  christianLayer,
  content,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pending,
  restartGame,
  state,
}: GameComponentProps<SamenLevenState, SamenLevenAction> & {
  content: SamenLevenContent;
  restartGame?(): void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const own = state.selections[installationId] ?? {};
  const partner = state.selections[partnerId] ?? {};
  const ownSubmitted = state.submittedIds.includes(installationId);
  const partnerSubmitted = state.submittedIds.includes(partnerId);
  const ownDiscussionDone =
    state.discussionDoneIds.includes(installationId);
  const allDiscussionDone = memberIds.every((id) =>
    state.discussionDoneIds.includes(id),
  );
  const round = getSamenLevenRound(content, state.themeId);
  const prompts = round.prompts;
  const discussionQuestions = round.discussionQuestions;
  const canSubmit = prompts.every((prompt) => own[prompt.id]);
  const ownThemeChoice = state.themeChoices[installationId];
  const partnerThemeChoice = state.themeChoices[partnerId];
  const themeMismatch = Boolean(
    ownThemeChoice &&
      partnerThemeChoice &&
      ownThemeChoice !== partnerThemeChoice,
  );

  if (content.themes?.length && !state.themeId) {
    const themesById = new Map(
      content.themes.map((theme) => [theme.id, theme]),
    );
    const boardThemes = irritatieBingoBoardOrder.flatMap((themeId) => {
      const theme = themesById.get(themeId);
      return theme ? [theme] : [];
    });
    return (
      <section
        className={`${styles.game} ${styles.bingoGame}`}
        data-game-theme="irritatiebingo"
      >
        <div className={styles.panel}>
          <span className={styles.kicker}>{content.kicker}</span>
          <h1>Kies jullie bingoronde</h1>
          <p className={styles.lead}>
            Kies om de beurt één vakje. Jouw keuze wordt blauw, die van{" "}
            {partnerName} rood. Kiezen jullie hetzelfde, dan opent die ronde.
          </p>
          <figure className={styles.bingoBoardStage}>
            <img
              alt="Een geschilderde bingo-kraam met zestien pictogrammen van kleine dagelijkse irritaties"
              src="/assets/kleine-irritatiebingo-scene.png"
            />
            <div
              aria-label="Bingobord met zestien onderwerpen"
              className={styles.bingoBoard}
              role="group"
            >
              {boardThemes.map((theme) => (
                <button
                  aria-label={theme.title}
                  className={styles.bingoTile}
                  data-own={ownThemeChoice === theme.id}
                  data-partner={partnerThemeChoice === theme.id}
                  disabled={Boolean(ownThemeChoice) || pending}
                  key={theme.id}
                  onClick={() =>
                    dispatch({
                      type: "samen-leven.theme.selected",
                      actorId: installationId,
                      themeId: theme.id,
                    })
                  }
                  title={`${theme.title}: ${theme.description}`}
                  type="button"
                >
                  <span className={styles.visuallyHidden}>{theme.title}</span>
                </button>
              ))}
            </div>
          </figure>
          <div className={styles.bingoLegend}>
            <span data-color="own">Jij: blauw</span>
            <span data-color="partner">{partnerName}: rood</span>
          </div>
          {ownThemeChoice && !partnerThemeChoice && (
            <p className={styles.choiceStatus}>
              Jij koos <strong>{themesById.get(ownThemeChoice)?.title}</strong>.
              Wachten op {partnerName}…
            </p>
          )}
          {!ownThemeChoice && partnerThemeChoice && (
            <p className={styles.choiceStatus}>
              {partnerName} heeft gekozen. Nu ben jij aan de beurt.
            </p>
          )}
          {themeMismatch && (
            <section className={styles.mismatch}>
              <strong>Nét geen bingo</strong>
              <p>
                Jij koos{" "}
                {ownThemeChoice
                  ? themesById.get(ownThemeChoice)?.title
                  : "een ander vak"};{" "}
                {partnerName} koos{" "}
                {partnerThemeChoice
                  ? themesById.get(partnerThemeChoice)?.title
                  : "een ander vak"}
                . Probeer opnieuw en zoek elkaar op het bord.
              </p>
              <button
                className={styles.primary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "samen-leven.theme.retry",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Probeer opnieuw
              </button>
            </section>
          )}
        </div>
      </section>
    );
  }

  if (!ownSubmitted) {
    return (
      <section
        className={`${styles.game} ${
          content.id === "irritatiebingo" ? styles.bingoGame : ""
        }`}
      >
        <div className={styles.panel}>
          <span className={styles.kicker}>{content.kicker}</span>
          <h1>{content.title}</h1>
          {round.theme && (
            <p className={styles.roundLabel}>Ronde: {round.theme.title}</p>
          )}
          <p className={styles.lead}>{content.description}</p>
          <div className={styles.promptGrid}>
            {prompts.map((prompt) => (
              <section className={styles.prompt} key={prompt.id}>
                <h2>{prompt.question}</h2>
                <div className={styles.options}>
                  {prompt.options.map((option) => (
                    <button
                      className={styles.option}
                      data-active={own[prompt.id] === option}
                      key={option}
                      onClick={() =>
                        dispatch({
                          type: "samen-leven.option.selected",
                          actorId: installationId,
                          promptId: prompt.id,
                          value: option,
                        })
                      }
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={!canSubmit || pending}
              onClick={() =>
                dispatch({
                  type: "samen-leven.answers.submitted",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Leg mijn antwoorden naast die van {partnerName}
            </button>
            {restartGame && (
              <button
                className={styles.secondary}
                disabled={pending}
                onClick={restartGame}
                type="button"
              >
                Andere ronde kiezen
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!partnerSubmitted) {
    return (
      <section
        className={`${styles.game} ${
          content.id === "irritatiebingo" ? styles.bingoGame : ""
        }`}
      >
        <div className={styles.panel}>
          <div className={styles.waiting}>
            <h1>Jouw antwoorden staan klaar</h1>
            <p>We vergelijken zodra {partnerName} ook klaar is.</p>
            {restartGame && (
              <button
                className={styles.secondary}
                disabled={pending}
                onClick={restartGame}
                type="button"
              >
                Terug naar begin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!ownDiscussionDone) {
    const conversation =
      discussionQuestions[
        questionIndex % discussionQuestions.length
      ];
    return (
      <section
        className={`${styles.game} ${
          content.id === "irritatiebingo" ? styles.bingoGame : ""
        }`}
      >
        <div className={styles.panel}>
          <span className={styles.kicker}>Naast elkaar</span>
          <h1>Wat valt jullie op?</h1>
          <p className={styles.lead}>
            Verschil is geen fout en overeenkomst is geen garantie. Gebruik het
            als ingang voor een eerlijk gesprek.
          </p>
          <div className={styles.compare}>
            <div className={styles.person}>
              <h2>Jij</h2>
              {prompts.map((prompt) => (
                <div className={styles.answer} key={prompt.id}>
                  <span>{prompt.question}</span>
                  <strong>{own[prompt.id]}</strong>
                </div>
              ))}
            </div>
            <div className={styles.person}>
              <h2>{partnerName}</h2>
              {prompts.map((prompt) => (
                <div className={styles.answer} key={prompt.id}>
                  <span>{prompt.question}</span>
                  <strong>{partner[prompt.id]}</strong>
                </div>
              ))}
            </div>
          </div>
          <section className={styles.conversation}>
            <span className={styles.kicker}>Gespreksvraag</span>
            <p className={styles.question}>{conversation}</p>
            <div className={styles.actions}>
              <button
                className={styles.secondary}
                onClick={() => setQuestionIndex((value) => value + 1)}
                type="button"
              >
                Andere vraag
              </button>
              <button
                className={styles.secondary}
                onClick={() => openChat?.(conversation)}
                type="button"
              >
                Open chat
              </button>
              <button
                className={styles.secondary}
                onClick={() => openCall?.()}
                type="button"
              >
                Bel elkaar
              </button>
            </div>
          </section>
          {christianLayer && (
            <>
              <FaithLayer
                intro={round.theme?.christianIntro ?? content.christianIntro}
                prompts={[
                  ...(round.theme?.christianPrompts ??
                    content.christianPrompts),
                ]}
              />
              <p className={styles.outcome}>
                <strong>Christelijke opbrengst:</strong>{" "}
                {round.theme?.christianOutcome ?? content.christianOutcome}
              </p>
            </>
          )}
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "samen-leven.discussion.done",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Gesprek afgerond
            </button>
            {restartGame && (
              <button
                className={styles.secondary}
                disabled={pending}
                onClick={restartGame}
                type="button"
              >
                Terug naar begin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!allDiscussionDone) {
    return (
      <section
        className={`${styles.game} ${
          content.id === "irritatiebingo" ? styles.bingoGame : ""
        }`}
      >
        <div className={styles.panel}>
          <div className={styles.waiting}>
            <h1>Jullie gesprek is bijna rond</h1>
            <p>We wachten nog even op {partnerName}.</p>
            {restartGame && (
              <button
                className={styles.secondary}
                disabled={pending}
                onClick={restartGame}
                type="button"
              >
                Terug naar begin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.game} ${
        content.id === "irritatiebingo" ? styles.bingoGame : ""
      }`}
    >
      <div className={styles.panel}>
        <div className={styles.summary}>
          <span className={styles.kicker}>Opgeslagen in jullie profiel</span>
          <h1>{content.kicker} is afgerond</h1>
          {round.theme && <p>Gespeelde ronde: {round.theme.title}</p>}
          <p>{content.takeaway}</p>
          <div className={styles.actionsCentered}>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "samen-leven.game.completed",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Opslaan en terug naar kaart 3
            </button>
            {restartGame && (
              <button
                className={styles.secondary}
                disabled={pending}
                onClick={() =>
                  dispatch({
                    type: "samen-leven.game.replayed",
                    actorId: installationId,
                  })
                }
                type="button"
              >
                Opnieuw spelen met ander thema
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
