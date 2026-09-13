export type WishAttendanceStatus = 'Hadir' | 'Akan Hadir' | 'Tidak Hadir';

export interface WishPayload {
  name: string;
  status: WishAttendanceStatus | string;
  message: string;
}

export interface WishRecord extends WishPayload {
  id: string;
  createdAt: string;
}
