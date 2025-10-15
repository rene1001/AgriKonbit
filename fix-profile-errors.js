const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function fixProfileErrors() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     🔧 FIX PROFILE ERRORS - Migration & Verification    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('✅ Connected to database\n');

    // 1. Vérifier si les colonnes existent
    console.log('📊 Checking if bio and theme_preference columns exist...\n');
    
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('bio', 'theme_preference')
    `, [process.env.DB_NAME || 'agrikonbit']);

    const existingColumns = columns.map(c => c.COLUMN_NAME);
    const hasBio = existingColumns.includes('bio');
    const hasTheme = existingColumns.includes('theme_preference');

    console.log(`   Bio column: ${hasBio ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   Theme preference column: ${hasTheme ? '✅ EXISTS' : '❌ MISSING'}\n`);

    // 2. Si les colonnes n'existent pas, les créer
    if (!hasBio || !hasTheme) {
      console.log('🔨 Creating missing columns...\n');

      if (!hasBio) {
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN bio TEXT NULL COMMENT 'User biography/description' AFTER address
        `);
        console.log('   ✅ Created bio column');
      }

      if (!hasTheme) {
        await connection.query(`
          ALTER TABLE users 
          ADD COLUMN theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light' 
          COMMENT 'User theme preference' 
          AFTER ${hasBio ? 'bio' : 'address'}
        `);
        console.log('   ✅ Created theme_preference column');
      }

      // Mettre à jour les utilisateurs existants
      await connection.query(`
        UPDATE users 
        SET theme_preference = 'light' 
        WHERE theme_preference IS NULL
      `);
      console.log('   ✅ Updated existing users with default theme\n');
    }

    // 3. Vérifier la structure complète de la table users
    console.log('📋 Current users table structure:\n');
    const [tableStructure] = await connection.query(`
      DESCRIBE users
    `);

    tableStructure.forEach(col => {
      console.log(`   ${col.Field.padEnd(20)} ${col.Type.padEnd(30)} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // 4. Vérifier le dossier uploads
    console.log('\n📁 Checking uploads directory...\n');
    
    const uploadsDir = path.join(__dirname, 'uploads');
    const profilesDir = path.join(__dirname, 'uploads', 'profiles');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('   ✅ Created uploads directory');
    } else {
      console.log('   ✅ uploads directory exists');
    }

    if (!fs.existsSync(profilesDir)) {
      fs.mkdirSync(profilesDir, { recursive: true });
      console.log('   ✅ Created uploads/profiles directory');
    } else {
      console.log('   ✅ uploads/profiles directory exists');
    }

    // 5. Tester une requête GET /profile
    console.log('\n🧪 Testing profile query...\n');
    
    const [users] = await connection.query(`
      SELECT 
        u.id, u.email, u.full_name, u.role, u.phone, u.country, 
        u.city, u.address, u.profile_image, u.bio, u.theme_preference, u.kyc_status,
        COALESCE(uw.gyt_balance, 0) as gyt_balance, 
        COALESCE(uw.total_deposited_usd, 0) as total_deposited_usd, 
        COALESCE(uw.total_deposited_gyt, 0) as total_deposited_gyt,
        COALESCE(uw.total_spent_gyt, 0) as total_spent_gyt
      FROM users u
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      LIMIT 1
    `);

    if (users.length > 0) {
      console.log('   ✅ Profile query successful');
      console.log('   Sample user:', {
        id: users[0].id,
        email: users[0].email,
        full_name: users[0].full_name,
        bio: users[0].bio || '(empty)',
        theme_preference: users[0].theme_preference,
        profile_image: users[0].profile_image || '(no image)'
      });
    } else {
      console.log('   ⚠️  No users found in database');
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     ✅ ALL FIXES APPLIED SUCCESSFULLY                    ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    console.log('📝 Next steps:\n');
    console.log('1. Restart the backend server:');
    console.log('   cd server && npm start\n');
    console.log('2. Test the profile page:');
    console.log('   http://localhost:3000/profile\n');
    console.log('3. Try uploading a photo\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await connection.end();
    console.log('\n✅ Database connection closed\n');
  }
}

fixProfileErrors().catch(console.error);
