'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import PaletteIcon from '@mui/icons-material/Palette';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import { useAdminStore } from '@/stores/useAdminStore';

export const TemplatesCatalog: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaletteIcon sx={{ color: 'primary.light', fontSize: 22 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Katalog Template Undangan
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Seluruh koleksi template website undangan yang tersedia di platform
            WEDFLOW SaaS.
          </Typography>
        </Box>
      </Box>

      {/* Template Grid */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {AVAILABLE_TEMPLATES.map((tmpl) => {
          const countUsing = invitations.filter(
            (i) => i.templateId === tmpl.id,
          ).length;
          return (
            <Grid key={tmpl.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, border-color 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: tmpl.available ? 'primary.dark' : 'divider',
                  },
                  ...(tmpl.available ? {} : { opacity: 0.7 }),
                }}
              >
                {/* Preview Thumbnail */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={160}
                    image={tmpl.thumbnail}
                    alt={tmpl.name}
                    sx={{ objectFit: 'cover', bgcolor: '#0d1220' }}
                  />
                  <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                    <Chip
                      label={tmpl.badge}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.75)',
                        color: 'primary.light',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        backdropFilter: 'none',
                        border: '1px solid rgba(99,102,241,0.4)',
                      }}
                    />
                  </Box>
                  {tmpl.available && (
                    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                      <CheckCircleIcon
                        sx={{ color: 'success.main', fontSize: 18 }}
                      />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
                  >
                    {tmpl.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                  >
                    {tmpl.description}
                  </Typography>
                </CardContent>

                <Divider sx={{ mx: 2, mt: 1.5 }} />

                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    Dipakai:{' '}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ fontWeight: 700, color: 'text.primary' }}
                    >
                      {countUsing}
                    </Typography>{' '}
                    undangan
                  </Typography>
                  <Chip
                    label={tmpl.available ? 'Tersedia' : 'Coming Soon'}
                    size="small"
                    color={tmpl.available ? 'success' : 'warning'}
                    sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
                  />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Developer Guide */}
      <Alert
        severity="info"
        icon={<CodeIcon />}
        sx={{
          bgcolor: 'rgba(14,165,233,0.06)',
          border: '1px solid rgba(14,165,233,0.2)',
          '& .MuiAlert-message': { width: '100%' },
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
          💡 Cara Menambahkan Template Baru
        </AlertTitle>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', lineHeight: 1.7 }}
        >
          Tambahkan file template baru di{' '}
          <code>components/templates/[NamaTemplate].tsx</code> dan daftarkan di{' '}
          <code>components/templates/registry.ts</code>. Seluruh sistem SaaS,
          Studio CMS, dan routing publik akan langsung mengenali template baru
          secara otomatis — tanpa mengubah skema database!
        </Typography>
      </Alert>
    </Box>
  );
};
