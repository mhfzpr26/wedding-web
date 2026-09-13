import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import type { RsvpRecord } from '@/types/rsvp';

const rsvpFilePath = path.join(process.cwd(), 'data', 'rsvp.json');

function getRsvps(): RsvpRecord[] {
  try {
    if (!fs.existsSync(rsvpFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(rsvpFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading RSVP data in admin route:', error);
    return [];
  }
}

export async function GET() {
  const rsvps = getRsvps();
  const attendingList = rsvps.filter((r) => r.attendance === 'Hadir');
  const notAttendingList = rsvps.filter((r) => r.attendance === 'Tidak Hadir');

  const totalGuests = attendingList.reduce(
    (sum, r) => sum + (Number(r.guestCount) || 1),
    0,
  );

  return NextResponse.json({
    records: rsvps.reverse(), // most recent first
    stats: {
      totalResponses: rsvps.length,
      attendingCount: attendingList.length,
      notAttendingCount: notAttendingList.length,
      totalGuests,
    },
  });
}
