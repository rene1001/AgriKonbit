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

    await connection.query('USE ' + (process.env.DB_NAME || 'agrikonbit'));

    const file = path.join(__dirname, 'migrations', '005_add_coords_to_delivery_events.sql');
    console.log('📄 Running migration:', file);
    const sql = await fs.readFile(file, 'utf8');
    await connection.query(sql);

    console.log('✅ Migration 005 completed');

    const [cols] = await connection.query(`
      SELECT COLUMN_NAME FROM information_schema.columns
      WHERE table_schema = ? AND table_name = 'delivery_events'
        AND COLUMN_NAME IN ('latitude','longitude')
    `, [process.env.DB_NAME || 'agrikonbit']);
    console.log('🔍 Columns present:', cols.map(c => c.COLUMN_NAME));
  } catch (e) {
    console.error('❌ Migration 005 failed:', e.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
})();
