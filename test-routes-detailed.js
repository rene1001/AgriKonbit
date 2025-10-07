/**
 * Test détaillé des routes avec logs complets
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'testadmin@agrikonbit.com';
const ADMIN_PASSWORD = 'TestAdmin123!';

let authToken = null;

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`\n🔹 ${method} ${path}`);
    if (data) console.log('   Body:', JSON.stringify(data));

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(body);
          console.log('   Response:', JSON.stringify(json, null, 2).substring(0, 500));
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          console.log('   Response (text):', body.substring(0, 200));
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   Error:', error.message);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function test() {
  console.log('🧪 Tests Détaillés des Routes Admin\n');

  // Login
  console.log('═══════════════════════════════════════');
  console.log('1. AUTHENTIFICATION');
  console.log('═══════════════════════════════════════');
  const loginResult = await makeRequest('/api/auth/login', 'POST', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  if (loginResult.status !== 200) {
    console.log('\n❌ Login failed, stopping tests');
    return;
  }

  authToken = loginResult.data.data.token;
  console.log('✅ Token obtained');

  // Test projets en attente
  console.log('\n═══════════════════════════════════════');
  console.log('2. PROJETS EN ATTENTE');
  console.log('═══════════════════════════════════════');
  await makeRequest('/api/admin/projects/pending?page=1&limit=5', 'GET', null, authToken);

  // Test liste users
  console.log('\n═══════════════════════════════════════');
  console.log('3. LISTE UTILISATEURS');
  console.log('═══════════════════════════════════════');
  await makeRequest('/api/admin/users?page=1&limit=10', 'GET', null, authToken);

  // Test audit logs
  console.log('\n═══════════════════════════════════════');
  console.log('4. AUDIT LOGS');
  console.log('═══════════════════════════════════════');
  await makeRequest('/api/admin/audit-logs?limit=5', 'GET', null, authToken);

  console.log('\n✅ Tests terminés\n');
}

test().catch(console.error);
