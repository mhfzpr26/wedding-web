'use client';

import type React from 'react';
import { CoupleProfileCard } from '@/components/molecules/CoupleProfileCard';
import { useInView } from '@/hooks/useInView';
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
  const { ref, inView } = useInView<HTMLElement>();

  const brideData = couple?.bride || DEFAULT_BRIDE;
  const groomData = couple?.groom || DEFAULT_GROOM;

  return (
    <section
      id="couple"
      ref={ref}
      className="section couple"
      aria-labelledby="couple-title"
    >
      <div className="container">
        <div className="netflix-section-header">
          <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-xs)' }}>
            TOP 10 STARRING CAST • PEMERAN UTAMA
          </div>
          <h2 className="couple__header-title" id="couple-title">MEET THE LEAD CAST</h2>
          <p style={{ color: 'var(--color-light-gray)', marginTop: '0.35rem', fontSize: 'var(--font-size-small)' }}>
            Dua insan yang menjadi pemeran utama dalam film kehidupan nyata ini
          </p>
        </div>

        <div
          className="couple__container"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <CoupleProfileCard person={brideData} type="bride" rank={1} />
          <CoupleProfileCard person={groomData} type="groom" rank={2} />
        </div>
      </div>
    </section>
  );
};
