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

    const file = path.join(__dirname, 'migrations', '004_add_deliveries_favorites_subscriptions.sql');
    console.log('📄 Running migration:', file);
    const sql = await fs.readFile(file, 'utf8');
    await connection.query(sql);

    console.log('✅ Migration 004 (deliveries/favorites/subscriptions) applied');
  } catch (e) {
    console.error('❌ Migration 004-add failed:', e.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
})();
