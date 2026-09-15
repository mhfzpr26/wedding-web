'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import type { WeddingClosing, WeddingCouple } from '@/types/wedding';

export interface ClosingSectionProps {
  closing?: WeddingClosing;
  couple?: WeddingCouple;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  closing,
  couple,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Scrubbed transforms
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.45], [0, 1]);
  const titleY = useTransform(smoothProgress, [0.1, 0.45], [40, 0]);

  const messageOpacity = useTransform(smoothProgress, [0.25, 0.6], [0, 1]);
  const messageY = useTransform(smoothProgress, [0.25, 0.6], [30, 0]);

  const brideX = useTransform(smoothProgress, [0.35, 0.75], [-60, 0]);
  const brideOpacity = useTransform(smoothProgress, [0.35, 0.75], [0, 1]);

  const ampersandScale = useTransform(smoothProgress, [0.4, 0.8], [0.5, 1]);
  const ampersandOpacity = useTransform(smoothProgress, [0.4, 0.8], [0, 1]);
  const ampersandRotate = useTransform(smoothProgress, [0.4, 0.8], [-15, 0]);

  const groomX = useTransform(smoothProgress, [0.35, 0.75], [60, 0]);
  const groomOpacity = useTransform(smoothProgress, [0.35, 0.75], [0, 1]);

  const dateOpacity = useTransform(smoothProgress, [0.55, 0.9], [0, 1]);
  const dateY = useTransform(smoothProgress, [0.55, 0.9], [25, 0]);

  const copyrightOpacity = useTransform(
    smoothProgress,
    [0.65, 0.98],
    [0, 0.75],
  );
  const copyrightY = useTransform(smoothProgress, [0.65, 0.98], [20, 0]);

  const title = closing?.title || 'SEE YOU AT THE PREMIERE';
  const message =
    closing?.message ||
    'Merupakan suatu kebahagiaan dan kehormatan yang teramat besar bagi kami atas kehadiran, doa restu, serta kasih sayang yang Anda curahkan.';
  const brideCallname = couple?.bride?.callname?.toUpperCase() || 'DESTIA';
  const groomCallname = couple?.groom?.callname?.toUpperCase() || 'RAKAFANSA';
  const dateLocation =
    closing?.dateLocation || '14 NOVEMBER 2026 • BEKASI, INDONESIA';
  const copyright =
    closing?.copyright ||
    '© 2026 DESTIA & RAKAFANSA WEDDING SPECIAL • ALL RIGHTS RESERVED';

  return (
    <section
      ref={sectionRef}
      id="closing"
      className="section closing"
      aria-labelledby="closing-title"
    >
      <div className="container">
        {/* Netflix Closing Message */}
        <div className="closing__content netflix-end-credits">
          <motion.h2
            className="closing__title"
            id="closing-title"
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="closing__text"
            style={{
              opacity: messageOpacity,
              y: messageY,
            }}
          >
            {message}
          </motion.p>

          <div className="closing__names-wrap">
            <motion.span
              className="closing__names"
              style={{
                x: brideX,
                opacity: brideOpacity,
              }}
            >
              {brideCallname}
            </motion.span>
            <motion.span
              className="closing__ampersand"
              aria-hidden="true"
              style={{
                scale: ampersandScale,
                opacity: ampersandOpacity,
                rotate: ampersandRotate,
              }}
            >
              &amp;
            </motion.span>
            <motion.span
              className="closing__names"
              style={{
                x: groomX,
                opacity: groomOpacity,
              }}
            >
              {groomCallname}
            </motion.span>
          </div>

          <motion.p
            className="closing__date"
            style={{
              opacity: dateOpacity,
              y: dateY,
            }}
          >
            {dateLocation}
          </motion.p>

          <motion.div
            className="netflix-copyright-tag"
            style={{
              opacity: copyrightOpacity,
              y: copyrightY,
            }}
          >
            {copyright}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
