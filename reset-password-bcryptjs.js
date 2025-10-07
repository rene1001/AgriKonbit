const mysql = require('mysql2/promise');
const bcrypt = require('./server/node_modules/bcryptjs');
require('dotenv').config();

async function resetPassword() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔐 Resetting investor1 password...');
    
    // Hash the password with bcryptjs (same as server)
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Update the password
    await connection.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
      [hashedPassword, 'investor1@agrikonbit.com']
    );
    
    console.log('✅ Password reset successfully');
    console.log('📧 Email: investor1@agrikonbit.com');
    console.log('🔑 Password: password123');

    // Verify the user can be found
    const [users] = await connection.execute(
      'SELECT id, email, role, is_active FROM users WHERE email = ?',
      ['investor1@agrikonbit.com']
    );
    console.log('👤 User details:', users[0]);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

resetPassword();
