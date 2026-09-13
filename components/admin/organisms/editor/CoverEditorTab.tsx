'use client';

import type React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAdminStore } from '@/stores/useAdminStore';

export const CoverEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        showToast('success', `Foto cover ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto cover');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload foto cover');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <h3 className="admin-card__title">
          🎬 Cover Hero (Layar Depan)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Judul Utama Undangan</label>
          <input
            type="text"
            className="admin-input"
            value={config.cover?.title || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      cover: {
                        ...prev.cover,
                        title: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-grid-3">
          <div className="admin-form-group">
            <label className="admin-label">Badge / Label Acara (Contoh: The Wedding)</label>
            <input
              type="text"
              className="admin-input"
              value={config.cover?.seriesBadge || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        cover: {
                          ...prev.cover,
                          seriesBadge: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Tahun Rilis</label>
            <input
              type="text"
              className="admin-input"
              value={config.cover?.year || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        cover: {
                          ...prev.cover,
                          year: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">Match %</label>
            <input
              type="text"
              className="admin-input"
              value={config.cover?.matchPercentage || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        cover: {
                          ...prev.cover,
                          matchPercentage: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Sinopsis Cover</label>
          <textarea
            className="admin-textarea"
            rows={3}
            value={config.cover?.synopsis || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      cover: {
                        ...prev.cover,
                        synopsis: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Background Poster Cover</label>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <label className="admin-btn admin-btn--secondary">
              <CloudUploadIcon fontSize="small" /> Upload Cover
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(e, (url) =>
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            cover: {
                              ...prev.cover,
                              bgImage: url,
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
              value={config.cover?.bgImage || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        cover: {
                          ...prev.cover,
                          bgImage: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title">
          📜 Opening & Ayat Suci (Quran)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Headline Opening</label>
          <input
            type="text"
            className="admin-input"
            value={config.opening?.title || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      opening: {
                        ...prev.opening,
                        title: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Subheadline Opening</label>
          <input
            type="text"
            className="admin-input"
            value={config.opening?.subtitle || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      opening: {
                        ...prev.opening,
                        subtitle: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Kutipan Ayat Suci</label>
          <textarea
            className="admin-textarea"
            rows={4}
            value={config.opening?.quote || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      opening: {
                        ...prev.opening,
                        quote: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Sumber Ayat (QS / Hadist)</label>
          <input
            type="text"
            className="admin-input"
            value={config.opening?.quoteSource || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      opening: {
                        ...prev.opening,
                        quoteSource: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
