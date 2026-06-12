import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import styles from "../../App.module.css";
import { LoadingScreen } from "../../app/LoadingScreen";
import { api } from "../../lib/api";
import { useSession } from "../../providers/SessionProvider";

export function ProfilePage() {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [openArchiveId, setOpenArchiveId] = useState<string | null>(null);
  const profile = useQuery({ queryKey: ["profile"], queryFn: api.getProfile });
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
