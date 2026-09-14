'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { NetflixNavbar } from '@/components/molecules/NetflixNavbar';
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

import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingConfig } from '@/types/wedding';

export interface InvitationTemplateProps {
  guestName?: string;
  config?: WeddingConfig;
  invitationSlug?: string;
}

export const InvitationTemplate: React.FC<InvitationTemplateProps> = ({
  guestName = '',
  config,
  invitationSlug = '',
}) => {
  const coverOpened = useInvitationStore((s) => s.coverOpened);
  const openCover = useInvitationStore((s) => s.openCover);
  const setGuestName = useInvitationStore((s) => s.setGuestName);
  const setInvitationSlug = useInvitationStore((s) => s.setInvitationSlug);

  useEffect(() => {
    if (guestName) setGuestName(guestName);
    if (invitationSlug) setInvitationSlug(invitationSlug);
  }, [guestName, invitationSlug, setGuestName, setInvitationSlug]);

  const handleEnter = useCallback(() => {
    openCover();

    setTimeout(() => {
      const openingEl = document.getElementById('opening');
      if (openingEl) {
        openingEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, [openCover]);

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

      <FloatingAudio music={config?.music} />

      {coverOpened && (
        <motion.main
          id="main-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <OpeningSection opening={config?.opening} />
          <TrailerSection trailer={config?.trailer} />
          <CoupleSection couple={config?.couple} />
          <GallerySection photos={config?.gallery} />
          <LoveStorySection timeline={config?.loveStory} />
          <CountdownSection countdown={config?.countdown} />
          <EventSection events={config?.events} />
          <RsvpSection
            defaultName={guestName}
            invitationSlug={invitationSlug}
          />
          <WishesSection
            defaultName={guestName}
            invitationSlug={invitationSlug}
          />
          <GiftSection gifts={config?.gifts} />
          <ClosingSection closing={config?.closing} couple={config?.couple} />
        </motion.main>
      )}
    </>
  );
};
