import { type NextRequest, NextResponse } from 'next/server';
import type { WishPayload } from '@/types/wishes';
import {
  getInvitationBySlug,
  getTenantWishes,
  saveTenantWish,
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

    const wishes = await getTenantWishes(invitationId);
    return NextResponse.json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil ucapan' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WishPayload & {
      slug?: string;
      invitationSlug?: string;
      invitationId?: string;
    };
    const { name, status, message, slug, invitationSlug, invitationId: rawInvId } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Nama dan pesan wajib diisi' },
        { status: 400 },
      );
    }

    let targetInvitationId = rawInvId || 'inv-destia-rakafansa';
    const targetSlug = slug || invitationSlug;
    if (targetSlug) {
      const inv = await getInvitationBySlug(targetSlug);
      if (inv) targetInvitationId = inv.id;
    }

    const newWish = await saveTenantWish(targetInvitationId, {
      name,
      status,
      message,
    });

    return NextResponse.json(newWish, { status: 201 });
  } catch (error) {
    console.error('Error processing wish POST:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat menyimpan ucapan' },
      { status: 500 },
    );
  }
}
