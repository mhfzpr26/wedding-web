'use client';

import type React from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CollectionsIcon from '@mui/icons-material/Collections';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useInView } from '@/hooks/useInView';
import type { WeddingOpening } from '@/types/wedding';

export interface OpeningSectionProps {
  opening?: WeddingOpening;
}

export const OpeningSection: React.FC<OpeningSectionProps> = ({ opening }) => {
  const { ref, inView } = useInView<HTMLElement>();

  const posterImage = opening?.posterImage || '/images/gallery-1.jpg';
  const statusBadge = opening?.statusBadge || 'COMING SOON';
  const dateText = opening?.dateText || '14 November 2026';
  const title = opening?.title || 'Destia & Rakafansa:';
  const subtitle = opening?.subtitle || 'Our Forever Chapter';
  const locationText =
    opening?.locationText ||
    'Masjid Agung Al-Barkah & Hotel Santika Premiere, Bekasi';
  const quote =
    opening?.quote ||
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource = opening?.quoteSource || 'QS. AR-RUM : 21';

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
          src={posterImage}
          alt="Wedding Poster"
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
            <span className="netflix-badge-red">{statusBadge}</span>
            <span className="netflix-hero-poster__date">
              <CalendarMonthIcon sx={{ fontSize: 18 }} />
              {dateText}
            </span>
          </div>

          {/* Series Headline */}
          <h1 className="netflix-hero-poster__title" id="opening-title">
            <span className="netflix-hero-poster__names">{title}</span>
            <span className="netflix-hero-poster__subtitle">{subtitle}</span>
          </h1>

          {/* Venue Location Pill */}
          <div className="netflix-hero-poster__location">
            <LocationOnIcon sx={{ fontSize: 18, color: '#E50914' }} />
            <span>{locationText}</span>
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
              &ldquo;{quote}&rdquo;
            </blockquote>
            <cite className="opening__ref">{quoteSource}</cite>
          </div>
        </div>
      </div>
    </section>
  );
};
