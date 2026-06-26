import { useEffect, useMemo, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type { KwaliteitenAction, KwaliteitenState } from "./contracts";
import {
  ALLERGIEËN_ALL,
  ALLERGIE_VRAGEN,
  ICONS,
  KWALITEITEN_ALL,
  VRAGEN,
} from "./content";
import styles from "./KwaliteitenGame.module.css";

type Screen =
  | "kwaliteiten"
  | "allergie"
  | "wacht-selectie"
  | "vraagfase"
  | "wacht-vragen"
  | "presentatie"
  | "done";

interface PresentatieCard {
  word: string;
  icon: string;
  question: string;
  isAllergie: boolean;
  isMyCard: boolean;
  ownerName: string;
}

export function KwaliteitenGame({
  state,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
}: GameComponentProps<KwaliteitenState, KwaliteitenAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";

  const mySelection = state.selectionByPlayer[installationId];
  const partnerSelection = state.selectionByPlayer[partnerId];
  const myQuestions = state.questionsByPlayer[installationId];
  const partnerQuestions = state.questionsByPlayer[partnerId];

  const bothSubmittedSelection = Boolean(mySelection && partnerSelection);
  const bothSubmittedQuestions = Boolean(myQuestions && partnerQuestions);

  const [screen, setScreen] = useState<Screen>(() => {
    if (state.completedInstallationIds.includes(installationId)) return "done";
    if (bothSubmittedQuestions) return "presentatie";
    if (myQuestions) return "wacht-vragen";
    if (bothSubmittedSelection) return "vraagfase";
    if (mySelection) return "wacht-selectie";
    return "kwaliteiten";
  });

  const [selectedKwaliteiten, setSelectedKwaliteiten] = useState<string[]>(
    () => mySelection?.kwaliteiten ?? [],
  );
  const [selectedAllergie, setSelectedAllergie] = useState<string | null>(
    () => mySelection?.allergie ?? null,
  );
  const [chosenQuestions, setChosenQuestions] = useState<
    Record<string, string>
  >({});
  const [cardIdx, setCardIdx] = useState(0);

  useEffect(() => {
    if (screen === "wacht-selectie" && bothSubmittedSelection) {
      const timeout = window.setTimeout(() => setScreen("vraagfase"), 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [screen, bothSubmittedSelection]);

  useEffect(() => {
    if (screen === "wacht-vragen" && bothSubmittedQuestions) {
      const timeout = window.setTimeout(() => setScreen("presentatie"), 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [screen, bothSubmittedQuestions]);

  function toggleKwaliteit(w: string) {
    setSelectedKwaliteiten((prev) => {
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      if (prev.length >= 2) return prev;
      return [...prev, w];
    });
  }

  function submitSelection() {
    if (selectedKwaliteiten.length < 2 || !selectedAllergie) return;
    void dispatch({
      type: "kwaliteiten.selection.submitted",
      actorId: installationId,
      kwaliteiten: selectedKwaliteiten,
      allergie: selectedAllergie,
    });
    if (partnerSelection) {
      setScreen("vraagfase");
    } else {
      setScreen("wacht-selectie");
    }
  }

  const partnerWords = useMemo(() => {
    if (!partnerSelection) return [];
    return [
      ...partnerSelection.kwaliteiten,
      ...(partnerSelection.allergie ? [partnerSelection.allergie] : []),
    ];
  }, [partnerSelection]);

  function pickQuestion(word: string, question: string) {
    setChosenQuestions((prev) => ({ ...prev, [word]: question }));
  }

  function submitQuestions() {
    if (Object.keys(chosenQuestions).length < partnerWords.length) return;
    void dispatch({
      type: "kwaliteiten.questions.submitted",
      actorId: installationId,
      questions: chosenQuestions,
    });
    if (partnerQuestions) {
      setScreen("presentatie");
    } else {
      setScreen("wacht-vragen");
    }
  }

  const cards: PresentatieCard[] = useMemo(() => {
    if (!mySelection || !partnerSelection || !myQuestions || !partnerQuestions)
      return [];

    const myWords = [
      ...mySelection.kwaliteiten,
      ...(mySelection.allergie ? [mySelection.allergie] : []),
    ];
    const partnerWords2 = [
      ...partnerSelection.kwaliteiten,
      ...(partnerSelection.allergie ? [partnerSelection.allergie] : []),
    ];

    const myCards: PresentatieCard[] = myWords.map((word) => ({
      word,
      icon: ICONS[word] ?? "✨",
      question: partnerQuestions[word] ?? "",
      isAllergie: ALLERGIEËN_ALL.includes(word),
      isMyCard: true,
      ownerName: "jij",
    }));

    const partnerCards: PresentatieCard[] = partnerWords2.map((word) => ({
      word,
      icon: ICONS[word] ?? "✨",
      question: myQuestions[word] ?? "",
      isAllergie: ALLERGIEËN_ALL.includes(word),
      isMyCard: false,
      ownerName: partnerName,
    }));

    const interleaved: PresentatieCard[] = [];
    const maxLen = Math.max(myCards.length, partnerCards.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < myCards.length) interleaved.push(myCards[i]!);
      if (i < partnerCards.length) interleaved.push(partnerCards[i]!);
    }
    return interleaved;
  }, [mySelection, partnerSelection, myQuestions, partnerQuestions, partnerName]);

  function finishGame() {
    void dispatch({ type: "kwaliteiten.game.completed", actorId: installationId });
    setScreen("done");
  }

  const isAllergiePage = screen === "allergie";

  // ── Done screen ──────────────────────────────────────────────
  if (screen === "done") {
    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />
        <div className={styles.doneWrap}>
          <div className={styles.doneIcon}>✨</div>
          <div className={styles.doneTitle}>Klaar!</div>
          <div className={styles.doneSub}>
            Jullie hebben elkaars kwaliteiten en allergieën ontdekt.
          </div>
        </div>
      </div>
    );
  }

  // ── Kwaliteiten / Allergie picker ────────────────────────────
  if (screen === "kwaliteiten" || screen === "allergie") {
    const list = isAllergiePage ? ALLERGIEËN_ALL : KWALITEITEN_ALL;
    const title = isAllergiePage
      ? "Kies 1 allergie"
      : "Kies 2 kwaliteiten";
    const subtitle = isAllergiePage
      ? "Wat irriteert of raakt jou het meest?"
      : "Welke twee woorden beschrijven jou het best?";
    const canContinue = isAllergiePage
      ? selectedAllergie !== null
      : selectedKwaliteiten.length === 2;

    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />

        <div className={styles.topBar}>
          <div className={styles.topBarTitle}>Jij in twee woorden</div>
          <div className={styles.topBarStep}>
            {isAllergiePage ? "2 / 2" : "1 / 2"}
          </div>
        </div>

        <div className={styles.pickerWrap}>
          <div className={styles.pickerHeader}>
            <div className={styles.pickerTitle}>{title}</div>
            <div className={styles.pickerSub}>{subtitle}</div>
          </div>

          <div className={styles.wordGrid}>
            {list.map((word) => {
              const selected = isAllergiePage
                ? selectedAllergie === word
                : selectedKwaliteiten.includes(word);
              const disabled = isAllergiePage
                ? false
                : !selected && selectedKwaliteiten.length >= 2;
              return (
                <button
                  key={word}
                  className={[
                    styles.wordChip,
                    selected ? styles.wordChipSelected : "",
                    disabled ? styles.wordChipDisabled : "",
                    isAllergiePage ? styles.wordChipAllergie : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={disabled}
                  onClick={() => {
                    if (isAllergiePage) {
                      setSelectedAllergie((prev) =>
                        prev === word ? null : word,
                      );
                    } else {
                      toggleKwaliteit(word);
                    }
                  }}
                >
                  <span className={styles.chipIcon}>{ICONS[word]}</span>
                  <span className={styles.chipLabel}>{word}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.bottomBar}>
          {screen === "allergie" && (
            <button
              className={styles.backBtn}
              onClick={() => setScreen("kwaliteiten")}
            >
              ← Terug
            </button>
          )}
          <button
            className={styles.primaryBtn}
            disabled={!canContinue || pending}
            onClick={() => {
              if (isAllergiePage) {
                submitSelection();
              } else {
                setScreen("allergie");
              }
            }}
          >
            {isAllergiePage
              ? "Delen →"
              : `Verder →`}
          </button>
        </div>
      </div>
    );
  }

  // ── Wacht op partner (selectie) ──────────────────────────────
  if (screen === "wacht-selectie") {
    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />
        <div className={styles.waitWrap}>
          <div className={styles.waitIcon}>⏳</div>
          <div className={styles.waitTitle}>Wachten op {partnerName}…</div>
          <div className={styles.waitSub}>
            {partnerName} kiest nog zijn/haar kwaliteiten en allergie.
          </div>
          <div className={styles.mySelectionPreview}>
            {selectedKwaliteiten.map((w) => (
              <span key={w} className={styles.previewChip}>
                {ICONS[w]} {w}
              </span>
            ))}
            {selectedAllergie && (
              <span className={`${styles.previewChip} ${styles.previewAllergie}`}>
                {ICONS[selectedAllergie]} {selectedAllergie}
              </span>
            )}
          </div>
          <div className={styles.waitingDots}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  // ── Vraagfase ────────────────────────────────────────────────
  if (screen === "vraagfase") {
    const answered = Object.keys(chosenQuestions).length;
    const total = partnerWords.length;
    const allAnswered = answered === total;

    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />

        <div className={styles.topBar}>
          <div className={styles.topBarTitle}>
            Kies vragen voor {partnerName}
          </div>
          <div className={styles.topBarStep}>
            {answered} / {total}
          </div>
        </div>

        <div className={styles.vraagfaseList}>
          {partnerWords.map((word) => {
            const isAllergie = ALLERGIEËN_ALL.includes(word);
            const vragen = isAllergie
              ? (ALLERGIE_VRAGEN[word] ?? (["", "", ""] as [string, string, string]))
              : (VRAGEN[word] ?? (["", "", ""] as [string, string, string]));
            const chosen = chosenQuestions[word];

            return (
              <div key={word} className={styles.wordBlock}>
                <div className={styles.wordBlockHeader}>
                  <span className={styles.wordBlockIcon}>{ICONS[word]}</span>
                  <span
                    className={[
                      styles.wordBlockName,
                      isAllergie ? styles.wordBlockAllergie : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {word}
                  </span>
                  {chosen && <span className={styles.wordBlockCheck}>✓</span>}
                </div>
                <div className={styles.questionList}>
                  {vragen.map((q, qi) => (
                    <button
                      key={qi}
                      className={[
                        styles.questionOption,
                        chosen === q ? styles.questionChosen : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => pickQuestion(word, q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.bottomBar}>
          <button
            className={styles.primaryBtn}
            disabled={!allAnswered || pending}
            onClick={submitQuestions}
          >
            Vragen delen →
          </button>
        </div>
      </div>
    );
  }

  // ── Wacht op partner (vragen) ────────────────────────────────
  if (screen === "wacht-vragen") {
    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />
        <div className={styles.waitWrap}>
          <div className={styles.waitIcon}>💬</div>
          <div className={styles.waitTitle}>
            Wachten op {partnerName}…
          </div>
          <div className={styles.waitSub}>
            {partnerName} kiest nog vragen voor jouw woorden.
          </div>
          <div className={styles.waitingDots}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  // ── Presentatie ──────────────────────────────────────────────
  if (screen === "presentatie") {
    const isLast = cardIdx >= cards.length;
    if (isLast) {
      return (
        <div className={styles.root}>
          <div className={styles.bgLayer} />
          <div className={styles.doneWrap}>
            <div className={styles.doneIcon}>🎉</div>
            <div className={styles.doneTitle}>Alle kaarten gezien!</div>
            <div className={styles.doneSub}>
              Praat na over wat jullie ontdekten.
            </div>
            <button
              className={styles.primaryBtnLarge}
              disabled={pending}
              onClick={finishGame}
            >
              Afronden →
            </button>
          </div>
        </div>
      );
    }

    const card = cards[cardIdx]!;

    return (
      <div className={styles.root}>
        <div className={styles.bgLayer} />

        <div className={styles.topBar}>
          <div className={styles.topBarTitle}>Jij in twee woorden</div>
          <div className={styles.topBarStep}>
            {cardIdx + 1} / {cards.length}
          </div>
        </div>

        <div className={styles.cardWrap}>
          <div
            className={[
              styles.card,
              card.isMyCard ? styles.cardMine : styles.cardPartner,
              card.isAllergie ? styles.cardAllergie : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.cardOwner}>
              {card.isMyCard ? "Jouw woord" : `${card.ownerName}'s woord`}
            </div>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardWord}>{card.word}</div>
            {card.isAllergie && (
              <div className={styles.cardType}>allergie</div>
            )}
            <div className={styles.cardDivider} />
            <div className={styles.cardQuestionLabel}>
              {card.isMyCard
                ? `${partnerName} wil weten:`
                : "Jij vroeg:"}
            </div>
            <div className={styles.cardQuestion}>{card.question}</div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          {cardIdx > 0 && (
            <button
              className={styles.backBtn}
              onClick={() => setCardIdx((i) => i - 1)}
            >
              ←
            </button>
          )}
          <button
            className={styles.primaryBtn}
            onClick={() => setCardIdx((i) => i + 1)}
          >
            {cardIdx >= cards.length - 1 ? "Klaar →" : "Volgende →"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
