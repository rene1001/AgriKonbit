const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function checkAndFixSettings() {
  let connection;
  
  try {
    console.log('🔍 Checking database settings tables...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit',
      multipleStatements: true
    });
    
    // Check which settings tables exist
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE '%settings%'"
    );
    
    console.log('📊 Found tables:', tables);
    
    const tableNames = tables.map(t => Object.values(t)[0]);
    const hasSettings = tableNames.includes('settings');
    const hasSystemSettings = tableNames.includes('system_settings');
    
    console.log(`\n✓ settings table: ${hasSettings ? '✅' : '❌'}`);
    console.log(`✓ system_settings table: ${hasSystemSettings ? '✅' : '❌'}`);
    
    if (!hasSettings) {
      console.log('\n🔧 Creating settings table and migrating data...');
      
      // Read and execute migration 012
      const migrationPath = path.join(__dirname, 'migrations', '012_add_settings_table.sql');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      await connection.query(migrationSQL);
      console.log('✅ Settings table created with default values!');
    }
    
    // Verify the settings table now has data
    const [settings] = await connection.execute('SELECT * FROM settings');
    console.log('\n📋 Current settings:');
    settings.forEach(s => {
      console.log(`  - ${s.setting_key}: ${s.setting_value}`);
    });
    
    console.log('\n✅ All done! Settings table is ready.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  checkAndFixSettings()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = checkAndFixSettings;
