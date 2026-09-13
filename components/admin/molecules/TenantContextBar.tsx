'use client';

import type React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

export const TenantContextBar: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const setSelectedInvitationId = useAdminStore(
    (s) => s.setSelectedInvitationId,
  );
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const editorSlug = useAdminStore((s) => s.editorSlug);
  const setEditorSlug = useAdminStore((s) => s.setEditorSlug);
  const editorStatus = useAdminStore((s) => s.editorStatus);
  const setEditorStatus = useAdminStore((s) => s.setEditorStatus);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);
  const showToast = useAdminStore((s) => s.showToast);
  const config = useAdminStore((s) => s.config);
  const setInvitations = useAdminStore((s) => s.setInvitations);

  const currentInvitation = invitations.find((i) => i.id === selectedInvitationId);

  const handleUpdateStatus = async (newStatus: InvitationStatus) => {
    if (!selectedInvitationId) return;
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (res.ok) {
        setEditorStatus(newStatus);
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === selectedInvitationId ? { ...i, status: newStatus } : i,
          ),
        );
        showToast('success', `Status berhasil diubah ke ${newStatus}`);
      }
    } catch {
      showToast('error', 'Gagal memperbarui status undangan');
    }
  };

  const handleUpdateSlug = async (newSlug: string) => {
    if (!selectedInvitationId || !newSlug) return;
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: newSlug }),
        },
      );

      if (res.ok) {
        const updated = await res.json();
        setEditorSlug(updated.slug);
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === selectedInvitationId ? { ...i, slug: updated.slug } : i,
          ),
        );
        showToast('success', `Link slug berhasil diperbarui: /undangan/${updated.slug}`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Slug sudah digunakan');
      }
    } catch {
      showToast('error', 'Gagal memperbarui link slug');
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedInvitationId || !config) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}/config`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        },
      );

      if (res.ok) {
        showToast('success', 'Konfigurasi undangan berhasil disimpan!');
      } else {
        showToast('error', 'Gagal menyimpan perubahan ke server');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor-bar">
      <div className="admin-editor-bar__info">
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--sm"
          onClick={() => setPrimaryTab('dashboard')}
        >
          <ArrowBackIcon fontSize="inherit" /> Dashboard
        </button>
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--admin-red)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            SEDANG MENYUNTING UNDANGAN
          </div>
          <h2 className="admin-editor-bar__title">
            {currentInvitation?.title || 'Pilih Undangan'}
          </h2>
        </div>
      </div>

      {/* Quick Switcher & Controls */}
      <div className="admin-editor-bar__controls">
        <label
          style={{
            fontSize: '0.8rem',
            color: 'var(--admin-text-secondary)',
          }}
        >
          Ganti Undangan:
        </label>
        <select
          className="admin-select"
          style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
          value={selectedInvitationId}
          onChange={(e) => setSelectedInvitationId(e.target.value)}
        >
          {invitations.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title} ({i.slug})
            </option>
          ))}
        </select>

        <label
          style={{
            fontSize: '0.8rem',
            color: 'var(--admin-text-secondary)',
            marginLeft: '0.5rem',
          }}
        >
          Slug:
        </label>
        <input
          type="text"
          className="admin-input"
          style={{ width: '160px', padding: '0.4rem 0.6rem' }}
          value={editorSlug}
          onChange={(e) => setEditorSlug(e.target.value)}
          onBlur={(e) => handleUpdateSlug(e.target.value)}
          placeholder="slug-undangan"
        />

        <select
          className="admin-status-select"
          value={editorStatus}
          onChange={(e) =>
            handleUpdateStatus(e.target.value as InvitationStatus)
          }
        >
          <option value="draft">🟡 Draft</option>
          <option value="published">🟢 Published</option>
          <option value="inactive">🔴 Nonaktif</option>
        </select>

        {currentInvitation && (
          <Link
            href={`/undangan/${editorSlug || currentInvitation.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn--outline"
          >
            <VisibilityIcon fontSize="small" /> Preview Live
          </Link>
        )}

        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSaveConfig}
          disabled={saving || !config}
        >
          <SaveIcon fontSize="small" />{' '}
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
};
