'use client';

import type React from 'react';
import { useState } from 'react';
import { FaCheck, FaShareNodes, FaSpotify } from 'react-icons/fa6';
import type { WeddingPrivacyMode } from '@/types/wedding';

export interface SpotifyNavbarProps {
  guestName?: string;
  privacyMode?: WeddingPrivacyMode;
}

export const SpotifyNavbar: React.FC<SpotifyNavbarProps> = ({
  guestName,
  privacyMode: _privacyMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Wedding of Destia & Rakafansa',
          text: 'Kami mengundang Anda untuk merayakan hari bahagia pernikahan kami.',
          url,
        });
      } catch {
        // User dismissed share
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="spotify-navbar">
      <div className="spotify-container">
        <div className="spotify-navbar__inner">
          {/* Brand Left */}
          <a href="#album-header" className="spotify-navbar__brand">
            <span className="spotify-navbar__logo-icon">
              <FaSpotify />
            </span>
            <div>
              <div className="spotify-navbar__title">
                DESTIA &amp; RAKAFANSA
              </div>
              <div className="spotify-navbar__subtitle">
                <span>Verified Couple</span>
                <span>•</span>
                <span>Wedding Edition</span>
              </div>
            </div>
          </a>

          {/* Nav Links Center */}
          <nav className="spotify-navbar__links" aria-label="Main Navigation">
            <a href="#album-header" className="spotify-nav-link">
              Overview
            </a>
            <a href="#countdown" className="spotify-nav-link">
              Drop
            </a>
            <a href="#artists" className="spotify-nav-link">
              Artists
            </a>
            <a href="#tracklist" className="spotify-nav-link">
              Tracklist
            </a>
            <a href="#lyrics" className="spotify-nav-link">
              Lyrics
            </a>
            <a href="#gallery" className="spotify-nav-link">
              Discography
            </a>
            <a href="#rsvp" className="spotify-nav-link">
              RSVP
            </a>
            <a href="#wishes" className="spotify-nav-link">
              Wishes
            </a>
            <a href="#gifts" className="spotify-nav-link">
              Tip Jar
            </a>
          </nav>

          {/* Actions Right */}
          <div className="spotify-navbar__actions">
            {guestName && (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--sp-text-subdued)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--sp-radius-pill)',
                  border: '1px solid var(--sp-border-subtle)',
                  display: 'none',
                }}
                className="spotify-guest-badge"
              >
                Pass: {guestName}
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="spotify-icon-btn"
              title="Share Wedding Link"
              aria-label="Bagikan Tautan Undangan"
            >
              {copied ? (
                <FaCheck style={{ color: '#1db954' }} />
              ) : (
                <FaShareNodes />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
