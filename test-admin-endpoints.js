/**
 * Script de test automatique des endpoints Admin
 * Usage: node test-admin-endpoints.js
 * 
 * Pré-requis: Serveur backend démarré sur port 3001
 */

const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'testadmin@agrikonbit.com';
const ADMIN_PASSWORD = 'TestAdmin123!';

let authToken = null;

// Couleurs console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper pour faire des requêtes HTTP
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

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  🧪 Tests Automatiques - Panel Admin AgriKonbit      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let passed = 0;
  let failed = 0;

  // Test 0: Vérifier que le serveur est accessible
  log('\n📡 Test 0: Connexion au serveur backend...', 'cyan');
  try {
    const result = await makeRequest('/api/health');
    if (result.status === 200 || result.status === 404) {
      log('✅ Serveur backend accessible', 'green');
      passed++;
    } else {
      log(`❌ Serveur non accessible (Status: ${result.status})`, 'red');
      failed++;
      log('⚠️  Veuillez démarrer le serveur: cd server && npm start', 'yellow');
      return;
    }
  } catch (error) {
    log(`❌ Erreur de connexion: ${error.message}`, 'red');
    log('⚠️  Veuillez démarrer le serveur: cd server && npm start', 'yellow');
    failed++;
    return;
  }

  // Test 1: Login Admin
  log('\n🔐 Test 1: Authentification Admin...', 'cyan');
  try {
    const result = await makeRequest('/api/auth/login', 'POST', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (result.status === 200 && result.data.success) {
      authToken = result.data.data.token;
      log(`✅ Login réussi - Token obtenu`, 'green');
      log(`   User: ${result.data.data.user.full_name} (${result.data.data.user.role})`, 'blue');
      passed++;
    } else {
      log(`❌ Login échoué (Status: ${result.status})`, 'red');
      log(`   Message: ${result.data.message || 'Erreur inconnue'}`, 'yellow');
      log(`   💡 Vérifier email/password dans le script`, 'yellow');
      failed++;
      return;
    }
  } catch (error) {
    log(`❌ Erreur login: ${error.message}`, 'red');
    failed++;
    return;
  }

  // Test 2: Dashboard Stats
  log('\n📊 Test 2: Récupération statistiques dashboard...', 'cyan');
  try {
    const result = await makeRequest('/api/admin/dashboard', 'GET', null, authToken);
    
    if (result.status === 200 && result.data.success) {
      const stats = result.data.data.stats;
      log('✅ Dashboard stats OK', 'green');
      log(`   - Utilisateurs: ${stats.total_users}`, 'blue');
      log(`   - Projets: ${stats.total_projects}`, 'blue');
      log(`   - Investissements: ${stats.total_investments}`, 'blue');
      log(`   - Commandes: ${stats.total_orders}`, 'blue');
      passed++;
    } else {
      log(`❌ Dashboard stats échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur dashboard: ${error.message}`, 'red');
    failed++;
  }

  // Test 3: Projets en attente
  log('\n⏳ Test 3: Récupération projets en attente...', 'cyan');
  try {
    const result = await makeRequest('/api/admin/projects/pending?page=1&limit=5', 'GET', null, authToken);
    
    if (result.status === 200 && result.data.success) {
      const count = result.data.data.projects.length;
      log(`✅ Projets en attente OK (${count} projet(s))`, 'green');
      if (count > 0) {
        log(`   Premier projet: "${result.data.data.projects[0].title}"`, 'blue');
      }
      passed++;
    } else {
      log(`❌ Projets en attente échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur projets: ${error.message}`, 'red');
    failed++;
  }

  // Test 4: Liste utilisateurs
  log('\n👥 Test 4: Récupération liste utilisateurs...', 'cyan');
  try {
    const result = await makeRequest('/api/admin/users?page=1&limit=10', 'GET', null, authToken);
    
    if (result.status === 200 && result.data.success) {
      const count = result.data.data.users.length;
      const total = result.data.data.pagination.total;
      log(`✅ Liste utilisateurs OK (${count}/${total})`, 'green');
      if (count > 0) {
        const roles = result.data.data.users.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {});
        log(`   Répartition: ${JSON.stringify(roles)}`, 'blue');
      }
      passed++;
    } else {
      log(`❌ Liste utilisateurs échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur users: ${error.message}`, 'red');
    failed++;
  }

  // Test 5: Liste produits
  log('\n🛒 Test 5: Récupération liste produits...', 'cyan');
  try {
    const result = await makeRequest('/api/admin/products?page=1&limit=10', 'GET', null, authToken);
    
    if (result.status === 200 && result.data.success) {
      const count = result.data.data.products.length;
      const total = result.data.data.pagination.total;
      log(`✅ Liste produits OK (${count}/${total})`, 'green');
      passed++;
    } else {
      log(`❌ Liste produits échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur products: ${error.message}`, 'red');
    failed++;
  }

  // Test 6: Endpoint export users
  log('\n📥 Test 6: Test endpoint export users CSV...', 'cyan');
  try {
    const result = await makeRequest('/api/reports/users?format=csv', 'GET', null, authToken);
    
    if (result.status === 200 && typeof result.data === 'string' && result.data.includes('id,email')) {
      const lines = result.data.split('\n').length;
      log(`✅ Export users OK (${lines} lignes)`, 'green');
      passed++;
    } else {
      log(`❌ Export users échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur export users: ${error.message}`, 'red');
    failed++;
  }

  // Test 7: Audit logs
  log('\n📋 Test 7: Récupération audit logs...', 'cyan');
  try {
    const result = await makeRequest('/api/admin/audit-logs?limit=5', 'GET', null, authToken);
    
    if (result.status === 200 && result.data.success) {
      const count = result.data.data.logs.length;
      log(`✅ Audit logs OK (${count} entrées)`, 'green');
      if (count > 0) {
        log(`   Dernière action: ${result.data.data.logs[0].action_type}`, 'blue');
      }
      passed++;
    } else {
      log(`❌ Audit logs échoué (Status: ${result.status})`, 'red');
      failed++;
    }
  } catch (error) {
    log(`❌ Erreur audit logs: ${error.message}`, 'red');
    failed++;
  }

  // Résumé
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                  📊 RÉSUMÉ DES TESTS                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const total = passed + failed;
  const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

  log(`Tests réussis: ${passed}/${total} (${percentage}%)`, passed === total ? 'green' : 'yellow');
  log(`Tests échoués: ${failed}/${total}`, failed > 0 ? 'red' : 'green');

  if (failed === 0) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
    console.log('✅ Panel Admin 100% opérationnel\n');
    console.log('📝 Prochaines étapes:');
    console.log('   1. Ouvrir http://localhost:3000/admin');
    console.log('   2. Se connecter avec admin@agrikonbit.com');
    console.log('   3. Suivre le guide: TESTS_ADMIN_CHECKLIST.md');
  } else {
    console.log('\n⚠️  Certains tests ont échoué');
    console.log('📝 Actions recommandées:');
    console.log('   1. Vérifier que le serveur backend est démarré');
    console.log('   2. Vérifier les credentials admin');
    console.log('   3. Consulter les logs serveur pour détails');
  }

  console.log('\n');
}

// Exécuter les tests
runTests().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
