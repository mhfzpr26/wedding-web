'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import type { StoryTimelineItemData } from '@/types/invitation';
import type { WeddingPrivacyMode, WeddingTimelineItem } from '@/types/wedding';

export interface LoveStorySectionProps {
  timeline?: WeddingTimelineItem[];
  privacyMode?: WeddingPrivacyMode;
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

const toRoman = (num: number): string => {
  const romanMap: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let res = '';
  let n = num;
  for (const [val, roman] of romanMap) {
    while (n >= val) {
      res += roman;
      n -= val;
    }
  }
  return res || 'I';
};

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({
  timeline,
  privacyMode,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Header Entrance & Scrub: Stays locked throughout
  const headerOpacity = useTransform(
    smoothProgress,
    [0, 0.92, 1],
    [1, 1, 0.3],
  );
  const headerY = useTransform(smoothProgress, [0, 1], [0, 0]);

  // Photo Entrance Parallax: Always fully formed when locked
  const photoEntranceOpacity = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1],
  );
  const photoEntranceY = useTransform(smoothProgress, [0, 1], [0, 0]);
  const photoEntranceScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1],
  );

  // Dynamic Timeline Growth (0% to 100%)
  const progressHeight = useTransform(
    smoothProgress,
    [0.02, 0.98],
    ['0%', '100%'],
  );

  // Moment 1 (Season 1): Active immediately upon arrival (0.0 to 0.28), crossfades 0.28 to 0.36
  const m1Opacity = useTransform(
    smoothProgress,
    [0, 0.28, 0.36],
    [1, 1, 0],
  );
  const m1Y = useTransform(
    smoothProgress,
    [0, 0.28, 0.36],
    [0, 0, -20],
  );
  const m1Scale = useTransform(
    smoothProgress,
    [0, 0.28, 0.36],
    [1, 1, 0.96],
  );

  // Moment 2 (Season 2): Enters 0.30 to 0.38, stays active 0.38 to 0.62, crossfades 0.62 to 0.70
  const m2Opacity = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.62, 0.70],
    [0, 1, 1, 0],
  );
  const m2Y = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.62, 0.70],
    [20, 0, 0, -20],
  );
  const m2Scale = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.62, 0.70],
    [0.96, 1, 1, 0.96],
  );

  // Moment 3 (Season 3): Enters 0.64 to 0.72, stays active until the end
  const m3Opacity = useTransform(
    smoothProgress,
    [0.64, 0.72, 1],
    [0, 1, 1],
  );
  const m3Y = useTransform(
    smoothProgress,
    [0.64, 0.72, 1],
    [20, 0, 0],
  );
  const m3Scale = useTransform(
    smoothProgress,
    [0.64, 0.72, 1],
    [0.96, 1, 1],
  );

  // Photo Parallax & Crossfades (Synchronized with Moments)
  const p1Opacity = useTransform(
    smoothProgress,
    [0, 0.28, 0.36],
    [1, 1, 0],
  );
  const p2Opacity = useTransform(
    smoothProgress,
    [0.30, 0.38, 0.62, 0.70],
    [0, 1, 1, 0],
  );
  const p3Opacity = useTransform(
    smoothProgress,
    [0.64, 0.72, 1],
    [0, 1, 1],
  );

  const photoParallaxY = useTransform(smoothProgress, [0, 1], [-8, 8]);

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
              {moments.map((m, idx) => (
                <motion.div
                  key={`photo-${m.data.year}`}
                  className="love-story__photo-item"
                  style={{
                    opacity: m.photoOpacity,
                    y: photoParallaxY,
                  }}
                >
                  {privacyMode?.noMedia ? (
                    <div className="love-story__chapter-card">
                      <div className="love-story__chapter-backdrop" />
                      <div className="love-story__chapter-watermark" aria-hidden="true">
                        {m.data.year}
                      </div>
                      <div className="love-story__chapter-embers" aria-hidden="true">
                        <span className="chapter-ember" />
                        <span className="chapter-ember" />
                        <span className="chapter-ember" />
                        <span className="chapter-ember" />
                        <span className="chapter-ember" />
                        <span className="chapter-ember" />
                      </div>
                      <div className="love-story__chapter-content">
                        <div className="love-story__chapter-roman-wrap">
                          <div className="love-story__chapter-ornament-line" />
                          <span className="love-story__chapter-roman">
                            {toRoman(idx + 1)}
                          </span>
                          <div className="love-story__chapter-ornament-line" />
                        </div>
                        <span className="love-story__chapter-kicker">
                          {m.data.season || `CHAPTER ${idx + 1}`}
                        </span>
                        <div className="love-story__chapter-accent-divider" />
                      </div>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={m.photo}
                      alt={m.data.event}
                      className="love-story__photo-img"
                    />
                  )}
                  <div
                    className={`love-story__photo-badge ${
                      privacyMode?.noMedia ? 'love-story__photo-badge--privacy' : ''
                    }`}
                  >
                    {privacyMode?.noMedia ? (
                      <>
                        <span className="love-story__photo-badge-node" />
                        <span>CHAPTER ARCHIVE • {m.data.year}</span>
                      </>
                    ) : (
                      `EPISODE STILL • ${m.data.year}`
                    )}
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
