import styles from './EqBars.module.css';

// Small animated bar trio used to mark whichever row is currently playing.
export function EqBars() {
  return (
    <span className={styles.eq} aria-hidden="true">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
  );
}
