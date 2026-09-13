'use client';

import type React from 'react';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useAdminStore } from '@/stores/useAdminStore';

export const RsvpMonitorTab: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const rsvps = useAdminStore((s) => s.rsvps);
  const rsvpStats = useAdminStore((s) => s.rsvpStats);

  const currentInvitation = invitations.find((i) => i.id === selectedInvitationId);

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">
            💌 Konfirmasi Kehadiran Tamu (Undangan Ini)
          </h3>
          <span className="admin-card__desc">
            Data RSVP tamu yang terisolasi 100% khusus untuk undangan &quot;{currentInvitation?.title}&quot;.
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
  );
};
