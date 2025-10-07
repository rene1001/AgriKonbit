const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit',
    multipleStatements: true
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Migration 002: Messaging tables
    const migration002Path = path.join(__dirname, 'migrations', '002_create_messaging_tables.sql');
    if (fs.existsSync(migration002Path)) {
      console.log('📋 Running migration 002: Messaging tables...');
      const sql002 = fs.readFileSync(migration002Path, 'utf8');
      await connection.query(sql002);
      console.log('✅ Migration 002 completed\n');
    } else {
      console.log('⚠️  Migration 002 file not found\n');
    }

    // Migration 003: Documents table
    const migration003Path = path.join(__dirname, 'migrations', '003_create_documents_table.sql');
    if (fs.existsSync(migration003Path)) {
      console.log('📋 Running migration 003: Documents table...');
      const sql003 = fs.readFileSync(migration003Path, 'utf8');
      await connection.query(sql003);
      console.log('✅ Migration 003 completed\n');
    } else {
      console.log('⚠️  Migration 003 file not found\n');
    }

    // Verify tables created
    console.log('🔍 Verifying tables...');
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const requiredTables = ['conversations', 'messages', 'user_documents'];
    let allPresent = true;
    
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MISSING`);
        allPresent = false;
      }
    });

    await connection.end();
    
    if (allPresent) {
      console.log('\n🎉 All migrations completed successfully!');
      console.log('📊 Database is ready for messaging and document upload features.\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tables are missing. Please check the migration files.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
