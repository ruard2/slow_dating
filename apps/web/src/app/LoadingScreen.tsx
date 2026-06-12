import styles from "../App.module.css";
import { useSession } from "../providers/SessionProvider";

export function LoadingScreen() {
  const { error } = useSession();
  return (
    <main className={styles.loading}>
      <span className={styles.logoMark}>SD</span>
      <h1>{error ?? "Jouw omgeving wordt klaargezet"}</h1>
    </main>
  );
}
