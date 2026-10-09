'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/templates/AdminLayout';
import { AdminProviders } from '@/components/admin/templates/AdminProviders';

export function AdminClientWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/invatera-icon-nobg.png"
            alt="Invatera"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
          />
          <div
            style={{
              color: '#0f172a',
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.3px',
            }}
          >
            INVA<span style={{ color: '#06b6d4' }}>TERA</span>
          </div>
        </div>
        <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
          Memuat SaaS platform…
        </div>
      </div>
    );
  }

  return (
    <AdminProviders>
      <AdminLayout />
    </AdminProviders>
  );
}
