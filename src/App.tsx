import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TrackRow } from './components/TrackRow';
import { PlayerBar } from './components/PlayerBar';
import { mockTracks, mockPlaylists } from './lib/mockData';
import type { Track } from './types/track';
import styles from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Placeholder — real playback progress will come from whichever
  // audio source (Jamendo/Audius/SoundCloud) we wire in next.
  const progressSec = 0;

  const filtered = mockTracks.filter((t) =>
    `${t.title} ${t.artist}`.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(track: Track) {
    if (activeTrack?.id === track.id) {
      setIsPlaying((p) => !p);
    } else {
      setActiveTrack(track);
      setIsPlaying(true);
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar playlists={mockPlaylists} />

      <div className={styles.main}>
        <TopBar query={query} onQueryChange={setQuery} />

        <section className={styles.content}>
          <h1 className={styles.heading}>All Tracks</h1>
          <div className={styles.list}>
            {filtered.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                isActive={activeTrack?.id === track.id}
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
          progressSec={progressSec}
          onTogglePlay={() => setIsPlaying((p) => !p)}
        />
      </div>
    </div>
  );
}

export default App;
