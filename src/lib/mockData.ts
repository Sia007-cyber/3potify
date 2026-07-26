import type { Track, Playlist } from '../types/track';

// Placeholder data only — this file gets deleted once a real source
// (Jamendo / Audius / SoundCloud) is wired into src/lib/sources/.
export const mockTracks: Track[] = [
  {
    id: 't1',
    title: 'Night Drive',
    artist: 'Kilo Waves',
    artwork: 'https://picsum.photos/seed/nightdrive/200',
    durationSec: 214,
    streamUrl: '',
    source: 'local',
  },
  {
    id: 't2',
    title: 'Glass Rooms',
    artist: 'Anemic',
    artwork: 'https://picsum.photos/seed/glassrooms/200',
    durationSec: 187,
    streamUrl: '',
    source: 'local',
  },
  {
    id: 't3',
    title: 'Low Static',
    artist: 'Faust & Wire',
    artwork: 'https://picsum.photos/seed/lowstatic/200',
    durationSec: 251,
    streamUrl: '',
    source: 'local',
  },
  {
    id: 't4',
    title: 'Marble Halls',
    artist: 'Kilo Waves',
    artwork: 'https://picsum.photos/seed/marblehalls/200',
    durationSec: 198,
    streamUrl: '',
    source: 'local',
  },
];

export const mockPlaylists: Playlist[] = [
  { id: 'p1', name: 'Late Night', trackIds: ['t1', 't3'] },
  { id: 'p2', name: 'Focus', trackIds: ['t2', 't4'] },
];
