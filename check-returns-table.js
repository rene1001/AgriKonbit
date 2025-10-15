const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkReturnsTable() {
  let connection;
  
  try {
    console.log('🔍 Checking returns table...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });
    
    // Check if returns table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'returns'"
    );
    
    console.log('📊 Returns table exists:', tables.length > 0 ? '✅' : '❌');
    
    if (tables.length === 0) {
      console.log('\n🔧 Creating returns table...');
      
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS \`returns\` (
          id INT AUTO_INCREMENT PRIMARY KEY,
          investor_id INT NOT NULL,
          project_id INT NOT NULL,
          type ENUM('financial','physical') NOT NULL,
          amount_gyt DECIMAL(18,4) DEFAULT NULL,
          quantity DECIMAL(18,4) DEFAULT NULL,
          unit VARCHAR(50) DEFAULT NULL,
          status ENUM('pending','available','delivered','withdrawn') DEFAULT 'available',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          INDEX idx_investor (investor_id),
          INDEX idx_project (project_id),
          INDEX idx_type (type),
          INDEX idx_status (status)
        ) ENGINE=InnoDB;
      `);
      
      console.log('✅ Returns table created!');
    }
    
    // Show table structure
    const [columns] = await connection.execute('DESCRIBE `returns`');
    console.log('\n📋 Returns table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check for any data
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM `returns`');
    console.log(`\n📊 Total returns records: ${count[0].total}`);
    
    console.log('\n✅ Returns table is ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  checkReturnsTable()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = checkReturnsTable;
