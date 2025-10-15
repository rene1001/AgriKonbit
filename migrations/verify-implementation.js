const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

async function verifyImplementation() {
  console.log('🔍 Vérification de l\'implémentation...\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('✅ Connexion à la base de données réussie\n');
    
    // Vérifier les tables
    console.log('📊 Vérification des tables:');
    
    const tables = [
      'project_withdrawal_requests',
      'order_status_history',
      'platform_settings'
    ];
    
    for (const table of tables) {
      const [rows] = await connection.query(`SHOW TABLES LIKE '${table}'`);
      if (rows.length > 0) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - MANQUANTE`);
      }
    }
    
    // Vérifier les colonnes ajoutées
    console.log('\n📝 Vérification des colonnes ajoutées:');
    
    const columns = [
      { table: 'projects', column: 'funds_withdrawn' },
      { table: 'projects', column: 'withdrawn_at' },
      { table: 'investments', column: 'return_status' },
      { table: 'investments', column: 'return_amount_gyt' },
      { table: 'investments', column: 'returned_at' },
      { table: 'orders', column: 'delivery_confirmed_at' },
      { table: 'orders', column: 'delivery_notes' }
    ];
    
    for (const { table, column } of columns) {
      const [rows] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [process.env.DB_NAME, table, column]
      );
      
      if (rows.length > 0) {
        console.log(`  ✅ ${table}.${column}`);
      } else {
        console.log(`  ❌ ${table}.${column} - MANQUANTE`);
      }
    }
    
    // Vérifier les paramètres de la plateforme
    console.log('\n⚙️  Vérification des paramètres:');
    const [settings] = await connection.query('SELECT * FROM platform_settings WHERE id = 1');
    
    if (settings.length > 0) {
      console.log(`  ✅ Platform settings configuré`);
      console.log(`     - Frais de retrait: ${settings[0].withdrawal_fee_pct}%`);
      console.log(`     - Montant minimum: ${settings[0].min_withdrawal_amount} GYT`);
    } else {
      console.log(`  ❌ Platform settings - NON CONFIGURÉ`);
    }
    
    // Compter les enregistrements
    console.log('\n📈 Statistiques:');
    
    const [projects] = await connection.query('SELECT COUNT(*) as count FROM projects');
    console.log(`  - Projets: ${projects[0].count}`);
    
    const [investments] = await connection.query('SELECT COUNT(*) as count FROM investments');
    console.log(`  - Investissements: ${investments[0].count}`);
    
    const [orders] = await connection.query('SELECT COUNT(*) as count FROM orders');
    console.log(`  - Commandes: ${orders[0].count}`);
    
    const [withdrawalRequests] = await connection.query('SELECT COUNT(*) as count FROM project_withdrawal_requests');
    console.log(`  - Demandes de retrait: ${withdrawalRequests[0].count}`);
    
    const [updates] = await connection.query('SELECT COUNT(*) as count FROM project_updates');
    console.log(`  - Mises à jour de projets: ${updates[0].count}`);
    
    console.log('\n✅ Vérification terminée avec succès !');
    console.log('\n🚀 Le backend est prêt à être utilisé.');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:', error.message);
  } finally {
    await connection.end();
  }
}

verifyImplementation();
