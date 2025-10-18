require('dotenv').config({ path: './server/.env' });
const mysql = require('mysql2/promise');

// URLs d'images depuis Unsplash (images gratuites haute qualité)
const projectImages = {
  'Culture de Tomates Bio': JSON.stringify([
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800'
  ]),
  'Élevage de Poulets Fermiers': JSON.stringify([
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800'
  ]),
  'Production de Café Arabica Premium': JSON.stringify([
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'
  ]),
  'Maraîchage Diversifié': JSON.stringify([
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800'
  ]),
  'Apiculture et Production de Miel Bio': JSON.stringify([
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800',
    'https://images.unsplash.com/photo-1587049352846-4a222e784367?w=800'
  ])
};

const productImages = {
  'Tomates Bio - 1kg': JSON.stringify(['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600']),
  'Salade Verte Bio - Pièce': JSON.stringify(['https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600']),
  'Œufs Fermiers - Douzaine': JSON.stringify(['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600']),
  'Poulet Fermier Entier - 2kg': JSON.stringify(['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600']),
  'Café Arabica Premium - 250g': JSON.stringify(['https://images.unsplash.com/photo-1447933968403-c146f1c7c456?w=600']),
  'Café Arabica Premium - 1kg': JSON.stringify(['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600']),
  'Carottes Bio - 1kg': JSON.stringify(['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600']),
  'Miel Bio de Fleurs - 500g': JSON.stringify(['https://images.unsplash.com/photo-1587049352846-4a222e784367?w=600']),
  'Concombres Bio - 1kg': JSON.stringify(['https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600']),
  'Tomates Cerises Bio - 500g': JSON.stringify(['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600'])
};

async function addImagesToData() {
  let connection;
  
  try {
    console.log('🔍 Connexion à la base de données...\n');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connecté à la base de données:', process.env.DB_NAME);

    // Mise à jour des images de projets
    console.log('\n📸 Mise à jour des images des projets...');
    for (const [title, images] of Object.entries(projectImages)) {
      const [result] = await connection.execute(
        'UPDATE projects SET images = ? WHERE title = ?',
        [images, title]
      );
      if (result.affectedRows > 0) {
        console.log(`  ✅ ${title}`);
      } else {
        console.log(`  ⚠️  ${title} - Non trouvé`);
      }
    }

    // Mise à jour des images de produits
    console.log('\n📸 Mise à jour des images des produits...');
    for (const [name, images] of Object.entries(productImages)) {
      const [result] = await connection.execute(
        'UPDATE products SET images = ? WHERE name = ?',
        [images, name]
      );
      if (result.affectedRows > 0) {
        console.log(`  ✅ ${name}`);
      } else {
        console.log(`  ⚠️  ${name} - Non trouvé`);
      }
    }

    // Vérification
    console.log('\n📊 Vérification...');
    const [projectsWithImages] = await connection.execute(
      'SELECT COUNT(*) as count FROM projects WHERE images IS NOT NULL AND images != "[]"'
    );
    const [productsWithImages] = await connection.execute(
      'SELECT COUNT(*) as count FROM products WHERE images IS NOT NULL AND images != "[]"'
    );

    console.log(`  🌱 Projets avec images: ${projectsWithImages[0].count}`);
    console.log(`  📦 Produits avec images: ${productsWithImages[0].count}`);

    await connection.end();
    console.log('\n✅ Images ajoutées avec succès!\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

addImagesToData();
