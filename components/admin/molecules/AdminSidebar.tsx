'use client';

import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TuneIcon from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import type { PrimaryTab } from '@/stores/useAdminStore';
import { useAdminStore } from '@/stores/useAdminStore';

interface AdminSidebarProps {
  width: number;
  mobileOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: PrimaryTab;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon fontSize="small" />,
    description: 'Overview & undangan',
  },
  {
    id: 'clients',
    label: 'Data Client',
    icon: <PeopleIcon fontSize="small" />,
    description: 'Manajemen klien',
  },
  {
    id: 'editor',
    label: 'Studio Editor',
    icon: <TuneIcon fontSize="small" />,
    description: 'Edit konten undangan',
  },
  {
    id: 'templates',
    label: 'Template Catalog',
    icon: <PaletteIcon fontSize="small" />,
    description: 'Pilih & preview desain',
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  width,
  mobileOpen = false,
  onClose,
}) => {
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const clients = useAdminStore((s) => s.clients);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const setClientForm = useAdminStore((s) => s.setClientForm);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);

  const handleAddClient = () => {
    setClientForm({
      id: '',
      name: '',
      phone: '',
      email: '',
      package: 'Standard',
      notes: '',
      status: 'active',
    });
    setShowClientModal(true);
    if (onClose) onClose();
  };

  const handleCreateInv = () => {
    setShowCreateInvModal(true);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            component="img"
            src="/invatera-icon-nobg.png"
            alt="Invatera"
            sx={{
              width: 34,
              height: 34,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: 'text.primary',
                letterSpacing: '-0.3px',
                lineHeight: 1,
                fontSize: '1.15rem',
              }}
            >
              INVA<span style={{ color: '#06b6d4' }}>TERA</span>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#818cf8',
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                mt: 0.2,
              }}
            >
              Digital Invitations
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<PersonAddIcon fontSize="small" />}
          onClick={handleAddClient}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            py: 0.9,
            background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
            boxShadow: '0 3px 12px rgba(124, 58, 237, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6d28d9 0%, #0891b2 100%)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
            },
          }}
        >
          Tambah Client
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={handleCreateInv}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            py: 0.9,
            borderColor: 'rgba(124, 58, 237, 0.3)',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(124, 58, 237, 0.05)',
            },
          }}
        >
          Buat Undangan
        </Button>
      </Box>

      <Divider sx={{ mx: 2, my: 0.5 }} />

      {/* Navigation */}
      <Box sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            px: 1.5,
            mb: 0.5,
            display: 'block',
          }}
        >
          Menu
        </Typography>
        <List disablePadding>
          {navItems.map((item) => (
            <Tooltip
              key={item.id}
              title={item.description}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={primaryTab === item.id}
                onClick={() => {
                  setPrimaryTab(item.id);
                  if (onClose) onClose();
                }}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  transition: 'all 0.15s ease',
                  '&.Mui-selected': {
                    bgcolor: 'rgba(124, 58, 237, 0.08)',
                    borderLeft: '3px solid #7c3aed',
                    '& .MuiListItemIcon-root': {
                      color: '#7c3aed',
                    },
                    '& .MuiListItemText-primary': {
                      fontWeight: 700,
                      color: '#7c3aed',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {item.id === 'clients' && (
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'rgba(124,58,237,0.1)',
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '0.68rem',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: 1,
                      minWidth: 22,
                      textAlign: 'center',
                    }}
                  >
                    {clients.length}
                  </Typography>
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ px: 2, py: 2 }}>
        <Tooltip title="Lihat contoh undangan live" placement="right">
          <Button
            variant="text"
            size="small"
            endIcon={<OpenInNewIcon fontSize="small" />}
            href="/undangan/destia-rakafansa"
            target="_blank"
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              color: 'text.secondary',
              fontSize: '0.78rem',
              '&:hover': { color: 'primary.light' },
            }}
          >
            Preview Undangan
          </Button>
        </Tooltip>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.65rem',
            display: 'block',
            mt: 1,
            pl: 0.5,
          }}
        >
          INVATERA v2.0 — © 2026
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};
