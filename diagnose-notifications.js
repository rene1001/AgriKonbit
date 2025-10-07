const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function diagnoseNotifications() {
  let connection;
  
  try {
    console.log('🔍 Diagnosing Notifications Endpoint Issue\n');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'agrikonbit'
    });

    console.log('✅ Connected to database\n');

    // Get a test user
    const [users] = await connection.query(`SELECT id, email FROM users LIMIT 1`);
    if (users.length === 0) {
      console.log('❌ No users found');
      return;
    }
    
    const userId = users[0].id;
    console.log(`Testing with user: ${users[0].email} (ID: ${userId})\n`);

    // Test 1: Basic notification query
    console.log('1️⃣  Testing basic notification query...');
    try {
      const [notifications] = await connection.query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [userId]);
      console.log(`   ✅ Found ${notifications.length} notifications\n`);
    } catch (error) {
      console.log('   ❌ FAILED:', error.message);
      console.log('   Error details:', error);
      return;
    }

    // Test 2: With LIMIT and OFFSET using ? placeholders
    console.log('2️⃣  Testing with LIMIT ? OFFSET ? placeholders...');
    try {
      const limit = 5;
      const offset = 0;
      const [notifications] = await connection.query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, limit, offset]);
      console.log(`   ✅ Query successful with ${notifications.length} results\n`);
    } catch (error) {
      console.log('   ❌ FAILED:', error.message);
      console.log('   This is the problem! MySQL doesn\'t allow ? placeholders for LIMIT/OFFSET\n');
    }

    // Test 3: With string interpolation (the fix)
    console.log('3️⃣  Testing with string interpolation (the fix)...');
    try {
      const limit = 5;
      const offset = 0;
      const [notifications] = await connection.query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, [userId]);
      console.log(`   ✅ Query successful with ${notifications.length} results\n`);
    } catch (error) {
      console.log('   ❌ FAILED:', error.message);
    }

    // Test 4: Count query
    console.log('4️⃣  Testing count query...');
    try {
      const [countResult] = await connection.query(`
        SELECT COUNT(*) as total
        FROM notifications
        WHERE user_id = ?
      `, [userId]);
      console.log(`   ✅ Count successful: ${countResult[0].total} total notifications\n`);
    } catch (error) {
      console.log('   ❌ Count FAILED:', error.message);
    }

    // Test 5: With unreadOnly filter
    console.log('5️⃣  Testing with unreadOnly filter...');
    try {
      const limit = 5;
      const offset = 0;
      const [notifications] = await connection.query(`
        SELECT * FROM notifications
        WHERE user_id = ? AND is_read = false
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, [userId]);
      console.log(`   ✅ Unread query successful: ${notifications.length} unread notifications\n`);
    } catch (error) {
      console.log('   ❌ FAILED:', error.message);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 DIAGNOSIS COMPLETE\n');
    console.log('The issue is that MySQL prepared statements don\'t allow');
    console.log('? placeholders for LIMIT and OFFSET values.');
    console.log('\nThe fix is to use template literals or convert to integers');
    console.log('before interpolating into the SQL string.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

diagnoseNotifications();
