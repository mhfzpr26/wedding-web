'use client';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const ChangePasswordModal: React.FC = () => {
  const open = useAdminStore((s) => s.showChangePasswordModal);
  const setOpen = useAdminStore((s) => s.setShowChangePasswordModal);
  const showToast = useAdminStore((s) => s.showToast);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        showToast(
          'success',
          'Password berhasil diubah. Silakan login kembali.',
        );
        handleClose();

        // Logout user explicitly after password change
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal mengubah password.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.1rem' }}>
          Ganti Password
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          dividers
          sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Password Saat Ini"
            type="password"
            fullWidth
            size="small"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Password Baru"
            type="password"
            fullWidth
            size="small"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Konfirmasi Password Baru"
            type="password"
            fullWidth
            size="small"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
        </DialogContent>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};
