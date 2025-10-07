const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function testNewFeatures() {
  console.log('🧪 Testing New Features - Dashboard Agriculteur\n');
  console.log('=' .repeat(60));
  
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

    // Test 1: Check messaging tables
    console.log('📋 TEST 1: Messaging Tables');
    console.log('-'.repeat(60));
    
    const [conversationsTable] = await connection.query('SHOW TABLES LIKE "conversations"');
    const [messagesTable] = await connection.query('SHOW TABLES LIKE "messages"');
    
    if (conversationsTable.length > 0) {
      console.log('✅ Table "conversations" exists');
      const [convColumns] = await connection.query('DESCRIBE conversations');
      console.log(`   Columns: ${convColumns.map(c => c.Field).join(', ')}`);
    } else {
      console.log('❌ Table "conversations" NOT FOUND');
    }
    
    if (messagesTable.length > 0) {
      console.log('✅ Table "messages" exists');
      const [msgColumns] = await connection.query('DESCRIBE messages');
      console.log(`   Columns: ${msgColumns.map(c => c.Field).join(', ')}`);
    } else {
      console.log('❌ Table "messages" NOT FOUND');
    }
    console.log('');

    // Test 2: Check documents table
    console.log('📋 TEST 2: Documents Table');
    console.log('-'.repeat(60));
    
    const [documentsTable] = await connection.query('SHOW TABLES LIKE "user_documents"');
    
    if (documentsTable.length > 0) {
      console.log('✅ Table "user_documents" exists');
      const [docColumns] = await connection.query('DESCRIBE user_documents');
      console.log(`   Columns: ${docColumns.map(c => c.Field).join(', ')}`);
    } else {
      console.log('❌ Table "user_documents" NOT FOUND');
    }
    console.log('');

    // Test 3: Create test conversation
    console.log('📋 TEST 3: Create Test Conversation');
    console.log('-'.repeat(60));
    
    const [farmers] = await connection.query('SELECT id, email FROM users WHERE role = "farmer" LIMIT 2');
    const [investors] = await connection.query('SELECT id, email FROM users WHERE role = "investor" LIMIT 1');
    
    if (farmers.length >= 1 && investors.length >= 1) {
      const farmerId = farmers[0].id;
      const investorId = investors[0].id;
      
      // Check if conversation already exists
      const [existingConv] = await connection.query(
        'SELECT id FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
        [farmerId, investorId, investorId, farmerId]
      );
      
      let conversationId;
      if (existingConv.length > 0) {
        conversationId = existingConv[0].id;
        console.log(`✅ Conversation already exists (ID: ${conversationId})`);
      } else {
        const result = await connection.query(
          'INSERT INTO conversations (user1_id, user2_id, created_at) VALUES (?, ?, NOW())',
          [farmerId, investorId]
        );
        conversationId = result[0].insertId;
        console.log(`✅ Test conversation created (ID: ${conversationId})`);
      }
      
      console.log(`   Farmer: ${farmers[0].email} (ID: ${farmerId})`);
      console.log(`   Investor: ${investors[0].email} (ID: ${investorId})`);
      
      // Create test message
      await connection.query(`
        INSERT INTO messages (conversation_id, sender_id, receiver_id, subject, content, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [
        conversationId,
        farmerId,
        investorId,
        'Test de la messagerie',
        'Ceci est un message de test pour vérifier le système de messagerie.'
      ]);
      console.log('✅ Test message created');
    } else {
      console.log('⚠️  Not enough users to create test conversation');
      console.log(`   Farmers: ${farmers.length}, Investors: ${investors.length}`);
    }
    console.log('');

    // Test 4: Count messages and conversations
    console.log('📋 TEST 4: Data Statistics');
    console.log('-'.repeat(60));
    
    const [convCount] = await connection.query('SELECT COUNT(*) as count FROM conversations');
    const [msgCount] = await connection.query('SELECT COUNT(*) as count FROM messages');
    const [docCount] = await connection.query('SELECT COUNT(*) as count FROM user_documents');
    
    console.log(`✅ Conversations: ${convCount[0].count}`);
    console.log(`✅ Messages: ${msgCount[0].count}`);
    console.log(`✅ Documents: ${docCount[0].count}`);
    console.log('');

    // Test 5: Check recent messages
    console.log('📋 TEST 5: Recent Messages');
    console.log('-'.repeat(60));
    
    const [recentMessages] = await connection.query(`
      SELECT 
        m.id,
        m.subject,
        m.content,
        u1.email as sender,
        u2.email as receiver,
        m.is_read,
        m.created_at
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.id
      JOIN users u2 ON m.receiver_id = u2.id
      ORDER BY m.created_at DESC
      LIMIT 5
    `);
    
    if (recentMessages.length > 0) {
      console.log(`✅ Found ${recentMessages.length} recent message(s):\n`);
      recentMessages.forEach((msg, idx) => {
        console.log(`   ${idx + 1}. From: ${msg.sender} → To: ${msg.receiver}`);
        console.log(`      Subject: ${msg.subject || '(no subject)'}`);
        console.log(`      Content: ${msg.content.substring(0, 60)}...`);
        console.log(`      Read: ${msg.is_read ? 'Yes' : 'No'}`);
        console.log(`      Date: ${msg.created_at}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No messages found');
    }

    // Test 6: Check user wallets
    console.log('📋 TEST 6: User Wallets Status');
    console.log('-'.repeat(60));
    
    const [farmerWallets] = await connection.query(`
      SELECT u.email, u.role, w.gyt_balance
      FROM users u
      LEFT JOIN user_wallets w ON u.id = w.user_id
      WHERE u.role = 'farmer'
      ORDER BY u.id
    `);
    
    let walletsOk = true;
    farmerWallets.forEach(f => {
      if (f.gyt_balance !== null) {
        console.log(`✅ ${f.email}: ${f.gyt_balance} GYT`);
      } else {
        console.log(`❌ ${f.email}: NO WALLET`);
        walletsOk = false;
      }
    });
    
    if (walletsOk) {
      console.log('\n✅ All farmers have wallets!');
    } else {
      console.log('\n⚠️  Some farmers missing wallets - run check-and-fix-wallets.js');
    }
    console.log('');

    // Test 7: Check files and routes
    console.log('📋 TEST 7: Backend Files Check');
    console.log('-'.repeat(60));
    
    const fs = require('fs');
    const path = require('path');
    
    const filesToCheck = [
      'server/routes/messages.js',
      'server/routes/documents.js',
      'client/src/components/Dashboard/MessagingSection.js',
      'client/src/components/Dashboard/ResourcesSection.js',
      'migrations/002_create_messaging_tables.sql',
      'migrations/003_create_documents_table.sql'
    ];
    
    filesToCheck.forEach(file => {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`✅ ${file} (${sizeKB} KB)`);
      } else {
        console.log(`❌ ${file} NOT FOUND`);
      }
    });
    console.log('');

    // Final Summary
    console.log('=' .repeat(60));
    console.log('📊 SUMMARY');
    console.log('=' .repeat(60));
    
    const summary = {
      tables: {
        conversations: conversationsTable.length > 0,
        messages: messagesTable.length > 0,
        user_documents: documentsTable.length > 0
      },
      data: {
        conversations: convCount[0].count,
        messages: msgCount[0].count,
        documents: docCount[0].count
      },
      wallets: walletsOk,
      files: filesToCheck.filter(f => fs.existsSync(path.join(__dirname, f))).length
    };
    
    console.log(`\n✅ Tables Created: ${Object.values(summary.tables).filter(Boolean).length}/3`);
    console.log(`✅ Conversations: ${summary.data.conversations}`);
    console.log(`✅ Messages: ${summary.data.messages}`);
    console.log(`✅ Documents: ${summary.data.documents}`);
    console.log(`✅ Wallets: ${walletsOk ? 'All OK' : 'Issues Found'}`);
    console.log(`✅ Files Present: ${summary.files}/${filesToCheck.length}`);
    
    const allGood = 
      Object.values(summary.tables).every(Boolean) &&
      summary.wallets &&
      summary.files === filesToCheck.length;
    
    console.log('\n' + '=' .repeat(60));
    if (allGood) {
      console.log('🎉 ALL TESTS PASSED - SYSTEM READY!');
      console.log('✅ You can now start the servers and test the UI');
    } else {
      console.log('⚠️  SOME TESTS FAILED - CHECK DETAILS ABOVE');
    }
    console.log('=' .repeat(60) + '\n');

    await connection.end();
    process.exit(allGood ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testNewFeatures();
