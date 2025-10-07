const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
require('dotenv').config();

async function updateTestUsers() {
  try {
    console.log('🔐 Generating password hashes for test users...');
    
    // Password for all test users: "password123"
    const password = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Password hash generated successfully');
    console.log('📝 Password for all test users: password123');
    console.log('');

    // Update all test users with the same password
    const testEmails = [
      'farmer1@agrikonbit.com',
      'farmer2@agrikonbit.com',
      'farmer3@agrikonbit.com',
      'investor1@agrikonbit.com',
      'investor2@agrikonbit.com',
      'consumer1@agrikonbit.com'
    ];

    console.log('🔄 Updating test users in database...');
    
    for (const email of testEmails) {
      await query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, email]
      );
      console.log(`✅ Updated: ${email}`);
    }

    console.log('');
    console.log('🎉 All test users updated successfully!');
    console.log('');
    console.log('📋 Test User Credentials:');
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('👨‍🌾 FARMERS:');
    console.log('  • farmer1@agrikonbit.com / password123');
    console.log('  • farmer2@agrikonbit.com / password123');
    console.log('  • farmer3@agrikonbit.com / password123');
    console.log('');
    console.log('💰 INVESTORS:');
    console.log('  • investor1@agrikonbit.com / password123');
    console.log('  • investor2@agrikonbit.com / password123');
    console.log('');
    console.log('🛒 CONSUMER:');
    console.log('  • consumer1@agrikonbit.com / password123');
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating test users:', error);
    process.exit(1);
  }
}

// Run the update
updateTestUsers();
