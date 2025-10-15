const path = require('path');
const mysql = require('mysql2/promise');

// Charger bcrypt depuis le dossier server
const bcrypt = require(path.join(__dirname, '../server/node_modules/bcryptjs'));
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function createOrUpdateAdmin() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'agrikonbit'
    });

    console.log('✅ Connecté à MySQL\n');

    // Vérifier si un admin existe déjà
    const [existingAdmins] = await connection.query(
      'SELECT id, email, full_name FROM users WHERE role = ?',
      ['admin']
    );

    const email = 'admin@agrikonbit.com';
    const password = 'Admin123!';
    const passwordHash = await bcrypt.hash(password, 10);

    if (existingAdmins.length > 0) {
      console.log('⚠️  Un ou plusieurs comptes admin existent déjà:\n');
      existingAdmins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email} - ${admin.full_name}`);
      });
      
      console.log('\nMise à jour du mot de passe pour tous les admins...\n');
      
      // Mettre à jour le mot de passe de tous les admins
      await connection.query(
        'UPDATE users SET password_hash = ?, is_active = 1, email_verified = 1 WHERE role = ?',
        [passwordHash, 'admin']
      );
      
      console.log('✅ Mots de passe mis à jour pour tous les admins!');
      
    } else {
      console.log('Création d\'un nouveau compte administrateur...\n');
      
      // Créer l'admin
      const [result] = await connection.query(`
        INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified, country, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [email, passwordHash, 'Administrateur AgriKonbit', 'admin', 1, 1, 'Haiti', 'Port-au-Prince']);
      
      const userId = result.insertId;
      
      // Créer le wallet pour l'admin
      await connection.query(`
        INSERT INTO user_wallets (user_id, gyt_balance, total_deposited_gyt)
        VALUES (?, ?, ?)
      `, [userId, 10000.00, 10000.00]);
      
      console.log('✅ Compte administrateur créé avec succès!');
    }

    console.log('\n' + '='.repeat(70));
    console.log('IDENTIFIANTS ADMINISTRATEUR');
    console.log('='.repeat(70));
    console.log('\n📧 Email:    admin@agrikonbit.com');
    console.log('🔑 Password: Admin123!');
    console.log('👤 Rôle:     Admin');
    console.log('💰 Balance:  10000.00 GYT (si nouveau compte)');
    console.log('\n' + '='.repeat(70));
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe en production!\n');
    console.log('Vous pouvez maintenant vous connecter sur:');
    console.log('http://localhost:3000/login');
    console.log('');

    // Lister tous les admins
    const [allAdmins] = await connection.query(
      'SELECT id, email, full_name, is_active, email_verified FROM users WHERE role = ?',
      ['admin']
    );

    console.log('='.repeat(70));
    console.log('LISTE DES ADMINISTRATEURS');
    console.log('='.repeat(70));
    console.log('');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email}`);
      console.log(`   Nom: ${admin.full_name}`);
      console.log(`   Actif: ${admin.is_active ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Email vérifié: ${admin.email_verified ? '✅ Oui' : '❌ Non'}`);
      console.log(`   Mot de passe: Admin123!`);
      console.log('');
    });

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createOrUpdateAdmin();
