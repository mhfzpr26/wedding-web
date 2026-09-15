'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import { EventCard } from '@/components/molecules/EventCard';
import type { EventDetailData } from '@/types/invitation';
import type { WeddingEventItem } from '@/types/wedding';

export interface EventSectionProps {
  events?: WeddingEventItem[];
}

const DEFAULT_EVENTS: EventDetailData[] = [
  {
    type: 'AKAD NIKAH',
    episodeNumber: 1,
    title: 'The Sacred Vow (Akad Nikah)',
    duration: '90 Menit',
    synopsis:
      'Ijab kabul sakral pengikatan janji suci di hadapan penghulu, para saksi, dan keluarga terkasih. Diselenggarakan dengan penuh khidmat dan rasa syukur.',
    date: 'Sabtu, 14 November 2026',
    time: '09:00 - 10:30 WIB',
    venue: 'Masjid Agung Al-Barkah',
    address: 'Jl. Veteran No. 46, Marga Jaya, Bekasi Selatan, Kota Bekasi',
    mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Barkah+Bekasi',
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T040000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Masjid+Agung+Al-Barkah+Bekasi',
  },
  {
    type: 'RESEPSI PERNIKAHAN',
    episodeNumber: 2,
    title: 'The Grand Celebration (Resepsi)',
    duration: '180 Menit',
    synopsis:
      'Pesta perayaan penuh suka cita dan ramah tamah bersama sanak famili, sahabat, serta handai tolan. Dimeriahkan oleh jamuan prasmanan dan hiburan musik.',
    date: 'Sabtu, 14 November 2026',
    time: '12:00 - 15:00 WIB',
    venue: 'Grand Ballroom Hotel Santika Mega City',
    address: 'Jl. Jendral Ahmad Yani No. 1, Marga Jaya, Kota Bekasi',
    mapUrl: 'https://maps.google.com/?q=Hotel+Santika+Mega+City+Bekasi',
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+Destia+%26+Rakafansa&dates=20261114T050000Z/20261114T080000Z&details=Resepsi+Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Hotel+Santika+Bekasi',
  },
];

export const EventSection: React.FC<EventSectionProps> = ({ events }) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26,
    restDelta: 0.001,
  });

  // Header scrub
  const headerOpacity = useTransform(smoothProgress, [0.05, 0.25], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.05, 0.25], [35, 0]);

  // Vertical Wedding Timeline Progress Line (0% -> 100%)
  const lineHeight = useTransform(smoothProgress, [0.15, 0.85], ['0%', '100%']);

  // Episode 1 (Akad / Matrimony) Reactive Marker & Card:
  const marker1Scale = useTransform(smoothProgress, [0.15, 0.35], [0.7, 1]);
  const marker1Opacity = useTransform(smoothProgress, [0.15, 0.35], [0.4, 1]);
  const card1Y = useTransform(smoothProgress, [0.15, 0.38], [40, 0]);
  const card1Opacity = useTransform(smoothProgress, [0.15, 0.35], [0.3, 1]);

  // Episode 2 (Reception) Reactive Marker & Card:
  const marker2Scale = useTransform(smoothProgress, [0.45, 0.7], [0.7, 1]);
  const marker2Opacity = useTransform(smoothProgress, [0.45, 0.7], [0.4, 1]);
  const card2Y = useTransform(smoothProgress, [0.45, 0.72], [40, 0]);
  const card2Opacity = useTransform(smoothProgress, [0.45, 0.7], [0.3, 1]);

  const eventList = events && events.length > 0 ? events : DEFAULT_EVENTS;

  return (
    <section
      ref={sectionRef}
      id="event"
      className="section event"
      aria-labelledby="event-title"
    >
      <div className="container">
        {/* Netflix Episodes Selector Header with Scroll-Linked Reveal */}
        <motion.div
          className="netflix-episodes-header"
          style={{
            opacity: headerOpacity,
            y: headerY,
          }}
        >
          <div className="netflix-episodes-header__top">
            <h2 className="event__header-title" id="event-title">
              EPISODES &amp; TIMELINE
            </h2>
          </div>

          <div className="netflix-episodes-header__season-select">
            <span className="netflix-episodes-season-badge">
              SEASON 1: THE WEDDING DAY
            </span>
            <span className="netflix-episodes-count">
              {eventList.length} Episodes Available
            </span>
          </div>
        </motion.div>

        {/* Timeline Container with Vertical Progress Line */}
        <div
          className="wedding-timeline-wrapper"
          style={{
            position: 'relative',
            paddingLeft: '2.5rem',
          }}
        >
          {/* Vertical Progress Line Track */}
          <div
            className="wedding-timeline-track"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '12px',
              top: '24px',
              bottom: '24px',
              width: '3px',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '2px',
            }}
          >
            {/* Dynamic Scrubbed Red Glowing Progress Line */}
            <motion.div
              style={{
                width: '100%',
                height: lineHeight,
                background: '#E50914',
                boxShadow: '0 0 12px rgba(229, 9, 20, 0.9)',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Episode List with Reactive Markers */}
          <div
            className="netflix-episodes-list"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {eventList.map((event, index) => {
              const isFirst = index === 0;
              const markerScale = isFirst ? marker1Scale : marker2Scale;
              const markerOpacity = isFirst ? marker1Opacity : marker2Opacity;
              const cardY = isFirst ? card1Y : card2Y;
              const cardOpacity = isFirst ? card1Opacity : card2Opacity;

              return (
                <div
                  key={event.id || event.type}
                  style={{
                    position: 'relative',
                  }}
                >
                  {/* Reactive Timeline Dot Marker (scale: 0.7 -> 1, opacity: 0.4 -> 1) */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: '-2.5rem',
                      top: '28px',
                      transform: 'translateX(-50%)',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#141414',
                      border: '2px solid #E50914',
                      boxShadow: '0 0 10px rgba(229, 9, 20, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      scale: markerScale,
                      opacity: markerOpacity,
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#E50914',
                      }}
                    />
                  </motion.div>

                  {/* Scrubbed Event Content Card (y: 40 -> 0) */}
                  <motion.div
                    style={{
                      y: cardY,
                      opacity: cardOpacity,
                    }}
                  >
                    <EventCard event={event} index={index} />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
