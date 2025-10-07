const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

(async () => {
  let connection;
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });
    console.log('✅ Connected');

    const db = process.env.DB_NAME || 'agrikonbit';
    await connection.query('USE ' + db);

    const file = path.join(__dirname, 'migrations', '006_safe_create_delivery_events_without_fk.sql');
    console.log('📄 Running migration:', file);
    const sql = await fs.readFile(file, 'utf8');
    await connection.query(sql);

    console.log('✅ Migration 006 completed');
  } catch (e) {
    console.error('❌ Migration 006 failed:', e.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
})();
