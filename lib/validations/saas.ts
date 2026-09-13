import { z } from 'zod';

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama klien minimal 2 karakter')
    .max(100, 'Nama klien maksimal 100 karakter'),
  phone: z
    .string()
    .trim()
    .min(8, 'Nomor WhatsApp minimal 8 digit')
    .max(20, 'Nomor WhatsApp maksimal 20 digit')
    .regex(/^[0-9+()-\s]+$/, 'Format nomor telepon/WhatsApp tidak valid'),
  email: z
    .string()
    .trim()
    .email('Format alamat email tidak valid')
    .optional()
    .or(z.literal(''))
    .nullable(),
  package: z.string().default('Standard'),
  notes: z
    .string()
    .max(1000, 'Catatan maksimal 1000 karakter')
    .optional()
    .nullable(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type ClientInput = z.infer<typeof clientSchema>;

export const invitationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul undangan minimal 3 karakter')
    .max(200, 'Judul undangan maksimal 200 karakter'),
  slug: z
    .string()
    .trim()
    .min(3, 'Slug minimal 3 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan strip (-)',
    ),
  clientId: z.string().min(1, 'Klien pemilik undangan wajib dipilih'),
  templateId: z.string().default('netflix'),
  eventDate: z.string().optional().nullable(),
  status: z.enum(['draft', 'published', 'inactive']).default('draft'),
});

export type InvitationInput = z.infer<typeof invitationSchema>;
