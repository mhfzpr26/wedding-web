'use client';

import type React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

export const InvitationModal: React.FC = () => {
  const showCreateInvModal = useAdminStore((s) => s.showCreateInvModal);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const createInvForm = useAdminStore((s) => s.createInvForm);
  const setCreateInvForm = useAdminStore((s) => s.setCreateInvForm);
  const clients = useAdminStore((s) => s.clients);
  const showToast = useAdminStore((s) => s.showToast);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const setSelectedInvitationId = useAdminStore(
    (s) => s.setSelectedInvitationId,
  );
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);

  if (!showCreateInvModal) return null;

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createInvForm.clientId) {
      showToast('error', 'Silakan pilih client terlebih dahulu');
      return;
    }
    if (!createInvForm.title.trim()) {
      showToast('error', 'Judul undangan wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/saas/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createInvForm),
      });

      if (res.ok) {
        const newInv = await res.json();
        showToast('success', `Undangan "${newInv.title}" berhasil dibuat!`);
        setShowCreateInvModal(false);
        await refreshSaasData();
        setSelectedInvitationId(newInv.id);
        setPrimaryTab('editor');
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal membuat undangan');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat membuat undangan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">Buat Undangan Baru</h3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={() => setShowCreateInvModal(false)}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <form onSubmit={handleCreateInvitation}>
          <div className="admin-modal__body">
            <div className="admin-form-group">
              <label className="admin-label">Pilih Pemesan / Client *</label>
              <select
                className="admin-select"
                required
                value={createInvForm.clientId}
                onChange={(e) =>
                  setCreateInvForm((prev) => ({
                    ...prev,
                    clientId: e.target.value,
                  }))
                }
              >
                <option value="">-- Pilih Client Terdaftar --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - Paket: {c.package}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Judul Undangan *</label>
              <input
                type="text"
                className="admin-input"
                required
                placeholder="e.g. Destia & Rakafansa | The Wedding"
                value={createInvForm.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const autoSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                  setCreateInvForm((prev) => ({
                    ...prev,
                    title,
                    slug: prev.slug || autoSlug,
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Link Slug Undangan *</label>
              <div className="admin-input-prefix-wrap">
                <span className="admin-input-prefix">/undangan/</span>
                <input
                  type="text"
                  className="admin-input"
                  required
                  placeholder="destia-rakafansa"
                  value={createInvForm.slug}
                  onChange={(e) =>
                    setCreateInvForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-'),
                    }))
                  }
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Template Awal</label>
                <select
                  className="admin-select"
                  value={createInvForm.templateId}
                  onChange={(e) =>
                    setCreateInvForm((prev) => ({
                      ...prev,
                      templateId: e.target.value,
                    }))
                  }
                >
                  <option value="netflix">Netflix Cinematic Special (Aktif)</option>
                  <option value="floral">Floral Botanical</option>
                  <option value="minimalist">Modern Royal Minimalist</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status Awal</label>
                <select
                  className="admin-select"
                  value={createInvForm.status}
                  onChange={(e) =>
                    setCreateInvForm((prev) => ({
                      ...prev,
                      status: e.target.value as InvitationStatus,
                    }))
                  }
                >
                  <option value="draft">Draft (Pratinjau)</option>
                  <option value="published">Published (Live)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Tanggal Pelaksanaan</label>
              <input
                type="date"
                className="admin-input"
                value={createInvForm.eventDate}
                onChange={(e) =>
                  setCreateInvForm((prev) => ({
                    ...prev,
                    eventDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="admin-modal__footer">
            <button
              type="button"
              className="admin-btn admin-btn--outline"
              onClick={() => setShowCreateInvModal(false)}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={saving}
            >
              {saving ? 'Membuat...' : 'Buat Undangan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
