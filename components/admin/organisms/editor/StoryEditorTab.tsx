'use client';

import type React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingTimelineItem } from '@/types/wedding';

export const StoryEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">
            📖 Linimasa Perjalanan Cinta (Love Story)
          </h3>
          <span className="admin-card__desc">
            Milestone perjalanan cinta dari perjumpaan awal hingga pelaminan.
          </span>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={() => {
            const newItem: WeddingTimelineItem = {
              year: new Date().getFullYear().toString(),
              event: 'Momen Istimewa Baru',
              desc: 'Cerita momen perjalanan cinta.',
            };
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    loveStory: [...(prev.loveStory || []), newItem],
                  }
                : null,
            );
          }}
        >
          <AddIcon fontSize="small" /> Tambah Momen
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {config.loveStory?.map((item, index) => (
          <div
            key={item.id || `${item.year}-${item.event}-${index}`}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              padding: '1rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <div style={{ width: '100px' }}>
              <label className="admin-label">Tahun</label>
              <input
                type="text"
                className="admin-input"
                value={item.year}
                onChange={(e) => {
                  const updated = [...config.loveStory];
                  updated[index].year = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, loveStory: updated } : null,
                  );
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="admin-label">Judul Momen</label>
              <input
                type="text"
                className="admin-input"
                style={{ marginBottom: '0.5rem' }}
                value={item.event}
                onChange={(e) => {
                  const updated = [...config.loveStory];
                  updated[index].event = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, loveStory: updated } : null,
                  );
                }}
              />
              <label className="admin-label">Cerita / Kisah</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={item.desc}
                onChange={(e) => {
                  const updated = [...config.loveStory];
                  updated[index].desc = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, loveStory: updated } : null,
                  );
                }}
              />
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              style={{ marginTop: '1.75rem' }}
              onClick={() => {
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        loveStory: prev.loveStory.filter((_, i) => i !== index),
                      }
                    : null,
                );
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
