'use client';

import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const ClosingEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <div className="admin-card">
      <h3 className="admin-card__title">
        🎬 Closing Section & End Credits Roll
      </h3>
      <div className="admin-grid-2">
        <div className="admin-form-group">
          <label className="admin-label">Judul Penutup</label>
          <input
            type="text"
            className="admin-input"
            value={config.closing?.title || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      closing: {
                        ...prev.closing,
                        title: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Badge Penutup</label>
          <input
            type="text"
            className="admin-input"
            value={config.closing?.badge || ''}
            onChange={(e) =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      closing: {
                        ...prev.closing,
                        badge: e.target.value,
                      },
                    }
                  : null,
              )
            }
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Pesan Doa & Terima Kasih</label>
        <textarea
          className="admin-textarea"
          rows={3}
          value={config.closing?.message || ''}
          onChange={(e) =>
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    closing: {
                      ...prev.closing,
                      message: e.target.value,
                    },
                  }
                : null,
            )
          }
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">Teks Hak Cipta (Copyright)</label>
        <input
          type="text"
          className="admin-input"
          value={config.closing?.copyright || ''}
          onChange={(e) =>
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    closing: {
                      ...prev.closing,
                      copyright: e.target.value,
                    },
                  }
                : null,
            )
          }
        />
      </div>
    </div>
  );
};
