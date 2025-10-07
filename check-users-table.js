const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function checkTable() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    const [columns] = await connection.query('DESCRIBE users');
    console.log('\n📋 Structure de la table users:\n');
    columns.forEach(col => {
      console.log(`  ${col.Field.padEnd(20)} ${col.Type.padEnd(30)} ${col.Key} ${col.Null}`);
    });
    console.log('\n');
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkTable();
