const mysql = require('mysql2/promise');
require('dotenv').config();

async function diagnoseFKIssue() {
  let connection;
  
  try {
    console.log('🔍 Diagnosing foreign key issue...\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });
    
    // Check users table engine and charset
    console.log('📊 Users table details:');
    const [userStatus] = await connection.execute(
      "SHOW TABLE STATUS LIKE 'users'"
    );
    if (userStatus.length > 0) {
      const table = userStatus[0];
      console.log(`  Engine: ${table.Engine}`);
      console.log(`  Collation: ${table.Collation}`);
    }
    
    // Check users table structure
    const [userCols] = await connection.execute('SHOW COLUMNS FROM users');
    console.log('\n📋 Users table columns:');
    userCols.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Check projects table
    console.log('\n📊 Projects table details:');
    const [projectStatus] = await connection.execute(
      "SHOW TABLE STATUS LIKE 'projects'"
    );
    if (projectStatus.length > 0) {
      const table = projectStatus[0];
      console.log(`  Engine: ${table.Engine}`);
      console.log(`  Collation: ${table.Collation}`);
    }
    
    // Check projects table structure (just id column)
    const [projectCols] = await connection.execute(
      "SHOW COLUMNS FROM projects WHERE Field = 'id'"
    );
    console.log('\n📋 Projects id column:');
    projectCols.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Try creating returns table WITHOUT foreign keys first
    console.log('\n🔧 Attempting to create returns table without foreign keys...');
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
        INDEX idx_investor (investor_id),
        INDEX idx_project (project_id),
        INDEX idx_type (type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Returns table created without foreign keys!');
    
    // Now try to add foreign keys
    console.log('\n🔧 Attempting to add foreign key constraints...');
    try {
      await connection.execute(`
        ALTER TABLE \`returns\`
        ADD CONSTRAINT fk_returns_investor 
        FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('✅ Added investor foreign key');
    } catch (fkError) {
      console.error('❌ Failed to add investor FK:', fkError.message);
    }
    
    try {
      await connection.execute(`
        ALTER TABLE \`returns\`
        ADD CONSTRAINT fk_returns_project 
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      `);
      console.log('✅ Added project foreign key');
    } catch (fkError) {
      console.error('❌ Failed to add project FK:', fkError.message);
    }
    
    // Verify returns table
    const [returnsTables] = await connection.execute("SHOW TABLES LIKE 'returns'");
    if (returnsTables.length > 0) {
      console.log('\n✅ Returns table successfully created!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  diagnoseFKIssue()
    .then(() => {
      console.log('\n🎉 Diagnosis completed!');
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = diagnoseFKIssue;
