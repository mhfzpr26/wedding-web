'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioToggle } from '@/components/molecules/AudioToggle';

import type { WeddingMusic } from '@/types/wedding';

export interface FloatingAudioProps {
  shouldPlay?: boolean;
  music?: WeddingMusic;
}

export const FloatingAudio: React.FC<FloatingAudioProps> = ({
  shouldPlay = false,
  music,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<{
    ctx: AudioContext;
    timer: NodeJS.Timeout | null;
  } | null>(null);

  const startSynthMelody = useCallback(() => {
    try {
      if (synthRef.current) return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      synthRef.current = { ctx, timer: null };

      const notes = [
        261.63, 329.63, 392.0, 523.25, 329.63, 392.0, 493.88, 659.25, 220.0,
        261.63, 329.63, 440.0, 174.61, 220.0, 261.63, 349.23,
      ];
      let step = 0;

      const playPluck = () => {
        if (!synthRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        step++;
        synthRef.current.timer = setTimeout(playPluck, 600);
      };

      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      playPluck();
    } catch {
      // Audio context error handling
    }
  }, []);

  const stopSynthMelody = useCallback(() => {
    if (synthRef.current) {
      if (synthRef.current.timer) clearTimeout(synthRef.current.timer);
      if (synthRef.current.ctx) synthRef.current.ctx.close();
      synthRef.current = null;
    }
  }, []);

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            startSynthMelody();
            setIsPlaying(true);
          });
      }
    } else {
      startSynthMelody();
      setIsPlaying(true);
    }
  }, [startSynthMelody]);

  const handlePause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    stopSynthMelody();
    setIsPlaying(false);
  }, [stopSynthMelody]);

  useEffect(() => {
    if (shouldPlay && !isPlaying) {
      handlePlay();
    }
  }, [shouldPlay, isPlaying, handlePlay]);

  const toggleAudio = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <div
      className="audio-player"
      role="region"
      aria-label="Pemutar Musik Latar"
    >
      <audio
        ref={audioRef}
        src={music?.audioUrl || '/audio/wedding-song.mp3'}
        loop
        preload="auto"
      />
      <AudioToggle isPlaying={isPlaying} onToggle={toggleAudio} />
    </div>
  );
};
