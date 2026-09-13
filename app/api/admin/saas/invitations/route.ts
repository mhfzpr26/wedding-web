import { type NextRequest, NextResponse } from 'next/server';
import {
  createInvitation,
  getClients,
  getInvitations,
  getTenantRsvps,
} from '@/lib/saas-data';
import { invitationSchema } from '@/lib/validations/saas';

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
    const rawBody = await request.json();
    const parsed = invitationSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Input data undangan tidak valid';
      return NextResponse.json(
        {
          error: firstError,
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { clientId, title, slug, templateId, status, eventDate } = parsed.data;

    const newInvitation = await createInvitation({
      clientId,
      title,
      slug,
      templateId: templateId || 'netflix',
      status: status || 'draft',
      eventDate: eventDate || undefined,
    });

    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating invitation:', error);
    const msg = error instanceof Error ? error.message : 'Gagal membuat undangan';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
