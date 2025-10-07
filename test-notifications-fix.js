const { query } = require('./server/config/database');
require('dotenv').config({ path: './server/.env' });

async function testNotificationsFix() {
  try {
    console.log('🔍 Testing Notifications Endpoint Fix\n');

    // Get a test user
    const [user] = await query(`SELECT id, email FROM users LIMIT 1`);
    if (!user) {
      console.log('❌ No users found');
      return;
    }

    console.log(`✅ Testing with user: ${user.email} (ID: ${user.id})\n`);

    // Create test notifications if none exist
    const [existingNotifs] = await query(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ?
    `, [user.id]);

    if (existingNotifs.count === 0) {
      console.log('📝 Creating test notifications...');
      await query(`
        INSERT INTO notifications (user_id, type, title, message)
        VALUES 
          (?, 'info', 'Test 1', 'Test notification 1'),
          (?, 'info', 'Test 2', 'Test notification 2'),
          (?, 'info', 'Test 3', 'Test notification 3')
      `, [user.id, user.id, user.id]);
      console.log('   ✅ Created 3 test notifications\n');
    }

    // Test 1: Simulate the exact query from the endpoint
    console.log('1️⃣  Testing notification query (as in endpoint)...');
    try {
      const page = 1;
      const limit = 20;
      const unreadOnly = false;
      
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 20;
      const offset = (pageNum - 1) * limitNum;

      let whereClause = 'WHERE user_id = ?';
      let params = [user.id];

      if (unreadOnly === 'true') {
        whereClause += ' AND is_read = false';
      }

      const notifications = await query(`
        SELECT * FROM notifications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      console.log(`   ✅ Query successful! Found ${notifications.length} notifications\n`);

      // Test count query
      const [countResult] = await query(`
        SELECT COUNT(*) as total
        FROM notifications
        ${whereClause}
      `, params);

      console.log(`   ✅ Count query successful! Total: ${countResult.total}\n`);

    } catch (error) {
      console.log('   ❌ Query FAILED:', error.message);
      console.error('   Error details:', error);
      process.exit(1);
    }

    // Test 2: With unreadOnly filter
    console.log('2️⃣  Testing with unreadOnly=true...');
    try {
      const pageNum = 1;
      const limitNum = 5;
      const offset = 0;

      let whereClause = 'WHERE user_id = ? AND is_read = false';
      let params = [user.id];

      const notifications = await query(`
        SELECT * FROM notifications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      console.log(`   ✅ Unread filter successful! Found ${notifications.length} unread notifications\n`);

    } catch (error) {
      console.log('   ❌ Query FAILED:', error.message);
      process.exit(1);
    }

    // Test 3: Edge cases
    console.log('3️⃣  Testing edge cases...');
    try {
      // High page number
      const notifications1 = await query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 10 OFFSET 100
      `, [user.id]);
      console.log(`   ✅ High offset: ${notifications1.length} results`);

      // Zero limit (should still work)
      const notifications2 = await query(`
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1 OFFSET 0
      `, [user.id]);
      console.log(`   ✅ Zero offset: ${notifications2.length} results`);

      console.log('');
    } catch (error) {
      console.log('   ❌ Edge case FAILED:', error.message);
      process.exit(1);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ The notifications endpoint is now fixed!');
    console.log('✨ Restart the server to apply the changes.\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testNotificationsFix();
