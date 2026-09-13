'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { WishItem } from '@/components/molecules/WishItem';
import { useInView } from '@/hooks/useInView';
import type { WishPayload, WishRecord } from '@/types/wishes';

export interface WishesSectionProps {
  defaultName?: string;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  defaultName = '',
}) => {
  const { ref, inView } = useInView<HTMLElement>();
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [formData, setFormData] = useState<WishPayload>({
    name: defaultName || '',
    status: 'Hadir',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchWishes() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/wishes');
        if (res.ok) {
          const data = await res.json();
          setWishes(data);
        }
      } catch (err) {
        console.error('Error fetching wishes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      ref={ref}
      className="section section--ivory wishes"
      aria-labelledby="wishes-title"
    >
      <div className="container">
        <div
          className="wishes__container"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-section-header">
            <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-xs)' }}>
              AUDIENCE REVIEWS &amp; RATINGS
            </div>
            <h2 className="wishes__title" id="wishes-title">AUDIENCE REVIEWS</h2>
            
            {/* Netflix Rotten Tomatoes Style Score Banner */}
            <div className="netflix-review-score-banner">
              <div className="netflix-review-score-badge">
                <span className="netflix-review-score-badge__icon">🍅</span>
                <div className="netflix-review-score-badge__info">
                  <span className="netflix-review-score-badge__pct">99%</span>
                  <span className="netflix-review-score-badge__label">TOMATOMETER (CERTIFIED FRESH)</span>
                </div>
              </div>
              <div className="netflix-review-score-badge">
                <span className="netflix-review-score-badge__icon">🍿</span>
                <div className="netflix-review-score-badge__info">
                  <span className="netflix-review-score-badge__pct">100%</span>
                  <span className="netflix-review-score-badge__label">AUDIENCE APPROVAL RATING</span>
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--color-light-gray)', marginTop: '0.75rem', fontSize: 'var(--font-size-small)' }}>
              Tinggalkan ulasan hangat &amp; doa restu untuk perjalanan hidup baru Destia &amp; Rakafansa
            </p>
          </div>

          <div className="wishes__form-card netflix-review-form-card">
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div>
                <label className="netflix-form-label" htmlFor="wish-name">
                  REVIEWER NAME (NAMA LENGKAP):
                </label>
                <input
                  id="wish-name"
                  type="text"
                  placeholder="Masukkan nama Anda / keluarga"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="rsvp__input"
                />
              </div>

              <div>
                <label className="netflix-form-label" htmlFor="wish-status">
                  KEHADIRAN &amp; REKOMENDASI (ATTENDANCE &amp; REACTION):
                </label>
                <select
                  id="wish-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="rsvp__select"
                >
                  <option value="Hadir">👍 Hadir (Pasti Menonton Langsung)</option>
                  <option value="Akan Hadir">💖 Insya Allah Hadir (Highly Recommended)</option>
                  <option value="Tidak Hadir">🏠 Streaming from Home (Berhalangan)</option>
                </select>
              </div>

              <div>
                <label className="netflix-form-label" htmlFor="wish-message">
                  WRITE A REVIEW &amp; BLESSING (ULASAN &amp; DOA RESTU):
                </label>
                <textarea
                  id="wish-message"
                  rows={3}
                  placeholder="Tuliskan doa restu, ucapan selamat, dan harapan terbaik Anda..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                  className="rsvp__textarea"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting}
                className="rsvp__submit-btn wishes__submit-btn"
              >
                {isSubmitting ? 'POSTING REVIEW...' : 'POST REVIEW (KIRIM ULASAN & DOA)'}
              </Button>
            </form>
          </div>

          <div className="wishes__list">
            {isLoading ? (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--color-muted-blue)',
                }}
              >
                Memuat ucapan...
              </p>
            ) : wishes.length === 0 ? (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--color-muted-blue)',
                }}
              >
                Belum ada ucapan. Jadilah yang pertama!
              </p>
            ) : (
              wishes.map((item) => <WishItem key={item.id} wish={item} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
