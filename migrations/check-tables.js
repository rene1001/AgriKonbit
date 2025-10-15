const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

async function checkTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    // Vérifier le moteur des tables
    const [rows] = await connection.query(`
      SELECT table_name, engine 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_name IN ('projects', 'orders', 'users')
    `, [process.env.DB_NAME]);
    
    console.log('Moteurs de stockage:');
    rows.forEach(r => console.log(`  ${r.table_name}: ${r.engine}`));
    
    // Vérifier les colonnes id
    console.log('\nColonnes ID:');
    for (const table of ['projects', 'orders', 'users']) {
      const [cols] = await connection.query(`
        SELECT column_name, column_type, column_key 
        FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = ? AND column_name = 'id'
      `, [process.env.DB_NAME, table]);
      
      if (cols.length > 0) {
        console.log(`  ${table}.id: ${cols[0].column_type} ${cols[0].column_key}`);
      }
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

checkTables();
