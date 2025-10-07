const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function checkAndFixWallets() {
  console.log('🔧 Checking and fixing farmer wallets...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // 1. Check structure of user_wallets table
    console.log('📋 Checking user_wallets table structure...');
    const [columns] = await connection.query('DESCRIBE user_wallets');
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    console.log('');

    // 2. Check which users don't have wallets
    const [users] = await connection.query('SELECT id, email, role FROM users WHERE role = "farmer"');
    console.log(`📊 Found ${users.length} farmers\n`);

    for (const user of users) {
      const [existing] = await connection.query('SELECT * FROM user_wallets WHERE user_id = ?', [user.id]);
      
      if (existing.length === 0) {
        console.log(`⚠️  ${user.email} (ID: ${user.id}) - NO WALLET`);
        
        // Create wallet with only the fields that exist
        await connection.query(`
          INSERT INTO user_wallets (user_id, gyt_balance)
          VALUES (?, 0)
        `, [user.id]);
        
        console.log(`   ✅ Created wallet for ${user.email}\n`);
      } else {
        console.log(`✅ ${user.email} (ID: ${user.id}) - Wallet exists (${existing[0].gyt_balance} GYT)`);
      }
    }

    // 3. Verify all farmers have wallets now
    console.log('\n📊 Final check - All farmers:');
    const [farmersWithWallets] = await connection.query(`
      SELECT u.id, u.email, u.role, w.gyt_balance
      FROM users u
      LEFT JOIN user_wallets w ON u.id = w.user_id
      WHERE u.role = 'farmer'
    `);

    farmersWithWallets.forEach(f => {
      const balance = f.gyt_balance !== null ? `${f.gyt_balance} GYT` : '❌ NO WALLET';
      const status = f.gyt_balance !== null ? '✅' : '❌';
      console.log(`   ${status} ${f.email}: ${balance}`);
    });

    await connection.end();
    console.log('\n✅ All done! Wallets are ready.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkAndFixWallets();
