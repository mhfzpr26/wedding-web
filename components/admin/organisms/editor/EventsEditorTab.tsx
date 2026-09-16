'use client';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingEventItem } from '@/types/wedding';

export const EventsEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
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
        handleUpdateField(index, 'venuePhoto', data.url);
        showToast('success', `Foto venue ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto venue');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload foto venue');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddEvent = () => {
    const newEvent: WeddingEventItem = {
      id: `event_${Date.now()}`,
      type: 'RESEPSI PERNIKAHAN',
      episodeNumber: (config.events?.length || 0) + 1,
      title: 'The Celebration Party',
      duration: '120 Menit',
      synopsis:
        'Pesta syukuran dan ramah tamah pernikahan bersama keluarga dan sahabat terkasih.',
      date: 'Sabtu, 14 November 2026',
      time: '11:00 - 13:00 WIB',
      venue: 'Grand Ballroom Hotel Mulia',
      address: 'Jl. Asia Afrika, Senayan, Jakarta Pusat',
      mapUrl: 'https://maps.google.com',
      calendarUrl: 'https://calendar.google.com',
      venuePhoto: '/images/venue-resepsi.jpg',
    };
    setConfig((prev) =>
      prev ? { ...prev, events: [...(prev.events || []), newEvent] } : null,
    );
  };

  const handleRemoveEvent = (index: number) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            events: prev.events.filter((_, i) => i !== index),
          }
        : null,
    );
  };

  const handleUpdateField = (
    index: number,
    field: keyof WeddingEventItem,
    val: string,
  ) => {
    const updated = [...config.events];
    updated[index] = { ...updated[index], [field]: val };
    setConfig((prev) => (prev ? { ...prev, events: updated } : null));
  };

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {/* Header Bar */}
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
              <EventAvailableRoundedIcon color="primary" />
              Rangkaian Acara Pernikahan (Episodes)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Atur jadwal acara seperti Akad Nikah, Resepsi, atau Ngunduh Mantu
              lengkap dengan foto venue gedung, alamat, dan tombol navigasi
              Maps.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddEvent}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            Tambah Sesi Acara
          </Button>
        </Box>

        {/* List of Events */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {config.events.map((ev, index) => {
            const fallbackThumb =
              index === 0
                ? '/images/venue-akad.jpg'
                : '/images/venue-resepsi.jpg';
            const displayPhoto = ev.venuePhoto || fallbackThumb;

            return (
              <Card
                key={ev.id || index}
                variant="outlined"
                sx={{
                  borderRadius: 2.5,
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}
              >
                {/* Event Card Header Bar */}
                <Box
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 1.75,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Chip
                      label={`EPISODE #${index + 1}`}
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        letterSpacing: '0.05em',
                      }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {ev.title || ev.type || `Sesi Acara #${index + 1}`}
                    </Typography>
                    <Chip
                      label={ev.type || 'SESI ACARA'}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.68rem', fontWeight: 600 }}
                    />
                  </Box>
                  <Tooltip title="Hapus Sesi Acara Ini">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveEvent(index)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.light',
                        borderRadius: 1.5,
                        '&:hover': { bgcolor: 'error.lighter' },
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Grid container spacing={3}>
                    {/* SECTION 1: WAKTU & JADWAL */}
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <AccessTimeRoundedIcon
                          sx={{ fontSize: 18, color: 'primary.main' }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          1. Waktu & Judul Sesi Acara
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <TextField
                            label="Tipe Acara (Badge)"
                            placeholder="AKAD NIKAH / RESEPSI"
                            fullWidth
                            size="small"
                            value={ev.type}
                            onChange={(e) =>
                              handleUpdateField(index, 'type', e.target.value)
                            }
                            helperText="Label atas sesi acara"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 5 }}>
                          <TextField
                            label="Judul Sesi Acara"
                            placeholder="Contoh: The Sacred Vow (Akad Nikah)"
                            fullWidth
                            size="small"
                            value={ev.title}
                            onChange={(e) =>
                              handleUpdateField(index, 'title', e.target.value)
                            }
                            helperText="Nama episode yang tampil besar"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            label="Durasi Pelaksanaan"
                            placeholder="Contoh: 90 Menit"
                            fullWidth
                            size="small"
                            value={ev.duration}
                            onChange={(e) =>
                              handleUpdateField(
                                index,
                                'duration',
                                e.target.value,
                              )
                            }
                            helperText="Estimasi durasi"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Hari & Tanggal Acara"
                            placeholder="Contoh: Sabtu, 14 November 2026"
                            fullWidth
                            size="small"
                            value={ev.date}
                            onChange={(e) =>
                              handleUpdateField(index, 'date', e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Waktu / Jam Acara"
                            placeholder="Contoh: 09:00 - 10:30 WIB"
                            fullWidth
                            size="small"
                            value={ev.time}
                            onChange={(e) =>
                              handleUpdateField(index, 'time', e.target.value)
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid size={12}>
                      <Divider sx={{ my: 0.5 }} />
                    </Grid>

                    {/* SECTION 2: TEMPAT, LOKASI & FOTO VENUE */}
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <PlaceRoundedIcon
                          sx={{ fontSize: 18, color: 'primary.main' }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          2. Lokasi, Venue & Peta Navigasi
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Nama Tempat / Gedung / Venue"
                            placeholder="Contoh: Masjid Agung Al-Barkah"
                            fullWidth
                            size="small"
                            value={ev.venue}
                            onChange={(e) =>
                              handleUpdateField(index, 'venue', e.target.value)
                            }
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Alamat Lengkap"
                            placeholder="Jl. Veteran No. 46, Marga Jaya, Bekasi"
                            fullWidth
                            size="small"
                            value={ev.address}
                            onChange={(e) =>
                              handleUpdateField(
                                index,
                                'address',
                                e.target.value,
                              )
                            }
                          />
                        </Grid>

                        {/* Foto Venue Upload & URL */}
                        <Grid size={12}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: 'rgba(255,255,255,0.015)',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 1,
                              }}
                            >
                              Foto Gedung / Lokasi Venue (Thumbnail 16:9)
                            </Typography>
                            <Grid
                              container
                              spacing={2}
                              sx={{ alignItems: 'center' }}
                            >
                              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    backgroundImage: `url(${displayPhoto})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: 4,
                                      left: 4,
                                      bgcolor: 'rgba(0,0,0,0.7)',
                                      px: 1,
                                      py: 0.2,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.65rem',
                                        color: '#fff',
                                      }}
                                    >
                                      Preview 16:9
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    gap: 1.5,
                                    flexWrap: 'wrap',
                                    mb: 1,
                                  }}
                                >
                                  <Button
                                    component="label"
                                    variant="outlined"
                                    size="small"
                                    startIcon={<CloudUploadRoundedIcon />}
                                    sx={{
                                      textTransform: 'none',
                                      borderRadius: 1.5,
                                    }}
                                  >
                                    Upload Foto Gedung
                                    <input
                                      type="file"
                                      accept="image/*"
                                      hidden
                                      onChange={(e) =>
                                        handleFileUpload(e, index)
                                      }
                                    />
                                  </Button>
                                  <TextField
                                    size="small"
                                    placeholder="Atau masukkan URL foto gedung (misal: /images/venue-akad.jpg)"
                                    value={ev.venuePhoto || ''}
                                    onChange={(e) =>
                                      handleUpdateField(
                                        index,
                                        'venuePhoto',
                                        e.target.value,
                                      )
                                    }
                                    sx={{ flex: 1, minWidth: 200 }}
                                  />
                                </Box>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Foto ini akan muncul sebagai thumbnail
                                  sinematis berbadge tempat pada kartu episode
                                  undangan.
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Link Google Maps"
                            placeholder="https://maps.google.com/?q=..."
                            fullWidth
                            size="small"
                            value={ev.mapUrl}
                            onChange={(e) =>
                              handleUpdateField(index, 'mapUrl', e.target.value)
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <MapRoundedIcon
                                    sx={{
                                      fontSize: 18,
                                      color: 'text.secondary',
                                      mr: 1,
                                    }}
                                  />
                                ),
                              },
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Link Simpan ke Google Calendar"
                            placeholder="https://calendar.google.com/..."
                            fullWidth
                            size="small"
                            value={ev.calendarUrl}
                            onChange={(e) =>
                              handleUpdateField(
                                index,
                                'calendarUrl',
                                e.target.value,
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid size={12}>
                      <Divider sx={{ my: 0.5 }} />
                    </Grid>

                    {/* SECTION 3: SINOPSIS & CATATAN TAMU */}
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <NotesRoundedIcon
                          sx={{ fontSize: 18, color: 'primary.main' }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          3. Sinopsis & Catatan Tambahan Tamu
                        </Typography>
                      </Box>
                      <TextField
                        label="Deskripsi / Sinopsis Acara"
                        placeholder="Catatan tambahan, dress code, atau permohonan hadir untuk para tamu undangan..."
                        fullWidth
                        multiline
                        rows={2.5}
                        size="small"
                        value={ev.synopsis}
                        onChange={(e) =>
                          handleUpdateField(index, 'synopsis', e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
