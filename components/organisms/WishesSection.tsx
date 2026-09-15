'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { WishItem } from '@/components/molecules/WishItem';
import type { WishPayload, WishRecord } from '@/types/wishes';

export interface WishesSectionProps {
  defaultName?: string;
  invitationSlug?: string;
}

export const WishesSection: React.FC<WishesSectionProps> = ({
  defaultName = '',
  invitationSlug = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  const headerOpacity = useTransform(smoothProgress, [0.1, 0.45], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.1, 0.45], [30, 0]);

  const formCardOpacity = useTransform(smoothProgress, [0.2, 0.6], [0, 1]);
  const formCardY = useTransform(smoothProgress, [0.2, 0.6], [35, 0]);
  const formCardScale = useTransform(smoothProgress, [0.2, 0.6], [0.96, 1]);

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
        const queryUrl = invitationSlug
          ? `/api/wishes?slug=${encodeURIComponent(invitationSlug)}`
          : '/api/wishes';
        const res = await fetch(queryUrl);
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
      ref={sectionRef}
      id="wishes"
      className="section wishes"
      aria-labelledby="wishes-title"
    >
      <div className="container">
        <div className="wishes__container">
          <motion.div
            className="netflix-section-header"
            style={{
              opacity: headerOpacity,
              y: headerY,
            }}
          >
            <h2 className="wishes__title" id="wishes-title">
              UCAPAN &amp; DOA RESTU
            </h2>

            <p
              style={{
                color: 'var(--color-light-gray)',
                marginTop: '0.75rem',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Tinggalkan pesan hangat &amp; doa restu untuk perjalanan hidup
              baru Destia &amp; Rakafansa
            </p>
          </motion.div>

          <motion.div
            className="wishes__form-card netflix-review-form-card"
            style={{
              opacity: formCardOpacity,
              y: formCardY,
              scale: formCardScale,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
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
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="rsvp__select"
                >
                  <option value="Hadir">
                    🍿 Attending in Person (Pasti Hadir)
                  </option>
                  <option value="Akan Hadir">
                    🎟️ 99% Match - Will Attend (Insya Allah Hadir)
                  </option>
                  <option value="Tidak Hadir">
                    🏠 Streaming from Home (Berhalangan)
                  </option>
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
                {isSubmitting
                  ? 'POSTING REVIEW...'
                  : 'POST REVIEW (KIRIM ULASAN & DOA)'}
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="wishes__list"
            initial={{ opacity: 0, x: 45, y: 35 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.25,
            }}
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
