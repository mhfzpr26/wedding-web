'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaBackwardStep,
  FaForwardStep,
  FaHeart,
  FaPause,
  FaPlay,
  FaRegHeart,
  FaRepeat,
  FaShuffle,
  FaTv,
  FaVolumeHigh,
  FaVolumeXmark,
} from 'react-icons/fa6';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingMusic } from '@/types/wedding';

export interface SpotifyBottomPlayerProps {
  music?: WeddingMusic;
  coverImage?: string;
}

export const SpotifyBottomPlayer: React.FC<SpotifyBottomPlayerProps> = ({
  music,
  coverImage = '/images/spotify-cover-bg.jpg',
}) => {
  const audioPlaying = useInvitationStore((s) => s.audioPlaying);
  const trailerPlaying = useInvitationStore((s) => s.trailerPlaying);
  const toggleAudio = useInvitationStore((s) => s.toggleAudio);
  const _setAudioPlaying = useInvitationStore((s) => s.setAudioPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLiked, setIsLiked] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38); // visual scrubber percentage
  const [currentTime, setCurrentTime] = useState('01:14');
  const [duration, setDuration] = useState('03:24');

  const audioUrl = music?.audioUrl ? music.audioUrl.trim() : '';
  const trackTitle = music?.title || 'Until I Found You (Wedding Version)';
  const trackArtist = music?.artist || 'Stephen Sanchez • Destia & Rakafansa';

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audioUrl) {
      audio.play().catch(() => {});
    }
  }, [audioUrl]);

  const handlePause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  useEffect(() => {
    if (!audioUrl) return;
    const shouldPlay = audioPlaying && !trailerPlaying;
    if (shouldPlay) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [audioPlaying, trailerPlaying, audioUrl, handlePlay, handlePause]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio?.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(pct);
      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      setCurrentTime(
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      );

      const dMins = Math.floor(audio.duration / 60);
      const dSecs = Math.floor(audio.duration % 60);
      setDuration(
        `${String(dMins).padStart(2, '0')}:${String(dSecs).padStart(2, '0')}`,
      );
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <aside className="spotify-bottom-player" aria-label="Now Playing Bar">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
        />
      )}

      {/* Left: Track Information */}
      <div className="spotify-player-track">
        <div className="spotify-player-thumb">
          <img src={coverImage} alt={trackTitle} />
        </div>
        <div className="spotify-player-info">
          <div className="spotify-player-title">{trackTitle}</div>
          <div className="spotify-player-artist">{trackArtist}</div>
        </div>
        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          className="spotify-control-btn"
          style={{
            color: isLiked ? '#1db954' : 'var(--sp-text-subdued)',
            marginLeft: '0.5rem',
          }}
          title={isLiked ? 'Liked Song' : 'Like'}
          aria-label="Sukai Lagu Ini"
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="spotify-player-center">
        <div className="spotify-player-controls">
          <button
            type="button"
            className="spotify-control-btn"
            title="Acak Lagu"
            aria-label="Acak Lagu"
          >
            <FaShuffle style={{ fontSize: '0.95rem' }} />
          </button>
          <button
            type="button"
            className="spotify-control-btn"
            title="Lagu Sebelumnya"
            aria-label="Lagu Sebelumnya"
          >
            <FaBackwardStep />
          </button>

          <button
            type="button"
            className="spotify-play-pause-btn"
            onClick={toggleAudio}
            title={audioPlaying ? 'Jeda' : 'Putar'}
            aria-label={audioPlaying ? 'Jeda Musik' : 'Putar Musik'}
          >
            {audioPlaying ? (
              <FaPause style={{ fontSize: '1rem' }} />
            ) : (
              <FaPlay style={{ fontSize: '1rem', marginLeft: '2px' }} />
            )}
          </button>

          <button
            type="button"
            className="spotify-control-btn"
            title="Lagu Berikutnya"
            aria-label="Lagu Berikutnya"
          >
            <FaForwardStep />
          </button>
          <button
            type="button"
            className="spotify-control-btn"
            title="Ulangi"
            aria-label="Ulangi"
          >
            <FaRepeat style={{ fontSize: '0.95rem' }} />
          </button>
        </div>

        {/* Progress Scrubber */}
        <div className="spotify-player-scrubber">
          <span className="spotify-time-stamp">{currentTime}</span>
          <div className="spotify-progress-bar-bg">
            <div
              className="spotify-progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="spotify-time-stamp">{duration}</span>
        </div>
      </div>

      {/* Right: Equalizer Spectrum & Volume */}
      <div className="spotify-player-right">
        {/* Animated Spectrum Wave */}
        <div
          className={`spotify-equalizer ${audioPlaying ? 'spotify-equalizer--playing' : ''}`}
          title={audioPlaying ? 'Audio Sedang Berputar' : 'Audio Berhenti'}
        >
          <div className="spotify-equalizer-bar bar-1" />
          <div className="spotify-equalizer-bar bar-2" />
          <div className="spotify-equalizer-bar bar-3" />
          <div className="spotify-equalizer-bar bar-4" />
        </div>

        <button
          type="button"
          onClick={handleToggleMute}
          className="spotify-control-btn"
          title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          aria-label="Bisukan atau Nyalakan Suara"
        >
          {isMuted ? <FaVolumeXmark /> : <FaVolumeHigh />}
        </button>

        <button
          type="button"
          className="spotify-control-btn"
          title="Connect Device"
          aria-label="Hubungkan Perangkat"
        >
          <FaTv style={{ fontSize: '0.95rem' }} />
        </button>
      </div>
    </aside>
  );
};
