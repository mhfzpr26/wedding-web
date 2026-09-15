'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import {
  NetflixAvatar,
  type NetflixAvatarVariant,
} from '@/components/atoms/NetflixAvatar';
import { Textarea } from '@/components/atoms/Textarea';
import { GuestQrPass } from '@/components/molecules/GuestQrPass';
import type { AttendanceStatus, RsvpPayload } from '@/types/rsvp';

export interface RsvpSectionProps {
  defaultName?: string;
  invitationSlug?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
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

  const rsvpOpacity = useTransform(smoothProgress, [0.1, 0.6], [0, 1]);
  const rsvpY = useTransform(smoothProgress, [0.1, 0.6], [40, 0]);
  const rsvpScale = useTransform(smoothProgress, [0.1, 0.6], [0.96, 1]);

  const [formData, setFormData] = useState<RsvpPayload>({
    name: defaultName || '',
    attendance: 'Hadir',
    guestCount: '1',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(
    null,
  );
  const [responseMsg, setResponseMsg] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          invitationSlug,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setResponseMsg(
          'Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.',
        );
      } else {
        setSubmitStatus('error');
        setResponseMsg(
          data.error || 'Terjadi kendala saat mengirim konfirmasi.',
        );
      }
    } catch {
      setSubmitStatus('error');
      setResponseMsg('Gagal terhubung ke server. Silakan coba sesaat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileOptions: {
    id: AttendanceStatus;
    count: string;
    title: string;
    subtitle: string;
    avatarVariant: NetflixAvatarVariant;
  }[] = [
    {
      id: 'Hadir',
      count: '1',
      title: 'VIP Guest',
      subtitle: '1 VIP Seat',
      avatarVariant: 'red',
    },
    {
      id: 'Hadir',
      count: '2',
      title: 'VIP + Guest',
      subtitle: '2 VIP Seats',
      avatarVariant: 'blue',
    },
    {
      id: 'Tidak Hadir',
      count: '0',
      title: 'Virtual Premiere',
      subtitle: 'Streaming from Home',
      avatarVariant: 'purple',
    },
  ];

  const selectedOption =
    profileOptions.find(
      (opt) =>
        formData.attendance === opt.id &&
        (opt.id === 'Tidak Hadir' || formData.guestCount === opt.count),
    ) || profileOptions[0];

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      className="section rsvp"
      aria-labelledby="rsvp-title"
    >
      <div className="container">
        <motion.div
          className="rsvp__container"
          style={{
            opacity: rsvpOpacity,
            y: rsvpY,
            scale: rsvpScale,
          }}
        >
          <div className="netflix-section-header">
            <h2 className="rsvp__title" id="rsvp-title">
              WHO&apos;S WATCHING?
            </h2>
            <p
              style={{
                color: 'var(--color-light-gray)',
                marginTop: '0.35rem',
                fontSize: 'var(--font-size-small)',
              }}
            >
              Pilih profil kehadiran Anda untuk menghadiri pemutaran perdana
              pernikahan Destia &amp; Rakafansa
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="rsvp__message-success">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <p
                style={{
                  fontWeight: '700',
                  fontSize: 'var(--font-size-h6)',
                  marginBottom: '0.25rem',
                  color: '#ffffff',
                }}
              >
                VIP PASS CONFIRMED!
              </p>
              <p
                style={{ fontSize: 'var(--font-size-small)', color: '#d2d2d2' }}
              >
                {responseMsg}
              </p>

              {formData.attendance === 'Hadir' && (
                <GuestQrPass
                  guestName={formData.name}
                  invitationSlug={invitationSlug}
                  attendance={formData.attendance}
                  avatarVariant={selectedOption.avatarVariant}
                  guestCount={
                    Number.parseInt(String(formData.guestCount || 1), 10) || 1
                  }
                />
              )}
            </div>
          ) : (
            <form className="rsvp__form" onSubmit={handleSubmit}>
              {/* Netflix Profile Avatar Selector */}
              <div className="netflix-profile-picker">
                <span className="netflix-profile-picker__label">
                  WHO&apos;S WATCHING? (PILIH PROFIL KEHADIRAN):
                </span>
                <div className="netflix-profile-picker__grid">
                  {profileOptions.map((opt) => {
                    const isSelected =
                      formData.attendance === opt.id &&
                      (opt.id === 'Tidak Hadir' ||
                        formData.guestCount === opt.count);

                    return (
                      <button
                        key={`${opt.id}-${opt.count}`}
                        type="button"
                        className={`netflix-profile-avatar-card ${isSelected ? 'netflix-profile-avatar-card--active' : ''}`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            attendance: opt.id,
                            guestCount: opt.count,
                          }));
                        }}
                      >
                        <div className="netflix-profile-avatar-card__icon-wrapper">
                          <NetflixAvatar
                            variant={opt.avatarVariant}
                            size="lg"
                            active={isSelected}
                            alt={opt.title}
                          />
                          {isSelected && (
                            <span className="netflix-profile-avatar-card__check">
                              ✓
                            </span>
                          )}
                        </div>
                        <span className="netflix-profile-avatar-card__title">
                          {opt.title}
                        </span>
                        <span className="netflix-profile-avatar-card__sub">
                          {opt.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Input
                id="rsvp-name"
                label="NAMA TAMU / ACCOUNT NAME"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama Anda / keluarga"
                required
              />

              <Textarea
                id="rsvp-notes"
                label="PESAN UNTUK MEMPELAI / SPECIAL REQUESTS (OPSIONAL)"
                name="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Tuliskan catatan khusus atau salam hangat..."
              />

              {submitStatus === 'error' && (
                <p
                  style={{
                    color: '#ef5350',
                    fontSize: 'var(--font-size-small)',
                  }}
                >
                  {responseMsg}
                </p>
              )}

              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting}
                className="rsvp__submit-btn"
              >
                {isSubmitting
                  ? 'VERIFYING PASS...'
                  : 'CONFIRM VIP PASS (KIRIM KONFIRMASI)'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
