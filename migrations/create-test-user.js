const path = require('path');
const mysql = require('mysql2/promise');

// Charger bcrypt depuis le dossier server
const bcrypt = require(path.join(__dirname, '../server/node_modules/bcryptjs'));
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function createTestUser() {
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

    // Vérifier si l'utilisateur existe déjà
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['test@farmer.com']
    );

    if (existing.length > 0) {
      console.log('⚠️  L\'utilisateur test@farmer.com existe déjà');
      console.log('Mise à jour du mot de passe...\n');
      
      const passwordHash = await bcrypt.hash('Test123!', 10);
      await connection.query(
        'UPDATE users SET password_hash = ?, is_active = 1, email_verified = 1 WHERE email = ?',
        [passwordHash, 'test@farmer.com']
      );
      
      console.log('✅ Mot de passe mis à jour!');
    } else {
      console.log('Création d\'un nouvel utilisateur de test...\n');
      
      const passwordHash = await bcrypt.hash('Test123!', 10);
      
      // Créer l'utilisateur
      const [result] = await connection.query(`
        INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified, country, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, ['test@farmer.com', passwordHash, 'Test Farmer', 'farmer', 1, 1, 'Haiti', 'Port-au-Prince']);
      
      const userId = result.insertId;
      
      // Créer le wallet
      await connection.query(`
        INSERT INTO user_wallets (user_id, gyt_balance, total_deposited_gyt)
        VALUES (?, ?, ?)
      `, [userId, 1000.00, 1000.00]);
      
      console.log('✅ Utilisateur créé avec succès!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('IDENTIFIANTS DE CONNEXION');
    console.log('='.repeat(60));
    console.log('\n📧 Email:    test@farmer.com');
    console.log('🔑 Password: Test123!');
    console.log('👤 Rôle:     Farmer');
    console.log('💰 Balance:  1000.00 GYT');
    console.log('\n' + '='.repeat(60));
    console.log('\nVous pouvez maintenant vous connecter sur:');
    console.log('http://localhost:3000/login');
    console.log('');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\n💡 L\'utilisateur existe déjà. Utilisez:');
      console.log('   Email: test@farmer.com');
      console.log('   Password: Test123!');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTestUser();
