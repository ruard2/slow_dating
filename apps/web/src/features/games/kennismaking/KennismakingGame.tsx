import { useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type { KennismakingAction, KennismakingState } from "./contracts";
import {
  CAT_LABELS,
  NIVEAU_LABELS,
  getKaartQueue,
  getQuizQueue,
  getRaadQueue,
} from "./content";
import styles from "./KennismakingGame.module.css";

function computeNiveauFromInputs(duur: number, kennis: number): 1 | 2 | 3 {
  return Math.max(1, Math.min(3, Math.round((duur + kennis) / 2))) as 1 | 2 | 3;
}

type Screen =
  | "menu"
  | "niveau"
  | "kaarten"
  | "quiz-eigen"
  | "quiz-raad"
  | "quiz-wacht"
  | "quiz-reveal"
  | "quiz-eind"
  | "raad"
  | "done";

export function KennismakingGame({
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
  state,
}: GameComponentProps<KennismakingState, KennismakingAction>) {
  const [screen, setScreen] = useState<Screen>(() => {
    if (
      state.duurByPlayer[installationId] &&
      state.kennisByPlayer[installationId]
    ) {
      return "menu";
    }
    return "niveau";
  });

  // Local inputs for niveau
  const [duur, setDuur] = useState<1 | 2 | 3 | 0>(
    (state.duurByPlayer[installationId] as 1 | 2 | 3) ?? 0,
  );
  const [kennis, setKennis] = useState<1 | 2 | 3 | 0>(
    (state.kennisByPlayer[installationId] as 1 | 2 | 3) ?? 0,
  );

  // Kaarten local state
  const [kaartIdx, setKaartIdx] = useState(0);
  const [kaartFlipped, setKaartFlipped] = useState(false);

  // Quiz local state
  const [quizRound, setQuizRound] = useState(state.quizRound);
  const [quizEigenText, setQuizEigenText] = useState("");
  const [quizRaadText, setQuizRaadText] = useState("");
  const [localMijGoed, setLocalMijGoed] = useState<boolean | null>(null);
  const [localPartnerGoed, setLocalPartnerGoed] = useState<boolean | null>(null);

  // Raad local state
  const [raadAntwoordText, setRaadAntwoordText] = useState("");
  const [raadGokText, setRaadGokText] = useState("");

  const niveau = (state.duurByPlayer[installationId] && state.kennisByPlayer[installationId])
    ? computeNiveauFromInputs(
        state.duurByPlayer[installationId]!,
        state.kennisByPlayer[installationId]!,
      )
    : 1;

  const seed = state.kaartSeed || 1;
  const quizSeed = state.quizSeed || 1;
  const raadSeed = state.raadSeed || 1;

  const kaartQueue = getKaartQueue(seed, niveau);
  const quizQueue = getQuizQueue(quizSeed);
  const raadQueue = getRaadQueue(raadSeed, niveau);

  const partnerId = memberIds.find((id) => id !== installationId) ?? "";

  // Quiz helpers
  const myQuizAnswers = state.quizAnswers[installationId] ?? [];
  const partnerQuizAnswers = state.quizAnswers[partnerId] ?? [];
  const myRoundAnswer = myQuizAnswers.find((a) => a.round === quizRound);
  const partnerRoundAnswer = partnerQuizAnswers.find((a) => a.round === quizRound);
  const bothAnswered = Boolean(myRoundAnswer && partnerRoundAnswer);

  // Raad helpers
  const raadIdx = state.raadIdx;
  const firstAntwoorder = state.raadFirstAntwoorder || installationId;
  const currentAntwoorderId = raadIdx % 2 === 0 ? firstAntwoorder : (firstAntwoorder === installationId ? partnerId : installationId);
  const iAmAntwoorder = currentAntwoorderId === installationId;
  const currentRaadAnswer = state.raadAnswers.find((a) => a.idx === raadIdx);
  const raadDone = raadIdx >= 8;

  // ─── SCREENS ─────────────────────────────────────────────────────────────

  if (screen === "niveau") {
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.pad}>
          <h1 className={styles.h1}>Leer Elkaar Kennen</h1>
          <p className={styles.sub}>Neem plaats bij het vuur.<br />Ontdek wat jullie al weten en wat nog niet.</p>

          <div className={styles.divider} />

          <h2 className={styles.h2}>Hoe lang kennen jullie elkaar al?</h2>
          <div className={styles.choices}>
            {(["Nog maar kort (minder dan 3 maanden)", "Een tijdje (3 maanden – 1 jaar)", "Al een tijd (meer dan 1 jaar)"] as const).map((label, i) => (
              <button
                className={styles.choiceBtn}
                data-selected={duur === i + 1}
                key={label}
                onClick={() => setDuur((i + 1) as 1 | 2 | 3)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <h2 className={styles.h2}>En hoe goed kennen jullie elkaar?</h2>
          <div className={styles.choices}>
            {(["We beginnen net met ontdekken", "We kennen elkaars basisverhaal", "We kennen elkaar goed, maar blijven ontdekken"] as const).map((label, i) => (
              <button
                className={styles.choiceBtn}
                data-selected={kennis === i + 1}
                key={label}
                onClick={() => setKennis((i + 1) as 1 | 2 | 3)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {duur > 0 && kennis > 0 && (
            <button
              className={`${styles.btn} ${styles.btnGold}`}
              disabled={pending}
              onClick={async () => {
                await dispatch({
                  type: "kennismaking.niveau.set",
                  actorId: installationId,
                  duur: duur as 1 | 2 | 3,
                  kennis: kennis as 1 | 2 | 3,
                });
                setScreen("menu");
              }}
              type="button"
            >
              Dit klopt
            </button>
          )}
        </div>
      </div>
    );
  }

  if (screen === "menu") {
    const n = niveau;
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.pad}>
          <div className={styles.center}>
            <span className={styles.levelPill}>{NIVEAU_LABELS[n]}</span>
            <h1 className={styles.h1} style={{ fontSize: "1.5rem", marginTop: "8px" }}>Gesprekken bij het vuur</h1>
            <p className={styles.sub}>Kies samen hoe jullie willen beginnen</p>
          </div>

          <button className={styles.modeCard} onClick={() => {
            setKaartIdx(0);
            setKaartFlipped(false);
            const newSeed = state.kaartSeed || Math.floor(Math.random() * 999999 + 1);
            if (!state.kaartSeed) {
              void dispatch({ type: "kennismaking.kaart.started", actorId: installationId, seed: newSeed });
            }
            setScreen("kaarten");
          }} type="button">
            <div className={styles.modeIcon}>01</div>
            <div className={styles.modeTitle}>Kennismakingskaarten</div>
            <div className={styles.modeDesc}>Draai een kaart om en bespreek samen de vraag. Warm, diep en verrassend.</div>
          </button>

          <button className={styles.modeCard} onClick={() => {
            setQuizRound(0);
            setQuizEigenText("");
            setQuizRaadText("");
            setLocalMijGoed(null);
            setLocalPartnerGoed(null);
            const newSeed = state.quizSeed || Math.floor(Math.random() * 999999 + 1);
            if (!state.quizSeed) {
              void dispatch({ type: "kennismaking.quiz.started", actorId: installationId, seed: newSeed });
            }
            setScreen("quiz-eigen");
          }} type="button">
            <div className={styles.modeIcon}>02</div>
            <div className={styles.modeTitle}>Wie kent wie het beste?</div>
            <div className={styles.modeDesc}>Beide vullen antwoorden in over zichzelf — en raden wat de ander zei. Wie wint?</div>
          </button>

          <button className={styles.modeCard} onClick={() => {
            const newSeed = state.raadSeed || Math.floor(Math.random() * 999999 + 1);
            if (!state.raadSeed) {
              void dispatch({
                type: "kennismaking.raad.started",
                actorId: installationId,
                seed: newSeed,
                firstAntwoorderId: installationId,
              });
            }
            setRaadAntwoordText("");
            setRaadGokText("");
            setScreen("raad");
          }} type="button">
            <div className={styles.modeIcon}>03</div>
            <div className={styles.modeTitle}>Hoe goed ken je elkaar?</div>
            <div className={styles.modeDesc}>Eén persoon antwoordt, de ander maakt een inschatting. Daarna bekijken jullie het samen.</div>
          </button>

          <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={async () => {
              await dispatch({ type: "kennismaking.game.completed", actorId: installationId });
            }}
            disabled={pending}
            type="button"
          >
            Afronden
          </button>
        </div>
      </div>
    );
  }

  // ─── KAARTEN ─────────────────────────────────────────────────────────────
  if (screen === "kaarten") {
    const card = kaartQueue[kaartIdx];
    if (!card) {
      return (
        <div className={styles.screen}>
          <div className={styles.bg} />
          <div className={styles.pad} style={{ textAlign: "center" }}>
            <h2 className={styles.h2}>Alle kaarten bekeken!</h2>
            <p className={styles.sub}>Jullie hebben alle vragen doorlopen.</p>
            <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => setScreen("menu")} type="button">Terug naar menu</button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.padCenter}>
          <div className={styles.topRow}>
            <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setScreen("menu")} type="button">← Menu</button>
            <div className={styles.dots}>
              {Array.from({ length: Math.min(kaartQueue.length, 10) }, (_, i) => (
                <div className={`${styles.dot} ${i < kaartIdx ? styles.dotDone : ""} ${i === kaartIdx ? styles.dotActive : ""}`} key={i} />
              ))}
            </div>
            <span className={styles.counter}>{kaartIdx + 1} / {kaartQueue.length}</span>
          </div>

          <span className={styles.catBadge}>{CAT_LABELS[card.cat] ?? card.cat}</span>

          <div className={`${styles.cardWrap} ${kaartFlipped ? styles.flipped : ""}`} onClick={() => setKaartFlipped((f) => !f)}>
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <span className={styles.cardTap}>Tik om om te draaien</span>
              </div>
              <div className={styles.cardBack}>
                <div className={styles.cardCat}>{CAT_LABELS[card.cat] ?? card.cat}</div>
                <div className={styles.cardVraag}>{card.v}</div>
                {card.f && <div className={styles.cardFollowup}>→ {card.f}</div>}
              </div>
            </div>
          </div>

          {kaartFlipped && (
            <div className={styles.gap}>
              <button
                className={`${styles.btn} ${styles.btnGold}`}
                onClick={() => {
                  setKaartIdx((i) => i + 1);
                  setKaartFlipped(false);
                }}
                type="button"
              >
                Volgende kaart ›
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── QUIZ EIGEN ──────────────────────────────────────────────────────────
  if (screen === "quiz-eigen") {
    const q = quizQueue[quizRound];
    if (!q) {
      setScreen("quiz-eind");
      return null;
    }
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.pad}>
          <div className={styles.rowBetween}>
            <span className={styles.catBadge}>{CAT_LABELS[q.cat] ?? q.cat}</span>
            <span className={styles.counter}>Ronde {quizRound + 1}/10</span>
          </div>

          <div className={styles.revealBox}>
            <div className={styles.revealLabel}>De vraag</div>
            <div className={styles.revealAnswer}>{q.v}</div>
          </div>

          <div>
            <p className={styles.inputLabel}>Jouw eigen antwoord:</p>
            <textarea
              className={styles.textarea}
              onChange={(e) => setQuizEigenText(e.target.value)}
              placeholder="Schrijf hier jouw echte antwoord..."
              value={quizEigenText}
            />
          </div>

          <button
            className={`${styles.btn} ${styles.btnGold}`}
            disabled={!quizEigenText.trim()}
            onClick={() => {
              setScreen("quiz-raad");
            }}
            type="button"
          >
            Verder → raad de ander
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ RAAD ───────────────────────────────────────────────────────────
  if (screen === "quiz-raad") {
    const q = quizQueue[quizRound];
    if (!q) return null;
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.pad}>
          <div className={styles.revealBox}>
            <div className={styles.revealLabel}>De vraag</div>
            <div className={styles.revealAnswer}>{q.v}</div>
          </div>

          <div>
            <p className={styles.inputLabel}>Wat denk jij dat {partnerName} antwoordde?</p>
            <textarea
              className={styles.textarea}
              onChange={(e) => setQuizRaadText(e.target.value)}
              placeholder={`Raad het antwoord van ${partnerName}...`}
              value={quizRaadText}
            />
          </div>

          <button
            className={`${styles.btn} ${styles.btnGold}`}
            disabled={!quizRaadText.trim() || pending}
            onClick={async () => {
              await dispatch({
                type: "kennismaking.quiz.answer.submitted",
                actorId: installationId,
                round: quizRound,
                eigen: quizEigenText,
                raad: quizRaadText,
              });
              setScreen("quiz-wacht");
            }}
            type="button"
          >
            Insturen
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ WACHT ──────────────────────────────────────────────────────────
  if (screen === "quiz-wacht") {
    if (bothAnswered) {
      // Partner has arrived — move to reveal
      setScreen("quiz-reveal");
      return null;
    }
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.padCenter} style={{ textAlign: "center" }}>
          <div className={styles.waitingMark} />
          <h2 className={styles.h2}>Wachten op {partnerName}</h2>
          <p className={styles.sub}>
            <span className={styles.waitingDots}>
              Bijna<span>.</span><span>.</span><span>.</span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  // ─── QUIZ REVEAL ─────────────────────────────────────────────────────────
  if (screen === "quiz-reveal") {
    const q = quizQueue[quizRound];
    if (!q) return null;
    const myA = myRoundAnswer;
    const partnerA = partnerRoundAnswer;
    const isLast = quizRound >= 9;

    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.pad}>
          <div className={styles.center}>
            <h2 className={styles.h2}>Jullie antwoorden</h2>
            <p className={styles.sub} style={{ fontStyle: "italic", marginTop: "4px" }}>{q.v}</p>
          </div>

          {myA && (
            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>Jouw echte antwoord</div>
              <div className={styles.revealAnswer}>{myA.eigen}</div>
            </div>
          )}
          {partnerA && (
            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>{partnerName} raadde voor jou</div>
              <div className={styles.revealAnswer}>{partnerA.raad}</div>
            </div>
          )}
          {partnerA && (
            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>{partnerName}'s echte antwoord</div>
              <div className={styles.revealAnswer}>{partnerA.eigen}</div>
            </div>
          )}
          {myA && (
            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>Jij raadde voor {partnerName}</div>
              <div className={styles.revealAnswer}>{myA.raad}</div>
            </div>
          )}

          {localMijGoed === null ? (
            <>
              <p className={styles.sub} style={{ textAlign: "center" }}>Wie had het bij het rechte eind? ↓</p>
              <div className={styles.row}>
                <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { setLocalMijGoed(false); setLocalPartnerGoed(false); }} type="button">Allebei mis</button>
                <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { setLocalMijGoed(true); setLocalPartnerGoed(false); }} type="button">Ik had gelijk</button>
                <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { setLocalMijGoed(false); setLocalPartnerGoed(true); }} type="button">{partnerName} had gelijk</button>
                <button className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`} onClick={() => { setLocalMijGoed(true); setLocalPartnerGoed(true); }} type="button">Allebei!</button>
              </div>
            </>
          ) : (
            <button
              className={`${styles.btn} ${styles.btnGold}`}
              disabled={pending}
              onClick={async () => {
                await dispatch({
                  type: "kennismaking.quiz.score.updated",
                  actorId: installationId,
                  round: quizRound,
                  mijGoed: localMijGoed!,
                  partnerGoed: localPartnerGoed!,
                });
                await dispatch({
                  type: "kennismaking.quiz.next.round",
                  actorId: installationId,
                  round: quizRound,
                });
                if (isLast) {
                  setScreen("quiz-eind");
                } else {
                  setQuizRound((r) => r + 1);
                  setQuizEigenText("");
                  setQuizRaadText("");
                  setLocalMijGoed(null);
                  setLocalPartnerGoed(null);
                  setScreen("quiz-eigen");
                }
              }}
              type="button"
            >
              {isLast ? "Naar eindstand" : "Volgende ronde ›"}
            </button>
          )}

          <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setScreen("menu")} type="button">← Menu</button>
        </div>
      </div>
    );
  }

  // ─── QUIZ EIND ───────────────────────────────────────────────────────────
  if (screen === "quiz-eind") {
    const myScore = state.quizScores[installationId] ?? 0;
    const partnerScore = state.quizScores[partnerId] ?? 0;
    let titel: string;
    let sub: string;
    if (myScore === partnerScore) {
      titel = "Gelijkspel";
      sub = "Jullie kennen elkaar even goed. Dat is bijzonder mooi.";
    } else if (myScore > partnerScore) {
      titel = "Jij wint";
      sub = `Jij kent je partner beter. ${myScore} vs ${partnerScore}. Maar het echte spel is altijd blijven ontdekken.`;
    } else {
      titel = `${partnerName} wint`;
      sub = `${partnerName} weet meer over jou dan jij over hem/haar. ${partnerScore} vs ${myScore}. Goed gespreksstof!`;
    }

    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.padCenter} style={{ textAlign: "center" }}>
          <span className={styles.levelPill}>Ronde afgerond</span>
          <h1 className={styles.h1}>{titel}</h1>
          <p className={styles.sub}>{sub}</p>
          <div className={styles.scoreRow}>
            <div>
              <div className={styles.scoreLabel}>Jij</div>
              <div className={styles.scoreNum}>{myScore}</div>
            </div>
            <div className={styles.scoreVs}>vs</div>
            <div>
              <div className={styles.scoreLabel}>{partnerName}</div>
              <div className={styles.scoreNum}>{partnerScore}</div>
            </div>
          </div>
          <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => {
            setQuizRound(0);
            setQuizEigenText("");
            setQuizRaadText("");
            setLocalMijGoed(null);
            setLocalPartnerGoed(null);
            setScreen("quiz-eigen");
          }} type="button">Nog een ronde ›</button>
          <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setScreen("menu")} type="button">Terug naar menu</button>
        </div>
      </div>
    );
  }

  // ─── RAAD ────────────────────────────────────────────────────────────────
  if (screen === "raad") {
    if (raadDone) {
      return (
        <div className={styles.screen}>
          <div className={styles.bg} />
          <div className={styles.padCenter} style={{ textAlign: "center" }}>
            <h2 className={styles.h2}>Alle rondes gedaan!</h2>
            <p className={styles.sub}>Jullie hebben {state.raadScore} keer raak geraden.</p>
            <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => setScreen("menu")} type="button">Terug naar menu</button>
          </div>
        </div>
      );
    }

    const raadVraag = raadQueue[raadIdx];
    if (!raadVraag) return null;

    // Antwoorder: type your answer
    if (iAmAntwoorder && !currentRaadAnswer?.antwoord) {
      return (
        <div className={styles.screen}>
          <div className={styles.bg} />
          <div className={styles.pad}>
            <div className={styles.rowBetween}>
              <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setScreen("menu")} style={{ width: "auto", padding: "8px 14px" }} type="button">← Menu</button>
              <span className={styles.counter}>{raadIdx + 1}/8</span>
            </div>

            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>Jouw beurt om te antwoorden</div>
              <div className={styles.revealAnswer}>{raadVraag.v}</div>
            </div>

            <textarea
              className={styles.textarea}
              onChange={(e) => setRaadAntwoordText(e.target.value)}
              placeholder="Jouw eerlijke antwoord..."
              value={raadAntwoordText}
            />

            <button
              className={`${styles.btn} ${styles.btnGold}`}
              disabled={!raadAntwoordText.trim() || pending}
              onClick={async () => {
                await dispatch({
                  type: "kennismaking.raad.antwoord.submitted",
                  actorId: installationId,
                  idx: raadIdx,
                  antwoord: raadAntwoordText,
                });
                setRaadAntwoordText("");
              }}
              type="button"
            >
              Ingestuurd, {partnerName} raadt nu ›
            </button>
          </div>
        </div>
      );
    }

    // Rader: guess the antwoorder's answer (only if antwoord is in state)
    if (!iAmAntwoorder && currentRaadAnswer?.antwoord && !currentRaadAnswer.gok) {
      return (
        <div className={styles.screen}>
          <div className={styles.bg} />
          <div className={styles.pad}>
            <div className={styles.rowBetween}>
              <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setScreen("menu")} style={{ width: "auto", padding: "8px 14px" }} type="button">← Menu</button>
              <span className={styles.counter}>{raadIdx + 1}/8</span>
            </div>

            <p className={styles.sub} style={{ color: "var(--amber-soft)" }}>{partnerName} heeft geantwoord...</p>

            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>De vraag aan {partnerName}</div>
              <div className={styles.revealAnswer}>{raadVraag.v}</div>
            </div>

            <textarea
              className={styles.textarea}
              onChange={(e) => setRaadGokText(e.target.value)}
              placeholder={`Wat denk jij dat ${partnerName} zei?`}
              value={raadGokText}
            />

            <button
              className={`${styles.btn} ${styles.btnGold}`}
              disabled={!raadGokText.trim() || pending}
              onClick={async () => {
                await dispatch({
                  type: "kennismaking.raad.gok.submitted",
                  actorId: installationId,
                  idx: raadIdx,
                  gok: raadGokText,
                });
                setRaadGokText("");
              }}
              type="button"
            >
              Dit is mijn gok ›
            </button>
          </div>
        </div>
      );
    }

    // Reveal: both antwoord + gok are in state
    if (currentRaadAnswer?.antwoord && currentRaadAnswer.gok) {
      return (
        <div className={styles.screen}>
          <div className={styles.bg} />
          <div className={styles.pad}>
            <div className={styles.rowBetween}>
              <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => setScreen("menu")} style={{ width: "auto", padding: "8px 14px" }} type="button">← Menu</button>
              <span className={styles.counter}>{raadIdx + 1}/8</span>
            </div>

            <h2 className={styles.h2} style={{ textAlign: "center" }}>Jullie antwoorden</h2>

            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>Het echte antwoord</div>
              <div className={styles.revealAnswer}>{currentRaadAnswer.antwoord}</div>
            </div>

            <div className={styles.revealBox}>
              <div className={styles.revealLabel}>De gok</div>
              <div className={styles.revealAnswer}>{currentRaadAnswer.gok}</div>
            </div>

            <div className={styles.row}>
              <button
                className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
                disabled={pending}
                onClick={async () => {
                  await dispatch({
                    type: "kennismaking.raad.score",
                    actorId: installationId,
                    idx: raadIdx,
                    raak: false,
                  });
                  setRaadAntwoordText("");
                  setRaadGokText("");
                }}
                type="button"
              >
                Niet helemaal
              </button>
              <button
                className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}
                disabled={pending}
                onClick={async () => {
                  await dispatch({
                    type: "kennismaking.raad.score",
                    actorId: installationId,
                    idx: raadIdx,
                    raak: true,
                  });
                  setRaadAntwoordText("");
                  setRaadGokText("");
                }}
                type="button"
              >
                ✓ Raak!
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Waiting for other player
    return (
      <div className={styles.screen}>
        <div className={styles.bg} />
        <div className={styles.padCenter} style={{ textAlign: "center" }}>
          <div className={styles.waitingMark} />
          <h2 className={styles.h2}>Wachten...</h2>
          <p className={styles.sub}>
            {iAmAntwoorder
              ? `Wachten op gok van ${partnerName}`
              : `Wachten op antwoord van ${partnerName}`}
          </p>
        </div>
      </div>
    );
  }

  // ─── DONE ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.screen}>
      <div className={styles.bg} />
      <div className={styles.padCenter} style={{ textAlign: "center" }}>
        <h1 className={styles.h1}>Jullie hebben samen ontdekt</h1>
        <p className={styles.sub}>Dank voor dit gesprek bij het vuur.</p>
        <button
          className={`${styles.btn} ${styles.btnGold}`}
          disabled={pending}
          onClick={async () => {
            await dispatch({ type: "kennismaking.game.completed", actorId: installationId });
          }}
          type="button"
        >
          Afronden
        </button>
      </div>
    </div>
  );
}
