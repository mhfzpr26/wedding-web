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
import { initDatabaseSchema, query } from './db';

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

// Auto-seed initial tenant data (Destia & Rakafansa) to DB and filesystem
export async function initializeSaasStorage(): Promise<void> {
  if (saasInitialized) return;

  ensureDirectoryExistence(DATA_DIR);
  ensureDirectoryExistence(TENANTS_DIR);

  // 1. Ensure PostgreSQL tables exist
  try {
    await initDatabaseSchema();
  } catch (err) {
    console.error('Database schema check warning:', err);
  }

  // 2. Check if DB is connected and seeded
  try {
    const clientsCountRes = await query<{ count: string }>(
      'SELECT count(*) as count FROM saas_clients;',
    );
    const count = Number(clientsCountRes.rows[0]?.count || 0);

    const initialClientId = 'client-destia';
    const initialInvitationId = 'inv-destia-rakafansa';
    const initialSlug = 'destia-rakafansa';

    // If PostgreSQL has 0 clients, seed from existing JSON or default
    if (count === 0) {
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

      // Seed Client
      await query(
        `INSERT INTO saas_clients (id, name, phone, email, package, notes, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING;`,
        [
          initialClientId,
          'Destia & Rakafansa',
          '081234567890',
          'destia.rakafansa@example.com',
          'Cinematic VIP',
          'Client perdana paket Netflix Cinematic Theme',
          'active',
        ],
      );

      // Seed Invitation
      await query(
        `INSERT INTO saas_invitations (id, client_id, title, slug, template_id, status, event_date, views_count, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING;`,
        [
          initialInvitationId,
          initialClientId,
          'Destia & Rakafansa | The Wedding',
          initialSlug,
          'netflix',
          'published',
          '2026-11-14',
          142,
        ],
      );

      // Seed Config (JSONB)
      await query(
        `INSERT INTO saas_wedding_configs (invitation_id, config, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (invitation_id) DO UPDATE SET config = EXCLUDED.config;`,
        [initialInvitationId, JSON.stringify(seedConfig)],
      );

      // Seed RSVP if any
      const destiaTenantDir = path.join(TENANTS_DIR, initialInvitationId);
      ensureDirectoryExistence(destiaTenantDir);
      const destiaRsvpFile = path.join(destiaTenantDir, 'rsvps.json');
      if (fs.existsSync(destiaRsvpFile)) {
        try {
          const rsvps: RsvpRecord[] = JSON.parse(
            fs.readFileSync(destiaRsvpFile, 'utf-8'),
          );
          for (const r of rsvps) {
            await query(
              `INSERT INTO saas_rsvps (id, invitation_id, name, attendance, guest_count, notes, submitted_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (id) DO NOTHING;`,
              [
                r.id,
                initialInvitationId,
                r.name,
                r.attendance,
                r.guestCount || 1,
                r.notes || '',
                r.submittedAt || new Date().toISOString(),
              ],
            );
          }
        } catch {
          // Ignore
        }
      }

      console.log('✅ Seeded initial Destia & Rakafansa into PostgreSQL!');
    }
  } catch (err) {
    console.warn(
      'PostgreSQL seed skipped or fallback to file-storage:',
      err,
    );
  }

  saasInitialized = true;
}

// -------------------------------------------------------------
// CLIENTS CRUD (POSTGRESQL + FILE BACKUP)
// -------------------------------------------------------------
export async function getClients(): Promise<ClientRecord[]> {
  await initializeSaasStorage();
  try {
    const res = await query<{
      id: string;
      name: string;
      phone: string;
      email: string;
      package: string;
      notes: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT id, name, phone, email, package, notes, status, created_at, updated_at 
       FROM saas_clients 
       ORDER BY created_at DESC;`,
    );

    return res.rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('PostgreSQL getClients fallback to file:', error);
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
    const res = await query<{
      id: string;
      name: string;
      phone: string;
      email: string;
      package: string;
      notes: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>('SELECT * FROM saas_clients WHERE id = $1 LIMIT 1;', [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('PostgreSQL getClientById fallback:', error);
    const clients = await getClients();
    return clients.find((c) => c.id === id) || null;
  }
}

export async function createClient(
  data: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ClientRecord> {
  await initializeSaasStorage();
  const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const name = data.name.trim();
  const phone = data.phone.trim();
  const email = data.email?.trim() || '';
  const pkg = data.package?.trim() || 'Standard';
  const notes = data.notes?.trim() || '';
  const status = data.status || 'active';

  try {
    const res = await query<{
      id: string;
      name: string;
      phone: string;
      email: string;
      package: string;
      notes: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `INSERT INTO saas_clients (id, name, phone, email, package, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *;`,
      [id, name, phone, email, pkg, notes, status],
    );

    const row = res.rows[0];
    const newClient: ClientRecord = {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
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
    console.error('Error creating client in PostgreSQL:', error);
    throw error;
  }
}

export async function updateClient(
  id: string,
  data: Partial<ClientRecord>,
): Promise<ClientRecord | null> {
  await initializeSaasStorage();
  try {
    const existing = await getClientById(id);
    if (!existing) return null;

    const name = data.name !== undefined ? data.name.trim() : existing.name;
    const phone = data.phone !== undefined ? data.phone.trim() : existing.phone;
    const email = data.email !== undefined ? data.email.trim() : (existing.email || '');
    const pkg = data.package !== undefined ? data.package.trim() : existing.package;
    const notes = data.notes !== undefined ? data.notes.trim() : (existing.notes || '');
    const status = data.status !== undefined ? data.status : existing.status;

    const res = await query<{
      id: string;
      name: string;
      phone: string;
      email: string;
      package: string;
      notes: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `UPDATE saas_clients
       SET name = $1, phone = $2, email = $3, package = $4, notes = $5, status = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *;`,
      [name, phone, email, pkg, notes, status, id],
    );

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      package: row.package,
      notes: row.notes || '',
      status: row.status as 'active' | 'inactive',
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  } catch (error) {
    console.error('Error updating client in PostgreSQL:', error);
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  await initializeSaasStorage();
  try {
    const res = await query('DELETE FROM saas_clients WHERE id = $1;', [id]);
    return (res.rowCount || 0) > 0;
  } catch (error) {
    console.error('Error deleting client in PostgreSQL:', error);
    return false;
  }
}

// -------------------------------------------------------------
// INVITATIONS CRUD (POSTGRESQL + FILE BACKUP)
// -------------------------------------------------------------
export async function getInvitations(): Promise<InvitationRecord[]> {
  await initializeSaasStorage();
  try {
    const res = await query<{
      id: string;
      client_id: string;
      title: string;
      slug: string;
      template_id: string;
      status: string;
      event_date: string;
      views_count: number;
      created_at: Date;
      updated_at: Date;
    }>(
      `SELECT id, client_id, title, slug, template_id, status, event_date, views_count, created_at, updated_at 
       FROM saas_invitations 
       ORDER BY created_at DESC;`,
    );

    return res.rows.map((row) => ({
      id: row.id,
      clientId: row.client_id,
      title: row.title,
      slug: row.slug,
      templateId: row.template_id,
      status: row.status as InvitationStatus,
      eventDate: row.event_date || '',
      viewsCount: row.views_count || 0,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('PostgreSQL getInvitations fallback to file:', error);
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
    const res = await query<{
      id: string;
      client_id: string;
      title: string;
      slug: string;
      template_id: string;
      status: string;
      event_date: string;
      views_count: number;
      created_at: Date;
      updated_at: Date;
    }>('SELECT * FROM saas_invitations WHERE id = $1 LIMIT 1;', [id]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      clientId: row.client_id,
      title: row.title,
      slug: row.slug,
      templateId: row.template_id,
      status: row.status as InvitationStatus,
      eventDate: row.event_date || '',
      viewsCount: row.views_count || 0,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  } catch (error) {
    console.error('PostgreSQL getInvitationById fallback:', error);
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
    const res = await query<{
      id: string;
      client_id: string;
      title: string;
      slug: string;
      template_id: string;
      status: string;
      event_date: string;
      views_count: number;
      created_at: Date;
      updated_at: Date;
    }>('SELECT * FROM saas_invitations WHERE LOWER(slug) = $1 LIMIT 1;', [
      normalized,
    ]);

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      clientId: row.client_id,
      title: row.title,
      slug: row.slug,
      templateId: row.template_id,
      status: row.status as InvitationStatus,
      eventDate: row.event_date || '',
      viewsCount: row.views_count || 0,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  } catch (error) {
    console.error('PostgreSQL getInvitationBySlug fallback:', error);
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
    const res = await query<{
      id: string;
      client_id: string;
      title: string;
      slug: string;
      template_id: string;
      status: string;
      event_date: string;
      views_count: number;
      created_at: Date;
      updated_at: Date;
    }>(
      `INSERT INTO saas_invitations (id, client_id, title, slug, template_id, status, event_date, views_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *;`,
      [id, params.clientId, params.title.trim(), finalSlug, templateId, status, eventDate, 0],
    );

    // Save initial config to PostgreSQL JSONB table
    await query(
      `INSERT INTO saas_wedding_configs (invitation_id, config, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (invitation_id) DO UPDATE SET config = EXCLUDED.config;`,
      [id, JSON.stringify(initialConfig)],
    );

    const row = res.rows[0];
    const newInvitation: InvitationRecord = {
      id: row.id,
      clientId: row.client_id,
      title: row.title,
      slug: row.slug,
      templateId: row.template_id,
      status: row.status as InvitationStatus,
      eventDate: row.event_date || '',
      viewsCount: row.views_count || 0,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
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
    console.error('Error creating invitation in PostgreSQL:', error);
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
        throw new Error(`Slug '${cleanSlug}' sudah digunakan oleh undangan lain`);
      }
      finalSlug = cleanSlug;
    }

    const title = data.title !== undefined ? data.title.trim() : existing.title;
    const templateId = data.templateId || existing.templateId;
    const status = data.status || existing.status;
    const eventDate = data.eventDate || existing.eventDate;

    const res = await query<{
      id: string;
      client_id: string;
      title: string;
      slug: string;
      template_id: string;
      status: string;
      event_date: string;
      views_count: number;
      created_at: Date;
      updated_at: Date;
    }>(
      `UPDATE saas_invitations
       SET title = $1, slug = $2, template_id = $3, status = $4, event_date = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *;`,
      [title, finalSlug, templateId, status, eventDate, id],
    );

    if (res.rows.length === 0) return null;
    const row = res.rows[0];

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
      clientId: row.client_id,
      title: row.title,
      slug: row.slug,
      templateId: row.template_id,
      status: row.status as InvitationStatus,
      eventDate: row.event_date || '',
      viewsCount: row.views_count || 0,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  } catch (error) {
    console.error('Error updating invitation in PostgreSQL:', error);
    throw error;
  }
}

export async function incrementInvitationViews(id: string): Promise<void> {
  try {
    await query(
      'UPDATE saas_invitations SET views_count = views_count + 1 WHERE id = $1;',
      [id],
    );
  } catch (err) {
    console.error('Error incrementing views in PostgreSQL:', err);
  }
}

export async function deleteInvitation(id: string): Promise<boolean> {
  await initializeSaasStorage();
  try {
    const res = await query('DELETE FROM saas_invitations WHERE id = $1;', [id]);

    // Also remove local files
    try {
      const tenantDir = path.join(TENANTS_DIR, id);
      if (fs.existsSync(tenantDir)) {
        fs.rmSync(tenantDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore
    }

    return (res.rowCount || 0) > 0;
  } catch (error) {
    console.error('Error deleting invitation in PostgreSQL:', error);
    return false;
  }
}

// -------------------------------------------------------------
// TENANT CONFIG (POSTGRESQL JSONB + FILE BACKUP)
// -------------------------------------------------------------
export async function getInvitationConfig(
  invitationId: string,
): Promise<WeddingConfig> {
  await initializeSaasStorage();
  try {
    const res = await query<{ config: WeddingConfig }>(
      'SELECT config FROM saas_wedding_configs WHERE invitation_id = $1 LIMIT 1;',
      [invitationId],
    );

    if (res.rows.length > 0 && res.rows[0].config) {
      const parsed = res.rows[0].config as Partial<WeddingConfig>;
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
    }
  } catch (error) {
    console.error('PostgreSQL getInvitationConfig fallback:', error);
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
    // 1. Save to PostgreSQL JSONB
    await query(
      `INSERT INTO saas_wedding_configs (invitation_id, config, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (invitation_id) DO UPDATE SET config = EXCLUDED.config, updated_at = NOW();`,
      [invitationId, JSON.stringify(config)],
    );

    // 2. Sync title & templateId in saas_invitations
    if (config.title) {
      await query(
        `UPDATE saas_invitations 
         SET title = $1, template_id = $2, updated_at = NOW() 
         WHERE id = $3;`,
        [config.title, config.templateId || 'netflix', invitationId],
      );
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
    console.error('Error saving config to PostgreSQL:', error);
    return false;
  }
}

// -------------------------------------------------------------
// TENANT RSVP & WISHES (POSTGRESQL)
// -------------------------------------------------------------
export async function getTenantRsvps(
  invitationId: string,
): Promise<RsvpRecord[]> {
  await initializeSaasStorage();
  try {
    const res = await query<{
      id: string;
      name: string;
      attendance: string;
      guest_count: number;
      notes: string;
      submitted_at: Date;
    }>(
      `SELECT id, name, attendance, guest_count, notes, submitted_at 
       FROM saas_rsvps 
       WHERE invitation_id = $1 
       ORDER BY submitted_at DESC;`,
      [invitationId],
    );

    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      attendance: r.attendance as 'Hadir' | 'Tidak Hadir',
      guestCount: r.guest_count,
      notes: r.notes || '',
      submittedAt: new Date(r.submitted_at).toISOString(),
    }));
  } catch (error) {
    console.error('PostgreSQL getTenantRsvps fallback to file:', error);
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
  const guestCount = attendance === 'Hadir' ? Number(payload.guestCount || 1) : 0;
  const notes = payload.notes ? payload.notes.trim() : '';
  const submittedAt = new Date().toISOString();

  try {
    await query(
      `INSERT INTO saas_rsvps (id, invitation_id, name, attendance, guest_count, notes, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [id, invitationId, name, attendance, guestCount, notes, submittedAt],
    );

    const newRsvp: RsvpRecord = {
      id,
      name,
      attendance,
      guestCount,
      notes,
      submittedAt,
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
    console.error('Error saving RSVP to PostgreSQL:', error);
    throw error;
  }
}

export async function getTenantWishes(
  invitationId: string,
): Promise<WishRecord[]> {
  await initializeSaasStorage();
  try {
    const res = await query<{
      id: string;
      name: string;
      status: string;
      message: string;
      created_at: Date;
    }>(
      `SELECT id, name, status, message, created_at 
       FROM saas_wishes 
       WHERE invitation_id = $1 
       ORDER BY created_at DESC;`,
      [invitationId],
    );

    return res.rows.map((w) => ({
      id: w.id,
      name: w.name,
      status: w.status as 'Hadir' | 'Tidak Hadir',
      message: w.message,
      createdAt: new Date(w.created_at).toISOString(),
    }));
  } catch (error) {
    console.error('PostgreSQL getTenantWishes fallback to file:', error);
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
  const createdAt = new Date().toISOString();

  try {
    await query(
      `INSERT INTO saas_wishes (id, invitation_id, name, status, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6);`,
      [id, invitationId, name, status, message, createdAt],
    );

    const newWish: WishRecord = {
      id,
      name,
      status,
      message,
      createdAt,
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
    console.error('Error saving Wish to PostgreSQL:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// SAAS OVERALL STATS (POSTGRESQL AGGREGATION)
// -------------------------------------------------------------
export async function getSaasStats(): Promise<SaasStats> {
  await initializeSaasStorage();
  try {
    const clientsRes = await query<{ count: string }>(
      'SELECT count(*) as count FROM saas_clients;',
    );
    const invsRes = await query<{
      total: string;
      published: string;
      draft: string;
      inactive: string;
    }>(
      `SELECT 
        count(*) as total,
        count(*) FILTER (WHERE status = 'published') as published,
        count(*) FILTER (WHERE status = 'draft') as draft,
        count(*) FILTER (WHERE status = 'inactive') as inactive
       FROM saas_invitations;`,
    );
    const rsvpsRes = await query<{ count: string }>(
      'SELECT count(*) as count FROM saas_rsvps;',
    );

    return {
      totalClients: Number(clientsRes.rows[0]?.count || 0),
      totalInvitations: Number(invsRes.rows[0]?.total || 0),
      publishedCount: Number(invsRes.rows[0]?.published || 0),
      draftCount: Number(invsRes.rows[0]?.draft || 0),
      inactiveCount: Number(invsRes.rows[0]?.inactive || 0),
      totalTemplates: AVAILABLE_TEMPLATES.length,
      totalRsvps: Number(rsvpsRes.rows[0]?.count || 0),
    };
  } catch (error) {
    console.error('PostgreSQL getSaasStats fallback:', error);
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
}
