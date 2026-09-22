'use client';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type React from 'react';
import { useState } from 'react';
import { NetflixAvatar } from '@/components/atoms/NetflixAvatar';
import type { WeddingCover, WeddingPrivacyMode } from '@/types/wedding';

export interface CoverSectionProps {
  onEnter: () => void;
  isOpen: boolean;
  guestName?: string;
  cover?: WeddingCover;
  privacyMode?: WeddingPrivacyMode;
}

const COVER_EMBER_IDS = [
  'ce-1',
  'ce-2',
  'ce-3',
  'ce-4',
  'ce-5',
  'ce-6',
  'ce-7',
  'ce-8',
  'ce-9',
  'ce-10',
  'ce-11',
  'ce-12',
  'ce-13',
  'ce-14',
  'ce-15',
  'ce-16',
  'ce-17',
  'ce-18',
] as const;

export const CoverSection: React.FC<CoverSectionProps> = ({
  onEnter,
  isOpen,
  guestName,
  cover,
  privacyMode,
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
      className={`cover netflix-cover ${privacyMode?.noMedia ? 'netflix-cover--privacy' : ''}`}
      aria-label="Cover undangan"
      style={coverStyle}
    >
      {/* Background with cinematic Netflix backdrop and gradient */}
      <div className="netflix-cover__bg" aria-hidden="true">
        {privacyMode?.noMedia ? (
          <div className="netflix-cover__privacy-bg">
            {/* Organic Fluid Aurora & Ambient Light Waves */}
            <div className="netflix-cover__aurora-wave netflix-cover__aurora-wave--1" />
            <div className="netflix-cover__aurora-wave netflix-cover__aurora-wave--2" />

            {/* Cinematic Volumetric Projector Spotlight */}
            <div className="netflix-cover__spotlight" />

            {/* Cinematic Floating Bokeh (Multi-Depth of Field) */}
            <div className="netflix-cover__bokeh-field" aria-hidden="true">
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--1" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--2" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--3" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--4" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--5" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--6" />
              <span className="netflix-cover__bokeh-orb netflix-cover__bokeh-orb--7" />
            </div>

            {/* Rising Cinematic Stardust Embers */}
            <div className="netflix-cover__embers" aria-hidden="true">
              {COVER_EMBER_IDS.map((id, i) => (
                <span
                  key={id}
                  className={`netflix-cover__ember netflix-cover__ember--${(i % 15) + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={bgImage}
            alt="Cinematic Wedding Background"
            className="netflix-cover__backdrop-img"
          />
        )}
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
                ? 'translate(0, 0)'
                : 'translate(-25px, -15px)',
            transition:
              'opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s',
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
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(20px, 15px)',
            transition:
              'opacity 0.8s ease 0.25s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s',
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
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(-30px, 25px)',
            transition:
              'opacity 0.8s ease 0.35s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.35s',
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
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(-15px, 15px)',
            transition:
              'opacity 0.8s ease 0.45s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s',
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
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(25px, 20px)',
            transition:
              'opacity 0.8s ease 0.55s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s',
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
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(-25px, 25px)',
            transition:
              'opacity 0.8s ease 0.65s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.65s',
          }}
        >
          <div className="netflix-cover__profile-card">
            <div className="netflix-cover__avatar-box">
              <NetflixAvatar variant="red" size="md" active />
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

        {/* Action Buttons: Play (Open) & My List (Calendar) */}
        <div
          className="netflix-cover__actions"
          style={{
            opacity: animationsReady && !isOpen ? 1 : 0,
            transform:
              animationsReady && !isOpen
                ? 'translate(0, 0)'
                : 'translate(25px, 25px)',
            transition:
              'opacity 0.8s ease 0.75s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.75s',
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
