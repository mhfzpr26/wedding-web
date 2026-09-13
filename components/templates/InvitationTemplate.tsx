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

import type { WeddingConfig } from '@/types/wedding';

export interface InvitationTemplateProps {
  guestName?: string;
  config?: WeddingConfig;
}

export const InvitationTemplate: React.FC<InvitationTemplateProps> = ({
  guestName = '',
  config,
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
        cover={config?.cover}
      />

      <NetflixNavbar guestName={guestName} visible={coverOpened} />

      <FloatingAudio shouldPlay={audioStarted} music={config?.music} />

      <main
        id="main-content"
        style={{
          opacity: coverOpened ? 1 : 0,
          visibility: coverOpened ? 'visible' : 'hidden',
          height: coverOpened ? 'auto' : 0,
          overflow: coverOpened ? 'visible' : 'hidden',
          width: '100%',
          maxWidth: '100%',
          transition: 'opacity 0.6s ease, visibility 0.6s ease',
        }}
      >
        <OpeningSection opening={config?.opening} />
        <TrailerSection trailer={config?.trailer} />
        <CoupleSection couple={config?.couple} />
        <GallerySection photos={config?.gallery} />
        <LoveStorySection timeline={config?.loveStory} />
        <CountdownSection countdown={config?.countdown} />
        <EventSection events={config?.events} />
        <RsvpSection defaultName={guestName} />
        <WishesSection defaultName={guestName} />
        <GiftSection gifts={config?.gifts} />
        <ClosingSection closing={config?.closing} couple={config?.couple} />
      </main>
    </>
  );
};
