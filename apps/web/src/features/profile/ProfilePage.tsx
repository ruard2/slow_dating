import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import type {
  LifeStage,
  ProfileUpdate,
  RelationIntention,
} from "@slow-dating/contracts";

import styles from "../../App.module.css";
import { LoadingScreen } from "../../app/LoadingScreen";
import { api } from "../../lib/api";
import { useSession } from "../../providers/SessionProvider";
import { values } from "../games/waarden/content";

const valueNames = new Map<string, string>(
  values.map((value) => [value.id, value.name]),
);

function valueList(valueIds: string[]) {
  return valueIds.map((valueId) => valueNames.get(valueId) ?? valueId).join(", ");
}

export function ProfilePage() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [openArchiveId, setOpenArchiveId] = useState<string | null>(null);
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.getProfile });
  const insights = useQuery({
    queryKey: ["profile-insights"],
    queryFn: api.getProfileInsights,
  });
  const archives = useQuery({
    queryKey: ["relationship-archives"],
    queryFn: api.getRelationshipArchives,
    enabled: Boolean(session?.account),
  });
  const archivedMessages = useQuery({
    queryKey: ["relationship-archive-messages", openArchiveId],
    queryFn: () => api.getRelationshipMessages(openArchiveId ?? ""),
    enabled: Boolean(openArchiveId),
  });
  const archivedResults = useQuery({
    queryKey: ["relationship-archive-results", openArchiveId],
    queryFn: () => api.getRelationshipResults(openArchiveId ?? ""),
    enabled: Boolean(openArchiveId),
  });
  const exportProfile = useMutation({
    mutationFn: api.getProfileExport,
    onSuccess: (value) => {
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(value, null, 2)], {
          type: "application/json",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `slow-dating-profiel-${value.exportedAt.slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });
  const update = useMutation({
    mutationFn: (changes: ProfileUpdate) => api.updateProfile(changes),
    onSuccess: (value) => {
      queryClient.setQueryData(["profile"], value);
    },
  });

  if (!profile.data) return <LoadingScreen />;

  return (
    <main className={styles.formPage}>
      <form
        key={profile.data.updatedAt}
        className={styles.formCard}
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const text = (key: string) => String(form.get(key) ?? "").trim();
          const num = (key: string) => {
            const value = text(key);
            return value ? Number(value) : null;
          };
          const optional = <T extends string>(key: string) =>
            (text(key) || null) as T | null;
          update.mutate({
            displayName: text("displayName"),
            bio: text("bio"),
            photoUrl: text("photoUrl") || null,
            city: text("city"),
            birthYear: num("birthYear"),
            relationIntention: optional<RelationIntention>("relationIntention"),
            lifeStage: optional<LifeStage>("lifeStage"),
            interests: text("interests")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .slice(0, 12),
            coreValues: form.getAll("coreValues").map(String),
            christianLayer: form.get("christianLayer") === "on",
            prefAgeMin: num("prefAgeMin"),
            prefAgeMax: num("prefAgeMax"),
            prefMaxDistanceKm: num("prefMaxDistanceKm"),
          });
        }}
      >
        <span>Jouw plek</span>
        <h1>Profiel</h1>
        <label>
          Naam
          <input
            defaultValue={profile.data.displayName}
            maxLength={40}
            name="displayName"
          />
        </label>
        <label>
          Iets over jou
          <textarea
            defaultValue={profile.data.bio}
            maxLength={280}
            name="bio"
            rows={5}
          />
        </label>
        <label>
          Foto-URL (optioneel)
          <input
            defaultValue={profile.data.photoUrl ?? ""}
            maxLength={600}
            name="photoUrl"
            placeholder="https://…"
          />
        </label>
        <div className={styles.formRow}>
          <label>
            Geboortejaar
            <input
              defaultValue={profile.data.birthYear ?? ""}
              max={2100}
              min={1900}
              name="birthYear"
              type="number"
            />
          </label>
          <label>
            Woonplaats
            <input
              defaultValue={profile.data.city}
              maxLength={80}
              name="city"
            />
          </label>
        </div>
        <div className={styles.formRow}>
          <label>
            Ik zoek
            <select
              defaultValue={profile.data.relationIntention ?? ""}
              name="relationIntention"
            >
              <option value="">Kies…</option>
              <option value="verkennen">Rustig verkennen</option>
              <option value="serieus">Iets serieus</option>
              <option value="vriendschap">Eerst vriendschap</option>
            </select>
          </label>
          <label>
            Levensfase
            <select
              defaultValue={profile.data.lifeStage ?? ""}
              name="lifeStage"
            >
              <option value="">Kies…</option>
              <option value="kinderwens">Kinderwens</option>
              <option value="ooit-misschien">Ooit misschien</option>
              <option value="geen-kinderwens">Geen kinderwens</option>
              <option value="heeft-kinderen">Heeft kinderen</option>
            </select>
          </label>
        </div>
        <label>
          Interesses (komma-gescheiden)
          <input
            defaultValue={profile.data.interests.join(", ")}
            name="interests"
            placeholder="wandelen, koken, muziek"
          />
        </label>
        <fieldset className={styles.valuePicker}>
          <legend>Mijn kernwaarden</legend>
          <div className={styles.valuePickerOptions}>
            {values.map((value) => (
              <label className={styles.valueOption} key={value.id}>
                <input
                  defaultChecked={profile.data.coreValues.includes(value.id)}
                  name="coreValues"
                  type="checkbox"
                  value={value.id}
                />
                {value.name}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.formRow}>
          <label>
            Leeftijd vanaf
            <input
              defaultValue={profile.data.prefAgeMin ?? ""}
              max={120}
              min={18}
              name="prefAgeMin"
              type="number"
            />
          </label>
          <label>
            Leeftijd tot
            <input
              defaultValue={profile.data.prefAgeMax ?? ""}
              max={120}
              min={18}
              name="prefAgeMax"
              type="number"
            />
          </label>
          <label>
            Max. afstand (km)
            <input
              defaultValue={profile.data.prefMaxDistanceKm ?? ""}
              max={2000}
              min={1}
              name="prefMaxDistanceKm"
              type="number"
            />
          </label>
        </div>
        <label className={styles.checkboxRow}>
          <input
            defaultChecked={profile.data.christianLayer}
            name="christianLayer"
            type="checkbox"
          />
          Christelijke verdiepingslaag aanzetten
        </label>
        <button className={styles.primaryButton} disabled={update.isPending}>
          Opslaan
        </button>
        {update.isSuccess && (
          <p className={styles.success}>Profiel opgeslagen.</p>
        )}
      </form>
      {insights.data && (
        <section className={styles.insightsCard}>
          <span>Jullie route</span>
          <h2>Profielinzichten</h2>
          <p>
            Na iedere kaart ontstaat een nieuw hoofdstuk over wie jullie zijn,
            wat opvalt, wat jullie delen en waar nieuwsgierigheid nodig blijft.
          </p>
          <div className={styles.insightStats}>
            <div>
              <strong>
                {
                  insights.data.chapters.filter((chapter) => chapter.available)
                    .length
                }
              </strong>
              <small>profielhoofdstukken</small>
            </div>
            <div>
              <strong>
                {insights.data.chapters.reduce(
                  (total, chapter) => total + chapter.completedGameCount,
                  0,
                )}
              </strong>
              <small>verschillende spellen verwerkt</small>
            </div>
            <div>
              <strong>
                {insights.data.chapters.find((chapter) => !chapter.available)
                  ?.world ?? 5}
              </strong>
              <small>volgend profiel</small>
            </div>
          </div>
          <NavLink className={styles.secondaryButton!} to="/profielschets">
            Lees jullie groeiende profiel
          </NavLink>
          <button
            className={styles.secondaryButton}
            disabled={exportProfile.isPending}
            onClick={() => exportProfile.mutate()}
            type="button"
          >
            Exporteer mijn gegevens
          </button>
        </section>
      )}
      {session?.account && (
        <section className={styles.archiveCard}>
          <span>Account</span>
          <h2>{session.account.email}</h2>
          <p>
            {session.account.emailVerified
              ? "E-mailadres geverifieerd"
              : "Controleer de lokale mail-outbox om je e-mailadres te verifiëren."}
          </p>
          <h3>Relatiearchieven</h3>
          {archives.data?.length ? (
            archives.data.map((archive) => (
              <div key={archive.id}>
                <button
                  className={styles.archiveRow}
                  onClick={() =>
                    setOpenArchiveId(
                      openArchiveId === archive.id ? null : archive.id,
                    )
                  }
                  type="button"
                >
                  <strong>
                    {archive.members
                      .map((member) => member.displayName)
                      .join(" & ")}
                  </strong>
                  <span>
                    {archive.messageCount} berichten · {archive.completedGames}{" "}
                    samen ontdekt
                  </span>
                </button>
                {openArchiveId === archive.id && (
                  <div className={styles.archiveMessages}>
                    {archivedResults.data?.map(({ provenance, result }) => {
                      const selections =
                        provenance.gameId === "waarden" &&
                        typeof result.selections === "object" &&
                        result.selections
                          ? (result.selections as Record<string, string[]>)[
                              session.installationId
                            ] ?? []
                          : [];
                      return (
                        <div
                          className={styles.archiveResult}
                          key={provenance.gameRunId}
                        >
                          <strong>
                            {provenance.gameId} · versie {provenance.gameVersion}
                          </strong>
                          <span>
                            {new Date(
                              provenance.completedAt,
                            ).toLocaleDateString("nl-NL")}
                          </span>
                          {selections.length > 0 && (
                            <p>Jouw waarden: {valueList(selections)}</p>
                          )}
                        </div>
                      );
                    })}
                    {archivedMessages.data?.map((message) => (
                      <p key={message.id}>
                        <strong>{message.senderName}:</strong> {message.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nog geen afgesloten relaties.</p>
          )}
        </section>
      )}
    </main>
  );
}
