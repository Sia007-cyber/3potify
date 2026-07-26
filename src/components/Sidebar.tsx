import type { Playlist } from "../types/track";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  playlists: Playlist[];
}

export function Sidebar({ playlists }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <img src="/3potify.png" alt="3potify" className={styles.brandMark} />
        <span className={styles.brandName}>3potify</span>
      </div>

      <nav className={styles.nav}>
        <a href="#" className={styles.navItemActive}>
          Home
        </a>
        <a href="#" className={styles.navItem}>
          Search
        </a>
        <a href="#" className={styles.navItem}>
          Your Library
        </a>
      </nav>

      <div className={styles.divider} />

      <div className={styles.playlistHeader}>Playlists</div>
      <div className={styles.playlists}>
        {playlists.map((p) => (
          <a href="#" key={p.id} className={styles.playlistItem}>
            {p.name}
          </a>
        ))}
      </div>
    </aside>
  );
}
