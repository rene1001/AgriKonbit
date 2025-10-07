const http = require('http');
const { query } = require('./server/config/database');
require('dotenv').config({ path: './server/.env' });

async function quickHealthCheck() {
  console.log('🔍 Quick Health Check\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check 1: Database Connection
  console.log('1️⃣  Checking database connection...');
  try {
    const [result] = await query('SELECT 1 as test');
    console.log('   ✅ Database connected\n');
  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
    process.exit(1);
  }

  // Check 2: Required Tables
  console.log('2️⃣  Checking required tables...');
  try {
    const tables = ['transactions', 'withdrawals', 'notifications'];
    for (const table of tables) {
      const [result] = await query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'agrikonbit' AND table_name = ?
      `, [table]);
      
      if (result.count === 0) {
        console.log(`   ❌ Table '${table}' is missing!`);
        process.exit(1);
      }
    }
    console.log('   ✅ All required tables exist\n');
  } catch (error) {
    console.log('   ❌ Table check failed:', error.message);
    process.exit(1);
  }

  // Check 3: Notifications columns
  console.log('3️⃣  Checking notifications columns...');
  try {
    const [columns] = await query(`
      SELECT COLUMN_NAME 
      FROM information_schema.columns 
      WHERE table_schema = 'agrikonbit' 
      AND table_name = 'notifications'
      AND COLUMN_NAME IN ('reference_type', 'reference_id')
    `);
    
    if (columns.length < 2) {
      console.log('   ❌ Missing notification columns!');
      process.exit(1);
    }
    console.log('   ✅ Notification columns present\n');
  } catch (error) {
    console.log('   ❌ Column check failed:', error.message);
    process.exit(1);
  }

  // Check 4: Test farmer dashboard query
  console.log('4️⃣  Testing farmer dashboard query...');
  try {
    const [user] = await query(`SELECT id FROM users WHERE role = 'farmer' LIMIT 1`);
    if (!user) {
      console.log('   ⚠️  No farmer user found (but query works)\n');
    } else {
      // Test the actual wallet query from farmer.js
      const [wallet] = await query(`
        SELECT 
          COALESCE(gyt_balance, 0) as gyt_balance,
          COALESCE(total_deposited_gyt, 0) as total_deposited_gyt,
          COALESCE(total_spent_gyt, 0) as total_spent_gyt
        FROM user_wallets
        WHERE user_id = ?
      `, [user.id]);
      console.log(`   ✅ Farmer dashboard query works\n`);
    }
  } catch (error) {
    console.log('   ❌ Farmer query failed:', error.message);
    process.exit(1);
  }

  // Check 5: Test notifications query
  console.log('5️⃣  Testing notifications query...');
  try {
    const [user] = await query(`SELECT id FROM users LIMIT 1`);
    if (!user) {
      console.log('   ⚠️  No users found\n');
    } else {
      const limitNum = 20;
      const offset = 0;
      const notifications = await query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, [user.id]);
      console.log(`   ✅ Notifications query works (${notifications.length} found)\n`);
    }
  } catch (error) {
    console.log('   ❌ Notifications query failed:', error.message);
    process.exit(1);
  }

  // Check 6: API Server Status
  console.log('6️⃣  Checking API server...');
  const checkServer = (port, name) => {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${port}/health`, (res) => {
        if (res.statusCode === 200) {
          resolve({ running: true, port, name });
        } else {
          resolve({ running: false, port, name });
        }
      });
      
      req.on('error', () => {
        resolve({ running: false, port, name });
      });
      
      req.setTimeout(2000, () => {
        req.destroy();
        resolve({ running: false, port, name });
      });
    });
  };

  const apiStatus = await checkServer(3001, 'API Server');
  const clientStatus = await checkServer(3000, 'React Client');

  if (apiStatus.running) {
    console.log(`   ✅ API Server running on port ${apiStatus.port}`);
  } else {
    console.log(`   ⚠️  API Server not running on port ${apiStatus.port}`);
  }

  if (clientStatus.running) {
    console.log(`   ✅ React Client running on port ${clientStatus.port}\n`);
  } else {
    console.log(`   ⚠️  React Client not running on port ${clientStatus.port}\n`);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 HEALTH CHECK SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('Database:');
  console.log('  ✅ Connection working');
  console.log('  ✅ Tables present');
  console.log('  ✅ Columns correct');
  console.log('  ✅ Queries functional\n');

  console.log('Servers:');
  console.log(`  ${apiStatus.running ? '✅' : '⚠️ '} API Server (port ${apiStatus.port}) - ${apiStatus.running ? 'RUNNING' : 'STOPPED'}`);
  console.log(`  ${clientStatus.running ? '✅' : '⚠️ '} React Client (port ${clientStatus.port}) - ${clientStatus.running ? 'RUNNING' : 'STOPPED'}\n`);

  if (!apiStatus.running) {
    console.log('⚠️  ACTION REQUIRED: Start the API server');
    console.log('   cd server && npm start\n');
  }

  if (!clientStatus.running) {
    console.log('⚠️  ACTION REQUIRED: Start the React client');
    console.log('   cd client && npm start\n');
  }

  if (apiStatus.running && clientStatus.running) {
    console.log('✨ Everything is working perfectly!');
    console.log('✨ You can access the app at: http://localhost:3000\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
}

quickHealthCheck();
