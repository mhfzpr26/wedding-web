'use client';

import type React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useAdminStore } from '@/stores/useAdminStore';

export const DeleteConfirmModal: React.FC = () => {
  const deleteConfirm = useAdminStore((s) => s.deleteConfirm);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const showToast = useAdminStore((s) => s.showToast);
  const setSaving = useAdminStore((s) => s.setSaving);
  const saving = useAdminStore((s) => s.saving);

  if (!deleteConfirm) return null;

  const handleConfirmDelete = async () => {
    setSaving(true);
    try {
      const endpoint =
        deleteConfirm.type === 'invitation'
          ? `/api/admin/saas/invitations/${deleteConfirm.id}`
          : `/api/admin/saas/clients/${deleteConfirm.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        showToast(
          'success',
          `${deleteConfirm.type === 'invitation' ? 'Undangan' : 'Client'} berhasil dihapus!`,
        );
        setDeleteConfirm(null);
        await refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menghapus data');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menghapus');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal admin-modal--sm">
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">
            Hapus {deleteConfirm.type === 'invitation' ? 'Undangan' : 'Data Client'}
          </h3>
          <button
            type="button"
            className="admin-modal__close"
            onClick={() => setDeleteConfirm(null)}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="admin-modal__body">
          <p className="admin-delete-warning">
            Apakah Anda yakin ingin menghapus data{' '}
            <strong>&quot;{deleteConfirm.title}&quot;</strong>?
          </p>
          <p className="admin-delete-subwarning">
            Tindakan ini permanen dan akan menghapus seluruh data terkait di database PostgreSQL.
          </p>
        </div>

        <div className="admin-modal__footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => setDeleteConfirm(null)}
            disabled={saving}
          >
            Batal
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={handleConfirmDelete}
            disabled={saving}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
            <span>{saving ? 'Menghapus...' : 'Ya, Hapus Permanen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
