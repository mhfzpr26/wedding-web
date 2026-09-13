'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import './admin.css';
import type {
  ClientRecord,
  InvitationStatus,
  WeddingBankAccount,
  WeddingEventItem,
  WeddingGalleryItem,
  WeddingTimelineItem,
} from '@/types/wedding';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import { useAdminStore } from '@/stores/useAdminStore';

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PaletteIcon from '@mui/icons-material/Palette';
import EventIcon from '@mui/icons-material/Event';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TimerIcon from '@mui/icons-material/Timer';
import CollectionsIcon from '@mui/icons-material/Collections';
import TimelineIcon from '@mui/icons-material/Timeline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function AdminPage() {
  // Zustand Central Admin Store
  const primaryTab = useAdminStore((s) => s.primaryTab);
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const editorTab = useAdminStore((s) => s.editorTab);
  const setEditorTab = useAdminStore((s) => s.setEditorTab);

  const clients = useAdminStore((s) => s.clients);
  const invitations = useAdminStore((s) => s.invitations);
  const setInvitations = useAdminStore((s) => s.setInvitations);
  const stats = useAdminStore((s) => s.stats);

  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const setSelectedInvitationId = useAdminStore(
    (s) => s.setSelectedInvitationId,
  );
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const editorSlug = useAdminStore((s) => s.editorSlug);
  const setEditorSlug = useAdminStore((s) => s.setEditorSlug);
  const editorStatus = useAdminStore((s) => s.editorStatus);
  const setEditorStatus = useAdminStore((s) => s.setEditorStatus);

  const rsvps = useAdminStore((s) => s.rsvps);
  const rsvpStats = useAdminStore((s) => s.rsvpStats);

  const configLoading = useAdminStore((s) => s.configLoading);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);
  const uploading = useAdminStore((s) => s.uploading);
  const setUploading = useAdminStore((s) => s.setUploading);
  const toast = useAdminStore((s) => s.toast);
  const showToast = useAdminStore((s) => s.showToast);

  const showCreateInvModal = useAdminStore((s) => s.showCreateInvModal);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const createInvForm = useAdminStore((s) => s.createInvForm);
  const setCreateInvForm = useAdminStore((s) => s.setCreateInvForm);

  const showClientModal = useAdminStore((s) => s.showClientModal);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const clientForm = useAdminStore((s) => s.clientForm);
  const setClientForm = useAdminStore((s) => s.setClientForm);

  const deleteConfirm = useAdminStore((s) => s.deleteConfirm);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);

  const refreshSaasData = useAdminStore((s) => s.refreshSaasData);
  const loadInvitationConfig = useAdminStore((s) => s.loadInvitationConfig);
  const openEditorForInvitation = useAdminStore(
    (s) => s.openEditorForInvitation,
  );

  useEffect(() => {
    refreshSaasData();
  }, [refreshSaasData]);

  useEffect(() => {
    if (selectedInvitationId) {
      loadInvitationConfig(selectedInvitationId);
    }
  }, [selectedInvitationId, loadInvitationConfig]);

  // Current selected invitation object
  const currentInvitation = useMemo(() => {
    return invitations.find((i) => i.id === selectedInvitationId) || null;
  }, [invitations, selectedInvitationId]);

  // Switch to Content Studio Editor for a specific invitation
  const handleOpenEditor = (invitationId: string) => {
    openEditorForInvitation(invitationId);
  };

  // Quick Change Status in Table or Studio
  const handleUpdateStatus = async (
    invitationId: string,
    newStatus: InvitationStatus,
  ) => {
    try {
      const res = await fetch(`/api/admin/saas/invitations/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        showToast('success', `Status undangan berhasil diubah ke ${newStatus}`);
        setInvitations((prev) =>
          prev.map((i) => (i.id === invitationId ? { ...i, status: newStatus } : i)),
        );
        if (invitationId === selectedInvitationId) {
          setEditorStatus(newStatus);
        }
        refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengubah status');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan jaringan saat mengubah status');
    }
  };

  // Save Tenant Config
  const handleSaveConfig = async () => {
    if (!selectedInvitationId || !config) return;
    setSaving(true);
    try {
      // 1. Save Isolated Config
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}/config`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        },
      );

      // 2. Also check if slug or status in editor changed
      if (
        currentInvitation &&
        (editorSlug !== currentInvitation.slug ||
          editorStatus !== currentInvitation.status)
      ) {
        await fetch(`/api/admin/saas/invitations/${selectedInvitationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: editorSlug,
            status: editorStatus,
          }),
        });
      }

      if (res.ok) {
        showToast('success', 'Konfigurasi undangan berhasil disimpan!');
        refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menyimpan konfigurasi');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  // Generic File Uploader Helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onSuccess(data.url);
        showToast('success', 'File berhasil diunggah!');
      } else {
        showToast('error', data.error || 'Gagal mengunggah file');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat mengunggah file');
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  // Copy Link Helper
  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/undangan/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('success', 'Tautan undangan disalin ke clipboard!');
  };

  // Create New Invitation Handler
  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createInvForm.clientId || !createInvForm.title || !createInvForm.slug) {
      showToast('error', 'Mohon lengkapi seluruh field wajib');
      return;
    }

    try {
      const res = await fetch('/api/admin/saas/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createInvForm),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Undangan baru berhasil dibuat!');
        setShowCreateInvModal(false);
        setCreateInvForm({
          clientId: '',
          title: '',
          slug: '',
          templateId: 'netflix',
          status: 'draft',
          eventDate: new Date().toISOString().split('T')[0],
        });
        await refreshSaasData();
        // Immediately switch to editor for the new invitation
        handleOpenEditor(data.id);
      } else {
        showToast('error', data.error || 'Gagal membuat undangan');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat membuat undangan');
    }
  };

  // Create or Update Client Handler
  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.phone) {
      showToast('error', 'Nama dan nomor WhatsApp wajib diisi');
      return;
    }

    try {
      const isEdit = Boolean(clientForm.id);
      const url = isEdit
        ? `/api/admin/saas/clients/${clientForm.id}`
        : '/api/admin/saas/clients';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientForm),
      });

      if (res.ok) {
        showToast(
          'success',
          isEdit ? 'Data client diperbarui!' : 'Client baru berhasil didaftarkan!',
        );
        setShowClientModal(false);
        setClientForm({
          id: '',
          name: '',
          phone: '',
          email: '',
          package: 'Cinematic VIP',
          notes: '',
          status: 'active',
        });
        refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menyimpan client');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan server saat menyimpan client');
    }
  };

  // Delete Confirm Action
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const url =
        deleteConfirm.type === 'invitation'
          ? `/api/admin/saas/invitations/${deleteConfirm.id}`
          : `/api/admin/saas/clients/${deleteConfirm.id}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        showToast(
          'success',
          `${deleteConfirm.type === 'invitation' ? 'Undangan' : 'Client'} berhasil dihapus!`,
        );
        setDeleteConfirm(null);
        refreshSaasData();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal menghapus data');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menghapus data');
    }
  };

  // Open Edit Client Modal
  const handleOpenEditClient = (client: ClientRecord) => {
    setClientForm({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      package: client.package || 'Standard',
      notes: client.notes || '',
      status: client.status,
    });
    setShowClientModal(true);
  };

  // Open Create Invitation with Client preselected
  const handleOpenCreateInvForClient = (clientId: string, clientName: string) => {
    const suggestedSlug = clientName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    setCreateInvForm({
      clientId,
      title: `${clientName} | The Wedding`,
      slug: suggestedSlug,
      templateId: 'netflix',
      status: 'draft',
      eventDate: new Date().toISOString().split('T')[0],
    });
    setShowCreateInvModal(true);
  };

  return (
    <div className="admin-layout">
      {/* SaaS Studio Top Header */}
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__brand">
            <div className="admin-header__logo">
              WEDDING<span>SAAS</span>
            </div>
            <span className="admin-header__badge">Super Admin Command</span>
          </div>

          {/* Primary SaaS Navigation Bar */}
          <nav className="admin-primary-nav">
            <button
              type="button"
              className={`admin-primary-nav__item ${
                primaryTab === 'dashboard' ? 'admin-primary-nav__item--active' : ''
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
                primaryTab === 'templates' ? 'admin-primary-nav__item--active' : ''
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

      {/* Main SaaS Container */}
      <main className="admin-main">
        {/* =========================================================================
            TAB 1: DASHBOARD & UNDANGAN
            ========================================================================= */}
        {primaryTab === 'dashboard' && (
          <div>
            {/* KPI Cards Grid */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-card__info">
                  <span className="admin-kpi-card__label">Total Client</span>
                  <span className="admin-kpi-card__value">
                    {stats?.totalClients ?? clients.length}
                  </span>
                  <span className="admin-kpi-card__sub">Client terdaftar</span>
                </div>
                <div className="admin-kpi-card__icon">
                  <PeopleIcon fontSize="large" />
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-card__info">
                  <span className="admin-kpi-card__label">Undangan Aktif</span>
                  <span
                    className="admin-kpi-card__value"
                    style={{ color: 'var(--admin-green)' }}
                  >
                    {stats?.publishedCount ??
                      invitations.filter((i) => i.status === 'published').length}
                  </span>
                  <span className="admin-kpi-card__sub">Live & dapat diakses publik</span>
                </div>
                <div className="admin-kpi-card__icon">
                  <CheckCircleIcon
                    fontSize="large"
                    style={{ color: 'var(--admin-green)' }}
                  />
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-card__info">
                  <span className="admin-kpi-card__label">Undangan Draft</span>
                  <span
                    className="admin-kpi-card__value"
                    style={{ color: 'var(--admin-amber)' }}
                  >
                    {stats?.draftCount ??
                      invitations.filter((i) => i.status === 'draft').length}
                  </span>
                  <span className="admin-kpi-card__sub">Sedang disunting</span>
                </div>
                <div className="admin-kpi-card__icon">
                  <EditIcon fontSize="large" style={{ color: 'var(--admin-amber)' }} />
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-card__info">
                  <span className="admin-kpi-card__label">Total RSVP Tamu</span>
                  <span className="admin-kpi-card__value">
                    {stats?.totalRsvps ?? 0}
                  </span>
                  <span className="admin-kpi-card__sub">Seluruh undangan SaaS</span>
                </div>
                <div className="admin-kpi-card__icon">
                  <AssignmentTurnedInIcon fontSize="large" />
                </div>
              </div>
            </div>

            {/* Master Invitations Table */}
            <div className="admin-card">
              <div className="admin-card__header">
                <div className="admin-card__title-group">
                  <h2 className="admin-card__title">
                    <DashboardIcon /> Seluruh Undangan Client
                  </h2>
                  <span className="admin-card__desc">
                    Kelola status, preview link, dan kustomisasi konten untuk setiap
                    undangan client dari satu tempat terpusat.
                  </span>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={() => setShowCreateInvModal(true)}
                >
                  <AddCircleIcon fontSize="small" /> Buat Undangan Baru
                </button>
              </div>

              {invitations.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--admin-text-secondary)',
                  }}
                >
                  <MovieIcon style={{ fontSize: '3.5rem', opacity: 0.3 }} />
                  <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                    Belum ada undangan yang dibuat. Silakan klik tombol "Buat Undangan"
                    di atas.
                  </p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client & Pemilik</th>
                        <th>Judul Undangan</th>
                        <th>Template</th>
                        <th>Slug & URL Publik</th>
                        <th>Status Publikasi</th>
                        <th>RSVP Tamu</th>
                        <th style={{ textAlign: 'right' }}>Aksi Pengelolaan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <div style={{ fontWeight: 700 }}>
                              {inv.client?.name || 'Client Umum'}
                            </div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--admin-text-muted)',
                              }}
                            >
                              Paket: {inv.client?.package || 'Standard'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{inv.title}</div>
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--admin-text-muted)',
                              }}
                            >
                              Tgl Acara: {inv.eventDate}
                            </div>
                          </td>
                          <td>
                            <span className="admin-template-badge">
                              {inv.templateId.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <code
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.06)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                }}
                              >
                                /undangan/{inv.slug}
                              </code>
                              <button
                                type="button"
                                title="Salin Tautan"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--admin-text-secondary)',
                                  cursor: 'pointer',
                                  padding: '2px',
                                }}
                                onClick={() => handleCopyLink(inv.slug)}
                              >
                                <ContentCopyIcon fontSize="inherit" />
                              </button>
                            </div>
                          </td>
                          <td>
                            <select
                              className="admin-status-select"
                              value={inv.status}
                              onChange={(e) =>
                                handleUpdateStatus(
                                  inv.id,
                                  e.target.value as InvitationStatus,
                                )
                              }
                            >
                              <option value="draft">🟡 Draft (Pratinjau)</option>
                              <option value="published">🟢 Published (Live)</option>
                              <option value="inactive">🔴 Nonaktif</option>
                            </select>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700 }}>
                              {inv.rsvpsCount ?? 0}
                            </span>{' '}
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--admin-green)',
                              }}
                            >
                              ({inv.attendingCount ?? 0} Hadir)
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <button
                                type="button"
                                className="admin-btn admin-btn--primary admin-btn--sm"
                                title="Kelola Konten di Studio Editor"
                                onClick={() => handleOpenEditor(inv.id)}
                              >
                                <TuneIcon fontSize="inherit" /> Edit Konten
                              </button>
                              <Link
                                href={`/undangan/${inv.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn--outline admin-btn--sm"
                                title="Lihat Tampilan Langsung"
                              >
                                <VisibilityIcon fontSize="inherit" />
                              </Link>
                              <button
                                type="button"
                                className="admin-btn admin-btn--danger admin-btn--sm"
                                title="Hapus Undangan Ini"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'invitation',
                                    id: inv.id,
                                    title: inv.title,
                                  })
                                }
                              >
                                <DeleteIcon fontSize="inherit" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: DATA CLIENT (CRM)
            ========================================================================= */}
        {primaryTab === 'clients' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div className="admin-card__title-group">
                <h2 className="admin-card__title">
                  <PeopleIcon /> CRM Pengelolaan Client
                </h2>
                <span className="admin-card__desc">
                  Data seluruh pemesan undangan, paket langganan, dan nomor kontak
                  WhatsApp untuk koordinasi cepat.
                </span>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
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
                <AddIcon fontSize="small" /> Tambah Client Baru
              </button>
            </div>

            {clients.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: 'var(--admin-text-secondary)',
                }}
              >
                <PeopleIcon style={{ fontSize: '3.5rem', opacity: 0.3 }} />
                <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                  Belum ada data client. Tambahkan client pertama Anda.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Client / PIC</th>
                      <th>Kontak WhatsApp</th>
                      <th>Email</th>
                      <th>Paket</th>
                      <th>Total Undangan</th>
                      <th>Status Akun</th>
                      <th style={{ textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => {
                      const cleanPhone = client.phone.replace(/[^0-9]/g, '');
                      const waPhone = cleanPhone.startsWith('0')
                        ? `62${cleanPhone.slice(1)}`
                        : cleanPhone;

                      return (
                        <tr key={client.id}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{client.name}</div>
                            {client.notes && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--admin-text-muted)',
                                }}
                              >
                                {client.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            <a
                              href={`https://wa.me/${waPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="admin-btn admin-btn--sm admin-btn--success"
                              style={{ textDecoration: 'none' }}
                            >
                              <WhatsAppIcon fontSize="inherit" /> {client.phone}
                            </a>
                          </td>
                          <td style={{ color: 'var(--admin-text-secondary)' }}>
                            {client.email || '-'}
                          </td>
                          <td>
                            <span
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                              }}
                            >
                              {client.package}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700 }}>
                              {client.invitationsCount ?? 0} Undangan
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-status-badge admin-status-badge--${
                                client.status === 'active' ? 'published' : 'inactive'
                              }`}
                            >
                              <span className="admin-status-badge__dot" />
                              {client.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <button
                                type="button"
                                className="admin-btn admin-btn--secondary admin-btn--sm"
                                title="Buat Undangan untuk Client ini"
                                onClick={() =>
                                  handleOpenCreateInvForClient(
                                    client.id,
                                    client.name,
                                  )
                                }
                              >
                                <AddCircleIcon fontSize="inherit" /> Buat Undangan
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn--outline admin-btn--sm"
                                title="Edit Data Client"
                                onClick={() => handleOpenEditClient(client)}
                              >
                                <EditIcon fontSize="inherit" />
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn--danger admin-btn--sm"
                                title="Hapus Client"
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'client',
                                    id: client.id,
                                    title: client.name,
                                  })
                                }
                              >
                                <DeleteIcon fontSize="inherit" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: STUDIO EDITOR KONTEN DINAMIS (SCOPED TO SELECTED INVITATION)
            ========================================================================= */}
        {primaryTab === 'editor' && (
          <div>
            {/* Top Editor Context Switcher Bar */}
            <div className="admin-editor-bar">
              <div className="admin-editor-bar__info">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline admin-btn--sm"
                  onClick={() => setPrimaryTab('dashboard')}
                >
                  <ArrowBackIcon fontSize="inherit" /> Dashboard
                </button>
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--admin-red)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    SEDANG MENYUNTING UNDANGAN
                  </div>
                  <h2 className="admin-editor-bar__title">
                    {currentInvitation?.title || 'Pilih Undangan'}
                  </h2>
                </div>
              </div>

              {/* Quick Switcher & Controls */}
              <div className="admin-editor-bar__controls">
                <label
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--admin-text-secondary)',
                  }}
                >
                  Ganti Undangan:
                </label>
                <select
                  className="admin-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
                  value={selectedInvitationId}
                  onChange={(e) => setSelectedInvitationId(e.target.value)}
                >
                  {invitations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title} ({i.slug})
                    </option>
                  ))}
                </select>

                <label
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--admin-text-secondary)',
                    marginLeft: '0.5rem',
                  }}
                >
                  Slug:
                </label>
                <input
                  type="text"
                  className="admin-input"
                  style={{ width: '160px', padding: '0.4rem 0.6rem' }}
                  value={editorSlug}
                  onChange={(e) => setEditorSlug(e.target.value)}
                  placeholder="slug-undangan"
                />

                <select
                  className="admin-status-select"
                  value={editorStatus}
                  onChange={(e) =>
                    setEditorStatus(e.target.value as InvitationStatus)
                  }
                >
                  <option value="draft">🟡 Draft</option>
                  <option value="published">🟢 Published</option>
                  <option value="inactive">🔴 Nonaktif</option>
                </select>

                {currentInvitation && (
                  <Link
                    href={`/undangan/${editorSlug || currentInvitation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn--outline"
                  >
                    <VisibilityIcon fontSize="small" /> Preview Live
                  </Link>
                )}

                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  onClick={handleSaveConfig}
                  disabled={saving || !config}
                >
                  <SaveIcon fontSize="small" />{' '}
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

            {configLoading || !config ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '5rem 0',
                  color: 'var(--admin-text-secondary)',
                }}
              >
                <MovieIcon
                  style={{
                    fontSize: '3rem',
                    opacity: 0.3,
                    animation: 'spin 2s linear infinite',
                  }}
                />
                <p style={{ marginTop: '1rem' }}>
                  Memuat data konfigurasi tenant undangan...
                </p>
              </div>
            ) : (
              <>
                {/* 11 Navigation Tabs for Content Studio */}
                <nav className="admin-nav">
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'template' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('template')}
                  >
                    <PaletteIcon fontSize="small" /> 1. Template
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'couple' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('couple')}
                  >
                    <PeopleIcon fontSize="small" /> 2. Mempelai
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'events' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('events')}
                  >
                    <EventIcon fontSize="small" /> 3. Acara & Rangkaian
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'media' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('media')}
                  >
                    <MusicNoteIcon fontSize="small" /> 4. Musik & Video
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'cover' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('cover')}
                  >
                    <MovieIcon fontSize="small" /> 5. Cover & Opening
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'countdown' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('countdown')}
                  >
                    <TimerIcon fontSize="small" /> 6. Countdown
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'gallery' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('gallery')}
                  >
                    <CollectionsIcon fontSize="small" /> 7. Galeri Foto
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'story' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('story')}
                  >
                    <TimelineIcon fontSize="small" /> 8. Love Story
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'gifts' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('gifts')}
                  >
                    <CardGiftcardIcon fontSize="small" /> 9. Hadiah Digital
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'closing' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('closing')}
                  >
                    <MovieIcon fontSize="small" /> 10. Closing & Credits
                  </button>
                  <button
                    type="button"
                    className={`admin-nav__item ${
                      editorTab === 'rsvps' ? 'admin-nav__item--active' : ''
                    }`}
                    onClick={() => setEditorTab('rsvps')}
                  >
                    <AssignmentTurnedInIcon fontSize="small" /> 11. RSVP (
                    {rsvps.length})
                  </button>
                </nav>

                {/* --- SUBTAB 1: TEMPLATE SELECTOR --- */}
                {editorTab === 'template' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          Pilih Tema Template Undangan
                        </h3>
                        <span className="admin-card__desc">
                          Pilih template tampilan untuk undangan ini. Desain
                          dirancang modular sehingga penambahan template baru tidak
                          mengganggu data.
                        </span>
                      </div>
                    </div>

                    <div className="admin-template-grid">
                      {AVAILABLE_TEMPLATES.map((tmpl) => {
                        const isSelected = config.templateId === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            className={`admin-template-card ${
                              isSelected ? 'admin-template-card--active' : ''
                            }`}
                          >
                            <div className="admin-template-card__preview">
                              <img
                                src={tmpl.thumbnail}
                                alt={tmpl.name}
                                className="admin-template-card__thumb"
                              />
                              <span className="admin-template-card__badge">
                                {tmpl.badge}
                              </span>
                            </div>
                            <div className="admin-template-card__body">
                              <div>
                                <h4 className="admin-template-card__title">
                                  {tmpl.name}
                                </h4>
                                <p className="admin-template-card__desc">
                                  {tmpl.description}
                                </p>
                              </div>
                              <div>
                                {tmpl.available ? (
                                  <button
                                    type="button"
                                    className={`admin-btn ${
                                      isSelected
                                        ? 'admin-btn--success'
                                        : 'admin-btn--primary'
                                    }`}
                                    style={{ width: '100%' }}
                                    onClick={() => {
                                      setConfig((prev) =>
                                        prev
                                          ? { ...prev, templateId: tmpl.id }
                                          : null,
                                      );
                                      showToast(
                                        'success',
                                        `Template ${tmpl.name} dipilih!`,
                                      );
                                    }}
                                  >
                                    {isSelected ? (
                                      <>
                                        <CheckCircleIcon fontSize="small" /> Sedang
                                        Aktif
                                      </>
                                    ) : (
                                      'Gunakan Template Ini'
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn--outline"
                                    style={{ width: '100%' }}
                                    disabled
                                  >
                                    Segera Hadir
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 2: MEMPELAI --- */}
                {editorTab === 'couple' && (
                  <div className="admin-grid-2">
                    {/* Mempelai Wanita */}
                    <div className="admin-card">
                      <h3 className="admin-card__title" style={{ color: '#ff758f' }}>
                        👰 Mempelai Wanita (The Bride)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.couple.bride.name}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      bride: {
                                        ...prev.couple.bride,
                                        name: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Panggilan</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.bride.callname}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        bride: {
                                          ...prev.couple.bride,
                                          callname: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Akun Instagram</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.bride.instagram || ''}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        bride: {
                                          ...prev.couple.bride,
                                          instagram: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Karakter / Role (Tema Netflix)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.couple.bride.characterRole || ''}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      bride: {
                                        ...prev.couple.bride,
                                        characterRole: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Bio Singkat</label>
                        <textarea
                          className="admin-textarea"
                          rows={3}
                          value={config.couple.bride.bio || ''}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      bride: {
                                        ...prev.couple.bride,
                                        bio: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Ayah</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.bride.parents.father}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        bride: {
                                          ...prev.couple.bride,
                                          parents: {
                                            ...prev.couple.bride.parents,
                                            father: e.target.value,
                                          },
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Ibu</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.bride.parents.mother}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        bride: {
                                          ...prev.couple.bride,
                                          parents: {
                                            ...prev.couple.bride.parents,
                                            mother: e.target.value,
                                          },
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Foto Mempelai Wanita</label>
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                          }}
                        >
                          {config.couple.bride.photo && (
                            <img
                              src={config.couple.bride.photo}
                              alt="Bride"
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--admin-red)',
                              }}
                            />
                          )}
                          <label className="admin-btn admin-btn--secondary">
                            <CloudUploadIcon fontSize="small" />{' '}
                            {uploading === 'bridePhoto'
                              ? 'Mengunggah...'
                              : 'Upload Foto'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileUpload(e, 'bridePhoto', (url) =>
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          couple: {
                                            ...prev.couple,
                                            bride: {
                                              ...prev.couple.bride,
                                              photo: url,
                                            },
                                          },
                                        }
                                      : null,
                                  ),
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1 }}
                            value={config.couple.bride.photo || ''}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        bride: {
                                          ...prev.couple.bride,
                                          photo: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                            placeholder="atau masukkan URL foto..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mempelai Pria */}
                    <div className="admin-card">
                      <h3 className="admin-card__title" style={{ color: '#60a5fa' }}>
                        🤵 Mempelai Pria (The Groom)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Nama Lengkap & Gelar</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.couple.groom.name}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      groom: {
                                        ...prev.couple.groom,
                                        name: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Panggilan</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.groom.callname}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        groom: {
                                          ...prev.couple.groom,
                                          callname: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Akun Instagram</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.groom.instagram || ''}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        groom: {
                                          ...prev.couple.groom,
                                          instagram: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Karakter / Role (Tema Netflix)
                        </label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.couple.groom.characterRole || ''}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      groom: {
                                        ...prev.couple.groom,
                                        characterRole: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Bio Singkat</label>
                        <textarea
                          className="admin-textarea"
                          rows={3}
                          value={config.couple.groom.bio || ''}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    couple: {
                                      ...prev.couple,
                                      groom: {
                                        ...prev.couple.groom,
                                        bio: e.target.value,
                                      },
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-grid-2">
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Ayah</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.groom.parents.father}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        groom: {
                                          ...prev.couple.groom,
                                          parents: {
                                            ...prev.couple.groom.parents,
                                            father: e.target.value,
                                          },
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Nama Ibu</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.couple.groom.parents.mother}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        groom: {
                                          ...prev.couple.groom,
                                          parents: {
                                            ...prev.couple.groom.parents,
                                            mother: e.target.value,
                                          },
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Foto Mempelai Pria</label>
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                          }}
                        >
                          {config.couple.groom.photo && (
                            <img
                              src={config.couple.groom.photo}
                              alt="Groom"
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--admin-red)',
                              }}
                            />
                          )}
                          <label className="admin-btn admin-btn--secondary">
                            <CloudUploadIcon fontSize="small" />{' '}
                            {uploading === 'groomPhoto'
                              ? 'Mengunggah...'
                              : 'Upload Foto'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileUpload(e, 'groomPhoto', (url) =>
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          couple: {
                                            ...prev.couple,
                                            groom: {
                                              ...prev.couple.groom,
                                              photo: url,
                                            },
                                          },
                                        }
                                      : null,
                                  ),
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ flex: 1 }}
                            value={config.couple.groom.photo || ''}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      couple: {
                                        ...prev.couple,
                                        groom: {
                                          ...prev.couple.groom,
                                          photo: e.target.value,
                                        },
                                      },
                                    }
                                  : null,
                              )
                            }
                            placeholder="atau masukkan URL foto..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 3: ACARA & RANGKAIAN (EPISODES) --- */}
                {editorTab === 'events' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          Daftar Rangkaian Acara (Episodes)
                        </h3>
                        <span className="admin-card__desc">
                          Atur acara seperti Akad Nikah, Resepsi, atau Ngunduh
                          Mantu dengan lokasi, link Google Maps, dan integrasi Google
                          Calendar.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          const newEvent: WeddingEventItem = {
                            id: `event_${Date.now()}`,
                            type: 'RESEPSI PERNIKAHAN',
                            episodeNumber: (config.events?.length || 0) + 1,
                            title: 'The Celebration Party',
                            duration: '120 Menit',
                            synopsis: 'Pesta syukuran dan ramah tamah pernikahan.',
                            date: 'Sabtu, 14 November 2026',
                            time: '11:00 - 13:00 WIB',
                            venue: 'Grand Ballroom',
                            address: 'Alamat lengkap tempat resepsi',
                            mapUrl: 'https://maps.google.com',
                            calendarUrl: 'https://calendar.google.com',
                          };
                          setConfig((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  events: [...(prev.events || []), newEvent],
                                }
                              : null,
                          );
                        }}
                      >
                        <AddIcon fontSize="small" /> Tambah Rangkaian Acara
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {config.events.map((ev, index) => (
                        <div
                          key={ev.id || index}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            padding: '1.25rem',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '1rem',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 800,
                                color: 'var(--admin-red)',
                                fontSize: '0.9rem',
                                letterSpacing: '0.05em',
                              }}
                            >
                              EPISODE {ev.episodeNumber || index + 1}: {ev.type}
                            </span>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger admin-btn--sm"
                              onClick={() => {
                                setConfig((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        events: prev.events.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }
                                    : null,
                                );
                              }}
                            >
                              <DeleteIcon fontSize="inherit" /> Hapus
                            </button>
                          </div>

                          <div className="admin-grid-3">
                            <div className="admin-form-group">
                              <label className="admin-label">Tipe Acara</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.type}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].type = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-label">Judul Episode</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.title}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].title = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-label">Durasi Tayang</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.duration}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].duration = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="admin-grid-2">
                            <div className="admin-form-group">
                              <label className="admin-label">Hari & Tanggal</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.date}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].date = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-label">Waktu / Jam Pelaksanaan</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.time}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].time = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="admin-grid-2">
                            <div className="admin-form-group">
                              <label className="admin-label">Nama Tempat / Gedung</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.venue}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].venue = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-label">Alamat Lengkap</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.address}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].address = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="admin-grid-2">
                            <div className="admin-form-group">
                              <label className="admin-label">Link Google Maps</label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.mapUrl}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].mapUrl = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label className="admin-label">
                                Link Simpan ke Google Calendar
                              </label>
                              <input
                                type="text"
                                className="admin-input"
                                value={ev.calendarUrl}
                                onChange={(e) => {
                                  const updated = [...config.events];
                                  updated[index].calendarUrl = e.target.value;
                                  setConfig((prev) =>
                                    prev ? { ...prev, events: updated } : null,
                                  );
                                }}
                              />
                            </div>
                          </div>

                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label className="admin-label">Sinopsis Episode</label>
                            <textarea
                              className="admin-textarea"
                              rows={2}
                              value={ev.synopsis}
                              onChange={(e) => {
                                const updated = [...config.events];
                                updated[index].synopsis = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, events: updated } : null,
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 4: MEDIA & MUSIK --- */}
                {editorTab === 'media' && (
                  <div className="admin-grid-2">
                    <div className="admin-card">
                      <h3 className="admin-card__title">
                        🎵 Musik Latar (Background Song)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Judul Lagu</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.music.title}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    music: {
                                      ...prev.music,
                                      title: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">File Musik MP3</label>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                          }}
                        >
                          <label className="admin-btn admin-btn--secondary">
                            <CloudUploadIcon fontSize="small" />{' '}
                            {uploading === 'audioFile'
                              ? 'Mengunggah MP3...'
                              : 'Upload MP3'}
                            <input
                              type="file"
                              accept="audio/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileUpload(e, 'audioFile', (url) =>
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          music: {
                                            ...prev.music,
                                            audioUrl: url,
                                          },
                                        }
                                      : null,
                                  ),
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.music.audioUrl}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      music: {
                                        ...prev.music,
                                        audioUrl: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                            placeholder="/audio/wedding-song.mp3"
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label
                          className="admin-label"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={config.music.autoplay}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      music: {
                                        ...prev.music,
                                        autoplay: e.target.checked,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                          Putar otomatis setelah tamu menekan tombol buka undangan
                        </label>
                      </div>
                    </div>

                    <div className="admin-card">
                      <h3 className="admin-card__title">
                        🎬 Video Trailer Teaser (Cinema)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Judul Video Film</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.trailer.filmTitle}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    trailer: {
                                      ...prev.trailer,
                                      filmTitle: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">URL Video File (MP4/WebM)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.trailer.videoUrl}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    trailer: {
                                      ...prev.trailer,
                                      videoUrl: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Poster Thumbnail Video</label>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                          }}
                        >
                          <label className="admin-btn admin-btn--secondary">
                            <CloudUploadIcon fontSize="small" /> Upload Poster
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileUpload(e, 'trailerPoster', (url) =>
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          trailer: {
                                            ...prev.trailer,
                                            posterUrl: url,
                                          },
                                        }
                                      : null,
                                  ),
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.trailer.posterUrl}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      trailer: {
                                        ...prev.trailer,
                                        posterUrl: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Badge Durasi Video</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.trailer.duration}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    trailer: {
                                      ...prev.trailer,
                                      duration: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 5: COVER & OPENING --- */}
                {editorTab === 'cover' && (
                  <div className="admin-grid-2">
                    <div className="admin-card">
                      <h3 className="admin-card__title">
                        🎬 Cover Hero (Layar Depan)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Judul Film / Undangan</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.cover.title}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    cover: {
                                      ...prev.cover,
                                      title: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-grid-3">
                        <div className="admin-form-group">
                          <label className="admin-label">Series Badge</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.cover.seriesBadge}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      cover: {
                                        ...prev.cover,
                                        seriesBadge: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Tahun Rilis</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.cover.year}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      cover: {
                                        ...prev.cover,
                                        year: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                        <div className="admin-form-group">
                          <label className="admin-label">Match %</label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.cover.matchPercentage}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      cover: {
                                        ...prev.cover,
                                        matchPercentage: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Sinopsis Cover</label>
                        <textarea
                          className="admin-textarea"
                          rows={3}
                          value={config.cover.synopsis}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    cover: {
                                      ...prev.cover,
                                      synopsis: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Background Poster Cover</label>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                          }}
                        >
                          <label className="admin-btn admin-btn--secondary">
                            <CloudUploadIcon fontSize="small" /> Upload Cover
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileUpload(e, 'coverBg', (url) =>
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          cover: {
                                            ...prev.cover,
                                            bgImage: url,
                                          },
                                        }
                                      : null,
                                  ),
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            className="admin-input"
                            value={config.cover.bgImage}
                            onChange={(e) =>
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      cover: {
                                        ...prev.cover,
                                        bgImage: e.target.value,
                                      },
                                    }
                                  : null,
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="admin-card">
                      <h3 className="admin-card__title">
                        📜 Opening & Ayat Suci (Quran)
                      </h3>
                      <div className="admin-form-group">
                        <label className="admin-label">Headline Opening</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.opening.title}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    opening: {
                                      ...prev.opening,
                                      title: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Subheadline Opening</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.opening.subtitle}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    opening: {
                                      ...prev.opening,
                                      subtitle: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Kutipan Ayat Suci</label>
                        <textarea
                          className="admin-textarea"
                          rows={4}
                          value={config.opening.quote}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    opening: {
                                      ...prev.opening,
                                      quote: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Sumber Ayat (QS / Hadist)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.opening.quoteSource}
                          onChange={(e) =>
                            setConfig((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    opening: {
                                      ...prev.opening,
                                      quoteSource: e.target.value,
                                    },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 6: COUNTDOWN --- */}
                {editorTab === 'countdown' && (
                  <div className="admin-card">
                    <h3 className="admin-card__title">
                      ⏱️ Target Waktu Hitung Mundur (Countdown)
                    </h3>
                    <div className="admin-form-group">
                      <label className="admin-label">Judul Hitung Mundur</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={config.countdown.title || ''}
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
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">
                        Target Tanggal & Jam (Format ISO / Picker)
                      </label>
                      <input
                        type="datetime-local"
                        className="admin-input"
                        value={
                          config.countdown.targetDate
                            ? config.countdown.targetDate.slice(0, 16)
                            : ''
                        }
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
                      <span className="admin-hint">
                        Target saat ini: {config.countdown.targetDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 7: GALERI FOTO --- */}
                {editorTab === 'gallery' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          🖼️ Galeri Foto Sinematik
                        </h3>
                        <span className="admin-card__desc">
                          Koleksi potret prewedding, akad, dan resepsi dengan rasio
                          portrait atau landscape.
                        </span>
                      </div>
                      <label className="admin-btn admin-btn--secondary">
                        <CloudUploadIcon fontSize="small" /> Tambah Foto Galeri
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) =>
                            handleFileUpload(e, 'galleryNew', (url) => {
                              const newItem: WeddingGalleryItem = {
                                id: `photo_${Date.now()}`,
                                src: url,
                                title: 'New Moment',
                                category: 'prewedding',
                                tag: 'Cinematic Shot',
                                aspect: 'portrait',
                              };
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      gallery: [
                                        ...(prev.gallery || []),
                                        newItem,
                                      ],
                                    }
                                  : null,
                              );
                            })
                          }
                        />
                      </label>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      {config.gallery.map((photo, index) => (
                        <div
                          key={photo.id || index}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={photo.src}
                            alt={photo.title}
                            style={{
                              width: '100%',
                              height: '140px',
                              objectFit: 'cover',
                            }}
                          />
                          <div style={{ padding: '0.75rem' }}>
                            <input
                              type="text"
                              className="admin-input"
                              style={{ marginBottom: '0.4rem', fontSize: '0.8rem' }}
                              value={photo.title}
                              placeholder="Judul Foto"
                              onChange={(e) => {
                                const updated = [...config.gallery];
                                updated[index].title = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, gallery: updated } : null,
                                );
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <select
                                className="admin-select"
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.4rem',
                                  width: 'auto',
                                }}
                                value={photo.aspect}
                                onChange={(e) => {
                                  const updated = [...config.gallery];
                                  updated[index].aspect = e.target.value as
                                    | 'portrait'
                                    | 'landscape'
                                    | 'square';
                                  setConfig((prev) =>
                                    prev ? { ...prev, gallery: updated } : null,
                                  );
                                }}
                              >
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                                <option value="square">Square</option>
                              </select>
                              <button
                                type="button"
                                className="admin-btn admin-btn--danger admin-btn--sm"
                                onClick={() => {
                                  setConfig((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          gallery: prev.gallery.filter(
                                            (_, i) => i !== index,
                                          ),
                                        }
                                      : null,
                                  );
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 8: LOVE STORY --- */}
                {editorTab === 'story' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          📖 Linimasa Perjalanan Cinta (Love Story)
                        </h3>
                        <span className="admin-card__desc">
                          Milestone perjalanan cinta dari perjumpaan awal hingga
                          pelaminan.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          const newItem: WeddingTimelineItem = {
                            year: new Date().getFullYear().toString(),
                            event: 'Momen Istimewa Baru',
                            desc: 'Cerita momen perjalanan cinta.',
                          };
                          setConfig((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  loveStory: [
                                    ...(prev.loveStory || []),
                                    newItem,
                                  ],
                                }
                              : null,
                          );
                        }}
                      >
                        <AddIcon fontSize="small" /> Tambah Momen
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {config.loveStory.map((item, index) => (
                        <div
                          key={item.id || `${item.year}-${item.event}`}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            padding: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{ width: '100px' }}>
                            <label className="admin-label">Tahun</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...config.loveStory];
                                updated[index].year = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, loveStory: updated } : null,
                                );
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="admin-label">Judul Momen</label>
                            <input
                              type="text"
                              className="admin-input"
                              style={{ marginBottom: '0.5rem' }}
                              value={item.event}
                              onChange={(e) => {
                                const updated = [...config.loveStory];
                                updated[index].event = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, loveStory: updated } : null,
                                );
                              }}
                            />
                            <label className="admin-label">Cerita / Kisah</label>
                            <textarea
                              className="admin-textarea"
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const updated = [...config.loveStory];
                                updated[index].desc = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, loveStory: updated } : null,
                                );
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--sm"
                            style={{ marginTop: '1.75rem' }}
                            onClick={() => {
                              setConfig((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      loveStory: prev.loveStory.filter(
                                        (_, i) => i !== index,
                                      ),
                                    }
                                  : null,
                              );
                            }}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 9: HADIAH DIGITAL --- */}
                {editorTab === 'gifts' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          🎁 Rekening Bank & Dompet Digital
                        </h3>
                        <span className="admin-card__desc">
                          Nomor rekening bank atau e-wallet untuk amplop digital
                          tamu undangan.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => {
                          const newGift: WeddingBankAccount = {
                            id: `bank_${Date.now()}`,
                            bank: 'BCA',
                            number: '0000000000',
                            owner: 'Nama Pemilik Rekening',
                          };
                          setConfig((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  gifts: [...(prev.gifts || []), newGift],
                                }
                              : null,
                          );
                        }}
                      >
                        <AddIcon fontSize="small" /> Tambah Rekening
                      </button>
                    </div>

                    <div className="admin-grid-2">
                      {config.gifts.map((bank, index) => (
                        <div
                          key={bank.id || index}
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius-md)',
                            padding: '1.25rem',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '0.75rem',
                            }}
                          >
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>
                              Rekening #{index + 1}
                            </span>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger admin-btn--sm"
                              onClick={() => {
                                setConfig((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        gifts: prev.gifts.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }
                                    : null,
                                );
                              }}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </button>
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-label">Nama Bank / E-Wallet</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={bank.bank}
                              onChange={(e) => {
                                const updated = [...config.gifts];
                                updated[index].bank = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, gifts: updated } : null,
                                );
                              }}
                            />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-label">Nomor Rekening</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={bank.number}
                              onChange={(e) => {
                                const updated = [...config.gifts];
                                updated[index].number = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, gifts: updated } : null,
                                );
                              }}
                            />
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label className="admin-label">Atas Nama Pemilik</label>
                            <input
                              type="text"
                              className="admin-input"
                              value={bank.owner}
                              onChange={(e) => {
                                const updated = [...config.gifts];
                                updated[index].owner = e.target.value;
                                setConfig((prev) =>
                                  prev ? { ...prev, gifts: updated } : null,
                                );
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 10: CLOSING & CREDITS --- */}
                {editorTab === 'closing' && (
                  <div className="admin-card">
                    <h3 className="admin-card__title">
                      🎬 Closing Section & End Credits Roll
                    </h3>
                    <div className="admin-grid-2">
                      <div className="admin-form-group">
                        <label className="admin-label">Judul Penutup</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.closing.title}
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
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Badge Penutup</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={config.closing.badge}
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
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Pesan Doa & Terima Kasih</label>
                      <textarea
                        className="admin-textarea"
                        rows={3}
                        value={config.closing.message}
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
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">Teks Hak Cipta (Copyright)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={config.closing.copyright}
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
                    </div>
                  </div>
                )}

                {/* --- SUBTAB 11: MONITOR RSVP & UCAPAN --- */}
                {editorTab === 'rsvps' && (
                  <div className="admin-card">
                    <div className="admin-card__header">
                      <div className="admin-card__title-group">
                        <h3 className="admin-card__title">
                          💌 Konfirmasi Kehadiran Tamu (Undangan Ini)
                        </h3>
                        <span className="admin-card__desc">
                          Data RSVP tamu yang terisolasi 100% khusus untuk undangan
                          "{currentInvitation?.title}".
                        </span>
                      </div>
                    </div>

                    {/* Stats for this invitation */}
                    <div className="admin-kpi-grid" style={{ marginBottom: '1.5rem' }}>
                      <div className="admin-kpi-card">
                        <div className="admin-kpi-card__info">
                          <span className="admin-kpi-card__label">Total Respons</span>
                          <span className="admin-kpi-card__value">
                            {rsvpStats.totalResponses}
                          </span>
                        </div>
                      </div>
                      <div className="admin-kpi-card">
                        <div className="admin-kpi-card__info">
                          <span className="admin-kpi-card__label">Konfirmasi Hadir</span>
                          <span
                            className="admin-kpi-card__value"
                            style={{ color: 'var(--admin-green)' }}
                          >
                            {rsvpStats.attendingCount}
                          </span>
                        </div>
                      </div>
                      <div className="admin-kpi-card">
                        <div className="admin-kpi-card__info">
                          <span className="admin-kpi-card__label">Tidak Hadir</span>
                          <span
                            className="admin-kpi-card__value"
                            style={{ color: '#ef4444' }}
                          >
                            {rsvpStats.notAttendingCount}
                          </span>
                        </div>
                      </div>
                      <div className="admin-kpi-card">
                        <div className="admin-kpi-card__info">
                          <span className="admin-kpi-card__label">Estimasi Porsi Tamu</span>
                          <span className="admin-kpi-card__value">
                            {rsvpStats.totalGuests}
                          </span>
                        </div>
                      </div>
                    </div>

                    {rsvps.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '3rem 1rem',
                          color: 'var(--admin-text-secondary)',
                        }}
                      >
                        <AssignmentTurnedInIcon
                          style={{ fontSize: '3rem', opacity: 0.3 }}
                        />
                        <p style={{ marginTop: '0.75rem' }}>
                          Belum ada konfirmasi kehadiran tamu pada undangan ini.
                        </p>
                      </div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Nama Tamu</th>
                              <th>Kehadiran</th>
                              <th>Jumlah Orang</th>
                              <th>Pesan / Doa</th>
                              <th>Waktu Submit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rsvps.map((r) => (
                              <tr key={r.id}>
                                <td style={{ fontWeight: 700 }}>{r.name}</td>
                                <td>
                                  <span
                                    className={`admin-status-badge admin-status-badge--${
                                      r.attendance === 'Hadir'
                                        ? 'published'
                                        : 'inactive'
                                    }`}
                                  >
                                    <span className="admin-status-badge__dot" />
                                    {r.attendance}
                                  </span>
                                </td>
                                <td>{r.guestCount || 1} Orang</td>
                                <td>{r.notes || '-'}</td>
                                <td
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--admin-text-muted)',
                                  }}
                                >
                                  {new Date(r.submittedAt).toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: KATALOG TEMPLATE
            ========================================================================= */}
        {primaryTab === 'templates' && (
          <div className="admin-card">
            <div className="admin-card__header">
              <div className="admin-card__title-group">
                <h2 className="admin-card__title">
                  <PaletteIcon /> Katalog Template Undangan
                </h2>
                <span className="admin-card__desc">
                  Seluruh koleksi template website undangan yang tersedia di platform
                  SaaS.
                </span>
              </div>
            </div>

            <div className="admin-template-grid">
              {AVAILABLE_TEMPLATES.map((tmpl) => {
                const countUsing = invitations.filter(
                  (i) => i.templateId === tmpl.id,
                ).length;

                return (
                  <div key={tmpl.id} className="admin-template-card">
                    <div className="admin-template-card__preview">
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.name}
                        className="admin-template-card__thumb"
                      />
                      <span className="admin-template-card__badge">
                        {tmpl.badge}
                      </span>
                    </div>
                    <div className="admin-template-card__body">
                      <div>
                        <h4 className="admin-template-card__title">{tmpl.name}</h4>
                        <p className="admin-template-card__desc">
                          {tmpl.description}
                        </p>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--admin-border)',
                          paddingTop: '0.75rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--admin-text-secondary)',
                          }}
                        >
                          Digunakan: <strong>{countUsing} Undangan</strong>
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: tmpl.available
                              ? 'var(--admin-green)'
                              : 'var(--admin-amber)',
                            fontWeight: 700,
                          }}
                        >
                          {tmpl.available ? 'Tersedia' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Developer Extensibility Guide */}
            <div
              style={{
                marginTop: '2.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed var(--admin-border)',
                borderRadius: 'var(--admin-radius-md)',
                padding: '1.5rem',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--admin-red)' }}>
                💡 Cara Menambahkan Template Baru di Masa Depan
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--admin-text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Struktur kode dirancang sangat mudah dikembangkan. Anda hanya perlu
                membuat komponen template baru di{' '}
                <code>components/templates/[NamaTemplate].tsx</code> dan
                mendaftarkannya di{' '}
                <code>components/templates/registry.ts</code>. Seluruh sistem SaaS,
                CMS Studio, dan routing publik akan langsung mengenali template baru
                secara otomatis tanpa mengubah database!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Bar in Content Studio */}
      {primaryTab === 'editor' && config && (
        <aside className="admin-sticky-bar" aria-label="Aksi Penyuntingan Undangan">
          <div className="admin-sticky-bar__inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>
                Undangan Aktif: <strong>{currentInvitation?.title}</strong>
              </span>
              <span
                className={`admin-status-badge admin-status-badge--${editorStatus}`}
              >
                <span className="admin-status-badge__dot" />
                {editorStatus.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {currentInvitation && (
                <Link
                  href={`/undangan/${editorSlug || currentInvitation.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn--outline"
                >
                  <VisibilityIcon fontSize="small" /> Preview
                </Link>
              )}
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleSaveConfig}
                disabled={saving}
              >
                <SaveIcon fontSize="small" />{' '}
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Modal: Buat Undangan Baru */}
      {showCreateInvModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">Buat Undangan Client Baru</h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setShowCreateInvModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleCreateInvitation}>
              <div className="admin-modal__body">
                <div className="admin-form-group">
                  <label className="admin-label">Pilih Client Pemesan *</label>
                  <select
                    className="admin-select"
                    required
                    value={createInvForm.clientId}
                    onChange={(e) =>
                      setCreateInvForm((prev) => ({
                        ...prev,
                        clientId: e.target.value,
                      }))
                    }
                  >
                    <option value="">-- Pilih Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.package})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Judul Undangan *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="e.g. Budi & Siti | The Wedding"
                    value={createInvForm.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]/g, '-')
                        .replace(/-+/g, '-');
                      setCreateInvForm((prev) => ({
                        ...prev,
                        title: val,
                        slug: prev.slug || autoSlug,
                      }));
                    }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Slug URL Unik *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="e.g. budi-siti"
                    value={createInvForm.slug}
                    onChange={(e) =>
                      setCreateInvForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                  />
                  <span className="admin-hint">
                    Akan menjadi tautan: /undangan/
                    {createInvForm.slug || 'slug-anda'}
                  </span>
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Pilihan Template</label>
                    <select
                      className="admin-select"
                      value={createInvForm.templateId}
                      onChange={(e) =>
                        setCreateInvForm((prev) => ({
                          ...prev,
                          templateId: e.target.value,
                        }))
                      }
                    >
                      {AVAILABLE_TEMPLATES.map((t) => (
                        <option key={t.id} value={t.id} disabled={!t.available}>
                          {t.name} {!t.available ? '(Coming Soon)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status Awal</label>
                    <select
                      className="admin-select"
                      value={createInvForm.status}
                      onChange={(e) =>
                        setCreateInvForm((prev) => ({
                          ...prev,
                          status: e.target.value as InvitationStatus,
                        }))
                      }
                    >
                      <option value="draft">Draft (Pratinjau)</option>
                      <option value="published">Published (Live)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={createInvForm.eventDate}
                    onChange={(e) =>
                      setCreateInvForm((prev) => ({
                        ...prev,
                        eventDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowCreateInvModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Buat Undangan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah / Edit Client */}
      {showClientModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {clientForm.id ? 'Edit Data Client' : 'Tambah Client Baru'}
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setShowClientModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSaveClient}>
              <div className="admin-modal__body">
                <div className="admin-form-group">
                  <label className="admin-label">Nama Client / Pasangan *</label>
                  <input
                    type="text"
                    className="admin-input"
                    required
                    placeholder="e.g. Destia & Rakafansa"
                    value={clientForm.name}
                    onChange={(e) =>
                      setClientForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Nomor WhatsApp *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      placeholder="081234567890"
                      value={clientForm.phone}
                      onChange={(e) =>
                        setClientForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Email (Opsional)</label>
                    <input
                      type="email"
                      className="admin-input"
                      placeholder="email@example.com"
                      value={clientForm.email}
                      onChange={(e) =>
                        setClientForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Paket Langganan</label>
                    <select
                      className="admin-select"
                      value={clientForm.package}
                      onChange={(e) =>
                        setClientForm((prev) => ({
                          ...prev,
                          package: e.target.value,
                        }))
                      }
                    >
                      <option value="Cinematic VIP">Cinematic VIP (Netflix)</option>
                      <option value="Premium Royal">Premium Royal</option>
                      <option value="Standard">Standard</option>
                      <option value="Custom Project">Custom Project</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Status Akun</label>
                    <select
                      className="admin-select"
                      value={clientForm.status}
                      onChange={(e) =>
                        setClientForm((prev) => ({
                          ...prev,
                          status: e.target.value as 'active' | 'inactive',
                        }))
                      }
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Catatan Tambahan</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    placeholder="Catatan pembayaran, tanggal booking, dll."
                    value={clientForm.notes}
                    onChange={(e) =>
                      setClientForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowClientModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  {clientForm.id ? 'Simpan Perubahan' : 'Daftarkan Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus */}
      {deleteConfirm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '440px' }}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: '#ef4444' }}>
                Konfirmasi Hapus
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setDeleteConfirm(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="admin-modal__body">
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Apakah Anda yakin ingin menghapus {deleteConfirm.type === 'invitation' ? 'undangan' : 'client'}{' '}
                <strong>"{deleteConfirm.title}"</strong>?
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  marginTop: '0.75rem',
                  marginBottom: 0,
                }}
              >
                ⚠️ Seluruh data konfigurasi dan file yang terkait akan dihapus secara permanen.
              </p>
            </div>
            <div className="admin-modal__footer">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() => setDeleteConfirm(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={handleExecuteDelete}
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <CloseIcon fontSize="small" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
