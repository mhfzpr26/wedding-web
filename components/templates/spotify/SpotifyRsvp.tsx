'use client';

import type React from 'react';
import { useState } from 'react';
import {
  FaCircleCheck,
  FaHouseSignal,
  FaTicket,
  FaUser,
  FaUserGroup,
} from 'react-icons/fa6';
import { GuestQrPass } from '@/components/molecules/GuestQrPass';
import type { AttendanceStatus, RsvpPayload } from '@/types/rsvp';

export interface SpotifyRsvpProps {
  defaultName?: string;
  invitationSlug?: string;
}

export const SpotifyRsvp: React.FC<SpotifyRsvpProps> = ({
  defaultName = '',
  invitationSlug = '',
}) => {
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

  const passTiers = [
    {
      id: 'Hadir' as AttendanceStatus,
      count: '1',
      title: 'Solo Pass',
      sub: '1 Tamu Hadir',
      icon: <FaUser />,
    },
    {
      id: 'Hadir' as AttendanceStatus,
      count: '2',
      title: 'Duo / Plus One',
      sub: '2 Tamu Hadir',
      icon: <FaUserGroup />,
    },
    {
      id: 'Tidak Hadir' as AttendanceStatus,
      count: '0',
      title: 'Remote Streaming',
      sub: 'Doa Restu dari Rumah',
      icon: <FaHouseSignal />,
    },
  ];

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
        setResponseMsg('Konfirmasi kehadiran Anda telah berhasil tersimpan!');
      } else {
        setSubmitStatus('error');
        setResponseMsg(
          data.error || 'Terjadi kesalahan saat menyimpan konfirmasi.',
        );
      }
    } catch {
      setSubmitStatus('error');
      setResponseMsg('Gagal terhubung ke server. Silakan coba sesaat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="rsvp"
      className="spotify-section"
      aria-label="Spotify RSVP Section"
    >
      <div className="spotify-container">
        <div
          className="spotify-section__header"
          style={{ textAlign: 'center' }}
        >
          <span className="spotify-section__tag">RSVP • PRE-SAVE TICKET</span>
          <h2 className="spotify-section__title">PRE-SAVE YOUR ATTENDANCE</h2>
          <p className="spotify-section__subtitle">
            Konfirmasikan kehadiran Anda untuk memvalidasi tiket masuk dan
            reservasi meja perjamuan.
          </p>
        </div>

        <div className="spotify-rsvp-container">
          {submitStatus === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  color: '#1db954',
                  marginBottom: '0.5rem',
                }}
              >
                <FaCircleCheck />
              </div>
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: '0.25rem',
                }}
              >
                VIP PASS CONFIRMED!
              </h3>
              <p
                style={{
                  color: 'var(--sp-text-subdued)',
                  fontSize: '0.9rem',
                  marginBottom: '1.5rem',
                }}
              >
                {responseMsg}
              </p>

              {formData.attendance === 'Hadir' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <GuestQrPass
                    guestName={formData.name}
                    invitationSlug={invitationSlug}
                    attendance={formData.attendance}
                    guestCount={
                      Number.parseInt(String(formData.guestCount || 1), 10) || 1
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Pass Tier Picker */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="spotify-input-label">
                  PILIH TIKET KEHADIRAN:
                </label>
                <div className="spotify-pass-picker">
                  {passTiers.map((tier) => {
                    const isSelected =
                      formData.attendance === tier.id &&
                      (tier.id === 'Tidak Hadir' ||
                        formData.guestCount === tier.count);
                    return (
                      <button
                        key={`${tier.id}-${tier.count}`}
                        type="button"
                        className={`spotify-pass-card ${isSelected ? 'spotify-pass-card--selected' : ''}`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            attendance: tier.id,
                            guestCount: tier.count,
                          }));
                        }}
                      >
                        <div
                          className="spotify-pass-icon"
                          style={{ color: isSelected ? '#1db954' : 'inherit' }}
                        >
                          {tier.icon}
                        </div>
                        <div className="spotify-pass-title">{tier.title}</div>
                        <div className="spotify-pass-sub">{tier.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Field */}
              <div className="spotify-input-group">
                <label htmlFor="sp-rsvp-name" className="spotify-input-label">
                  NAMA LENGKAP / NAMA AKUN TAMU *
                </label>
                <input
                  id="sp-rsvp-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama Anda / keluarga"
                  className="spotify-input"
                />
              </div>

              {/* Notes Field */}
              <div className="spotify-input-group">
                <label htmlFor="sp-rsvp-notes" className="spotify-input-label">
                  CATATAN / UCAPAN SINGKAT (OPSIONAL)
                </label>
                <textarea
                  id="sp-rsvp-notes"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Tuliskan pesan atau konfirmasi khusus..."
                  className="spotify-input"
                />
              </div>

              {submitStatus === 'error' && (
                <p
                  style={{
                    color: '#ff5555',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {responseMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="spotify-btn-primary"
              >
                <FaTicket />
                <span>
                  {isSubmitting
                    ? 'VALIDATING PASS...'
                    : 'CONFIRM PRE-SAVE • KIRIM RSVP'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
