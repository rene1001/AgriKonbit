require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

async function verifyTestData() {
  let connection;
  
  try {
    console.log('🔍 Connexion à la base de données...\n');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    // Projets
    console.log('📊 PROJETS\n' + '='.repeat(80));
    const [projects] = await connection.execute(`
      SELECT p.id, p.title, p.status, p.budget_gyt, p.funded_amount_gyt, 
             p.investor_count, u.full_name as farmer_name
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      ORDER BY p.id DESC
      LIMIT 10
    `);
    
    if (projects.length > 0) {
      console.log('\n✅ Projets disponibles:');
      projects.forEach(p => {
        const fundingPct = ((p.funded_amount_gyt / p.budget_gyt) * 100).toFixed(1);
        console.log(`\n  📌 ${p.title}`);
        console.log(`     Farmer: ${p.farmer_name}`);
        console.log(`     Statut: ${p.status}`);
        console.log(`     Budget: ${p.budget_gyt} GYT`);
        console.log(`     Financé: ${p.funded_amount_gyt} GYT (${fundingPct}%)`);
        console.log(`     Investisseurs: ${p.investor_count}`);
      });
    } else {
      console.log('❌ Aucun projet trouvé');
    }

    // Produits
    console.log('\n\n📦 PRODUITS\n' + '='.repeat(80));
    const [products] = await connection.execute(`
      SELECT p.id, p.name, p.price_gyt, p.stock, p.category, 
             p.organic_certified, u.full_name as farmer_name
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.is_active = 1
      ORDER BY p.id
      LIMIT 15
    `);
    
    if (products.length > 0) {
      console.log('\n✅ Produits disponibles:');
      products.forEach(p => {
        const organic = p.organic_certified ? '🌿 BIO' : '';
        console.log(`\n  📦 ${p.name} ${organic}`);
        console.log(`     Farmer: ${p.farmer_name}`);
        console.log(`     Prix: ${p.price_gyt} GYT`);
        console.log(`     Stock: ${p.stock} unités`);
        console.log(`     Catégorie: ${p.category}`);
      });
    } else {
      console.log('❌ Aucun produit trouvé');
    }

    // Statistiques
    console.log('\n\n📈 STATISTIQUES\n' + '='.repeat(80));
    const [stats] = await connection.execute(`
      SELECT 
        (SELECT COUNT(*) FROM projects WHERE status = 'active') as active_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'pending') as pending_projects,
        (SELECT COUNT(*) FROM products WHERE is_active = 1) as active_products,
        (SELECT SUM(budget_gyt) FROM projects WHERE status = 'active') as total_budget,
        (SELECT SUM(funded_amount_gyt) FROM projects WHERE status = 'active') as total_funded,
        (SELECT COUNT(*) FROM users WHERE role = 'farmer') as total_farmers
    `);

    const s = stats[0];
    console.log(`\n  🌱 Projets actifs: ${s.active_projects}`);
    console.log(`  ⏳ Projets en attente: ${s.pending_projects}`);
    console.log(`  📦 Produits actifs: ${s.active_products}`);
    console.log(`  👨‍🌾 Farmers: ${s.total_farmers}`);
    console.log(`  💰 Budget total (projets actifs): ${s.total_budget || 0} GYT`);
    console.log(`  💵 Montant financé: ${s.total_funded || 0} GYT`);
    
    if (s.total_budget > 0) {
      const fundingRate = ((s.total_funded / s.total_budget) * 100).toFixed(1);
      console.log(`  📊 Taux de financement: ${fundingRate}%`);
    }

    await connection.end();
    console.log('\n' + '='.repeat(80));
    console.log('✅ Vérification terminée!\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

verifyTestData();
