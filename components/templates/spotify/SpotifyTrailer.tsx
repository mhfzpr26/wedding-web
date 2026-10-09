'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeHigh,
  FaVolumeXmark,
} from 'react-icons/fa6';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingTrailer } from '@/types/wedding';

export interface SpotifyTrailerProps {
  trailer?: WeddingTrailer;
}

export const SpotifyTrailer: React.FC<SpotifyTrailerProps> = ({ trailer }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const setTrailerPlaying = useInvitationStore((s) => s.setTrailerPlaying);

  const title = trailer?.title || 'WEDDING CANVAS TEASER';
  const subtitle =
    trailer?.subtitle ||
    'Satu-satunya teaser film resmi perjalanan cinta Destia & Rakafansa menuju pelaminan.';
  const videoUrl = trailer?.videoUrl || '/videos/wedding-teaser.mp4';
  const posterUrl = trailer?.posterUrl || '/images/spotify-cover-bg.jpg';
  const duration = trailer?.duration || '02:30 • 4K UHD';
  const filmTitle = trailer?.filmTitle || 'Destia & Rakafansa: The Journey';

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setTrailerPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setTrailerPlaying(true);
        })
        .catch(() => {
          setIsPlaying(true);
          setTrailerPlaying(true);
        });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section
      id="canvas"
      className="spotify-section"
      aria-label="Spotify Canvas Section"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">
            SPOTIFY CANVAS • EXCLUSIVE TEASER
          </span>
          <h2 className="spotify-section__title">{title}</h2>
          <p className="spotify-section__subtitle">{subtitle}</p>
        </div>

        <div className="spotify-canvas-wrapper">
          <div className="spotify-canvas-player">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              playsInline
              onEnded={() => {
                setIsPlaying(false);
                setTrailerPlaying(false);
              }}
            />

            {/* Custom Overlay Controls */}
            <div className="spotify-canvas-controls">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <button
                  type="button"
                  onClick={togglePlay}
                  className="spotify-play-pause-btn"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <FaPause style={{ fontSize: '1rem' }} />
                  ) : (
                    <FaPlay style={{ fontSize: '1rem', marginLeft: '2px' }} />
                  )}
                </button>

                <div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    {filmTitle}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--sp-text-subdued)',
                    }}
                  >
                    {duration}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <button
                  type="button"
                  onClick={toggleMute}
                  className="spotify-icon-btn"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <FaVolumeXmark /> : <FaVolumeHigh />}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="spotify-icon-btn"
                  title="Fullscreen"
                >
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
