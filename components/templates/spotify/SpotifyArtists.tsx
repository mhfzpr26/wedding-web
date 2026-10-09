'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { FaCircleCheck, FaInstagram, FaUsers } from 'react-icons/fa6';
import type { WeddingCouple, WeddingPrivacyMode } from '@/types/wedding';

export interface SpotifyArtistsProps {
  couple?: WeddingCouple;
  privacyMode?: WeddingPrivacyMode;
}

export const SpotifyArtists: React.FC<SpotifyArtistsProps> = ({
  couple,
  privacyMode,
}) => {
  const groom = couple?.groom;
  const bride = couple?.bride;

  const groomName = groom?.name || 'Rakafansa Saputra';
  const groomCallname = groom?.callname || 'Rakafansa';
  const groomBio =
    groom?.bio ||
    'Pria pekerja keras, berprinsip, dan setia. Berkomitmen menjadi nahkoda keluarga yang penuh amanah dan kasih sayang sejati.';
  const groomPhoto = groom?.photo || '/images/rakafansa.jpg';
  const groomRole = groom?.characterRole || 'THE GROOM • LEAD VOCALS';
  const groomIg = groom?.instagram || 'rakafansa';
  const groomParents = groom?.parents || {
    father: 'Bapak Mashudi',
    mother: 'Ibu Lenny Gusnita',
  };

  const brideName = bride?.name || 'Destia Dwi Ramadhani';
  const brideCallname = bride?.callname || 'Destia';
  const brideBio =
    bride?.bio ||
    'Pribadi yang hangat, penuh kebaikan, dan tulus. Siap mengarungi samudera kehidupan baru bersama sang pendamping hati tercinta.';
  const bridePhoto = bride?.photo || '/images/destia.jpg';
  const brideRole = bride?.characterRole || 'THE BRIDE • HARMONY & HEART';
  const brideIg = bride?.instagram || 'destiadwir';
  const brideParents = bride?.parents || {
    father: 'Alm. Bapak M. Hastronugi',
    mother: 'Ibu Sri Mulyati',
  };

  const noMedia = !!privacyMode?.noMedia;

  return (
    <section
      id="artists"
      className="spotify-section"
      aria-label="About the Artists Section"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">ABOUT THE ARTISTS</span>
          <h2 className="spotify-section__title">PROFIL KEDUA MEMPELAI</h2>
          <p className="spotify-section__subtitle">
            Dua insan yang dipersatukan dalam melodi cinta, siap melantunkan
            janji suci pernikahan.
          </p>
        </div>

        <div className="spotify-artists-grid">
          {/* Groom Card */}
          <motion.div
            className="spotify-artist-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="spotify-artist-avatar">
              {!noMedia ? (
                <img src={groomPhoto} alt={groomName} />
              ) : (
                <div className="spotify-artist-initials">
                  {privacyMode?.groomInitial || groomCallname.charAt(0)}
                </div>
              )}
            </div>

            <div className="spotify-verified-badge">
              <FaCircleCheck />
              <span>VERIFIED ARTIST</span>
            </div>

            <h3 className="spotify-artist-name">{groomName}</h3>
            <div className="spotify-artist-callname">({groomCallname})</div>
            <div className="spotify-artist-role">{groomRole}</div>

            <p className="spotify-artist-bio">{groomBio}</p>

            <div className="spotify-artist-parents">
              <strong>Putra Tercinta dari:</strong>
              <br />
              {groomParents.father} &amp; {groomParents.mother}
            </div>

            <div className="spotify-artist-listeners">
              <FaUsers style={{ color: '#1db954' }} />
              <span>1,411,202 Monthly Listeners (Keluarga &amp; Sahabat)</span>
            </div>

            {groomIg && (
              <a
                href={`https://instagram.com/${groomIg.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-pill-action"
              >
                <FaInstagram style={{ color: '#E1306C' }} />
                <span>FOLLOW @{groomIg.replace('@', '')}</span>
              </a>
            )}
          </motion.div>

          {/* Bride Card */}
          <motion.div
            className="spotify-artist-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="spotify-artist-avatar">
              {!noMedia ? (
                <img src={bridePhoto} alt={brideName} />
              ) : (
                <div className="spotify-artist-initials">
                  {privacyMode?.brideInitial || brideCallname.charAt(0)}
                </div>
              )}
            </div>

            <div className="spotify-verified-badge">
              <FaCircleCheck />
              <span>VERIFIED ARTIST</span>
            </div>

            <h3 className="spotify-artist-name">{brideName}</h3>
            <div className="spotify-artist-callname">({brideCallname})</div>
            <div className="spotify-artist-role">{brideRole}</div>

            <p className="spotify-artist-bio">{brideBio}</p>

            <div className="spotify-artist-parents">
              <strong>Putri Tercinta dari:</strong>
              <br />
              {brideParents.father} &amp; {brideParents.mother}
            </div>

            <div className="spotify-artist-listeners">
              <FaUsers style={{ color: '#1db954' }} />
              <span>1,411,202 Monthly Listeners (Keluarga &amp; Sahabat)</span>
            </div>

            {brideIg && (
              <a
                href={`https://instagram.com/${brideIg.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="spotify-pill-action"
              >
                <FaInstagram style={{ color: '#E1306C' }} />
                <span>FOLLOW @{brideIg.replace('@', '')}</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
