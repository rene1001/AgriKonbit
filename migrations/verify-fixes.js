const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

async function verifyFixes() {
  let connection;
  
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'agrikonbit'
    });

    console.log('✅ Connected to MySQL\n');
    console.log('='.repeat(60));
    console.log('VÉRIFICATION DES CORRECTIONS');
    console.log('='.repeat(60));

    // Check 1: Verify orders table columns
    console.log('\n📋 Vérification 1: Colonnes de la table orders');
    const [ordersColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'agrikonbit' 
        AND TABLE_NAME = 'orders' 
        AND COLUMN_NAME IN ('delivery_confirmed_at', 'delivery_notes')
    `);
    
    if (ordersColumns.length === 2) {
      console.log('   ✅ delivery_confirmed_at: ' + ordersColumns.find(c => c.COLUMN_NAME === 'delivery_confirmed_at')?.DATA_TYPE);
      console.log('   ✅ delivery_notes: ' + ordersColumns.find(c => c.COLUMN_NAME === 'delivery_notes')?.DATA_TYPE);
    } else {
      console.log('   ❌ Colonnes manquantes dans orders');
    }

    // Check 2: Verify user_wallets table columns
    console.log('\n📋 Vérification 2: Colonnes de la table user_wallets');
    const [walletColumns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'agrikonbit' 
        AND TABLE_NAME = 'user_wallets' 
        AND COLUMN_NAME = 'total_earned_gyt'
    `);
    
    if (walletColumns.length === 1) {
      console.log('   ✅ total_earned_gyt: ' + walletColumns[0].DATA_TYPE);
    } else {
      console.log('   ❌ Colonne total_earned_gyt manquante');
    }

    // Check 3: Verify transactions type enum
    console.log('\n📋 Vérification 3: Types de transactions');
    const [transactionTypes] = await connection.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'agrikonbit' 
        AND TABLE_NAME = 'transactions' 
        AND COLUMN_NAME = 'type'
    `);
    
    if (transactionTypes.length > 0) {
      const enumValues = transactionTypes[0].COLUMN_TYPE;
      if (enumValues.includes('payment')) {
        console.log('   ✅ Type "payment" présent dans l\'ENUM');
        console.log('   📝 Types disponibles: ' + enumValues);
      } else {
        console.log('   ❌ Type "payment" manquant dans l\'ENUM');
      }
    }

    // Check 4: Count tables
    console.log('\n📋 Vérification 4: Statistiques de la base de données');
    const [tableCount] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'agrikonbit'
    `);
    console.log('   📊 Nombre de tables: ' + tableCount[0].count);

    // Check 5: Count users by role
    const [userStats] = await connection.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    console.log('\n📋 Vérification 5: Statistiques des utilisateurs');
    userStats.forEach(stat => {
      console.log(`   👤 ${stat.role}: ${stat.count}`);
    });

    // Check 6: Count orders by status
    const [orderStats] = await connection.query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);
    console.log('\n📋 Vérification 6: Statistiques des commandes');
    if (orderStats.length > 0) {
      orderStats.forEach(stat => {
        console.log(`   📦 ${stat.status}: ${stat.count}`);
      });
    } else {
      console.log('   ℹ️  Aucune commande dans la base de données');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ VÉRIFICATION TERMINÉE AVEC SUCCÈS');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connexion à la base de données fermée');
    }
  }
}

verifyFixes();
