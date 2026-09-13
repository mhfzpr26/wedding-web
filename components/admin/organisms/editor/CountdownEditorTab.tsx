'use client';

import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const CountdownEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <HourglassTopRoundedIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Target Waktu Hitung Mundur (Countdown)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Atur waktu mulai momen sakral akad / resepsi agar tamu dapat
              melihat hitungan mundur secara real-time.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Judul Hitung Mundur"
              placeholder="Contoh: Menuju Hari Bahagia"
              fullWidth
              size="small"
              value={config.countdown?.title || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        countdown: {
                          ...prev.countdown,
                          title: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Target Tanggal & Jam"
              type="datetime-local"
              fullWidth
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
              value={
                config.countdown?.targetDate
                  ? config.countdown.targetDate.slice(0, 16)
                  : ''
              }
              helperText={`Format ISO tersimpan: ${config.countdown?.targetDate || 'Belum diatur'}`}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        countdown: {
                          ...prev.countdown,
                          targetDate: `${e.target.value}:00+07:00`,
                        },
                      }
                    : null,
                )
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
