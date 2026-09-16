'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef } from 'react';
import { CoupleProfileCard } from '@/components/molecules/CoupleProfileCard';
import type { WeddingCouple, WeddingPrivacyMode } from '@/types/wedding';

export interface CoupleSectionProps {
  couple?: WeddingCouple;
  privacyMode?: WeddingPrivacyMode;
}

const DEFAULT_BRIDE = {
  role: 'The Bride',
  characterRole: 'DESTIA as THE BRIDE',
  name: 'Destia Dwi Ramadhani',
  callname: 'Destia',
  bio: 'Pribadi yang hangat, penuh kebaikan, dan tulus. Siap mengarungi samudera kehidupan baru bersama sang pendamping hati.',
  instagram: 'destiadwir',
  photo: '/images/destia.jpg',
  parents: {
    mother: 'Ibu Sri Mulyati',
    father: 'Alm. Bapak M. Hastronugi',
  },
};

const DEFAULT_GROOM = {
  role: 'The Groom',
  characterRole: 'RAKAFANSA as THE GROOM',
  name: 'Rakafansa Saputra',
  callname: 'Rakafansa',
  bio: 'Pria pekerja keras, berprinsip, dan setia. Berkomitmen menjadi nahkoda keluarga yang penuh amanah dan kasih sayang.',
  instagram: 'rakafansa',
  photo: '/images/rakafansa.jpg',
  parents: {
    mother: 'Ibu Lenny Gusnita',
    father: 'Bapak Mashudi',
  },
};

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  couple,
  privacyMode,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Typography header scrub
  const headerOpacity = useTransform(smoothProgress, [0.08, 0.28], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.08, 0.28], [40, 0]);

  // Bride card: x: -100 -> 0 layered scrub
  const brideX = useTransform(
    smoothProgress,
    [0.12, 0.42, 0.8, 1],
    [-100, 0, 0, -40],
  );
  const brideOpacity = useTransform(
    smoothProgress,
    [0.12, 0.38, 0.85, 1],
    [0, 1, 1, 0.3],
  );

  // Groom card: x: 100 -> 0 layered scrub
  const groomX = useTransform(
    smoothProgress,
    [0.12, 0.42, 0.8, 1],
    [100, 0, 0, 40],
  );
  const groomOpacity = useTransform(
    smoothProgress,
    [0.12, 0.38, 0.85, 1],
    [0, 1, 1, 0.3],
  );

  const brideData = couple?.bride || DEFAULT_BRIDE;
  const groomData = couple?.groom || DEFAULT_GROOM;

  return (
    <section
      ref={sectionRef}
      id="couple"
      className="section couple"
      aria-labelledby="couple-title"
      style={{ overflow: 'hidden' }}
    >
      <div className="container">
        <motion.div
          className="netflix-section-header"
          style={{
            opacity: headerOpacity,
            y: headerY,
          }}
        >
          <h2 className="couple__header-title" id="couple-title">
            MEET THE LEAD CAST
          </h2>
          <p
            style={{
              color: 'var(--color-light-gray)',
              marginTop: '0.35rem',
              fontSize: 'var(--font-size-small)',
            }}
          >
            Dua insan yang menjadi pemeran utama dalam film kehidupan nyata ini
          </p>
        </motion.div>

        <div
          className="couple__container"
          style={{
            position: 'relative',
          }}
        >
          {/* Bride Card (Scrolls in from Left: -100 -> 0) */}
          <motion.div
            style={{
              x: brideX,
              opacity: brideOpacity,
              width: '100%',
            }}
          >
            <CoupleProfileCard
              person={brideData}
              type="bride"
              rank={1}
              privacyMode={privacyMode}
            />
          </motion.div>

          {/* Groom Card (Scrolls in from Right: 100 -> 0) */}
          <motion.div
            style={{
              x: groomX,
              opacity: groomOpacity,
              width: '100%',
            }}
          >
            <CoupleProfileCard
              person={groomData}
              type="groom"
              rank={2}
              privacyMode={privacyMode}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
