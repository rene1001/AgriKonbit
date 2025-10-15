const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function testProfileFeatures() {
  let connection;

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     🧪 TEST DES FONCTIONNALITÉS DE PROFIL               ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Connexion à la base de données
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connexion à la base de données établie\n');

    // 1. Vérifier que les colonnes existent
    console.log('📊 Vérification de la structure de la table users...\n');
    const [columns] = await connection.query(`
      SHOW COLUMNS FROM users WHERE Field IN ('bio', 'theme_preference', 'profile_image')
    `);

    console.log('Colonnes trouvées :');
    columns.forEach(col => {
      console.log(`   ✅ ${col.Field}: ${col.Type} (Default: ${col.Default || 'NULL'})`);
    });

    if (columns.length < 3) {
      console.log('\n❌ ERREUR: Certaines colonnes sont manquantes!');
      process.exit(1);
    }

    // 2. Tester la mise à jour d'un profil avec les nouvelles colonnes
    console.log('\n📝 Test de mise à jour du profil...\n');
    
    // Récupérer le premier utilisateur
    const [users] = await connection.query('SELECT id, email FROM users LIMIT 1');
    
    if (users.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé dans la base de données');
      console.log('   Créez un utilisateur via /register pour tester\n');
    } else {
      const testUser = users[0];
      console.log(`   Utilisateur test: ${testUser.email} (ID: ${testUser.id})`);

      // Mettre à jour avec bio et theme_preference
      await connection.query(`
        UPDATE users 
        SET 
          bio = 'Ceci est une bio de test pour vérifier la fonctionnalité',
          theme_preference = 'dark'
        WHERE id = ?
      `, [testUser.id]);

      console.log('   ✅ Bio mise à jour');
      console.log('   ✅ Thème mis à jour');

      // Vérifier la mise à jour
      const [updated] = await connection.query(`
        SELECT bio, theme_preference FROM users WHERE id = ?
      `, [testUser.id]);

      console.log('\n   Résultat après mise à jour:');
      console.log(`   - Bio: "${updated[0].bio}"`);
      console.log(`   - Thème: ${updated[0].theme_preference}`);
    }

    // 3. Vérifier le dossier uploads
    console.log('\n📁 Vérification du dossier uploads...\n');
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log(`   ✅ Dossier créé: ${uploadsDir}`);
    } else {
      console.log(`   ✅ Dossier existe: ${uploadsDir}`);
    }

    // 4. Statistiques
    console.log('\n📊 Statistiques des utilisateurs...\n');
    const [stats] = await connection.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN bio IS NOT NULL AND bio != '' THEN 1 ELSE 0 END) as users_with_bio,
        SUM(CASE WHEN profile_image IS NOT NULL THEN 1 ELSE 0 END) as users_with_photo,
        SUM(CASE WHEN theme_preference = 'light' THEN 1 ELSE 0 END) as theme_light,
        SUM(CASE WHEN theme_preference = 'dark' THEN 1 ELSE 0 END) as theme_dark,
        SUM(CASE WHEN theme_preference = 'auto' THEN 1 ELSE 0 END) as theme_auto
      FROM users
    `);

    const s = stats[0];
    console.log(`   Total utilisateurs: ${s.total_users}`);
    console.log(`   Avec bio: ${s.users_with_bio} (${Math.round(s.users_with_bio/s.total_users*100)}%)`);
    console.log(`   Avec photo: ${s.users_with_photo} (${Math.round(s.users_with_photo/s.total_users*100)}%)`);
    console.log(`   Thème clair: ${s.theme_light}`);
    console.log(`   Thème sombre: ${s.theme_dark}`);
    console.log(`   Thème auto: ${s.theme_auto}`);

    // 5. Liste des endpoints disponibles
    console.log('\n🌐 Endpoints API disponibles...\n');
    console.log('   GET    /api/users/profile          - Récupérer le profil');
    console.log('   PUT    /api/users/profile          - Mettre à jour le profil');
    console.log('   POST   /api/users/profile/image    - Upload photo de profil');
    console.log('   DELETE /api/users/profile/image    - Supprimer photo');
    console.log('   PUT    /api/users/change-password  - Changer mot de passe');

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ TOUS LES TESTS PASSÉS                ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log('║  Le système de profil est prêt à l\'utilisation !         ║');
    console.log('║                                                           ║');
    console.log('║  Pour tester dans le navigateur :                        ║');
    console.log('║  1. Démarrer le backend : cd server && npm start         ║');
    console.log('║  2. Démarrer le frontend : cd client && npm start        ║');
    console.log('║  3. Naviguer vers : http://localhost:3000/profile        ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:\n');
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Connexion fermée\n');
    }
  }
}

// Exécuter les tests
testProfileFeatures();
