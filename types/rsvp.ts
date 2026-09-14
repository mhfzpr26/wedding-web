export type AttendanceStatus = 'Hadir' | 'Tidak Hadir';

export interface RsvpPayload {
  name: string;
  attendance: AttendanceStatus;
  guestCount?: number | string;
  notes?: string;
}

export interface RsvpRecord extends RsvpPayload {
  id: string;
  submittedAt: string;
  guestCount: number;
}
