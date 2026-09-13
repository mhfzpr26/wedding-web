import { type NextRequest, NextResponse } from 'next/server';
import { getInvitationById, getTenantRsvps } from '@/lib/saas-data';

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

    const rsvps = await getTenantRsvps(id);
    const attendingCount = rsvps.filter((r) => r.attendance === 'Hadir').length;
    const notAttendingCount = rsvps.filter(
      (r) => r.attendance === 'Tidak Hadir',
    ).length;
    const totalGuests = rsvps.reduce((acc, r) => acc + (r.guestCount || 0), 0);

    return NextResponse.json({
      totalResponses: rsvps.length,
      attendingCount,
      notAttendingCount,
      totalGuests,
      rsvps,
    });
  } catch (error) {
    console.error('Error fetching tenant RSVPs:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data RSVP undangan' },
      { status: 500 },
    );
  }
}
