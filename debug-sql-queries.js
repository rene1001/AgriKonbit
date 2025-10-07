/**
 * Script de debug pour tester les requêtes SQL problématiques
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function debugQueries() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à MySQL\n');

    // Test 1: Projets en attente
    console.log('📝 Test 1: Requête projets en attente...');
    try {
      const [projects] = await connection.query(`
        SELECT 
          p.*,
          u.full_name as farmer_name,
          u.email as farmer_email,
          u.country as farmer_country
        FROM projects p
        JOIN users u ON p.farmer_id = u.id
        WHERE p.status = 'pending'
        ORDER BY p.created_at ASC
        LIMIT 10 OFFSET 0
      `);
      console.log(`✅ Projets en attente: ${projects.length} trouvé(s)`);
      if (projects.length > 0) {
        console.log(`   Premier: ${projects[0].title || projects[0].id}`);
      }
    } catch (error) {
      console.error('❌ Erreur projets:', error.message);
      console.error('   Code:', error.code);
      console.error('   SQL:', error.sql);
    }

    // Test 2: Liste utilisateurs
    console.log('\n📝 Test 2: Requête liste utilisateurs...');
    try {
      const [users] = await connection.query(`
        SELECT 
          u.id, u.email, u.full_name, u.role, u.kyc_status, 
          u.is_active, u.created_at,
          uw.gyt_balance
        FROM users u
        LEFT JOIN user_wallets uw ON u.id = uw.user_id
        WHERE u.role != "admin"
        ORDER BY u.created_at DESC
        LIMIT 10 OFFSET 0
      `);
      console.log(`✅ Utilisateurs: ${users.length} trouvé(s)`);
      if (users.length > 0) {
        console.log(`   Premier: ${users[0].email}`);
      }
    } catch (error) {
      console.error('❌ Erreur users:', error.message);
      console.error('   Code:', error.code);
      console.error('   SQL:', error.sql);
    }

    // Test 3: Audit logs
    console.log('\n📝 Test 3: Requête audit logs...');
    try {
      const [logs] = await connection.query(`
        SELECT 
          a.*,
          u.full_name as admin_name,
          u.email as admin_email,
          u.role as admin_role
        FROM admin_actions a
        JOIN users u ON a.admin_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 5
      `);
      console.log(`✅ Audit logs: ${logs.length} trouvé(s)`);
      if (logs.length > 0) {
        console.log(`   Premier: ${logs[0].action_type}`);
      }
    } catch (error) {
      console.error('❌ Erreur audit logs:', error.message);
      console.error('   Code:', error.code);
      console.error('   SQL:', error.sql);
    }

    // Vérification structure tables
    console.log('\n📋 Vérification structure des tables...');
    
    console.log('\n-- Table projects:');
    const [projectCols] = await connection.query('DESCRIBE projects');
    projectCols.forEach(col => {
      console.log(`  ${col.Field.padEnd(20)} ${col.Type.padEnd(30)}`);
    });

    console.log('\n-- Table users:');
    const [userCols] = await connection.query('DESCRIBE users');
    userCols.forEach(col => {
      console.log(`  ${col.Field.padEnd(20)} ${col.Type.padEnd(30)}`);
    });

    console.log('\n-- Table admin_actions:');
    const [adminCols] = await connection.query('DESCRIBE admin_actions');
    adminCols.forEach(col => {
      console.log(`  ${col.Field.padEnd(20)} ${col.Type.padEnd(30)}`);
    });

  } catch (error) {
    console.error('❌ Erreur fatale:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée\n');
    }
  }
}

debugQueries();
