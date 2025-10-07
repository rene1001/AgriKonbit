const axios = require('axios');
require('dotenv').config();

const API_BASE = 'http://localhost:3001/api';

async function testEndpoints() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // 1. Login to get token
    console.log('1. Testing login...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'investor1@agrikonbit.com',
      password: 'password123'
    });
    
    if (loginRes.data.success) {
      console.log('✅ Login successful');
      const token = loginRes.data.data.token;
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 2. Test /auth/me
      console.log('\n2. Testing /auth/me...');
      const meRes = await axios.get(`${API_BASE}/auth/me`, { headers });
      console.log('✅ /auth/me:', meRes.data.success ? 'OK' : 'FAILED');

      // 3. Test /investments/my-investments
      console.log('\n3. Testing /investments/my-investments...');
      try {
        const investRes = await axios.get(`${API_BASE}/investments/my-investments`, { headers });
        console.log('✅ /investments/my-investments:', investRes.data.success ? 'OK' : 'FAILED');
      } catch (error) {
        console.log('❌ /investments/my-investments:', error.response?.status, error.response?.data?.message);
      }

      // 4. Test /blockchain/gyt/transactions
      console.log('\n4. Testing /blockchain/gyt/transactions...');
      try {
        const txRes = await axios.get(`${API_BASE}/blockchain/gyt/transactions`, { headers });
        console.log('✅ /blockchain/gyt/transactions:', txRes.data.success ? 'OK' : 'FAILED');
      } catch (error) {
        console.log('❌ /blockchain/gyt/transactions:', error.response?.status, error.response?.data?.message);
      }

      // 5. Test /notifications
      console.log('\n5. Testing /notifications...');
      try {
        const notifRes = await axios.get(`${API_BASE}/notifications`, { headers });
        console.log('✅ /notifications:', notifRes.data.success ? 'OK' : 'FAILED');
      } catch (error) {
        console.log('❌ /notifications:', error.response?.status, error.response?.data?.message);
      }

      // 6. Test /projects with status=validated
      console.log('\n6. Testing /projects?status=validated...');
      try {
        const projRes = await axios.get(`${API_BASE}/projects?status=validated`, { headers });
        console.log('✅ /projects?status=validated:', projRes.data.success ? 'OK' : 'FAILED');
        console.log('   Projects found:', projRes.data.data?.projects?.length || 0);
      } catch (error) {
        console.log('❌ /projects?status=validated:', error.response?.status, error.response?.data?.message);
      }

      // 7. Test investment creation
      console.log('\n7. Testing POST /investments...');
      try {
        const investCreateRes = await axios.post(`${API_BASE}/investments`, {
          projectId: 1,
          amountGyt: 50,
          paymentMethod: 'gyt_wallet',
          returnType: 'financial'
        }, { headers });
        console.log('✅ POST /investments:', investCreateRes.data.success ? 'OK' : 'FAILED');
      } catch (error) {
        console.log('❌ POST /investments:', error.response?.status, error.response?.data?.message);
      }

    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints();
