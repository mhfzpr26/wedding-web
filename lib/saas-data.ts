import fs from 'node:fs';
import path from 'node:path';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';
import type {
  OnboardingFormData,
  OnboardingResponseData,
} from '@/types/onboarding';
import type { RsvpPayload, RsvpRecord } from '@/types/rsvp';
import type {
  ClientRecord,
  InvitationRecord,
  InvitationStatus,
  SaasStats,
  WeddingConfig,
} from '@/types/wedding';
import type { WishPayload, WishRecord } from '@/types/wishes';
import { prisma } from './prisma';
import { DEFAULT_WEDDING_CONFIG } from './wedding-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const INVITATIONS_FILE = path.join(DATA_DIR, 'invitations.json');
const TENANTS_DIR = path.join(DATA_DIR, 'tenants');

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

let saasInitialized = false;

// Auto-seed initial tenant data (Destia & Rakafansa) via Prisma ORM
async function initializeSaasStorage(): Promise<void> {
  if (saasInitialized) return;

  ensureDirectoryExistence(DATA_DIR);
  ensureDirectoryExistence(TENANTS_DIR);

  try {
    const clientsCount = await prisma.client.count();

    const initialClientId = 'client-destia';
    const initialInvitationId = 'inv-destia-rakafansa';
    const initialSlug = 'destia-rakafansa';

    // If database has 0 clients, seed from existing JSON or default
    if (clientsCount === 0) {
      let seedConfig = DEFAULT_WEDDING_CONFIG;
      const tenantConfigFile = path.join(
        TENANTS_DIR,
        initialInvitationId,
        'config.json',
      );
      const oldConfigFile = path.join(DATA_DIR, 'wedding-config.json');

      if (fs.existsSync(tenantConfigFile)) {
        try {
          seedConfig = JSON.parse(fs.readFileSync(tenantConfigFile, 'utf-8'));
        } catch {
          seedConfig = DEFAULT_WEDDING_CONFIG;
        }
      } else if (fs.existsSync(oldConfigFile)) {
        try {
          seedConfig = JSON.parse(fs.readFileSync(oldConfigFile, 'utf-8'));
        } catch {
          seedConfig = DEFAULT_WEDDING_CONFIG;
        }
      }

      // Seed Client via Prisma
      await prisma.client.upsert({
        where: { id: initialClientId },
        update: {},
        create: {
          id: initialClientId,
          name: 'Destia & Rakafansa',
          phone: '081234567890',
          email: 'destia.rakafansa@example.com',
          package: 'Cinematic VIP',
          notes: 'Client perdana paket Netflix Cinematic Theme',
          status: 'active',
        },
      });

      // Seed Invitation via Prisma
      await prisma.invitation.upsert({
        where: { id: initialInvitationId },
        update: {},
        create: {
          id: initialInvitationId,
          clientId: initialClientId,
          title: 'Destia & Rakafansa | The Wedding',
          slug: initialSlug,
          templateId: 'netflix',
          status: 'published',
          eventDate: '2026-11-14',
          viewsCount: 142,
          config: {
            create: {
              config: seedConfig as object,
            },
          },
        },
      });

      // Seed RSVPs if any from file
      const destiaTenantDir = path.join(TENANTS_DIR, initialInvitationId);
      ensureDirectoryExistence(destiaTenantDir);
      const destiaRsvpFile = path.join(destiaTenantDir, 'rsvps.json');
      if (fs.existsSync(destiaRsvpFile)) {
        try {
          const rsvps: RsvpRecord[] = JSON.parse(
            fs.readFileSync(destiaRsvpFile, 'utf-8'),
          );
          for (const r of rsvps) {
            await prisma.rsvp.upsert({
              where: { id: r.id },
              update: {},
              create: {
                id: r.id,
                invitationId: initialInvitationId,
                name: r.name,
                attendance: r.attendance,
                guestCount: r.guestCount || 1,
                notes: r.notes || '',
                submittedAt: r.submittedAt
                  ? new Date(r.submittedAt)
                  : new Date(),
              },
            });
          }
        } catch {
          // Ignore
        }
      }

      console.log('✅ Seeded initial Destia & Rakafansa via Prisma ORM!');
    }
  } catch (err) {
    console.warn('Prisma seed warning (fallback available):', err);
  }

  saasInitialized = true;
}

// -------------------------------------------------------------
// CLIENTS CRUD (PRISMA ORM)
// -------------------------------------------------------------
export async function getClients(): Promise<ClientRecord[]> {
  await initializeSaasStorage();
  try {
    const rows = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitations: {
          select: {
            id: true,
            title: true,
            slug: true,
            status: true,
            templateId: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      invitationsCount: row.invitations.length,
      invitations: row.invitations.map((inv) => ({
        id: inv.id,
        title: inv.title,
        slug: inv.slug,
        status: inv.status as InvitationStatus,
        templateId: inv.templateId,
      })),
    }));
  } catch (error) {
    console.error('Prisma getClients fallback to file:', error);
    if (!fs.existsSync(CLIENTS_FILE)) return [];
    try {
      return JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  await initializeSaasStorage();
  try {
    const row = await prisma.client.findUnique({
      where: { id },
      include: {
        invitations: true,
      },
    });

    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Prisma getClientById fallback:', error);
    const clients = await getClients();
    return clients.find((c) => c.id === id) || null;
  }
}

export async function createClient(
  data: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ClientRecord> {
  await initializeSaasStorage();
  const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    const row = await prisma.client.create({
      data: {
        id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || '',
        package: data.package?.trim() || 'Standard',
        notes: data.notes?.trim() || '',
        status: data.status || 'active',
      },
    });

    const newClient: ClientRecord = {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };

    // Backup to JSON
    try {
      const clients = await getClients();
      fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2), 'utf-8');
    } catch {
      // Ignore
    }

    return newClient;
  } catch (error) {
    console.error('Error creating client via Prisma:', error);
    throw error;
  }
}

export async function updateClient(
  id: string,
  data: Partial<ClientRecord>,
): Promise<ClientRecord | null> {
  await initializeSaasStorage();
  try {
    const row = await prisma.client.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name.trim() : undefined,
        phone: data.phone !== undefined ? data.phone.trim() : undefined,
        email: data.email !== undefined ? data.email.trim() : undefined,
        package: data.package !== undefined ? data.package.trim() : undefined,
        notes: data.notes !== undefined ? data.notes.trim() : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
    });

    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error updating client via Prisma:', error);
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  await initializeSaasStorage();
  try {
    await prisma.client.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting client via Prisma:', error);
    return false;
  }
}

// -------------------------------------------------------------
// INVITATIONS CRUD (PRISMA ORM)
// -------------------------------------------------------------
export async function getInvitations(): Promise<InvitationRecord[]> {
  await initializeSaasStorage();
  try {
    const rows = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { id: true, name: true, phone: true, package: true },
        },
        rsvps: true,
      },
    });

    return rows.map((row) => ({
      id: row.id,
      clientId: row.clientId || '',
      title: row.title,
      slug: row.slug,
      templateId: row.templateId,
      status: row.status as InvitationStatus,
      eventDate: row.eventDate || '',
      viewsCount: row.viewsCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      client: row.client,
      rsvpsCount: row.rsvps.length,
      attendingCount: row.rsvps.filter((r) => r.attendance === 'Hadir').length,
    }));
  } catch (error) {
    console.error('Prisma getInvitations fallback to file:', error);
    if (!fs.existsSync(INVITATIONS_FILE)) return [];
    try {
      return JSON.parse(fs.readFileSync(INVITATIONS_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
}

export async function getInvitationById(
  id: string,
): Promise<InvitationRecord | null> {
  await initializeSaasStorage();
  try {
    const row = await prisma.invitation.findUnique({
      where: { id },
      include: {
        client: true,
        rsvps: true,
      },
    });

    if (!row) return null;
    return {
      id: row.id,
      clientId: row.clientId || '',
      title: row.title,
      slug: row.slug,
      templateId: row.templateId,
      status: row.status as InvitationStatus,
      eventDate: row.eventDate || '',
      viewsCount: row.viewsCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      client: row.client,
      rsvpsCount: row.rsvps.length,
      attendingCount: row.rsvps.filter((r) => r.attendance === 'Hadir').length,
    };
  } catch (error) {
    console.error('Prisma getInvitationById fallback:', error);
    const invs = await getInvitations();
    return invs.find((i) => i.id === id) || null;
  }
}

export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationRecord | null> {
  await initializeSaasStorage();
  const normalized = slug.trim().toLowerCase();
  try {
    const row = await prisma.invitation.findFirst({
      where: {
        slug: {
          equals: normalized,
          mode: 'insensitive',
        },
      },
      include: {
        client: true,
      },
    });

    if (!row) return null;
    return {
      id: row.id,
      clientId: row.clientId || '',
      title: row.title,
      slug: row.slug,
      templateId: row.templateId,
      status: row.status as InvitationStatus,
      eventDate: row.eventDate || '',
      viewsCount: row.viewsCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Prisma getInvitationBySlug fallback:', error);
    const invs = await getInvitations();
    return (
      invs.find((inv) => inv.slug.trim().toLowerCase() === normalized) || null
    );
  }
}

export async function createInvitation(params: {
  clientId: string;
  title: string;
  slug: string;
  templateId?: string;
  status?: InvitationStatus;
  eventDate?: string;
}): Promise<InvitationRecord> {
  await initializeSaasStorage();
  const invitations = await getInvitations();

  // Normalize slug
  let cleanSlug = params.slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!cleanSlug) {
    cleanSlug = `wedding-${Date.now()}`;
  }

  // Ensure unique slug
  let finalSlug = cleanSlug;
  let counter = 1;
  while (invitations.some((inv) => inv.slug.toLowerCase() === finalSlug)) {
    finalSlug = `${cleanSlug}-${counter}`;
    counter++;
  }

  const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const templateId = params.templateId || 'netflix';
  const status = params.status || 'draft';
  const eventDate = params.eventDate || new Date().toISOString().split('T')[0];

  const initialConfig: WeddingConfig = {
    ...DEFAULT_WEDDING_CONFIG,
    templateId,
    title: params.title.trim(),
    cover: {
      ...DEFAULT_WEDDING_CONFIG.cover,
      title: params.title.toUpperCase(),
    },
    countdown: {
      ...DEFAULT_WEDDING_CONFIG.countdown,
      targetDate: `${eventDate}T09:00:00+07:00`,
    },
  };

  try {
    const row = await prisma.invitation.create({
      data: {
        id,
        clientId: params.clientId,
        title: params.title.trim(),
        slug: finalSlug,
        templateId,
        status,
        eventDate,
        viewsCount: 0,
        config: {
          create: {
            config: initialConfig as object,
          },
        },
      },
    });

    const newInvitation: InvitationRecord = {
      id: row.id,
      clientId: row.clientId || '',
      title: row.title,
      slug: row.slug,
      templateId: row.templateId,
      status: row.status as InvitationStatus,
      eventDate: row.eventDate || '',
      viewsCount: row.viewsCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };

    // Backup to filesystem
    try {
      const tenantDir = path.join(TENANTS_DIR, id);
      ensureDirectoryExistence(tenantDir);
      fs.writeFileSync(
        path.join(tenantDir, 'config.json'),
        JSON.stringify(initialConfig, null, 2),
        'utf-8',
      );
      fs.writeFileSync(
        path.join(tenantDir, 'rsvps.json'),
        JSON.stringify([], null, 2),
        'utf-8',
      );
      fs.writeFileSync(
        path.join(tenantDir, 'wishes.json'),
        JSON.stringify([], null, 2),
        'utf-8',
      );
    } catch {
      // Ignore
    }

    return newInvitation;
  } catch (error) {
    console.error('Error creating invitation via Prisma:', error);
    throw error;
  }
}

export async function updateInvitation(
  id: string,
  data: Partial<InvitationRecord>,
): Promise<InvitationRecord | null> {
  await initializeSaasStorage();
  try {
    const existing = await getInvitationById(id);
    if (!existing) return null;

    let finalSlug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      const cleanSlug = data.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const check = await getInvitationBySlug(cleanSlug);
      if (check && check.id !== id) {
        throw new Error(
          `Slug '${cleanSlug}' sudah digunakan oleh undangan lain`,
        );
      }
      finalSlug = cleanSlug;
    }

    const row = await prisma.invitation.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : undefined,
        slug: finalSlug,
        templateId: data.templateId || undefined,
        status: data.status || undefined,
        eventDate: data.eventDate || undefined,
      },
    });

    // If templateId changed, sync config
    if (data.templateId) {
      try {
        const config = await getInvitationConfig(id);
        config.templateId = data.templateId;
        await saveInvitationConfig(id, config);
      } catch (e) {
        console.error('Sync templateId to config warning:', e);
      }
    }

    return {
      id: row.id,
      clientId: row.clientId || '',
      title: row.title,
      slug: row.slug,
      templateId: row.templateId,
      status: row.status as InvitationStatus,
      eventDate: row.eventDate || '',
      viewsCount: row.viewsCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error updating invitation via Prisma:', error);
    throw error;
  }
}

export async function incrementInvitationViews(id: string): Promise<void> {
  try {
    await prisma.invitation.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 },
      },
    });
  } catch (err) {
    console.error('Error incrementing views via Prisma:', err);
  }
}

export async function deleteInvitation(id: string): Promise<boolean> {
  await initializeSaasStorage();
  try {
    await prisma.invitation.delete({ where: { id } });

    // Also clean local directory
    try {
      const tenantDir = path.join(TENANTS_DIR, id);
      if (fs.existsSync(tenantDir)) {
        fs.rmSync(tenantDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore
    }

    return true;
  } catch (error) {
    console.error('Error deleting invitation via Prisma:', error);
    return false;
  }
}

// -------------------------------------------------------------
// TENANT CONFIG (PRISMA JSONB + FILE BACKUP)
// -------------------------------------------------------------
export async function getInvitationConfig(
  invitationId: string,
): Promise<WeddingConfig> {
  await initializeSaasStorage();
  try {
    const row = await prisma.weddingConfig.findUnique({
      where: { invitationId },
    });

    if (row?.config) {
      const parsed = row.config as unknown as Partial<WeddingConfig>;
      return {
        ...DEFAULT_WEDDING_CONFIG,
        ...parsed,
        cover: { ...DEFAULT_WEDDING_CONFIG.cover, ...(parsed.cover || {}) },
        opening: {
          ...DEFAULT_WEDDING_CONFIG.opening,
          ...(parsed.opening || {}),
        },
        trailer: {
          ...DEFAULT_WEDDING_CONFIG.trailer,
          ...(parsed.trailer || {}),
        },
        couple: {
          bride: {
            ...DEFAULT_WEDDING_CONFIG.couple.bride,
            ...(parsed.couple?.bride || {}),
          },
          groom: {
            ...DEFAULT_WEDDING_CONFIG.couple.groom,
            ...(parsed.couple?.groom || {}),
          },
        },
        countdown: {
          ...DEFAULT_WEDDING_CONFIG.countdown,
          ...(parsed.countdown || {}),
        },
        closing: {
          ...DEFAULT_WEDDING_CONFIG.closing,
          ...(parsed.closing || {}),
        },
        music: { ...DEFAULT_WEDDING_CONFIG.music, ...(parsed.music || {}) },
        privacyMode: {
          ...DEFAULT_WEDDING_CONFIG.privacyMode,
          ...(parsed.privacyMode || {}),
        },
        gallery: parsed.gallery || DEFAULT_WEDDING_CONFIG.gallery,
        events: parsed.events || DEFAULT_WEDDING_CONFIG.events,
        loveStory: parsed.loveStory || DEFAULT_WEDDING_CONFIG.loveStory,
        gifts: parsed.gifts || DEFAULT_WEDDING_CONFIG.gifts,
      };
    }
  } catch (error) {
    console.error('Prisma getInvitationConfig fallback:', error);
  }

  // Fallback to file
  const configFile = path.join(TENANTS_DIR, invitationId, 'config.json');
  if (fs.existsSync(configFile)) {
    try {
      const raw = fs.readFileSync(configFile, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return DEFAULT_WEDDING_CONFIG;
    }
  }

  return DEFAULT_WEDDING_CONFIG;
}

export async function saveInvitationConfig(
  invitationId: string,
  config: WeddingConfig,
): Promise<boolean> {
  await initializeSaasStorage();
  try {
    // 1. Upsert to Prisma WeddingConfig (JSONB)
    await prisma.weddingConfig.upsert({
      where: { invitationId },
      update: {
        config: config as object,
      },
      create: {
        invitationId,
        config: config as object,
      },
    });

    // 2. Sync title & templateId in Invitation model
    if (config.title) {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          title: config.title,
          templateId: config.templateId || undefined,
        },
      });
    }

    // 3. Backup to filesystem
    try {
      const tenantDir = path.join(TENANTS_DIR, invitationId);
      ensureDirectoryExistence(tenantDir);
      fs.writeFileSync(
        path.join(tenantDir, 'config.json'),
        JSON.stringify(config, null, 2),
        'utf-8',
      );
    } catch {
      // Ignore
    }

    return true;
  } catch (error) {
    console.error('Error saving config via Prisma:', error);
    return false;
  }
}

// -------------------------------------------------------------
// TENANT RSVP & WISHES (PRISMA ORM)
// -------------------------------------------------------------
export async function getTenantRsvps(
  invitationId: string,
): Promise<RsvpRecord[]> {
  await initializeSaasStorage();
  try {
    const rows = await prisma.rsvp.findMany({
      where: { invitationId },
      orderBy: { submittedAt: 'desc' },
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      attendance: r.attendance as 'Hadir' | 'Tidak Hadir',
      guestCount: r.guestCount,
      notes: r.notes || '',
      submittedAt: r.submittedAt.toISOString(),
    }));
  } catch (error) {
    console.error('Prisma getTenantRsvps fallback to file:', error);
    const file = path.join(TENANTS_DIR, invitationId, 'rsvps.json');
    if (!fs.existsSync(file)) return [];
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return [];
    }
  }
}

export async function saveTenantRsvp(
  invitationId: string,
  payload: RsvpPayload,
): Promise<RsvpRecord> {
  await initializeSaasStorage();
  const id = Date.now().toString();
  const name = payload.name.trim();
  const attendance = payload.attendance;
  const guestCount =
    attendance === 'Hadir' ? Number(payload.guestCount || 1) : 0;
  const notes = payload.notes ? payload.notes.trim() : '';

  try {
    const row = await prisma.rsvp.create({
      data: {
        id,
        invitationId,
        name,
        attendance,
        guestCount,
        notes,
      },
    });

    const newRsvp: RsvpRecord = {
      id: row.id,
      name: row.name,
      attendance: row.attendance as 'Hadir' | 'Tidak Hadir',
      guestCount: row.guestCount,
      notes: row.notes || '',
      submittedAt: row.submittedAt.toISOString(),
    };

    // Backup to file
    try {
      const tenantDir = path.join(TENANTS_DIR, invitationId);
      ensureDirectoryExistence(tenantDir);
      const rsvps = await getTenantRsvps(invitationId);
      fs.writeFileSync(
        path.join(tenantDir, 'rsvps.json'),
        JSON.stringify(rsvps, null, 2),
        'utf-8',
      );
    } catch {
      // Ignore
    }

    return newRsvp;
  } catch (error) {
    console.error('Error saving RSVP via Prisma:', error);
    throw error;
  }
}

export async function getTenantWishes(
  invitationId: string,
): Promise<WishRecord[]> {
  await initializeSaasStorage();
  try {
    const rows = await prisma.wish.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((w) => ({
      id: w.id,
      name: w.name,
      status: w.status as 'Hadir' | 'Tidak Hadir',
      message: w.message,
      createdAt: w.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Prisma getTenantWishes fallback to file:', error);
    const file = path.join(TENANTS_DIR, invitationId, 'wishes.json');
    if (!fs.existsSync(file)) return [];
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch {
      return [];
    }
  }
}

export async function saveTenantWish(
  invitationId: string,
  payload: WishPayload,
): Promise<WishRecord> {
  await initializeSaasStorage();
  const id = Date.now().toString();
  const name = payload.name.trim();
  const status = payload.status || 'Hadir';
  const message = payload.message.trim();

  try {
    const row = await prisma.wish.create({
      data: {
        id,
        invitationId,
        name,
        status,
        message,
      },
    });

    const newWish: WishRecord = {
      id: row.id,
      name: row.name,
      status: row.status as 'Hadir' | 'Tidak Hadir',
      message: row.message,
      createdAt: row.createdAt.toISOString(),
    };

    // Backup to file
    try {
      const tenantDir = path.join(TENANTS_DIR, invitationId);
      ensureDirectoryExistence(tenantDir);
      const wishes = await getTenantWishes(invitationId);
      fs.writeFileSync(
        path.join(tenantDir, 'wishes.json'),
        JSON.stringify(wishes, null, 2),
        'utf-8',
      );
    } catch {
      // Ignore
    }

    return newWish;
  } catch (error) {
    console.error('Error saving Wish via Prisma:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// SAAS OVERALL STATS (PRISMA AGGREGATION)
// -------------------------------------------------------------
export async function getSaasStats(): Promise<SaasStats> {
  await initializeSaasStorage();
  try {
    const [
      totalClients,
      totalInvitations,
      publishedCount,
      draftCount,
      inactiveCount,
      totalRsvps,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.invitation.count(),
      prisma.invitation.count({ where: { status: 'published' } }),
      prisma.invitation.count({ where: { status: 'draft' } }),
      prisma.invitation.count({ where: { status: 'inactive' } }),
      prisma.rsvp.count(),
    ]);

    return {
      totalClients,
      totalInvitations,
      publishedCount,
      draftCount,
      inactiveCount,
      totalTemplates: AVAILABLE_TEMPLATES.length,
      totalRsvps,
    };
  } catch (error) {
    console.error('Prisma getSaasStats fallback:', error);
    const clients = await getClients();
    const invitations = await getInvitations();

    let totalRsvps = 0;
    for (const inv of invitations) {
      const rsvps = await getTenantRsvps(inv.id);
      totalRsvps += rsvps.length;
    }

    return {
      totalClients: clients.length,
      totalInvitations: invitations.length,
      publishedCount: invitations.filter((i) => i.status === 'published')
        .length,
      draftCount: invitations.filter((i) => i.status === 'draft').length,
      inactiveCount: invitations.filter((i) => i.status === 'inactive').length,
      totalTemplates: AVAILABLE_TEMPLATES.length,
      totalRsvps,
    };
  }
}

// -------------------------------------------------------------
// CLIENT ONBOARDING HELPERS
// -------------------------------------------------------------
export function configToOnboardingForm(
  config: WeddingConfig,
): OnboardingFormData {
  const events = config.events || [];
  const akad =
    events.find((e) => e.type?.toUpperCase().includes('AKAD')) || events[0];
  const resepsi =
    events.find((e) => e.type?.toUpperCase().includes('RESEPSI')) ||
    events[1] ||
    events[0];
  const others = events.filter((e) => e !== akad && e !== resepsi);

  return {
    couple: {
      groom: {
        fullName: config.couple?.groom?.name || '',
        callName: config.couple?.groom?.callname || '',
        fatherName: config.couple?.groom?.parents?.father || '',
        motherName: config.couple?.groom?.parents?.mother || '',
        childOrder: config.couple?.groom?.characterRole || 'Putra pertama dari',
        instagram: config.couple?.groom?.instagram || '',
        photo: config.couple?.groom?.photo || '',
        bio: config.couple?.groom?.bio || '',
      },
      bride: {
        fullName: config.couple?.bride?.name || '',
        callName: config.couple?.bride?.callname || '',
        fatherName: config.couple?.bride?.parents?.father || '',
        motherName: config.couple?.bride?.parents?.mother || '',
        childOrder: config.couple?.bride?.characterRole || 'Putri kedua dari',
        instagram: config.couple?.bride?.instagram || '',
        photo: config.couple?.bride?.photo || '',
        bio: config.couple?.bride?.bio || '',
      },
      coverPhoto: config.cover?.bgImage || '',
    },
    events: {
      akad: {
        date: akad?.date || '',
        startTime: akad?.time?.split('-')[0]?.trim() || '08:00',
        endTime: akad?.time?.split('-')[1]?.trim() || '10:00 WIB',
        venueName: akad?.venue || '',
        address: akad?.address || '',
        mapUrl: akad?.mapUrl || '',
      },
      resepsi: {
        date: resepsi?.date || '',
        startTime: resepsi?.time?.split('-')[0]?.trim() || '11:00',
        endTime: resepsi?.time?.split('-')[1]?.trim() || '14:00 WIB',
        venueName: resepsi?.venue || '',
        address: resepsi?.address || '',
        mapUrl: resepsi?.mapUrl || '',
      },
      additionalEvents: others.map((e) => ({
        id: e.id,
        title: e.title || e.type,
        date: e.date,
        time: e.time,
        venueName: e.venue,
        address: e.address,
        mapUrl: e.mapUrl,
      })),
    },
    story: {
      stories: (config.loveStory || []).map((s, idx) => ({
        id: s.id || `story-${s.year}-${idx}`,
        year: s.year,
        title: s.event,
        desc: s.desc,
      })),
      galleryPhotos: (config.gallery || []).map((g) => g.src),
      videoUrl: config.trailer?.videoUrl || '',
    },
    gift: {
      bankAccounts: (config.gifts || []).map((g) => ({
        id: g.id,
        bank: g.bank,
        number: g.number,
        owner: g.owner,
      })),
      musicTitle: config.music?.title || '',
      audioUrl: config.music?.audioUrl || '',
    },
    closing: {
      quote: config.opening?.quote || '',
      quoteSource: config.opening?.quoteSource || 'QS. AR-RUM : 21',
      closingMessage: config.closing?.message || '',
    },
  };
}

export function onboardingFormToConfig(
  existing: WeddingConfig,
  form: OnboardingFormData,
): WeddingConfig {
  const groomCall = form.couple.groom.callName.trim() || 'Groom';
  const brideCall = form.couple.bride.callName.trim() || 'Bride';
  const groomFull = form.couple.groom.fullName.trim() || groomCall;
  const brideFull = form.couple.bride.fullName.trim() || brideCall;
  const coupleTitle = `${groomCall} & ${brideCall}`;
  const coupleFullTitle = `${groomFull} & ${brideFull}`;

  const akadTime =
    `${form.events.akad.startTime} - ${form.events.akad.endTime}`.trim();
  const resepsiTime =
    `${form.events.resepsi.startTime} - ${form.events.resepsi.endTime}`.trim();

  const primaryDate =
    form.events.akad.date ||
    form.events.resepsi.date ||
    existing.countdown.targetDate.split('T')[0];

  const updatedEvents = [
    {
      id: 'event-akad',
      type: 'AKAD NIKAH',
      episodeNumber: 1,
      title: 'AKAD NIKAH',
      duration: 'Sakral • Janji Suci',
      synopsis:
        'Momen pengucapan ijab kabul sakral penyatuan dua insan dalam ikatan pernikahan.',
      date: form.events.akad.date || primaryDate,
      time: akadTime || '08:00 - 10:00 WIB',
      venue: form.events.akad.venueName,
      address: form.events.akad.address,
      mapUrl: form.events.akad.mapUrl,
      calendarUrl: existing.events?.[0]?.calendarUrl || '',
      venuePhoto: existing.events?.[0]?.venuePhoto,
    },
    {
      id: 'event-resepsi',
      type: 'RESEPSI PERNIKAHAN',
      episodeNumber: 2,
      title: 'RESEPSI PERNIKAHAN',
      duration: 'Selebrasi • Jamuan Kasih',
      synopsis:
        'Pesta perayaan dan ramah tamah bersama sanak saudara serta sahabat tercinta.',
      date: form.events.resepsi.date || primaryDate,
      time: resepsiTime || '11:00 - 14:00 WIB',
      venue: form.events.resepsi.venueName,
      address: form.events.resepsi.address,
      mapUrl: form.events.resepsi.mapUrl,
      calendarUrl: existing.events?.[1]?.calendarUrl || '',
      venuePhoto: existing.events?.[1]?.venuePhoto,
    },
    ...(form.events.additionalEvents || []).map((e, idx) => ({
      id: e.id || `event-extra-${idx}`,
      type: e.title.toUpperCase(),
      episodeNumber: 3 + idx,
      title: e.title,
      duration: 'Rangkaian Spesial',
      synopsis: 'Rangkaian acara pendukung pernikahan.',
      date: e.date || primaryDate,
      time: e.time,
      venue: e.venueName,
      address: e.address,
      mapUrl: e.mapUrl,
      calendarUrl: '',
    })),
  ];

  const updatedGallery = form.story.galleryPhotos.map((src, idx) => ({
    id: `photo-${idx + 1}`,
    src,
    title: `${coupleTitle} - Moment ${idx + 1}`,
    category: (idx % 2 === 0 ? 'prewedding' : 'lead') as
      | 'prewedding'
      | 'lead'
      | 'venue',
    tag: `Photo ${idx + 1}`,
    aspect: (idx % 3 === 0
      ? 'portrait'
      : idx % 3 === 1
        ? 'landscape'
        : 'square') as 'portrait' | 'landscape' | 'square',
  }));

  const updatedStories = form.story.stories.map((s, idx) => ({
    id: `story-${idx + 1}`,
    year: s.year,
    event: s.title,
    desc: s.desc,
    season: `Chapter ${idx + 1}`,
    duration: 'Episode Romance',
  }));

  const updatedGifts = form.gift.bankAccounts.map((b, idx) => ({
    id: b.id || `gift-${idx + 1}`,
    bank: b.bank,
    number: b.number,
    owner: b.owner,
  }));

  return {
    ...existing,
    title: `${coupleTitle} | The Wedding`,
    seoDescription: `Undangan Pernikahan ${coupleFullTitle} - ${primaryDate}`,
    cover: {
      ...existing.cover,
      title: coupleTitle.toUpperCase(),
      starring: coupleFullTitle,
      bgImage: form.couple.coverPhoto || existing.cover.bgImage,
      year: primaryDate ? primaryDate.split('-')[0] : existing.cover.year,
    },
    opening: {
      ...existing.opening,
      title: `${coupleTitle}:`,
      dateText: primaryDate,
      locationText:
        `${form.events.akad.venueName || ''} & ${form.events.resepsi.venueName || ''}`.replace(
          /^ & | & $/g,
          '',
        ),
      quote: form.closing.quote || existing.opening.quote,
      quoteSource: form.closing.quoteSource || existing.opening.quoteSource,
      posterImage: form.couple.coverPhoto || existing.opening.posterImage,
    },
    couple: {
      groom: {
        ...existing.couple.groom,
        name: groomFull,
        callname: groomCall,
        characterRole:
          form.couple.groom.childOrder || existing.couple.groom.characterRole,
        bio: form.couple.groom.bio || existing.couple.groom.bio,
        instagram: form.couple.groom.instagram,
        photo: form.couple.groom.photo || existing.couple.groom.photo,
        parents: {
          father: form.couple.groom.fatherName,
          mother: form.couple.groom.motherName,
        },
      },
      bride: {
        ...existing.couple.bride,
        name: brideFull,
        callname: brideCall,
        characterRole:
          form.couple.bride.childOrder || existing.couple.bride.characterRole,
        bio: form.couple.bride.bio || existing.couple.bride.bio,
        instagram: form.couple.bride.instagram,
        photo: form.couple.bride.photo || existing.couple.bride.photo,
        parents: {
          father: form.couple.bride.fatherName,
          mother: form.couple.bride.motherName,
        },
      },
    },
    events: updatedEvents,
    countdown: {
      ...existing.countdown,
      targetDate: primaryDate
        ? `${primaryDate}T09:00:00+07:00`
        : existing.countdown.targetDate,
    },
    gallery: updatedGallery.length > 0 ? updatedGallery : existing.gallery,
    loveStory: updatedStories.length > 0 ? updatedStories : existing.loveStory,
    gifts: updatedGifts.length > 0 ? updatedGifts : existing.gifts,
    closing: {
      ...existing.closing,
      names: coupleTitle.toUpperCase(),
      message: form.closing.closingMessage || existing.closing.message,
    },
    music: {
      ...existing.music,
      title: form.gift.musicTitle || existing.music.title,
      audioUrl: form.gift.audioUrl || existing.music.audioUrl,
    },
    trailer: {
      ...existing.trailer,
      filmTitle: `${coupleTitle}: The Journey`,
      videoUrl: form.story.videoUrl || existing.trailer.videoUrl,
      posterUrl: form.couple.coverPhoto || existing.trailer.posterUrl,
    },
  };
}

export async function getInvitationForOnboarding(
  token: string,
): Promise<OnboardingResponseData | null> {
  const inv =
    (await getInvitationById(token)) || (await getInvitationBySlug(token));
  if (!inv) return null;

  const config = await getInvitationConfig(inv.id);
  const formData = configToOnboardingForm(config);
  const [rsvps, wishes] = await Promise.all([
    getTenantRsvps(inv.id),
    getTenantWishes(inv.id),
  ]);

  return {
    invitation: {
      id: inv.id,
      title: inv.title,
      slug: inv.slug,
      status: inv.status,
      eventDate: inv.eventDate,
      templateId: inv.templateId,
    },
    client: inv.client || null,
    formData,
    rsvps,
    wishes,
  };
}

export async function saveOnboardingSubmission(
  token: string,
  formData: OnboardingFormData,
  isFinalSubmit = false,
): Promise<{
  success: boolean;
  message: string;
  invitation: InvitationRecord;
}> {
  const inv =
    (await getInvitationById(token)) || (await getInvitationBySlug(token));
  if (!inv) throw new Error('Undangan tidak ditemukan');

  const currentConfig = await getInvitationConfig(inv.id);
  const updatedConfig = onboardingFormToConfig(currentConfig, formData);

  await saveInvitationConfig(inv.id, updatedConfig);

  const primaryDate = formData.events.akad.date || formData.events.resepsi.date;
  const updatePayload: Partial<InvitationRecord> = {};
  if (primaryDate && primaryDate !== inv.eventDate) {
    updatePayload.eventDate = primaryDate;
  }

  let updatedInv = inv;
  if (Object.keys(updatePayload).length > 0) {
    const res = await updateInvitation(inv.id, updatePayload);
    if (res) updatedInv = res;
  }

  return {
    success: true,
    message: isFinalSubmit
      ? 'Formulir data pernikahan berhasil dikirimkan ke tim desainer!'
      : 'Draf data berhasil disimpan!',
    invitation: updatedInv,
  };
}
