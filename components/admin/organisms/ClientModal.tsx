'use client';

import type React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAdminStore } from '@/stores/useAdminStore';

export const ClientModal: React.FC = () => {
  const showClientModal = useAdminStore((s) => s.showClientModal);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const clientForm = useAdminStore((s) => s.clientForm);
  const setClientForm = useAdminStore((s) => s.setClientForm);
  const showToast = useAdminStore((s) => s.showToast);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);

  if (!showClientModal) return null;

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name.trim() || !clientForm.phone.trim()) {
      showToast('error', 'Nama dan nomor telepon wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const isEdit = Boolean(clientForm.id);
      const url = isEdit
        ? `/api/admin/saas/clients/${clientForm.id}`
        : '/api/admin/saas/clients';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm),
      });

      if (res.ok) {
        showToast(
          'success',
          isEdit ? 'Data client berhasil diperbarui' : 'Client baru berhasil ditambahkan',
        );
        setShowClientModal(false);
        await refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menyimpan data client');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan client');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">
            {clientForm.id ? 'Edit Data Client' : 'Tambah Client Baru'}
          </h3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={() => setShowClientModal(false)}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSaveClient}>
          <div className="admin-modal__body">
            <div className="admin-form-group">
              <label className="admin-label">Nama Client / Pasangan *</label>
              <input
                type="text"
                className="admin-input"
                required
                placeholder="e.g. Destia & Rakafansa"
                value={clientForm.name}
                onChange={(e) =>
                  setClientForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Nomor WhatsApp *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="081234567890"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Email (Opsional)</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="email@example.com"
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Paket Langganan</label>
                <select
                  className="admin-select"
                  value={clientForm.package}
                  onChange={(e) =>
                    setClientForm((prev) => ({
                      ...prev,
                      package: e.target.value,
                    }))
                  }
                >
                  <option value="Cinematic VIP">Cinematic VIP (Netflix)</option>
                  <option value="Premium Royal">Premium Royal</option>
                  <option value="Standard">Standard</option>
                  <option value="Custom Project">Custom Project</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status Akun</label>
                <select
                  className="admin-select"
                  value={clientForm.status}
                  onChange={(e) =>
                    setClientForm((prev) => ({
                      ...prev,
                      status: e.target.value as 'active' | 'inactive',
                    }))
                  }
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Catatan Tambahan</label>
              <textarea
                className="admin-textarea"
                rows={3}
                placeholder="Catatan pembayaran, tanggal booking, dll."
                value={clientForm.notes}
                onChange={(e) =>
                  setClientForm((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => setShowClientModal(false)}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              {saving
                ? 'Menyimpan...'
                : clientForm.id
                  ? 'Simpan Perubahan'
                  : 'Daftarkan Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
