'use client';

import type React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import { useAdminStore } from '@/stores/useAdminStore';

export const TemplateSelectorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">Pilih Tema Template Undangan</h3>
          <span className="admin-card__desc">
            Pilih template tampilan untuk undangan ini. Desain dirancang modular
            sehingga penambahan template baru tidak mengganggu data.
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
                          prev ? { ...prev, templateId: tmpl.id } : null,
                        );
                        showToast('success', `Template ${tmpl.name} dipilih!`);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircleIcon fontSize="small" /> Sedang Aktif
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
  );
};
