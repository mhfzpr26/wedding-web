'use client';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { motion } from 'framer-motion';
import type React from 'react';
import { useRef, useState } from 'react';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingTrailer } from '@/types/wedding';

export interface TrailerSectionProps {
  trailer?: WeddingTrailer;
}

export const TrailerSection: React.FC<TrailerSectionProps> = ({ trailer }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(32); // initial visual scrubber

  const setTrailerPlaying = useInvitationStore((s) => s.setTrailerPlaying);

  const title = trailer?.title || 'WEDDING TRAILER';
  const subtitle =
    trailer?.subtitle ||
    'Satu-satunya teaser film resmi perjalanan cinta Destia & Rakafansa menuju pelaminan.';
  const videoUrl = trailer?.videoUrl || '/videos/wedding-teaser.mp4';
  const posterUrl = trailer?.posterUrl || '/images/gallery-1.jpg';
  const duration = trailer?.duration || '02:30 • 4K UHD';
  const filmTitle = trailer?.filmTitle || 'Destia & Rakafansa: The Journey';

  const handleTogglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying((prev) => {
        const next = !prev;
        setTrailerPlaying(next);
        return next;
      });
      return;
    }
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

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section
      id="trailer"
      className="section netflix-trailer-section"
      aria-labelledby="trailer-heading"
    >
      <div className="container">
        <motion.div
          className="netflix-trailer__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 id="trailer-heading" className="section-title">
            {title}
          </h2>

          <p className="section-subtitle">{subtitle}</p>
        </motion.div>

        {/* The 1 Dedicated Netflix Video Player */}
        <motion.div
          className="netflix-trailer__player-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div
            className={`netflix-trailer__cinema-frame ${isPlaying ? 'netflix-trailer__cinema-frame--playing' : ''}`}
          >
            {/* HTML5 Video element */}
            <video
              ref={videoRef}
              className="netflix-trailer__video-element"
              poster={posterUrl}
              playsInline
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current?.duration) {
                  setProgress(
                    (videoRef.current.currentTime / videoRef.current.duration) *
                      100,
                  );
                }
              }}
              onPause={() => {
                setIsPlaying(false);
                setTrailerPlaying(false);
              }}
              onEnded={() => {
                setIsPlaying(false);
                setTrailerPlaying(false);
              }}
            >
              {/* Fallback to sample cinematic video if available */}
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Poster Overlay when not playing */}
            {!isPlaying && (
              <div
                className="netflix-trailer__poster-overlay"
                onClick={handleTogglePlay}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt="Wedding Teaser Poster"
                  className="netflix-trailer__poster-img"
                />
                <div className="netflix-trailer__poster-vignette" />

                <div className="netflix-trailer__poster-badge-wrap">
                  <span className="netflix-badge-red">TEASER FILM</span>
                </div>

                <button
                  type="button"
                  className="netflix-trailer__big-play-btn"
                  aria-label="Play Wedding Trailer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 44, color: '#FFFFFF' }} />
                  <span className="netflix-trailer__play-pulse" />
                </button>

                <div className="netflix-trailer__poster-meta">
                  <h3 className="netflix-trailer__poster-title">{filmTitle}</h3>
                  <span className="netflix-trailer__poster-duration">
                    Duration: {duration}
                  </span>
                </div>
              </div>
            )}

            {/* Custom Netflix Video Controls Bar */}
            <div
              className={`netflix-trailer__controls ${isPlaying ? 'netflix-trailer__controls--active' : ''}`}
            >
              {/* Red Glow Progress Scrubber */}
              <div
                className="netflix-trailer__progress-bar-wrap"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  setProgress(clickPos * 100);
                  if (videoRef.current?.duration) {
                    videoRef.current.currentTime =
                      clickPos * videoRef.current.duration;
                  }
                }}
              >
                <div
                  className="netflix-trailer__progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="netflix-trailer__scrubber-head"
                  style={{ left: `${progress}%` }}
                />
              </div>

              {/* Bottom Player Buttons */}
              <div className="netflix-trailer__controls-bottom">
                <div className="netflix-trailer__controls-left">
                  <button
                    type="button"
                    className="netflix-trailer__ctrl-btn"
                    onClick={handleTogglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </button>

                  <button
                    type="button"
                    className="netflix-trailer__ctrl-btn"
                    onClick={handleToggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </button>

                  <span className="netflix-trailer__timestamp">
                    {isPlaying ? '01:14' : '00:00'} / 02:30
                  </span>
                </div>

                <div className="netflix-trailer__controls-right">
                  <span className="netflix-trailer__quality-badge">
                    4K ULTRA HD
                  </span>
                  <span className="netflix-trailer__quality-badge">
                    DOLBY ATMOS
                  </span>
                  <button
                    type="button"
                    className="netflix-trailer__ctrl-btn"
                    onClick={handleFullscreen}
                    aria-label="Fullscreen"
                  >
                    <FullscreenIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Film Synopsis & Production Metadata */}
          <div className="netflix-trailer__info-card">
            <div className="netflix-trailer__meta-row">
              <span className="netflix-spec-tag netflix-spec-tag--red">
                NETFLIX ORIGINAL WEDDING SPECIAL
              </span>
              <span className="netflix-spec-tag">4K ULTRA HD</span>
            </div>

            <p className="netflix-trailer__desc">
              Sebuah dokumenter sinematik kisah nyata dua insan, dari perjumpaan
              tak terduga hingga mengikat janji suci seumur hidup. Saksikan
              peluncuran eksklusif hari bahagia Destia Dwi Ramadhani &amp;
              Rakafansa Saputra pada 14 November 2026.
            </p>

            <div className="netflix-trailer__credits-grid">
              <div>
                <strong>Cast:</strong> Destia Dwi Ramadhani, Rakafansa Saputra
              </div>
              <div>
                <strong>Genres:</strong> Romantic, Slice of Life, Real-Life
                Documentary
              </div>
              <div>
                <strong>Director of Photography:</strong> Artha Cinematic Studio
              </div>
              <div>
                <strong>Executive Producers:</strong> Keluarga Besar Kedua
                Mempelai
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
