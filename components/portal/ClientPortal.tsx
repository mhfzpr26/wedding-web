'use client';

import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { ClientOnboardingWizard } from '@/components/onboard/ClientOnboardingWizard';
import { RsvpMonitorTabClient } from '@/components/portal/RsvpMonitorTabClient';
import { WhatsAppDistributionTab } from '@/components/portal/WhatsAppDistributionTab';
import type { OnboardingResponseData } from '@/types/onboarding';

interface ClientPortalProps {
  initialData: OnboardingResponseData;
  token: string;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  initialData,
  token,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<
    'form' | 'distribute' | 'rsvp'
  >('form');

  const invitation = initialData.invitation;
  const formData = initialData.formData;
  const groomName = formData.couple.groom.callName || 'Groom';
  const brideName = formData.couple.bride.callName || 'Bride';

  return (
    <div className="onboard-page">
      <div className="onboard-container">
        {/* Portal Brand Header */}
        <header className="onboard-header" style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <div className="onboard-logo-badge" style={{ margin: 0 }}>
              💍 INVATERA • PORTAL KHUSUS PENGANTIN
            </div>

            <Link
              href={`/undangan/${invitation.slug}`}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              👁️ Lihat Undangan Publik ↗
            </Link>
          </div>

          <h1 className="onboard-title" style={{ fontSize: '1.6rem' }}>
            Portal Pernikahan: {groomName} &amp; {brideName}
          </h1>
          <p className="onboard-subtitle" style={{ marginBottom: 0 }}>
            Semua kebutuhan undangan Anda di satu tempat: lengkapi data,
            kirimkan tautan personal ke WhatsApp tamu, dan pantau konfirmasi
            kehadiran.
          </p>
        </header>

        {/* 3 Main Portal Tabs Navigation */}
        <nav className="portal-tabs-nav" aria-label="Portal Navigation">
          <button
            type="button"
            className={`portal-tab-btn ${activePortalTab === 'form' ? 'active' : ''}`}
            onClick={() => setActivePortalTab('form')}
          >
            📝 Data Pernikahan
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activePortalTab === 'distribute' ? 'active' : ''}`}
            onClick={() => setActivePortalTab('distribute')}
          >
            📲 Sebar Undangan WA
          </button>
          <button
            type="button"
            className={`portal-tab-btn ${activePortalTab === 'rsvp' ? 'active' : ''}`}
            onClick={() => setActivePortalTab('rsvp')}
          >
            💌 Rekap Tamu &amp; RSVP
          </button>
        </nav>

        {/* Tab 1: Formulir Data Pernikahan */}
        {activePortalTab === 'form' && (
          <ClientOnboardingWizard
            initialData={initialData}
            token={token}
            isEmbedded
          />
        )}

        {/* Tab 2: Sebar Undangan WhatsApp */}
        {activePortalTab === 'distribute' && (
          <main className="onboard-card">
            <WhatsAppDistributionTab initialData={initialData} />
          </main>
        )}

        {/* Tab 3: Rekap Tamu & RSVP */}
        {activePortalTab === 'rsvp' && (
          <main className="onboard-card">
            <RsvpMonitorTabClient initialData={initialData} />
          </main>
        )}
      </div>
    </div>
  );
};
