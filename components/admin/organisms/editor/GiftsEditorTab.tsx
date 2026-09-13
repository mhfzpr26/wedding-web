'use client';

import type React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingBankAccount } from '@/types/wedding';

export const GiftsEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">
            🎁 Rekening Bank & Dompet Digital
          </h3>
          <span className="admin-card__desc">
            Nomor rekening bank atau e-wallet untuk amplop digital tamu undangan.
          </span>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={() => {
            const newGift: WeddingBankAccount = {
              id: `bank_${Date.now()}`,
              bank: 'BCA',
              number: '0000000000',
              owner: 'Nama Pemilik Rekening',
            };
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    gifts: [...(prev.gifts || []), newGift],
                  }
                : null,
            );
          }}
        >
          <AddIcon fontSize="small" /> Tambah Rekening
        </button>
      </div>

      <div className="admin-grid-2">
        {config.gifts?.map((bank, index) => (
          <div
            key={bank.id || index}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                Rekening #{index + 1}
              </span>
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => {
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          gifts: prev.gifts.filter((_, i) => i !== index),
                        }
                      : null,
                  );
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </button>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nama Bank / E-Wallet</label>
              <input
                type="text"
                className="admin-input"
                value={bank.bank}
                onChange={(e) => {
                  const updated = [...config.gifts];
                  updated[index].bank = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, gifts: updated } : null,
                  );
                }}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Nomor Rekening</label>
              <input
                type="text"
                className="admin-input"
                value={bank.number}
                onChange={(e) => {
                  const updated = [...config.gifts];
                  updated[index].number = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, gifts: updated } : null,
                  );
                }}
              />
            </div>
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Atas Nama Pemilik</label>
              <input
                type="text"
                className="admin-input"
                value={bank.owner}
                onChange={(e) => {
                  const updated = [...config.gifts];
                  updated[index].owner = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, gifts: updated } : null,
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
