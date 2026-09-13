import { type NextRequest, NextResponse } from 'next/server';
import {
  deleteInvitation,
  getClientById,
  getInvitationById,
  getInvitationConfig,
  updateInvitation,
} from '@/lib/saas-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const invitation = await getInvitationById(id);
    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 },
      );
    }

    const [client, config] = await Promise.all([
      getClientById(invitation.clientId),
      getInvitationConfig(id),
    ]);

    return NextResponse.json({
      invitation,
      client,
      config,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail undangan' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateInvitation(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 },
      );
    }
    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Error updating invitation:', error);
    const msg =
      error instanceof Error ? error.message : 'Gagal memperbarui undangan';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const success = await deleteInvitation(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan atau gagal dihapus' },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: 'Undangan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus undangan' },
      { status: 500 },
    );
  }
}
