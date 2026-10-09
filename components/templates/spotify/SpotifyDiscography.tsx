'use client';

import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaXmark,
} from 'react-icons/fa6';
import type { WeddingGalleryItem } from '@/types/wedding';

export interface SpotifyDiscographyProps {
  photos?: WeddingGalleryItem[];
}

export const SpotifyDiscography: React.FC<SpotifyDiscographyProps> = ({
  photos,
}) => {
  const photoList = photos && photos.length > 0 ? photos : [];
  const [filter, setFilter] = useState<'all' | 'prewedding' | 'lead' | 'venue'>(
    'all',
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos =
    filter === 'all'
      ? photoList
      : photoList.filter((p) => p.category === filter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? filteredPhotos.length - 1 : lightboxIndex - 1,
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === filteredPhotos.length - 1 ? 0 : lightboxIndex + 1,
      );
    }
  };

  return (
    <section
      id="gallery"
      className="spotify-section"
      aria-label="Spotify Visual Discography Gallery"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">
            DISCOGRAPHY • GALERI FOTO
          </span>
          <h2 className="spotify-section__title">SINGLES &amp; VISUAL EPs</h2>
          <p className="spotify-section__subtitle">
            Koleksi potret momen prewedding, potret mempelai, dan arsitektur
            lokasi sakral.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="spotify-filter-pills">
          <button
            type="button"
            className={`spotify-filter-pill ${filter === 'all' ? 'spotify-filter-pill--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tracks ({photoList.length})
          </button>
          <button
            type="button"
            className={`spotify-filter-pill ${filter === 'prewedding' ? 'spotify-filter-pill--active' : ''}`}
            onClick={() => setFilter('prewedding')}
          >
            Pre-Wedding
          </button>
          <button
            type="button"
            className={`spotify-filter-pill ${filter === 'lead' ? 'spotify-filter-pill--active' : ''}`}
            onClick={() => setFilter('lead')}
          >
            Portraits
          </button>
          <button
            type="button"
            className={`spotify-filter-pill ${filter === 'venue' ? 'spotify-filter-pill--active' : ''}`}
            onClick={() => setFilter('venue')}
          >
            Venues
          </button>
        </div>

        {/* Discography Grid */}
        <div className="spotify-discography-grid">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id || `photo-${idx}`}
              className="spotify-album-card"
              onClick={() => setLightboxIndex(idx)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="spotify-album-card__cover">
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <div className="spotify-album-card__play-btn">
                  <FaPlay style={{ fontSize: '1.1rem', marginLeft: '2px' }} />
                </div>
              </div>
              <h3 className="spotify-album-card__title">{photo.title}</h3>
              <p className="spotify-album-card__tag">
                {photo.tag || 'Official Release'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
            <motion.div
              className="spotify-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
            >
              <button
                type="button"
                className="spotify-lightbox__close"
                onClick={() => setLightboxIndex(null)}
                aria-label="Tutup Preview"
              >
                <FaXmark />
              </button>

              <button
                type="button"
                className="spotify-icon-btn"
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                }}
                onClick={handlePrev}
                aria-label="Foto Sebelumnya"
              >
                <FaChevronLeft />
              </button>

              <div
                className="spotify-lightbox__img-wrap"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={filteredPhotos[lightboxIndex].src}
                  alt={filteredPhotos[lightboxIndex].title}
                />
                <div className="spotify-lightbox__caption">
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {filteredPhotos[lightboxIndex].title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--sp-text-subdued)',
                    }}
                  >
                    {filteredPhotos[lightboxIndex].tag}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="spotify-icon-btn"
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                }}
                onClick={handleNext}
                aria-label="Foto Selanjutnya"
              >
                <FaChevronRight />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
