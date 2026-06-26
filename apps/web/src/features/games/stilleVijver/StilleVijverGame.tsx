import type { GameComponentProps } from "@slow-dating/game-kit";

import styles from "../../../App.module.css";
import type { StilleVijverAction, StilleVijverState } from "./contracts";

export function StilleVijverGame({
  partnerName,
  pauseGame,
}: GameComponentProps<StilleVijverState, StilleVijverAction>) {
  return (
    <main className={styles.gameWelcome}>
      <div className={styles.gameWelcomeCard}>
        <span>Stille vijver</span>
        <h1>Even vertragen</h1>
        <p>
          Dit spel loopt nu nog via de bestaande versie. De native versie wordt
          later uitgewerkt voor jou en {partnerName}.
        </p>
        {pauseGame && (
          <button className={styles.primaryButton} onClick={pauseGame} type="button">
            Terug naar kaart
          </button>
        )}
      </div>
    </main>
  );
}
