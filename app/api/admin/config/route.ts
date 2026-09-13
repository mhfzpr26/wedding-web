import { type NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_WEDDING_CONFIG,
  getWeddingConfig,
  saveWeddingConfig,
} from '@/lib/wedding-data';
import type { WeddingConfig } from '@/types/wedding';

export async function GET() {
  try {
    const config = await getWeddingConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to get wedding config:', error);
    return NextResponse.json(
      { error: 'Gagal memuat data konfigurasi' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WeddingConfig;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Payload konfigurasi tidak valid' },
        { status: 400 },
      );
    }

    const success = await saveWeddingConfig(body);
    if (!success) {
      return NextResponse.json(
        { error: 'Gagal menyimpan perubahan ke server' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Konfigurasi berhasil disimpan',
      config: body,
    });
  } catch (error) {
    console.error('Failed to update wedding config:', error);
    return NextResponse.json(
      { error: 'Gagal memproses pembaruan konfigurasi' },
      { status: 500 },
    );
  }
}

export async function PUT() {
  try {
    // Reset to default
    const success = await saveWeddingConfig(DEFAULT_WEDDING_CONFIG);
    if (!success) {
      return NextResponse.json(
        { error: 'Gagal merestore konfigurasi awal' },
        { status: 500 },
      );
    }
    return NextResponse.json({
      message: 'Konfigurasi berhasil direset ke pengaturan bawaan',
      config: DEFAULT_WEDDING_CONFIG,
    });
  } catch (error) {
    console.error('Failed to reset config:', error);
    return NextResponse.json(
      { error: 'Gagal merestore konfigurasi' },
      { status: 500 },
    );
  }
}
