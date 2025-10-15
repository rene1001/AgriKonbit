const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration013() {
  let connection;
  
  try {
    console.log('🔄 Running migration 013: Create returns table...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit',
      multipleStatements: true
    });
    
    // Read and execute migration file
    const migrationPath = path.join(__dirname, '013_create_returns_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing migration SQL...');
    await connection.query(migrationSQL);
    
    console.log('✅ Migration 013 completed successfully!');
    
    // Verify the table was created
    const [tables] = await connection.execute("SHOW TABLES LIKE 'returns'");
    if (tables.length > 0) {
      console.log('✅ Returns table verified!');
      
      // Show table structure
      const [columns] = await connection.execute('DESCRIBE `returns`');
      console.log('\n📋 Returns table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } else {
      console.error('❌ Returns table was not created!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  runMigration013()
    .then(() => {
      console.log('\n🎉 Migration process completed!');
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = runMigration013;
