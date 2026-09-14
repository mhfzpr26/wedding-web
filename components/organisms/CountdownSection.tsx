'use client';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';
import { CountdownUnit } from '@/components/molecules/CountdownUnit';
import {
  calculateCountdown,
  formatWeddingDate,
  generateGoogleCalendarUrl,
} from '@/lib/date-utils';
import type { TimeLeft } from '@/types/invitation';
import type { WeddingCountdown } from '@/types/wedding';

export interface CountdownSectionProps {
  countdown?: WeddingCountdown;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({
  countdown,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [reminded, setReminded] = useState(false);

  const targetDateStr = countdown?.targetDate || '2026-11-14T09:00:00+07:00';
  const calendarUrl =
    countdown?.calendarUrl ||
    generateGoogleCalendarUrl({
      title: 'Pernikahan Destia & Rakafansa',
      startDate: targetDateStr,
      details: 'Pernikahan Destia Dwi Ramadhani & Rakafansa Saputra',
      location: 'Bekasi',
    });

  const formattedTargetDate = formatWeddingDate(
    targetDateStr,
    'MMMM dd, yyyy',
  ).toUpperCase();

  useEffect(() => {
    setIsMounted(true);

    const updateTimer = () => {
      const res = calculateCountdown(targetDateStr);
      setTimeLeft({
        days: res.days,
        hours: res.hours,
        minutes: res.minutes,
        seconds: res.seconds,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  const handleRemindClick = () => {
    setReminded(true);
    window.open(calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="countdown"
      className="section countdown"
      aria-labelledby="countdown-title"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="netflix-section-header">
            <h2 className="countdown__title" id="countdown-title">
              PREMIERES {formattedTargetDate}
            </h2>
            <p
              style={{
                color: 'var(--color-light-gray)',
                marginTop: '0.35rem',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Hitung mundur menuju momen penayangan perdana ikrar suci
              pernikahan
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
        </motion.div>

        <motion.div
          className="countdown__timer"
          role="timer"
          aria-label="Hitung mundur menuju hari pernikahan"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
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
        </motion.div>
      </div>
    </section>
  );
};
