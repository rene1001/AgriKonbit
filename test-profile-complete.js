const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const http = require('http');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testHttp(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    });

    req.on('error', (err) => {
      resolve({ status: 0, ok: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, ok: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function verifyProfile() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  log('║        🔍 VÉRIFICATION COMPLÈTE - PROFIL & UPLOAD       ║', 'cyan');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  let allGood = true;

  // ==========================================
  // 1. VÉRIFIER LA BASE DE DONNÉES
  // ==========================================
  log('📊 1. VÉRIFICATION BASE DE DONNÉES', 'blue');
  console.log('─'.repeat(60) + '\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    log('   ✅ Connexion à la base de données réussie', 'green');

    // Vérifier les colonnes
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('bio', 'theme_preference', 'profile_image')
    `, [process.env.DB_NAME || 'agrikonbit']);

    const columnMap = {};
    columns.forEach(col => {
      columnMap[col.COLUMN_NAME] = col;
    });

    if (columnMap['bio']) {
      log('   ✅ Colonne bio existe', 'green');
    } else {
      log('   ❌ Colonne bio manquante', 'red');
      allGood = false;
    }

    if (columnMap['theme_preference']) {
      log('   ✅ Colonne theme_preference existe', 'green');
    } else {
      log('   ❌ Colonne theme_preference manquante', 'red');
      allGood = false;
    }

    if (columnMap['profile_image']) {
      log('   ✅ Colonne profile_image existe', 'green');
    } else {
      log('   ❌ Colonne profile_image manquante', 'red');
      allGood = false;
    }

    // Tester la requête profile
    const [users] = await connection.query(`
      SELECT 
        u.id, u.email, u.full_name,
        COALESCE(u.bio, '') as bio,
        COALESCE(u.theme_preference, 'light') as theme_preference,
        u.profile_image,
        COALESCE(uw.gyt_balance, 0) as gyt_balance
      FROM users u
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      LIMIT 1
    `);

    if (users.length > 0) {
      log('   ✅ Requête profile fonctionne', 'green');
      log(`   ℹ️  User test: ${users[0].email}`, 'cyan');
    } else {
      log('   ⚠️  Aucun utilisateur en base', 'yellow');
    }

    await connection.end();

  } catch (error) {
    log('   ❌ Erreur base de données: ' + error.message, 'red');
    allGood = false;
  }

  console.log('');

  // ==========================================
  // 2. VÉRIFIER LES DOSSIERS
  // ==========================================
  log('📁 2. VÉRIFICATION DOSSIERS', 'blue');
  console.log('─'.repeat(60) + '\n');

  const uploadsDir = path.join(__dirname, 'uploads');
  const profilesDir = path.join(__dirname, 'uploads', 'profiles');

  if (fs.existsSync(uploadsDir)) {
    log('   ✅ Dossier uploads/ existe', 'green');
  } else {
    log('   ❌ Dossier uploads/ manquant', 'red');
    allGood = false;
  }

  if (fs.existsSync(profilesDir)) {
    log('   ✅ Dossier uploads/profiles/ existe', 'green');
    
    // Compter les fichiers
    const files = fs.readdirSync(profilesDir);
    log(`   ℹ️  ${files.length} fichier(s) dans uploads/profiles/`, 'cyan');
  } else {
    log('   ❌ Dossier uploads/profiles/ manquant', 'red');
    allGood = false;
  }

  // Vérifier les permissions
  try {
    const testFile = path.join(profilesDir, '.test-write');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    log('   ✅ Permissions d\'écriture OK', 'green');
  } catch (err) {
    log('   ❌ Pas de permissions d\'écriture: ' + err.message, 'red');
    allGood = false;
  }

  console.log('');

  // ==========================================
  // 3. VÉRIFIER LE BACKEND
  // ==========================================
  log('🚀 3. VÉRIFICATION BACKEND', 'blue');
  console.log('─'.repeat(60) + '\n');

  // Tester port 3001
  const health3001 = await testHttp('http://localhost:3001/health');
  if (health3001.ok) {
    log('   ✅ Backend répond sur port 3001', 'green');
  } else {
    log('   ❌ Backend ne répond pas sur port 3001', 'red');
    allGood = false;
  }

  // Tester port 3000 (au cas où)
  const health3000 = await testHttp('http://localhost:3000/health');
  if (health3000.ok) {
    log('   ℹ️  Backend répond aussi sur port 3000', 'cyan');
  }

  // Vérifier que les fichiers routes existent
  const usersRoutePath = path.join(__dirname, 'server', 'routes', 'users.js');
  if (fs.existsSync(usersRoutePath)) {
    log('   ✅ Fichier server/routes/users.js existe', 'green');
    
    const content = fs.readFileSync(usersRoutePath, 'utf8');
    
    // Vérifier les routes importantes
    if (content.includes("router.get('/profile'")) {
      log('   ✅ Route GET /profile existe', 'green');
    } else {
      log('   ❌ Route GET /profile manquante', 'red');
      allGood = false;
    }

    if (content.includes("router.post('/profile/image'")) {
      log('   ✅ Route POST /profile/image existe', 'green');
    } else {
      log('   ❌ Route POST /profile/image manquante', 'red');
      allGood = false;
    }

    if (content.includes("router.delete('/profile/image'")) {
      log('   ✅ Route DELETE /profile/image existe', 'green');
    } else {
      log('   ❌ Route DELETE /profile/image manquante', 'red');
      allGood = false;
    }

    if (content.includes('COALESCE')) {
      log('   ✅ COALESCE utilisé (gestion NULL)', 'green');
    } else {
      log('   ⚠️  COALESCE pas trouvé (risque erreur 500)', 'yellow');
    }

    if (content.includes('multer')) {
      log('   ✅ Multer importé', 'green');
    } else {
      log('   ❌ Multer non importé', 'red');
      allGood = false;
    }
  } else {
    log('   ❌ Fichier server/routes/users.js manquant', 'red');
    allGood = false;
  }

  console.log('');

  // ==========================================
  // 4. VÉRIFIER LE FRONTEND
  // ==========================================
  log('💻 4. VÉRIFICATION FRONTEND', 'blue');
  console.log('─'.repeat(60) + '\n');

  const profilePath = path.join(__dirname, 'client', 'src', 'pages', 'Profile.js');
  if (fs.existsSync(profilePath)) {
    log('   ✅ Fichier client/src/pages/Profile.js existe', 'green');
    
    const content = fs.readFileSync(profilePath, 'utf8');
    
    if (content.includes('handleImageUpload')) {
      log('   ✅ Fonction handleImageUpload existe', 'green');
    } else {
      log('   ❌ Fonction handleImageUpload manquante', 'red');
      allGood = false;
    }

    if (content.includes('setProfile')) {
      log('   ✅ Mise à jour d\'état (setProfile) présente', 'green');
    } else {
      log('   ⚠️  setProfile non trouvé', 'yellow');
    }

    if (content.includes('localhost:3001') || content.includes('REACT_APP_API_URL')) {
      log('   ✅ URL backend correcte (port 3001)', 'green');
    } else if (content.includes('localhost:3000')) {
      log('   ⚠️  URL utilise port 3000 (devrait être 3001)', 'yellow');
    }

    if (content.includes('?t=') || content.includes('Date.now()')) {
      log('   ✅ Cache busting implémenté', 'green');
    } else {
      log('   ⚠️  Pas de cache busting (risque de cache)', 'yellow');
    }
  } else {
    log('   ❌ Fichier client/src/pages/Profile.js manquant', 'red');
    allGood = false;
  }

  // Vérifier le ThemeContext
  const themeContextPath = path.join(__dirname, 'client', 'src', 'contexts', 'ThemeContext.js');
  if (fs.existsSync(themeContextPath)) {
    log('   ✅ ThemeContext existe', 'green');
  } else {
    log('   ⚠️  ThemeContext manquant', 'yellow');
  }

  console.log('');

  // ==========================================
  // 5. VÉRIFIER LES PROCESSUS
  // ==========================================
  log('⚙️  5. VÉRIFICATION PROCESSUS', 'blue');
  console.log('─'.repeat(60) + '\n');

  const { exec } = require('child_process');
  
  exec('netstat -ano | findstr :3001', (err, stdout) => {
    if (stdout) {
      log('   ✅ Port 3001 en écoute (backend)', 'green');
    } else {
      log('   ⚠️  Port 3001 pas en écoute', 'yellow');
    }
  });

  exec('netstat -ano | findstr :3000', (err, stdout) => {
    if (stdout) {
      log('   ✅ Port 3000 en écoute (frontend)', 'green');
    } else {
      log('   ⚠️  Port 3000 pas en écoute', 'yellow');
    }
  });

  console.log('');

  // ==========================================
  // RÉSUMÉ
  // ==========================================
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  if (allGood) {
    log('║              ✅ TOUS LES TESTS SONT PASSÉS !            ║', 'green');
  } else {
    log('║              ⚠️  QUELQUES PROBLÈMES DÉTECTÉS            ║', 'yellow');
  }
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  // ==========================================
  // INSTRUCTIONS
  // ==========================================
  log('📝 PROCHAINES ÉTAPES:', 'cyan');
  console.log('');

  if (allGood) {
    console.log('1. ✅ Tous les systèmes sont opérationnels');
    console.log('2. 🌐 Ouvrir http://localhost:3000/profile');
    console.log('3. 📸 Tester l\'upload de photo');
    console.log('4. ✨ Profiter des fonctionnalités !');
  } else {
    console.log('1. 🔧 Corriger les problèmes détectés ci-dessus');
    console.log('2. 🔄 Redémarrer les serveurs si nécessaire:');
    console.log('   - Backend: cd server && npm start');
    console.log('   - Frontend: cd client && npm start');
    console.log('3. 🔁 Relancer ce script: node test-profile-complete.js');
  }

  console.log('');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  console.log('');
}

verifyProfile().catch(console.error);
