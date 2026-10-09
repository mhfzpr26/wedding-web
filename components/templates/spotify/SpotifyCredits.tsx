'use client';

import type React from 'react';
import { FaSpotify } from 'react-icons/fa6';
import type { WeddingClosing, WeddingCouple } from '@/types/wedding';

export interface SpotifyCreditsProps {
  closing?: WeddingClosing;
  couple?: WeddingCouple;
}

export const SpotifyCredits: React.FC<SpotifyCreditsProps> = ({
  closing,
  couple: _couple,
}) => {
  const title = closing?.title || 'THANKS FOR LISTENING';
  const message =
    closing?.message ||
    'Merupakan suatu kebahagiaan dan kehormatan yang teramat besar bagi kami atas kehadiran, doa restu, serta kasih sayang yang Anda curahkan.';
  const names = closing?.names || 'DESTIA & RAKAFANSA';
  const dateLocation =
    closing?.dateLocation || '14 NOVEMBER 2026 • BEKASI, INDONESIA';
  const copyright =
    closing?.copyright ||
    '© 2026 DESTIA & RAKAFANSA WEDDING SPECIAL • SPOTIFY EDITION • ALL RIGHTS RESERVED';
  const credits = closing?.credits || [];

  return (
    <footer id="credits" className="spotify-section">
      <div className="spotify-container">
        <div className="spotify-credits-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#1db954',
            }}
          >
            <FaSpotify style={{ fontSize: '1.6rem' }} />
            <span
              style={{
                fontWeight: 800,
                letterSpacing: '0.08em',
                fontSize: '0.85rem',
              }}
            >
              OFFICIAL ALBUM CREDITS
            </span>
          </div>

          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '0.85rem',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
              color: 'var(--sp-text-subdued)',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {message}
          </p>

          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#1db954',
              marginBottom: '0.5rem',
            }}
          >
            {names}
          </div>

          <div
            style={{
              fontSize: '0.82rem',
              color: 'var(--sp-text-muted)',
              marginBottom: '2rem',
            }}
          >
            {dateLocation}
          </div>

          {/* Credits Grid */}
          {credits.length > 0 && (
            <div className="spotify-credits-list">
              {credits.map((c) => (
                <div
                  key={`${c.role}-${c.name}`}
                  className="spotify-credit-item"
                >
                  <span className="spotify-credit-role">{c.role}</span>
                  <span className="spotify-credit-name">{c.name}</span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.5rem',
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              color: 'var(--sp-text-muted)',
            }}
          >
            {copyright}
          </div>
        </div>
      </div>
    </footer>
  );
};
