const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseTables() {
  let connection;
  
  try {
    console.log('🔍 Checking database structure...');
    console.log('DB Config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'agrikonbit'
    });
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });
    
    // List all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`\n📊 Found ${tables.length} tables:`);
    tables.forEach(t => {
      const tableName = Object.values(t)[0];
      console.log(`  - ${tableName}`);
    });
    
    // Check for critical tables
    const criticalTables = ['users', 'projects', 'returns', 'settings'];
    console.log('\n🔍 Critical tables status:');
    
    const tableNames = tables.map(t => Object.values(t)[0]);
    criticalTables.forEach(table => {
      const exists = tableNames.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    
    // Check users table structure if it exists
    if (tableNames.includes('users')) {
      const [userCols] = await connection.execute('DESCRIBE users LIMIT 5');
      console.log('\n📋 Users table (first 5 columns):');
      userCols.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    }
    
    // Check projects table
    if (tableNames.includes('projects')) {
      const [projectCols] = await connection.execute('DESCRIBE projects LIMIT 5');
      console.log('\n📋 Projects table (first 5 columns):');
      projectCols.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    }
    
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
  checkDatabaseTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = checkDatabaseTables;
