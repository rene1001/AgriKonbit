const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

async function runMigration() {
  let connection;

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     👤 MIGRATION - AMÉLIORATION DU PROFIL                ║');
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

    // Vérifier la structure actuelle
    console.log('📋 Structure actuelle de la table users:');
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM users LIKE 'bio'
    `);
    
    if (columns.length > 0) {
      console.log('   ℹ️  Les colonnes bio et theme_preference existent déjà\n');
    } else {
      console.log('   ➕ Les colonnes vont être ajoutées\n');
    }

    // Lire et exécuter le fichier SQL
    console.log('🔄 Exécution de la migration...\n');
    const sqlPath = path.join(__dirname, 'migrations', '013_add_profile_enhancements.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Exécuter la migration
    const startTime = Date.now();
    await connection.query(sql);
    const duration = Date.now() - startTime;

    console.log(`✅ Migration exécutée avec succès en ${duration}ms\n`);

    // Vérifier les colonnes créées
    console.log('📊 Nouvelles colonnes:');
    const [newColumns] = await connection.query(`
      SHOW COLUMNS FROM users WHERE Field IN ('bio', 'theme_preference')
    `);
    
    newColumns.forEach(col => {
      console.log(`   • ${col.Field}: ${col.Type} (${col.Default || 'NULL'})`);
    });
    console.log('');

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ SUCCÈS                              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Colonnes ajoutées à la table users :                     ║');
    console.log('║  • bio (TEXT) - Biographie utilisateur                    ║');
    console.log('║  • theme_preference (ENUM) - Préférence de thème          ║');
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
