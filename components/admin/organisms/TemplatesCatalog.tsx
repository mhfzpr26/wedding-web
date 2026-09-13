'use client';

import type React from 'react';
import PaletteIcon from '@mui/icons-material/Palette';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import { useAdminStore } from '@/stores/useAdminStore';

export const TemplatesCatalog: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);

  return (
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
          Struktur kode dirancang sangat modular dan mudah dikembangkan. Anda cukup
          menambahkan file template baru di{' '}
          <code>components/templates/[NamaTemplate].tsx</code> dan
          mendaftarkannya di{' '}
          <code>components/templates/registry.ts</code>. Seluruh sistem SaaS,
          CMS Studio, dan routing publik akan langsung mengenali template baru
          secara otomatis tanpa perlu mengubah skema database!
        </p>
      </div>
    </div>
  );
};
