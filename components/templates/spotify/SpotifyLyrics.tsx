'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { useState } from 'react';
import { FaMusic } from 'react-icons/fa6';
import type { WeddingPrivacyMode, WeddingTimelineItem } from '@/types/wedding';

export interface SpotifyLyricsProps {
  timeline?: WeddingTimelineItem[];
  privacyMode?: WeddingPrivacyMode;
}

export const SpotifyLyrics: React.FC<SpotifyLyricsProps> = ({
  timeline,
  privacyMode: _privacyMode,
}) => {
  const storyList = timeline && timeline.length > 0 ? timeline : [];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="lyrics"
      className="spotify-section"
      aria-label="Spotify Synced Lyrics Love Story"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">
            SYNCED LYRICS • KISAH KAMI
          </span>
          <h2 className="spotify-section__title">OUR LOVE STORY LYRICS</h2>
          <p className="spotify-section__subtitle">
            Lirik perjalanan cinta dari masa ke masa, tersinkronisasi indah di
            dalam relung hati.
          </p>
        </div>

        <div className="spotify-lyrics-card">
          <div className="spotify-lyrics-header">
            <div className="spotify-lyrics-badge">
              <FaMusic />
              <span>SYNCED TO OUR HEARTS • REAL-TIME ROMANCE</span>
            </div>
            <div
              style={{ fontSize: '0.75rem', color: 'var(--sp-text-subdued)' }}
            >
              Klik baris lirik untuk memutar kembali memori
            </div>
          </div>

          <div className="spotify-lyrics-lines">
            {storyList.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <motion.div
                  key={item.id || `lyric-${idx}`}
                  className={`spotify-lyric-line ${isActive ? 'spotify-lyric-line--active' : 'spotify-lyric-line--dim'}`}
                  onClick={() => setActiveIdx(idx)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="spotify-lyric-timestamp">
                    {item.year} • {item.season || `VERSE 0${idx + 1}`}
                  </div>
                  <h3 className="spotify-lyric-title">{item.event}</h3>
                  <p className="spotify-lyric-desc">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
