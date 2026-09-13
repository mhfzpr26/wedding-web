import InvitationContainer from '@/components/invitation/InvitationContainer';

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const guestName = query?.to || query?.u || '';

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

export default async function UndanganPage({ searchParams }) {
  const query = await searchParams;
  const guestName = query?.to || query?.u || '';

  return <InvitationContainer guestName={guestName} />;
}
