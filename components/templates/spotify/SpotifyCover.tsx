'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { FaPlay, FaSpotify } from 'react-icons/fa6';
import type { WeddingCover, WeddingPrivacyMode } from '@/types/wedding';

export interface SpotifyCoverProps {
  isOpen: boolean;
  onEnter: () => void;
  guestName?: string;
  cover?: WeddingCover;
  privacyMode?: WeddingPrivacyMode;
}

export const SpotifyCover: React.FC<SpotifyCoverProps> = ({
  isOpen,
  onEnter,
  guestName,
  cover,
  privacyMode: _privacyMode,
}) => {
  const bgImage = cover?.bgImage || '/images/spotify-cover-bg.jpg';
  const title = cover?.title || 'DESTIA & RAKAFANSA';
  const seriesBadge = cover?.seriesBadge || 'A SPOTIFY WEDDING SPECIAL';
  const synopsis =
    cover?.synopsis ||
    'Dua hati yang dipertemukan oleh takdir, kini siap mengikat janji suci seumur hidup dalam harmoni cinta yang abadi.';
  const year = cover?.year || '2026';
  const matchPercentage = cover?.matchPercentage || '99% Match';

  return (
    <div
      className={`spotify-cover-gate ${isOpen ? 'spotify-cover-gate--hidden' : ''}`}
    >
      {/* Blurred Album Art Background */}
      <div
        className="spotify-cover-gate__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Main Glassmorphic Modal Card */}
      <motion.div
        className="spotify-cover-gate__content"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Spotify Vinyl Showcase */}
        <div className="spotify-vinyl-showcase">
          <div className="spotify-vinyl-sleeve">
            <img src={bgImage} alt={title} />
          </div>
          <div className="spotify-vinyl-disc">
            <div className="spotify-vinyl-center">
              <div className="spotify-vinyl-center-hole" />
            </div>
          </div>
        </div>

        {/* Series Badge */}
        <div className="spotify-badge-pill">
          <FaSpotify style={{ fontSize: '1rem', color: '#1db954' }} />
          <span>{seriesBadge}</span>
        </div>

        {/* Album Title */}
        <h1 className="spotify-cover-gate__title">{title}</h1>

        <p className="spotify-cover-gate__subtitle">
          The Wedding Album • {year} • {matchPercentage}
        </p>

        {/* Guest Tag */}
        {guestName && (
          <div className="spotify-guest-tag">
            <span className="spotify-guest-tag__label">
              EXCLUSIVE LISTENER PASS
            </span>
            <span className="spotify-guest-tag__name">
              Kepada Yth. {guestName}
            </span>
          </div>
        )}

        {/* Play / Enter Button */}
        <button
          type="button"
          onClick={onEnter}
          className="spotify-btn-primary"
          id="spotify-open-button"
        >
          <FaPlay style={{ fontSize: '1rem' }} />
          <span>PLAY OUR STORY • BUKA UNDANGAN</span>
        </button>

        {/* Synopsis snippet */}
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--sp-text-muted)',
            marginTop: '1.25rem',
            lineHeight: 1.5,
            marginBottom: 0,
          }}
        >
          {synopsis}
        </p>
      </motion.div>
    </div>
  );
};
