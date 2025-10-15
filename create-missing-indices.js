const mysql = require('mysql2/promise');
require('dotenv').config({ path: './server/.env' });

async function createMissingIndices() {
  let connection;

  try {
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     📊 CRÉATION INDICES DE PERFORMANCE (MANQUANTS)       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    console.log('✅ Connexion établie\n');

    // Fonction pour créer un index s'il n'existe pas
    async function createIndexIfNotExists(tableName, indexName, columns) {
      try {
        // Vérifier si l'index existe
        const [existing] = await connection.query(`
          SELECT COUNT(*) as count 
          FROM information_schema.statistics 
          WHERE table_schema = DATABASE() 
          AND table_name = ? 
          AND index_name = ?
        `, [tableName, indexName]);

        if (existing[0].count > 0) {
          console.log(`   ⏭️  ${tableName}.${indexName} - Existe déjà`);
          return false;
        }

        // Créer l'index
        await connection.query(`CREATE INDEX ${indexName} ON ${tableName}(${columns})`);
        console.log(`   ✅ ${tableName}.${indexName} - Créé`);
        return true;
      } catch (error) {
        console.log(`   ⚠️  ${tableName}.${indexName} - Erreur: ${error.message}`);
        return false;
      }
    }

    let createdCount = 0;

    // PROJECTS
    console.log('📁 PROJECTS:');
    createdCount += await createIndexIfNotExists('projects', 'idx_projects_status_farmer', 'status, farmer_id') ? 1 : 0;
    createdCount += await createIndexIfNotExists('projects', 'idx_projects_category_status', 'category, status') ? 1 : 0;
    createdCount += await createIndexIfNotExists('projects', 'idx_projects_created_at', 'created_at') ? 1 : 0;
    createdCount += await createIndexIfNotExists('projects', 'idx_projects_location', 'location(255)') ? 1 : 0;
    createdCount += await createIndexIfNotExists('projects', 'idx_projects_funding', 'funded_amount_usd, budget_usd') ? 1 : 0;

    // PRODUCTS
    console.log('\n📦 PRODUCTS:');
    createdCount += await createIndexIfNotExists('products', 'idx_products_farmer_status', 'farmer_id, status') ? 1 : 0;
    createdCount += await createIndexIfNotExists('products', 'idx_products_category', 'category') ? 1 : 0;
    createdCount += await createIndexIfNotExists('products', 'idx_products_stock', 'stock_qty') ? 1 : 0;
    createdCount += await createIndexIfNotExists('products', 'idx_products_price', 'price_usd') ? 1 : 0;
    createdCount += await createIndexIfNotExists('products', 'idx_products_created_at', 'created_at') ? 1 : 0;

    // ORDERS
    console.log('\n🛒 ORDERS:');
    createdCount += await createIndexIfNotExists('orders', 'idx_orders_user_status', 'user_id, status') ? 1 : 0;
    createdCount += await createIndexIfNotExists('orders', 'idx_orders_created_at', 'created_at') ? 1 : 0;
    createdCount += await createIndexIfNotExists('orders', 'idx_orders_tracking', 'tracking_number') ? 1 : 0;

    // INVESTMENTS
    console.log('\n💰 INVESTMENTS:');
    createdCount += await createIndexIfNotExists('investments', 'idx_investments_investor', 'investor_id, status') ? 1 : 0;
    createdCount += await createIndexIfNotExists('investments', 'idx_investments_project', 'project_id, status') ? 1 : 0;
    createdCount += await createIndexIfNotExists('investments', 'idx_investments_created_at', 'created_at') ? 1 : 0;
    createdCount += await createIndexIfNotExists('investments', 'idx_investments_amount', 'amount_usd') ? 1 : 0;

    // USERS
    console.log('\n👥 USERS:');
    createdCount += await createIndexIfNotExists('users', 'idx_users_role_active', 'role, is_active') ? 1 : 0;
    createdCount += await createIndexIfNotExists('users', 'idx_users_name', 'first_name, last_name') ? 1 : 0;

    // DELIVERIES (optionnel - peut ne pas exister)
    console.log('\n🚚 DELIVERIES:');
    try {
      createdCount += await createIndexIfNotExists('deliveries', 'idx_deliveries_project_status', 'project_id, delivery_status') ? 1 : 0;
      createdCount += await createIndexIfNotExists('deliveries', 'idx_deliveries_scheduled_date', 'scheduled_delivery_date') ? 1 : 0;
    } catch (err) {
      console.log(`   ⚠️  Table deliveries non trouvée (optionnel)`);
    }

    // NOTIFICATIONS (optionnel)
    console.log('\n🔔 NOTIFICATIONS:');
    try {
      createdCount += await createIndexIfNotExists('notifications', 'idx_notifications_user_read', 'user_id, is_read, created_at') ? 1 : 0;
      createdCount += await createIndexIfNotExists('notifications', 'idx_notifications_created_at', 'created_at') ? 1 : 0;
    } catch (err) {
      console.log(`   ⚠️  Table notifications non trouvée (optionnel)`);
    }

    // MESSAGES (optionnel)
    console.log('\n💬 MESSAGES:');
    try {
      createdCount += await createIndexIfNotExists('messages', 'idx_messages_sender_receiver', 'sender_id, receiver_id, created_at') ? 1 : 0;
      createdCount += await createIndexIfNotExists('messages', 'idx_messages_receiver_read', 'receiver_id, is_read') ? 1 : 0;
    } catch (err) {
      console.log(`   ⚠️  Table messages non trouvée (optionnel)`);
    }

    // ORDER_ITEMS (optionnel)
    console.log('\n📋 ORDER_ITEMS:');
    try {
      createdCount += await createIndexIfNotExists('order_items', 'idx_order_items_order_id', 'order_id') ? 1 : 0;
      createdCount += await createIndexIfNotExists('order_items', 'idx_order_items_product_id', 'product_id') ? 1 : 0;
    } catch (err) {
      console.log(`   ⚠️  Table order_items non trouvée (optionnel)`);
    }

    // FAVORITES (optionnel)
    console.log('\n⭐ FAVORITES:');
    try {
      createdCount += await createIndexIfNotExists('favorites', 'idx_favorites_user_project', 'user_id, project_id') ? 1 : 0;
      createdCount += await createIndexIfNotExists('favorites', 'idx_favorites_user_created', 'user_id, created_at') ? 1 : 0;
    } catch (err) {
      console.log(`   ⚠️  Table favorites non trouvée (optionnel)`);
    }

    // Analyser les tables
    console.log('\n🔧 Analyse des tables...');
    const tables = ['projects', 'products', 'orders', 'investments', 'users'];
    for (const table of tables) {
      try {
        await connection.query(`ANALYZE TABLE ${table}`);
        console.log(`   ✅ ${table}`);
      } catch (err) {
        console.log(`   ⚠️  ${table} - ${err.message}`);
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                    ✅ SUCCÈS                              ║');
    console.log('╠═══════════════════════════════════════════════════════════╣');
    console.log(`║  ${createdCount} nouveaux indices créés                           ║`);
    console.log('║                                                           ║');
    console.log('║  Amélioration attendue :                                  ║');
    console.log('║  • Requêtes de liste : 30-50% plus rapide                ║');
    console.log('║  • Recherches : 50-80% plus rapide                       ║');
    console.log('║  • Tri et filtrage : 20-40% plus rapide                  ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Erreur:\n', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createMissingIndices();
