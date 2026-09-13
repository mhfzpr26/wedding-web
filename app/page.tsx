import type { Metadata } from 'next';
import { TemplateRouter } from '@/components/templates/TemplateRouter';
import { getWeddingConfig } from '@/lib/wedding-data';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const config = await getWeddingConfig();
  const guestName =
    (typeof params?.to === 'string'
      ? params.to
      : typeof params?.u === 'string'
        ? params.u
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
      images: [
        {
          url: config.cover?.bgImage || '/images/logo.png',
          alt: config.title,
        },
      ],
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const config = await getWeddingConfig();
  const guestName =
    (typeof params?.to === 'string'
      ? params.to
      : typeof params?.u === 'string'
        ? params.u
        : '') || '';

  return (
    <TemplateRouter
      config={config}
      guestName={guestName}
      invitationSlug="destia-rakafansa"
    />
  );
}
