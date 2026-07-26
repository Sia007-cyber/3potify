import styles from './TopBar.module.css';

interface TopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function TopBar({ query, onQueryChange }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <input
        className={styles.search}
        type="text"
        placeholder="Search tracks or artists"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </header>
  );
}
