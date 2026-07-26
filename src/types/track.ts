// Generic track shape. Kept source-agnostic on purpose: whichever backend
// we wire up next (Jamendo, Audius, SoundCloud, ...) just needs to map its
// response into this shape, and every component below already knows how
// to render it.
export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  durationSec: number;
  streamUrl: string;
  source: 'jamendo' | 'audius' | 'soundcloud' | 'local';
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
}
