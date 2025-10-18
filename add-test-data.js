require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

async function addTestData() {
  let connection;
  
  try {
    console.log('🔍 Connexion à la base de données...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à la base de données:', process.env.DB_NAME);

    // Vérifier les farmers existants
    const [farmers] = await connection.execute(
      'SELECT id, email, full_name FROM users WHERE role = "farmer" LIMIT 5'
    );

    if (farmers.length === 0) {
      console.log('❌ Aucun farmer trouvé. Veuillez d\'abord créer des utilisateurs farmers.');
      await connection.end();
      return;
    }

    console.log('\n👨‍🌾 Farmers disponibles:');
    farmers.forEach(f => console.log(`  - ${f.full_name} (${f.email}) - ID: ${f.id}`));

    const farmer1 = farmers[0];
    const farmer2 = farmers[1] || farmers[0];
    const farmer3 = farmers[2] || farmers[0];

    console.log('\n📋 Ajout de projets de test...');

    // Projets de test
    const projects = [
      {
        farmer_id: farmer1.id,
        title: 'Culture de Tomates Bio',
        description: 'Production de 5000kg de tomates biologiques certifiées pour le marché local et export. Utilisation de techniques agricoles durables avec irrigation goutte-à-goutte.',
        budget_usd: 15000,
        budget_gyt: 15000,
        duration_days: 120,
        estimated_return_pct: 25.00,
        location: 'Port-au-Prince, Haïti',
        latitude: 18.5944,
        longitude: -72.3074,
        category: 'crops',
        status: 'active',
        funded_amount_usd: 8500,
        funded_amount_gyt: 8500,
        investor_count: 12,
        start_date: new Date('2024-11-01'),
        end_date: new Date('2025-03-01'),
        images: JSON.stringify(['/uploads/tomatoes-farm.jpg', '/uploads/tomatoes-greenhouse.jpg']),
        documents: JSON.stringify(['/uploads/certification-bio.pdf'])
      },
      {
        farmer_id: farmer2.id,
        title: 'Élevage de Poulets Fermiers',
        description: 'Élevage de 1000 poulets fermiers en plein air avec alimentation naturelle. Production d\'œufs et viande de qualité supérieure.',
        budget_usd: 8000,
        budget_gyt: 8000,
        duration_days: 90,
        estimated_return_pct: 30.00,
        location: 'Cap-Haïtien, Haïti',
        latitude: 19.7580,
        longitude: -72.2014,
        category: 'livestock',
        status: 'active',
        funded_amount_usd: 7200,
        funded_amount_gyt: 7200,
        investor_count: 8,
        start_date: new Date('2024-12-01'),
        end_date: new Date('2025-03-01'),
        images: JSON.stringify(['/uploads/chickens-farm.jpg']),
        documents: JSON.stringify(['/uploads/business-plan.pdf'])
      },
      {
        farmer_id: farmer3.id,
        title: 'Production de Café Arabica Premium',
        description: 'Plantation de café arabica de haute qualité sur terrain montagneux. Récolte manuelle et traitement traditionnel pour un café d\'exception.',
        budget_usd: 25000,
        budget_gyt: 25000,
        duration_days: 180,
        estimated_return_pct: 35.00,
        location: 'Kenscoff, Haïti',
        latitude: 18.4520,
        longitude: -72.2860,
        category: 'crops',
        status: 'active',
        funded_amount_usd: 12000,
        funded_amount_gyt: 12000,
        investor_count: 15,
        start_date: new Date('2024-10-15'),
        end_date: new Date('2025-04-15'),
        images: JSON.stringify(['/uploads/coffee-plantation.jpg', '/uploads/coffee-beans.jpg']),
        documents: JSON.stringify(['/uploads/certification-quality.pdf'])
      },
      {
        farmer_id: farmer1.id,
        title: 'Maraîchage Diversifié',
        description: 'Culture variée de légumes frais: salades, carottes, choux, concombres. Production continue pour approvisionner les marchés locaux.',
        budget_usd: 6000,
        budget_gyt: 6000,
        duration_days: 60,
        estimated_return_pct: 20.00,
        location: 'Pétion-Ville, Haïti',
        latitude: 18.5126,
        longitude: -72.2853,
        category: 'crops',
        status: 'validated',
        funded_amount_usd: 2000,
        funded_amount_gyt: 2000,
        investor_count: 3,
        start_date: new Date('2024-11-15'),
        end_date: new Date('2025-01-15'),
        images: JSON.stringify(['/uploads/vegetables-farm.jpg']),
        documents: null
      },
      {
        farmer_id: farmer2.id,
        title: 'Apiculture et Production de Miel Bio',
        description: 'Installation de 50 ruches pour production de miel biologique. Pollinisation naturelle et récolte artisanale.',
        budget_usd: 10000,
        budget_gyt: 10000,
        duration_days: 150,
        estimated_return_pct: 28.00,
        location: 'Jacmel, Haïti',
        latitude: 18.2347,
        longitude: -72.5347,
        category: 'other',
        status: 'pending',
        funded_amount_usd: 0,
        funded_amount_gyt: 0,
        investor_count: 0,
        start_date: null,
        end_date: null,
        images: JSON.stringify(['/uploads/beehives.jpg']),
        documents: null
      }
    ];

    let projectIds = [];
    for (const project of projects) {
      const [result] = await connection.execute(
        `INSERT INTO projects (
          farmer_id, title, description, budget_usd, budget_gyt, 
          duration_days, estimated_return_pct, location, latitude, longitude,
          category, status, funded_amount_usd, funded_amount_gyt, investor_count,
          start_date, end_date, images, documents
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.farmer_id, project.title, project.description,
          project.budget_usd, project.budget_gyt, project.duration_days,
          project.estimated_return_pct, project.location, project.latitude,
          project.longitude, project.category, project.status,
          project.funded_amount_usd, project.funded_amount_gyt,
          project.investor_count, project.start_date, project.end_date,
          project.images, project.documents || null
        ]
      );
      projectIds.push(result.insertId);
      console.log(`  ✅ Projet créé: ${project.title} (ID: ${result.insertId})`);
    }

    console.log('\n📦 Ajout de produits de test...');

    // Produits de test
    const products = [
      {
        farmer_id: farmer1.id,
        project_id: projectIds[0],
        name: 'Tomates Bio - 1kg',
        description: 'Tomates fraîches biologiques cultivées sans pesticides. Parfaites pour salades et sauces.',
        price_usd: 4.50,
        price_gyt: 4.50,
        stock: 500,
        category: 'vegetables',
        origin_country: 'Haiti',
        origin_region: 'Port-au-Prince',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-001',
        harvest_date: new Date('2024-10-15'),
        expiry_date: new Date('2024-10-30'),
        weight_kg: 1.00,
        images: JSON.stringify(['/uploads/tomatoes-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer1.id,
        project_id: projectIds[3],
        name: 'Salade Verte Bio - Pièce',
        description: 'Salade fraîche récoltée le matin même. Culture hydroponique sans pesticides.',
        price_usd: 2.00,
        price_gyt: 2.00,
        stock: 200,
        category: 'vegetables',
        origin_country: 'Haiti',
        origin_region: 'Pétion-Ville',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-002',
        harvest_date: new Date('2024-10-16'),
        expiry_date: new Date('2024-10-23'),
        weight_kg: 0.30,
        images: JSON.stringify(['/uploads/lettuce-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer2.id,
        project_id: projectIds[1],
        name: 'Œufs Fermiers - Douzaine',
        description: 'Œufs frais de poules élevées en plein air. Alimentation naturelle aux grains.',
        price_usd: 5.00,
        price_gyt: 5.00,
        stock: 300,
        category: 'other',
        origin_country: 'Haiti',
        origin_region: 'Cap-Haïtien',
        organic_certified: false,
        harvest_date: new Date('2024-10-17'),
        expiry_date: new Date('2024-11-17'),
        weight_kg: 0.70,
        images: JSON.stringify(['/uploads/eggs-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer2.id,
        project_id: projectIds[1],
        name: 'Poulet Fermier Entier - 2kg',
        description: 'Poulet fermier élevé en plein air, nourri aux grains. Viande tendre et savoureuse.',
        price_usd: 15.00,
        price_gyt: 15.00,
        stock: 80,
        category: 'meat',
        origin_country: 'Haiti',
        origin_region: 'Cap-Haïtien',
        organic_certified: false,
        harvest_date: new Date('2024-10-10'),
        expiry_date: new Date('2024-10-24'),
        weight_kg: 2.00,
        images: JSON.stringify(['/uploads/chicken-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer3.id,
        project_id: projectIds[2],
        name: 'Café Arabica Premium - 250g',
        description: 'Café arabica de montagne, récolté à la main. Arômes intenses et notes fruitées.',
        price_usd: 12.00,
        price_gyt: 12.00,
        stock: 150,
        category: 'other',
        origin_country: 'Haiti',
        origin_region: 'Kenscoff',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-003',
        harvest_date: new Date('2024-09-01'),
        expiry_date: new Date('2025-09-01'),
        weight_kg: 0.25,
        images: JSON.stringify(['/uploads/coffee-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer3.id,
        project_id: projectIds[2],
        name: 'Café Arabica Premium - 1kg',
        description: 'Café arabica de montagne format économique. Idéal pour les amateurs de bon café.',
        price_usd: 40.00,
        price_gyt: 40.00,
        stock: 100,
        category: 'other',
        origin_country: 'Haiti',
        origin_region: 'Kenscoff',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-003',
        harvest_date: new Date('2024-09-01'),
        expiry_date: new Date('2025-09-01'),
        weight_kg: 1.00,
        images: JSON.stringify(['/uploads/coffee-1kg-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer1.id,
        project_id: projectIds[3],
        name: 'Carottes Bio - 1kg',
        description: 'Carottes biologiques croquantes et sucrées. Riches en vitamines.',
        price_usd: 3.00,
        price_gyt: 3.00,
        stock: 400,
        category: 'vegetables',
        origin_country: 'Haiti',
        origin_region: 'Pétion-Ville',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-002',
        harvest_date: new Date('2024-10-14'),
        expiry_date: new Date('2024-11-14'),
        weight_kg: 1.00,
        images: JSON.stringify(['/uploads/carrots-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer2.id,
        project_id: projectIds[4],
        name: 'Miel Bio de Fleurs - 500g',
        description: 'Miel pur de fleurs sauvages. Récolte artisanale et propriétés naturelles préservées.',
        price_usd: 18.00,
        price_gyt: 18.00,
        stock: 60,
        category: 'honey',
        origin_country: 'Haiti',
        origin_region: 'Jacmel',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-004',
        harvest_date: new Date('2024-08-01'),
        expiry_date: new Date('2026-08-01'),
        weight_kg: 0.50,
        images: JSON.stringify(['/uploads/honey-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer1.id,
        project_id: projectIds[3],
        name: 'Concombres Bio - 1kg',
        description: 'Concombres frais et croquants. Parfaits pour salades et jus détox.',
        price_usd: 2.50,
        price_gyt: 2.50,
        stock: 350,
        category: 'vegetables',
        origin_country: 'Haiti',
        origin_region: 'Pétion-Ville',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-002',
        harvest_date: new Date('2024-10-16'),
        expiry_date: new Date('2024-10-30'),
        weight_kg: 1.00,
        images: JSON.stringify(['/uploads/cucumber-product.jpg']),
        is_active: true
      },
      {
        farmer_id: farmer1.id,
        project_id: projectIds[0],
        name: 'Tomates Cerises Bio - 500g',
        description: 'Petites tomates sucrées et savoureuses. Parfaites pour l\'apéritif.',
        price_usd: 5.00,
        price_gyt: 5.00,
        stock: 250,
        category: 'vegetables',
        origin_country: 'Haiti',
        origin_region: 'Port-au-Prince',
        organic_certified: true,
        certification_number: 'BIO-HT-2024-001',
        harvest_date: new Date('2024-10-15'),
        expiry_date: new Date('2024-10-29'),
        weight_kg: 0.50,
        images: JSON.stringify(['/uploads/cherry-tomatoes-product.jpg']),
        is_active: true
      }
    ];

    for (const product of products) {
      const [result] = await connection.execute(
        `INSERT INTO products (
          farmer_id, project_id, name, description, price_usd, price_gyt,
          stock, category, origin_country, origin_region, organic_certified,
          certification_number, harvest_date, expiry_date, weight_kg, images, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.farmer_id, product.project_id, product.name, product.description,
          product.price_usd, product.price_gyt, product.stock, product.category,
          product.origin_country, product.origin_region, product.organic_certified,
          product.certification_number || null, product.harvest_date, product.expiry_date,
          product.weight_kg, product.images, product.is_active
        ]
      );
      console.log(`  ✅ Produit créé: ${product.name} (ID: ${result.insertId})`);
    }

    // Afficher le résumé
    console.log('\n📊 Résumé des données ajoutées:');
    const [projectCount] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`  🌱 Projets totaux: ${projectCount[0].count}`);
    console.log(`  📦 Produits totaux: ${productCount[0].count}`);

    await connection.end();
    console.log('\n✅ Données de test ajoutées avec succès!');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

addTestData();
