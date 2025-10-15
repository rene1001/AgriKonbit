const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit',
    multipleStatements: true
  });

  try {
    console.log('🔄 Connexion à la base de données...');
    
    // Lire tous les fichiers SQL dans le dossier migrations
    const files = await fs.readdir(__dirname);
    const sqlFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort(); // Trier par ordre alphabétique (donc numérique)

    console.log(`📁 ${sqlFiles.length} fichiers de migration trouvés\n`);

    for (const file of sqlFiles) {
      console.log(`⏳ Exécution de ${file}...`);
      const filePath = path.join(__dirname, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      try {
        await connection.query(sql);
        console.log(`✅ ${file} - Succès\n`);
      } catch (error) {
        console.error(`❌ ${file} - Erreur:`, error.message);
        // Continuer avec les autres migrations
      }
    }

    console.log('✅ Toutes les migrations ont été exécutées !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des migrations:', error);
  } finally {
    await connection.end();
  }
}

runMigrations();
