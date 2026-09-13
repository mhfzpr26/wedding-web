'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import { useInView } from '@/hooks/useInView';

export const TrailerSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(32); // initial visual scrubber

  const handleTogglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying(prev => !prev);
      return;
    }
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(true));
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
      ref={ref}
      className="section netflix-trailer-section"
      aria-labelledby="trailer-heading"
    >
      <div className="container">
        <div
          className="netflix-trailer__header"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-badge-pill">
            <MovieFilterIcon sx={{ fontSize: 16 }} />
            <span>EXCLUSIVE PREVIEW • TEASER FILM</span>
          </div>

          <h2 id="trailer-heading" className="section-title">
            OFFICIAL WEDDING TRAILER
          </h2>

          <p className="section-subtitle">
            Satu-satunya teaser film resmi perjalanan cinta Destia &amp; Rakafansa menuju pelaminan.
          </p>
        </div>

        {/* The 1 Dedicated Netflix Video Player */}
        <div
          className="netflix-trailer__player-wrapper"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <div className={`netflix-trailer__cinema-frame ${isPlaying ? 'netflix-trailer__cinema-frame--playing' : ''}`}>
            {/* HTML5 Video element */}
            <video
              ref={videoRef}
              className="netflix-trailer__video-element"
              poster="/images/gallery-1.jpg"
              playsInline
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current?.duration) {
                  setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
                }
              }}
              onEnded={() => setIsPlaying(false)}
            >
              {/* Fallback to sample cinematic video if available */}
              <source src="/videos/wedding-teaser.mp4" type="video/mp4" />
            </video>

            {/* Poster Overlay when not playing */}
            {!isPlaying && (
              <div className="netflix-trailer__poster-overlay" onClick={handleTogglePlay}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/gallery-1.jpg"
                  alt="Official Wedding Teaser Poster"
                  className="netflix-trailer__poster-img"
                />
                <div className="netflix-trailer__poster-vignette" />

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
                  <span className="netflix-badge-red">TEASER FILM</span>
                  <h3 className="netflix-trailer__poster-title">Destia &amp; Rakafansa: The Journey</h3>
                  <span className="netflix-trailer__poster-duration">Duration: 02:30 • 4K UHD</span>
                </div>
              </div>
            )}

            {/* Custom Netflix Video Controls Bar */}
            <div className={`netflix-trailer__controls ${isPlaying ? 'netflix-trailer__controls--active' : ''}`}>
              {/* Red Glow Progress Scrubber */}
              <div
                className="netflix-trailer__progress-bar-wrap"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPos = (e.clientX - rect.left) / rect.width;
                  setProgress(clickPos * 100);
                  if (videoRef.current?.duration) {
                    videoRef.current.currentTime = clickPos * videoRef.current.duration;
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
                  <span className="netflix-trailer__quality-badge">4K ULTRA HD</span>
                  <span className="netflix-trailer__quality-badge">DOLBY ATMOS</span>
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
              <span className="netflix-spec-tag netflix-spec-tag--red">NETFLIX ORIGINAL WEDDING SPECIAL</span>
              <span className="netflix-spec-tag">100% MATCH</span>
              <span className="netflix-spec-tag">4K ULTRA HD</span>
            </div>

            <p className="netflix-trailer__desc">
              Sebuah dokumenter sinematik kisah nyata dua insan, dari perjumpaan tak terduga hingga mengikat janji suci seumur hidup.
              Saksikan peluncuran eksklusif hari bahagia Destia Dwi Ramadhani &amp; Rakafansa Saputra pada 14 November 2026.
            </p>

            <div className="netflix-trailer__credits-grid">
              <div><strong>Cast:</strong> Destia Dwi Ramadhani, Rakafansa Saputra</div>
              <div><strong>Genres:</strong> Romantic, Slice of Life, Real-Life Documentary</div>
              <div><strong>Director of Photography:</strong> Artha Cinematic Studio</div>
              <div><strong>Executive Producers:</strong> Keluarga Besar Kedua Mempelai</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
