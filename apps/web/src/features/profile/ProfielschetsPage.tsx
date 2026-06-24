import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

import type {
  ProfileChapter,
  ProfileConversationCard,
  ProfileEvidence,
  ProfileGameAppendix,
  ProfileNarrativeCard,
  ProfilePersonBlock,
  ProfileTextBlock,
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

function EvidenceDetails({ evidence }: { evidence?: ProfileEvidence[] }) {
  if (!evidence?.length) return null;
  return (
    <details className={styles.evidence}>
      <summary>Waar zagen we dit?</summary>
      <ul>
        {evidence.map((item) => (
          <li key={item.id}>
            <strong>{item.sourceGameTitle}</strong>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function RichBlockSection({
  title,
  blocks,
}: {
  title: string;
  blocks: ProfileTextBlock[] | undefined;
}) {
  if (!blocks?.length) return null;
  return (
    <section className={styles.richSection}>
      <h3>{title}</h3>
      <div className={styles.richGrid}>
        {blocks.map((block) => (
          <article className={styles.richBlock} key={`${title}-${block.title}`}>
            <h4>{block.title}</h4>
            <p>{block.body}</p>
            <EvidenceDetails evidence={block.evidence} />
          </article>
        ))}
      </div>
    </section>
  );
}

function PersonProfiles({
  people,
}: {
  people: ProfilePersonBlock[] | undefined;
}) {
  if (!people?.length) return null;
  return (
    <section className={styles.richSection}>
      <h3>Wie jullie ieder zijn</h3>
      <div className={styles.personGrid}>
        {people.map((person) => (
          <article className={styles.personCard} key={person.personId}>
            <span>{person.label}</span>
            <p>{person.profile}</p>
            {person.strengths.length > 0 && (
              <ul>
                {person.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {person.watchouts.length > 0 && (
              <div className={styles.watchouts}>
                {person.watchouts.map((item) => (
                  <small key={item}>{item}</small>
                ))}
              </div>
            )}
            <EvidenceDetails evidence={person.evidence} />
          </article>
        ))}
      </div>
    </section>
  );
}

function ConversationCards({
  cards,
  onOpen,
}: {
  cards: ProfileConversationCard[] | undefined;
  onOpen: (prompt: string) => void;
}) {
  if (!cards?.length) return null;
  return (
    <section className={styles.richSection}>
      <h3>Gesprekskaarten</h3>
      <div className={styles.conversationGrid}>
        {cards.map((card) => (
          <article className={styles.conversationCard} key={card.title}>
            <h4>{card.title}</h4>
            <p>{card.question}</p>
            {card.whyThisMatters && <small>{card.whyThisMatters}</small>}
            <EvidenceDetails evidence={card.evidence} />
            <button
              className={styles.chatButton}
              onClick={() => onOpen(card.question)}
              type="button"
            >
              Bespreek dit
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function GameResultAppendix({
  appendix,
}: {
  appendix: ProfileGameAppendix[] | undefined;
}) {
  if (!appendix?.length) return null;
  return (
    <details className={styles.appendix}>
      <summary>Alle gebruikte spelresultaten</summary>
      <div className={styles.appendixList}>
        {appendix.map((item) => (
          <article className={styles.appendixGame} key={`${item.gameId}-${item.completedAt}`}>
            <h4>{item.gameTitle}</h4>
            <p>{item.summary}</p>
            <pre>{JSON.stringify(item.result, null, 2)}</pre>
          </article>
        ))}
      </div>
    </details>
  );
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
            Speel minimaal {selected.requiredGames} spellen op kaart{" "}
            {selected.world} om dit profielhoofdstuk te openen. Jullie staan op{" "}
            {selected.completedGameCount}/{selected.requiredGames}; nog{" "}
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

          {(selected.overviewSummary || selected.coupleImage) && (
            <section className={styles.richIntro}>
              {selected.overviewSummary && (
                <article>
                  <span className={styles.richKicker}>Samenvatting</span>
                  <p>{selected.overviewSummary}</p>
                </article>
              )}
              {selected.coupleImage && (
                <article>
                  <span className={styles.richKicker}>
                    Verwerkt beeld van jullie samen
                  </span>
                  <p>{selected.coupleImage}</p>
                </article>
              )}
            </section>
          )}

          <PersonProfiles people={selected.personProfiles} />
          <RichBlockSection
            title="Sterke kanten"
            blocks={selected.relationshipStrengths}
          />
          <RichBlockSection
            title="Uitdagingen"
            blocks={selected.relationshipChallenges}
          />
          <RichBlockSection
            title="Ontspanningskansen"
            blocks={selected.relaxationChances}
          />
          <RichBlockSection title="Tips" blocks={selected.practicalTips} />
          <ConversationCards
            cards={selected.conversationCards}
            onOpen={openConversation}
          />

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
                <EvidenceDetails evidence={profileCard.evidence} />
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

          <GameResultAppendix appendix={selected.gameResultAppendix} />

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
