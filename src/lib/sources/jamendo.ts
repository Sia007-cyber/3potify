// src/lib/sources/jamendo.ts
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

async function fetchJamendoTracks(
  params: Record<string, string>
): Promise<Track[]> {
  if (!JAMENDO_CLIENT_ID) {
    throw new Error(
      'Missing VITE_JAMENDO_CLIENT_ID — add it to your .env file.'
    );
  }

  const search = new URLSearchParams({
    client_id: JAMENDO_CLIENT_ID,
    format: 'json',
    audioformat: 'mp32',
    ...params,
  });

  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${search}`);

  if (!res.ok) {
    throw new Error(`Jamendo request failed: ${res.status}`);
  }

  const data: JamendoApiResponse = await res.json();

  if (data.headers.status !== 'success') {
    throw new Error(data.headers.error_message || 'Jamendo returned an error');
  }

  return data.results.map(mapToTrack);
}

export async function searchJamendoTracks(query: string): Promise<Track[]> {
  if (!query.trim()) {
    return [];
  }

  return fetchJamendoTracks({
    limit: '20',
    namesearch: query,
  });
}

/** Used as the default track list before the user searches for anything. */
export async function fetchPopularJamendoTracks(): Promise<Track[]> {
  return fetchJamendoTracks({
    limit: '20',
    order: 'popularity_total',
  });
}