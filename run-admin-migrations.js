/**
 * Script pour exécuter les migrations admin (010 et 011)
 * Usage: node run-admin-migrations.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './server/.env' });

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔌 Connexion à la base de données...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit',
      multipleStatements: true
    });

    console.log('✅ Connecté à MySQL\n');

    // Migration 010: Ajouter rôle moderator
    console.log('📝 Exécution de la migration 010_add_moderator_role.sql...');
    const migration010 = fs.readFileSync(
      path.join(__dirname, 'migrations', '010_add_moderator_role.sql'),
      'utf8'
    );
    
    await connection.query(migration010);
    console.log('✅ Migration 010 terminée - Rôle moderator ajouté\n');

    // Vérifier le résultat
    const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'role'`);
    if (columns.length > 0) {
      console.log('✓ Vérification ENUM role:', columns[0].Type);
    }

    // Migration 011: Créer table admin_actions
    console.log('\n📝 Exécution de la migration 011_create_admin_actions_table.sql...');
    const migration011 = fs.readFileSync(
      path.join(__dirname, 'migrations', '011_create_admin_actions_table.sql'),
      'utf8'
    );
    
    await connection.query(migration011);
    console.log('✅ Migration 011 terminée - Table admin_actions créée\n');

    // Vérifier le résultat
    const [tables] = await connection.query(`SHOW TABLES LIKE 'admin_actions'`);
    if (tables.length > 0) {
      console.log('✓ Table admin_actions existe');
      
      const [tableInfo] = await connection.query(`DESCRIBE admin_actions`);
      console.log('\n📋 Structure de la table admin_actions:');
      tableInfo.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    }

    console.log('\n🎉 Toutes les migrations ont été exécutées avec succès!');
    console.log('\n📊 Résumé:');
    console.log('  ✅ Migration 010: Rôle moderator ajouté');
    console.log('  ✅ Migration 011: Table admin_actions créée');
    console.log('\n🚀 Le Panel Admin est maintenant prêt!');

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'exécution des migrations:');
    console.error(error.message);
    
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('\n⚠️  La migration a déjà été exécutée précédemment.');
    } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('\n⚠️  La table existe déjà.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

// Exécuter les migrations
runMigrations();
