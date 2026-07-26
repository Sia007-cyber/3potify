import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { TrackRow } from "./components/TrackRow";
import { PlayerBar } from "./components/PlayerBar";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import {
  searchJamendoTracks,
  fetchPopularJamendoTracks,
} from "./lib/sources/jamendo";
import type { Track, Playlist } from "./types/track";
import styles from "./App.module.css";

// Playlists are still placeholders — Jamendo's playlist endpoints are a
// separate follow-up, not wired in yet.
const placeholderPlaylists: Playlist[] = [
  { id: "p1", name: "Late Night", trackIds: [] },
  { id: "p2", name: "Focus", trackIds: [] },
];

function App() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const activeTrack =
    activeIndex !== null ? (tracks[activeIndex] ?? null) : null;

  const handleNext = () => {
    setActiveIndex((i) => {
      if (i === null || tracks.length === 0) return i;
      return (i + 1) % tracks.length;
    });
  };

  const handlePrev = () => {
    setActiveIndex((i) => {
      if (i === null || tracks.length === 0) return i;
      return (i - 1 + tracks.length) % tracks.length;
    });
  };

  const { isPlaying, currentTime, duration, togglePlay, seek } = useAudioPlayer(
    activeTrack,
    handleNext,
  );

  // Debounced fetch: popular tracks by default, live search once the user types.
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const results = query.trim()
          ? await searchJamendoTracks(query)
          : await fetchPopularJamendoTracks();
        if (!cancelled) {
          setTracks(results);
          setStatus("idle");
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setStatus("error");
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function handleSelect(track: Track) {
    const index = tracks.findIndex((t) => t.id === track.id);
    if (index === -1) return;
    if (activeIndex === index) {
      togglePlay();
    } else {
      setActiveIndex(index);
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar playlists={placeholderPlaylists} />

      <div className={styles.main}>
        <TopBar query={query} onQueryChange={setQuery} />

        <section className={styles.content}>
          <h1 className={styles.heading}>
            {query.trim() ? `Results for "${query}"` : "Popular Tracks"}
          </h1>

          {status === "error" && (
            <p
              className={styles.heading}
              style={{ fontSize: 14, color: "#e05252" }}
            >
              Couldn't load tracks. Check your Jamendo client ID and connection.
            </p>
          )}

          <div className={styles.list}>
            {tracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                isActive={activeIndex === i}
                isPlaying={isPlaying}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      </div>

      <div className={styles.playerSlot}>
        <PlayerBar
          track={activeTrack}
          isPlaying={isPlaying}
          progressSec={currentTime}
          durationSec={activeTrack ? duration || activeTrack.durationSec : 0}
          onTogglePlay={togglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onSeek={seek}
        />
      </div>
    </div>
  );
}

export default App;
