'use client';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type React from 'react';
import { useState } from 'react';

import type { WeddingCover } from '@/types/wedding';

export interface CoverSectionProps {
  onEnter: () => void;
  isOpen: boolean;
  guestName?: string;
  cover?: WeddingCover;
}

export const CoverSection: React.FC<CoverSectionProps> = ({
  onEnter,
  isOpen,
  guestName,
  cover,
}) => {
  const animationsReady = true;
  const [savedToList, setSavedToList] = useState(false);

  const bgImage = cover?.bgImage || '/images/netflix-cover-bg.jpg';
  const seriesBadge = cover?.seriesBadge || 'A NETFLIX WEDDING SPECIAL';
  const trendingRank = cover?.trendingRank || '#1 in Weddings Today';
  const title = cover?.title || 'DESTIA & RAKAFANSA';
  const year = cover?.year || '2026';
  const ratingBadge = cover?.ratingBadge || 'SU / ALL AGES';
  const synopsis =
    cover?.synopsis ||
    'Dua hati yang dipertemukan oleh takdir, kini siap mengikat janji suci seumur hidup. Sebuah kisah romansa penuh kehangatan, komitmen, dan restu kedua keluarga besar.';
  const calendarUrl =
    cover?.calendarUrl ||
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T080000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Bekasi';

  // Clean up series badge so "NETFLIX" is not repeated after logo
  const cleanSeriesBadge =
    seriesBadge.replace(/^(A\s+)?NETFLIX\s+/i, '').trim() || 'WEDDING SPECIAL';

  // Clean up trending rank so "#1" is not repeated after the #1 badge
  const cleanTrendingText =
    trendingRank.replace(/^#1\s*/i, '').trim() || 'in Weddings Today';

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEnter();
  };

  const handleSaveToList = (e: React.MouseEvent) => {
    e.preventDefault();
    setSavedToList(true);
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  const coverStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    opacity: isOpen ? 0 : 1,
    visibility: isOpen ? 'hidden' : 'visible',
    transform: isOpen ? 'scale(1.04)' : 'scale(1)',
    transition:
      'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    pointerEvents: isOpen ? 'none' : 'auto',
  };

  return (
    <section
      className="cover netflix-cover"
      aria-label="Cover undangan"
      style={coverStyle}
    >
      {/* Background with cinematic Netflix backdrop and gradient */}
      <div className="netflix-cover__bg" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImage}
          alt="Cinematic Wedding Background"
          className="netflix-cover__backdrop-img"
        />
        <div className="netflix-cover__vignette" />
        <div className="netflix-cover__glow" />
      </div>

      <div className="netflix-cover__content">
        {/* Netflix Branding & Series Tag */}
        <div
          className="netflix-cover__brand"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen
                ? 'translateY(0)'
                : 'translateY(-20px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/netflix-logo.svg"
            alt="Netflix"
            className="netflix-cover__logo-img"
          />
          <span className="netflix-cover__series-badge">
            {cleanSeriesBadge}
          </span>
        </div>

        {/* Top 1 Trending Badge */}
        <div
          className="netflix-cover__trending"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <span className="netflix-cover__rank">#1</span>
          <span className="netflix-cover__rank-text">{cleanTrendingText}</span>
        </div>

        {/* Main Title */}
        <h1
          className="netflix-cover__title"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}
        >
          {title}
        </h1>

        {/* Series Metadata Badges */}
        <div
          className="netflix-cover__meta"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
          }}
        >
          <span className="netflix-cover__year">{year}</span>
          <span className="netflix-cover__badge-pill netflix-cover__badge-pill--rating">
            {ratingBadge}
          </span>
        </div>

        {/* Synopsis / Logline */}
        <p
          className="netflix-cover__synopsis"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
          }}
        >
          {synopsis}
        </p>

        {/* Guest VIP Pass Profile Box with Netflix Smiley Avatar */}
        <div
          className="netflix-cover__guest-pass"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s',
          }}
        >
          <div className="netflix-cover__profile-card">
            <div className="netflix-cover__avatar-box">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/avatar.webp"
                alt="Netflix Profile Smiley"
                className="netflix-cover__avatar-img"
              />
            </div>
            <div className="netflix-cover__profile-text">
              <span className="netflix-cover__guest-badge">
                EXCLUSIVE INVITATION PASS • VIP
              </span>
              <span className="netflix-cover__guest-label">
                Who&apos;s Watching:
              </span>
              <span className="netflix-cover__guest-name">
                {guestName || 'Tamu Undangan Terhormat'}
              </span>
            </div>
          </div>
        </div>

        {/* Netflix Action Buttons */}
        <div
          className="netflix-cover__actions"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.8s ease 0.9s, transform 0.8s ease 0.9s',
          }}
        >
          <button
            type="button"
            className="netflix-cover__btn-play"
            onClick={handleEnterClick}
            aria-label="Mulai Menonton & Buka Undangan"
          >
            <PlayArrowIcon sx={{ fontSize: 28 }} />
            <span>PLAY / BUKA UNDANGAN</span>
          </button>

          <button
            type="button"
            className="netflix-cover__btn-list"
            onClick={handleSaveToList}
            aria-label="Simpan Jadwal ke Kalender"
          >
            {savedToList ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 22 }} />
                <span>IN MY LIST</span>
              </>
            ) : (
              <>
                <BookmarkBorderIcon sx={{ fontSize: 22 }} />
                <span>+ MY LIST</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
