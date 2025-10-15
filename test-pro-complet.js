/**
 * Script de Test Professionnel Complet - AgriKonbit
 * Teste en profondeur toutes les fonctionnalités de chaque rôle
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Codes couleur
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, details = '') {
  testResults.total++;
  if (status === 'pass') {
    testResults.passed++;
    log(`✅ ${testName}`, 'green');
    if (details) log(`   ${details}`, 'cyan');
  } else if (status === 'fail') {
    testResults.failed++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
    testResults.issues.push({ test: testName, issue: details });
  } else if (status === 'warn') {
    testResults.warnings++;
    log(`⚠️  ${testName}`, 'yellow');
    if (details) log(`   ${details}`, 'cyan');
  }
}

// Tests d'authentification
async function testAuthentication() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║              TESTS D\'AUTHENTIFICATION                      ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');
  
  const users = [
    { email: 'farmer1@agrikonbit.com', password: 'password123', role: 'farmer' },
    { email: 'investor1@agrikonbit.com', password: 'password123', role: 'investor' },
    { email: 'consumer1@agrikonbit.com', password: 'password123', role: 'consumer' }
  ];
  
  const tokens = {};
  
  for (const user of users) {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      if (response.data.success && response.data.data.token) {
        tokens[user.role] = response.data.data.token;
        logTest(`Login ${user.role}`, 'pass', `Token généré, User ID: ${response.data.data.user.id}`);
      } else {
        logTest(`Login ${user.role}`, 'fail', 'Token manquant');
      }
    } catch (error) {
      logTest(`Login ${user.role}`, 'fail', error.response?.data?.message || error.message);
    }
  }
  
  // Test login avec mauvais mot de passe
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'farmer1@agrikonbit.com',
      password: 'wrongpassword'
    });
    logTest('Sécurité: Rejet mot de passe incorrect', 'fail', 'Le serveur a accepté un mauvais mot de passe!');
  } catch (error) {
    if (error.response?.status === 401) {
      logTest('Sécurité: Rejet mot de passe incorrect', 'pass', 'Erreur 401 correcte');
    } else {
      logTest('Sécurité: Rejet mot de passe incorrect', 'warn', `Code erreur inattendu: ${error.response?.status}`);
    }
  }
  
  // Test accès sans token
  try {
    await axios.get(`${API_BASE}/auth/me`);
    logTest('Sécurité: Protection routes authentifiées', 'fail', 'Route accessible sans token!');
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logTest('Sécurité: Protection routes authentifiées', 'pass', 'Accès refusé sans token');
    } else {
      logTest('Sécurité: Protection routes authentifiées', 'warn', `Code erreur inattendu: ${error.response?.status}`);
    }
  }
  
  return tokens;
}

// Tests Farmer
async function testFarmerFeatures(token) {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║                TESTS FONCTIONNALITÉS FARMER                ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');
  
  // Test récupération projets
  try {
    const response = await axios.get(`${API_BASE}/projects/farmer/my-projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const projects = response.data.data || [];
      logTest('GET /projects/farmer/my-projects', 'pass', `${projects.length} projet(s)`);
      
      // Analyser les projets
      if (projects.length > 0) {
        const project = projects[0];
        const requiredFields = ['id', 'title', 'description', 'budget_gyt', 'status'];
        const missingFields = requiredFields.filter(field => !(field in project));
        
        if (missingFields.length === 0) {
          logTest('Structure des projets', 'pass', 'Tous les champs requis présents');
        } else {
          logTest('Structure des projets', 'warn', `Champs manquants: ${missingFields.join(', ')}`);
        }
      }
    } else {
      logTest('GET /projects/farmer/my-projects', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /projects/farmer/my-projects', 'fail', error.message);
  }
  
  // Test création de projet (simulation)
  try {
    const newProject = {
      title: 'Test Project - Automated Testing',
      description: 'Projet de test automatisé pour validation complète des fonctionnalités de création de projet agricole avec description longue',
      budgetUsd: 5000,
      durationDays: 180,
      estimatedReturnPct: 15,
      location: 'Port-au-Prince, Haiti',
      latitude: 18.5944,
      longitude: -72.3074,
      category: 'crops',
      images: [],
      documents: []
    };
    
    const response = await axios.post(`${API_BASE}/projects`, newProject, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      logTest('POST /projects (Création)', 'pass', `Projet créé ID: ${response.data.data?.projectId || 'N/A'}`);
    } else {
      logTest('POST /projects (Création)', 'fail', 'Échec de création');
    }
  } catch (error) {
    if (error.response?.status === 400) {
      logTest('POST /projects (Création)', 'fail', 'Validation: ' + (error.response?.data?.message || 'Erreur validation'));
    } else {
      logTest('POST /projects (Création)', 'fail', error.message);
    }
  }
  
  // Test récupération produits
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const products = response.data.data || [];
      logTest('GET /products (Marketplace)', 'pass', `${products.length} produit(s) disponible(s)`);
    } else {
      logTest('GET /products (Marketplace)', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /products (Marketplace)', 'fail', error.message);
  }
  
  // Test récupération commandes
  try {
    const response = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const orders = response.data.data || [];
      logTest('GET /orders/my-orders', 'pass', `${orders.length} commande(s)`);
    } else {
      logTest('GET /orders/my-orders', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /orders/my-orders', 'fail', error.message);
  }
}

// Tests Investor
async function testInvestorFeatures(token) {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║              TESTS FONCTIONNALITÉS INVESTOR                ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');
  
  // Test récupération projets disponibles
  try {
    const response = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      // Gérer la pagination correctement
      const projects = response.data.data.projects || response.data.data || [];
      logTest('GET /projects (Liste publique)', 'pass', `${projects.length} projet(s)`);
      
      // Vérifier que les projets validated/active sont retournés
      if (Array.isArray(projects) && projects.length > 0) {
        const validStatuses = projects.filter(p => ['validated', 'active'].includes(p.status));
        if (validStatuses.length > 0) {
          logTest('Filtrage des projets', 'pass', `${validStatuses.length} projet(s) investissable(s)`);
        } else {
          logTest('Filtrage des projets', 'warn', 'Aucun projet avec statut validated/active');
        }
      } else {
        logTest('Filtrage des projets', 'warn', 'Aucun projet retourné');
      }
    } else {
      logTest('GET /projects (Liste publique)', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /projects (Liste publique)', 'fail', error.message);
  }
  
  // Test détails d'un projet
  try {
    // Récupérer un projet ID
    const projectsRes = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const projects = projectsRes.data.data.projects || projectsRes.data.data || [];
    
    if (Array.isArray(projects) && projects.length > 0) {
      const projectId = projects[0].id;
      
      const response = await axios.get(`${API_BASE}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        logTest(`GET /projects/${projectId} (Détails)`, 'pass', `Titre: ${response.data.data.title}`);
      } else {
        logTest(`GET /projects/${projectId} (Détails)`, 'fail', 'Réponse non successful');
      }
    } else {
      logTest('GET /projects/:id (Détails)', 'warn', 'Aucun projet disponible pour tester');
    }
  } catch (error) {
    logTest('GET /projects/:id (Détails)', 'fail', error.message);
  }
  
  // Test récupération investissements
  try {
    const response = await axios.get(`${API_BASE}/investments/my-investments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const investments = response.data.data || [];
      logTest('GET /investments/my-investments', 'pass', `${investments.length} investissement(s)`);
      
      if (investments.length > 0) {
        const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_gyt || 0), 0);
        log(`   Total investi: ${totalInvested.toFixed(2)} GYT`, 'cyan');
      }
    } else {
      logTest('GET /investments/my-investments', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /investments/my-investments', 'fail', error.message);
  }
  
  // Test statistiques
  try {
    const response = await axios.get(`${API_BASE}/investments/stats/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const stats = response.data.data;
      logTest('GET /investments/stats/overview', 'pass', 
        `Total: ${stats.totalInvested || 0} GYT, Projets: ${stats.projectCount || 0}`);
    } else {
      logTest('GET /investments/stats/overview', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /investments/stats/overview', 'fail', error.message);
  }
}

// Tests Consumer
async function testConsumerFeatures(token) {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║              TESTS FONCTIONNALITÉS CONSUMER                ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');
  
  // Test marketplace
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const products = response.data.data || [];
      logTest('GET /products (Marketplace)', 'pass', `${products.length} produit(s)`);
      
      if (products.length > 0) {
        const inStock = products.filter(p => p.stock > 0);
        logTest('Vérification stock', inStock.length > 0 ? 'pass' : 'warn', 
          `${inStock.length} produit(s) en stock`);
      }
    } else {
      logTest('GET /products (Marketplace)', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /products (Marketplace)', 'fail', error.message);
  }
  
  // Test commandes
  try {
    const response = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const orders = response.data.data || [];
      logTest('GET /orders/my-orders', 'pass', `${orders.length} commande(s)`);
    } else {
      logTest('GET /orders/my-orders', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /orders/my-orders', 'fail', error.message);
  }
  
  // Test favoris
  try {
    const response = await axios.get(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const favorites = response.data.data || [];
      logTest('GET /favorites', 'pass', `${favorites.length} favori(s)`);
    } else {
      logTest('GET /favorites', 'fail', 'Réponse non successful');
    }
  } catch (error) {
    logTest('GET /favorites', 'fail', error.response?.data?.message || error.message);
  }
}

// Tests Performance
async function testPerformance() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'magenta');
  log('║                   TESTS DE PERFORMANCE                     ║', 'magenta');
  log('╚════════════════════════════════════════════════════════════╝', 'magenta');
  
  // Test temps de réponse
  const endpoints = [
    { method: 'GET', url: `${API_BASE.replace('/api', '')}/health`, name: 'Health Check' },
    { method: 'POST', url: `${API_BASE}/auth/login`, name: 'Login', data: { email: 'investor1@agrikonbit.com', password: 'password123' } }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const start = Date.now();
      if (endpoint.method === 'GET') {
        await axios.get(endpoint.url);
      } else {
        await axios.post(endpoint.url, endpoint.data);
      }
      const duration = Date.now() - start;
      
      if (duration < 100) {
        logTest(`Performance: ${endpoint.name}`, 'pass', `${duration}ms (Excellent)`);
      } else if (duration < 500) {
        logTest(`Performance: ${endpoint.name}`, 'pass', `${duration}ms (Bon)`);
      } else if (duration < 1000) {
        logTest(`Performance: ${endpoint.name}`, 'warn', `${duration}ms (Acceptable)`);
      } else {
        logTest(`Performance: ${endpoint.name}`, 'fail', `${duration}ms (Trop lent)`);
      }
    } catch (error) {
      logTest(`Performance: ${endpoint.name}`, 'fail', error.message);
    }
  }
}

// Fonction principale
async function runProTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       🔬 TESTS PROFESSIONNELS COMPLETS - AGRIKONBIT       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Vérifier serveur
  try {
    await axios.get(`${API_BASE.replace('/api', '')}/health`);
    log('\n✅ Serveur backend accessible\n', 'green');
  } catch (error) {
    log('\n❌ Serveur backend inaccessible!\n', 'red');
    process.exit(1);
  }
  
  // Tests d'authentification
  const tokens = await testAuthentication();
  
  // Tests par rôle
  if (tokens.farmer) {
    await testFarmerFeatures(tokens.farmer);
  }
  
  if (tokens.investor) {
    await testInvestorFeatures(tokens.investor);
  }
  
  if (tokens.consumer) {
    await testConsumerFeatures(tokens.consumer);
  }
  
  // Tests de performance
  await testPerformance();
  
  // Résumé
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    RÉSUMÉ DES TESTS                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\nTotal des tests : ${testResults.total}`, 'cyan');
  log(`✅ Tests réussis : ${testResults.passed}`, 'green');
  log(`⚠️  Avertissements : ${testResults.warnings}`, 'yellow');
  log(`❌ Tests échoués : ${testResults.failed}`, 'red');
  
  const successRate = Math.round((testResults.passed / testResults.total) * 100);
  log(`\n📊 Taux de réussite : ${successRate}%\n`, successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red');
  
  // Rapport des problèmes
  if (testResults.issues.length > 0) {
    log('\n╔════════════════════════════════════════════════════════════╗', 'red');
    log('║                  PROBLÈMES IDENTIFIÉS                      ║', 'red');
    log('╚════════════════════════════════════════════════════════════╝', 'red');
    
    testResults.issues.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.test}`, 'yellow');
      log(`   ${issue.issue}`, 'red');
    });
  }
  
  if (testResults.failed === 0 && testResults.warnings === 0) {
    log('\n🎉 Tous les tests sont passés sans avertissement!\n', 'green');
  } else if (testResults.failed === 0) {
    log('\n✅ Tous les tests sont passés (avec quelques avertissements)\n', 'green');
  } else {
    log('\n⚠️  Des problèmes nécessitent une attention\n', 'yellow');
  }
}

runProTests().catch(error => {
  log('\n❌ Erreur fatale lors de l\'exécution des tests:', 'red');
  console.error(error);
  process.exit(1);
});
