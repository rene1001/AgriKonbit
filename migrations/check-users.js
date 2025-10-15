const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function checkUsers() {
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
    console.log('='.repeat(80));
    console.log('UTILISATEURS DANS LA BASE DE DONNÉES');
    console.log('='.repeat(80));

    const [users] = await connection.query(`
      SELECT 
        id, 
        email, 
        full_name, 
        role, 
        is_active,
        email_verified,
        created_at
      FROM users
      ORDER BY id
    `);

    if (users.length === 0) {
      console.log('\n⚠️  AUCUN UTILISATEUR TROUVÉ\n');
      console.log('Vous devez créer un utilisateur de test.');
      console.log('Exécutez: node migrations/create-test-user.js');
    } else {
      console.log(`\n📊 Total: ${users.length} utilisateur(s)\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Nom: ${user.full_name}`);
        console.log(`   Rôle: ${user.role}`);
        console.log(`   Actif: ${user.is_active ? '✅ Oui' : '❌ Non'}`);
        console.log(`   Email vérifié: ${user.email_verified ? '✅ Oui' : '❌ Non'}`);
        console.log(`   Créé le: ${user.created_at}`);
        console.log('');
      });

      // Vérifier les wallets
      const [wallets] = await connection.query(`
        SELECT user_id, gyt_balance 
        FROM user_wallets
      `);

      console.log('='.repeat(80));
      console.log('WALLETS');
      console.log('='.repeat(80));
      console.log(`\n📊 Total: ${wallets.length} wallet(s)\n`);
      
      wallets.forEach((wallet) => {
        const user = users.find(u => u.id === wallet.user_id);
        console.log(`- ${user?.email || 'Unknown'}: ${wallet.gyt_balance} GYT`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('RECOMMANDATIONS');
    console.log('='.repeat(80));
    console.log('\nPour vous connecter, utilisez:');
    console.log('- Un email de la liste ci-dessus');
    console.log('- Le mot de passe que vous avez défini lors de la création');
    console.log('\nSi vous ne connaissez pas le mot de passe:');
    console.log('- Exécutez: node migrations/create-test-user.js');
    console.log('  (Créera: test@farmer.com / Test123!)');
    console.log('');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkUsers();
