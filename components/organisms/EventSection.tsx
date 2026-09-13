'use client';

import type React from 'react';
import { EventCard } from '@/components/molecules/EventCard';
import { useInView } from '@/hooks/useInView';
import type { EventDetailData } from '@/types/invitation';

export const EventSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  const events: EventDetailData[] = [
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

  return (
    <section
      id="event"
      ref={ref}
      className="section event"
      aria-labelledby="event-title"
    >
      <div className="container">
        {/* Netflix Episodes Selector Header */}
        <div className="netflix-episodes-header">
          <div className="netflix-episodes-header__top">
            <div className="netflix-badge-pill">
              SEASON 1 • EPISODES &amp; VENUES
            </div>
            <h2 className="event__header-title" id="event-title">
              EPISODES
            </h2>
          </div>

          <div className="netflix-episodes-header__season-select">
            <span className="netflix-episodes-season-badge">SEASON 1: THE WEDDING DAY</span>
            <span className="netflix-episodes-count">2 Episodes Available</span>
          </div>
        </div>

        <div
          className="netflix-episodes-list"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {events.map((event, index) => (
            <EventCard
              key={event.type}
              event={event}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
