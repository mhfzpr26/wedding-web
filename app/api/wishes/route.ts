import { type NextRequest, NextResponse } from 'next/server';
import {
  getInvitationBySlug,
  getTenantWishes,
  saveTenantWish,
} from '@/lib/saas-data';
import { wishSchema } from '@/lib/validations/wedding';

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
    const rawBody = await request.json();
    const parsed = wishSchema.safeParse(rawBody);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || 'Input data ucapan tidak valid';
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
      status,
      message,
      slug,
      invitationSlug,
      invitationId: rawInvId,
    } = parsed.data;

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
