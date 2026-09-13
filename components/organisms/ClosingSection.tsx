'use client';

import type React from 'react';
import { useInView } from '@/hooks/useInView';

export const ClosingSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  const moreLikeThis = [
    {
      title: 'Chapter 1: The Engagement Day',
      match: '99% Match',
      year: '2024',
      tag: 'Romance',
      img: '/images/netflix-cover-bg.jpg',
    },
    {
      title: 'Chapter 2: Family Blessings',
      match: '98% Match',
      year: '2025',
      tag: 'Heartfelt',
      img: '/images/netflix-cover-bg.jpg',
    },
    {
      title: 'Chapter 3: The Big Premiere',
      match: '100% Match',
      year: '2026',
      tag: 'Special',
      img: '/images/netflix-cover-bg.jpg',
    },
  ];

  return (
    <section
      id="closing"
      ref={ref}
      className="section closing"
      aria-labelledby="closing-title"
    >
      <div className="container">
        {/* Netflix "More Like This" Section */}
        <div
          className="netflix-more-like-this"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-more-like-this__header">
            <h3 className="netflix-more-like-this__title">MORE LIKE THIS</h3>
            <span className="netflix-spec-tag">COLLECTION</span>
          </div>

          <div className="netflix-more-like-this__grid">
            {moreLikeThis.map((item) => (
              <div key={item.title} className="netflix-poster-card">
                <div className="netflix-poster-card__thumb-box">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="netflix-poster-card__img"
                  />
                  <span className="netflix-poster-card__n-logo">N</span>
                  <span className="netflix-poster-card__match-badge">{item.match}</span>
                </div>
                <div className="netflix-poster-card__meta">
                  <span className="netflix-poster-card__name">{item.title}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <span className="netflix-spec-tag">{item.year}</span>
                    <span className="netflix-spec-tag netflix-spec-tag--red">{item.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Netflix End Credits Roll */}
        <div
          className="closing__content netflix-end-credits"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          }}
        >
          <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-md)' }}>
            END CREDITS • CAST &amp; CREW
          </div>

          <h2 className="closing__title" id="closing-title">SEE YOU AT THE PREMIERE</h2>

          <p className="closing__text">
            Merupakan suatu kebahagiaan dan kehormatan yang teramat besar bagi kami atas kehadiran,
            doa restu, serta kasih sayang yang Anda curahkan.
          </p>

          <div className="netflix-credits-grid">
            <div className="netflix-credit-entry">
              <span className="netflix-credit-entry__role">DIRECTED BY</span>
              <span className="netflix-credit-entry__name">Love, Destiny &amp; Divine Blessings</span>
            </div>
            <div className="netflix-credit-entry">
              <span className="netflix-credit-entry__role">LEAD ACTRESS</span>
              <span className="netflix-credit-entry__name">Destia Dwi Ramadhani</span>
            </div>
            <div className="netflix-credit-entry">
              <span className="netflix-credit-entry__role">LEAD ACTOR</span>
              <span className="netflix-credit-entry__name">Rakafansa Saputra</span>
            </div>
            <div className="netflix-credit-entry">
              <span className="netflix-credit-entry__role">EXECUTIVE PRODUCERS</span>
              <span className="netflix-credit-entry__name">Keluarga Besar Ibu Sri Mulyati &amp; Keluarga Besar Ibu Lenny Gusnita</span>
            </div>
            <div className="netflix-credit-entry">
              <span className="netflix-credit-entry__role">SPECIAL THANKS</span>
              <span className="netflix-credit-entry__name">Seluruh Sahabat, Kerabat &amp; Tamu Undangan Terhormat</span>
            </div>
          </div>

          <div className="closing__names-wrap">
            <span className="closing__names">DESTIA</span>
            <span className="closing__ampersand" aria-hidden="true">&amp;</span>
            <span className="closing__names">RAKAFANSA</span>
          </div>

          <p className="closing__date">14 NOVEMBER 2026 • BEKASI, INDONESIA</p>

          <div className="netflix-copyright-tag">
            © 2026 DESTIA &amp; RAKAFANSA WEDDING SPECIAL • A NETFLIX ORIGINAL CELEBRATION • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </section>
  );
};
