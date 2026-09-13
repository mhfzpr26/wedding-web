'use client';

import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CollectionsRoundedIcon from '@mui/icons-material/CollectionsRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingGalleryItem } from '@/types/wedding';

export const GalleryEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        showToast('success', `Foto galeri ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto galeri');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload foto galeri');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index),
          }
        : null,
    );
  };

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
            pb: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CollectionsRoundedIcon color="primary" />
              Galeri Foto Sinematik
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Koleksi potret prewedding, akad, dan resepsi dengan orientasi
              portrait, landscape, atau square.
            </Typography>
          </Box>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadRoundedIcon />}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            Upload Foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFileUpload(e, (url) => {
                  const newItem: WeddingGalleryItem = {
                    id: `photo_${Date.now()}`,
                    src: url,
                    title: 'New Moment',
                    category: 'prewedding',
                    tag: 'Cinematic Shot',
                    aspect: 'portrait',
                  };
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          gallery: [...(prev.gallery || []), newItem],
                        }
                      : null,
                  );
                })
              }
            />
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {config.gallery?.map((photo, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={photo.id || index}
            >
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition:
                    'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: 160,
                    backgroundImage: `url(${photo.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    bgcolor: 'grey.100',
                  }}
                />
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    flexGrow: 1,
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Judul / Caption Foto"
                    fullWidth
                    value={photo.title}
                    onChange={(e) => {
                      const updated = [...config.gallery];
                      updated[index].title = e.target.value;
                      setConfig((prev) =>
                        prev ? { ...prev, gallery: updated } : null,
                      );
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      select
                      size="small"
                      fullWidth
                      value={photo.aspect || 'portrait'}
                      onChange={(e) => {
                        const updated = [...config.gallery];
                        updated[index].aspect = e.target.value as
                          | 'portrait'
                          | 'landscape'
                          | 'square';
                        setConfig((prev) =>
                          prev ? { ...prev, gallery: updated } : null,
                        );
                      }}
                    >
                      <MenuItem value="portrait">Portrait</MenuItem>
                      <MenuItem value="landscape">Landscape</MenuItem>
                      <MenuItem value="square">Square</MenuItem>
                    </TextField>
                    <Tooltip title="Hapus Foto">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemovePhoto(index)}
                        sx={{
                          border: '1px solid',
                          borderColor: 'error.light',
                          borderRadius: 1.5,
                        }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
