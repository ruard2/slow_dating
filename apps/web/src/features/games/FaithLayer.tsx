import styles from "./FaithLayer.module.css";

/**
 * De christelijke verdiepingslaag. Verschijnt alleen als beide partners die
 * laag hebben aangezet (pair.christianLayer). Bewust uitnodigend, nooit
 * dwingend: een paar zachte vragen die het spelthema in geloofslicht zetten.
 */
export function FaithLayer({
  intro,
  prompts,
  title = "In het licht van geloof",
}: {
  intro?: string;
  prompts: string[];
  title?: string;
}) {
  if (!prompts.length) return null;
  return (
    <aside className={styles.faith}>
      <span className={styles.badge}>✦ Geloofslaag</span>
      <h3>{title}</h3>
      {intro && <p className={styles.intro}>{intro}</p>}
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
      <p className={styles.gentle}>
        Neem hier rustig de tijd voor — bespreek samen wat past, laat staan wat
        nu niet past.
      </p>
    </aside>
  );
}
