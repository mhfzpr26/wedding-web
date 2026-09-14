'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { TimelineItem } from '@/components/molecules/TimelineItem';
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
  const timelineData =
    timeline && timeline.length > 0 ? timeline : DEFAULT_TIMELINE;

  return (
    <section
      id="story"
      className="section love-story"
      aria-labelledby="story-title"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="netflix-section-header">
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
        </motion.div>

        <motion.div
          className="love-story__timeline"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          {timelineData.map((item, index) => (
            <TimelineItem key={item.year} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
