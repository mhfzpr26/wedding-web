'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type { WeddingConfig } from '@/types/wedding';
import { SpotifyArtists } from './SpotifyArtists';
import { SpotifyBottomPlayer } from './SpotifyBottomPlayer';
import { SpotifyCountdown } from './SpotifyCountdown';
import { SpotifyCover } from './SpotifyCover';
import { SpotifyCredits } from './SpotifyCredits';
import { SpotifyDiscography } from './SpotifyDiscography';
import { SpotifyHeroHeader } from './SpotifyHeroHeader';
import { SpotifyLyrics } from './SpotifyLyrics';
import { SpotifyNavbar } from './SpotifyNavbar';
import { SpotifyRsvp } from './SpotifyRsvp';
import { SpotifyTipJar } from './SpotifyTipJar';
import { SpotifyTracklist } from './SpotifyTracklist';
import { SpotifyTrailer } from './SpotifyTrailer';
import { SpotifyWishes } from './SpotifyWishes';

export interface SpotifyTemplateProps {
  config: WeddingConfig;
  guestName?: string;
  invitationSlug?: string;
}

export const SpotifyTemplate: React.FC<SpotifyTemplateProps> = ({
  config,
  guestName = '',
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
      const headerEl = document.getElementById('album-header');
      if (headerEl) {
        headerEl.scrollIntoView({ behavior: 'smooth' });
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

  const noMedia = !!config?.privacyMode?.noMedia;
  const coverThumb = config?.cover?.bgImage || '/images/spotify-cover-bg.jpg';

  return (
    <div className="spotify-template">
      {/* 1. Opening Vinyl Gate */}
      <SpotifyCover
        isOpen={coverOpened}
        onEnter={handleEnter}
        guestName={guestName}
        cover={config?.cover}
        privacyMode={config?.privacyMode}
      />

      {/* 2. Sticky Top Navigation */}
      <SpotifyNavbar guestName={guestName} privacyMode={config?.privacyMode} />

      {/* 3. Main Album Content */}
      <motion.main
        id="spotify-main-content"
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hero Album Header */}
        <SpotifyHeroHeader
          cover={config?.cover}
          opening={config?.opening}
          privacyMode={config?.privacyMode}
        />

        {/* Album Drop Countdown */}
        <SpotifyCountdown countdown={config?.countdown} />

        {/* Verified Artists Profiles (Bride & Groom) */}
        <SpotifyArtists
          couple={config?.couple}
          privacyMode={config?.privacyMode}
        />

        {/* Spotify Canvas Video Teaser */}
        {!noMedia && config?.trailer && (
          <SpotifyTrailer trailer={config?.trailer} />
        )}

        {/* Tracklist Ceremony Rundown */}
        <SpotifyTracklist events={config?.events} />

        {/* Synced Lyrics Love Story */}
        <SpotifyLyrics
          timeline={config?.loveStory}
          privacyMode={config?.privacyMode}
        />

        {/* Visual Discography Gallery */}
        {!noMedia && <SpotifyDiscography photos={config?.gallery} />}

        {/* RSVP Attendance */}
        <SpotifyRsvp
          defaultName={guestName}
          invitationSlug={invitationSlug}
        />

        {/* Dedications & Wishes */}
        <SpotifyWishes
          defaultName={guestName}
          invitationSlug={invitationSlug}
        />

        {/* Artist Tip Jar */}
        <SpotifyTipJar gifts={config?.gifts} />

        {/* Credits & Liner Notes */}
        <SpotifyCredits closing={config?.closing} couple={config?.couple} />
      </motion.main>

      {/* 4. Sticky Bottom Now Playing Bar */}
      <SpotifyBottomPlayer music={config?.music} coverImage={coverThumb} />
    </div>
  );
};
