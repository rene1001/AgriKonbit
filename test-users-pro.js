/**
 * Script de test automatisé pour les utilisateurs professionnels
 * Teste les fonctionnalités clés de chaque rôle (Farmer, Investor, Consumer)
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Codes couleur pour l'affichage
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Identifiants de test
const users = {
  farmer: {
    email: 'farmer1@agrikonbit.com',
    password: 'password123',
    role: 'farmer'
  },
  investor: {
    email: 'investor1@agrikonbit.com',
    password: 'password123',
    role: 'investor'
  },
  consumer: {
    email: 'consumer1@agrikonbit.com',
    password: 'password123',
    role: 'consumer'
  }
};

let testResults = {
  total: 0,
  passed: 0,
  failed: 0
};

// Fonction utilitaire pour les logs
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, success, details = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    log(`✅ ${testName}`, 'green');
    if (details) log(`   ${details}`, 'cyan');
  } else {
    testResults.failed++;
    log(`❌ ${testName}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
}

// Fonction de test de connexion
async function testLogin(userType) {
  const user = users[userType];
  log(`\n━━━ Test de connexion ${userType.toUpperCase()} ━━━`, 'blue');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: user.email,
      password: user.password
    });
    
    if (response.data.success && response.data.data.token) {
      logTest(`Connexion ${userType}`, true, `Token reçu, rôle: ${response.data.data.user.role}`);
      return response.data.data.token;
    } else {
      logTest(`Connexion ${userType}`, false, 'Token manquant dans la réponse');
      return null;
    }
  } catch (error) {
    logTest(`Connexion ${userType}`, false, error.response?.data?.message || error.message);
    return null;
  }
}

// Fonction de test du profil utilisateur
async function testGetProfile(userType, token) {
  log(`\n━━━ Test du profil ${userType.toUpperCase()} ━━━`, 'blue');
  
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.user) {
      const user = response.data.data.user;
      logTest(`Récupération profil ${userType}`, true, 
        `Email: ${user.email}, Rôle: ${user.role}, GYT: ${user.gytBalance}`);
      return user;
    } else {
      logTest(`Récupération profil ${userType}`, false, 'Données utilisateur manquantes');
      return null;
    }
  } catch (error) {
    logTest(`Récupération profil ${userType}`, false, error.response?.data?.message || error.message);
    return null;
  }
}

// Tests spécifiques FARMER
async function testFarmerFeatures(token) {
  log(`\n━━━ Tests des fonctionnalités FARMER ━━━`, 'blue');
  
  // Test: Récupérer mes projets
  try {
    const response = await axios.get(`${API_BASE}/projects/farmer/my-projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const projects = response.data.data || [];
      logTest('Récupération des projets du farmer', true, `${projects.length} projet(s) trouvé(s)`);
    } else {
      logTest('Récupération des projets du farmer', false);
    }
  } catch (error) {
    logTest('Récupération des projets du farmer', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer mes produits
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const products = response.data.data || [];
      logTest('Récupération des produits du marketplace', true, `${products.length} produit(s) disponible(s)`);
    } else {
      logTest('Récupération des produits du marketplace', false);
    }
  } catch (error) {
    logTest('Récupération des produits du marketplace', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer les commandes (vendeur)
  try {
    const response = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const orders = response.data.data || [];
      logTest('Récupération des commandes reçues', true, `${orders.length} commande(s) reçue(s)`);
    } else {
      logTest('Récupération des commandes reçues', false);
    }
  } catch (error) {
    logTest('Récupération des commandes reçues', false, error.response?.data?.message || error.message);
  }
  
  // Test: Vérifier le portefeuille
  try {
    const response = await axios.get(`${API_BASE}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const balance = response.data.data.balance;
      logTest('Consultation du portefeuille GYT', true, `Solde: ${balance} GYT`);
    } else {
      logTest('Consultation du portefeuille GYT', false);
    }
  } catch (error) {
    logTest('Consultation du portefeuille GYT', false, error.response?.data?.message || error.message);
  }
}

// Tests spécifiques INVESTOR
async function testInvestorFeatures(token) {
  log(`\n━━━ Tests des fonctionnalités INVESTOR ━━━`, 'blue');
  
  // Test: Récupérer les projets disponibles
  try {
    const response = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const projects = response.data.data || [];
      logTest('Récupération des projets disponibles', true, `${projects.length} projet(s) disponible(s)`);
    } else {
      logTest('Récupération des projets disponibles', false);
    }
  } catch (error) {
    logTest('Récupération des projets disponibles', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer mes investissements
  try {
    const response = await axios.get(`${API_BASE}/investments/my-investments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const investments = response.data.data || [];
      logTest('Récupération de mes investissements', true, `${investments.length} investissement(s) effectué(s)`);
    } else {
      logTest('Récupération de mes investissements', false);
    }
  } catch (error) {
    logTest('Récupération de mes investissements', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer les statistiques d'investissement
  try {
    const response = await axios.get(`${API_BASE}/investments/stats/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const stats = response.data.data;
      logTest('Statistiques d\'investissement', true, 
        `Total investi: ${stats.totalInvested || 0} GYT, Projets: ${stats.projectCount || 0}`);
    } else {
      logTest('Statistiques d\'investissement', false);
    }
  } catch (error) {
    logTest('Statistiques d\'investissement', false, error.response?.data?.message || error.message);
  }
  
  // Test: Vérifier le portefeuille
  try {
    const response = await axios.get(`${API_BASE}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const balance = response.data.data.balance;
      logTest('Consultation du portefeuille GYT', true, `Solde: ${balance} GYT`);
    } else {
      logTest('Consultation du portefeuille GYT', false);
    }
  } catch (error) {
    logTest('Consultation du portefeuille GYT', false, error.response?.data?.message || error.message);
  }
}

// Tests spécifiques CONSUMER
async function testConsumerFeatures(token) {
  log(`\n━━━ Tests des fonctionnalités CONSUMER ━━━`, 'blue');
  
  // Test: Récupérer les produits du marketplace
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const products = response.data.data || [];
      logTest('Récupération des produits marketplace', true, `${products.length} produit(s) disponible(s)`);
    } else {
      logTest('Récupération des produits marketplace', false);
    }
  } catch (error) {
    logTest('Récupération des produits marketplace', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer mes commandes
  try {
    const response = await axios.get(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const orders = response.data.data || [];
      logTest('Récupération de mes commandes', true, `${orders.length} commande(s) passée(s)`);
    } else {
      logTest('Récupération de mes commandes', false);
    }
  } catch (error) {
    logTest('Récupération de mes commandes', false, error.response?.data?.message || error.message);
  }
  
  // Test: Vérifier le portefeuille
  try {
    const response = await axios.get(`${API_BASE}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const balance = response.data.data.balance;
      logTest('Consultation du portefeuille GYT', true, `Solde: ${balance} GYT`);
    } else {
      logTest('Consultation du portefeuille GYT', false);
    }
  } catch (error) {
    logTest('Consultation du portefeuille GYT', false, error.response?.data?.message || error.message);
  }
  
  // Test: Récupérer les favoris
  try {
    const response = await axios.get(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const favorites = response.data.data || [];
      logTest('Récupération des favoris', true, `${favorites.length} favori(s)`);
    } else {
      logTest('Récupération des favoris', false);
    }
  } catch (error) {
    logTest('Récupération des favoris', false, error.response?.data?.message || error.message);
  }
}

// Test des notifications (commun à tous)
async function testNotifications(userType, token) {
  log(`\n━━━ Test des notifications ${userType.toUpperCase()} ━━━`, 'blue');
  
  try {
    const response = await axios.get(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      const notifications = response.data.data || [];
      logTest(`Récupération des notifications ${userType}`, true, `${notifications.length} notification(s)`);
    } else {
      logTest(`Récupération des notifications ${userType}`, false);
    }
  } catch (error) {
    logTest(`Récupération des notifications ${userType}`, false, error.response?.data?.message || error.message);
  }
}

// Fonction principale
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🧪 TEST DES UTILISATEURS PROFESSIONNELS AGRIKONBIT 🧪   ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Vérifier que le serveur est accessible
  try {
    await axios.get(`${API_BASE.replace('/api', '')}/health`);
    log('\n✅ Serveur backend accessible\n', 'green');
  } catch (error) {
    log('\n❌ Serveur backend inaccessible! Vérifiez que le serveur tourne sur le port 3001\n', 'red');
    process.exit(1);
  }
  
  // ========== Tests FARMER ==========
  log('\n╔════════════════════════════════════════════════════════════╗', 'yellow');
  log('║                      TESTS FARMER                          ║', 'yellow');
  log('╚════════════════════════════════════════════════════════════╝', 'yellow');
  
  const farmerToken = await testLogin('farmer');
  if (farmerToken) {
    await testGetProfile('farmer', farmerToken);
    await testFarmerFeatures(farmerToken);
    await testNotifications('farmer', farmerToken);
  }
  
  // ========== Tests INVESTOR ==========
  log('\n╔════════════════════════════════════════════════════════════╗', 'yellow');
  log('║                     TESTS INVESTOR                         ║', 'yellow');
  log('╚════════════════════════════════════════════════════════════╝', 'yellow');
  
  const investorToken = await testLogin('investor');
  if (investorToken) {
    await testGetProfile('investor', investorToken);
    await testInvestorFeatures(investorToken);
    await testNotifications('investor', investorToken);
  }
  
  // ========== Tests CONSUMER ==========
  log('\n╔════════════════════════════════════════════════════════════╗', 'yellow');
  log('║                     TESTS CONSUMER                         ║', 'yellow');
  log('╚════════════════════════════════════════════════════════════╝', 'yellow');
  
  const consumerToken = await testLogin('consumer');
  if (consumerToken) {
    await testGetProfile('consumer', consumerToken);
    await testConsumerFeatures(consumerToken);
    await testNotifications('consumer', consumerToken);
  }
  
  // ========== Résumé des tests ==========
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                     RÉSUMÉ DES TESTS                       ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  log(`\nTotal des tests : ${testResults.total}`, 'cyan');
  log(`✅ Tests réussis : ${testResults.passed}`, 'green');
  log(`❌ Tests échoués : ${testResults.failed}`, 'red');
  
  const successRate = Math.round((testResults.passed / testResults.total) * 100);
  log(`\n📊 Taux de réussite : ${successRate}%`, successRate === 100 ? 'green' : 'yellow');
  
  if (testResults.failed === 0) {
    log('\n🎉 Tous les tests sont passés avec succès!', 'green');
    log('👉 Vous pouvez maintenant tester manuellement sur http://localhost:3000\n', 'cyan');
  } else {
    log('\n⚠️  Certains tests ont échoué. Vérifiez les détails ci-dessus.\n', 'yellow');
  }
}

// Lancer les tests
runTests().catch(error => {
  log('\n❌ Erreur lors de l\'exécution des tests:', 'red');
  console.error(error);
  process.exit(1);
});
