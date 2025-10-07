const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('📦 Running migration 002_add_missing_tables.sql...');
    
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '002_add_missing_tables.sql'),
      'utf8'
    );
    
    await connection.query(sqlFile);
    
    console.log('✅ Migration completed successfully!');
    console.log('   - Added reference_type and reference_id columns to notifications table');
    console.log('   - Created transactions table');
    console.log('   - Created withdrawals table');
    console.log('   - Created messages table');
    console.log('   - Created documents table');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
