import { NextResponse } from 'next/server';
import { getSaasStats } from '@/lib/saas-data';

export async function GET() {
  try {
    const stats = await getSaasStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching SaaS stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik SaaS' },
      { status: 500 },
    );
  }
}
