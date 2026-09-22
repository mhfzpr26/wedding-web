import InstagramIcon from '@mui/icons-material/Instagram';
import type React from 'react';
import type { WeddingBrideGroom, WeddingPrivacyMode } from '@/types/wedding';

export interface CoupleProfileCardProps {
  person: WeddingBrideGroom;
  type: 'bride' | 'groom';
  rank: number;
  privacyMode?: WeddingPrivacyMode;
}

export const CoupleProfileCard: React.FC<CoupleProfileCardProps> = ({
  person,
  type,
  rank,
  privacyMode,
}) => {
  const defaultPhoto =
    type === 'bride' ? '/images/destia.jpg' : '/images/rakafansa.jpg';
  const photoSrc = person.photo || defaultPhoto;

  const fallbackInitial = person.name?.trim()
    ? person.name.trim()[0].toUpperCase()
    : type === 'bride'
      ? 'D'
      : 'R';
  const initial =
    (type === 'bride'
      ? privacyMode?.brideInitial
      : privacyMode?.groomInitial) || fallbackInitial;

  return (
    <article
      className={`couple__person couple__person--${type} netflix-cast-card`}
    >
      {/* Big Netflix Top 10 Rank Watermark */}
      <div className="netflix-cast-card__rank-watermark" aria-hidden="true">
        #{rank}
      </div>

      {/* Portrait Photo / Monogram */}
      <div className="netflix-cast-card__photo-wrap">
        {privacyMode?.noMedia ? (
          <div
            className={`netflix-cast-card__poster netflix-cast-card__poster--${type}`}
          >
            {/* Cinematic Stage Lighting & Backdrop */}
            <div className="netflix-cast-card__poster-bg" />
            <div className="netflix-cast-card__poster-spotlight" />

            {/* Micro Stardust Embers */}
            <div
              className="netflix-cast-card__poster-embers"
              aria-hidden="true"
            >
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--1" />
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--2" />
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--3" />
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--4" />
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--5" />
              <span className="netflix-cast-card__poster-ember netflix-cast-card__poster-ember--1" />
            </div>

            {/* Minimalist Cinema Framing */}
            <div className="netflix-cast-card__poster-frame" />

            {/* Cinematic Movie Title Typography */}
            <div className="netflix-cast-card__poster-title-wrap">
              <span
                className="netflix-cast-card__poster-initial"
                aria-hidden="true"
              >
                {initial}
              </span>
              <h4 className="netflix-cast-card__poster-title">
                {person.callname ||
                  person.name?.trim().split(' ')[0] ||
                  (type === 'bride' ? 'Destia' : 'Rakafansa')}
              </h4>
              <div className="netflix-cast-card__poster-divider" />
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photoSrc}
            alt={person.name}
            className="netflix-cast-card__photo"
            loading="lazy"
          />
        )}
        <div className="netflix-cast-card__photo-gradient" />
        <span className="netflix-cast-card__rank-badge">#{rank} IN CAST</span>
      </div>

      <div className="netflix-cast-card__header-tags">
        <span className="netflix-cast-card__tag">
          {type === 'bride' ? 'LEAD ACTRESS' : 'LEAD ACTOR'}
        </span>
      </div>

      <span
        className="couple__role"
        id={type === 'bride' ? 'couple-title' : undefined}
      >
        {person.characterRole ||
          (type === 'bride' ? 'DESTIA as THE BRIDE' : 'RAKAFANSA as THE GROOM')}
      </span>

      <h3 className="couple__name">{person.name}</h3>

      {person.bio && (
        <p className="netflix-cast-card__bio">&ldquo;{person.bio}&rdquo;</p>
      )}

      <div className="netflix-cast-card__credits-box">
        <p className="couple__parent-label">
          {type === 'bride'
            ? 'EXECUTIVE SPONSORS (ORANG TUA WANITA):'
            : 'EXECUTIVE SPONSORS (ORANG TUA PRIA):'}
        </p>
        <p className="couple__parents">
          {person.parents.mother}
          <span className="ampersand" aria-hidden="true">
            &amp;
          </span>
          {person.parents.father}
        </p>
      </div>

      {person.instagram && (
        <div style={{ marginTop: '0.75rem' }}>
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="netflix-cast-card__social-link"
            aria-label={`Instagram ${person.name}`}
          >
            <InstagramIcon sx={{ fontSize: 18 }} />
            <span>@{person.instagram}</span>
          </a>
        </div>
      )}
    </article>
  );
};
