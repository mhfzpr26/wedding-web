import type { Metadata } from 'next';
import { getWeddingConfig } from '@/lib/wedding-data';
import { TemplateRouter } from '@/components/templates/TemplateRouter';

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
  const config = await getWeddingConfig();
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
  searchParams,
}: UndanganPageProps) {
  const query = await searchParams;
  const config = await getWeddingConfig();
  const guestName =
    (typeof query?.to === 'string'
      ? query.to
      : typeof query?.u === 'string'
        ? query.u
        : '') || '';

  return <TemplateRouter config={config} guestName={guestName} />;
}
