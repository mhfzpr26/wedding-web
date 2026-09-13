import { type NextRequest, NextResponse } from 'next/server';
import type { RsvpPayload } from '@/types/rsvp';
import {
  getInvitationBySlug,
  getTenantRsvps,
  saveTenantRsvp,
} from '@/lib/saas-data';

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
    const body = (await request.json()) as RsvpPayload & {
      slug?: string;
      invitationSlug?: string;
      invitationId?: string;
    };
    const { name, attendance, guestCount, notes, slug, invitationSlug, invitationId: rawInvId } = body;

    if (!name || !attendance) {
      return NextResponse.json(
        { error: 'Nama dan konfirmasi kehadiran wajib diisi' },
        { status: 400 },
      );
    }

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
      notes,
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
