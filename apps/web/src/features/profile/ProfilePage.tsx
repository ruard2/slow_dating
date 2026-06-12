import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: (changes: Record<string, string>) =>
      api.updateProfile(changes),
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
          update.mutate({
            displayName: String(form.get("displayName") ?? ""),
            bio: String(form.get("bio") ?? ""),
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
        <button className={styles.primaryButton} disabled={update.isPending}>
          Opslaan
        </button>
        {update.isSuccess && (
          <p className={styles.success}>Profiel opgeslagen.</p>
        )}
      </form>
      {insights.data && (
        <section className={styles.insightsCard}>
          <span>Jouw geschiedenis</span>
          <h2>Profielinzichten</h2>
          <div className={styles.insightStats}>
            <div>
              <strong>{insights.data.personal.completedRuns}</strong>
              <small>semantische spelresultaten</small>
            </div>
            <div>
              <strong>{insights.data.personal.waiting.totalWaitCount}</strong>
              <small>keer gewacht</small>
            </div>
            <div>
              <strong>
                {Math.round(
                  insights.data.personal.waiting.totalWaitSeconds / 60,
                )}
              </strong>
              <small>minuten gewacht</small>
            </div>
          </div>
          <h3>Waarden die bij jou terugkomen</h3>
          {insights.data.personal.values.length ? (
            <div className={styles.valueChips}>
              {insights.data.personal.values.map((value) => (
                <span key={value.valueId}>
                  {valueNames.get(value.valueId) ?? value.valueId}
                  {value.occurrences > 1 ? ` · ${value.occurrences}×` : ""}
                </span>
              ))}
            </div>
          ) : (
            <p>Na voltooide spellen verschijnen hier jouw inzichten.</p>
          )}
          {insights.data.currentRelationship && (
            <div className={styles.relationshipInsight}>
              <h3>Jij en {insights.data.currentRelationship.partnerName}</h3>
              <p>
                <strong>Gedeeld:</strong>{" "}
                {valueList(insights.data.currentRelationship.sharedValues) ||
                  "nog geen gedeelde waarden"}
              </p>
              <p>
                <strong>Verschillend:</strong>{" "}
                {valueList(insights.data.currentRelationship.differingValues) ||
                  "nog geen verschillen berekend"}
              </p>
            </div>
          )}
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
                    ontdekkingen
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
