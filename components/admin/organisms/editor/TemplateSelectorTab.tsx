'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import { useAdminStore } from '@/stores/useAdminStore';

export const TemplateSelectorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            mb: 3,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PaletteRoundedIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pilih Tema Template Undangan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pilih template tampilan visual untuk undangan ini. Arsitektur
                modular membuat pergantian tema instan dan aman.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {AVAILABLE_TEMPLATES.map((tmpl) => {
            const isSelected = config.templateId === tmpl.id;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tmpl.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2.5,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: isSelected
                      ? '0 0 0 4px rgba(229, 9, 20, 0.1), 0 4px 14px rgba(0,0,0,0.06)'
                      : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: isSelected
                        ? 'primary.main'
                        : 'text.disabled',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: 180,
                      overflow: 'hidden',
                      bgcolor: 'grey.100',
                    }}
                  >
                    <Box
                      component="img"
                      src={tmpl.thumbnail}
                      alt={tmpl.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Chip
                      label={tmpl.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      p: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                    >
                      {tmpl.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2.5, flexGrow: 1, minHeight: 40 }}
                    >
                      {tmpl.description}
                    </Typography>

                    {tmpl.available ? (
                      <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        color={isSelected ? 'success' : 'primary'}
                        fullWidth
                        startIcon={
                          isSelected ? <CheckCircleRoundedIcon /> : undefined
                        }
                        onClick={() => {
                          setConfig((prev) =>
                            prev ? { ...prev, templateId: tmpl.id } : null,
                          );
                          showToast(
                            'success',
                            `Template ${tmpl.name} dipilih!`,
                          );
                        }}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {isSelected ? 'Sedang Aktif' : 'Gunakan Template Ini'}
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        fullWidth
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                      >
                        Segera Hadir
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};
