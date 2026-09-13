'use client';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsIcon from '@mui/icons-material/Collections';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: 'prewedding' | 'lead' | 'venue';
  tag: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    src: '/images/gallery-1.jpg',
    title: 'Golden Hour Promise',
    category: 'prewedding',
    tag: 'Sunset Garden • 35mm',
    aspect: 'landscape',
  },
  {
    id: 'p2',
    src: '/images/destia.jpg',
    title: 'The Radiant Bride: Destia',
    category: 'lead',
    tag: 'Bridal Portrait • 85mm f/1.4',
    aspect: 'portrait',
  },
  {
    id: 'p3',
    src: '/images/rakafansa.jpg',
    title: 'The Groom: Rakafansa',
    category: 'lead',
    tag: 'Groom Portrait • 85mm f/1.4',
    aspect: 'portrait',
  },
  {
    id: 'p4',
    src: '/images/gallery-3.jpg',
    title: 'Unfiltered Laughter',
    category: 'prewedding',
    tag: 'Candid Cafe • 50mm f/1.2',
    aspect: 'portrait',
  },
  {
    id: 'p5',
    src: '/images/gallery-2.jpg',
    title: 'Elegance in Black Tie',
    category: 'prewedding',
    tag: 'Grand Ballroom • Studio Light',
    aspect: 'landscape',
  },
  {
    id: 'p6',
    src: '/images/gallery-4.jpg',
    title: 'The Sacred Vows & Rings',
    category: 'prewedding',
    tag: 'Macro Close-Up • 100mm f/2.8',
    aspect: 'landscape',
  },
  {
    id: 'p7',
    src: '/images/gallery-5.jpg',
    title: 'Royal Heritage Songket',
    category: 'prewedding',
    tag: 'Traditional Adat • Royal Navy',
    aspect: 'portrait',
  },
  {
    id: 'p8',
    src: '/images/venue-akad.jpg',
    title: 'Sanctuary of Akad Nikah',
    category: 'venue',
    tag: 'Masjid Agung Al-Barkah',
    aspect: 'landscape',
  },
  {
    id: 'p9',
    src: '/images/venue-resepsi.jpg',
    title: 'Grand Celebration Ballroom',
    category: 'venue',
    tag: 'Hotel Santika Premiere',
    aspect: 'landscape',
  },
];

import type { WeddingGalleryItem } from '@/types/wedding';

export interface GallerySectionProps {
  photos?: WeddingGalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos }) => {
  const { ref, inView } = useInView<HTMLElement>();
  const [activeTab, setActiveTab] = useState<
    'all' | 'prewedding' | 'lead' | 'venue'
  >('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  const photoList = photos && photos.length > 0 ? photos : GALLERY_PHOTOS;

  const filteredPhotos =
    activeTab === 'all'
      ? photoList
      : photoList.filter((p) => p.category === activeTab);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex(
      (selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length,
    );
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhotoIndex, handlePrev, handleNext, handleCloseLightbox]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="section netflix-gallery-section"
      aria-labelledby="gallery-heading"
    >
      <div className="container">
        {/* Header */}
        <div
          className="netflix-gallery__header"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(25px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-badge-pill">
            <CollectionsIcon sx={{ fontSize: 16 }} />
            <span>PHOTO GALLERY • MOMENTS &amp; MEMORIES</span>
          </div>

          <h2 id="gallery-heading" className="section-title">
            PHOTO GALLERY &amp; MOMENTS
          </h2>

          <p className="section-subtitle">
            Kumpulan potret sinematik dan kenangan terindah menuju hari
            pernikahan.
          </p>

          {/* Category Tabs */}
          <div className="netflix-gallery__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`netflix-gallery__tab ${activeTab === 'all' ? 'netflix-gallery__tab--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              ALL PHOTOS ({photoList.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'prewedding'}
              className={`netflix-gallery__tab ${activeTab === 'prewedding' ? 'netflix-gallery__tab--active' : ''}`}
              onClick={() => setActiveTab('prewedding')}
            >
              PRE-WEDDING
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'lead'}
              className={`netflix-gallery__tab ${activeTab === 'lead' ? 'netflix-gallery__tab--active' : ''}`}
              onClick={() => setActiveTab('lead')}
            >
              THE COUPLE
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'venue'}
              className={`netflix-gallery__tab ${activeTab === 'venue' ? 'netflix-gallery__tab--active' : ''}`}
              onClick={() => setActiveTab('venue')}
            >
              VENUES
            </button>
          </div>
        </div>

        {/* Responsive Photo Grid */}
        <div
          className="netflix-gallery__grid"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              className={`netflix-gallery__card netflix-gallery__card--${photo.aspect}`}
              onClick={() => handleOpenLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenLightbox(idx);
                }
              }}
              aria-label={`Lihat foto ${photo.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.title}
                className="netflix-gallery__img"
                loading="lazy"
              />

              <div className="netflix-gallery__overlay">
                <div className="netflix-gallery__zoom-icon">
                  <ZoomInIcon sx={{ fontSize: 24, color: '#FFFFFF' }} />
                </div>
                <div className="netflix-gallery__card-meta">
                  <span className="netflix-gallery__card-tag">{photo.tag}</span>
                  <h3 className="netflix-gallery__card-title">{photo.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Netflix Photo Lightbox Modal */}
      {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
        <div
          className="netflix-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Foto Penuh"
          onClick={handleCloseLightbox}
        >
          <div
            className="netflix-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="netflix-lightbox__btn-close"
              onClick={handleCloseLightbox}
              aria-label="Tutup foto"
            >
              <CloseIcon sx={{ fontSize: 28 }} />
            </button>

            <button
              type="button"
              className="netflix-lightbox__nav-btn netflix-lightbox__nav-btn--prev"
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 26 }} />
            </button>

            <div className="netflix-lightbox__image-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={filteredPhotos[selectedPhotoIndex].src}
                alt={filteredPhotos[selectedPhotoIndex].title}
                className="netflix-lightbox__main-img"
              />
            </div>

            <button
              type="button"
              className="netflix-lightbox__nav-btn netflix-lightbox__nav-btn--next"
              onClick={handleNext}
              aria-label="Foto selanjutnya"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 26 }} />
            </button>

            {/* Bottom Caption */}
            <div className="netflix-lightbox__caption">
              <div className="netflix-lightbox__caption-info">
                <span className="netflix-spec-tag netflix-spec-tag--red">
                  PRODUCTION STILL
                </span>
                <span className="netflix-lightbox__counter">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
                <h4 className="netflix-lightbox__title">
                  {filteredPhotos[selectedPhotoIndex].title}
                </h4>
                <p className="netflix-lightbox__tag">
                  {filteredPhotos[selectedPhotoIndex].tag} • Netflix Original
                  Wedding Collection
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
