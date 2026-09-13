'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type React from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

const invitationSchema = z.object({
  clientId: z.string().min(1, 'Pilih client terlebih dahulu'),
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda -'),
  templateId: z.string().min(1),
  status: z.enum(['draft', 'published', 'inactive']),
  eventDate: z.string().optional(),
});

type InvFormData = z.infer<typeof invitationSchema>;

export const InvitationModal: React.FC = () => {
  const showCreateInvModal = useAdminStore((s) => s.showCreateInvModal);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const createInvForm = useAdminStore((s) => s.createInvForm);
  const clients = useAdminStore((s) => s.clients);
  const showToast = useAdminStore((s) => s.showToast);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const setSelectedInvitationId = useAdminStore(
    (s) => s.setSelectedInvitationId,
  );
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InvFormData>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      clientId: '',
      title: '',
      slug: '',
      templateId: 'netflix',
      status: 'draft',
      eventDate: '',
    },
  });

  useEffect(() => {
    if (createInvForm && showCreateInvModal) {
      reset({
        clientId: createInvForm.clientId ?? '',
        title: createInvForm.title ?? '',
        slug: createInvForm.slug ?? '',
        templateId: createInvForm.templateId ?? 'netflix',
        status: (createInvForm.status as InvitationStatus) ?? 'draft',
        eventDate: createInvForm.eventDate ?? '',
      });
    }
  }, [createInvForm, showCreateInvModal, reset]);

  const onSubmit = async (data: InvFormData) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/saas/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
    <Dialog
      open={showCreateInvModal}
      onClose={() => setShowCreateInvModal(false)}
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
            <CardGiftcardIcon sx={{ color: 'primary.light', fontSize: 20 }} />
          </Box>
          Buat Undangan Baru
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Client Selector */}
            <Grid size={12}>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.clientId}>
                    <InputLabel>Pilih Client / Pemesan *</InputLabel>
                    <Select {...field} label="Pilih Client / Pemesan *">
                      <MenuItem value="">
                        <em>-- Pilih Client --</em>
                      </MenuItem>
                      {clients.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name} · {c.phone} · {c.package}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.clientId && (
                      <FormHelperText>{errors.clientId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Title */}
            <Grid size={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Judul Undangan *"
                    placeholder="e.g. Destia & Rakafansa | The Wedding"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    onChange={(e) => {
                      field.onChange(e);
                      const autoSlug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      setValue('slug', autoSlug, { shouldValidate: false });
                    }}
                  />
                )}
              />
            </Grid>

            {/* Slug */}
            <Grid size={12}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="URL Slug *"
                    placeholder="destia-rakafansa"
                    fullWidth
                    error={!!errors.slug}
                    helperText={
                      errors.slug?.message ?? 'Otomatis dari judul, bisa diubah'
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              component="span"
                              sx={{
                                color: 'text.disabled',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              /undangan/
                            </Box>
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-'),
                      );
                    }}
                  />
                )}
              />
            </Grid>

            {/* Template + Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="templateId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Template Awal</InputLabel>
                    <Select {...field} label="Template Awal">
                      <MenuItem value="netflix">Netflix Cinematic</MenuItem>
                      <MenuItem value="floral">Floral Botanical</MenuItem>
                      <MenuItem value="minimalist">Modern Minimalist</MenuItem>
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
                    <InputLabel>Status Awal</InputLabel>
                    <Select {...field} label="Status Awal">
                      <MenuItem value="draft">🟡 Draft</MenuItem>
                      <MenuItem value="published">🟢 Published</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Event Date */}
            <Grid size={12}>
              <Controller
                name="eventDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tanggal Pelaksanaan"
                    type="date"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setShowCreateInvModal(false)}
            disabled={saving}
          >
            Batal
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Membuat…' : 'Buat Undangan & Buka Editor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
