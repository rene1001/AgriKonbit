const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔄 Starting database migrations...');
    
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection(dbConfig);
    
    // Read and execute migration file
    const migrationPath = path.join(__dirname, '001_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing migration: 001_create_tables.sql');
    // Use query() instead of execute() to allow multiple SQL statements
    await connection.query(migrationSQL);
    
    console.log('✅ Database migrations completed successfully!');
    
    // Test the connection to the created database
    await connection.end();
    
    const dbConnection = await mysql.createConnection({
      ...dbConfig,
      database: process.env.DB_NAME || 'agrikonbit'
    });
    
    console.log('🔍 Testing database connection...');
    const [tables] = await dbConnection.execute('SHOW TABLES');
    console.log(`📊 Created ${tables.length} tables:`, tables.map(t => Object.values(t)[0]));
    
    await dbConnection.end();
    console.log('🎉 Migration process completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
