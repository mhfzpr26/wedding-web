import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres@localhost:5432/wedding_invitation';

// Singleton pool instance for Next.js hot reload safety
declare global {
  // eslint-disable-next-line no-var
  var __postgresPool: Pool | undefined;
}

export const pool =
  globalThis.__postgresPool ||
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__postgresPool = pool;
}

let isInitialized = false;

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<{ rows: T[]; rowCount: number | null }> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return { rows: res.rows as T[], rowCount: res.rowCount };
  } catch (err) {
    const duration = Date.now() - start;
    console.error('Database Query Error:', { text, duration, err });
    throw err;
  }
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 as connected;');
    return Boolean(res.rows[0]?.connected);
  } catch (error) {
    console.error('PostgreSQL connection check failed:', error);
    return false;
  }
}

export async function initDatabaseSchema(): Promise<void> {
  if (isInitialized) return;

  try {
    // 1. saas_clients
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saas_clients (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(255),
        package VARCHAR(64) NOT NULL DEFAULT 'Standard',
        notes TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. saas_invitations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saas_invitations (
        id VARCHAR(64) PRIMARY KEY,
        client_id VARCHAR(64) REFERENCES saas_clients(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        template_id VARCHAR(64) NOT NULL DEFAULT 'netflix',
        status VARCHAR(32) NOT NULL DEFAULT 'draft',
        event_date VARCHAR(64),
        views_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Index on slug for lightning-fast public lookup
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_saas_invitations_slug ON saas_invitations(slug);
    `);

    // 3. saas_wedding_configs (JSONB for isolated dynamic templates)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saas_wedding_configs (
        invitation_id VARCHAR(64) PRIMARY KEY REFERENCES saas_invitations(id) ON DELETE CASCADE,
        config JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 4. saas_rsvps
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saas_rsvps (
        id VARCHAR(64) PRIMARY KEY,
        invitation_id VARCHAR(64) REFERENCES saas_invitations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        attendance VARCHAR(64) NOT NULL,
        guest_count INTEGER NOT NULL DEFAULT 1,
        notes TEXT,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_saas_rsvps_invitation ON saas_rsvps(invitation_id);
    `);

    // 5. saas_wishes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saas_wishes (
        id VARCHAR(64) PRIMARY KEY,
        invitation_id VARCHAR(64) REFERENCES saas_invitations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(64) NOT NULL DEFAULT 'Hadir',
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_saas_wishes_invitation ON saas_wishes(invitation_id);
    `);

    isInitialized = true;
    console.log('✅ PostgreSQL SaaS tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing PostgreSQL schema:', error);
    throw error;
  }
}
