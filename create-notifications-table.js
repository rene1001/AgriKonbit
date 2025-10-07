const mysql = require('mysql2/promise');
require('dotenv').config();

async function createNotificationsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrikonbit'
  });

  try {
    console.log('🔍 Checking notifications table...');
    
    // Check if table exists
    const [tables] = await connection.execute(
      'SHOW TABLES LIKE "notifications"'
    );

    if (tables.length === 0) {
      console.log('📝 Creating notifications table...');
      await connection.execute(`
        CREATE TABLE notifications (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
          is_read BOOLEAN DEFAULT FALSE,
          data JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_is_read (is_read),
          INDEX idx_created_at (created_at)
        )
      `);
      console.log('✅ Notifications table created');
      
      // Add sample notifications
      await connection.execute(`
        INSERT INTO notifications (user_id, title, message, type) VALUES
        (4, 'Bienvenue sur AgriKonbit!', 'Votre compte investisseur a été créé avec succès.', 'success'),
        (4, 'Nouveau projet disponible', 'Un nouveau projet de café bio est disponible pour investissement.', 'info'),
        (4, 'Rendement disponible', 'Votre investissement dans le projet de miel a généré 25 GYT de rendement.', 'success')
      `);
      console.log('✅ Sample notifications added');
    } else {
      console.log('✅ Notifications table already exists');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

createNotificationsTable();
