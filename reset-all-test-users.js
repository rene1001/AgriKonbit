const mysql = require('mysql2/promise');
const bcrypt = require('./server/node_modules/bcryptjs');
require('dotenv').config({ path: './server/.env' });

async function resetAllTestUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔐 Réinitialisation des mots de passe pour tous les utilisateurs de test...\n');
    
    // Hash du mot de passe "password123" avec bcryptjs
    // Use 10 rounds for development (faster login), 12 for production
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
    console.log(`⚙️  Utilisation de ${saltRounds} rounds bcrypt (${process.env.NODE_ENV === 'production' ? 'Production' : 'Développement'})\n`);
    const hashedPassword = await bcrypt.hash('password123', saltRounds);
    
    // Liste des utilisateurs de test
    const testUsers = [
      'farmer1@agrikonbit.com',
      'farmer2@agrikonbit.com',
      'farmer3@agrikonbit.com',
      'investor1@agrikonbit.com',
      'investor2@agrikonbit.com',
      'consumer1@agrikonbit.com'
    ];
    
    console.log('📝 Mise à jour des mots de passe...');
    
    for (const email of testUsers) {
      // Mettre à jour le mot de passe
      const [result] = await connection.execute(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
        [hashedPassword, email]
      );
      
      if (result.affectedRows > 0) {
        // Vérifier l'utilisateur
        const [users] = await connection.execute(
          'SELECT id, email, role, full_name, is_active FROM users WHERE email = ?',
          [email]
        );
        
        if (users.length > 0) {
          const user = users[0];
          console.log(`✅ ${user.email}`);
          console.log(`   Nom: ${user.full_name}`);
          console.log(`   Rôle: ${user.role}`);
          console.log(`   Actif: ${user.is_active ? 'Oui' : 'Non'}`);
          console.log('');
        }
      } else {
        console.log(`⚠️  Utilisateur non trouvé: ${email}`);
        console.log('');
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Réinitialisation terminée avec succès!');
    console.log('');
    console.log('🔑 Mot de passe pour tous les comptes: password123');
    console.log('');
    console.log('👥 Comptes disponibles:');
    console.log('');
    console.log('👨‍🌾 FARMERS:');
    console.log('   - farmer1@agrikonbit.com');
    console.log('   - farmer2@agrikonbit.com');
    console.log('   - farmer3@agrikonbit.com');
    console.log('');
    console.log('💰 INVESTORS:');
    console.log('   - investor1@agrikonbit.com');
    console.log('   - investor2@agrikonbit.com');
    console.log('');
    console.log('🛒 CONSUMERS:');
    console.log('   - consumer1@agrikonbit.com');
    console.log('');
    console.log('🌐 Connexion: http://localhost:3000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

resetAllTestUsers().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
