'use client';

import type React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CollectionsIcon from '@mui/icons-material/Collections';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useInView } from '@/hooks/useInView';

export const OpeningSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="opening"
      ref={ref}
      className="section opening netflix-hero-poster"
      aria-labelledby="opening-title"
    >
      {/* Background Poster Image with Cinematic Gradient */}
      <div className="netflix-hero-poster__bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gallery-1.jpg"
          alt="Destia & Rakafansa Poster"
          className="netflix-hero-poster__img"
        />
        <div className="netflix-hero-poster__gradient" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          className="netflix-hero-poster__content"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Netflix Badge Row */}
          <div className="netflix-hero-poster__badge-row">
            <span className="netflix-badge-red">COMING SOON</span>
            <span className="netflix-hero-poster__date">
              <CalendarMonthIcon sx={{ fontSize: 18 }} />
              12 September 2026
            </span>
          </div>

          {/* Series Headline (inspired by reference "Rafli & Fitri: Our Next Chapter") */}
          <h1 className="netflix-hero-poster__title" id="opening-title">
            <span className="netflix-hero-poster__names">Destia &amp; Rakafansa:</span>
            <span className="netflix-hero-poster__subtitle">Our Forever Chapter</span>
          </h1>

          {/* Venue Location Pill */}
          <div className="netflix-hero-poster__location">
            <LocationOnIcon sx={{ fontSize: 18, color: '#E50914' }} />
            <span>Masjid Agung Al-Barkah &amp; Hotel Santika Premiere, Bekasi</span>
          </div>

          {/* Genre Hashtags (matching reference pill tags) */}
          <div className="netflix-hero-poster__tags">
            <span className="netflix-tag-pill">#romance</span>
            <span className="netflix-tag-pill">#sliceoflife</span>
            <span className="netflix-tag-pill">#weddingfilm</span>
            <span className="netflix-tag-pill">#truejourney</span>
            <span className="netflix-tag-pill">#destiarakafansa</span>
          </div>

          {/* Specs & Ratings */}
          <div className="netflix-hero-poster__specs">
            <span className="netflix-spec-tag netflix-spec-tag--gold">TOP 1 TODAY</span>
            <span className="netflix-spec-tag">100% MATCH</span>
            <span className="netflix-spec-tag">TV-MA</span>
            <span className="netflix-spec-tag">4K ULTRA HD</span>
            <span className="netflix-spec-tag">DOLBY ATMOS</span>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="netflix-hero-poster__actions">
            <button
              type="button"
              className="netflix-hero-btn netflix-hero-btn--primary"
              onClick={() => scrollToSection('trailer')}
            >
              <PlayArrowIcon sx={{ fontSize: 24 }} />
              <span>WATCH TEASER FILM</span>
            </button>

            <button
              type="button"
              className="netflix-hero-btn netflix-hero-btn--secondary"
              onClick={() => scrollToSection('gallery')}
            >
              <CollectionsIcon sx={{ fontSize: 22 }} />
              <span>PRODUCTION STILLS</span>
            </button>
          </div>

          {/* Sacred Quranic Quote */}
          <div className="netflix-hero-poster__quote-card">
            <blockquote className="opening__quote">
              &ldquo;Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan
              untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya,
              dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
            </blockquote>
            <cite className="opening__ref">QS. AR-RUM : 21</cite>
          </div>
        </div>
      </div>
    </section>
  );
};
