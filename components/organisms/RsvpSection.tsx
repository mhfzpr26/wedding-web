'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { GuestQrPass } from '@/components/molecules/GuestQrPass';
import { useInView } from '@/hooks/useInView';
import type { AttendanceStatus, RsvpPayload } from '@/types/rsvp';

export interface RsvpSectionProps {
  defaultName?: string;
  invitationSlug?: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  defaultName = '',
  invitationSlug = '',
}) => {
  const { ref, inView } = useInView<HTMLElement>();
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
    avatarBg: string;
    avatarInitial: string;
  }[] = [
    {
      id: 'Hadir',
      count: '1',
      title: 'Hadir Sendiri',
      subtitle: '1 VIP Ticket',
      avatarBg: 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
      avatarInitial: '👤',
    },
    {
      id: 'Hadir',
      count: '2',
      title: 'Hadir Berdua (+1)',
      subtitle: '2 VIP Tickets',
      avatarBg: 'linear-gradient(135deg, #0071eb 0%, #004da6 100%)',
      avatarInitial: '👥',
    },
    {
      id: 'Tidak Hadir',
      count: '0',
      title: 'Streaming from Home',
      subtitle: 'Berhalangan Hadir',
      avatarBg: 'linear-gradient(135deg, #4d4d4d 0%, #2b2b2b 100%)',
      avatarInitial: '🏠',
    },
  ];

  return (
    <section
      id="rsvp"
      ref={ref}
      className="section rsvp"
      aria-labelledby="rsvp-title"
    >
      <div className="container">
        <div
          className="rsvp__card netflix-rsvp-card"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-section-header">
            <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-xs)' }}>
              CONFIRM VIP STREAMING PASS
            </div>
            <h2 className="rsvp__title" id="rsvp-title">WHO&apos;S WATCHING?</h2>
            <p style={{ color: 'var(--color-light-gray)', marginTop: '0.35rem', fontSize: 'var(--font-size-small)' }}>
              Pilih profil kehadiran Anda untuk menghadiri pemutaran perdana pernikahan Destia &amp; Rakafansa
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="rsvp__message-success">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
              <p style={{ fontWeight: '700', fontSize: 'var(--font-size-h6)', marginBottom: '0.25rem', color: '#ffffff' }}>
                VIP PASS CONFIRMED!
              </p>
              <p style={{ fontSize: 'var(--font-size-small)', color: '#d2d2d2' }}>{responseMsg}</p>

              {formData.attendance === 'Hadir' && (
                <GuestQrPass
                  guestName={formData.name}
                  invitationSlug={invitationSlug}
                  attendance={formData.attendance}
                  guestCount={Number.parseInt(String(formData.guestCount || 1), 10) || 1}
                />
              )}
            </div>
          ) : (
            <form className="rsvp__form" onSubmit={handleSubmit}>
              {/* Netflix Profile Avatar Selector */}
              <div className="netflix-profile-picker">
                <span className="netflix-profile-picker__label">
                  PILIH PROFIL KEHADIRAN (SELECT PROFILE):
                </span>
                <div className="netflix-profile-picker__grid">
                  {profileOptions.map((opt) => {
                    const isSelected =
                      formData.attendance === opt.id &&
                      (opt.id === 'Tidak Hadir' || formData.guestCount === opt.count);

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
                        <div
                          className="netflix-profile-avatar-card__icon"
                          style={{ background: opt.avatarBg }}
                        >
                          <span style={{ fontSize: '1.75rem' }}>{opt.avatarInitial}</span>
                          {isSelected && (
                            <span className="netflix-profile-avatar-card__check">✓</span>
                          )}
                        </div>
                        <span className="netflix-profile-avatar-card__title">{opt.title}</span>
                        <span className="netflix-profile-avatar-card__sub">{opt.subtitle}</span>
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
                <p style={{ color: '#ef5350', fontSize: 'var(--font-size-small)' }}>
                  {responseMsg}
                </p>
              )}

              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting}
                className="rsvp__submit-btn"
              >
                {isSubmitting ? 'VERIFYING PASS...' : 'CONFIRM VIP PASS (KIRIM KONFIRMASI)'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
