'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import type { WeddingClosing, WeddingCouple } from '@/types/wedding';

export interface ClosingSectionProps {
  closing?: WeddingClosing;
  couple?: WeddingCouple;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({
  closing,
  couple,
}) => {
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
      id="closing"
      className="section closing"
      aria-labelledby="closing-title"
    >
      <div className="container">
        {/* Netflix Closing Message */}
        <motion.div
          className="closing__content netflix-end-credits"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <h2 className="closing__title" id="closing-title">
            {title}
          </h2>

          <p className="closing__text">{message}</p>

          <div className="closing__names-wrap">
            <span className="closing__names">{brideCallname}</span>
            <span className="closing__ampersand" aria-hidden="true">
              &amp;
            </span>
            <span className="closing__names">{groomCallname}</span>
          </div>

          <p className="closing__date">{dateLocation}</p>

          <div className="netflix-copyright-tag">{copyright}</div>
        </motion.div>
      </div>
    </section>
  );
};
