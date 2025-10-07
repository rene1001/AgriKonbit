const axios = require('axios');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

async function testFarmerAPI() {
  let connection;
  
  try {
    console.log('🔄 Setting up test...\n');
    
    // Connect to database to get farmer credentials
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'agrikonbit'
    });

    // Get a farmer user
    const [farmers] = await connection.query(`
      SELECT id, email, full_name 
      FROM users 
      WHERE role = 'farmer' 
      LIMIT 1
    `);

    if (farmers.length === 0) {
      console.log('❌ No farmer found in database');
      return;
    }

    const farmer = farmers[0];
    console.log(`👨‍🌾 Testing with farmer: ${farmer.full_name} (${farmer.email})\n`);

    // Test if server is running
    const baseURL = process.env.API_URL || 'http://localhost:5000';
    console.log(`🌐 Testing API at: ${baseURL}\n`);

    try {
      // First, try to login
      console.log('1️⃣  Testing login...');
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        email: farmer.email,
        password: 'password123' // Default test password
      });
      
      const token = loginResponse.data.token;
      console.log('   ✅ Login successful\n');

      // Test farmer dashboard stats endpoint
      console.log('2️⃣  Testing GET /api/farmer/stats/dashboard...');
      const statsResponse = await axios.get(`${baseURL}/api/farmer/stats/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.data.success) {
        console.log('   ✅ Dashboard stats retrieved successfully');
        console.log('\n   📊 Dashboard Data:');
        console.log('   ├─ Projects:', statsResponse.data.data.projects.total_projects);
        console.log('   ├─ Products:', statsResponse.data.data.products.total_products);
        console.log('   ├─ Orders:', statsResponse.data.data.orders.total_orders || 0);
        console.log('   ├─ Investors:', statsResponse.data.data.investors.total_investors || 0);
        console.log('   └─ Wallet GYT:', statsResponse.data.data.wallet.gyt_balance);
      } else {
        console.log('   ❌ Failed to retrieve dashboard stats');
        console.log('   Response:', statsResponse.data);
      }

      console.log('\n3️⃣  Testing GET /api/farmer/transactions...');
      try {
        const transactionsResponse = await axios.get(`${baseURL}/api/farmer/transactions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (transactionsResponse.data.success) {
          console.log('   ✅ Transactions endpoint working');
          console.log('   📝 Transactions count:', transactionsResponse.data.data.transactions.length);
        }
      } catch (error) {
        if (error.response) {
          console.log('   ⚠️  Transactions endpoint error:', error.response.status, error.response.data.message);
        } else {
          console.log('   ❌ Transactions endpoint failed:', error.message);
        }
      }

      console.log('\n✨ API TESTS COMPLETED!\n');

    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log('   ⚠️  Server is not running. Please start the server first:');
        console.log('      cd server && npm start\n');
        console.log('   ℹ️  However, database schema is confirmed working!');
      } else if (error.response) {
        console.log('   ⚠️  API Error:', error.response.status);
        console.log('   Message:', error.response.data.message || error.response.data);
      } else {
        console.log('   ❌ Error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testFarmerAPI();
