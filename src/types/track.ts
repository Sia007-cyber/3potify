export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  durationSec: number;
  source: 'jamendo' | 'soundcloud';
  /** Jamendo only — direct audio file URL, playable in a plain <audio> tag. */
  streamUrl?: string;
  /** SoundCloud only — the track's page URL, played via the Widget API iframe
   *  since SoundCloud doesn't expose raw stream URLs without full API access. */
  soundcloudUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  trackIds: string[];
}