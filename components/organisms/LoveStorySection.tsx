'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import type { StoryTimelineItemData } from '@/types/invitation';
import type { WeddingTimelineItem } from '@/types/wedding';

export interface LoveStorySectionProps {
  timeline?: WeddingTimelineItem[];
}

const DEFAULT_TIMELINE: StoryTimelineItemData[] = [
  {
    year: '2022',
    event: 'Pertama Bertemu',
    desc: 'Kisah kami bermula dari pertemuan tak terduga yang mengubah segalanya. Suasana yang sederhana tapi penuh makna menjadi awal dari perjalanan panjang kami.',
    season: 'SEASON 1',
  },
  {
    year: '2024',
    event: 'Mulai Berniat',
    desc: 'Setelah melewati berbagai dinamika bersama, kami memutuskan untuk menjalin ikatan yang lebih serius. Keputusan ini dilandasi oleh rasa saling percaya, menghargai, dan mencintai.',
    season: 'SEASON 2',
  },
  {
    year: '2026',
    event: 'Acara Pernikahan',
    desc: 'Hari ini, kami berdiri di hadapan Tuhan dan orang-orang terkasih untuk mengucapkan janji suci. Sebuah momen yang menandai awal kehidupan baru sebagai suami istri.',
    season: 'SEASON 3 • SERIES FINALE',
  },
];

const TIMELINE_PHOTOS = [
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-2.jpg',
];

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({
  timeline,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Header Entrance & Scrub: Animates in from previous section, stays locked
  const headerOpacity = useTransform(
    smoothProgress,
    [0.02, 0.14, 0.92, 1],
    [0, 1, 1, 0.3],
  );
  const headerY = useTransform(smoothProgress, [0.02, 0.14], [25, 0]);

  // Photo Entrance Parallax: Scales and fades in as section enters
  const photoEntranceOpacity = useTransform(
    smoothProgress,
    [0.04, 0.16],
    [0, 1],
  );
  const photoEntranceY = useTransform(smoothProgress, [0.04, 0.16], [25, 0]);
  const photoEntranceScale = useTransform(
    smoothProgress,
    [0.04, 0.16],
    [0.94, 1],
  );

  // Dynamic Timeline Growth (0% to 100%)
  const progressHeight = useTransform(
    smoothProgress,
    [0.12, 0.94],
    ['0%', '100%'],
  );

  // Moment 1 (2022) Scroll Transforms: Smooth entrance then crossfade
  const m1Opacity = useTransform(
    smoothProgress,
    [0.05, 0.16, 0.38, 0.44],
    [0, 1, 1, 0],
  );
  const m1Y = useTransform(
    smoothProgress,
    [0.05, 0.16, 0.38, 0.44],
    [20, 0, 0, -20],
  );
  const m1Scale = useTransform(
    smoothProgress,
    [0.05, 0.16, 0.38, 0.44],
    [0.96, 1, 1, 0.96],
  );

  // Moment 2 (2024) Scroll Transforms
  const m2Opacity = useTransform(
    smoothProgress,
    [0.38, 0.44, 0.68, 0.74],
    [0, 1, 1, 0],
  );
  const m2Y = useTransform(
    smoothProgress,
    [0.38, 0.44, 0.68, 0.74],
    [20, 0, 0, -20],
  );
  const m2Scale = useTransform(
    smoothProgress,
    [0.38, 0.44, 0.68, 0.74],
    [0.96, 1, 1, 0.96],
  );

  // Moment 3 (2026) Scroll Transforms
  const m3Opacity = useTransform(
    smoothProgress,
    [0.68, 0.74, 0.96, 1],
    [0, 1, 1, 1],
  );
  const m3Y = useTransform(
    smoothProgress,
    [0.68, 0.74, 0.96, 1],
    [20, 0, 0, 0],
  );
  const m3Scale = useTransform(
    smoothProgress,
    [0.68, 0.74, 0.96, 1],
    [0.96, 1, 1, 1],
  );

  // Photo Parallax & Crossfades
  const p1Opacity = useTransform(
    smoothProgress,
    [0.04, 0.16, 0.38, 0.44],
    [0, 1, 1, 0],
  );
  const p2Opacity = useTransform(
    smoothProgress,
    [0.38, 0.44, 0.68, 0.74],
    [0, 1, 1, 0],
  );
  const p3Opacity = useTransform(
    smoothProgress,
    [0.68, 0.74, 0.96, 1],
    [0, 1, 1, 1],
  );

  const photoParallaxY = useTransform(smoothProgress, [0, 1], [-10, 10]);

  const timelineData =
    timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;

  const moments = [
    {
      data: timelineData[0] || DEFAULT_TIMELINE[0],
      opacity: m1Opacity,
      y: m1Y,
      scale: m1Scale,
      photoOpacity: p1Opacity,
      photo: TIMELINE_PHOTOS[0],
    },
    {
      data: timelineData[1] || DEFAULT_TIMELINE[1],
      opacity: m2Opacity,
      y: m2Y,
      scale: m2Scale,
      photoOpacity: p2Opacity,
      photo: TIMELINE_PHOTOS[1],
    },
    {
      data: timelineData[2] || DEFAULT_TIMELINE[2],
      opacity: m3Opacity,
      y: m3Y,
      scale: m3Scale,
      photoOpacity: p3Opacity,
      photo: TIMELINE_PHOTOS[2],
    },
  ];

  return (
    <section
      ref={containerRef}
      id="story"
      className="section love-story love-story--sticky-container"
      aria-labelledby="story-title"
    >
      {/* Pinned Sticky Stage */}
      <div className="love-story__sticky-viewport">
        <div className="love-story__content-wrap">
          {/* Header */}
          <motion.div
            className="love-story__header"
            style={{
              opacity: headerOpacity,
              y: headerY,
            }}
          >
            <div className="netflix-section-header">
              <h2 className="love-story__title" id="story-title">
                OUR JOURNEY THROUGH SEASONS
              </h2>
              <p className="love-story__subtitle">
                Kilas balik perjalanan cerita dari pertemuan tak terduga hingga
                pelaminan
              </p>
            </div>

            {/* Scrubbed Interactive Timeline Progress Bar */}
            <div className="love-story__progress-bar">
              <span className="netflix-spec-tag netflix-spec-tag--red love-story__progress-tag">
                SCROLL TO ADVANCE
              </span>
              <div className="love-story__progress-track">
                <motion.div
                  className="love-story__progress-fill"
                  style={{
                    width: progressHeight,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Interactive Story Showcase Grid */}
          <div className="love-story__showcase-grid">
            {/* Left: Layered Cinematic Photos (Parallax + Crossfade) */}
            <motion.div
              className="love-story__photo-stack"
              style={{
                opacity: photoEntranceOpacity,
                y: photoEntranceY,
                scale: photoEntranceScale,
              }}
            >
              {moments.map((m) => (
                <motion.div
                  key={`photo-${m.data.year}`}
                  className="love-story__photo-item"
                  style={{
                    opacity: m.photoOpacity,
                    y: photoParallaxY,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photo}
                    alt={m.data.event}
                    className="love-story__photo-img"
                  />
                  <div className="love-story__photo-badge">
                    EPISODE STILL • {m.data.year}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Stacked Story Narratives (Scrubbed Transitions) */}
            <div className="love-story__narrative-stack">
              {moments.map((m, idx) => (
                <motion.div
                  key={`card-${m.data.year}`}
                  className="netflix-timeline-item"
                  style={{
                    opacity: m.opacity,
                    y: m.y,
                    scale: m.scale,
                  }}
                >
                  <div className="netflix-timeline__header-tags">
                    <span className="netflix-timeline__season-badge">
                      {m.data.season || `SEASON ${idx + 1}`}
                    </span>
                    <span className="netflix-spec-tag">
                      PREMIERED {m.data.year}
                    </span>
                  </div>

                  <h3 className="love-story__event">
                    S{idx + 1}:E{idx + 1} &ldquo;{m.data.event}&rdquo;
                  </h3>

                  <p className="love-story__desc">{m.data.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
