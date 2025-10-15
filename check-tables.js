const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function checkTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔍 Vérification des tables de la base de données...\n');
    
    const [tables] = await connection.execute('SHOW TABLES');
    
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    console.log('📋 Tables existantes:');
    tableNames.forEach(table => console.log(`  ✓ ${table}`));
    
    console.log(`\n📊 Total: ${tableNames.length} tables\n`);
    
    // Vérifier les tables critiques
    const criticalTables = [
      'users',
      'projects',
      'products',
      'orders',
      'investments',
      'favorites',
      'subscriptions',
      'deliveries',
      'notifications',
      'user_wallets'
    ];
    
    console.log('🔍 Vérification des tables critiques:');
    criticalTables.forEach(table => {
      if (tableNames.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MANQUANTE!`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await connection.end();
  }
}

checkTables();
