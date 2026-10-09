'use client';

import type React from 'react';
import {
  FaCalendarPlus,
  FaClock,
  FaLocationDot,
  FaMapLocationDot,
  FaPlay,
} from 'react-icons/fa6';
import type { WeddingEventItem } from '@/types/wedding';

export interface SpotifyTracklistProps {
  events?: WeddingEventItem[];
}

export const SpotifyTracklist: React.FC<SpotifyTracklistProps> = ({
  events,
}) => {
  const eventList = events && events.length > 0 ? events : [];

  return (
    <section
      id="tracklist"
      className="spotify-section"
      aria-label="Spotify Tracklist Rundown"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">
            TRACKLIST • RUNDOWN ACARA
          </span>
          <h2 className="spotify-section__title">WEDDING CEREMONY SETLIST</h2>
          <p className="spotify-section__subtitle">
            Rangkaian prosesi sakral pernikahan yang akan berlangsung. Harap
            hadir tepat waktu.
          </p>
        </div>

        <div className="spotify-tracklist">
          <table className="spotify-tracklist-table">
            <thead className="spotify-tracklist-head">
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                <th>JUDUL &amp; PROSESI ACARA</th>
                <th>WAKTU &amp; LOKASI</th>
                <th style={{ textAlign: 'right' }}>NAVIGASI &amp; JADWAL</th>
              </tr>
            </thead>
            <tbody>
              {eventList.map((item, idx) => {
                const trackNum = idx + 1;
                return (
                  <tr
                    key={item.id || `track-${idx}`}
                    className="spotify-track-row"
                  >
                    {/* Track Number */}
                    <td className="spotify-track-num">
                      <span className="spotify-track-num-txt">{trackNum}</span>
                      <span className="spotify-track-play-icon">
                        <FaPlay />
                      </span>
                    </td>

                    {/* Main Title & Details */}
                    <td>
                      <div className="spotify-track-main">
                        <div className="spotify-track-type-badge">
                          TRACK 0{trackNum} • {item.type}
                        </div>
                        <div className="spotify-track-title">{item.title}</div>
                        <div className="spotify-track-desc">
                          {item.synopsis}
                        </div>
                      </div>
                    </td>

                    {/* Date, Time & Venue */}
                    <td>
                      <div className="spotify-track-venue-info">
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            color: '#1db954',
                            fontWeight: 700,
                          }}
                        >
                          <FaClock style={{ fontSize: '0.8rem' }} />
                          <span>
                            {item.date} • {item.time}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.4rem',
                            marginTop: '0.2rem',
                          }}
                        >
                          <FaLocationDot
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--sp-text-muted)',
                              marginTop: '3px',
                            }}
                          />
                          <div>
                            <div className="spotify-track-venue-name">
                              {item.venue}
                            </div>
                            <div className="spotify-track-venue-address">
                              {item.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Actions & Maps */}
                    <td>
                      <div className="spotify-track-actions">
                        {item.mapUrl && (
                          <a
                            href={item.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-pill-action"
                            title="Buka Lokasi Google Maps"
                          >
                            <FaMapLocationDot style={{ color: '#1db954' }} />
                            <span>GOOGLE MAPS</span>
                          </a>
                        )}

                        {item.calendarUrl && (
                          <a
                            href={item.calendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-icon-btn"
                            title="Simpan Jadwal ke Kalender"
                          >
                            <FaCalendarPlus style={{ color: '#1db954' }} />
                          </a>
                        )}

                        <span
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--sp-text-subdued)',
                            fontVariantNumeric: 'tabular-nums',
                            marginLeft: '0.5rem',
                          }}
                        >
                          {item.duration || '90:00'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
