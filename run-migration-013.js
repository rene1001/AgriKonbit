const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

async function runMigration() {
  let connection;

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     📊 MIGRATION 013 - INDICES DE PERFORMANCE            ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit',
      multipleStatements: true
    });

    console.log('✅ Connexion à la base de données établie\n');

    // Vérifier les indices existants avant
    console.log('📋 Indices existants (avant):');
    const [existingIndicesBefore] = await connection.query(`
      SELECT 
        table_name,
        COUNT(*) as index_count
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
      AND table_name IN ('projects', 'products', 'orders', 'investments', 'users', 'deliveries', 'notifications', 'messages')
      GROUP BY table_name
      ORDER BY table_name
    `);
    
    existingIndicesBefore.forEach(row => {
      console.log(`   ${row.table_name}: ${row.index_count} indices`);
    });
    console.log('');

    // Lire et exécuter le fichier SQL
    console.log('🔄 Exécution de la migration...\n');
    const sqlPath = path.join(__dirname, 'migrations', '013_add_performance_indices.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Exécuter la migration
    const startTime = Date.now();
    await connection.query(sql);
    const duration = Date.now() - startTime;

    console.log(`✅ Migration exécutée avec succès en ${duration}ms\n`);

    // Vérifier les indices créés
    console.log('📊 Indices créés (après):');
    const [newIndices] = await connection.query(`
      SELECT 
        table_name,
        COUNT(*) as index_count
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
      AND table_name IN ('projects', 'products', 'orders', 'investments', 'users', 'deliveries', 'notifications', 'messages')
      GROUP BY table_name
      ORDER BY table_name
    `);
    
    newIndices.forEach(row => {
      console.log(`   ${row.table_name}: ${row.index_count} indices`);
    });
    console.log('');

    // Statistiques détaillées
    console.log('📈 Statistiques des indices:');
    const [indexStats] = await connection.query(`
      SELECT 
        table_name,
        index_name,
        column_name,
        non_unique
      FROM information_schema.statistics
      WHERE table_schema = DATABASE()
      AND index_name LIKE 'idx_%'
      ORDER BY table_name, index_name
    `);

    let currentTable = '';
    indexStats.forEach(stat => {
      if (stat.table_name !== currentTable) {
        console.log(`\n   ${stat.table_name}:`);
        currentTable = stat.table_name;
      }
      const uniqueFlag = stat.non_unique === 0 ? ' [UNIQUE]' : '';
      console.log(`      • ${stat.index_name}${uniqueFlag}`);
    });
    console.log('');

    // Analyser les tables pour optimiser les indices
    console.log('🔧 Analyse et optimisation des tables...\n');
    const tables = ['projects', 'products', 'orders', 'investments', 'users', 'deliveries', 'notifications', 'messages', 'order_items', 'favorites'];
    
    for (const table of tables) {
      try {
        await connection.query(`ANALYZE TABLE ${table}`);
        console.log(`   ✅ ${table} analysée`);
      } catch (err) {
        console.log(`   ⚠️  ${table} - ${err.message}`);
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ SUCCÈS                              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Indices de performance créés avec succès !               ║');
    console.log('║                                                           ║');
    console.log('║  Amélioration attendue :                                  ║');
    console.log('║  • Requêtes de liste : 40-60% plus rapide                ║');
    console.log('║  • Recherches : 70-90% plus rapide                       ║');
    console.log('║  • Tri et filtrage : 30-50% plus rapide                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:\n');
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connexion fermée\n');
    }
  }
}

// Exécuter la migration
runMigration();
