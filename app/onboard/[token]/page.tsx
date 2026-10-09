import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientPortal } from '@/components/portal/ClientPortal';
import { getInvitationForOnboarding } from '@/lib/saas-data';
import '@/app/styles/onboard.css';

interface OnboardPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: OnboardPageProps): Promise<Metadata> {
  const { token } = await params;
  const data = await getInvitationForOnboarding(token);

  if (!data) {
    return {
      title: 'Formulir Tidak Ditemukan | WedFlow SaaS',
      description:
        'Tautan formulir pernikahan tidak ditemukan atau kadaluarsa.',
    };
  }

  return {
    title: `Formulir Data Pernikahan - ${data.invitation.title}`,
    description: `Lengkapi informasi pernikahan ${data.invitation.title} untuk pembuatan undangan digital interaktif.`,
  };
}

export default async function OnboardPage({ params }: OnboardPageProps) {
  const { token } = await params;
  const data = await getInvitationForOnboarding(token);

  if (!data) {
    return (
      <div className="onboard-page">
        <div
          className="onboard-container"
          style={{
            minHeight: '75vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="onboard-card"
            style={{
              textAlign: 'center',
              maxWidth: '520px',
              padding: '48px 32px',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📋</div>
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#ef4444',
                marginBottom: '12px',
              }}
            >
              Formulir Tidak Ditemukan
            </h1>
            <p
              style={{
                color: '#94a3b8',
                lineHeight: 1.6,
                fontSize: '0.92rem',
                marginBottom: '28px',
              }}
            >
              Tautan formulir data pernikahan dengan token atau slug{' '}
              <strong style={{ color: '#fff' }}>"{token}"</strong> tidak
              ditemukan di sistem kami.
            </p>
            <Link href="/" className="onboard-btn onboard-btn-secondary">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ClientPortal initialData={data} token={token} />;
}
