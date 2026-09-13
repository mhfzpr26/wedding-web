'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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

  if (!config) return null;

  const handleAddEvent = () => {
    const newEvent: WeddingEventItem = {
      id: `event_${Date.now()}`,
      type: 'RESEPSI PERNIKAHAN',
      episodeNumber: (config.events?.length || 0) + 1,
      title: 'The Celebration Party',
      duration: '120 Menit',
      synopsis: 'Pesta syukuran dan ramah tamah pernikahan.',
      date: 'Sabtu, 14 November 2026',
      time: '11:00 - 13:00 WIB',
      venue: 'Grand Ballroom Hotel Mulia',
      address: 'Jl. Asia Afrika, Senayan, Jakarta Pusat',
      mapUrl: 'https://maps.google.com',
      calendarUrl: 'https://calendar.google.com',
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
              Rangkaian Acara Pernikahan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Atur seluruh jadwal acara seperti Akad Nikah, Resepsi, atau
              Ngunduh Mantu beserta lokasi & peta.
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
            Tambah Acara
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {config.events.map((ev, index) => (
            <Card
              key={ev.id || index}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2.5,
                    pb: 1.5,
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
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
                      label={`SESI #${index + 1}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {ev.title || ev.type || 'Sesi Acara Baru'}
                    </Typography>
                  </Box>
                  <Tooltip title="Hapus Sesi Acara">
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

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      label="Tipe Acara"
                      placeholder="Contoh: AKAD NIKAH / RESEPSI"
                      fullWidth
                      size="small"
                      value={ev.type}
                      onChange={(e) =>
                        handleUpdateField(index, 'type', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                    <TextField
                      label="Judul Sesi Acara"
                      placeholder="Contoh: The Sacred Vows"
                      fullWidth
                      size="small"
                      value={ev.title}
                      onChange={(e) =>
                        handleUpdateField(index, 'title', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      label="Estimasi Durasi"
                      placeholder="Contoh: 120 Menit"
                      fullWidth
                      size="small"
                      value={ev.duration}
                      onChange={(e) =>
                        handleUpdateField(index, 'duration', e.target.value)
                      }
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
                      label="Waktu Pelaksanaan"
                      placeholder="Contoh: 08:00 - 10:00 WIB"
                      fullWidth
                      size="small"
                      value={ev.time}
                      onChange={(e) =>
                        handleUpdateField(index, 'time', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Nama Tempat / Gedung"
                      placeholder="Contoh: Grand Ballroom Hotel Mulia"
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
                      placeholder="Alamat detail lokasi acara"
                      fullWidth
                      size="small"
                      value={ev.address}
                      onChange={(e) =>
                        handleUpdateField(index, 'address', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Link Google Maps"
                      placeholder="https://maps.app.goo.gl/..."
                      fullWidth
                      size="small"
                      value={ev.mapUrl}
                      onChange={(e) =>
                        handleUpdateField(index, 'mapUrl', e.target.value)
                      }
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
                        handleUpdateField(index, 'calendarUrl', e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Deskripsi / Catatan Acara (Synopsis)"
                      placeholder="Catatan tambahan untuk para tamu..."
                      fullWidth
                      multiline
                      rows={2}
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
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
