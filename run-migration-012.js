const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit',
      multipleStatements: true
    });

    console.log('Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '012_add_settings_table.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    console.log('Executing migration 012_add_settings_table.sql...');
    await connection.query(migrationSql);
    console.log('Migration completed successfully');

    // Close connection
    await connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

runMigration();