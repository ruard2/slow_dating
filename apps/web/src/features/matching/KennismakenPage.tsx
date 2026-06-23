import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { Introduction } from "@slow-dating/contracts";

import { LoadingScreen } from "../../app/LoadingScreen";
import { api } from "../../lib/api";
import styles from "./KennismakenPage.module.css";

const REPORT_REASONS = [
  { id: "ongepast", label: "ongepast" },
  { id: "nep-profiel", label: "nep" },
  { id: "grensoverschrijdend", label: "grens" },
  { id: "spam", label: "spam" },
] as const;

function ageLabel(birthYear: number | null) {
  if (!birthYear) return null;
  return `${new Date().getFullYear() - birthYear} jaar`;
}

function metaLine(intro: Introduction) {
  return [ageLabel(intro.profile.birthYear), intro.profile.city || null]
    .filter(Boolean)
    .join(" · ");
}

export function KennismakenPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const introductions = useQuery({
    queryKey: ["introductions"],
    queryFn: api.getIntroductions,
  });
  const invitations = useQuery({
    queryKey: ["route-invitations"],
    queryFn: api.getRouteInvitations,
  });

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ["introductions"] });
    void queryClient.invalidateQueries({ queryKey: ["route-invitations"] });
  }

  const invite = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      api.createRouteInvitation(id, message),
    onSuccess: refresh,
  });
  const respond = useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) =>
      api.respondRouteInvitation(id, accept),
    onSuccess: async (result) => {
      refresh();
      if (result.pairId) {
        await queryClient.invalidateQueries({ queryKey: ["pair"] });
        navigate("/");
      }
    },
  });
  const block = useMutation({
    mutationFn: (id: string) => api.blockInstallation(id),
    onSuccess: refresh,
  });
  const report = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.reportInstallation(id, reason, ""),
    onSuccess: refresh,
  });

  function safety(id: string) {
    return (
      <details className={styles.safety}>
        <summary>Blokkeren of melden</summary>
        <div className={styles.safetyRow}>
          <button
            className={styles.safetyBlock}
            disabled={block.isPending}
            onClick={() => block.mutate(id)}
            type="button"
          >
            Blokkeren
          </button>
          {REPORT_REASONS.map((reason) => (
            <button
              className={styles.safetyReport}
              disabled={report.isPending}
              key={reason.id}
              onClick={() => report.mutate({ id, reason: reason.id })}
              type="button"
            >
              Meld: {reason.label}
            </button>
          ))}
        </div>
      </details>
    );
  }

  if (introductions.isLoading || invitations.isLoading) {
    return <LoadingScreen />;
  }

  const incoming = invitations.data?.incoming ?? [];
  const outgoing = invitations.data?.outgoing ?? [];
  const weeklyRemaining = invitations.data?.weeklyRemaining ?? 0;
  const suggestions = introductions.data ?? [];

  return (
    <main className={styles.page}>
      <button className={styles.back} onClick={() => navigate("/")} type="button">
        ← Terug
      </button>

      <header className={styles.header}>
        <span className={styles.kicker}>Kennismaken</span>
        <h1>Rustig iemand ontdekken</h1>
        <p className={styles.lead}>
          Geen eindeloos swipen. Een paar zorgvuldige kennismakingen. Zeg jij ja
          en de ander ook? Dan beginnen jullie samen bij kaart 1.
        </p>
        <p className={styles.budget}>
          Je hebt deze week nog <strong>{weeklyRemaining}</strong>{" "}
          kennismaking{weeklyRemaining === 1 ? "" : "en"}.
        </p>
      </header>

      {incoming.length > 0 && (
        <section className={styles.block}>
          <h2>Iemand wil jou beter leren kennen</h2>
          {incoming.map(({ invitation, counterpart }) => (
            <article className={styles.card} key={invitation.id}>
              <div className={styles.cardHead}>
                <strong>{counterpart.profile.displayName}</strong>
                <span>{metaLine(counterpart)}</span>
              </div>
              {invitation.message && (
                <p className={styles.message}>“{invitation.message}”</p>
              )}
              {counterpart.reasons.length > 0 && (
                <ul className={styles.reasons}>
                  {counterpart.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
              <p className={styles.ask}>Wil jij dat ook?</p>
              <div className={styles.actions}>
                <button
                  className={styles.primary}
                  disabled={respond.isPending}
                  onClick={() =>
                    respond.mutate({ id: invitation.id, accept: true })
                  }
                  type="button"
                >
                  Ja, samen verder
                </button>
                <button
                  className={styles.ghost}
                  disabled={respond.isPending}
                  onClick={() =>
                    respond.mutate({ id: invitation.id, accept: false })
                  }
                  type="button"
                >
                  Nu niet
                </button>
              </div>
              {safety(counterpart.installationId)}
            </article>
          ))}
        </section>
      )}

      {outgoing.length > 0 && (
        <section className={styles.block}>
          <h2>Jij wacht op antwoord</h2>
          {outgoing.map(({ invitation, counterpart }) => (
            <article className={styles.cardMuted} key={invitation.id}>
              <strong>{counterpart.profile.displayName}</strong>
              <span> — kennismaking verstuurd</span>
            </article>
          ))}
        </section>
      )}

      <section className={styles.block}>
        <h2>Misschien iets voor jou</h2>
        {suggestions.length === 0 ? (
          <p className={styles.empty}>
            Op dit moment geen nieuwe kennismakingen. Vul je profiel verder aan
            of kom later terug — nabijheid groeit niet door haast.
          </p>
        ) : (
          suggestions.map((intro) => (
            <form
              className={styles.card}
              key={intro.installationId}
              onSubmit={(event) => {
                event.preventDefault();
                const message = String(
                  new FormData(event.currentTarget).get("message") ?? "",
                );
                invite.mutate({ id: intro.installationId, message });
              }}
            >
              <div className={styles.cardHead}>
                <strong>{intro.profile.displayName}</strong>
                <span>{metaLine(intro)}</span>
              </div>
              {intro.profile.bio && (
                <p className={styles.bio}>{intro.profile.bio}</p>
              )}
              {intro.reasons.length > 0 && (
                <ul className={styles.reasons}>
                  {intro.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
              <textarea
                className={styles.messageInput}
                maxLength={400}
                name="message"
                placeholder="Een persoonlijk woord erbij (optioneel)…"
                rows={2}
              />
              <button
                className={styles.primary}
                disabled={invite.isPending || weeklyRemaining === 0}
                type="submit"
              >
                Ja, ik wil {intro.profile.displayName} beter leren kennen
              </button>
              {safety(intro.installationId)}
            </form>
          ))
        )}
        {weeklyRemaining === 0 && suggestions.length > 0 && (
          <p className={styles.empty}>
            Je kennismakingen voor deze week zijn op. Neem even rust.
          </p>
        )}
      </section>
    </main>
  );
}
