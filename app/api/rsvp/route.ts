import { type NextRequest, NextResponse } from 'next/server';
import {
  getInvitationBySlug,
  getTenantRsvps,
  saveTenantRsvp,
} from '@/lib/saas-data';
import { rsvpSchema } from '@/lib/validations/wedding';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || searchParams.get('invitationSlug');

    let invitationId = 'inv-destia-rakafansa';
    if (slug) {
      const inv = await getInvitationBySlug(slug);
      if (inv) invitationId = inv.id;
    }

    const rsvps = await getTenantRsvps(invitationId);
    return NextResponse.json({
      total: rsvps.length,
      attending: rsvps.filter((r) => r.attendance === 'Hadir').length,
      notAttending: rsvps.filter((r) => r.attendance === 'Tidak Hadir').length,
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data RSVP' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsed = rsvpSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Input data RSVP tidak valid';
      return NextResponse.json(
        {
          error: firstError,
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, attendance, guestCount, notes, slug, invitationSlug, invitationId: rawInvId } = parsed.data;

    let targetInvitationId = rawInvId || 'inv-destia-rakafansa';
    const targetSlug = slug || invitationSlug;
    if (targetSlug) {
      const inv = await getInvitationBySlug(targetSlug);
      if (inv) targetInvitationId = inv.id;
    }

    const newRsvp = await saveTenantRsvp(targetInvitationId, {
      name,
      attendance,
      guestCount,
      notes: notes || undefined,
    });

    return NextResponse.json(
      { message: 'Terima kasih atas konfirmasi kehadiran Anda', rsvp: newRsvp },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error processing RSVP POST:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan konfirmasi kehadiran' },
      { status: 500 },
    );
  }
}
