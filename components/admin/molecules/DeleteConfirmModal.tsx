'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const DeleteConfirmModal: React.FC = () => {
  const deleteConfirm = useAdminStore((s) => s.deleteConfirm);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);
  const showToast = useAdminStore((s) => s.showToast);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);

  if (!deleteConfirm) return null;

  const endpoint =
    deleteConfirm.type === 'invitation'
      ? `/api/admin/invitations/${deleteConfirm.id}`
      : `/api/admin/clients/${deleteConfirm.id}`;

  const itemLabel = deleteConfirm.type === 'invitation' ? 'undangan' : 'klien';
  const message = `Apakah Anda yakin ingin menghapus ${itemLabel} "${deleteConfirm.title}"?`;
  const successMessage = `${deleteConfirm.type === 'invitation' ? 'Undangan' : 'Klien'} "${deleteConfirm.title}" berhasil dihapus.`;

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', successMessage);
        await refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error ?? 'Gagal menghapus data');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menghapus');
    } finally {
      setSaving(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <Dialog open onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(244,63,94,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <WarningAmberIcon sx={{ color: 'error.main', fontSize: 20 }} />
          </Box>
          Konfirmasi Hapus
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary', fontSize: '0.9rem' }}>
          {message}
        </DialogContentText>
        <DialogContentText
          sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}
        >
          Tindakan ini tidak dapat dibatalkan.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setDeleteConfirm(null)}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={saving}
        >
          {saving ? 'Menghapus…' : 'Ya, Hapus'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
