'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type React from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAdminStore } from '@/stores/useAdminStore';

const clientSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().min(9, 'Nomor telepon tidak valid').max(15),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  package: z.string().min(1, 'Pilih paket'),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export const ClientModal: React.FC = () => {
  const showClientModal = useAdminStore((s) => s.showClientModal);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const clientForm = useAdminStore((s) => s.clientForm);
  const showToast = useAdminStore((s) => s.showToast);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);

  const isEdit = Boolean(clientForm?.id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      package: 'Standard',
      status: 'active',
      notes: '',
    },
  });

  useEffect(() => {
    if (clientForm && showClientModal) {
      reset({
        name: clientForm.name ?? '',
        phone: clientForm.phone ?? '',
        email: clientForm.email ?? '',
        package: clientForm.package ?? 'Standard',
        status: (clientForm.status as 'active' | 'inactive') ?? 'active',
        notes: clientForm.notes ?? '',
      });
    }
  }, [clientForm, showClientModal, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/saas/clients/${clientForm?.id}`
        : '/api/admin/saas/clients';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast(
          'success',
          isEdit
            ? 'Client berhasil diperbarui'
            : 'Client baru berhasil ditambahkan',
        );
        setShowClientModal(false);
        await refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menyimpan data client');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={showClientModal}
      onClose={() => setShowClientModal(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#111827 !important',
            backgroundImage: 'none !important',
            border: '1px solid #1f2937',
          },
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(99,102,241,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isEdit ? (
              <PersonIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            ) : (
              <PersonAddIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            )}
          </Box>
          {isEdit ? 'Edit Data Client' : 'Daftarkan Client Baru'}
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nama Client / Pasangan *"
                    placeholder="e.g. Destia & Rakafansa"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nomor WhatsApp *"
                    placeholder="08xxxxxxxxxx"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email (Opsional)"
                    type="email"
                    placeholder="email@example.com"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="package"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Paket Langganan</InputLabel>
                    <Select {...field} label="Paket Langganan">
                      <MenuItem value="Standard">Standard</MenuItem>
                      <MenuItem value="Premium Royal">Premium Royal</MenuItem>
                      <MenuItem value="Cinematic VIP">Cinematic VIP</MenuItem>
                      <MenuItem value="Custom Project">Custom Project</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Status Akun</InputLabel>
                    <Select {...field} label="Status Akun">
                      <MenuItem value="active">Aktif</MenuItem>
                      <MenuItem value="inactive">Nonaktif</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Catatan Tambahan"
                    placeholder="Catatan pembayaran, tanggal booking, dll."
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setShowClientModal(false)}
            disabled={saving}
          >
            Batal
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving
              ? 'Menyimpan…'
              : isEdit
                ? 'Simpan Perubahan'
                : 'Daftarkan Client'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
