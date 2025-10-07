const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function verifyDashboard() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'agrikonbit'
    });

    console.log('✅ Connected to database\n');

    // Find a farmer user
    const [farmers] = await connection.query(`
      SELECT id, full_name, email 
      FROM users 
      WHERE role = 'farmer' 
      LIMIT 1
    `);

    if (farmers.length === 0) {
      console.log('⚠️  No farmer found. Creating test farmer...');
      await connection.query(`
        INSERT INTO users (email, full_name, role, password_hash, wallet_address)
        VALUES ('test.farmer@agrikonbit.com', 'Test Farmer', 'farmer', '$2b$10$test', '0xTestWallet123')
      `);
      const [newFarmers] = await connection.query(`
        SELECT id, full_name, email 
        FROM users 
        WHERE email = 'test.farmer@agrikonbit.com'
      `);
      farmers[0] = newFarmers[0];
      console.log(`  ✓ Created test farmer: ${farmers[0].full_name}\n`);
    }

    const farmerId = farmers[0].id;
    console.log(`📊 Testing farmer dashboard for: ${farmers[0].full_name} (ID: ${farmerId})\n`);

    // Test 1: Projects statistics
    console.log('1️⃣  Testing projects statistics query...');
    const [projectStats] = await connection.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'validated' THEN 1 ELSE 0 END) as validated_projects,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_projects,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_projects,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_projects,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
        COALESCE(SUM(funded_amount_gyt), 0) as total_funded_gyt,
        COALESCE(SUM(funded_amount_usd), 0) as total_funded_usd
      FROM projects
      WHERE farmer_id = ?
    `, [farmerId]);
    console.log('   ✅ Projects query successful');
    console.log('   📈 Total projects:', projectStats[0].total_projects);

    // Test 2: Products statistics
    console.log('\n2️⃣  Testing products statistics query...');
    const [productStats] = await connection.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_products,
        COALESCE(SUM(stock), 0) as total_stock
      FROM products
      WHERE farmer_id = ?
    `, [farmerId]);
    console.log('   ✅ Products query successful');
    console.log('   📦 Total products:', productStats[0].total_products);

    // Test 3: Orders statistics
    console.log('\n3️⃣  Testing orders statistics query...');
    const [orderStats] = await connection.query(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN o.status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN o.status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        COALESCE(SUM(oi.total_gyt), 0) as total_revenue_gyt,
        COALESCE(SUM(oi.total_usd), 0) as total_revenue_usd
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.farmer_id = ?
    `, [farmerId]);
    console.log('   ✅ Orders query successful');
    console.log('   🛒 Total orders:', orderStats[0].total_orders || 0);

    // Test 4: Investors statistics
    console.log('\n4️⃣  Testing investors statistics query...');
    const [investorStats] = await connection.query(`
      SELECT 
        COUNT(DISTINCT i.investor_id) as total_investors,
        COUNT(*) as total_investments
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE p.farmer_id = ? AND i.status = 'completed'
    `, [farmerId]);
    console.log('   ✅ Investors query successful');
    console.log('   👥 Total investors:', investorStats[0].total_investors || 0);

    // Test 5: Wallet balance (CRITICAL TEST)
    console.log('\n5️⃣  Testing wallet balance query (CRITICAL)...');
    
    // First ensure wallet exists
    await connection.query(`
      INSERT IGNORE INTO user_wallets (user_id, gyt_balance, total_deposited_gyt, total_spent_gyt)
      VALUES (?, 0, 0, 0)
    `, [farmerId]);
    
    const [wallet] = await connection.query(`
      SELECT 
        COALESCE(gyt_balance, 0) as gyt_balance,
        COALESCE(total_deposited_gyt, 0) as total_deposited_gyt,
        COALESCE(total_spent_gyt, 0) as total_spent_gyt
      FROM user_wallets
      WHERE user_id = ?
    `, [farmerId]);
    console.log('   ✅ Wallet query successful');
    console.log('   💰 GYT Balance:', wallet[0]?.gyt_balance || 0);
    console.log('   📥 Total Deposited:', wallet[0]?.total_deposited_gyt || 0);
    console.log('   📤 Total Spent:', wallet[0]?.total_spent_gyt || 0);

    // Test 6: Transactions table
    console.log('\n6️⃣  Testing transactions query...');
    const [transactions] = await connection.query(`
      SELECT COUNT(*) as count
      FROM transactions
      WHERE user_id = ?
    `, [farmerId]);
    console.log('   ✅ Transactions query successful');
    console.log('   📝 Total transactions:', transactions[0].count);

    // Test 7: Notifications with new columns
    console.log('\n7️⃣  Testing notifications with reference columns...');
    const [notifications] = await connection.query(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ? AND reference_type IS NOT NULL
    `, [farmerId]);
    console.log('   ✅ Notifications query successful');
    console.log('   🔔 Notifications with references:', notifications[0].count);

    console.log('\n✨ ALL TESTS PASSED! Farmer dashboard is fully functional.\n');
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 DASHBOARD SUMMARY FOR', farmers[0].full_name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Projects:     ', projectStats[0].total_projects);
    console.log('Products:     ', productStats[0].total_products);
    console.log('Orders:       ', orderStats[0].total_orders || 0);
    console.log('Investors:    ', investorStats[0].total_investors || 0);
    console.log('GYT Balance:  ', wallet[0]?.gyt_balance || 0);
    console.log('Transactions: ', transactions[0].count);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

verifyDashboard();
