// src/hooks/useAudioPlayer.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Track } from '../types/track';

interface UseAudioPlayerResult {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  seek: (seconds: number) => void;
}

/**
 * Owns a single <audio> element for whichever track is currently active.
 * Loads a new src whenever `track` changes, autoplays it, and calls
 * `onEnded` when playback finishes (so the caller can advance to next).
 */
export function useAudioPlayer(
  track: Track | null,
  onEnded: () => void
): UseAudioPlayerResult {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Keep the latest onEnded in a ref so the event listener (attached once)
  // never calls a stale version of it.
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  // Lazily create the audio element once.
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  // Load + autoplay whenever the track changes.
  useEffect(() => {
    const audio = audioRef.current!;
    const src = track?.streamUrl;

    if (!src) {
      audio.pause();
      audio.removeAttribute('src');
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    audio.src = src;
    setCurrentTime(0);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false)); // e.g. blocked by autoplay policy
  }, [track?.id, track?.streamUrl]);

  // Wire up event listeners once.
  useEffect(() => {
    const audio = audioRef.current!;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEndedEvent = () => {
      setIsPlaying(false);
      onEndedRef.current();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEndedEvent);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEndedEvent);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current!;
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current!;
    if (!audio.src) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  return { isPlaying, currentTime, duration, togglePlay, seek };
}