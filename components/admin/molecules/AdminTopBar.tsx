'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import RefreshIcon from '@mui/icons-material/Refresh';
import TuneIcon from '@mui/icons-material/Tune';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import type { PrimaryTab } from '@/stores/useAdminStore';
import { useAdminStore } from '@/stores/useAdminStore';

interface AdminTopBarProps {
  onToggleMobileMenu?: () => void;
}

const tabMeta: Record<
  PrimaryTab,
  { label: string; icon: React.ReactNode; subtitle: string }
> = {
  dashboard: {
    label: 'Dashboard & Undangan',
    icon: <DashboardIcon sx={{ fontSize: 18 }} />,
    subtitle: 'Overview seluruh undangan dan statistik platform',
  },
  clients: {
    label: 'Data Client',
    icon: <PeopleIcon sx={{ fontSize: 18 }} />,
    subtitle: 'Manajemen klien dan akun layanan',
  },
  editor: {
    label: 'Studio Editor Konten',
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    subtitle: 'Edit konten dinamis tiap undangan',
  },
  templates: {
    label: 'Template Catalog',
    icon: <PaletteIcon sx={{ fontSize: 18 }} />,
    subtitle: 'Pilih dan preview desain template',
  },
};

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onToggleMobileMenu,
}) => {
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const stats = useAdminStore((s) => s.stats);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);

  const meta = tabMeta[primaryTab];

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: '60px !important',
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Mobile Hamburger Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onToggleMobileMenu}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            mr: 0.5,
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        {/* Page Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.5,
              bgcolor: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.light',
              flexShrink: 0,
            }}
          >
            {meta.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
              }}
            >
              {meta.label}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {meta.subtitle}
            </Typography>
          </Box>
        </Box>

        {/* Stats Chips (Desktop & Tablet) */}
        {stats && (
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
            <Chip
              label={`${stats.totalClients} Client`}
              size="small"
              sx={{
                bgcolor: 'rgba(99,102,241,0.12)',
                color: 'primary.light',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            />
            <Chip
              label={`${stats.publishedCount} Aktif`}
              size="small"
              sx={{
                bgcolor: 'rgba(16,185,129,0.1)',
                color: 'success.light',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
            />
            <Chip
              label={`${stats.totalRsvps} RSVP`}
              size="small"
              sx={{
                bgcolor: 'rgba(14,165,233,0.1)',
                color: 'info.light',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1px solid rgba(14,165,233,0.25)',
              }}
            />
          </Box>
        )}

        {/* Refresh Action */}
        <Tooltip title="Refresh Data Platform">
          <IconButton
            size="small"
            onClick={refreshSaasData}
            sx={{
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <RefreshIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
