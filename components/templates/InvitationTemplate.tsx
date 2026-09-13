'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ClosingSection } from '@/components/organisms/ClosingSection';
import { CountdownSection } from '@/components/organisms/CountdownSection';
import { CoupleSection } from '@/components/organisms/CoupleSection';
import { CoverSection } from '@/components/organisms/CoverSection';
import { EventSection } from '@/components/organisms/EventSection';
import { FloatingAudio } from '@/components/organisms/FloatingAudio';
import { GallerySection } from '@/components/organisms/GallerySection';
import { GiftSection } from '@/components/organisms/GiftSection';
import { LoveStorySection } from '@/components/organisms/LoveStorySection';
import { OpeningSection } from '@/components/organisms/OpeningSection';
import { RsvpSection } from '@/components/organisms/RsvpSection';
import { TrailerSection } from '@/components/organisms/TrailerSection';
import { WishesSection } from '@/components/organisms/WishesSection';
import { NetflixNavbar } from '@/components/molecules/NetflixNavbar';

export interface InvitationTemplateProps {
  guestName?: string;
}

export const InvitationTemplate: React.FC<InvitationTemplateProps> = ({
  guestName = '',
}) => {
  const [coverOpened, setCoverOpened] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  const fireCelebration = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E50914', '#F40612', '#FFFFFF', '#B20710', '#222222'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handleEnter = useCallback(() => {
    setCoverOpened(true);
    setAudioStarted(true);
    fireCelebration();

    setTimeout(() => {
      const openingEl = document.getElementById('opening');
      if (openingEl) {
        openingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, [fireCelebration]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        !coverOpened &&
        (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')
      ) {
        e.preventDefault();
        handleEnter();
      }
    },
    [coverOpened, handleEnter],
  );

  useEffect(() => {
    if (!coverOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [coverOpened]);

  useEffect(() => {
    if (!coverOpened) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [coverOpened, handleKeyDown]);

  return (
    <>
      <CoverSection
        onEnter={handleEnter}
        isOpen={coverOpened}
        guestName={guestName}
      />

      <NetflixNavbar guestName={guestName} visible={coverOpened} />

      <FloatingAudio shouldPlay={audioStarted} />

      <main
        id="main-content"
        style={{
          opacity: coverOpened ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <OpeningSection />
        <TrailerSection />
        <CoupleSection />
        <GallerySection />
        <LoveStorySection />
        <CountdownSection />
        <EventSection />
        <RsvpSection defaultName={guestName} />
        <WishesSection defaultName={guestName} />
        <GiftSection />
        <ClosingSection />
      </main>
    </>
  );
};
