'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

type PersonKey = 'bride' | 'groom';

export const CoupleEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const uploading = useAdminStore((s) => s.uploading);
  const setUploading = useAdminStore((s) => s.setUploading);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
        showToast('success', `Foto ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  const update = (person: PersonKey, field: string, value: string) =>
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            couple: {
              ...prev.couple,
              [person]: { ...prev.couple[person], [field]: value },
            },
          }
        : null,
    );

  const updateParent = (
    person: PersonKey,
    parent: 'father' | 'mother',
    value: string,
  ) =>
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            couple: {
              ...prev.couple,
              [person]: {
                ...prev.couple[person],
                parents: { ...prev.couple[person].parents, [parent]: value },
              },
            },
          }
        : null,
    );

  const PersonCard = ({
    person,
    emoji,
    label,
    accentColor,
    uploadKey,
  }: {
    person: PersonKey;
    emoji: string;
    label: string;
    accentColor: string;
    uploadKey: string;
  }) => {
    const p = config.couple[person];
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: `${accentColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              {emoji}
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: accentColor }}
            >
              {label}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Nama Lengkap & Gelar"
                value={p.name}
                onChange={(e) => update(person, 'name', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nama Panggilan"
                value={p.callname}
                onChange={(e) => update(person, 'callname', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Akun Instagram"
                value={p.instagram || ''}
                onChange={(e) => update(person, 'instagram', e.target.value)}
                fullWidth
                placeholder="@username"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Peran / Panggilan Khusus"
                value={p.characterRole || ''}
                onChange={(e) =>
                  update(person, 'characterRole', e.target.value)
                }
                fullWidth
                placeholder="e.g. Putri Pertama / The Bride"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Bio Singkat"
                value={p.bio || ''}
                onChange={(e) => update(person, 'bio', e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nama Ayah"
                value={p.parents.father}
                onChange={(e) => updateParent(person, 'father', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nama Ibu"
                value={p.parents.mother}
                onChange={(e) => updateParent(person, 'mother', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ mb: 1.5 }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  display: 'block',
                  mb: 1.5,
                }}
              >
                Foto Mempelai
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {p.photo && (
                  <Avatar
                    src={p.photo}
                    alt={p.name}
                    sx={{
                      width: 52,
                      height: 52,
                      border: `2px solid ${accentColor}`,
                      flexShrink: 0,
                    }}
                  />
                )}
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadIcon fontSize="small" />}
                  disabled={uploading === uploadKey}
                  sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {uploading === uploadKey ? 'Uploading…' : 'Upload Foto'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) =>
                      handleFileUpload(e, uploadKey, (url) =>
                        update(person, 'photo', url),
                      )
                    }
                  />
                </Button>
                <TextField
                  size="small"
                  label="atau URL foto"
                  value={p.photo || ''}
                  onChange={(e) => update(person, 'photo', e.target.value)}
                  fullWidth
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <FavoriteIcon sx={{ color: 'error.light', fontSize: 18 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Data Pasangan Pengantin
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PersonCard
            person="bride"
            emoji="👰"
            label="Mempelai Wanita (The Bride)"
            accentColor="#f472b6"
            uploadKey="bridePhoto"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PersonCard
            person="groom"
            emoji="🤵"
            label="Mempelai Pria (The Groom)"
            accentColor="#60a5fa"
            uploadKey="groomPhoto"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
