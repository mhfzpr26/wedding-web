'use client';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  const headerOpacity = useTransform(smoothProgress, [0.03, 0.25], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.03, 0.25], [20, 0]);

  const unit0X = useTransform(smoothProgress, [0.08, 0.45], [-40, 0]);
  const unit0Opacity = useTransform(smoothProgress, [0.08, 0.45], [0, 1]);

  const unit1X = useTransform(smoothProgress, [0.12, 0.5], [-20, 0]);
  const unit1Opacity = useTransform(smoothProgress, [0.12, 0.5], [0, 1]);

  const unit2X = useTransform(smoothProgress, [0.12, 0.5], [20, 0]);
  const unit2Opacity = useTransform(smoothProgress, [0.12, 0.5], [0, 1]);

  const unit3X = useTransform(smoothProgress, [0.08, 0.45], [40, 0]);
  const unit3Opacity = useTransform(smoothProgress, [0.08, 0.45], [0, 1]);

  const unitMotion = [
    { x: unit0X, opacity: unit0Opacity },
    { x: unit1X, opacity: unit1Opacity },
    { x: unit2X, opacity: unit2Opacity },
    { x: unit3X, opacity: unit3Opacity },
  ];

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
      ref={sectionRef}
      id="countdown"
      className="section countdown"
      aria-labelledby="countdown-title"
    >
      <div className="container">
        <motion.div
          style={{
            opacity: headerOpacity,
            y: headerY,
          }}
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

        <div
          className="countdown__timer"
          role="timer"
          aria-label="Hitung mundur menuju hari pernikahan"
        >
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' },
          ].map((unit, index) => (
            <motion.div
              key={unit.label}
              style={{
                x: unitMotion[index].x,
                opacity: unitMotion[index].opacity,
              }}
            >
              <CountdownUnit
                value={unit.value}
                label={unit.label}
                isMounted={isMounted}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
