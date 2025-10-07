/**
 * Script pour créer un compte admin de test
 * Usage: node create-test-admin.js
 */

const mysql = require('mysql2/promise');
const path = require('path');

// Charger bcryptjs depuis node_modules du serveur
const bcrypt = require(path.join(__dirname, 'server', 'node_modules', 'bcryptjs'));
require('dotenv').config({ path: './server/.env' });

async function createTestAdmin() {
  let connection;
  
  try {
    console.log('🔌 Connexion à la base de données...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à MySQL\n');

    // Vérifier si admin existe déjà
    const [existingAdmin] = await connection.query(
      'SELECT id, email FROM users WHERE email = ?',
      ['testadmin@agrikonbit.com']
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️  Compte admin de test existe déjà');
      console.log('   Email: testadmin@agrikonbit.com');
      console.log('   ID:', existingAdmin[0].id);
      
      // Mettre à jour le mot de passe
      const newPassword = 'TestAdmin123!';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await connection.query(
        'UPDATE users SET password_hash = ?, role = ?, is_active = 1 WHERE email = ?',
        [hashedPassword, 'admin', 'testadmin@agrikonbit.com']
      );
      
      console.log('\n✅ Mot de passe mis à jour');
      console.log('   Email: testadmin@agrikonbit.com');
      console.log('   Password: TestAdmin123!');
      console.log('   Role: admin');
      
    } else {
      // Créer nouveau compte admin
      console.log('📝 Création du compte admin de test...');
      
      const password = 'TestAdmin123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await connection.query(`
        INSERT INTO users (email, password_hash, full_name, role, country, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `, [
        'testadmin@agrikonbit.com',
        hashedPassword,
        'Admin Test',
        'admin',
        'Haiti',
        1
      ]);

      const userId = result.insertId;
      console.log('✅ Compte admin créé - ID:', userId);

      // Créer wallet associé
      await connection.query(`
        INSERT INTO user_wallets (user_id, gyt_balance, created_at)
        VALUES (?, 0, NOW())
      `, [userId]);

      console.log('✅ Wallet créé');
      
      console.log('\n🎉 Compte admin de test prêt !');
      console.log('   Email: testadmin@agrikonbit.com');
      console.log('   Password: TestAdmin123!');
      console.log('   Role: admin');
    }

    console.log('\n📝 Pour vous connecter:');
    console.log('   1. Ouvrir http://localhost:3000/login');
    console.log('   2. Email: testadmin@agrikonbit.com');
    console.log('   3. Password: TestAdmin123!');
    console.log('   4. Accéder au panel admin: http://localhost:3000/admin');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion fermée\n');
    }
  }
}

createTestAdmin();
