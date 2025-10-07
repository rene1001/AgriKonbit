const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  Password: ${config.password ? '***' : '(empty)'}\n`);

  try {
    // Test connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!\n');

    // Test if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    // Test for users table
    console.log('\n👤 Checking users table...');
    const [users] = await connection.query('SELECT id, email, role FROM users LIMIT 5');
    console.log(`  Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`    - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
    });

    await connection.end();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('  1. Make sure MySQL/WAMP is running');
    console.error('  2. Check if database "agrikonbit" exists');
    console.error('  3. Verify DB credentials in server/.env');
    console.error('  4. Run migrations if tables are missing');
    process.exit(1);
  }
}

testConnection();
