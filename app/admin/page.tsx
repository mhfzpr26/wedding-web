'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import './admin.css';
import type {
  WeddingConfig,
  WeddingEventItem,
  WeddingGalleryItem,
  WeddingTimelineItem,
  WeddingBankAccount,
} from '@/types/wedding';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import type { RsvpRecord } from '@/types/rsvp';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TimerIcon from '@mui/icons-material/Timer';
import CollectionsIcon from '@mui/icons-material/Collections';
import TimelineIcon from '@mui/icons-material/Timeline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type AdminTab =
  | 'template'
  | 'couple'
  | 'events'
  | 'media'
  | 'cover'
  | 'countdown'
  | 'gallery'
  | 'story'
  | 'gifts'
  | 'closing'
  | 'rsvps';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('template');
  const [config, setConfig] = useState<WeddingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // RSVP Data state
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [rsvpStats, setRsvpStats] = useState<{
    totalResponses: number;
    attendingCount: number;
    notAttendingCount: number;
    totalGuests: number;
  }>({
    totalResponses: 0,
    attendingCount: 0,
    notAttendingCount: 0,
    totalGuests: 0,
  });

  const showToast = useCallback(
    (type: 'success' | 'error', message: string) => {
      setToast({ type, message });
      setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    [],
  );

  // Fetch initial config & RSVPs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, rsvpRes] = await Promise.all([
          fetch('/api/admin/config'),
          fetch('/api/admin/rsvps'),
        ]);

        if (configRes.ok) {
          const cfg = await configRes.json();
          setConfig(cfg);
        } else {
          showToast('error', 'Gagal memuat konfigurasi dari server');
        }

        if (rsvpRes.ok) {
          const rsvpData = await rsvpRes.json();
          setRsvps(rsvpData.records || []);
          setRsvpStats(
            rsvpData.stats || {
              totalResponses: 0,
              attendingCount: 0,
              notAttendingCount: 0,
              totalGuests: 0,
            },
          );
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
        showToast('error', 'Koneksi ke server bermasalah');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Save changes
  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        showToast('success', 'Perubahan berhasil disimpan dan langsung aktif!');
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      console.error('Error saving config:', err);
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (
      !window.confirm(
        'Apakah Anda yakin ingin mengembalikan seluruh data ke pengaturan bawaan (default)?',
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/config', { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        showToast('success', 'Konfigurasi berhasil direset ke default');
      } else {
        showToast('error', 'Gagal mereset konfigurasi');
      }
    } catch {
      showToast('error', 'Gagal mereset konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  // Upload file helper
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    fieldKey: string,
  ) => {
    setUploading(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
        showToast('success', 'File berhasil diunggah');
      } else {
        showToast('error', 'Gagal mengunggah file');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      showToast('error', 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(null);
    }
  };

  if (loading || !config) {
    return (
      <div
        className="admin-layout"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/netflix-logo.svg"
            alt="Loading"
            style={{ width: 140, marginBottom: '1.5rem', opacity: 0.8 }}
          />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            Memuat Dashboard CMS Wedding...
          </h2>
          <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem' }}>
            Menghubungkan ke sistem konfigurasi dinamis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sticky Top Header */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/netflix-logo.svg"
              alt="Netflix Wedding CMS"
              className="admin-header__logo"
            />
            <span className="admin-header__badge">CMS STUDIO</span>
          </div>

          <div className="admin-header__actions">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--secondary"
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
              <span>Lihat Website</span>
            </Link>

            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={handleReset}
              disabled={saving}
              title="Reset ke pengaturan default"
            >
              <RestartAltIcon sx={{ fontSize: 18 }} />
              <span>Reset Default</span>
            </button>

            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              <SaveIcon sx={{ fontSize: 18 }} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <nav className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'template' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('template')}
          >
            <PaletteIcon sx={{ fontSize: 18 }} />
            <span>Pilihan Template</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'couple' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('couple')}
          >
            <PeopleIcon sx={{ fontSize: 18 }} />
            <span>Data Mempelai</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'events' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('events')}
          >
            <EventIcon sx={{ fontSize: 18 }} />
            <span>Acara &amp; Episodes</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'media' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('media')}
          >
            <MusicNoteIcon sx={{ fontSize: 18 }} />
            <span>Musik &amp; Video</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'cover' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('cover')}
          >
            <MovieIcon sx={{ fontSize: 18 }} />
            <span>Cover &amp; Hero</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'countdown' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('countdown')}
          >
            <TimerIcon sx={{ fontSize: 18 }} />
            <span>Countdown</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'gallery' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('gallery')}
          >
            <CollectionsIcon sx={{ fontSize: 18 }} />
            <span>Galeri Foto</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'story' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('story')}
          >
            <TimelineIcon sx={{ fontSize: 18 }} />
            <span>Love Story</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'gifts' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('gifts')}
          >
            <CardGiftcardIcon sx={{ fontSize: 18 }} />
            <span>Hadiah Digital</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'closing' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('closing')}
          >
            <DashboardIcon sx={{ fontSize: 18 }} />
            <span>Closing &amp; Credits</span>
          </button>

          <button
            type="button"
            className={`admin-tab-btn ${
              activeTab === 'rsvps' ? 'admin-tab-btn--active' : ''
            }`}
            onClick={() => setActiveTab('rsvps')}
          >
            <AssignmentTurnedInIcon sx={{ fontSize: 18 }} />
            <span>Monitor RSVP</span>
          </button>
        </nav>
      </div>

      {/* Main Tab Content */}
      <main className="admin-main">
        {/* ==================== TAB 1: TEMPLATE SELECTOR ==================== */}
        {activeTab === 'template' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <PaletteIcon sx={{ color: 'var(--admin-red)' }} />
                Pilihan Template Undangan
              </h2>
              <p className="admin-section-header__desc">
                Pilih tampilan desain tema website undangan pernikahan Anda.
                Setiap template mengonsumsi data yang sama dari CMS ini secara
                otomatis.
              </p>
            </div>

            <div className="admin-grid-3">
              {AVAILABLE_TEMPLATES.map((tmpl) => {
                const isActive = config.templateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    className={`admin-template-card ${
                      isActive ? 'admin-template-card--active' : ''
                    }`}
                    onClick={() => {
                      if (tmpl.available) {
                        setConfig({ ...config, templateId: tmpl.id });
                        showToast(
                          'success',
                          `Template diubah ke: ${tmpl.name}`,
                        );
                      } else {
                        showToast(
                          'error',
                          `${tmpl.name} akan segera hadir di pembaruan berikutnya!`,
                        );
                      }
                    }}
                  >
                    <div className="admin-template-card__thumb-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.name}
                        className="admin-template-card__thumb"
                      />
                      <span className="admin-template-card__badge">
                        {tmpl.badge}
                      </span>
                    </div>

                    <div className="admin-template-card__body">
                      <div>
                        <h3 className="admin-template-card__title">
                          {tmpl.name}
                        </h3>
                        <p className="admin-template-card__desc">
                          {tmpl.description}
                        </p>
                      </div>

                      <div>
                        {isActive ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              color: '#22c55e',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                            <span>TEMPLATE AKTIF</span>
                          </div>
                        ) : tmpl.available ? (
                          <button
                            type="button"
                            className="admin-btn admin-btn--secondary admin-btn--sm"
                            style={{ width: '100%' }}
                          >
                            Aktifkan Template
                          </button>
                        ) : (
                          <span
                            style={{
                              color: 'var(--admin-text-muted)',
                              fontSize: '0.8rem',
                              fontStyle: 'italic',
                            }}
                          >
                            Segera Tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: MEMPELAI ==================== */}
        {activeTab === 'couple' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <PeopleIcon sx={{ color: 'var(--admin-red)' }} />
                Data Mempelai (Lead Cast)
              </h2>
              <p className="admin-section-header__desc">
                Kelola profil pengantin wanita dan pria, orang tua, bio, akun
                sosial media, dan foto profil.
              </p>
            </div>

            <div className="admin-grid-2">
              {/* Bride Card */}
              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>👰 Mempelai Wanita (The Bride)</span>
                  <span
                    className="admin-header__badge"
                    style={{ fontSize: '0.7rem' }}
                  >
                    LEAD ACTRESS
                  </span>
                </h3>

                {/* Photo uploader */}
                <div className="admin-form-group">
                  <span className="admin-label">Foto Profil Pengantin Wanita</span>
                  <div className="admin-uploader">
                    <div className="admin-uploader__preview-box admin-uploader__preview-box--avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.couple.bride.photo || '/images/destia.jpg'}
                        alt={config.couple.bride.name}
                        className="admin-uploader__preview-img"
                      />
                    </div>
                    <div className="admin-uploader__btn-row">
                      <label className="admin-btn admin-btn--secondary admin-btn--sm">
                        <CloudUploadIcon sx={{ fontSize: 16 }} />
                        <span>
                          {uploading === 'bridePhoto'
                            ? 'Mengunggah...'
                            : 'Upload Foto Baru'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="admin-uploader__file-input"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(
                                f,
                                (url) => {
                                  setConfig({
                                    ...config,
                                    couple: {
                                      ...config.couple,
                                      bride: {
                                        ...config.couple.bride,
                                        photo: url,
                                      },
                                    },
                                  });
                                },
                                'bridePhoto',
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Lengkap</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.name}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Panggilan</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.callname}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            callname: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Tagline Peran / Cast</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.characterRole || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            characterRole: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Bio / Deskripsi Singkat</span>
                  <textarea
                    className="admin-textarea"
                    value={config.couple.bride.bio || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            bio: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Ibu Kandung</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.parents.mother}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            parents: {
                              ...config.couple.bride.parents,
                              mother: e.target.value,
                            },
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Ayah Kandung</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.parents.father}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            parents: {
                              ...config.couple.bride.parents,
                              father: e.target.value,
                            },
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Username Instagram (tanpa @)</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.bride.instagram || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          bride: {
                            ...config.couple.bride,
                            instagram: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Groom Card */}
              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>🤵 Mempelai Pria (The Groom)</span>
                  <span
                    className="admin-header__badge"
                    style={{ fontSize: '0.7rem' }}
                  >
                    LEAD ACTOR
                  </span>
                </h3>

                {/* Photo uploader */}
                <div className="admin-form-group">
                  <span className="admin-label">Foto Profil Pengantin Pria</span>
                  <div className="admin-uploader">
                    <div className="admin-uploader__preview-box admin-uploader__preview-box--avatar">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.couple.groom.photo || '/images/rakafansa.jpg'}
                        alt={config.couple.groom.name}
                        className="admin-uploader__preview-img"
                      />
                    </div>
                    <div className="admin-uploader__btn-row">
                      <label className="admin-btn admin-btn--secondary admin-btn--sm">
                        <CloudUploadIcon sx={{ fontSize: 16 }} />
                        <span>
                          {uploading === 'groomPhoto'
                            ? 'Mengunggah...'
                            : 'Upload Foto Baru'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="admin-uploader__file-input"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(
                                f,
                                (url) => {
                                  setConfig({
                                    ...config,
                                    couple: {
                                      ...config.couple,
                                      groom: {
                                        ...config.couple.groom,
                                        photo: url,
                                      },
                                    },
                                  });
                                },
                                'groomPhoto',
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Lengkap</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.name}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            name: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Panggilan</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.callname}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            callname: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Tagline Peran / Cast</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.characterRole || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            characterRole: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Bio / Deskripsi Singkat</span>
                  <textarea
                    className="admin-textarea"
                    value={config.couple.groom.bio || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            bio: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Ibu Kandung</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.parents.mother}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            parents: {
                              ...config.couple.groom.parents,
                              mother: e.target.value,
                            },
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Nama Ayah Kandung</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.parents.father}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            parents: {
                              ...config.couple.groom.parents,
                              father: e.target.value,
                            },
                          },
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Username Instagram (tanpa @)</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.couple.groom.instagram || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        couple: {
                          ...config.couple,
                          groom: {
                            ...config.couple.groom,
                            instagram: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ACARA & EPISODES ==================== */}
        {activeTab === 'events' && (
          <div>
            <div className="admin-section-header">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h2 className="admin-section-header__title">
                    <EventIcon sx={{ color: 'var(--admin-red)' }} />
                    Daftar Acara Pernikahan (Episodes)
                  </h2>
                  <p className="admin-section-header__desc">
                    Atur jadwal Akad Nikah, Resepsi, atau acara tambahan
                    lainnya lengkap dengan alamat dan tautan Google Maps.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    const newEvent: WeddingEventItem = {
                      id: `event_${Date.now()}`,
                      type: 'ACARA TAMBAHAN',
                      episodeNumber: config.events.length + 1,
                      title: 'Acara Syukuran',
                      duration: '120 Menit',
                      synopsis: 'Deskripsi acara syukuran bersama keluarga.',
                      date: 'Minggu, 15 November 2026',
                      time: '10:00 - 12:00 WIB',
                      venue: 'Nama Tempat / Gedung',
                      address: 'Alamat lengkap tempat acara',
                      mapUrl: 'https://maps.google.com',
                      calendarUrl: '',
                    };
                    setConfig({
                      ...config,
                      events: [...config.events, newEvent],
                    });
                    showToast('success', 'Acara baru berhasil ditambahkan');
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Acara Baru</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {config.events.map((ev, idx) => (
                <div key={ev.id} className="admin-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid var(--admin-border)',
                      paddingBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: 'var(--admin-red)',
                        fontSize: '1rem',
                      }}
                    >
                      EPISODE {idx + 1}: {ev.type}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Hapus acara "${ev.title || ev.type}"?`,
                          )
                        ) {
                          const updated = config.events.filter(
                            (_, i) => i !== idx,
                          );
                          setConfig({ ...config, events: updated });
                          showToast('success', 'Acara dihapus');
                        }
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                      <span>Hapus Acara</span>
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <span className="admin-label">Kategori / Tipe Acara</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.type}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].type = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Judul Episode</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.title}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].title = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Hari &amp; Tanggal</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.date}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].date = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Waktu Pelaksanaan</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.time}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].time = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Nama Tempat / Venue</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.venue}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].venue = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Durasi Acara</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={ev.duration}
                        onChange={(e) => {
                          const updated = [...config.events];
                          updated[idx].duration = e.target.value;
                          setConfig({ ...config, events: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: '1rem' }}>
                    <span className="admin-label">Alamat Lengkap</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={ev.address}
                      onChange={(e) => {
                        const updated = [...config.events];
                        updated[idx].address = e.target.value;
                        setConfig({ ...config, events: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Tautan Google Maps</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={ev.mapUrl}
                      onChange={(e) => {
                        const updated = [...config.events];
                        updated[idx].mapUrl = e.target.value;
                        setConfig({ ...config, events: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Sinopsis Episode</span>
                    <textarea
                      className="admin-textarea"
                      value={ev.synopsis}
                      onChange={(e) => {
                        const updated = [...config.events];
                        updated[idx].synopsis = e.target.value;
                        setConfig({ ...config, events: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: MEDIA & MUSIK ==================== */}
        {activeTab === 'media' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <MusicNoteIcon sx={{ color: 'var(--admin-red)' }} />
                Pengaturan Musik Latar &amp; Video Trailer
              </h2>
              <p className="admin-section-header__desc">
                Upload lagu pernikahan (MP3) yang otomatis diputar saat tamu
                membuka undangan, serta kelola video trailer pernikahan.
              </p>
            </div>

            <div className="admin-grid-2">
              {/* Music Card */}
              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>🎵 Musik Latar (Background Music)</span>
                </h3>

                <div className="admin-form-group">
                  <span className="admin-label">Judul Lagu / Musik</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.music.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        music: { ...config.music, title: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">URL / File Audio</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={config.music.audioUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          music: { ...config.music, audioUrl: e.target.value },
                        })
                      }
                    />
                    <label className="admin-btn admin-btn--secondary" style={{ flexShrink: 0 }}>
                      <CloudUploadIcon sx={{ fontSize: 18 }} />
                      <span>{uploading === 'music' ? '...' : 'Upload MP3'}</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                setConfig({
                                  ...config,
                                  music: { ...config.music, audioUrl: url },
                                });
                              },
                              'music',
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="admin-help-text">
                    Format: MP3, WAV, atau OGG. Jika file belum diunggah, synthesizer nada bawaan tetap akan aktif secara otomatis.
                  </p>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Test Pemutar Musik</span>
                  <audio
                    src={config.music.audioUrl}
                    controls
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>
              </div>

              {/* Video Trailer Card */}
              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>🎬 Video Trailer Resmi</span>
                </h3>

                <div className="admin-form-group">
                  <span className="admin-label">Judul Teaser Film</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.trailer.filmTitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        trailer: {
                          ...config.trailer,
                          filmTitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Durasi Video</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.trailer.duration}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        trailer: {
                          ...config.trailer,
                          duration: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">URL / File Video (MP4)</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={config.trailer.videoUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          trailer: {
                            ...config.trailer,
                            videoUrl: e.target.value,
                          },
                        })
                      }
                    />
                    <label className="admin-btn admin-btn--secondary" style={{ flexShrink: 0 }}>
                      <CloudUploadIcon sx={{ fontSize: 18 }} />
                      <span>{uploading === 'trailer' ? '...' : 'Upload MP4'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                setConfig({
                                  ...config,
                                  trailer: {
                                    ...config.trailer,
                                    videoUrl: url,
                                  },
                                });
                              },
                              'trailer',
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Poster Thumbnail Video</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={config.trailer.posterUrl}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          trailer: {
                            ...config.trailer,
                            posterUrl: e.target.value,
                          },
                        })
                      }
                    />
                    <label className="admin-btn admin-btn--secondary" style={{ flexShrink: 0 }}>
                      <CloudUploadIcon sx={{ fontSize: 18 }} />
                      <span>{uploading === 'trailerPoster' ? '...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                setConfig({
                                  ...config,
                                  trailer: {
                                    ...config.trailer,
                                    posterUrl: url,
                                  },
                                });
                              },
                              'trailerPoster',
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: COVER & HERO ==================== */}
        {activeTab === 'cover' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <MovieIcon sx={{ color: 'var(--admin-red)' }} />
                Cover &amp; Hero Section
              </h2>
              <p className="admin-section-header__desc">
                Kustomisasi layar pembuka (VIP pass) dan poster hero utama
                lengkap dengan kutipan ayat suci Al-Qur&apos;an.
              </p>
            </div>

            <div className="admin-grid-2">
              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>🎬 Cover Depan (VIP Screen)</span>
                </h3>

                <div className="admin-form-group">
                  <span className="admin-label">Background Foto Cover</span>
                  <div className="admin-uploader">
                    <div className="admin-uploader__preview-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.cover.bgImage}
                        alt="Cover Preview"
                        className="admin-uploader__preview-img"
                      />
                    </div>
                    <label className="admin-btn admin-btn--secondary admin-btn--sm">
                      <CloudUploadIcon sx={{ fontSize: 16 }} />
                      <span>
                        {uploading === 'coverBg'
                          ? 'Mengunggah...'
                          : 'Ganti Foto Background Cover'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                setConfig({
                                  ...config,
                                  cover: { ...config.cover, bgImage: url },
                                });
                              },
                              'coverBg',
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Judul Utama Cover</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.cover.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cover: { ...config.cover, title: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Badge Series</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.cover.seriesBadge}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cover: {
                          ...config.cover,
                          seriesBadge: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Trending Rank Text</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.cover.trendingRank}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cover: {
                          ...config.cover,
                          trendingRank: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Sinopsis Romansa Cover</span>
                  <textarea
                    className="admin-textarea"
                    value={config.cover.synopsis}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cover: { ...config.cover, synopsis: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="admin-card">
                <h3 className="admin-card__title">
                  <span>📜 Opening Hero &amp; Ayat Suci</span>
                </h3>

                <div className="admin-form-group">
                  <span className="admin-label">Foto Poster Opening</span>
                  <div className="admin-uploader">
                    <div className="admin-uploader__preview-box">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.opening.posterImage}
                        alt="Opening Poster Preview"
                        className="admin-uploader__preview-img"
                      />
                    </div>
                    <label className="admin-btn admin-btn--secondary admin-btn--sm">
                      <CloudUploadIcon sx={{ fontSize: 16 }} />
                      <span>
                        {uploading === 'openingPoster'
                          ? 'Mengunggah...'
                          : 'Ganti Poster Hero'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                setConfig({
                                  ...config,
                                  opening: {
                                    ...config.opening,
                                    posterImage: url,
                                  },
                                });
                              },
                              'openingPoster',
                            );
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Headline Opening</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.opening.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        opening: { ...config.opening, title: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Sub-Headline Opening</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.opening.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        opening: {
                          ...config.opening,
                          subtitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Kutipan Ayat Suci Al-Qur&apos;an</span>
                  <textarea
                    className="admin-textarea"
                    value={config.opening.quote}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        opening: { ...config.opening, quote: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="admin-form-group">
                  <span className="admin-label">Referensi Surah</span>
                  <input
                    type="text"
                    className="admin-input"
                    value={config.opening.quoteSource}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        opening: {
                          ...config.opening,
                          quoteSource: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: COUNTDOWN ==================== */}
        {activeTab === 'countdown' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <TimerIcon sx={{ color: 'var(--admin-red)' }} />
                Target Hitung Mundur (Premiere Countdown)
              </h2>
              <p className="admin-section-header__desc">
                Tentukan tanggal dan jam hari bahagia. Timer akan menghitung
                mundur sisa hari, jam, menit, dan detik secara realtime.
              </p>
            </div>

            <div className="admin-card" style={{ maxWidth: 640 }}>
              <div className="admin-form-group">
                <span className="admin-label">Waktu Target Akad / Acara (ISO / Tanggal &amp; Jam)</span>
                <input
                  type="text"
                  className="admin-input"
                  value={config.countdown.targetDate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      countdown: {
                        ...config.countdown,
                        targetDate: e.target.value,
                      },
                    })
                  }
                />
                <p className="admin-help-text">
                  Contoh format: <code>2026-11-14T09:00:00+07:00</code> (Tahun-Bulan-HariTJam:Menit:Detik+ZonaWaktu)
                </p>
              </div>

              <div className="admin-form-group">
                <span className="admin-label">Link Google Calendar</span>
                <input
                  type="text"
                  className="admin-input"
                  value={config.countdown.calendarUrl || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      countdown: {
                        ...config.countdown,
                        calendarUrl: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: 'var(--admin-radius-sm)',
                  padding: '1.25rem',
                  marginTop: '1.5rem',
                  border: '1px solid var(--admin-border)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--admin-text-secondary)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  Status Target:
                </span>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    margin: '0.4rem 0 0',
                    color: '#ffffff',
                  }}
                >
                  {new Date(config.countdown.targetDate).toLocaleString(
                    'id-ID',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    },
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: GALERI FOTO ==================== */}
        {activeTab === 'gallery' && (
          <div>
            <div className="admin-section-header">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h2 className="admin-section-header__title">
                    <CollectionsIcon sx={{ color: 'var(--admin-red)' }} />
                    Koleksi Galeri Foto (Production Stills)
                  </h2>
                  <p className="admin-section-header__desc">
                    Kelola foto prewedding, potret mempelai, dan foto venue
                    lengkap dengan kategori dan rasio tampilan.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    const newPhoto: WeddingGalleryItem = {
                      id: `photo_${Date.now()}`,
                      src: '/images/gallery-1.jpg',
                      title: 'Momen Bahagia',
                      category: 'prewedding',
                      tag: 'Prewedding Snapshot',
                      aspect: 'landscape',
                    };
                    setConfig({
                      ...config,
                      gallery: [...config.gallery, newPhoto],
                    });
                    showToast('success', 'Foto baru ditambahkan ke galeri');
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Foto Baru</span>
                </button>
              </div>
            </div>

            <div className="admin-grid-3">
              {config.gallery.map((photo, idx) => (
                <div key={photo.id} className="admin-card">
                  <div
                    style={{
                      height: 180,
                      overflow: 'hidden',
                      borderRadius: 'var(--admin-radius-sm)',
                      marginBottom: '1rem',
                      background: '#000',
                      position: 'relative',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-btn admin-btn--secondary admin-btn--sm" style={{ width: '100%', marginBottom: '0.75rem' }}>
                      <CloudUploadIcon sx={{ fontSize: 16 }} />
                      <span>
                        {uploading === `photo_${idx}`
                          ? 'Mengunggah...'
                          : 'Ganti File Gambar'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="admin-uploader__file-input"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(
                              f,
                              (url) => {
                                const updated = [...config.gallery];
                                updated[idx].src = url;
                                setConfig({ ...config, gallery: updated });
                              },
                              `photo_${idx}`,
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Judul Foto</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={photo.title}
                      onChange={(e) => {
                        const updated = [...config.gallery];
                        updated[idx].title = e.target.value;
                        setConfig({ ...config, gallery: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Kategori</span>
                    <select
                      className="admin-select"
                      value={photo.category}
                      onChange={(e) => {
                        const updated = [...config.gallery];
                        updated[idx].category = e.target
                          .value as WeddingGalleryItem['category'];
                        setConfig({ ...config, gallery: updated });
                      }}
                    >
                      <option value="prewedding">Prewedding</option>
                      <option value="lead">Lead Cast (Mempelai)</option>
                      <option value="venue">Venue &amp; Gedung</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Tag / Lensa Kamera</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={photo.tag}
                      onChange={(e) => {
                        const updated = [...config.gallery];
                        updated[idx].tag = e.target.value;
                        setConfig({ ...config, gallery: updated });
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--sm"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => {
                      if (
                        window.confirm(`Hapus foto "${photo.title}" dari galeri?`)
                      ) {
                        const updated = config.gallery.filter(
                          (_, i) => i !== idx,
                        );
                        setConfig({ ...config, gallery: updated });
                        showToast('success', 'Foto dihapus');
                      }
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                    <span>Hapus Foto</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 8: LOVE STORY ==================== */}
        {activeTab === 'story' && (
          <div>
            <div className="admin-section-header">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h2 className="admin-section-header__title">
                    <TimelineIcon sx={{ color: 'var(--admin-red)' }} />
                    Linimasa Perjalanan Cinta (Love Story)
                  </h2>
                  <p className="admin-section-header__desc">
                    Bagikan kisah dan momen berharga perjalanan cinta Anda dari
                    awal bertemu hingga menuju pelaminan.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    const newItem: WeddingTimelineItem = {
                      year: '2025',
                      event: 'Momen Istimewa',
                      desc: 'Deskripsi perjalanan cerita indah kami bersama.',
                    };
                    setConfig({
                      ...config,
                      loveStory: [...config.loveStory, newItem],
                    });
                    showToast('success', 'Momen baru ditambahkan');
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Momen</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {config.loveStory.map((item, idx) => (
                <div key={`${item.year}-${item.event}`} className="admin-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: 'var(--admin-red)',
                        fontSize: '1.1rem',
                      }}
                    >
                      TAHUN: {item.year}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => {
                        const updated = config.loveStory.filter(
                          (_, i) => i !== idx,
                        );
                        setConfig({ ...config, loveStory: updated });
                        showToast('success', 'Momen dihapus');
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-form-group">
                      <span className="admin-label">Tahun</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.year}
                        onChange={(e) => {
                          const updated = [...config.loveStory];
                          updated[idx].year = e.target.value;
                          setConfig({ ...config, loveStory: updated });
                        }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <span className="admin-label">Judul Momen / Event</span>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.event}
                        onChange={(e) => {
                          const updated = [...config.loveStory];
                          updated[idx].event = e.target.value;
                          setConfig({ ...config, loveStory: updated });
                        }}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Deskripsi Cerita</span>
                    <textarea
                      className="admin-textarea"
                      value={item.desc}
                      onChange={(e) => {
                        const updated = [...config.loveStory];
                        updated[idx].desc = e.target.value;
                        setConfig({ ...config, loveStory: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 9: HADIAH DIGITAL ==================== */}
        {activeTab === 'gifts' && (
          <div>
            <div className="admin-section-header">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h2 className="admin-section-header__title">
                    <CardGiftcardIcon sx={{ color: 'var(--admin-red)' }} />
                    Rekening Hadiah Digital (Wedding Gift)
                  </h2>
                  <p className="admin-section-header__desc">
                    Kelola rekening bank atau dompet digital untuk para tamu yang
                    ingin mengirimkan tanda kasih secara digital.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    const newGift: WeddingBankAccount = {
                      id: `bank_${Date.now()}`,
                      bank: 'BCA',
                      number: '1234567890',
                      owner: 'Nama Pemilik Rekening',
                    };
                    setConfig({
                      ...config,
                      gifts: [...config.gifts, newGift],
                    });
                    showToast('success', 'Rekening baru ditambahkan');
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 18 }} />
                  <span>Tambah Rekening</span>
                </button>
              </div>
            </div>

            <div className="admin-grid-2">
              {config.gifts.map((gift, idx) => (
                <div key={gift.id} className="admin-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: 'var(--admin-red)',
                        fontSize: '1rem',
                      }}
                    >
                      {gift.bank}
                    </span>
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => {
                        const updated = config.gifts.filter(
                          (_, i) => i !== idx,
                        );
                        setConfig({ ...config, gifts: updated });
                        showToast('success', 'Rekening dihapus');
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16 }} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Nama Bank / E-Wallet</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={gift.bank}
                      onChange={(e) => {
                        const updated = [...config.gifts];
                        updated[idx].bank = e.target.value;
                        setConfig({ ...config, gifts: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Nomor Rekening</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={gift.number}
                      onChange={(e) => {
                        const updated = [...config.gifts];
                        updated[idx].number = e.target.value;
                        setConfig({ ...config, gifts: updated });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <span className="admin-label">Atas Nama Pemilik</span>
                    <input
                      type="text"
                      className="admin-input"
                      value={gift.owner}
                      onChange={(e) => {
                        const updated = [...config.gifts];
                        updated[idx].owner = e.target.value;
                        setConfig({ ...config, gifts: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 10: CLOSING & CREDITS ==================== */}
        {activeTab === 'closing' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <DashboardIcon sx={{ color: 'var(--admin-red)' }} />
                Closing &amp; End Credits Roll
              </h2>
              <p className="admin-section-header__desc">
                Atur pesan penutup, ucapan terima kasih keluarga besar, dan
                teks hak cipta sinematik di bagian akhir undangan.
              </p>
            </div>

            <div className="admin-card" style={{ maxWidth: 720 }}>
              <div className="admin-form-group">
                <span className="admin-label">Judul Penutup</span>
                <input
                  type="text"
                  className="admin-input"
                  value={config.closing.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      closing: { ...config.closing, title: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <span className="admin-label">Pesan Kehormatan / Terima Kasih</span>
                <textarea
                  className="admin-textarea"
                  value={config.closing.message}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      closing: { ...config.closing, message: e.target.value },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <span className="admin-label">Tanggal &amp; Lokasi Acara</span>
                <input
                  type="text"
                  className="admin-input"
                  value={config.closing.dateLocation}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      closing: {
                        ...config.closing,
                        dateLocation: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="admin-form-group">
                <span className="admin-label">Teks Copyright Sinematik</span>
                <input
                  type="text"
                  className="admin-input"
                  value={config.closing.copyright}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      closing: {
                        ...config.closing,
                        copyright: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 11: MONITOR RSVP ==================== */}
        {activeTab === 'rsvps' && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-header__title">
                <AssignmentTurnedInIcon sx={{ color: 'var(--admin-red)' }} />
                Monitor Konfirmasi Kehadiran (RSVP)
              </h2>
              <p className="admin-section-header__desc">
                Pantau daftar kehadiran para tamu secara langsung dari
                tanggapan formulir RSVP website.
              </p>
            </div>

            {/* Stats row */}
            <div className="admin-grid-3" style={{ marginBottom: '2rem' }}>
              <div className="admin-stat-card">
                <p className="admin-stat-card__number">
                  {rsvpStats.totalResponses}
                </p>
                <span className="admin-stat-card__label">Total Respon Masuk</span>
              </div>
              <div className="admin-stat-card">
                <p
                  className="admin-stat-card__number"
                  style={{ color: '#22c55e' }}
                >
                  {rsvpStats.attendingCount}
                </p>
                <span className="admin-stat-card__label">Konfirmasi Hadir</span>
              </div>
              <div className="admin-stat-card">
                <p
                  className="admin-stat-card__number"
                  style={{ color: 'var(--admin-red)' }}
                >
                  {rsvpStats.totalGuests}
                </p>
                <span className="admin-stat-card__label">Perkiraan Jumlah Tamu</span>
              </div>
            </div>

            {/* Responses table */}
            <div className="admin-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-secondary)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.75rem' }}>NAMA TAMU</th>
                    <th style={{ padding: '0.75rem' }}>KEHADIRAN</th>
                    <th style={{ padding: '0.75rem' }}>JUMLAH</th>
                    <th style={{ padding: '0.75rem' }}>CATATAN / PESAN</th>
                    <th style={{ padding: '0.75rem' }}>WAKTU SUBMIT</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        Belum ada konfirmasi kehadiran yang masuk.
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span
                            style={{
                              background: r.attendance === 'Hadir' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: r.attendance === 'Hadir' ? '#4ade80' : '#f87171',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {r.attendance}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{r.guestCount} orang</td>
                        <td style={{ padding: '0.75rem', color: 'var(--admin-text-secondary)' }}>{r.notes || '-'}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                          {new Date(r.submittedAt).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`admin-toast ${
            toast.type === 'success'
              ? 'admin-toast--success'
              : 'admin-toast--error'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircleIcon sx={{ fontSize: 20 }} />
          ) : (
            <span style={{ fontWeight: 800 }}>!</span>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
