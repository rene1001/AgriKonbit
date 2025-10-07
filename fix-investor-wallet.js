const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixInvestorWallet() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔍 Checking investor1 wallet...');
    
    // Get investor1 user
    const [users] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      ['investor1@agrikonbit.com']
    );

    if (users.length === 0) {
      console.log('❌ investor1@agrikonbit.com not found');
      return;
    }

    const user = users[0];
    console.log('✅ Found user:', user);

    // Check if wallet exists
    const [wallets] = await connection.execute(
      'SELECT * FROM user_wallets WHERE user_id = ?',
      [user.id]
    );

    if (wallets.length === 0) {
      // Create wallet
      console.log('📝 Creating wallet for investor1...');
      await connection.execute(`
        INSERT INTO user_wallets (user_id, gyt_balance, total_deposited_usd, total_deposited_gyt, total_spent_gyt, created_at, updated_at)
        VALUES (?, 1000.0000, 1000.00, 1000.0000, 0.0000, NOW(), NOW())
      `, [user.id]);
      console.log('✅ Wallet created with 1000 GYT');
    } else {
      // Update existing wallet
      console.log('💰 Current wallet:', wallets[0]);
      await connection.execute(`
        UPDATE user_wallets 
        SET gyt_balance = 1000.0000, 
            total_deposited_usd = 1000.00, 
            total_deposited_gyt = 1000.0000,
            updated_at = NOW()
        WHERE user_id = ?
      `, [user.id]);
      console.log('✅ Wallet updated with 1000 GYT');
    }

    // Verify the update
    const [updatedWallets] = await connection.execute(
      'SELECT * FROM user_wallets WHERE user_id = ?',
      [user.id]
    );
    console.log('🎯 Final wallet state:', updatedWallets[0]);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

fixInvestorWallet();
