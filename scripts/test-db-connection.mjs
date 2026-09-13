import { checkDbConnection, initDatabaseSchema, pool } from '../lib/db.js';

async function test() {
  console.log('Testing PostgreSQL connection...');
  const connected = await checkDbConnection();
  if (!connected) {
    console.error('❌ Connection failed!');
    process.exit(1);
  }
  console.log('✅ Connected to PostgreSQL!');

  console.log('Initializing schema...');
  await initDatabaseSchema();
  console.log('✅ Schema tables verified in PostgreSQL!');

  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'saas_%';
  `);
  console.log('📋 SaaS Tables found:', tables.rows.map(r => r.table_name));

  await pool.end();
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
