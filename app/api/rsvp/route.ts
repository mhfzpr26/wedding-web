import fs from 'node:fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import type { RsvpPayload, RsvpRecord } from '@/types/rsvp';

const rsvpFilePath = path.join(process.cwd(), 'data', 'rsvp.json');

function getRsvps(): RsvpRecord[] {
  try {
    if (!fs.existsSync(rsvpFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(rsvpFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading RSVP data:', error);
    return [];
  }
}

function saveRsvps(rsvps: RsvpRecord[]): void {
  try {
    const dir = path.dirname(rsvpFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(rsvpFilePath, JSON.stringify(rsvps, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving RSVP data:', error);
  }
}

export async function GET() {
  const rsvps = getRsvps();
  return NextResponse.json({
    total: rsvps.length,
    attending: rsvps.filter((r) => r.attendance === 'Hadir').length,
    notAttending: rsvps.filter((r) => r.attendance === 'Tidak Hadir').length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RsvpPayload;
    const { name, attendance, guestCount, notes } = body;

    if (!name || !attendance) {
      return NextResponse.json(
        { error: 'Nama dan konfirmasi kehadiran wajib diisi' },
        { status: 400 },
      );
    }

    const rsvps = getRsvps();
    const newRsvp: RsvpRecord = {
      id: Date.now().toString(),
      name: name.trim(),
      attendance,
      guestCount: attendance === 'Hadir' ? Number(guestCount || 1) : 0,
      notes: notes ? notes.trim() : '',
      submittedAt: new Date().toISOString(),
    };

    rsvps.push(newRsvp);
    saveRsvps(rsvps);

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
