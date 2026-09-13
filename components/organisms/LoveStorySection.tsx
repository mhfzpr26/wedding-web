'use client';

import type React from 'react';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { useInView } from '@/hooks/useInView';
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
  },
  {
    year: '2024',
    event: 'Mulai Berniat',
    desc: 'Setelah melewati berbagai dinamika bersama, kami memutuskan untuk menjalin ikatan yang lebih serius. Keputusan ini dilandasi oleh rasa saling percaya, menghargai, dan mencintai.',
  },
  {
    year: '2026',
    event: 'Acara Pernikahan',
    desc: 'Hari ini, kami berdiri di hadapan Tuhan dan orang-orang terkasih untuk mengucapkan janji suci. Sebuah momen yang menandai awal kehidupan baru sebagai suami istri.',
  },
];

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({
  timeline,
}) => {
  const { ref, inView } = useInView<HTMLElement>();

  const timelineData =
    timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;

  return (
    <section
      id="story"
      ref={ref}
      className="section love-story"
      aria-labelledby="story-title"
    >
      <div className="container">
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-section-header">
            <div
              className="netflix-badge-pill"
              style={{ margin: '0 auto var(--spacing-xs)' }}
            >
              TRAILERS &amp; MORE • THE STORY SO FAR
            </div>
            <h2 className="love-story__title" id="story-title">
              OUR JOURNEY THROUGH SEASONS
            </h2>
            <p
              style={{
                color: 'var(--color-light-gray)',
                marginTop: '0.35rem',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Kilas balik perjalanan cerita dari pertemuan tak terduga hingga
              pelaminan
            </p>
          </div>
        </div>

        <div
          className="love-story__timeline"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          {timelineData.map((item, index) => (
            <TimelineItem key={item.year} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
