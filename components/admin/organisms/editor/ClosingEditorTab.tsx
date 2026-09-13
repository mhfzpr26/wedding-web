'use client';

import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const ClosingEditorTab: React.FC = () => {
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
          <VolunteerActivismRoundedIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Pesan Penutup & Salam Hangat (Closing Section)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kalimat ucapan terima kasih dan permohonan doa restu kepada para
              tamu undangan.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Judul Penutup"
              placeholder="Contoh: Terima Kasih"
              fullWidth
              size="small"
              value={config.closing?.title || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        closing: {
                          ...prev.closing,
                          title: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Badge Penutup"
              placeholder="Contoh: The Grand Finale"
              fullWidth
              size="small"
              value={config.closing?.badge || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        closing: {
                          ...prev.closing,
                          badge: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Pesan Doa & Terima Kasih"
              placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir..."
              fullWidth
              multiline
              rows={4}
              size="small"
              value={config.closing?.message || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        closing: {
                          ...prev.closing,
                          message: e.target.value,
                        },
                      }
                    : null,
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Teks Hak Cipta (Copyright / Footer)"
              placeholder="Contoh: © 2026 Romeo & Juliet Wedding. All Rights Reserved."
              fullWidth
              size="small"
              value={config.closing?.copyright || ''}
              onChange={(e) =>
                setConfig((prev) =>
                  prev
                    ? {
                        ...prev,
                        closing: {
                          ...prev.closing,
                          copyright: e.target.value,
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
