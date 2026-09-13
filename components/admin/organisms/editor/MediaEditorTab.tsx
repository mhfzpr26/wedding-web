'use client';

import type React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAdminStore } from '@/stores/useAdminStore';

export const MediaEditorTab: React.FC = () => {
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
        showToast('success', `File ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah file');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload file');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-grid-2">
      <div className="admin-card">
        <h3 className="admin-card__title">
          🎵 Musik Latar (Background Song)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Judul Lagu</label>
          <input
            type="text"
            className="admin-input"
            value={config.music?.title || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      music: {
                        ...prev.music,
                        title: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">File Musik MP3</label>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <label className="admin-btn admin-btn--secondary">
              <CloudUploadIcon fontSize="small" />{' '}
              {uploading === 'audioFile' ? 'Mengunggah MP3...' : 'Upload MP3'}
              <input
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(e, 'audioFile', (url) =>
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            music: {
                              ...prev.music,
                              audioUrl: url,
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
              value={config.music?.audioUrl || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        music: {
                          ...prev.music,
                          audioUrl: e.target.value,
                        },
                      }
                    : null,
                )
              }
              placeholder="URL file MP3 atau upload di atas (cth: /uploads/music.mp3)"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label
            className="admin-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={config.music?.autoplay ?? false}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        music: {
                          ...prev.music,
                          autoplay: e.target.checked,
                        },
                      }
                    : null,
                )
              }
            />
            Putar otomatis setelah tamu menekan tombol buka undangan
          </label>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card__title">
          🎬 Video Trailer Teaser (Cinema)
        </h3>
        <div className="admin-form-group">
          <label className="admin-label">Judul Video Film</label>
          <input
            type="text"
            className="admin-input"
            value={config.trailer?.filmTitle || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      trailer: {
                        ...prev.trailer,
                        filmTitle: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">URL Video File (MP4/WebM)</label>
          <input
            type="text"
            className="admin-input"
            value={config.trailer?.videoUrl || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      trailer: {
                        ...prev.trailer,
                        videoUrl: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Poster Thumbnail Video</label>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <label className="admin-btn admin-btn--secondary">
              <CloudUploadIcon fontSize="small" /> Upload Poster
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) =>
                  handleFileUpload(e, 'trailerPoster', (url) =>
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            trailer: {
                              ...prev.trailer,
                              posterUrl: url,
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
              value={config.trailer?.posterUrl || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        trailer: {
                          ...prev.trailer,
                          posterUrl: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Badge Durasi Video</label>
          <input
            type="text"
            className="admin-input"
            value={config.trailer?.duration || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      trailer: {
                        ...prev.trailer,
                        duration: e.target.value,
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
