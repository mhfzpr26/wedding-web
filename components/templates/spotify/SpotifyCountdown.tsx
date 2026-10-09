'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { FaBell, FaClock } from 'react-icons/fa6';
import {
  calculateCountdown,
  formatWeddingDate,
  generateGoogleCalendarUrl,
} from '@/lib/date-utils';
import type { TimeLeft } from '@/types/invitation';
import type { WeddingCountdown } from '@/types/wedding';

export interface SpotifyCountdownProps {
  countdown?: WeddingCountdown;
}

export const SpotifyCountdown: React.FC<SpotifyCountdownProps> = ({
  countdown,
}) => {
  const targetDateStr = countdown?.targetDate || '2026-11-14T09:00:00+07:00';
  const calendarUrl =
    countdown?.calendarUrl ||
    generateGoogleCalendarUrl({
      title: 'Pernikahan Destia & Rakafansa (The Wedding Album Drop)',
      startDate: targetDateStr,
      details: 'Pernikahan Destia Dwi Ramadhani & Rakafansa Saputra',
      location: 'Bekasi',
    });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const res = calculateCountdown(targetDateStr);
      setTimeLeft({
        days: res.days,
        hours: res.hours,
        minutes: res.minutes,
        seconds: res.seconds,
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  const formattedDate = formatWeddingDate(targetDateStr, 'EEEE, dd MMMM yyyy');

  return (
    <section
      id="countdown"
      className="spotify-section"
      aria-label="Countdown Section"
    >
      <div className="spotify-container">
        <div className="spotify-countdown-card">
          <span className="spotify-badge-pill">
            <FaClock style={{ color: '#1db954' }} />
            <span>PRE-SAVE COUNTDOWN</span>
          </span>

          <h2 className="spotify-section__title">COUNTDOWN TO ALBUM DROP</h2>
          <p className="spotify-section__subtitle">
            Hitung mundur menuju hari sakral pernikahan:{' '}
            <strong style={{ color: '#fff' }}>{formattedDate}</strong>
          </p>

          {/* 4 Digital Units */}
          <div className="spotify-countdown-grid">
            <div className="spotify-countdown-unit">
              <span className="spotify-countdown-number">
                {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
              </span>
              <span className="spotify-countdown-label">HARI / DAYS</span>
            </div>

            <div className="spotify-countdown-unit">
              <span className="spotify-countdown-number">
                {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
              </span>
              <span className="spotify-countdown-label">JAM / HOURS</span>
            </div>

            <div className="spotify-countdown-unit">
              <span className="spotify-countdown-number">
                {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
              </span>
              <span className="spotify-countdown-label">MENIT / MINS</span>
            </div>

            <div className="spotify-countdown-unit">
              <span className="spotify-countdown-number">
                {mounted ? String(timeLeft.seconds).padStart(2, '0') : '00'}
              </span>
              <span className="spotify-countdown-label">DETIK / SECS</span>
            </div>
          </div>

          {/* Action Link */}
          <div>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-btn-primary"
              style={{
                maxWidth: '360px',
                margin: '0 auto',
                display: 'inline-flex',
              }}
            >
              <FaBell />
              <span>PRE-SAVE KE GOOGLE CALENDAR</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
