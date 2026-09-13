import fs from 'node:fs';
import path from 'node:path';
import type {
  ClientRecord,
  InvitationRecord,
  InvitationStatus,
  SaasStats,
  WeddingConfig,
} from '@/types/wedding';
import type { RsvpPayload, RsvpRecord } from '@/types/rsvp';
import type { WishPayload, WishRecord } from '@/types/wishes';
import { DEFAULT_WEDDING_CONFIG } from './wedding-data';
import { AVAILABLE_TEMPLATES } from '@/components/templates/registry';

const DATA_DIR = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const INVITATIONS_FILE = path.join(DATA_DIR, 'invitations.json');
const TENANTS_DIR = path.join(DATA_DIR, 'tenants');

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Auto-seed initial tenant data (Destia & Rakafansa) if first time
export function initializeSaasStorage(): void {
  ensureDirectoryExistence(DATA_DIR);
  ensureDirectoryExistence(TENANTS_DIR);

  const initialClientId = 'client-destia';
  const initialInvitationId = 'inv-destia-rakafansa';
  const initialSlug = 'destia-rakafansa';

  // 1. Initialize Clients
  if (!fs.existsSync(CLIENTS_FILE)) {
    const defaultClients: ClientRecord[] = [
      {
        id: initialClientId,
        name: 'Destia & Rakafansa',
        phone: '081234567890',
        email: 'destia.rakafansa@example.com',
        package: 'Cinematic VIP',
        notes: 'Client perdana paket Netflix Cinematic Theme',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(
      CLIENTS_FILE,
      JSON.stringify(defaultClients, null, 2),
      'utf-8',
    );
  }

  // 2. Initialize Invitations
  if (!fs.existsSync(INVITATIONS_FILE)) {
    const defaultInvitations: InvitationRecord[] = [
      {
        id: initialInvitationId,
        clientId: initialClientId,
        title: 'Destia & Rakafansa | The Wedding',
        slug: initialSlug,
        templateId: 'netflix',
        status: 'published',
        eventDate: '2026-11-14',
        viewsCount: 142,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(
      INVITATIONS_FILE,
      JSON.stringify(defaultInvitations, null, 2),
      'utf-8',
    );
  }

  // 3. Initialize Tenant Directory for Destia & Rakafansa
  const destiaTenantDir = path.join(TENANTS_DIR, initialInvitationId);
  ensureDirectoryExistence(destiaTenantDir);

  const destiaConfigFile = path.join(destiaTenantDir, 'config.json');
  if (!fs.existsSync(destiaConfigFile)) {
    const oldConfigFile = path.join(DATA_DIR, 'wedding-config.json');
    let seedConfig = DEFAULT_WEDDING_CONFIG;
    if (fs.existsSync(oldConfigFile)) {
      try {
        const raw = fs.readFileSync(oldConfigFile, 'utf-8');
        seedConfig = JSON.parse(raw);
      } catch {
        seedConfig = DEFAULT_WEDDING_CONFIG;
      }
    }
    fs.writeFileSync(
      destiaConfigFile,
      JSON.stringify(seedConfig, null, 2),
      'utf-8',
    );
  }

  // Seed RSVPs for Destia
  const destiaRsvpFile = path.join(destiaTenantDir, 'rsvps.json');
  if (!fs.existsSync(destiaRsvpFile)) {
    const oldRsvpFile = path.join(DATA_DIR, 'rsvp.json');
    let rsvps: RsvpRecord[] = [];
    if (fs.existsSync(oldRsvpFile)) {
      try {
        rsvps = JSON.parse(fs.readFileSync(oldRsvpFile, 'utf-8'));
      } catch {
        rsvps = [];
      }
    }
    fs.writeFileSync(destiaRsvpFile, JSON.stringify(rsvps, null, 2), 'utf-8');
  }

  // Seed Wishes for Destia
  const destiaWishFile = path.join(destiaTenantDir, 'wishes.json');
  if (!fs.existsSync(destiaWishFile)) {
    const oldWishFile = path.join(DATA_DIR, 'wishes.json');
    let wishes: WishRecord[] = [];
    if (fs.existsSync(oldWishFile)) {
      try {
        wishes = JSON.parse(fs.readFileSync(oldWishFile, 'utf-8'));
      } catch {
        wishes = [];
      }
    }
    fs.writeFileSync(destiaWishFile, JSON.stringify(wishes, null, 2), 'utf-8');
  }
}

// -------------------------------------------------------------
// CLIENTS CRUD
// -------------------------------------------------------------
export async function getClients(): Promise<ClientRecord[]> {
  initializeSaasStorage();
  try {
    const raw = fs.readFileSync(CLIENTS_FILE, 'utf-8');
    return JSON.parse(raw) as ClientRecord[];
  } catch (error) {
    console.error('Error reading clients:', error);
    return [];
  }
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  const clients = await getClients();
  return clients.find((c) => c.id === id) || null;
}

export async function createClient(
  data: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ClientRecord> {
  const clients = await getClients();
  const newClient: ClientRecord = {
    id: `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || '',
    package: data.package?.trim() || 'Standard',
    notes: data.notes?.trim() || '',
    status: data.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  clients.unshift(newClient);
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2), 'utf-8');
  return newClient;
}

export async function updateClient(
  id: string,
  data: Partial<ClientRecord>,
): Promise<ClientRecord | null> {
  const clients = await getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updated: ClientRecord = {
    ...clients[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  clients[index] = updated;
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2), 'utf-8');
  return updated;
}

export async function deleteClient(id: string): Promise<boolean> {
  const clients = await getClients();
  const filtered = clients.filter((c) => c.id !== id);
  if (filtered.length === clients.length) return false;

  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');

  // Also remove associated invitations and tenant data
  const invitations = await getInvitations();
  const remainingInvs = invitations.filter((inv) => inv.clientId !== id);
  const deletedInvs = invitations.filter((inv) => inv.clientId === id);

  fs.writeFileSync(
    INVITATIONS_FILE,
    JSON.stringify(remainingInvs, null, 2),
    'utf-8',
  );

  for (const inv of deletedInvs) {
    const tenantPath = path.join(TENANTS_DIR, inv.id);
    if (fs.existsSync(tenantPath)) {
      fs.rmSync(tenantPath, { recursive: true, force: true });
    }
  }

  return true;
}

// -------------------------------------------------------------
// INVITATIONS CRUD
// -------------------------------------------------------------
export async function getInvitations(): Promise<InvitationRecord[]> {
  initializeSaasStorage();
  try {
    const raw = fs.readFileSync(INVITATIONS_FILE, 'utf-8');
    return JSON.parse(raw) as InvitationRecord[];
  } catch (error) {
    console.error('Error reading invitations:', error);
    return [];
  }
}

export async function getInvitationById(
  id: string,
): Promise<InvitationRecord | null> {
  const invitations = await getInvitations();
  return invitations.find((inv) => inv.id === id) || null;
}

export async function getInvitationBySlug(
  slug: string,
): Promise<InvitationRecord | null> {
  const invitations = await getInvitations();
  const normalized = slug.trim().toLowerCase();
  return (
    invitations.find((inv) => inv.slug.trim().toLowerCase() === normalized) ||
    null
  );
}

export async function createInvitation(params: {
  clientId: string;
  title: string;
  slug: string;
  templateId?: string;
  status?: InvitationStatus;
  eventDate?: string;
}): Promise<InvitationRecord> {
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

  const newInvitation: InvitationRecord = {
    id,
    clientId: params.clientId,
    title: params.title.trim(),
    slug: finalSlug,
    templateId,
    status,
    eventDate,
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  invitations.unshift(newInvitation);
  fs.writeFileSync(
    INVITATIONS_FILE,
    JSON.stringify(invitations, null, 2),
    'utf-8',
  );

  // Initialize isolated tenant folder and default config customized with title
  const tenantDir = path.join(TENANTS_DIR, id);
  ensureDirectoryExistence(tenantDir);

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

  return newInvitation;
}

export async function updateInvitation(
  id: string,
  data: Partial<InvitationRecord>,
): Promise<InvitationRecord | null> {
  const invitations = await getInvitations();
  const index = invitations.findIndex((inv) => inv.id === id);
  if (index === -1) return null;

  // If slug is being updated, validate uniqueness
  if (data.slug && data.slug !== invitations[index].slug) {
    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const conflict = invitations.find(
      (inv) => inv.id !== id && inv.slug.toLowerCase() === cleanSlug,
    );
    if (conflict) {
      throw new Error(`Slug '${cleanSlug}' sudah digunakan oleh undangan lain`);
    }
    data.slug = cleanSlug;
  }

  const updated: InvitationRecord = {
    ...invitations[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  invitations[index] = updated;
  fs.writeFileSync(
    INVITATIONS_FILE,
    JSON.stringify(invitations, null, 2),
    'utf-8',
  );

  // If templateId changed, sync with tenant config
  if (data.templateId) {
    try {
      const config = await getInvitationConfig(id);
      config.templateId = data.templateId;
      await saveInvitationConfig(id, config);
    } catch (e) {
      console.error('Failed to sync templateId to config:', e);
    }
  }

  return updated;
}

export async function incrementInvitationViews(id: string): Promise<void> {
  try {
    const invitations = await getInvitations();
    const index = invitations.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      invitations[index].viewsCount = (invitations[index].viewsCount || 0) + 1;
      fs.writeFileSync(
        INVITATIONS_FILE,
        JSON.stringify(invitations, null, 2),
        'utf-8',
      );
    }
  } catch (err) {
    console.error('Error incrementing views:', err);
  }
}

export async function deleteInvitation(id: string): Promise<boolean> {
  const invitations = await getInvitations();
  const filtered = invitations.filter((inv) => inv.id !== id);
  if (filtered.length === invitations.length) return false;

  fs.writeFileSync(
    INVITATIONS_FILE,
    JSON.stringify(filtered, null, 2),
    'utf-8',
  );

  const tenantDir = path.join(TENANTS_DIR, id);
  if (fs.existsSync(tenantDir)) {
    fs.rmSync(tenantDir, { recursive: true, force: true });
  }

  return true;
}

// -------------------------------------------------------------
// TENANT CONFIG (ISOLATED WEDDING CONFIG)
// -------------------------------------------------------------
export async function getInvitationConfig(
  invitationId: string,
): Promise<WeddingConfig> {
  initializeSaasStorage();
  const configFile = path.join(TENANTS_DIR, invitationId, 'config.json');

  if (!fs.existsSync(configFile)) {
    // If tenant config doesn't exist yet, seed with default
    ensureDirectoryExistence(path.join(TENANTS_DIR, invitationId));
    fs.writeFileSync(
      configFile,
      JSON.stringify(DEFAULT_WEDDING_CONFIG, null, 2),
      'utf-8',
    );
    return DEFAULT_WEDDING_CONFIG;
  }

  try {
    const raw = fs.readFileSync(configFile, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<WeddingConfig>;
    return {
      ...DEFAULT_WEDDING_CONFIG,
      ...parsed,
      cover: { ...DEFAULT_WEDDING_CONFIG.cover, ...(parsed.cover || {}) },
      opening: { ...DEFAULT_WEDDING_CONFIG.opening, ...(parsed.opening || {}) },
      trailer: { ...DEFAULT_WEDDING_CONFIG.trailer, ...(parsed.trailer || {}) },
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
      closing: { ...DEFAULT_WEDDING_CONFIG.closing, ...(parsed.closing || {}) },
      music: { ...DEFAULT_WEDDING_CONFIG.music, ...(parsed.music || {}) },
      gallery: parsed.gallery || DEFAULT_WEDDING_CONFIG.gallery,
      events: parsed.events || DEFAULT_WEDDING_CONFIG.events,
      loveStory: parsed.loveStory || DEFAULT_WEDDING_CONFIG.loveStory,
      gifts: parsed.gifts || DEFAULT_WEDDING_CONFIG.gifts,
    };
  } catch (error) {
    console.error(`Error reading config for tenant ${invitationId}:`, error);
    return DEFAULT_WEDDING_CONFIG;
  }
}

export async function saveInvitationConfig(
  invitationId: string,
  config: WeddingConfig,
): Promise<boolean> {
  try {
    const tenantDir = path.join(TENANTS_DIR, invitationId);
    ensureDirectoryExistence(tenantDir);
    const configFile = path.join(tenantDir, 'config.json');
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');

    // Also synchronize title in invitations.json index
    const invitations = await getInvitations();
    const index = invitations.findIndex((inv) => inv.id === invitationId);
    if (index !== -1 && config.title) {
      invitations[index].title = config.title;
      invitations[index].templateId =
        config.templateId || invitations[index].templateId;
      invitations[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(
        INVITATIONS_FILE,
        JSON.stringify(invitations, null, 2),
        'utf-8',
      );
    }

    return true;
  } catch (error) {
    console.error(`Error saving config for tenant ${invitationId}:`, error);
    return false;
  }
}

// -------------------------------------------------------------
// TENANT RSVP & WISHES (ISOLATED)
// -------------------------------------------------------------
export async function getTenantRsvps(
  invitationId: string,
): Promise<RsvpRecord[]> {
  initializeSaasStorage();
  const file = path.join(TENANTS_DIR, invitationId, 'rsvps.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export async function saveTenantRsvp(
  invitationId: string,
  payload: RsvpPayload,
): Promise<RsvpRecord> {
  const tenantDir = path.join(TENANTS_DIR, invitationId);
  ensureDirectoryExistence(tenantDir);
  const file = path.join(tenantDir, 'rsvps.json');
  const rsvps = await getTenantRsvps(invitationId);

  const newRsvp: RsvpRecord = {
    id: Date.now().toString(),
    name: payload.name.trim(),
    attendance: payload.attendance,
    guestCount:
      payload.attendance === 'Hadir' ? Number(payload.guestCount || 1) : 0,
    notes: payload.notes ? payload.notes.trim() : '',
    submittedAt: new Date().toISOString(),
  };

  rsvps.push(newRsvp);
  fs.writeFileSync(file, JSON.stringify(rsvps, null, 2), 'utf-8');
  return newRsvp;
}

export async function getTenantWishes(
  invitationId: string,
): Promise<WishRecord[]> {
  initializeSaasStorage();
  const file = path.join(TENANTS_DIR, invitationId, 'wishes.json');
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export async function saveTenantWish(
  invitationId: string,
  payload: WishPayload,
): Promise<WishRecord> {
  const tenantDir = path.join(TENANTS_DIR, invitationId);
  ensureDirectoryExistence(tenantDir);
  const file = path.join(tenantDir, 'wishes.json');
  const wishes = await getTenantWishes(invitationId);

  const newWish: WishRecord = {
    id: Date.now().toString(),
    name: payload.name.trim(),
    status: payload.status || 'Hadir',
    message: payload.message.trim(),
    createdAt: new Date().toISOString(),
  };

  const updated = [newWish, ...wishes];
  fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf-8');
  return newWish;
}

// -------------------------------------------------------------
// SAAS OVERALL STATS
// -------------------------------------------------------------
export async function getSaasStats(): Promise<SaasStats> {
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
    publishedCount: invitations.filter((i) => i.status === 'published').length,
    draftCount: invitations.filter((i) => i.status === 'draft').length,
    inactiveCount: invitations.filter((i) => i.status === 'inactive').length,
    totalTemplates: AVAILABLE_TEMPLATES.length,
    totalRsvps,
  };
}
