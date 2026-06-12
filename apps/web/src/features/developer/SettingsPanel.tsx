import { NavLink } from "react-router-dom";

import type { Pair } from "@slow-dating/contracts";

import styles from "../../App.module.css";
import { useAppStore } from "../../store/appStore";

export function SettingsPanel({
  developerPartnerPresent,
  onDeveloperPartnerPresenceChange,
  pair,
  partnerOnline,
}: {
  developerPartnerPresent: boolean;
  onDeveloperPartnerPresenceChange(present: boolean): void;
  pair: Pair | null | undefined;
  partnerOnline: boolean;
}) {
  const setDrawer = useAppStore((state) => state.setDrawer);

  return (
    <div className={styles.settingsPanel}>
      <span className={styles.panelKicker}>Instellingen</span>
      <h2>Jouw omgeving</h2>
      <p className={styles.partnerStatus} data-online={partnerOnline}>
        <span />
        {partnerOnline ? "Partner is online" : "Partner is offline"}
      </p>
      <NavLink onClick={() => setDrawer(null)} to="/profile">
        Profiel beheren
      </NavLink>
      <NavLink onClick={() => setDrawer(null)} to="/account">
        Account en herstel
      </NavLink>
      {pair?.developerMode && (
        <section className={styles.developerControls}>
          <span className={styles.panelKicker}>Testpartner</span>
          <p>
            Simuleer of de computerpartner al in het spel aanwezig is. Je
            beheerderskoppeling blijft bewaard.
          </p>
          <div>
            <button
              data-selected={!developerPartnerPresent}
              onClick={() => onDeveloperPartnerPresenceChange(false)}
              type="button"
            >
              Afwezig
            </button>
            <button
              data-selected={developerPartnerPresent}
              onClick={() => onDeveloperPartnerPresenceChange(true)}
              type="button"
            >
              Aanwezig
            </button>
          </div>
          <small>
            {developerPartnerPresent
              ? "Spellen starten direct."
              : "Je krijgt eerst de centrale wachtkamer."}
          </small>
        </section>
      )}
      <button onClick={() => setDrawer("pair")} type="button">
        {pair ? "Koppeling beheren" : "Partner koppelen"}
      </button>
    </div>
  );
}
