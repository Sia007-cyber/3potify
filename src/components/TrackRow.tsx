import type { Track } from '../types/track';
import { EqBars } from './EqBars';
import styles from './TrackRow.module.css';

interface TrackRowProps {
  track: Track;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (track: Track) => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrackRow({ track, index, isActive, isPlaying, onSelect }: TrackRowProps) {
  return (
    <button
      className={isActive ? styles.rowActive : styles.row}
      onClick={() => onSelect(track)}
    >
      <span className={styles.index}>
        {isActive && isPlaying ? <EqBars /> : index + 1}
      </span>
      <img className={styles.artwork} src={track.artwork} alt="" />
      <span className={styles.info}>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
      </span>
      <span className={styles.duration}>{formatDuration(track.durationSec)}</span>
    </button>
  );
}
