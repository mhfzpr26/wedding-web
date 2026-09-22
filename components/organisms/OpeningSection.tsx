'use client';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsIcon from '@mui/icons-material/Collections';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import type { WeddingOpening, WeddingPrivacyMode } from '@/types/wedding';

export interface OpeningSectionProps {
  opening?: WeddingOpening;
  privacyMode?: WeddingPrivacyMode;
}

const HERO_EMBER_IDS = [
  'he-1',
  'he-2',
  'he-3',
  'he-4',
  'he-5',
  'he-6',
  'he-7',
  'he-8',
  'he-9',
  'he-10',
  'he-11',
  'he-12',
  'he-13',
  'he-14',
  'he-15',
  'he-16',
  'he-17',
  'he-18',
  'he-19',
  'he-20',
  'he-21',
  'he-22',
] as const;

export const OpeningSection: React.FC<OpeningSectionProps> = ({
  opening,
  privacyMode,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  // Background Parallax & Zoom (GSAP-like scrub)
  const bgY = useTransform(smoothProgress, [0, 1], [0, 90]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);

  // Names Headline: scrubbed fade, rise, and subtle compression
  const titleOpacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.5, 1], [0, -30, -80]);
  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.98, 0.94]);

  // Date & Badge Row: independent scrub movement
  const dateY = useTransform(smoothProgress, [0, 0.5, 1], [0, -20, -50]);
  const dateOpacity = useTransform(smoothProgress, [0, 0.6, 1], [1, 0.6, 0]);

  // Venue location pill
  const locationY = useTransform(smoothProgress, [0, 0.7, 1], [0, -35, -70]);
  const locationOpacity = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    [1, 0.4, 0],
  );

  // Action Buttons
  const actionsY = useTransform(smoothProgress, [0, 0.7, 1], [0, -40, -85]);
  const actionsOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 0.9],
    [1, 0.3, 0],
  );

  // Wedding Quote Card
  const quoteY = useTransform(smoothProgress, [0, 0.8, 1], [0, -25, -60]);
  const quoteOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 0.85],
    [1, 0.3, 0],
  );

  const posterImage = opening?.posterImage || '/images/gallery-1.jpg';
  const statusBadge = opening?.statusBadge || 'COMING SOON';
  const dateText = opening?.dateText || '14 November 2026';
  const title = opening?.title || 'Destia & Rakafansa:';
  const subtitle = opening?.subtitle || 'Our Forever Chapter';
  const locationText =
    opening?.locationText ||
    'Masjid Agung Al-Barkah & Hotel Santika Premiere, Bekasi';
  const quote =
    opening?.quote !== undefined
      ? opening.quote
      : 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource =
    opening?.quoteSource !== undefined
      ? opening.quoteSource
      : 'QS. AR-RUM : 21';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="opening"
      className="section opening netflix-hero-poster"
      aria-labelledby="opening-title"
    >
      {/* Background Poster Image with Cinematic Parallax */}
      <motion.div
        className="netflix-hero-poster__bg"
        style={{
          y: bgY,
          scale: bgScale,
        }}
      >
        {privacyMode?.noMedia ? (
          <div className="netflix-hero-poster__privacy-bg">
            {/* Dual Hollywood Premiere Searchlights (Menyilang) */}
            <div className="netflix-hero-poster__searchlight netflix-hero-poster__searchlight--left">
              <div className="netflix-hero-poster__searchlight-source" />
              <div className="netflix-hero-poster__searchlight-beam" />
            </div>
            <div className="netflix-hero-poster__searchlight netflix-hero-poster__searchlight--right">
              <div className="netflix-hero-poster__searchlight-source" />
              <div className="netflix-hero-poster__searchlight-beam" />
            </div>

            {/* Central Intersection Glow (Where Beams Cross) */}
            <div className="netflix-hero-poster__spotlight-intersection" />

            {/* Ambient Velvet Aurora & Shadows */}
            <div className="netflix-hero-poster__aurora-wave netflix-hero-poster__aurora-wave--1" />
            <div className="netflix-hero-poster__aurora-wave netflix-hero-poster__aurora-wave--2" />

            {/* Glistening Stardust Embers inside Light Beams */}
            <div className="netflix-hero-poster__embers" aria-hidden="true">
              {HERO_EMBER_IDS.map((id, i) => (
                <span
                  key={id}
                  className={`netflix-hero-poster__ember netflix-hero-poster__ember--${(i % 15) + 1}`}
                />
              ))}
            </div>

            {/* Subtle Lens Flare & Bokeh Field */}
            <div
              className="netflix-hero-poster__bokeh-field"
              aria-hidden="true"
            >
              <span className="netflix-hero-poster__bokeh-orb netflix-hero-poster__bokeh-orb--1" />
              <span className="netflix-hero-poster__bokeh-orb netflix-hero-poster__bokeh-orb--2" />
              <span className="netflix-hero-poster__bokeh-orb netflix-hero-poster__bokeh-orb--3" />
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={posterImage}
            alt="Wedding Poster"
            className="netflix-hero-poster__img"
          />
        )}
        <div className="netflix-hero-poster__gradient" />
      </motion.div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="netflix-hero-poster__content">
          {/* Netflix Badge Row with Scrubbed Parallax */}
          <motion.div
            className="netflix-hero-poster__badge-row"
            style={{
              y: dateY,
              opacity: dateOpacity,
            }}
          >
            <span className="netflix-badge-red">{statusBadge}</span>
            <span className="netflix-hero-poster__date">
              <CalendarMonthIcon sx={{ fontSize: 18 }} />
              {dateText}
            </span>
          </motion.div>

          {/* Series Headline with Scroll-Linked Timeline */}
          <motion.h1
            className="netflix-hero-poster__title"
            id="opening-title"
            style={{
              y: titleY,
              opacity: titleOpacity,
              scale: titleScale,
            }}
          >
            <span className="netflix-hero-poster__names">{title}</span>
            <span className="netflix-hero-poster__subtitle">{subtitle}</span>
          </motion.h1>

          {/* Venue Location Pill */}
          <motion.div
            className="netflix-hero-poster__location"
            style={{
              y: locationY,
              opacity: locationOpacity,
            }}
          >
            <LocationOnIcon sx={{ fontSize: 18, color: '#E50914' }} />
            <span>{locationText}</span>
          </motion.div>

          {/* Quick Action Navigation Buttons (Only shown when media exists) */}
          {!privacyMode?.noMedia && (
            <motion.div
              className="netflix-hero-poster__actions"
              style={{
                y: actionsY,
                opacity: actionsOpacity,
              }}
            >
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
                <span>PHOTO GALLERY</span>
              </button>
            </motion.div>
          )}

          {/* Wedding Quote / Sacred Verse Card */}
          {(quote || quoteSource) && (
            <motion.div
              className="netflix-hero-poster__quote-card"
              style={{
                y: quoteY,
                opacity: quoteOpacity,
              }}
            >
              {quote && (
                <blockquote
                  className="opening__quote"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {quote}
                </blockquote>
              )}
              {quoteSource && !quote?.includes(quoteSource) && (
                <cite className="opening__ref">{quoteSource}</cite>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
