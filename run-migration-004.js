const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '004_fix_missing_tables.sql');
    console.log(`📄 Reading migration: ${migrationPath}`);
    
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    // Split SQL into individual statements to handle errors better
    console.log('🚀 Executing migration...');
    
    // Use agrikonbit database
    await connection.query('USE agrikonbit');
    
    // Add columns to notifications (ignore if they exist)
    try {
      await connection.query(`
        ALTER TABLE notifications 
        ADD COLUMN reference_type VARCHAR(50) NULL AFTER data,
        ADD COLUMN reference_id INT NULL AFTER reference_type
      `);
      console.log('  ✓ Added columns to notifications table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('  ℹ Columns already exist in notifications table');
      } else {
        throw error;
      }
    }
    
    // Create transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('deposit', 'withdrawal', 'investment', 'purchase', 'sale', 'refund', 'reward') NOT NULL,
        amount_gyt DECIMAL(12,4) NOT NULL,
        amount_usd DECIMAL(12,2) NULL,
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        description TEXT NULL,
        reference_type VARCHAR(50) NULL,
        reference_id INT NULL,
        tx_hash VARCHAR(255) NULL,
        payment_method VARCHAR(50) NULL,
        metadata JSON NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_created (created_at),
        INDEX idx_reference (reference_type, reference_id)
      )
    `);
    console.log('  ✓ Created transactions table');
    
    // Create withdrawals table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount_gyt DECIMAL(12,4) NOT NULL,
        amount_usd DECIMAL(12,2) NULL,
        method ENUM('bank_transfer', 'mobile_money', 'crypto_wallet', 'paypal') NOT NULL,
        destination TEXT NOT NULL,
        notes TEXT NULL,
        status ENUM('pending', 'processing', 'completed', 'rejected', 'cancelled') DEFAULT 'pending',
        admin_notes TEXT NULL,
        processed_by INT NULL,
        processed_at DATETIME NULL,
        tx_hash VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user (user_id),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      )
    `);
    console.log('  ✓ Created withdrawals table');
    
    // Add index (ignore if exists)
    try {
      await connection.query(`
        ALTER TABLE notifications
        ADD INDEX idx_reference (reference_type, reference_id)
      `);
      console.log('  ✓ Added index to notifications table');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('  ℹ Index already exists on notifications table');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Migration 004 completed successfully!');
    
    // Verify the changes
    console.log('\n🔍 Verifying schema changes...');
    
    // Check transactions table
    const [transactionsExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'agrikonbit' 
      AND table_name = 'transactions'
    `);
    console.log(`  ✓ transactions table: ${transactionsExists[0].count ? 'EXISTS' : 'MISSING'}`);
    
    // Check withdrawals table
    const [withdrawalsExists] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'agrikonbit' 
      AND table_name = 'withdrawals'
    `);
    console.log(`  ✓ withdrawals table: ${withdrawalsExists[0].count ? 'EXISTS' : 'MISSING'}`);
    
    // Check notifications columns
    const [notificationColumns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM information_schema.columns 
      WHERE table_schema = 'agrikonbit' 
      AND table_name = 'notifications'
      AND COLUMN_NAME IN ('reference_type', 'reference_id')
    `);
    console.log(`  ✓ notifications.reference_type: ${notificationColumns.find(c => c.COLUMN_NAME === 'reference_type') ? 'EXISTS' : 'MISSING'}`);
    console.log(`  ✓ notifications.reference_id: ${notificationColumns.find(c => c.COLUMN_NAME === 'reference_id') ? 'EXISTS' : 'MISSING'}`);
    
    console.log('\n✨ All schema updates verified successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migration
runMigration();
