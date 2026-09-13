'use client';

import type React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminStore, type ClientWithInvs } from '@/stores/useAdminStore';

export const ClientsManager: React.FC = () => {
  const clients = useAdminStore((s) => s.clients);
  const setClientForm = useAdminStore((s) => s.setClientForm);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const setCreateInvForm = useAdminStore((s) => s.setCreateInvForm);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);

  const handleOpenEditClient = (client: ClientWithInvs) => {
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

  const handleOpenCreateInvForClient = (
    clientId: string,
    clientName: string,
  ) => {
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
  );
};
