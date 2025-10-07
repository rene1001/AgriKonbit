const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function fixFarmerWallets() {
  console.log('🔧 Fixing farmer wallets...\n');
  
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

    // Get all users
    const [users] = await connection.query('SELECT id, email, role FROM users');
    console.log(`📊 Found ${users.length} users\n`);

    // Check which users don't have wallets
    const [wallets] = await connection.query('SELECT user_id FROM user_wallets');
    const userIdsWithWallets = wallets.map(w => w.user_id);

    const usersWithoutWallets = users.filter(u => !userIdsWithWallets.includes(u.id));
    
    if (usersWithoutWallets.length === 0) {
      console.log('✅ All users already have wallets!\n');
    } else {
      console.log(`⚠️  ${usersWithoutWallets.length} users without wallets:`);
      usersWithoutWallets.forEach(u => {
        console.log(`   - ${u.email} (ID: ${u.id}, Role: ${u.role})`);
      });
      console.log('');

      // Create wallets for users without one
      for (const user of usersWithoutWallets) {
        await connection.query(`
          INSERT INTO user_wallets (user_id, gyt_balance, usd_balance, total_earned_gyt, total_withdrawn_gyt)
          VALUES (?, 0, 0, 0, 0)
        `, [user.id]);
        console.log(`✅ Created wallet for ${user.email}`);
      }
      console.log('\n✅ All wallets created!\n');
    }

    // Verify all farmers have wallets now
    const [farmers] = await connection.query(`
      SELECT u.id, u.email, u.role, w.gyt_balance
      FROM users u
      LEFT JOIN user_wallets w ON u.user_id = w.user_id
      WHERE u.role = 'farmer'
    `);

    console.log('📊 Farmer wallets status:');
    farmers.forEach(f => {
      const balance = f.gyt_balance !== null ? f.gyt_balance : '❌ NO WALLET';
      console.log(`   - ${f.email}: ${balance} GYT`);
    });

    await connection.end();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixFarmerWallets();
