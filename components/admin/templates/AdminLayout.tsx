'use client';

import LayersIcon from '@mui/icons-material/Layers';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/molecules/AdminSidebar';
import { AdminTopBar } from '@/components/admin/molecules/AdminTopBar';
import { DeleteConfirmModal } from '@/components/admin/molecules/DeleteConfirmModal';
import { ChangePasswordModal } from '@/components/admin/organisms/ChangePasswordModal';
import { ClientModal } from '@/components/admin/organisms/ClientModal';
import { ClientsManager } from '@/components/admin/organisms/ClientsManager';
import { DashboardOverview } from '@/components/admin/organisms/DashboardOverview';
import { InvitationModal } from '@/components/admin/organisms/InvitationModal';
import { StudioEditor } from '@/components/admin/organisms/StudioEditor';
import { TemplatesCatalog } from '@/components/admin/organisms/TemplatesCatalog';
import { useAdminStore } from '@/stores/useAdminStore';

const SIDEBAR_WIDTH = 240;

export const AdminLayout: React.FC = () => {
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const loading = useAdminStore((s) => s.loading);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const loadInvitationConfig = useAdminStore((s) => s.loadInvitationConfig);

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    refreshSaasData();
  }, [refreshSaasData]);

  useEffect(() => {
    if (selectedInvitationId) {
      loadInvitationConfig(selectedInvitationId);
    }
  }, [selectedInvitationId, loadInvitationConfig]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          size={36}
          thickness={3}
          sx={{ color: 'primary.main' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <LayersIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: 'text.primary' }}
          >
            WED<span style={{ color: '#818cf8' }}>FLOW</span>
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Menghubungkan ke database & memuat SaaS platform…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Responsive Sidebar (Temporary Drawer on Mobile, Permanent on Desktop) */}
      <AdminSidebar
        width={SIDEBAR_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Top App Bar with hamburger menu toggle */}
        <AdminTopBar
          onToggleMobileMenu={() => setMobileOpen((prev) => !prev)}
        />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            overflow: 'auto',
          }}
        >
          {primaryTab === 'dashboard' && <DashboardOverview />}
          {primaryTab === 'clients' && <ClientsManager />}
          {primaryTab === 'editor' && <StudioEditor />}
          {primaryTab === 'templates' && <TemplatesCatalog />}
        </Box>
      </Box>

      {/* Global Modals */}
      <ClientModal />
      <InvitationModal />
      <DeleteConfirmModal />
      <ChangePasswordModal />
    </Box>
  );
};
