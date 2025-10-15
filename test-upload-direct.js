const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🔍 TEST DIRECT - UPLOAD DE PHOTO                    ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

async function testUpload() {
  try {
    // 1. Créer une image de test
    console.log('📝 1. Création d\'une image de test...\n');
    
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    // Créer un petit fichier image de test (1x1 pixel JPEG)
    const jpegData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
      0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
      0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4,
      0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08,
      0x01, 0x01, 0x00, 0x00, 0x3F, 0x00, 0x7F, 0xFF,
      0xD9
    ]);
    
    fs.writeFileSync(testImagePath, jpegData);
    console.log(`   ✅ Image de test créée: ${testImagePath}`);
    console.log(`   ℹ️  Taille: ${jpegData.length} bytes\n`);

    // 2. Tester sans authentification d'abord
    console.log('🔓 2. Test SANS authentification (devrait échouer)...\n');
    
    try {
      const formData = new FormData();
      formData.append('profileImage', fs.createReadStream(testImagePath));

      const response = await axios.post(
        'http://localhost:3001/api/users/profile/image',
        formData,
        {
          headers: formData.getHeaders()
        }
      );
      
      console.log('   ⚠️  Réponse reçue (ne devrait pas arriver ici):', response.data);
    } catch (error) {
      if (error.response) {
        console.log(`   ✅ Erreur attendue: ${error.response.status} ${error.response.statusText}`);
        console.log(`   ℹ️  Message: ${error.response.data?.message || 'Pas de message'}\n`);
      } else {
        console.log('   ❌ Erreur réseau:', error.message, '\n');
      }
    }

    // 3. Demander le token ou utiliser un token de test
    console.log('🔑 3. Pour tester AVEC authentification:\n');
    console.log('   Vous devez fournir un token JWT valide.');
    console.log('   Comment obtenir le token:\n');
    console.log('   1. Ouvrir http://localhost:3000/profile');
    console.log('   2. Appuyer sur F12 > Application > Local Storage');
    console.log('   3. Copier la valeur de "token"\n');
    console.log('   Puis exécuter:');
    console.log('   node test-upload-with-token.js <votre-token>\n');

    // 4. Vérifier que multer est installé
    console.log('📦 4. Vérification de Multer...\n');
    try {
      const multerPath = require.resolve('multer', { paths: [path.join(__dirname, 'server')] });
      console.log('   ✅ Multer trouvé:', multerPath, '\n');
    } catch (err) {
      console.log('   ❌ Multer non trouvé dans server/');
      console.log('   Solution: cd server && npm install multer\n');
    }

    // 5. Vérifier la route dans users.js
    console.log('📄 5. Vérification de la route backend...\n');
    const usersRoutePath = path.join(__dirname, 'server', 'routes', 'users.js');
    const content = fs.readFileSync(usersRoutePath, 'utf8');
    
    if (content.includes("upload.single('profileImage')")) {
      console.log('   ✅ Route configurée avec upload.single(\'profileImage\')\n');
    } else {
      console.log('   ❌ Configuration Multer incorrecte\n');
    }

    // 6. Nettoyer
    fs.unlinkSync(testImagePath);
    console.log('🧹 6. Nettoyage terminé\n');

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     📝 PROCHAINES ÉTAPES                                 ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
    
    console.log('Pour débugger l\'upload qui ne fonctionne pas:\n');
    console.log('1. Ouvrir http://localhost:3000/profile');
    console.log('2. Appuyer sur F12 > Console');
    console.log('3. Essayer d\'uploader une photo');
    console.log('4. Copier EXACTEMENT l\'erreur affichée dans la console');
    console.log('5. Regarder le terminal backend pour voir les logs\n');
    
    console.log('Questions à répondre:');
    console.log('- Quel est le code d\'erreur? (400, 401, 500?)');
    console.log('- Quel est le message d\'erreur exact?');
    console.log('- Le terminal backend affiche-t-il quelque chose?\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testUpload();
