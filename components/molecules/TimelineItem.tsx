import type React from 'react';
import type { StoryTimelineItemData } from '@/types/invitation';

export interface TimelineItemProps {
  item: StoryTimelineItemData;
  index: number;
}

const TIMELINE_PHOTOS = [
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-2.jpg',
];

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, index }) => {
  const seasonNum = index + 1;
  const isFinal = index === 2;
  const photo = TIMELINE_PHOTOS[index] || '/images/gallery-1.jpg';

  return (
    <article
      className="love-story__item netflix-timeline-item visible"
      style={{
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      <span className="love-story__dot" aria-hidden="true" />

      {/* Season Photo Still */}
      <div className="netflix-timeline__photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={item.event}
          className="netflix-timeline__photo"
          loading="lazy"
        />
        <div className="netflix-timeline__photo-tag">
          STILL FROM S{seasonNum}:E{seasonNum}
        </div>
      </div>

      <div className="netflix-timeline__header-tags">
        <span className="netflix-timeline__season-badge">
          SEASON {seasonNum} {isFinal ? '• SERIES FINALE' : ''}
        </span>
        <span className="netflix-spec-tag">PREMIERED {item.year}</span>
      </div>
      <h3 className="love-story__event">
        S{seasonNum}:E{seasonNum} &ldquo;{item.event}&rdquo;
      </h3>
      <p className="love-story__desc">{item.desc}</p>
    </article>
  );
};
