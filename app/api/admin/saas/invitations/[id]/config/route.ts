import { type NextRequest, NextResponse } from 'next/server';
import {
  getInvitationById,
  getInvitationConfig,
  saveInvitationConfig,
} from '@/lib/saas-data';
import type { WeddingConfig } from '@/types/wedding';

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

    const config = await getInvitationConfig(id);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching tenant config:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil konfigurasi undangan' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const invitation = await getInvitationById(id);
    if (!invitation) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan' },
        { status: 404 },
      );
    }

    const body = (await request.json()) as WeddingConfig;
    const success = await saveInvitationConfig(id, body);

    if (!success) {
      return NextResponse.json(
        { error: 'Gagal menyimpan konfigurasi ke file tenant' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Konfigurasi undangan berhasil disimpan secara terisolasi',
      config: body,
    });
  } catch (error) {
    console.error('Error saving tenant config:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat menyimpan konfigurasi' },
      { status: 500 },
    );
  }
}
