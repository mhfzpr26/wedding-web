'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { useState } from 'react';
import {
  FaCalendarPlus,
  FaCircleCheck,
  FaHeart,
  FaPause,
  FaPlay,
  FaQuoteLeft,
  FaRegHeart,
} from 'react-icons/fa6';
import { useInvitationStore } from '@/stores/useInvitationStore';
import type {
  WeddingCover,
  WeddingOpening,
  WeddingPrivacyMode,
} from '@/types/wedding';

export interface SpotifyHeroHeaderProps {
  cover?: WeddingCover;
  opening?: WeddingOpening;
  privacyMode?: WeddingPrivacyMode;
}

export const SpotifyHeroHeader: React.FC<SpotifyHeroHeaderProps> = ({
  cover,
  opening,
  privacyMode: _privacyMode,
}) => {
  const audioPlaying = useInvitationStore((s) => s.audioPlaying);
  const toggleAudio = useInvitationStore((s) => s.toggleAudio);
  const [liked, setLiked] = useState(true);

  const bgImage = cover?.bgImage || '/images/spotify-cover-bg.jpg';
  const title = cover?.title || 'DESTIA & RAKAFANSA';
  const year = cover?.year || '2026';
  const matchPercentage = cover?.matchPercentage || '99% Match';
  const ratingBadge = cover?.ratingBadge || 'SU / ALL AGES';
  const synopsis =
    cover?.synopsis ||
    'Dua hati yang dipertemukan oleh takdir, kini siap mengikat janji suci seumur hidup. Sebuah perayaan romansa penuh kehangatan, komitmen, dan restu kedua keluarga besar.';
  const calendarUrl =
    cover?.calendarUrl ||
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T080000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Bekasi';

  const dateText = opening?.dateText || '14 November 2026';
  const quote =
    opening?.quote ||
    'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource = opening?.quoteSource || 'QS. AR-RUM : 21';
  const locationText =
    opening?.locationText ||
    'Masjid Agung Al-Barkah & Hotel Santika Premiere, Bekasi';

  return (
    <section
      id="album-header"
      className="spotify-album-header"
      aria-label="Spotify Album Header"
    >
      <div className="spotify-container">
        <motion.div
          className="spotify-album-header__grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Big Square Album Art */}
          <div className="spotify-album-art">
            <img src={bgImage} alt={title} />
          </div>

          {/* Album Information */}
          <div className="spotify-album-meta">
            <div className="spotify-album-type">
              <span>ALBUM</span>
              <span>•</span>
              <span style={{ color: '#1db954', fontWeight: 800 }}>
                {matchPercentage}
              </span>
              <span>•</span>
              <span
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                }}
              >
                {ratingBadge}
              </span>
            </div>

            <h1 className="spotify-album-title">{title}</h1>

            <p className="spotify-album-desc">{synopsis}</p>

            <div className="spotify-album-creator-row">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 700,
                }}
              >
                <FaCircleCheck style={{ color: '#1db954' }} />
                Destia &amp; Rakafansa
              </span>
              <span className="sp-dot">•</span>
              <span className="sp-subdued">{year}</span>
              <span className="sp-dot">•</span>
              <span className="sp-subdued">{dateText}</span>
              <span className="sp-dot">•</span>
              <span className="sp-subdued">2 Acara Sakral, 1 Selamanya</span>
            </div>
          </div>
        </motion.div>

        {/* Action Controls Bar */}
        <div className="spotify-action-bar">
          {/* Large Spotify Play Button */}
          <button
            type="button"
            className="spotify-play-btn-large"
            onClick={toggleAudio}
            aria-label={audioPlaying ? 'Jeda Musik' : 'Putar Musik'}
            title={audioPlaying ? 'Pause Music' : 'Play Music'}
          >
            {audioPlaying ? (
              <FaPause style={{ fontSize: '1.4rem' }} />
            ) : (
              <FaPlay style={{ fontSize: '1.4rem', marginLeft: '3px' }} />
            )}
          </button>

          {/* Like / Heart Button */}
          <button
            type="button"
            className="spotify-heart-btn"
            onClick={() => setLiked(!liked)}
            title={liked ? 'Tersimpan di Library' : 'Simpan ke Library'}
            aria-label="Simpan ke Library"
          >
            {liked ? (
              <FaHeart />
            ) : (
              <FaRegHeart style={{ color: 'var(--sp-text-subdued)' }} />
            )}
          </button>

          {/* Add to Calendar Button */}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-pill-action"
          >
            <FaCalendarPlus style={{ color: '#1db954' }} />
            <span>SAVE DATE TO CALENDAR</span>
          </a>
        </div>

        {/* Liner Notes Quote Card */}
        <motion.div
          className="spotify-liner-notes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="spotify-liner-notes__label">
            <FaQuoteLeft />
            <span>LINER NOTES • AYAT SUCI &amp; LOKASI</span>
          </div>

          <p className="spotify-liner-notes__quote">&ldquo;{quote}&rdquo;</p>
          <p className="spotify-liner-notes__source">— {quoteSource}</p>

          <div
            style={{
              marginTop: '0.85rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.82rem',
              color: 'var(--sp-text-subdued)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ color: '#1db954', fontWeight: 700 }}>Venue:</span>
            <span>{locationText}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
