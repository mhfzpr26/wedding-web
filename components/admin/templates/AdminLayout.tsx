'use client';

import type React from 'react';
import { useEffect } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import { useAdminStore } from '@/stores/useAdminStore';
import { AdminNavHeader } from '@/components/admin/molecules/AdminNavHeader';
import { DashboardOverview } from '@/components/admin/organisms/DashboardOverview';
import { ClientsManager } from '@/components/admin/organisms/ClientsManager';
import { StudioEditor } from '@/components/admin/organisms/StudioEditor';
import { TemplatesCatalog } from '@/components/admin/organisms/TemplatesCatalog';
import { ClientModal } from '@/components/admin/organisms/ClientModal';
import { InvitationModal } from '@/components/admin/organisms/InvitationModal';
import { DeleteConfirmModal } from '@/components/admin/molecules/DeleteConfirmModal';
import { AdminToast } from '@/components/admin/atoms/AdminToast';

export const AdminLayout: React.FC = () => {
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const loading = useAdminStore((s) => s.loading);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const loadInvitationConfig = useAdminStore((s) => s.loadInvitationConfig);
  const toast = useAdminStore((s) => s.toast);
  const setToast = useAdminStore((s) => s.setToast);

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
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem',
          }}
        >
          <LayersIcon sx={{ color: 'var(--admin-primary)', fontSize: 28 }} />
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem' }}>
            WED<span style={{ color: 'var(--admin-primary-light)' }}>FLOW</span>
          </h2>
        </div>
        <p
          style={{
            color: 'var(--admin-text-secondary)',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
          }}
        >
          Menghubungkan ke PostgreSQL database & memuat command platform...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SaaS Studio Top Header */}
      <AdminNavHeader />

      {/* Main SaaS Container */}
      <main className="admin-main">
        {primaryTab === 'dashboard' && <DashboardOverview />}
        {primaryTab === 'clients' && <ClientsManager />}
        {primaryTab === 'editor' && <StudioEditor />}
        {primaryTab === 'templates' && <TemplatesCatalog />}
      </main>

      {/* Modals */}
      <ClientModal />
      <InvitationModal />
      <DeleteConfirmModal />

      {/* Floating Toast Notification */}
      {toast && (
        <AdminToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
