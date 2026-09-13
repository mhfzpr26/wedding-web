'use client';

import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const AdminNavHeader: React.FC = () => {
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const clients = useAdminStore((s) => s.clients);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const setClientForm = useAdminStore((s) => s.setClientForm);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const setCreateInvForm = useAdminStore((s) => s.setCreateInvForm);

  return (
    <header className="admin-header">
      <div className="admin-header__inner">
        <div className="admin-header__brand">
          <div className="admin-header__logo">
            <LayersIcon sx={{ color: 'var(--admin-primary)', fontSize: 24 }} />
            WED<span>FLOW</span>
          </div>
          <span className="admin-header__badge">Multi-Tenant SaaS</span>
        </div>

        {/* Primary SaaS Navigation Bar */}
        <nav className="admin-primary-nav">
          <button
            type="button"
            className={`admin-primary-nav__item ${
              primaryTab === 'dashboard'
                ? 'admin-primary-nav__item--active'
                : ''
            }`}
            onClick={() => setPrimaryTab('dashboard')}
          >
            <DashboardIcon fontSize="small" /> Dashboard & Undangan
          </button>
          <button
            type="button"
            className={`admin-primary-nav__item ${
              primaryTab === 'clients' ? 'admin-primary-nav__item--active' : ''
            }`}
            onClick={() => setPrimaryTab('clients')}
          >
            <PeopleIcon fontSize="small" /> Data Client ({clients.length})
          </button>
          <button
            type="button"
            className={`admin-primary-nav__item ${
              primaryTab === 'editor' ? 'admin-primary-nav__item--active' : ''
            }`}
            onClick={() => setPrimaryTab('editor')}
          >
            <TuneIcon fontSize="small" /> Studio Editor Konten
          </button>
          <button
            type="button"
            className={`admin-primary-nav__item ${
              primaryTab === 'templates'
                ? 'admin-primary-nav__item--active'
                : ''
            }`}
            onClick={() => setPrimaryTab('templates')}
          >
            <PaletteIcon fontSize="small" /> Katalog Template
          </button>
        </nav>

        <div className="admin-header__actions">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => {
              setClientForm({
                id: '',
                name: '',
                phone: '',
                email: '',
                package: 'Cinematic VIP',
                notes: '',
                status: 'active',
              });
              setShowClientModal(true);
            }}
          >
            <AddIcon fontSize="small" /> Tambah Client
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={() => {
              if (clients.length > 0) {
                setCreateInvForm((prev) => ({
                  ...prev,
                  clientId: prev.clientId || clients[0].id,
                }));
              }
              setShowCreateInvModal(true);
            }}
          >
            <AddCircleIcon fontSize="small" /> Buat Undangan
          </button>
        </div>
      </div>
    </header>
  );
};
