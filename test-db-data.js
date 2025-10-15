require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    console.log('🔍 Connexion à la base de données...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à la base de données:', process.env.DB_NAME);

    // Vérifier les produits
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log('\n📦 Produits:', products[0].count);

    // Vérifier les projets
    const [projects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    console.log('🌱 Projets:', projects[0].count);

    // Vérifier les utilisateurs
    const [users] = await connection.execute('SELECT COUNT(*) as count, role FROM users GROUP BY role');
    console.log('\n👥 Utilisateurs par rôle:');
    users.forEach(u => console.log(`  - ${u.role}: ${u.count}`));

    // Vérifier un utilisateur de test
    const [testUser] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ? LIMIT 1',
      ['farmer1@agrikonbit.com']
    );
    console.log('\n🧪 Utilisateur de test (farmer1):');
    if (testUser.length > 0) {
      console.log('  ✅ Existe:', testUser[0]);
    } else {
      console.log('  ❌ N\'existe pas');
    }

    // Lister quelques produits
    const [productList] = await connection.execute('SELECT id, name, price_gyt, status FROM products LIMIT 5');
    console.log('\n📦 Exemples de produits:');
    if (productList.length > 0) {
      productList.forEach(p => console.log(`  - ${p.name} (${p.price_gyt} DOLLAR) - ${p.status}`));
    } else {
      console.log('  ❌ Aucun produit trouvé');
    }

    // Lister quelques projets
    const [projectList] = await connection.execute('SELECT id, title, status FROM projects LIMIT 5');
    console.log('\n🌱 Exemples de projets:');
    if (projectList.length > 0) {
      projectList.forEach(p => console.log(`  - ${p.title} - ${p.status}`));
    } else {
      console.log('  ❌ Aucun projet trouvé');
    }

    await connection.end();
    console.log('\n✅ Test terminé');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

testDatabase();
