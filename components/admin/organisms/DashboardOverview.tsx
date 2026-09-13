'use client';

import type React from 'react';
import Link from 'next/link';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import LayersIcon from '@mui/icons-material/Layers';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

export const DashboardOverview: React.FC = () => {
  const clients = useAdminStore((s) => s.clients);
  const invitations = useAdminStore((s) => s.invitations);
  const setInvitations = useAdminStore((s) => s.setInvitations);
  const stats = useAdminStore((s) => s.stats);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);
  const openEditorForInvitation = useAdminStore(
    (s) => s.openEditorForInvitation,
  );
  const showToast = useAdminStore((s) => s.showToast);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/undangan/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('success', `Tautan berhasil disalin: ${fullUrl}`);
  };

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
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === invitationId ? { ...i, status: newStatus } : i,
          ),
        );
        showToast('success', `Status undangan berhasil diubah ke ${newStatus}`);
      }
    } catch {
      showToast('error', 'Gagal memperbarui status');
    }
  };

  return (
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
            <LayersIcon style={{ fontSize: '3.5rem', opacity: 0.3, color: 'var(--admin-primary)' }} />
            <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
              Belum ada undangan yang dibuat. Silakan klik tombol &quot;Buat Undangan&quot;
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
                          onClick={() => openEditorForInvitation(inv.id)}
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
  );
};
