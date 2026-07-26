// src/components/PlayerBar.tsx
import type { Track } from "../types/track";
import styles from "./PlayerBar.module.css";

interface PlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  progressSec: number;
  durationSec: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
}

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar({
  track,
  isPlaying,
  progressSec,
  durationSec,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
}: PlayerBarProps) {
  const pct = durationSec
    ? Math.min(100, (progressSec / durationSec) * 100)
    : 0;

  function handleSeekClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!track || !durationSec) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, fraction)) * durationSec);
  }

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
          <button
            className={styles.iconBtn}
            onClick={onPrev}
            disabled={!track}
            aria-label="Previous"
          >
            ⏮
          </button>
          <button
            className={styles.playBtn}
            onClick={onTogglePlay}
            disabled={!track}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            className={styles.iconBtn}
            onClick={onNext}
            disabled={!track}
            aria-label="Next"
          >
            ⏭
          </button>
        </div>
        <div className={styles.progressRow}>
          <span className={styles.time}>{formatDuration(progressSec)}</span>
          <div
            className={styles.track}
            onClick={handleSeekClick}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={durationSec}
            aria-valuenow={progressSec}
          >
            <div className={styles.fill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.time}>{formatDuration(durationSec)}</span>
        </div>
      </div>

      <div className={styles.volume} />
    </footer>
  );
}
