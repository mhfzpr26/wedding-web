import { type NextRequest, NextResponse } from 'next/server';
import { createClient, getClients, getInvitations } from '@/lib/saas-data';
import { clientSchema } from '@/lib/validations/saas';

export async function GET() {
  try {
    const [clients, invitations] = await Promise.all([
      getClients(),
      getInvitations(),
    ]);

    // Attach count of invitations to each client
    const clientsWithMeta = clients.map((client) => {
      const clientInvs = invitations.filter(
        (inv) => inv.clientId === client.id,
      );
      return {
        ...client,
        invitationsCount: clientInvs.length,
        invitations: clientInvs.map((i) => ({
          id: i.id,
          title: i.title,
          slug: i.slug,
          status: i.status,
          templateId: i.templateId,
        })),
      };
    });

    return NextResponse.json(clientsWithMeta);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data client' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = clientSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || 'Input data client tidak valid';
      return NextResponse.json(
        {
          error: firstError,
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      name,
      phone,
      email,
      package: clientPackage,
      notes,
      status,
    } = parsed.data;

    const newClient = await createClient({
      name,
      phone,
      email: email || undefined,
      package: clientPackage,
      notes: notes || undefined,
      status,
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan data client' },
      { status: 500 },
    );
  }
}
