'use client';

import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const CountdownEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <div className="admin-card">
      <h3 className="admin-card__title">
        ⏱️ Target Waktu Hitung Mundur (Countdown)
      </h3>
      <div className="admin-form-group">
        <label className="admin-label">Judul Hitung Mundur</label>
        <input
          type="text"
          className="admin-input"
          value={config.countdown?.title || ''}
          onChange={(e) =>
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    countdown: {
                      ...prev.countdown,
                      title: e.target.value,
                    },
                  }
                : null,
            )
          }
        />
      </div>

      <div className="admin-form-group">
        <label className="admin-label">
          Target Tanggal & Jam (Format ISO / Picker)
        </label>
        <input
          type="datetime-local"
          className="admin-input"
          value={
            config.countdown?.targetDate
              ? config.countdown.targetDate.slice(0, 16)
              : ''
          }
          onChange={(e) =>
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    countdown: {
                      ...prev.countdown,
                      targetDate: `${e.target.value}:00+07:00`,
                    },
                  }
                : null,
            )
          }
        />
        <span className="admin-hint">
          Target saat ini: {config.countdown?.targetDate}
        </span>
      </div>
    </div>
  );
};
