import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NavigationIcon from '@mui/icons-material/Navigation';
import PlaceIcon from '@mui/icons-material/Place';
import type React from 'react';
import type { EventDetailData } from '@/types/invitation';

export interface EventCardProps {
  event: EventDetailData;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const venuePhoto =
    event.venuePhoto ||
    (index === 0 ? '/images/venue-akad.jpg' : '/images/venue-resepsi.jpg');

  return (
    <article className="netflix-episode-row">
      {/* Episode Index */}
      <div className="netflix-episode-row__number">{index + 1}</div>

      {/* 16:9 Venue Photo Thumbnail */}
      <div className="netflix-episode-row__thumb-wrapper">
        <div className="netflix-episode-row__thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={venuePhoto}
            alt={event.title}
            className="netflix-episode-row__thumb-img"
            loading="lazy"
          />
          <div className="netflix-episode-row__photo-badge">
            <PlaceIcon sx={{ fontSize: 16, color: '#E50914' }} />
            <span>{index === 0 ? 'VENUE AKAD' : 'VENUE RESEPSI'}</span>
          </div>
        </div>
      </div>

      {/* Episode Metadata & Synopsis */}
      <div className="netflix-episode-row__info">
        <div className="netflix-episode-row__header">
          <h3 className="netflix-episode-row__title">
            {event.episodeNumber
              ? `Episode ${event.episodeNumber}: `
              : `${index + 1}. `}
            {event.title}
          </h3>
          <span className="netflix-episode-row__duration">
            {event.duration ||
              (index === 0 ? '08.00 - 10.00' : '11.00 - 14.00')}
          </span>
        </div>

        <div className="netflix-episode-row__meta-tags">
          <span className="netflix-spec-tag">{event.date}</span>
          <span className="netflix-spec-tag netflix-spec-tag--red">
            {event.time}
          </span>
          <span className="netflix-spec-tag">LOKASI: {event.venue}</span>
        </div>

        <p className="netflix-episode-row__synopsis">
          {event.synopsis ||
            (index === 0
              ? 'Momen sakral pengucapan ijab kabul di hadapan penghulu, saksi, dan keluarga besar. Titik awal penyatuan dua jiwa dalam ikrar suci pernikahan.'
              : 'Pesta perayaan dan ramah tamah bersama para sahabat, kerabat, dan tamu kehormatan. Penuh kebahagiaan, musik, dan jamuan istimewa.')}
        </p>

        <p className="netflix-episode-row__address">📍 {event.address}</p>

        {/* Action Buttons styled as Netflix streaming controls */}
        <div className="netflix-episode-row__actions">
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="netflix-btn-stream netflix-btn-stream--primary"
            aria-label={`Buka rute Google Maps ke ${event.venue}`}
          >
            <NavigationIcon sx={{ fontSize: 18 }} />
            <span>NAVIGASI MAPS</span>
          </a>
          <a
            href={event.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="netflix-btn-stream netflix-btn-stream--secondary"
            aria-label={`Simpan jadwal ${event.title} ke kalender`}
          >
            <CalendarMonthIcon sx={{ fontSize: 18 }} />
            <span>+ GOOGLE CALENDAR</span>
          </a>
        </div>
      </div>
    </article>
  );
};
