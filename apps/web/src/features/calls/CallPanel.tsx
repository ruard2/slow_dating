import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Pair } from "@slow-dating/contracts";

import styles from "../../App.module.css";
import { api } from "../../lib/api";
import { useCall } from "../../providers/CallProvider";
import { useSession } from "../../providers/SessionProvider";

export function CallPanel({ pair }: { pair: Pair | null | undefined }) {
  const call = useCall();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const access = useQuery({
    queryKey: ["call-access", pair?.id],
    queryFn: api.getCallAccess,
    enabled: Boolean(pair && pair.members.length === 2),
  });
  const requestAccess = useMutation({
    mutationFn: api.requestCallAccess,
    onSuccess: (value) =>
      queryClient.setQueryData(["call-access", pair?.id], value),
  });
  const answerAccess = useMutation({
    mutationFn: api.answerCallAccess,
    onSuccess: (value) =>
      queryClient.setQueryData(["call-access", pair?.id], value),
  });

  if (!pair || pair.members.length < 2) {
    return <p>Koppel eerst met je partner om te bellen.</p>;
  }
  if (!access.data) {
    return <p>Beltoegang wordt gecontroleerd...</p>;
  }
  if (!access.data.unlocked) {
    const requestFromPartner =
      access.data.requestedBy &&
      access.data.requestedBy !== session?.installationId;
    return (
      <div className={styles.callPanel}>
        <h2>Bellen samen vrijspelen</h2>
        <p>
          {Math.min(30, Math.floor(access.data.sharedSeconds / 60))} / 30
          minuten samen
        </p>
        <p>{access.data.completedGames} / 5 spellen samen ontdekt</p>
        <p>
          Minimaal 10 berichten per persoon:{" "}
          {Object.values(access.data.messagesByMember).join(" en ")}
        </p>
        {requestFromPartner ? (
          <div className={styles.callActions}>
            <button
              className={styles.primaryButton}
              onClick={() => answerAccess.mutate("yes")}
            >
              Bellen toestaan
            </button>
            <button onClick={() => answerAccess.mutate("no")}>Nog niet</button>
          </div>
        ) : (
          <button
            className={styles.primaryButton}
            disabled={!access.data.conditionsMet || requestAccess.isPending}
            onClick={() => requestAccess.mutate()}
          >
            Vraag toestemming
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.callPanel}>
      <span className={styles.callPulse} data-active={call.status !== "idle"} />
      <h2>
        {call.status === "idle"
          ? "Even echt horen"
          : `Status: ${call.status}`}
      </h2>
      {call.status === "idle" && (
        <button
          className={styles.primaryButton}
          onClick={() => void call.start()}
        >
          Bel partner
        </button>
      )}
      {call.status === "ringing" && (
        <div className={styles.callActions}>
          <button
            className={styles.primaryButton}
            onClick={() => void call.accept()}
          >
            Opnemen
          </button>
          <button onClick={call.decline}>Weigeren</button>
        </div>
      )}
      {!["idle", "ringing"].includes(call.status) && (
        <button className={styles.dangerButton} onClick={call.hangup}>
          Ophangen
        </button>
      )}
    </div>
  );
}
