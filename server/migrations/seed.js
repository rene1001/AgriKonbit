const { query } = require('../config/database');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users
    console.log('👥 Creating test users...');
    
    // Farmers
    await query(`
      INSERT INTO users (email, password_hash, full_name, role, country, city, is_active, email_verified) VALUES
      ('farmer1@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Jean Baptiste Farmer', 'farmer', 'Haiti', 'Port-au-Prince', true, true),
      ('farmer2@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Marie Claire Agriculteur', 'farmer', 'Haiti', 'Cap-Haïtien', true, true),
      ('farmer3@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Pierre Louis Cultivateur', 'farmer', 'Haiti', 'Les Cayes', true, true)
    `);

    // Investors
    await query(`
      INSERT INTO users (email, password_hash, full_name, role, country, city, is_active, email_verified) VALUES
      ('investor1@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Sarah Johnson', 'investor', 'USA', 'New York', true, true),
      ('investor2@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Michel Dubois', 'investor', 'France', 'Paris', true, true),
      ('consumer1@agrikonbit.com', '$2a$10$dummy.hash.for.testing', 'Anna Rodriguez', 'consumer', 'Spain', 'Madrid', true, true)
    `);

    // Create test projects
    console.log('🚜 Creating test projects...');
    
    await query(`
      INSERT INTO projects (
        farmer_id, title, description, budget_usd, budget_gyt, duration_days, 
        estimated_return_pct, location, category, status, funded_amount_usd, 
        funded_amount_gyt, investor_count, images
      ) VALUES
      (1, 'Organic Coffee Plantation Expansion', 
       'Expanding our organic coffee plantation in the mountains of Haiti. This project will increase our production capacity by 50% and create jobs for 20 local farmers. We focus on sustainable farming practices and fair trade principles.',
       15000, 15000, 365, 12.5, 'Kenscoff, Haiti', 'crops', 'validated', 8500, 8500, 12,
       '["https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800"]'),
      
      (2, 'Sustainable Vegetable Farming Initiative', 
       'Modern greenhouse vegetable farming using sustainable techniques. We will grow tomatoes, peppers, and leafy greens year-round using drip irrigation and organic fertilizers.',
       8000, 8000, 180, 15.0, 'Pétion-Ville, Haiti', 'crops', 'validated', 3200, 3200, 8,
       '["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800"]'),
      
      (3, 'Honey Production & Beekeeping Project', 
       'Establishing a modern beekeeping operation to produce high-quality honey and support local ecosystem. This project includes training for local beekeepers and sustainable hive management.',
       5000, 5000, 270, 18.0, 'Jacmel, Haiti', 'other', 'validated', 1500, 1500, 5,
       '["https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800", "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800"]'),
      
      (1, 'Fish Farming Development', 
       'Creating a sustainable fish farming operation using modern aquaculture techniques. Focus on tilapia and local fish species with environmentally friendly practices.',
       12000, 12000, 300, 14.0, 'Gonaïves, Haiti', 'fishing', 'active', 0, 0, 0,
       '["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800"]'),
      
      (2, 'Poultry Farm Modernization', 
       'Upgrading our poultry farm with modern equipment and sustainable practices. This will increase egg and meat production while maintaining high animal welfare standards.',
       10000, 10000, 240, 16.5, 'Saint-Marc, Haiti', 'livestock', 'pending', 0, 0, 0,
       '["https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800"]')
    `);

    // Create test products
    console.log('🥕 Creating test products...');
    
    await query(`
      INSERT INTO products (
        farmer_id, project_id, name, description, price_usd, price_gyt, stock, 
        category, origin_country, origin_region, organic_certified, harvest_date, 
        weight_kg, images
      ) VALUES
      (1, 1, 'Premium Organic Coffee Beans', 
       'High-quality arabica coffee beans grown at 1200m altitude in the mountains of Haiti. Fully organic and fair trade certified.',
       25.99, 25.99, 50, 'other', 'Haiti', 'Kenscoff', true, '2024-01-15', 1.0,
       '["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800"]'),
      
      (2, 2, 'Fresh Organic Tomatoes', 
       'Vine-ripened organic tomatoes grown in our sustainable greenhouse. Perfect for salads and cooking.',
       4.99, 4.99, 100, 'vegetables', 'Haiti', 'Pétion-Ville', true, '2024-02-01', 2.0,
       '["https://images.unsplash.com/photo-1592841200221-21e1c0d36875?w=800"]'),
      
      (2, 2, 'Mixed Organic Peppers', 
       'Colorful mix of bell peppers and hot peppers, all organically grown using sustainable farming methods.',
       6.99, 6.99, 75, 'vegetables', 'Haiti', 'Pétion-Ville', true, '2024-02-05', 1.5,
       '["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800"]'),
      
      (3, 3, 'Pure Wildflower Honey', 
       'Raw, unprocessed honey from our sustainable beekeeping operation. Rich in flavor and natural enzymes.',
       18.99, 18.99, 30, 'honey', 'Haiti', 'Jacmel', true, '2024-01-20', 0.5,
       '["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800"]'),
      
      (1, null, 'Organic Plantains', 
       'Fresh organic plantains, perfect for traditional Haitian cooking. Grown using sustainable farming practices.',
       3.99, 3.99, 80, 'fruits', 'Haiti', 'Kenscoff', true, '2024-02-10', 3.0,
       '["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800"]'),
      
      (2, null, 'Fresh Lettuce Mix', 
       'Crispy mix of organic lettuce varieties including romaine, butterhead, and leaf lettuce.',
       2.99, 2.99, 60, 'vegetables', 'Haiti', 'Pétion-Ville', true, '2024-02-12', 0.5,
       '["https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800"]')
    `);

    // Create user wallets
    console.log('💰 Creating user wallets...');
    
    await query(`
      INSERT INTO user_wallets (user_id, gyt_balance, total_deposited_usd, total_deposited_gyt) VALUES
      (4, 1000.0, 1000.0, 1000.0),
      (5, 500.0, 500.0, 500.0),
      (6, 250.0, 250.0, 250.0)
    `);

    // Create some investments
    console.log('💸 Creating test investments...');
    
    await query(`
      INSERT INTO investments (
        project_id, investor_id, amount_gyt, amount_usd, payment_method, 
        status, return_type
      ) VALUES
      (1, 4, 5000.0, 5000.0, 'gyt_wallet', 'completed', 'financial'),
      (1, 5, 2000.0, 2000.0, 'gyt_wallet', 'completed', 'mixed'),
      (1, 6, 1500.0, 1500.0, 'gyt_wallet', 'completed', 'physical'),
      (2, 4, 2000.0, 2000.0, 'gyt_wallet', 'completed', 'financial'),
      (2, 5, 1200.0, 1200.0, 'gyt_wallet', 'completed', 'financial'),
      (3, 4, 800.0, 800.0, 'gyt_wallet', 'completed', 'mixed'),
      (3, 6, 700.0, 700.0, 'gyt_wallet', 'completed', 'physical')
    `);

    // Create project updates
    console.log('📝 Creating project updates...');
    
    await query(`
      INSERT INTO project_updates (project_id, title, content, is_public) VALUES
      (1, 'Coffee Plants Growing Strong', 
       'Great news! Our new coffee plants are growing exceptionally well. The recent rains have been perfect for their development. We expect to start harvesting in 6 months.',
       true),
      (2, 'First Greenhouse Harvest Complete', 
       'We have successfully completed our first harvest from the new greenhouse. The tomatoes and peppers are of excellent quality and we are ready to start selling them.',
       true),
      (3, 'Bee Colonies Thriving', 
       'Our bee colonies are doing wonderfully this season. We have already produced 200kg of honey and expect to double that amount by the end of the project.',
       true)
    `);

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log('  - 6 test users (3 farmers, 2 investors, 1 consumer)');
    console.log('  - 5 projects (3 validated, 1 active, 1 pending)');
    console.log('  - 6 products available for purchase');
    console.log('  - 7 investments in projects');
    console.log('  - 3 project updates');
    console.log('  - User wallets with GYT balances');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
