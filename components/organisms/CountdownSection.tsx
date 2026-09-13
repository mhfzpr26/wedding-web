'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { CountdownUnit } from '@/components/molecules/CountdownUnit';
import { useInView } from '@/hooks/useInView';
import type { TimeLeft } from '@/types/invitation';

export const CountdownSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [reminded, setReminded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date('2026-11-14T00:00:00+07:00').getTime();

    const updateTimer = () => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRemindClick = () => {
    setReminded(true);
    const calendarUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T080000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Bekasi';
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="countdown"
      ref={ref}
      className="section countdown"
      aria-labelledby="countdown-title"
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
            <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-xs)' }}>
              WORTH THE WAIT • GLOBAL PREMIERE
            </div>
            <h2 className="countdown__title" id="countdown-title">
              PREMIERES NOVEMBER 14, 2026
            </h2>
            <p style={{ color: 'var(--color-light-gray)', marginTop: '0.35rem', fontSize: 'var(--font-size-small)' }}>
              Hitung mundur menuju momen penayangan perdana ikrar suci pernikahan
            </p>

            <div style={{ marginTop: '0.85rem' }}>
              <button
                type="button"
                className={`netflix-btn-remind ${reminded ? 'netflix-btn-remind--active' : ''}`}
                onClick={handleRemindClick}
                aria-label="Ingatkan saya tentang acara ini"
              >
                {reminded ? (
                  <>
                    <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                    <span>PENGINGAT DIAKTIFKAN</span>
                  </>
                ) : (
                  <>
                    <NotificationsNoneIcon sx={{ fontSize: 20 }} />
                    <span>INGATKAN SAYA (REMIND ME)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className="countdown__timer"
          role="timer"
          aria-label="Hitung mundur menuju hari pernikahan"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <CountdownUnit
            value={timeLeft.days}
            label="Days"
            isMounted={isMounted}
          />
          <CountdownUnit
            value={timeLeft.hours}
            label="Hours"
            isMounted={isMounted}
          />
          <CountdownUnit
            value={timeLeft.minutes}
            label="Minutes"
            isMounted={isMounted}
          />
          <CountdownUnit
            value={timeLeft.seconds}
            label="Seconds"
            isMounted={isMounted}
          />
        </div>
      </div>
    </section>
  );
};
