import type { Metadata } from 'next';
import Link from 'next/link';
import { TemplateRouter } from '@/components/templates/TemplateRouter';
import {
  getInvitationBySlug,
  getInvitationConfig,
  incrementInvitationViews,
} from '@/lib/saas-data';

interface UndanganPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: UndanganPageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;

  const invitation = await getInvitationBySlug(slug);
  if (!invitation) {
    return {
      title: 'Undangan Tidak Ditemukan | Wedding SaaS',
      description: 'Halaman undangan pernikahan tidak dapat ditemukan.',
    };
  }

  const config = await getInvitationConfig(invitation.id);
  const guestName =
    (typeof query?.to === 'string'
      ? query.to
      : typeof query?.u === 'string'
        ? query.u
        : '') || '';

  const guestTitle = guestName ? `Kepada Yth. ${guestName} - ` : '';

  return {
    title: `${guestTitle}${config.title}`,
    description: `${config.seoDescription}${
      guestName ? ` Spesial untuk ${guestName}.` : ''
    }`,
    openGraph: {
      title: `${guestTitle}${config.title}`,
      description: config.seoDescription,
      url: `https://wedding.destia-rakafansa.com/undangan/${slug}`,
      images: [
        {
          url: config.cover?.bgImage || '/images/logo.png',
          alt: config.title,
        },
      ],
    },
  };
}

export default async function UndanganPage({
  params,
  searchParams,
}: UndanganPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const invitation = await getInvitationBySlug(slug);

  // 1. Not Found Guard
  if (!invitation) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#141414',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '40px 32px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎬</div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#e50914',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Undangan Tidak Ditemukan
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: '28px',
              fontSize: '0.95rem',
            }}
          >
            Maaf, tautan undangan dengan slug{' '}
            <strong style={{ color: '#fff' }}>"{slug}"</strong> tidak terdaftar
            atau telah dipindahkan.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e50914',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s ease',
            }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // 2. Inactive Guard
  if (invitation.status === 'inactive') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0c0c0e',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '40px 32px',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🔒</div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f59e0b',
              marginBottom: '12px',
            }}
          >
            Undangan Sedang Dinonaktifkan
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.6,
              marginBottom: '24px',
              fontSize: '0.92rem',
            }}
          >
            Halaman undangan <strong>{invitation.title}</strong> saat ini sedang
            dinonaktifkan sementara oleh penyelenggara atau administrator.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            Silakan hubungi keluarga mempelai untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  // 3. Load isolated tenant config
  const config = await getInvitationConfig(invitation.id);
  const guestName =
    (typeof query?.to === 'string'
      ? query.to
      : typeof query?.u === 'string'
        ? query.u
        : '') || '';

  // 4. Increment view count for published invitations
  if (invitation.status === 'published') {
    // Non-blocking view increment
    incrementInvitationViews(invitation.id).catch(() => {});
  }

  return (
    <>
      {/* Draft Mode Notification Banner */}
      {invitation.status === 'draft' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 999999,
            backgroundColor: '#d97706',
            color: '#ffffff',
            padding: '10px 16px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            letterSpacing: '0.3px',
          }}
        >
          <span>⚠️ MODE PRATINJAU (DRAFT)</span>
          <span style={{ fontWeight: 400, opacity: 0.9 }}>
            — Undangan ini belum dipublikasikan ke publik. Hanya admin yang
            dapat melihat tampilan ini.
          </span>
          <Link
            href="/admin"
            style={{
              marginLeft: '12px',
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Kembali ke Admin
          </Link>
        </div>
      )}

      <TemplateRouter
        config={config}
        guestName={guestName}
        invitationSlug={invitation.slug}
      />
    </>
  );
}
