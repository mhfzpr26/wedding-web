import { type NextRequest, NextResponse } from 'next/server';
import {
  getInvitationForOnboarding,
  saveOnboardingSubmission,
} from '@/lib/saas-data';
import type { OnboardingFormData } from '@/types/onboarding';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json(
        { error: 'Token formulir tidak valid' },
        { status: 400 },
      );
    }

    const data = await getInvitationForOnboarding(token);
    if (!data) {
      return NextResponse.json(
        { error: 'Undangan tidak ditemukan atau token tidak valid' },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching onboarding data:', error);
    return NextResponse.json(
      { error: 'Gagal memuat formulir data pernikahan' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { token } = await context.params;
    if (!token) {
      return NextResponse.json(
        { error: 'Token formulir tidak valid' },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { formData, isFinalSubmit } = body as {
      formData: OnboardingFormData;
      isFinalSubmit?: boolean;
    };

    if (!formData?.couple || !formData?.events) {
      return NextResponse.json(
        { error: 'Format data formulir tidak lengkap' },
        { status: 400 },
      );
    }

    const result = await saveOnboardingSubmission(
      token,
      formData,
      Boolean(isFinalSubmit),
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error saving onboarding data:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal menyimpan formulir';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
