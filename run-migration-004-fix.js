const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔄 Exécution de la migration 004...\n');
    
    // Créer la table favorites
    console.log('📝 Création de la table favorites...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('product','producer') NOT NULL,
        target_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_favorite (user_id, type, target_id),
        INDEX idx_favorites_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Table favorites créée\n');
    
    // Créer la table subscriptions
    console.log('📝 Création de la table subscriptions...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        qty INT NOT NULL DEFAULT 1,
        \`interval\` ENUM('weekly','monthly') NOT NULL,
        status ENUM('active','paused','canceled') NOT NULL DEFAULT 'active',
        next_run DATE NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_subscriptions_user (user_id),
        INDEX idx_subscriptions_product (product_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Table subscriptions créée\n');
    
    // Créer la table deliveries
    console.log('📝 Création de la table deliveries...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS deliveries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        tracking_number VARCHAR(100) NULL,
        carrier VARCHAR(100) NULL,
        estimated_delivery DATE NULL,
        actual_delivery DATETIME NULL,
        status ENUM('pending','in_transit','delivered','failed') NOT NULL DEFAULT 'pending',
        notes TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_deliveries_order (order_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Table deliveries créée\n');
    
    // Vérifier les tables créées
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name IN ('favorites', 'subscriptions', 'deliveries')
    `, [process.env.DB_NAME || 'agrikonbit']);
    
    console.log('✅ Migration terminée avec succès!\n');
    console.log('📋 Tables créées:');
    tables.forEach(row => console.log(`  ✓ ${row.TABLE_NAME}`));
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message);
    if (error.errno === 1826) {
      console.log('\n⚠️  Problème de contrainte de clé étrangère détecté.');
      console.log('   Les tables existent peut-être déjà ou ont une structure différente.');
    }
  } finally {
    await connection.end();
  }
}

runMigration();
