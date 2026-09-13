'use client';

import type React from 'react';
import { CoupleProfileCard } from '@/components/molecules/CoupleProfileCard';
import { useInView } from '@/hooks/useInView';
import type { PersonProfile } from '@/types/invitation';

export const CoupleSection: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  const brideData: PersonProfile = {
    role: 'The Bride',
    characterRole: 'DESTIA as THE BRIDE',
    name: 'Destia Dwi Ramadhani',
    bio: 'Pribadi yang hangat, penuh kebaikan, dan tulus. Siap mengarungi samudera kehidupan baru bersama sang pendamping hati.',
    instagram: 'destiadwir',
    parents: {
      mother: 'Ibu Sri Mulyati',
      father: 'Alm. Bapak M. Hastronugi',
    },
  };

  const groomData: PersonProfile = {
    role: 'The Groom',
    characterRole: 'RAKAFANSA as THE GROOM',
    name: 'Rakafansa Saputra',
    bio: 'Pria pekerja keras, berprinsip, dan setia. Berkomitmen menjadi nahkoda keluarga yang penuh amanah dan kasih sayang.',
    instagram: 'rakafansa',
    parents: {
      mother: 'Ibu Lenny Gusnita',
      father: 'Bapak Mashudi',
    },
  };

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
