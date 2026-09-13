'use client';

import type React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingGalleryItem } from '@/types/wedding';

export const GalleryEditorTab: React.FC = () => {
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
        showToast('success', `Foto galeri ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto galeri');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload foto galeri');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">
            🖼️ Galeri Foto Sinematik
          </h3>
          <span className="admin-card__desc">
            Koleksi potret prewedding, akad, dan resepsi dengan rasio
            portrait atau landscape.
          </span>
        </div>
        <label className="admin-btn admin-btn--secondary">
          <CloudUploadIcon fontSize="small" /> Tambah Foto Galeri
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) =>
              handleFileUpload(e, (url) => {
                const newItem: WeddingGalleryItem = {
                  id: `photo_${Date.now()}`,
                  src: url,
                  title: 'New Moment',
                  category: 'prewedding',
                  tag: 'Cinematic Shot',
                  aspect: 'portrait',
                };
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        gallery: [
                          ...(prev.gallery || []),
                          newItem,
                        ],
                      }
                    : null,
                );
              })
            }
          />
        </label>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {config.gallery?.map((photo, index) => (
          <div
            key={photo.id || index}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              overflow: 'hidden',
            }}
          >
            <img
              src={photo.src}
              alt={photo.title}
              style={{
                width: '100%',
                height: '140px',
                objectFit: 'cover',
              }}
            />
            <div style={{ padding: '0.75rem' }}>
              <input
                type="text"
                className="admin-input"
                style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }}
                value={photo.title}
                placeholder="Judul Foto"
                onChange={(e) => {
                  const updated = [...config.gallery];
                  updated[index].title = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, gallery: updated } : null,
                  );
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <select
                  className="admin-select"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.4rem',
                    width: 'auto',
                  }}
                  value={photo.aspect}
                  onChange={(e) => {
                    const updated = [...config.gallery];
                    updated[index].aspect = e.target.value as
                      | 'portrait'
                      | 'landscape'
                      | 'square';
                    setConfig((prev) =>
                      prev ? { ...prev, gallery: updated } : null,
                    );
                  }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="square">Square</option>
                </select>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  onClick={() => {
                    setConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            gallery: prev.gallery.filter(
                              (_, i) => i !== index,
                            ),
                          }
                        : null,
                    );
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
