import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Pair } from "@slow-dating/contracts";

import styles from "../../App.module.css";
import { api } from "../../lib/api";

export function PairPanel({ pair }: { pair: Pair | null | undefined }) {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["pair"] });
  const create = useMutation({ mutationFn: api.createPair, onSuccess: refresh });
  const join = useMutation({
    mutationFn: () => api.joinPair(code),
    onSuccess: refresh,
  });
  const developer = useMutation({
    mutationFn: api.activateDeveloperPair,
    onSuccess: refresh,
  });
  const disconnect = useMutation({
    mutationFn: api.disconnectPair,
    onSuccess: () => {
      refresh();
      void queryClient.invalidateQueries({
        queryKey: ["relationship-archives"],
      });
    },
  });

  if (pair) {
    return (
      <>
        <span className={styles.panelKicker}>
          {pair.developerMode ? "Lokale beheerdersmodus" : "Jullie code"}
        </span>
        <div className={styles.pairCode}>
          {pair.developerMode ? "1111" : pair.code}
        </div>
        <p>
          {pair.developerMode
            ? "De computer is gekoppeld als Testpartner."
            : pair.members.length === 2
              ? "Jullie zijn gekoppeld."
              : "Deel deze code met je partner."}
        </p>
        <ul className={styles.memberList}>
          {pair.members.map((member) => (
            <li key={member.installationId}>{member.displayName}</li>
          ))}
        </ul>
        <button
          className={styles.dangerButton}
          onClick={() => disconnect.mutate()}
          type="button"
        >
          Ontkoppelen
        </button>
      </>
    );
  }

  return (
    <>
      <span className={styles.panelKicker}>Samen ontdekken</span>
      <h2>Koppel met je partner</h2>
      <button
        className={styles.primaryButton}
        onClick={() => create.mutate()}
        type="button"
      >
        Maak een code
      </button>
      <div className={styles.or}>of</div>
      <input
        className={styles.codeInput}
        maxLength={6}
        onChange={(event) =>
          setCode(event.target.value.toUpperCase().replace(/\s/g, ""))
        }
        placeholder="ABC234 of 1111"
        value={code}
      />
      <button
        disabled={code !== "1111" && code.length !== 6}
        onClick={() =>
          code === "1111" ? developer.mutate() : join.mutate()
        }
        type="button"
      >
        {code === "1111" ? "Open beheerdersmodus" : "Code gebruiken"}
      </button>
      {(create.error || join.error || developer.error) && (
        <p className={styles.error}>
          {(create.error ?? join.error ?? developer.error)?.message}
        </p>
      )}
    </>
  );
}
