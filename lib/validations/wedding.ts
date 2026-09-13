import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  attendance: z.enum(['Hadir', 'Tidak Hadir']),
  guestCount: z.coerce
    .number()
    .int()
    .min(1, 'Minimal 1 tamu')
    .max(10, 'Maksimal 10 tamu')
    .default(1),
  notes: z
    .string()
    .max(500, 'Pesan/catatan maksimal 500 karakter')
    .optional()
    .nullable(),
  slug: z.string().optional().nullable(),
  invitationSlug: z.string().optional().nullable(),
  invitationId: z.string().optional().nullable(),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;

export const wishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  status: z
    .string()
    .default('Hadir'),
  message: z
    .string()
    .trim()
    .min(3, 'Ucapan doa minimal 3 karakter')
    .max(1000, 'Ucapan doa maksimal 1000 karakter'),
  slug: z.string().optional().nullable(),
  invitationSlug: z.string().optional().nullable(),
  invitationId: z.string().optional().nullable(),
});

export type WishInput = z.infer<typeof wishSchema>;
