'use client';

import type React from 'react';
import { useInView } from '@/hooks/useInView';
import type { WeddingClosing, WeddingCouple } from '@/types/wedding';

export interface ClosingSectionProps {
  closing?: WeddingClosing;
  couple?: WeddingCouple;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  closing,
  couple,
}) => {
  const { ref, inView } = useInView<HTMLElement>();

  const badge = closing?.badge || 'END CREDITS • CAST & CREW';
  const title = closing?.title || 'SEE YOU AT THE PREMIERE';
  const message =
    closing?.message ||
    'Merupakan suatu kebahagiaan dan kehormatan yang teramat besar bagi kami atas kehadiran, doa restu, serta kasih sayang yang Anda curahkan.';
  const brideCallname = couple?.bride?.callname?.toUpperCase() || 'DESTIA';
  const groomCallname =
    couple?.groom?.callname?.toUpperCase() || 'RAKAFANSA';
  const dateLocation =
    closing?.dateLocation || '14 NOVEMBER 2026 • BEKASI, INDONESIA';
  const copyright =
    closing?.copyright ||
    '© 2026 DESTIA & RAKAFANSA WEDDING SPECIAL • A NETFLIX ORIGINAL CELEBRATION • ALL RIGHTS RESERVED';

  const defaultCredits = [
    { role: 'DIRECTED BY', name: 'Love, Destiny & Divine Blessings' },
    {
      role: 'LEAD ACTRESS',
      name: couple?.bride?.name || 'Destia Dwi Ramadhani',
    },
    {
      role: 'LEAD ACTOR',
      name: couple?.groom?.name || 'Rakafansa Saputra',
    },
    {
      role: 'EXECUTIVE PRODUCERS',
      name: `Keluarga Besar ${
        couple?.bride?.parents?.mother || 'Ibu Sri Mulyati'
      } & Keluarga Besar ${
        couple?.groom?.parents?.mother || 'Ibu Lenny Gusnita'
      }`,
    },
    {
      role: 'SPECIAL THANKS',
      name: 'Seluruh Sahabat, Kerabat & Tamu Undangan Terhormat',
    },
  ];

  const creditsList =
    closing?.credits && closing.credits.length > 0
      ? closing.credits
      : defaultCredits;

  return (
    <section
      id="closing"
      ref={ref}
      className="section closing"
      aria-labelledby="closing-title"
    >
      <div className="container">
        {/* Netflix End Credits Roll */}
        <div
          className="closing__content netflix-end-credits"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <div
            className="netflix-badge-pill"
            style={{ margin: '0 auto var(--spacing-md)' }}
          >
            {badge}
          </div>

          <h2 className="closing__title" id="closing-title">
            {title}
          </h2>

          <p className="closing__text">{message}</p>

          <div className="netflix-credits-grid">
            {creditsList.map((credit) => (
              <div key={`${credit.role}-${credit.name}`} className="netflix-credit-entry">
                <span className="netflix-credit-entry__role">
                  {credit.role}
                </span>
                <span className="netflix-credit-entry__name">
                  {credit.name}
                </span>
              </div>
            ))}
          </div>

          <div className="closing__names-wrap">
            <span className="closing__names">{brideCallname}</span>
            <span className="closing__ampersand" aria-hidden="true">
              &amp;
            </span>
            <span className="closing__names">{groomCallname}</span>
          </div>

          <p className="closing__date">{dateLocation}</p>

          <div className="netflix-copyright-tag">{copyright}</div>
        </div>
      </div>
    </section>
  );
};
