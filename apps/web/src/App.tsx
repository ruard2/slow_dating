import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";

import { healthResponseSchema } from "@slow-dating/contracts";
import { Button, Surface } from "@slow-dating/ui";

import styles from "./App.module.css";
import { useAppStore } from "./store/appStore";

async function loadHealth() {
  const response = await fetch("/api/health");

  if (!response.ok) {
    throw new Error(`API reageerde met status ${response.status}`);
  }

  return healthResponseSchema.parse(await response.json());
}

function FoundationPage() {
  const environmentLabel = useAppStore((state) => state.environmentLabel);
  const health = useQuery({
    queryKey: ["health"],
    queryFn: loadHealth,
  });

  const apiLabel = health.isSuccess
    ? "API verbonden"
    : health.isError
      ? "API niet bereikbaar"
      : "API controleren";

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{environmentLabel}</p>
        <h1>Slow Dating</h1>
        <p className={styles.intro}>
          De nieuwe modulaire basis staat. Bestaande spellen blijven voorlopig
          onaangeraakt en worden later een voor een overgezet.
        </p>

        <Surface className={styles.statusCard}>
          <div>
            <span className={styles.statusLabel}>Fundament</span>
            <strong>{apiLabel}</strong>
          </div>
          <span
            aria-hidden="true"
            className={health.isSuccess ? styles.online : styles.pending}
          />
        </Surface>

        <Button
          disabled
          title="De wereldkaart wordt in fase 4 gemigreerd"
          type="button"
        >
          Wereldkaart volgt
        </Button>
      </section>
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<FoundationPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
