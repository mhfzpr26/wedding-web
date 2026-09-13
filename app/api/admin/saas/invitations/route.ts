import { type NextRequest, NextResponse } from 'next/server';
import {
  createInvitation,
  getClients,
  getInvitations,
  getTenantRsvps,
} from '@/lib/saas-data';

export async function GET() {
  try {
    const [invitations, clients] = await Promise.all([
      getInvitations(),
      getClients(),
    ]);

    const clientMap = new Map(clients.map((c) => [c.id, c]));

    // Attach client info and rsvps count to each invitation
    const invitationsWithDetails = await Promise.all(
      invitations.map(async (inv) => {
        const client = clientMap.get(inv.clientId);
        const rsvps = await getTenantRsvps(inv.id);
        return {
          ...inv,
          client: client
            ? {
                id: client.id,
                name: client.name,
                phone: client.phone,
                package: client.package,
              }
            : null,
          rsvpsCount: rsvps.length,
          attendingCount: rsvps.filter((r) => r.attendance === 'Hadir').length,
        };
      }),
    );

    return NextResponse.json(invitationsWithDetails);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data undangan' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, title, slug, templateId, status, eventDate } = body;

    if (!clientId || !title || !slug) {
      return NextResponse.json(
        { error: 'Client, judul undangan, dan slug URL wajib diisi' },
        { status: 400 },
      );
    }

    const newInvitation = await createInvitation({
      clientId,
      title,
      slug,
      templateId: templateId || 'netflix',
      status: status || 'draft',
      eventDate,
    });

    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating invitation:', error);
    const msg = error instanceof Error ? error.message : 'Gagal membuat undangan';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
