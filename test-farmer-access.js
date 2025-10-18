require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

async function testFarmerAccess() {
  let connection;
  
  try {
    console.log('🔍 Test d\'accès Farmer au projet #4\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à la base de données\n');

    // Vérifier le projet #4
    console.log('📊 PROJET #4\n' + '='.repeat(60));
    const [projects] = await connection.execute(
      'SELECT id, farmer_id, title, status FROM projects WHERE id = 4'
    );

    if (projects.length === 0) {
      console.log('❌ Le projet #4 n\'existe pas!');
      console.log('\n📋 Projets disponibles:');
      const [allProjects] = await connection.execute(
        'SELECT id, farmer_id, title, status FROM projects ORDER BY id'
      );
      allProjects.forEach(p => {
        console.log(`  - ID ${p.id}: ${p.title} (Farmer ID: ${p.farmer_id}, Status: ${p.status})`);
      });
    } else {
      const project = projects[0];
      console.log(`✅ Projet trouvé!`);
      console.log(`  ID: ${project.id}`);
      console.log(`  Titre: ${project.title}`);
      console.log(`  Farmer ID: ${project.farmer_id}`);
      console.log(`  Status: ${project.status}`);

      // Vérifier le farmer
      console.log('\n👨‍🌾 FARMER PROPRIÉTAIRE\n' + '='.repeat(60));
      const [farmers] = await connection.execute(
        'SELECT id, email, full_name, role FROM users WHERE id = ?',
        [project.farmer_id]
      );

      if (farmers.length > 0) {
        const farmer = farmers[0];
        console.log(`✅ Farmer trouvé!`);
        console.log(`  ID: ${farmer.id}`);
        console.log(`  Email: ${farmer.email}`);
        console.log(`  Nom: ${farmer.full_name}`);
        console.log(`  Rôle: ${farmer.role}`);

        console.log('\n💡 POUR ACCÉDER À CE PROJET:');
        console.log(`  1. Connectez-vous avec: ${farmer.email}`);
        console.log(`  2. Allez sur: http://localhost:3000/farmer/projects/4/manage`);
      } else {
        console.log(`❌ Farmer ID ${project.farmer_id} non trouvé!`);
      }

      // Vérifier les mises à jour
      console.log('\n📰 MISES À JOUR\n' + '='.repeat(60));
      const [updates] = await connection.execute(
        'SELECT COUNT(*) as count FROM project_updates WHERE project_id = 4'
      );
      console.log(`  Nombre de mises à jour: ${updates[0].count}`);

      // Vérifier les demandes de retrait
      console.log('\n💰 DEMANDES DE RETRAIT\n' + '='.repeat(60));
      const [withdrawals] = await connection.execute(
        'SELECT COUNT(*) as count FROM project_withdrawal_requests WHERE project_id = 4'
      );
      console.log(`  Nombre de demandes: ${withdrawals[0].count}`);
    }

    // Vérifier tous les farmers
    console.log('\n\n👥 TOUS LES FARMERS\n' + '='.repeat(60));
    const [allFarmers] = await connection.execute(
      'SELECT u.id, u.email, u.full_name, COUNT(p.id) as project_count FROM users u LEFT JOIN projects p ON u.id = p.farmer_id WHERE u.role = "farmer" GROUP BY u.id ORDER BY u.id'
    );

    if (allFarmers.length === 0) {
      console.log('❌ Aucun farmer trouvé dans la base de données!');
      console.log('\n💡 Créez un farmer avec:');
      console.log('  node create-test-admin.js');
    } else {
      allFarmers.forEach(f => {
        console.log(`\n  Farmer ID ${f.id}:`);
        console.log(`    Email: ${f.email}`);
        console.log(`    Nom: ${f.full_name}`);
        console.log(`    Projets: ${f.project_count}`);
      });
    }

    await connection.end();
    console.log('\n' + '='.repeat(60));
    console.log('✅ Test terminé!\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

testFarmerAccess();
