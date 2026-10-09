'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { FaCommentDots, FaPaperPlane } from 'react-icons/fa6';
import type { WishPayload, WishRecord } from '@/types/wishes';

export interface SpotifyWishesProps {
  defaultName?: string;
  invitationSlug?: string;
}

export const SpotifyWishes: React.FC<SpotifyWishesProps> = ({
  defaultName = '',
  invitationSlug = '',
}) => {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [formData, setFormData] = useState<WishPayload>({
    name: defaultName || '',
    status: 'Hadir',
    message: '',
  });
  const [_isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadWishes() {
      setIsLoading(true);
      try {
        const queryUrl = invitationSlug
          ? `/api/wishes?slug=${encodeURIComponent(invitationSlug)}`
          : '/api/wishes';
        const res = await fetch(queryUrl);
        if (res.ok) {
          const data = await res.json();
          setWishes(data);
        }
      } catch (err) {
        console.error('Failed to load wishes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishes();
  }, [invitationSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          invitationSlug,
        }),
      });

      if (res.ok) {
        const newWish: WishRecord = await res.json();
        setWishes((prev) => [newWish, ...prev]);
        setFormData((prev) => ({ ...prev, message: '' }));
      }
    } catch (err) {
      console.error('Error posting wish:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="wishes"
      className="spotify-section"
      aria-label="Spotify Fan Dedications Wishes"
    >
      <div className="spotify-container">
        <div className="spotify-section__header">
          <span className="spotify-section__tag">
            FAN ACTIVITY • DOA &amp; UCAPAN
          </span>
          <h2 className="spotify-section__title">DEDICATIONS &amp; WISHES</h2>
          <p className="spotify-section__subtitle">
            Kirimkan ucapan selamat dan doa restu terindah untuk kedua mempelai
            dalam album pernikahan ini.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Form Left */}
          <div
            className="spotify-rsvp-container"
            style={{ margin: 0, maxWidth: '100%' }}
          >
            <form onSubmit={handleSubmit}>
              <div className="spotify-input-group">
                <label htmlFor="sp-wish-name" className="spotify-input-label">
                  NAMA ANDA *
                </label>
                <input
                  id="sp-wish-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nama pengirim doa"
                  className="spotify-input"
                />
              </div>

              <div className="spotify-input-group">
                <label htmlFor="sp-wish-status" className="spotify-input-label">
                  STATUS KEHADIRAN
                </label>
                <select
                  id="sp-wish-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="spotify-input"
                  style={{ background: '#242424' }}
                >
                  <option value="Hadir">Hadir Langsung di Acara</option>
                  <option value="Tidak Hadir">
                    Mendoakan dari Jauh (Remote)
                  </option>
                  <option value="Masih Ragu">Belum Pasti</option>
                </select>
              </div>

              <div className="spotify-input-group">
                <label htmlFor="sp-wish-msg" className="spotify-input-label">
                  UNTUK MEMPELAI (DEDICATION) *
                </label>
                <textarea
                  id="sp-wish-msg"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tuliskan ucapan selamat dan doa restu..."
                  className="spotify-input"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="spotify-btn-primary"
              >
                <FaPaperPlane />
                <span>
                  {isSubmitting
                    ? 'SENDING DEDICATION...'
                    : 'SEND DEDICATION • KIRIM DOA'}
                </span>
              </button>
            </form>
          </div>

          {/* Live Dedications Stream Right */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FaCommentDots style={{ color: '#1db954' }} />
                <span>LIVE DEDICATIONS STREAM</span>
              </div>
              <span
                style={{ fontSize: '0.75rem', color: 'var(--sp-text-subdued)' }}
              >
                {wishes.length} Ucapan Masuk
              </span>
            </div>

            <div className="spotify-wishes-stream">
              {wishes.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--sp-text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  Belum ada ucapan. Jadilah yang pertama memberikan dedikasi
                  cinta!
                </div>
              ) : (
                wishes.map((item) => (
                  <div key={item.id} className="spotify-wish-item">
                    <div className="spotify-wish-avatar">
                      {item.name ? item.name.charAt(0).toUpperCase() : 'G'}
                    </div>
                    <div className="spotify-wish-body">
                      <div className="spotify-wish-meta">
                        <span className="spotify-wish-author">{item.name}</span>
                        <span className="spotify-wish-badge">
                          {item.status || 'Verified Guest'}
                        </span>
                      </div>
                      <p className="spotify-wish-text">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
