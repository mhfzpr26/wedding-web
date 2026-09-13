import { InvitationTemplate } from '@/components/templates/InvitationTemplate';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const guestName =
    (typeof params?.to === 'string'
      ? params.to
      : typeof params?.u === 'string'
        ? params.u
        : '') || '';

  return <InvitationTemplate guestName={guestName} />;
}
