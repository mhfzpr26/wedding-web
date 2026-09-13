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
          backgroundColor: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#6366f1', fontSize: '24px', fontWeight: 800 }}>
          WED<span style={{ color: '#818cf8' }}>FLOW</span>
        </div>
        <div style={{ color: '#9ca3af', fontSize: '13px' }}>
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
