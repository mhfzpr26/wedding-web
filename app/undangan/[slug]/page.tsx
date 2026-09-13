import type { Metadata } from 'next';
import { InvitationTemplate } from '@/components/templates/InvitationTemplate';

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
  const guestName =
    (typeof query?.to === 'string'
      ? query.to
      : typeof query?.u === 'string'
        ? query.u
        : '') || '';

  const guestTitle = guestName ? `Kepada Yth. ${guestName} - ` : '';

  return {
    title: `${guestTitle}Undangan Pernikahan Destia & Rakafansa`,
    description: `Undangan Pernikahan Destia Dwi Ramadhani & Rakafansa Saputra - 14 November 2026. ${
      guestName ? `Spesial untuk ${guestName}` : ''
    }`,
    openGraph: {
      title: `${guestTitle}The Wedding of Destia & Rakafansa`,
      description:
        'Sabtu, 14 November 2026 - Kami mengundang Anda untuk merayakan hari bahagia kami.',
      url: `https://wedding.destia-rakafansa.com/undangan/${slug}`,
    },
  };
}

export default async function UndanganPage({
  searchParams,
}: UndanganPageProps) {
  const query = await searchParams;
  const guestName =
    (typeof query?.to === 'string'
      ? query.to
      : typeof query?.u === 'string'
        ? query.u
        : '') || '';

  return <InvitationTemplate guestName={guestName} />;
}
