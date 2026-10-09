'use client';

import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import type {
  OnboardingFormData,
  OnboardingResponseData,
} from '@/types/onboarding';

interface ClientOnboardingWizardProps {
  initialData: OnboardingResponseData;
  token: string;
  isEmbedded?: boolean;
}

const PRESET_QUOTES = [
  {
    source: 'QS. AR-RUM : 21',
    text: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  },
  {
    source: '1 KORINTUS 13 : 4-7',
    text: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.',
  },
  {
    source: 'KUTIPAN CINTA',
    text: 'Dua jiwa, satu hati. Bersatu dalam ikatan suci pernikahan untuk melangkah bersama menapaki indahnya perjalanan kehidupan selamanya.',
  },
];

const POPULAR_BANKS = [
  'BCA',
  'Bank Mandiri',
  'BRI',
  'BNI',
  'Bank Syariah Indonesia (BSI)',
  'CIMB Niaga',
  'Permata Bank',
  'Bank Danamon',
  'Bank Jago',
  'SeaBank',
  'DANA',
  'GoPay',
  'OVO',
  'ShopeePay',
  'Lainnya',
];

export const ClientOnboardingWizard: React.FC<ClientOnboardingWizardProps> = ({
  initialData,
  token,
  isEmbedded = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(
    initialData.formData,
  );
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const showNotification = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Generic File Upload Handler
  const handleUpload = async (
    file: File,
    fieldKey: string,
    onSuccess: (url: string) => void,
  ) => {
    setUploadingField(fieldKey);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch(`/api/onboard/${token}/upload`, {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        onSuccess(result.url);
        showNotification('success', `${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showNotification('error', err.error || 'Gagal mengunggah gambar');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan koneksi saat upload');
    } finally {
      setUploadingField(null);
    }
  };

  // Save changes to backend (Draft or Final)
  const handleSave = async (isFinal = false) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/onboard/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          isFinalSubmit: isFinal,
        }),
      });

      if (res.ok) {
        if (isFinal) {
          setSubmittedSuccess(true);
        } else {
          showNotification('success', 'Draf data berhasil disimpan!');
        }
      } else {
        const err = await res.json();
        showNotification('error', err.error || 'Gagal menyimpan data');
      }
    } catch {
      showNotification('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  // Next / Previous Step
  const nextStep = () => {
    handleSave(false); // Auto-save draft on step navigation
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submittedSuccess) {
    return (
      <div className="onboard-page">
        <div className="onboard-container">
          <div className="onboard-success-card">
            <div className="onboard-success-icon">✓</div>
            <h1 className="onboard-success-title">
              Data Pernikahan Berhasil Terkirim!
            </h1>
            <p className="onboard-success-desc">
              Terima kasih{' '}
              <strong>
                {formData.couple.groom.callName} &amp;{' '}
                {formData.couple.bride.callName}
              </strong>
              ! Seluruh data acara, foto, dan cerita cinta Anda telah tersimpan
              dengan aman dan siap diproses menjadi undangan digital yang
              memukau.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '14px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href={`/undangan/${initialData.invitation.slug}`}
                target="_blank"
                className="onboard-btn onboard-btn-primary"
              >
                🎬 Lihat Pratinjau Undangan Anda
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedSuccess(false)}
                className="onboard-btn onboard-btn-secondary"
              >
                ✏️ Periksa &amp; Sunting Kembali Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formContent = (
    <>
      {/* Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.88rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{toast.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Header if not embedded */}
      {!isEmbedded && (
        <header className="onboard-header">
          <div className="onboard-logo-badge">
            💍 INVATERA • FORMULIR DATA PERNIKAHAN
          </div>
          <h1 className="onboard-title">Isi Data Undangan Digital</h1>
          <p className="onboard-subtitle">
            Mohon lengkapi informasi hari bahagia Anda di bawah ini. Anda dapat
            menyimpan draf kapan saja dan melanjutkannya nanti.
          </p>
          <div className="onboard-couple-tag">
            Undangan:{' '}
            <strong>
              {formData.couple.groom.callName || 'Pengantin'} &amp;{' '}
              {formData.couple.bride.callName || 'Pasangan'}
            </strong>{' '}
            • Status:{' '}
            <span style={{ color: '#fbbf24', textTransform: 'capitalize' }}>
              {initialData.invitation.status}
            </span>
          </div>
        </header>
      )}

      {/* 5-Step Stepper */}
      <nav className="onboard-stepper" aria-label="Langkah Formulir">
        {[
          { step: 1, label: '1. Mempelai' },
          { step: 2, label: '2. Acara' },
          { step: 3, label: '3. Galeri & Cerita' },
          { step: 4, label: '4. Hadiah & Musik' },
          { step: 5, label: '5. Konfirmasi' },
        ].map((item) => (
          <button
            type="button"
            key={item.step}
            className={`onboard-step-item ${
              currentStep === item.step
                ? 'active'
                : currentStep > item.step
                  ? 'completed'
                  : ''
            }`}
            onClick={() => setCurrentStep(item.step)}
          >
            <div className="onboard-step-badge">
              {currentStep > item.step ? '✓' : item.step}
            </div>
            <span className="onboard-step-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Form Body Cards */}
      <main className="onboard-card">
        {/* ========================================================
              STEP 1: DATA MEMPELAI
             ======================================================== */}
        {currentStep === 1 && (
          <div>
            <h2 className="onboard-section-title">
              <span>👫</span> Profil Kedua Mempelai
            </h2>
            <p className="onboard-section-desc">
              Masukkan informasi lengkap calon pengantin pria dan wanita yang
              akan dicantumkan di undangan.
            </p>

            {/* Cover Photo */}
            <div
              style={{
                marginBottom: '28px',
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="onboard-label">
                <span>Foto Cover / Banner Utama Undangan</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {formData.couple.coverPhoto && (
                  <img
                    src={formData.couple.coverPhoto}
                    alt="Cover Preview"
                    style={{
                      width: '120px',
                      height: '75px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                )}
                <label className="onboard-upload-btn">
                  <span>
                    {uploadingField === 'cover'
                      ? 'Mengunggah…'
                      : '📷 Pilih Foto Cover Utama'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={uploadingField === 'cover'}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        handleUpload(f, 'cover', (url) =>
                          setFormData((prev) => ({
                            ...prev,
                            couple: { ...prev.couple, coverPhoto: url },
                          })),
                        );
                    }}
                  />
                </label>
              </div>
              <span className="onboard-hint">
                Disarankan foto landscape resolusi tinggi (prewedding atau momen
                berdua).
              </span>
            </div>

            {/* Groom Section */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  🤵 Calon Mempelai Pria (Groom)
                </span>
              </div>

              <div className="onboard-avatar-uploader">
                <img
                  src={formData.couple.groom.photo || '/images/groom.jpg'}
                  alt="Foto Mempelai Pria"
                  className="onboard-avatar-preview"
                />
                <div className="onboard-avatar-info">
                  <label className="onboard-upload-btn">
                    <span>
                      {uploadingField === 'groom'
                        ? 'Mengunggah…'
                        : 'Upload Foto Pria'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      disabled={uploadingField === 'groom'}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleUpload(f, 'groom', (url) =>
                            setFormData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                groom: {
                                  ...prev.couple.groom,
                                  photo: url,
                                },
                              },
                            })),
                          );
                      }}
                    />
                  </label>
                  <div className="onboard-hint">
                    Format foto potret/close-up
                  </div>
                </div>
              </div>

              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Lengkap (dengan Gelar)
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Rakafansa Saputra, S.Kom."
                    value={formData.couple.groom.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            fullName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Panggilan<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Raka"
                    value={formData.couple.groom.callName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            callName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Urutan Anak<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Putra pertama dari"
                    value={formData.couple.groom.childOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            childOrder: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Nama lengkap ayah mempelai pria"
                    value={formData.couple.groom.fatherName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            fatherName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Nama lengkap ibu mempelai pria"
                    value={formData.couple.groom.motherName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            motherName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Akun Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: @rakafansa"
                    value={formData.couple.groom.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            instagram: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Bride Section */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  👰 Calon Mempelai Wanita (Bride)
                </span>
              </div>

              <div className="onboard-avatar-uploader">
                <img
                  src={formData.couple.bride.photo || '/images/bride.jpg'}
                  alt="Foto Mempelai Wanita"
                  className="onboard-avatar-preview"
                />
                <div className="onboard-avatar-info">
                  <label className="onboard-upload-btn">
                    <span>
                      {uploadingField === 'bride'
                        ? 'Mengunggah…'
                        : 'Upload Foto Wanita'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      disabled={uploadingField === 'bride'}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f)
                          handleUpload(f, 'bride', (url) =>
                            setFormData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                bride: {
                                  ...prev.couple.bride,
                                  photo: url,
                                },
                              },
                            })),
                          );
                      }}
                    />
                  </label>
                  <div className="onboard-hint">
                    Format foto potret/close-up
                  </div>
                </div>
              </div>

              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Lengkap (dengan Gelar)
                    <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Destia Dwi Ramadhani, S.Pd."
                    value={formData.couple.bride.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            fullName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Panggilan<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Destia"
                    value={formData.couple.bride.callName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            callName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Urutan Anak<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Putri kedua dari"
                    value={formData.couple.bride.childOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            childOrder: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Nama Ayah</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Nama lengkap ayah mempelai wanita"
                    value={formData.couple.bride.fatherName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            fatherName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Nama Ibu</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Nama lengkap ibu mempelai wanita"
                    value={formData.couple.bride.motherName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            motherName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Akun Instagram (Opsional)
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: @destiadwi"
                    value={formData.couple.bride.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            instagram: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
              STEP 2: RANGKAIAN ACARA
             ======================================================== */}
        {currentStep === 2 && (
          <div>
            <h2 className="onboard-section-title">
              <span>📅</span> Rangkaian Acara Pernikahan
            </h2>
            <p className="onboard-section-desc">
              Tentukan jadwal, waktu, lokasi gedung, serta tautan Google Maps
              untuk memudahkan para tamu hadir ke lokasi.
            </p>

            {/* Akad Nikah */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  💍 1. Akad Nikah / Pemberkatan
                </span>
              </div>
              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Tanggal Akad<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="onboard-input"
                    value={formData.events.akad.date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          akad: {
                            ...prev.events.akad,
                            date: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Waktu Pelaksanaan</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Mulai (08:00)"
                      value={formData.events.akad.startTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          events: {
                            ...prev.events,
                            akad: {
                              ...prev.events.akad,
                              startTime: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Selesai (10:00 WIB)"
                      value={formData.events.akad.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          events: {
                            ...prev.events,
                            akad: {
                              ...prev.events.akad,
                              endTime: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Lokasi / Tempat<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Masjid Agung Al-Barkah / Ballroom Hotel"
                    value={formData.events.akad.venueName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          akad: {
                            ...prev.events.akad,
                            venueName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Tautan Google Maps
                    {formData.events.akad.mapUrl && (
                      <a
                        href={formData.events.akad.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#60a5fa',
                          fontSize: '0.74rem',
                          textDecoration: 'none',
                        }}
                      >
                        ↗ Cek Buka Maps
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    className="onboard-input"
                    placeholder="https://maps.app.goo.gl/..."
                    value={formData.events.akad.mapUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          akad: {
                            ...prev.events.akad,
                            mapUrl: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group full-width">
                  <label className="onboard-label">Alamat Lengkap</label>
                  <textarea
                    className="onboard-textarea"
                    placeholder="Alamat jalan, kelurahan, kecamatan, kota..."
                    value={formData.events.akad.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          akad: {
                            ...prev.events.akad,
                            address: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Resepsi Pernikahan */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  🎉 2. Resepsi Pernikahan
                </span>
                <button
                  type="button"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#cbd5e1',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      events: {
                        ...prev.events,
                        resepsi: {
                          ...prev.events.resepsi,
                          date: prev.events.akad.date,
                          venueName: prev.events.akad.venueName,
                          address: prev.events.akad.address,
                          mapUrl: prev.events.akad.mapUrl,
                        },
                      },
                    }));
                    showNotification(
                      'success',
                      'Tanggal & lokasi disamakan dengan Akad!',
                    );
                  }}
                >
                  Salin Info dari Akad
                </button>
              </div>
              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Tanggal Resepsi<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="onboard-input"
                    value={formData.events.resepsi.date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          resepsi: {
                            ...prev.events.resepsi,
                            date: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">Waktu Pelaksanaan</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Mulai (11:00)"
                      value={formData.events.resepsi.startTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          events: {
                            ...prev.events,
                            resepsi: {
                              ...prev.events.resepsi,
                              startTime: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Selesai (14:00 WIB)"
                      value={formData.events.resepsi.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          events: {
                            ...prev.events,
                            resepsi: {
                              ...prev.events.resepsi,
                              endTime: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Nama Lokasi / Tempat<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Hotel Santika Premiere, Bekasi"
                    value={formData.events.resepsi.venueName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          resepsi: {
                            ...prev.events.resepsi,
                            venueName: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Tautan Google Maps
                    {formData.events.resepsi.mapUrl && (
                      <a
                        href={formData.events.resepsi.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#60a5fa',
                          fontSize: '0.74rem',
                          textDecoration: 'none',
                        }}
                      >
                        ↗ Cek Buka Maps
                      </a>
                    )}
                  </label>
                  <input
                    type="url"
                    className="onboard-input"
                    placeholder="https://maps.app.goo.gl/..."
                    value={formData.events.resepsi.mapUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          resepsi: {
                            ...prev.events.resepsi,
                            mapUrl: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group full-width">
                  <label className="onboard-label">Alamat Lengkap</label>
                  <textarea
                    className="onboard-textarea"
                    placeholder="Alamat gedung / tempat resepsi..."
                    value={formData.events.resepsi.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          resepsi: {
                            ...prev.events.resepsi,
                            address: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
              STEP 3: GALERI & CERITA
             ======================================================== */}
        {currentStep === 3 && (
          <div>
            <h2 className="onboard-section-title">
              <span>📸</span> Galeri Foto &amp; Kisah Cinta
            </h2>
            <p className="onboard-section-desc">
              Unggah momen bahagia Anda dan bagikan kilas balik perjalanan cinta
              menuju pelaminan.
            </p>

            {/* Photo Gallery Grid */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  🖼️ Foto Galeri Prewedding (
                  {formData.story.galleryPhotos.length} Foto)
                </span>
              </div>

              <div className="onboard-gallery-grid">
                {formData.story.galleryPhotos.map((photoUrl, idx) => (
                  <div key={photoUrl || idx} className="onboard-gallery-item">
                    <img
                      src={photoUrl}
                      alt={`Momen ${idx + 1}`}
                      className="onboard-gallery-img"
                    />
                    <button
                      type="button"
                      className="onboard-gallery-del"
                      title="Hapus foto"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          story: {
                            ...prev.story,
                            galleryPhotos: prev.story.galleryPhotos.filter(
                              (_, i) => i !== idx,
                            ),
                          },
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <label className="onboard-gallery-add">
                  <span style={{ fontSize: '1.2rem' }}>+</span>
                  <span>
                    {uploadingField === 'gallery'
                      ? 'Mengunggah…'
                      : 'Tambah Foto'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    disabled={uploadingField === 'gallery'}
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => {
                        handleUpload(file, 'gallery', (url) => {
                          setFormData((prev) => ({
                            ...prev,
                            story: {
                              ...prev.story,
                              galleryPhotos: [...prev.story.galleryPhotos, url],
                            },
                          }));
                        });
                      });
                    }}
                  />
                </label>
              </div>
              <div className="onboard-hint" style={{ marginTop: '12px' }}>
                Tips: Anda dapat memilih beberapa foto sekaligus. Rekomendasi 4
                hingga 8 foto terbaik.
              </div>
            </div>

            {/* Love Story Timeline */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  💌 Perjalanan Cinta (Love Story)
                </span>
                <button
                  type="button"
                  style={{
                    background: 'rgba(229,9,20,0.15)',
                    border: '1px solid rgba(229,9,20,0.3)',
                    color: '#ff6b6b',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      story: {
                        ...prev.story,
                        stories: [
                          ...prev.story.stories,
                          {
                            id: `story-${Date.now()}`,
                            year: new Date().getFullYear().toString(),
                            title: 'Babak Baru',
                            desc: 'Cerita indah kami...',
                          },
                        ],
                      },
                    }))
                  }
                >
                  + Tambah Momen
                </button>
              </div>

              {formData.story.stories.map((storyItem, idx) => (
                <div
                  key={storyItem.id || storyItem.title}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Tahun (e.g. 2023)"
                      style={{ width: '110px' }}
                      value={storyItem.year}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.story.stories];
                          updated[idx].year = val;
                          return {
                            ...prev,
                            story: { ...prev.story, stories: updated },
                          };
                        });
                      }}
                    />
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="Judul (e.g. Awal Pertemuan)"
                      value={storyItem.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const updated = [...prev.story.stories];
                          updated[idx].title = val;
                          return {
                            ...prev,
                            story: { ...prev.story, stories: updated },
                          };
                        });
                      }}
                    />
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0 8px',
                        fontSize: '1rem',
                      }}
                      title="Hapus Momen"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          story: {
                            ...prev.story,
                            stories: prev.story.stories.filter(
                              (_, i) => i !== idx,
                            ),
                          },
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    className="onboard-textarea"
                    placeholder="Ceritakan momen singkat ini..."
                    rows={2}
                    value={storyItem.desc}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => {
                        const updated = [...prev.story.stories];
                        updated[idx].desc = val;
                        return {
                          ...prev,
                          story: { ...prev.story, stories: updated },
                        };
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Video Link */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  🎬 Video Teaser / Trailer (Opsional)
                </span>
              </div>
              <div className="onboard-form-group">
                <label className="onboard-label">
                  Tautan Video (YouTube / MP4)
                </label>
                <input
                  type="url"
                  className="onboard-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.story.videoUrl || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      story: { ...prev.story, videoUrl: e.target.value },
                    }))
                  }
                />
                <div className="onboard-hint">
                  Jika ada video teaser prewedding, video akan ditampilkan di
                  bagian Teaser Sinematik.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
              STEP 4: HADIAH & MUSIK
             ======================================================== */}
        {currentStep === 4 && (
          <div>
            <h2 className="onboard-section-title">
              <span>🎁</span> Hadiah Digital &amp; Musik Latar
            </h2>
            <p className="onboard-section-desc">
              Fasilitasi para tamu yang ingin mengirimkan kado pernikahan atau
              tanda kasih secara digital (transfer bank/e-wallet).
            </p>

            {/* Bank Accounts */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  💳 Rekening Amplop Digital
                </span>
                <button
                  type="button"
                  style={{
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    color: '#a5b4fc',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      gift: {
                        ...prev.gift,
                        bankAccounts: [
                          ...prev.gift.bankAccounts,
                          {
                            id: `account-${Date.now()}`,
                            bank: 'BCA',
                            number: '',
                            owner: prev.couple.groom.callName || '',
                          },
                        ],
                      },
                    }))
                  }
                >
                  + Tambah Rekening Lain
                </button>
              </div>

              {formData.gift.bankAccounts.map((account, idx) => (
                <div
                  key={
                    account.id || `account-${account.bank}-${account.number}`
                  }
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '14px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="onboard-grid">
                    <div className="onboard-form-group">
                      <label className="onboard-label">
                        Nama Bank / E-Wallet
                      </label>
                      <select
                        className="onboard-select"
                        value={account.bank}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.gift.bankAccounts];
                            updated[idx].bank = val;
                            return {
                              ...prev,
                              gift: {
                                ...prev.gift,
                                bankAccounts: updated,
                              },
                            };
                          });
                        }}
                      >
                        {POPULAR_BANKS.map((b) => (
                          <option
                            key={b}
                            value={b}
                            style={{ background: '#1a1d24', color: '#fff' }}
                          >
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="onboard-form-group">
                      <label className="onboard-label">Nomor Rekening</label>
                      <input
                        type="text"
                        className="onboard-input"
                        placeholder="Contoh: 1234567890"
                        value={account.number}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.gift.bankAccounts];
                            updated[idx].number = val;
                            return {
                              ...prev,
                              gift: {
                                ...prev.gift,
                                bankAccounts: updated,
                              },
                            };
                          });
                        }}
                      />
                    </div>

                    <div className="onboard-form-group">
                      <label className="onboard-label">
                        Atas Nama (Pemilik)
                      </label>
                      <input
                        type="text"
                        className="onboard-input"
                        placeholder="Nama lengkap pemilik rekening"
                        value={account.owner}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => {
                            const updated = [...prev.gift.bankAccounts];
                            updated[idx].owner = val;
                            return {
                              ...prev,
                              gift: {
                                ...prev.gift,
                                bankAccounts: updated,
                              },
                            };
                          });
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingBottom: '18px',
                      }}
                    >
                      {formData.gift.bankAccounts.length > 1 && (
                        <button
                          type="button"
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#ef4444',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.82rem',
                          }}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              gift: {
                                ...prev.gift,
                                bankAccounts: prev.gift.bankAccounts.filter(
                                  (_, i) => i !== idx,
                                ),
                              },
                            }))
                          }
                        >
                          Hapus Rekening
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Music Selection */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  🎵 Musik Latar Undangan
                </span>
              </div>
              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">Judul Lagu Favorit</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: Sampai Menutup Mata - Mahalini"
                    value={formData.gift.musicTitle || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        gift: { ...prev.gift, musicTitle: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="onboard-form-group">
                  <label className="onboard-label">
                    Upload File Musik (.mp3)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="onboard-input"
                      placeholder="/music/sample.mp3"
                      value={formData.gift.audioUrl || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          gift: { ...prev.gift, audioUrl: e.target.value },
                        }))
                      }
                    />
                    <label
                      className="onboard-upload-btn"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <span>
                        {uploadingField === 'music' ? 'Upload…' : 'Pilih MP3'}
                      </span>
                      <input
                        type="file"
                        accept="audio/*"
                        style={{ display: 'none' }}
                        disabled={uploadingField === 'music'}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleUpload(f, 'music', (url) =>
                              setFormData((prev) => ({
                                ...prev,
                                gift: { ...prev.gift, audioUrl: url },
                              })),
                            );
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
              STEP 5: PENUTUP & KONFIRMASI
             ======================================================== */}
        {currentStep === 5 && (
          <div>
            <h2 className="onboard-section-title">
              <span>✨</span> Kutipan &amp; Konfirmasi Data
            </h2>
            <p className="onboard-section-desc">
              Pilih kutipan ayat suci atau kata mutiara favorit, lalu tinjau
              kelengkapan data sebelum mengirimkannya.
            </p>

            {/* Quote Preset */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  📖 Kutipan Ayat / Kata Mutiara
                </span>
              </div>

              <div className="onboard-form-group">
                <label className="onboard-label">Pilihan Preset Populer</label>
                <select
                  className="onboard-select"
                  onChange={(e) => {
                    const selected = PRESET_QUOTES.find(
                      (q) => q.source === e.target.value,
                    );
                    if (selected) {
                      setFormData((prev) => ({
                        ...prev,
                        closing: {
                          ...prev.closing,
                          quote: selected.text,
                          quoteSource: selected.source,
                        },
                      }));
                    }
                  }}
                >
                  <option value="">-- Pilih Kutipan Cepat --</option>
                  {PRESET_QUOTES.map((q) => (
                    <option
                      key={q.source}
                      value={q.source}
                      style={{ background: '#1a1d24', color: '#fff' }}
                    >
                      {q.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="onboard-grid">
                <div className="onboard-form-group">
                  <label className="onboard-label">Sumber Kutipan</label>
                  <input
                    type="text"
                    className="onboard-input"
                    placeholder="Contoh: QS. AR-RUM : 21"
                    value={formData.closing.quoteSource}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        closing: {
                          ...prev.closing,
                          quoteSource: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="onboard-form-group full-width">
                  <label className="onboard-label">Teks Kutipan</label>
                  <textarea
                    className="onboard-textarea"
                    rows={3}
                    value={formData.closing.quote}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        closing: { ...prev.closing, quote: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="onboard-subcard">
              <div className="onboard-subcard-header">
                <span className="onboard-subcard-title">
                  ✍️ Pesan Penutup &amp; Ucapan Terima Kasih
                </span>
              </div>
              <div className="onboard-form-group full-width">
                <textarea
                  className="onboard-textarea"
                  rows={3}
                  placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir..."
                  value={formData.closing.closingMessage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      closing: {
                        ...prev.closing,
                        closingMessage: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            {/* Summary Checklist */}
            <div
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '14px',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#10b981',
                  margin: '0 0 10px',
                }}
              >
                ✓ Ringkasan Pengisian:
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: '0.86rem',
                  color: '#cbd5e1',
                  lineHeight: 1.7,
                }}
              >
                <li>
                  Mempelai:{' '}
                  <strong>
                    {formData.couple.groom.fullName || '-'} &amp;{' '}
                    {formData.couple.bride.fullName || '-'}
                  </strong>
                </li>
                <li>
                  Akad Nikah:{' '}
                  <strong>
                    {formData.events.akad.date || 'Belum diisi'} (
                    {formData.events.akad.venueName || '-'})
                  </strong>
                </li>
                <li>
                  Resepsi:{' '}
                  <strong>
                    {formData.events.resepsi.date || 'Belum diisi'} (
                    {formData.events.resepsi.venueName || '-'})
                  </strong>
                </li>
                <li>
                  Galeri:{' '}
                  <strong>{formData.story.galleryPhotos.length} Foto</strong>{' '}
                  terunggah
                </li>
                <li>
                  Amplop Digital:{' '}
                  <strong>{formData.gift.bankAccounts.length} Rekening</strong>{' '}
                  terdaftar
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="onboard-nav-bar">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                className="onboard-btn onboard-btn-secondary"
                onClick={prevStep}
              >
                ← Sebelumnya
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="onboard-btn onboard-btn-save"
              disabled={saving}
              onClick={() => handleSave(false)}
            >
              {saving ? 'Menyimpan…' : '💾 Simpan Draf'}
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                className="onboard-btn onboard-btn-primary"
                onClick={nextStep}
              >
                Lanjut →
              </button>
            ) : (
              <button
                type="button"
                className="onboard-btn onboard-btn-primary"
                style={{
                  background: '#10b981',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                }}
                disabled={saving}
                onClick={() => handleSave(true)}
              >
                {saving ? 'Mengirim Data…' : '🚀 Kirim Formulir ke Admin'}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );

  if (isEmbedded) {
    return formContent;
  }

  return (
    <div className="onboard-page">
      <div className="onboard-container">{formContent}</div>
    </div>
  );
};
