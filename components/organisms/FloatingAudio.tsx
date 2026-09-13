'use client';

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { AudioToggle } from '@/components/molecules/AudioToggle';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingMusic } from '@/types/wedding';

export interface FloatingAudioProps {
  shouldPlay?: boolean;
  music?: WeddingMusic;
}

export const FloatingAudio: React.FC<FloatingAudioProps> = ({
  shouldPlay = false,
  music,
}) => {
  const audioPlaying = useInvitationStore((s) => s.audioPlaying);
  const trailerPlaying = useInvitationStore((s) => s.trailerPlaying);
  const toggleAudio = useInvitationStore((s) => s.toggleAudio);
  const setAudioPlaying = useInvitationStore((s) => s.setAudioPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = music?.audioUrl ? music.audioUrl.trim() : '';

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audioUrl) {
      audio.play().catch(() => {
        // Browser prevented autoplay before user interaction
      });
    }
  }, [audioUrl]);

  const handlePause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  // Sync with shouldPlay prop if provided
  useEffect(() => {
    if (shouldPlay && !audioPlaying && audioUrl) {
      setAudioPlaying(true);
    }
  }, [shouldPlay, audioPlaying, audioUrl, setAudioPlaying]);

  // Handle actual audio play/pause based on Zustand store
  useEffect(() => {
    if (!audioUrl) return;
    const shouldActuallyPlay = audioPlaying && !trailerPlaying;
    if (shouldActuallyPlay) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [audioPlaying, trailerPlaying, audioUrl, handlePlay, handlePause]);

  // If no music is configured by admin, do not render audio player
  if (!audioUrl) {
    return null;
  }

  return (
    <div
      className="audio-player"
      role="region"
      aria-label="Pemutar Musik Latar"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />
      <AudioToggle
        isPlaying={audioPlaying && !trailerPlaying}
        onToggle={toggleAudio}
      />
    </div>
  );
};
