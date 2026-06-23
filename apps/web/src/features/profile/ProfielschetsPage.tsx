import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

import type {
  ProfileChapter,
  ProfileNarrativeCard,
} from "@slow-dating/contracts";

import { LoadingScreen } from "../../app/LoadingScreen";
import { api } from "../../lib/api";
import { useAppStore } from "../../store/appStore";
import styles from "./ProfielschetsPage.module.css";

const KIND_LABELS: Record<ProfileNarrativeCard["kind"], string> = {
  portrait: "Jullie portret",
  direction: "Wat richting geeft",
  connection: "Hoe jullie contact maken",
  "partner-view": "Door de ogen van de ander",
  shared: "Wat jullie delen",
  difference: "Waar jullie verschillen",
  surprise: "De verrassing",
  challenge: "Mogelijke uitdaging",
  conversation: "Praat verder",
  unknown: "Nog te ontdekken",
};

function chapterPath(chapter: ProfileChapter) {
  return chapter.world === 1 ? "/" : `/worlds/${chapter.world}`;
}

export function ProfielschetsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setChatContext = useAppStore((state) => state.setChatContext);
  const setDrawer = useAppStore((state) => state.setDrawer);
  const insights = useQuery({
    queryKey: ["profile-insights"],
    queryFn: api.getProfileInsights,
  });
  const requestedWorld = Number(searchParams.get("kaart"));
  const available = useMemo(
    () => insights.data?.chapters.filter((chapter) => chapter.available) ?? [],
    [insights.data],
  );
  const requestedOrLatestWorld =
    Number.isInteger(requestedWorld) && requestedWorld >= 1
      ? requestedWorld
      : available.at(-1)?.world ?? 1;
  const [selectedWorldOverride, setSelectedWorldOverride] = useState<
    number | null
  >(null);
  const selectedWorld = selectedWorldOverride ?? requestedOrLatestWorld;

  if (!insights.data) return <LoadingScreen />;

  const selected =
    insights.data.chapters.find((chapter) => chapter.world === selectedWorld) ??
    insights.data.chapters[0]!;
  const partnerName =
    insights.data.currentRelationship?.partnerName ?? "je reisgenoot";

  function selectChapter(world: number) {
    setSelectedWorldOverride(world);
    setSearchParams({ kaart: String(world) }, { replace: true });
  }

  function openConversation(prompt: string) {
    setChatContext(prompt, false);
    setDrawer("chat");
  }

  return (
    <main className={styles.page} data-world={selected.world}>
      <button
        className={styles.back}
        onClick={() => navigate(chapterPath(selected))}
        type="button"
      >
        Terug naar kaart {selected.world}
      </button>

      <header className={styles.header}>
        <span className={styles.kicker}>Jullie groeiende profiel</span>
        <h1>Wat jullie onderweg laten zien</h1>
        <p className={styles.lead}>
          Geen testuitslag en geen oordeel. Wel een steeds rijker portret uit
          jullie keuzes, overeenkomsten, verschillen en gespeelde momenten.
        </p>
      </header>

      <nav aria-label="Profielhoofdstukken" className={styles.chapterNav}>
        {insights.data.chapters.map((chapter) => (
          <button
            data-active={chapter.world === selected.world}
            disabled={!chapter.available}
            key={chapter.world}
            onClick={() => selectChapter(chapter.world)}
            type="button"
          >
            <span>Profiel {chapter.world}</span>
            <strong>{chapter.title}</strong>
            <small>
              {chapter.available
                ? `${chapter.completedGameCount} spellen verwerkt`
                : `${chapter.completedGameCount} van ${chapter.requiredGames}`}
            </small>
          </button>
        ))}
      </nav>

      {!selected.available ? (
        <section className={styles.locked}>
          <span className={styles.chapterNumber}>Profiel {selected.world}</span>
          <h2>Nog even samen ontdekken</h2>
          <p>
            Na vijf verschillende spellen op kaart {selected.world} verschijnt
            hier jullie volgende profielhoofdstuk. Nog{" "}
            {Math.max(
              0,
              selected.requiredGames - selected.completedGameCount,
            )}{" "}
            te gaan.
          </p>
          <div className={styles.progressTrack}>
            <span
              style={{
                width: `${Math.min(
                  100,
                  (selected.completedGameCount / selected.requiredGames) * 100,
                )}%`,
              }}
            />
          </div>
          <button
            className={styles.primary}
            onClick={() => navigate(chapterPath(selected))}
            type="button"
          >
            Verder op kaart {selected.world}
          </button>
        </section>
      ) : (
        <>
          <section className={styles.chapterIntro}>
            <div>
              <span className={styles.chapterNumber}>
                Profiel {selected.world}
              </span>
              <h2>{selected.title}</h2>
              <p>{selected.subtitle}</p>
            </div>
            <div className={styles.chapterStatus}>
              <strong>
                {selected.status === "complete"
                  ? "Volledig hoofdstuk"
                  : "Groeiend hoofdstuk"}
              </strong>
              <span>
                {selected.completedGameCount} spellen verwerkt
                {selected.status === "provisional"
                  ? " · wordt verder verrijkt"
                  : ""}
              </span>
            </div>
          </section>

          <div className={styles.story}>
            {selected.cards.map((profileCard, index) => (
              <article
                className={styles.card}
                data-kind={profileCard.kind}
                key={profileCard.id}
              >
                <div className={styles.cardMeta}>
                  <span>{KIND_LABELS[profileCard.kind]}</span>
                  <small>
                    {profileCard.confidence === "strong"
                      ? "Sterk patroon"
                      : profileCard.confidence === "pattern"
                        ? "Voorzichtig patroon"
                        : "Concrete observatie"}
                  </small>
                </div>
                <span className={styles.cardIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{profileCard.title}</h3>
                <p>{profileCard.body}</p>
                {profileCard.evidence.length > 0 && (
                  <details className={styles.evidence}>
                    <summary>Waar zagen we dit?</summary>
                    <ul>
                      {profileCard.evidence.map((item) => (
                        <li key={item.id}>
                          <strong>{item.sourceGameTitle}</strong>
                          <span>{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
                {profileCard.chatPrompt && (
                  <button
                    className={styles.chatButton}
                    onClick={() => openConversation(profileCard.chatPrompt!)}
                    type="button"
                  >
                    Bespreek dit samen
                  </button>
                )}
              </article>
            ))}
          </div>

          <footer className={styles.footer}>
            <p>
              Dit profiel van jou en {partnerName} verandert alleen wanneer
              jullie nieuwe spellen afronden. Eerdere hoofdstukken blijven
              terug te lezen.
            </p>
            <button
              className={styles.primary}
              onClick={() => navigate(chapterPath(selected))}
              type="button"
            >
              Terug naar kaart {selected.world}
            </button>
          </footer>
        </>
      )}
    </main>
  );
}
