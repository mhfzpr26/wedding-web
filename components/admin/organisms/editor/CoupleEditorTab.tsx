'use client';

import type React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAdminStore } from '@/stores/useAdminStore';

export const CoupleEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const uploading = useAdminStore((s) => s.uploading);
  const setUploading = useAdminStore((s) => s.setUploading);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        showToast('success', `Foto ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-grid-2">
      {/* Mempelai Wanita */}
      <div className="admin-card">
        <h3 className="admin-card__title" style={{ color: '#ff758f' }}>
          👰 Mempelai Wanita (The Bride)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Nama Lengkap & Gelar</label>
          <input
            type="text"
            className="admin-input"
            value={config.couple.bride.name}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        bride: {
                          ...prev.couple.bride,
                          name: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Nama Panggilan</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.bride.callname}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            callname: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Akun Instagram</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.bride.instagram || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            instagram: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">
            Peran / Panggilan Khusus (Contoh: The Bride / Putri Pertama)
          </label>
          <input
            type="text"
            className="admin-input"
            value={config.couple.bride.characterRole || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        bride: {
                          ...prev.couple.bride,
                          characterRole: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Bio Singkat</label>
          <textarea
            className="admin-textarea"
            rows={3}
            value={config.couple.bride.bio || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        bride: {
                          ...prev.couple.bride,
                          bio: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Nama Ayah</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.bride.parents.father}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            parents: {
                              ...prev.couple.bride.parents,
                              father: e.target.value,
                            },
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Nama Ibu</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.bride.parents.mother}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            parents: {
                              ...prev.couple.bride.parents,
                              mother: e.target.value,
                            },
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Foto Mempelai Wanita</label>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {config.couple.bride.photo && (
              <img
                src={config.couple.bride.photo}
                alt="Bride"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--admin-primary)',
                }}
              />
            )}
            <label className="admin-btn admin-btn--secondary">
              <CloudUploadIcon fontSize="small" />{' '}
              {uploading === 'bridePhoto' ? 'Mengunggah...' : 'Upload Foto'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(e, 'bridePhoto', (url) =>
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            couple: {
                              ...prev.couple,
                              bride: {
                                ...prev.couple.bride,
                                photo: url,
                              },
                            },
                          }
                        : null,
                    ),
                  )
                }
              />
            </label>
            <input
              type="text"
              className="admin-input"
              style={{ flex: 1 }}
              value={config.couple.bride.photo || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          bride: {
                            ...prev.couple.bride,
                            photo: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
              placeholder="atau masukkan URL foto..."
            />
          </div>
        </div>
      </div>

      {/* Mempelai Pria */}
      <div className="admin-card">
        <h3 className="admin-card__title" style={{ color: '#60a5fa' }}>
          🤵 Mempelai Pria (The Groom)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Nama Lengkap & Gelar</label>
          <input
            type="text"
            className="admin-input"
            value={config.couple.groom.name}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        groom: {
                          ...prev.couple.groom,
                          name: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Nama Panggilan</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.groom.callname}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            callname: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Akun Instagram</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.groom.instagram || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            instagram: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">
            Peran / Panggilan Khusus (Contoh: The Groom / Putra Pertama)
          </label>
          <input
            type="text"
            className="admin-input"
            value={config.couple.groom.characterRole || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        groom: {
                          ...prev.couple.groom,
                          characterRole: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Bio Singkat</label>
          <textarea
            className="admin-textarea"
            rows={3}
            value={config.couple.groom.bio || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      couple: {
                        ...prev.couple,
                        groom: {
                          ...prev.couple.groom,
                          bio: e.target.value,
                        },
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-grid-2">
          <div className="admin-form-group">
            <label className="admin-label">Nama Ayah</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.groom.parents.father}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            parents: {
                              ...prev.couple.groom.parents,
                              father: e.target.value,
                            },
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Nama Ibu</label>
            <input
              type="text"
              className="admin-input"
              value={config.couple.groom.parents.mother}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            parents: {
                              ...prev.couple.groom.parents,
                              mother: e.target.value,
                            },
                          },
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Foto Mempelai Pria</label>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {config.couple.groom.photo && (
              <img
                src={config.couple.groom.photo}
                alt="Groom"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--admin-primary)',
                }}
              />
            )}
            <label className="admin-btn admin-btn--secondary">
              <CloudUploadIcon fontSize="small" />{' '}
              {uploading === 'groomPhoto' ? 'Mengunggah...' : 'Upload Foto'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(e, 'groomPhoto', (url) =>
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            couple: {
                              ...prev.couple,
                              groom: {
                                ...prev.couple.groom,
                                photo: url,
                              },
                            },
                          }
                        : null,
                    ),
                  )
                }
              />
            </label>
            <input
              type="text"
              className="admin-input"
              style={{ flex: 1 }}
              value={config.couple.groom.photo || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        couple: {
                          ...prev.couple,
                          groom: {
                            ...prev.couple.groom,
                            photo: e.target.value,
                          },
                        },
                      }
                    : null,
                )
              }
              placeholder="atau masukkan URL foto..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
