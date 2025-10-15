const fs = require('fs');
const path = require('path');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🔍 DIAGNOSTIC - PROBLÈME D\'UPLOAD D\'IMAGE           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// 1. Vérifier le dossier uploads
console.log('📁 Vérification du dossier uploads...\n');

const uploadsRoot = path.join(__dirname, 'uploads');
const uploadsProfiles = path.join(__dirname, 'uploads', 'profiles');

if (!fs.existsSync(uploadsRoot)) {
  console.log('❌ Le dossier uploads/ n\'existe pas');
  console.log('   Création du dossier...');
  fs.mkdirSync(uploadsRoot, { recursive: true });
  console.log('   ✅ Dossier uploads/ créé\n');
} else {
  console.log('✅ Le dossier uploads/ existe\n');
}

if (!fs.existsSync(uploadsProfiles)) {
  console.log('❌ Le dossier uploads/profiles/ n\'existe pas');
  console.log('   Création du dossier...');
  fs.mkdirSync(uploadsProfiles, { recursive: true });
  console.log('   ✅ Dossier uploads/profiles/ créé\n');
} else {
  console.log('✅ Le dossier uploads/profiles/ existe\n');
}

// 2. Vérifier les permissions
console.log('🔐 Vérification des permissions...\n');

try {
  const testFile = path.join(uploadsProfiles, 'test-write.txt');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Permissions d\'écriture OK\n');
} catch (err) {
  console.log('❌ Problème de permissions d\'écriture');
  console.log('   Erreur:', err.message);
  console.log('   Solution: Vérifier les permissions du dossier uploads/\n');
}

// 3. Vérifier la route dans users.js
console.log('📄 Vérification de la route dans server/routes/users.js...\n');

const usersRoutePath = path.join(__dirname, 'server', 'routes', 'users.js');

if (fs.existsSync(usersRoutePath)) {
  const content = fs.readFileSync(usersRoutePath, 'utf8');
  
  const hasMulter = content.includes('multer');
  const hasUploadRoute = content.includes('POST /profile/image') || content.includes("router.post('/profile/image'");
  const hasDeleteRoute = content.includes('DELETE /profile/image') || content.includes("router.delete('/profile/image'");
  
  console.log(`   ${hasMulter ? '✅' : '❌'} Multer importé`);
  console.log(`   ${hasUploadRoute ? '✅' : '❌'} Route POST /profile/image`);
  console.log(`   ${hasDeleteRoute ? '✅' : '❌'} Route DELETE /profile/image`);
  
  if (!hasMulter || !hasUploadRoute || !hasDeleteRoute) {
    console.log('\n⚠️  Le fichier users.js semble incomplet');
    console.log('   Le serveur doit être redémarré après modification\n');
  } else {
    console.log('\n✅ Le fichier users.js contient toutes les routes\n');
  }
} else {
  console.log('❌ Le fichier server/routes/users.js n\'existe pas\n');
}

// 4. Vérifier que multer est installé
console.log('📦 Vérification de Multer...\n');

try {
  require.resolve('multer');
  console.log('✅ Multer est installé\n');
} catch (err) {
  console.log('❌ Multer n\'est pas installé');
  console.log('   Solution: cd server && npm install multer\n');
}

// 5. Instructions de redémarrage
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     🔧 SOLUTIONS RECOMMANDÉES                            ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('1. REDÉMARRER LE SERVEUR BACKEND (IMPORTANT !)');
console.log('   cd server');
console.log('   Ctrl+C (pour arrêter)');
console.log('   npm start\n');

console.log('2. Vérifier l\'URL de l\'API dans la console du navigateur');
console.log('   Ouvrir F12 > Console > Regarder l\'erreur exacte\n');

console.log('3. Vérifier que le serveur tourne sur le bon port');
console.log('   Backend devrait être sur: http://localhost:3000\n');

console.log('4. Tester l\'upload avec la console ouverte (F12)');
console.log('   Regarder l\'onglet Network pour voir la requête\n');

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║     📝 COMMANDES À EXÉCUTER                              ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('# Terminal 1 - Backend');
console.log('cd server');
console.log('npm start\n');

console.log('# Terminal 2 - Frontend');
console.log('cd client');
console.log('npm start\n');

console.log('# Ensuite:');
console.log('1. Ouvrir http://localhost:3000/profile');
console.log('2. Ouvrir F12 (console développeur)');
console.log('3. Essayer d\'uploader une image');
console.log('4. Regarder les erreurs dans la console\n');

console.log('✅ Diagnostic terminé\n');
