import type { Track } from '../types/track';
import styles from './PlayerBar.module.css';

interface PlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  progressSec: number;
  onTogglePlay: () => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function PlayerBar({ track, isPlaying, progressSec, onTogglePlay }: PlayerBarProps) {
  const pct = track ? Math.min(100, (progressSec / track.durationSec) * 100) : 0;

  return (
    <footer className={styles.bar}>
      <div className={styles.nowPlaying}>
        {track ? (
          <>
            <img className={styles.artwork} src={track.artwork} alt="" />
            <span className={styles.meta}>
              <span className={styles.title}>{track.title}</span>
              <span className={styles.artist}>{track.artist}</span>
            </span>
          </>
        ) : (
          <span className={styles.empty}>Nothing playing yet</span>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.transport}>
          <button className={styles.iconBtn} aria-label="Previous">⏮</button>
          <button
            className={styles.playBtn}
            onClick={onTogglePlay}
            disabled={!track}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.iconBtn} aria-label="Next">⏭</button>
        </div>
        <div className={styles.progressRow}>
          <span className={styles.time}>{formatDuration(progressSec)}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.time}>
            {track ? formatDuration(track.durationSec) : '0:00'}
          </span>
        </div>
      </div>

      <div className={styles.volume} />
    </footer>
  );
}
