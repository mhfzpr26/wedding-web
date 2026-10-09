'use client';

import type React from 'react';
import { useState } from 'react';
import type { OnboardingResponseData } from '@/types/onboarding';

interface RsvpMonitorTabClientProps {
  initialData: OnboardingResponseData;
}

export const RsvpMonitorTabClient: React.FC<RsvpMonitorTabClientProps> = ({
  initialData,
}) => {
  const rsvps = initialData.rsvps || [];
  const wishes = initialData.wishes || [];

  const attendingList = rsvps.filter((r) => r.attendance === 'Hadir');
  const notAttendingList = rsvps.filter((r) => r.attendance === 'Tidak Hadir');
  const totalGuests = attendingList.reduce(
    (sum, r) => sum + (Number(r.guestCount) || 1),
    0,
  );

  const [activeSubTab, setActiveSubTab] = useState<'rsvp' | 'wishes'>('rsvp');

  // Export to CSV
  const handleExportCsv = () => {
    if (rsvps.length === 0) {
      alert('Belum ada data RSVP untuk diunduh.');
      return;
    }

    const headers = [
      'Nama Tamu',
      'Kehadiran',
      'Jumlah Orang',
      'Pesan / Catatan',
      'Waktu Submit',
    ];
    const rows = rsvps.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.attendance}"`,
      r.guestCount || 1,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((e) => e.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `rekap-rsvp-${initialData.invitation.slug}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="onboard-section-title" style={{ margin: 0 }}>
            <span>💌</span> Rekap Kehadiran Tamu &amp; Doa
          </h2>
          <p className="onboard-section-desc" style={{ margin: '4px 0 0' }}>
            Pantau siapa saja tamu yang telah mengonfirmasi kehadiran dan
            membaca untaian doa mereka.
          </p>
        </div>

        <button
          type="button"
          className="onboard-btn onboard-btn-save"
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          onClick={handleExportCsv}
        >
          📥 Unduh Rekap Excel / CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div
            style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}
          >
            KONFIRMASI HADIR
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '6px 0 2px',
            }}
          >
            {attendingList.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Keluarga / Undangan
          </div>
        </div>

        <div
          style={{
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div
            style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}
          >
            ESTIMASI TOTAL TAMU
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '6px 0 2px',
            }}
          >
            {totalGuests}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Orang (porsi katering)
          </div>
        </div>

        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div
            style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}
          >
            BERHALANGAN HADIR
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '6px 0 2px',
            }}
          >
            {notAttendingList.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Tamu berhalangan
          </div>
        </div>

        <div
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '16px',
            padding: '18px',
          }}
        >
          <div
            style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}
          >
            DOA &amp; UCAPAN MASUK
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '6px 0 2px',
            }}
          >
            {wishes.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Pesan kehangatan
          </div>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          type="button"
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            border:
              activeSubTab === 'rsvp'
                ? '1px solid #10b981'
                : '1px solid rgba(255,255,255,0.1)',
            background:
              activeSubTab === 'rsvp'
                ? 'rgba(16,185,129,0.15)'
                : 'rgba(255,255,255,0.03)',
            color: activeSubTab === 'rsvp' ? '#10b981' : '#cbd5e1',
          }}
          onClick={() => setActiveSubTab('rsvp')}
        >
          📋 Konfirmasi RSVP ({rsvps.length})
        </button>

        <button
          type="button"
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            border:
              activeSubTab === 'wishes'
                ? '1px solid #f59e0b'
                : '1px solid rgba(255,255,255,0.1)',
            background:
              activeSubTab === 'wishes'
                ? 'rgba(245,158,11,0.15)'
                : 'rgba(255,255,255,0.03)',
            color: activeSubTab === 'wishes' ? '#f59e0b' : '#cbd5e1',
          }}
          onClick={() => setActiveSubTab('wishes')}
        >
          💌 Buku Tamu &amp; Doa ({wishes.length})
        </button>
      </div>

      {/* Panel 1: RSVP Table */}
      {activeSubTab === 'rsvp' && (
        <div className="onboard-subcard">
          {rsvps.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                color: '#64748b',
                fontSize: '0.9rem',
              }}
            >
              Belum ada tamu yang mengisi konfirmasi kehadiran (RSVP).
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.86rem',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8',
                    }}
                  >
                    <th style={{ padding: '10px 12px' }}>Nama Tamu</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Jumlah</th>
                    <th style={{ padding: '10px 12px' }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr
                      key={rsvp.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <td
                        style={{
                          padding: '12px',
                          fontWeight: 700,
                          color: '#ffffff',
                        }}
                      >
                        {rsvp.name}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background:
                              rsvp.attendance === 'Hadir'
                                ? 'rgba(16,185,129,0.15)'
                                : 'rgba(239,68,68,0.15)',
                            color:
                              rsvp.attendance === 'Hadir'
                                ? '#10b981'
                                : '#ef4444',
                          }}
                        >
                          {rsvp.attendance}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#cbd5e1' }}>
                        {rsvp.guestCount || 1} orang
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          color: '#94a3b8',
                          maxWidth: '280px',
                        }}
                      >
                        {rsvp.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Panel 2: Wishes / Doa */}
      {activeSubTab === 'wishes' && (
        <div className="onboard-subcard">
          {wishes.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 16px',
                color: '#64748b',
                fontSize: '0.9rem',
              }}
            >
              Belum ada ucapan atau doa yang masuk dari tamu.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '12px',
                maxHeight: '480px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {wishes.map((w) => (
                <div
                  key={w.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                      {w.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#64748b',
                      }}
                    >
                      {new Date(w.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.86rem',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}
                  >
                    "{w.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
