const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function runMigrations() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL');

    // List of migration files to run
    const migrations = [
      '022_add_order_delivery_fields.sql',
      '023_add_wallet_earned_field.sql',
      '024_update_transaction_types.sql'
    ];

    for (const migrationFile of migrations) {
      const filePath = path.join(__dirname, migrationFile);
      
      try {
        console.log(`\n📄 Running migration: ${migrationFile}`);
        const sql = await fs.readFile(filePath, 'utf8');
        await connection.query(sql);
        console.log(`✅ Migration ${migrationFile} completed successfully`);
      } catch (error) {
        console.error(`❌ Error running migration ${migrationFile}:`, error.message);
        // Continue with other migrations
      }
    }

    console.log('\n✅ All migrations completed!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runMigrations();
