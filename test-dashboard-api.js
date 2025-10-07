const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './server/.env' });

const API_URL = 'http://localhost:3001/api';
const FARMER_ID = 1; // ID du farmer de test

async function testDashboardAPI() {
  console.log('🧪 Testing Farmer Dashboard API\n');
  console.log('Base URL:', API_URL);
  console.log('Farmer ID:', FARMER_ID, '\n');

  // Générer un token JWT de test
  const token = jwt.sign(
    { userId: FARMER_ID },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  console.log('✅ JWT Token generated\n');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const tests = [
    {
      name: 'Dashboard Statistics',
      method: 'GET',
      url: `${API_URL}/farmer/stats/dashboard`
    },
    {
      name: 'Farmer Orders',
      method: 'GET',
      url: `${API_URL}/farmer/orders`
    },
    {
      name: 'Farmer Investors',
      method: 'GET',
      url: `${API_URL}/farmer/investors`
    },
    {
      name: 'Farmer Transactions',
      method: 'GET',
      url: `${API_URL}/farmer/transactions`
    },
    {
      name: 'Farmer Activities',
      method: 'GET',
      url: `${API_URL}/farmer/activities`
    },
    {
      name: 'Farmer Projects',
      method: 'GET',
      url: `${API_URL}/projects/farmer/my-projects`
    },
    {
      name: 'Farmer Products',
      method: 'GET',
      url: `${API_URL}/products/farmer/my-products`
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.url}`);
      
      const response = await axios({
        method: test.method,
        url: test.url,
        headers
      });

      if (response.status === 200) {
        console.log(`   ✅ Success (${response.status})`);
        
        // Afficher un aperçu des données
        if (response.data && response.data.data) {
          const data = response.data.data;
          if (typeof data === 'object' && !Array.isArray(data)) {
            console.log(`   📊 Data keys:`, Object.keys(data).join(', '));
          } else if (Array.isArray(data)) {
            console.log(`   📊 Array length:`, data.length);
          }
        }
        passed++;
      }
    } catch (error) {
      console.log(`   ❌ Failed`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Message: ${error.response.data?.message || error.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
        console.log(`   💡 Make sure the backend server is running on port 3001`);
      }
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}/${tests.length}`);
  console.log(`   ❌ Failed: ${failed}/${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Dashboard API is ready!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.\n');
    process.exit(1);
  }
}

// Check if server is running first
axios.get('http://localhost:3001/health')
  .then(() => {
    console.log('✅ Backend server is running\n');
    return testDashboardAPI();
  })
  .catch((error) => {
    console.error('❌ Backend server is not running!');
    console.error('💡 Start the server with: cd server && npm start\n');
    process.exit(1);
  });
