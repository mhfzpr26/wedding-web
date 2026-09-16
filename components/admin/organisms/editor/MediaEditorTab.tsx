'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const MediaEditorTab: React.FC = () => {
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
        showToast('success', `${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah file');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  const setMusic = (key: string, val: string | boolean) =>
    setConfig((prev) =>
      prev ? { ...prev, music: { ...prev.music, [key]: val } } : null,
    );

  const setTrailer = (key: string, val: string) =>
    setConfig((prev) =>
      prev ? { ...prev, trailer: { ...prev.trailer, [key]: val } } : null,
    );

  const setPrivacy = (key: string, val: string | boolean) =>
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            privacyMode: {
              ...(prev.privacyMode || {}),
              [key]: val,
            },
          }
        : null,
    );

  const groomName = config.couple?.groom?.name || '';
  const brideName = config.couple?.bride?.name || '';
  const defaultGroomInitial = groomName.trim()
    ? groomName.trim()[0].toUpperCase()
    : 'R';
  const defaultBrideInitial = brideName.trim()
    ? brideName.trim()[0].toUpperCase()
    : 'D';
  const defaultCoupleInitials = `${defaultBrideInitial} & ${defaultGroomInitial}`;

  return (
    <Grid container spacing={3}>
      {/* Privacy Mode Card (No Media / Syar'i Mode) */}
      <Grid size={12}>
        <Card
          sx={{
            border: (theme) =>
              config.privacyMode?.noMedia
                ? `1px solid ${theme.palette.primary.main}`
                : '1px solid rgba(255,255,255,0.08)',
            background: config.privacyMode?.noMedia
              ? 'linear-gradient(135deg, rgba(229,9,20,0.08) 0%, rgba(20,20,20,0.95) 100%)'
              : undefined,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: config.privacyMode?.noMedia
                      ? 'rgba(229,9,20,0.2)'
                      : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VisibilityOffIcon
                    sx={{
                      fontSize: 20,
                      color: config.privacyMode?.noMedia
                        ? 'error.main'
                        : 'text.secondary',
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    🛡️ Mode Tanpa Foto & Video (Syar&apos;i / Privacy Mode)
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Sembunyikan foto & video mempelai, gantikan dengan inisial
                    monogram teks & grafis Netflix elegan tanpa mengubah tata
                    letak.
                  </Typography>
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={config.privacyMode?.noMedia ?? false}
                    onChange={(e) => setPrivacy('noMedia', e.target.checked)}
                    color="error"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {config.privacyMode?.noMedia
                      ? 'Aktif (Tanpa Foto/Video)'
                      : 'Nonaktif (Tampil Foto/Video)'}
                  </Typography>
                }
              />
            </Box>

            {config.privacyMode?.noMedia && (
              <Box
                sx={{
                  mt: 2,
                  pt: 2.5,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}
                >
                  ✍️ Pengaturan Inisial Teks (Otomatis & Tanpa Perlu Upload File)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Inisial Pengantin Pria"
                      value={
                        config.privacyMode?.groomInitial ?? defaultGroomInitial
                      }
                      onChange={(e) =>
                        setPrivacy('groomInitial', e.target.value)
                      }
                      fullWidth
                      helperText={`Default: ${defaultGroomInitial}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Inisial Pengantin Wanita"
                      value={
                        config.privacyMode?.brideInitial ?? defaultBrideInitial
                      }
                      onChange={(e) =>
                        setPrivacy('brideInitial', e.target.value)
                      }
                      fullWidth
                      helperText={`Default: ${defaultBrideInitial}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Inisial Bersama (Cover / Badge)"
                      value={
                        config.privacyMode?.coupleInitials ??
                        defaultCoupleInitials
                      }
                      onChange={(e) =>
                        setPrivacy('coupleInitials', e.target.value)
                      }
                      fullWidth
                      helperText={`Default: ${defaultCoupleInitials}`}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      {/* Music Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MusicNoteIcon sx={{ fontSize: 18, color: 'primary.light' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                🎵 Musik Latar (Background Song)
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Judul Lagu"
                  value={config.music?.title || ''}
                  onChange={(e) => setMusic('title', e.target.value)}
                  fullWidth
                  placeholder="e.g. Perfect - Ed Sheeran"
                />
              </Grid>
              <Grid size={12}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    display: 'block',
                    mb: 1,
                  }}
                >
                  File Musik MP3
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUploadIcon fontSize="small" />}
                    disabled={uploading === 'audioFile'}
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {uploading === 'audioFile' ? 'Uploading…' : 'Upload MP3'}
                    <input
                      type="file"
                      accept="audio/*"
                      style={{ display: 'none' }}
                      onChange={(e) =>
                        handleFileUpload(e, 'audioFile', (url) =>
                          setMusic('audioUrl', url),
                        )
                      }
                    />
                  </Button>
                  <TextField
                    size="small"
                    label="URL File MP3"
                    value={config.music?.audioUrl || ''}
                    onChange={(e) => setMusic('audioUrl', e.target.value)}
                    fullWidth
                    placeholder="/uploads/music.mp3"
                  />
                </Box>
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.music?.autoplay ?? false}
                      onChange={(e) => setMusic('autoplay', e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Putar otomatis setelah tamu membuka undangan
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Video Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: 'rgba(14,165,233,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MovieIcon sx={{ fontSize: 18, color: 'info.light' }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                🎬 Video Teaser Prewedding
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Judul Video Teaser"
                  value={config.trailer?.filmTitle || ''}
                  onChange={(e) => setTrailer('filmTitle', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="URL File Video (MP4/WebM)"
                  value={config.trailer?.videoUrl || ''}
                  onChange={(e) => setTrailer('videoUrl', e.target.value)}
                  fullWidth
                  placeholder="https://... atau /uploads/video.mp4"
                />
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUploadIcon fontSize="small" />}
                    disabled={uploading === 'trailerPoster'}
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {uploading === 'trailerPoster'
                      ? 'Uploading…'
                      : 'Upload Poster'}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) =>
                        handleFileUpload(e, 'trailerPoster', (url) =>
                          setTrailer('posterUrl', url),
                        )
                      }
                    />
                  </Button>
                  <TextField
                    size="small"
                    label="URL Poster Thumbnail"
                    value={config.trailer?.posterUrl || ''}
                    onChange={(e) => setTrailer('posterUrl', e.target.value)}
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Badge Durasi Video"
                  value={config.trailer?.duration || ''}
                  onChange={(e) => setTrailer('duration', e.target.value)}
                  fullWidth
                  placeholder="e.g. 3:24"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
