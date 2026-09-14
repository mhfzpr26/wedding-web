'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { CoupleProfileCard } from '@/components/molecules/CoupleProfileCard';
import type { WeddingCouple } from '@/types/wedding';

export interface CoupleSectionProps {
  couple?: WeddingCouple;
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

export const CoupleSection: React.FC<CoupleSectionProps> = ({ couple }) => {
  const brideData = couple?.bride || DEFAULT_BRIDE;
  const groomData = couple?.groom || DEFAULT_GROOM;

  return (
    <section
      id="couple"
      className="section couple"
      aria-labelledby="couple-title"
    >
      <div className="container">
        <motion.div
          className="netflix-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
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

        <motion.div
          className="couple__container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <CoupleProfileCard person={brideData} type="bride" rank={1} />
          <CoupleProfileCard person={groomData} type="groom" rank={2} />
        </motion.div>
      </div>
    </section>
  );
};
