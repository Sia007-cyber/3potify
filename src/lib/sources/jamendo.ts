import type { Track } from '../../types/track';

const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID as string | undefined;

interface JamendoApiTrack {
  id: string;
  name: string;
  artist_name: string;
  album_image: string;
  duration: number;
  audio: string;
}

interface JamendoApiResponse {
  headers: {
    status: string;
    code: number;
    error_message: string;
  };
  results: JamendoApiTrack[];
}

function mapToTrack(t: JamendoApiTrack): Track {
  return {
    id: `jamendo-${t.id}`,
    title: t.name,
    artist: t.artist_name,
    artwork: t.album_image,
    durationSec: t.duration,
    streamUrl: t.audio,
    source: 'jamendo',
  };
}

export async function searchJamendoTracks(query: string): Promise<Track[]> {
  if (!JAMENDO_CLIENT_ID) {
    throw new Error(
      'Missing VITE_JAMENDO_CLIENT_ID — add it to your .env file.'
    );
  }

  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: 'json',
    limit: '20',
    namesearch: query,
    audioformat: 'mp32',
  });

  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params}`);

  if (!res.ok) {
    throw new Error(`Jamendo request failed: ${res.status}`);
  }

  const data: JamendoApiResponse = await res.json();

  if (data.headers.status !== 'success') {
    throw new Error(data.headers.error_message || 'Jamendo returned an error');
  }

  return data.results.map(mapToTrack);
}