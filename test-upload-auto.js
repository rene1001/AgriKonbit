const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║     🧪 TEST AUTOMATIQUE - UPLOAD PHOTO                  ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

async function testUpload() {
  try {
    // 1. Créer une image de test
    console.log('📝 1. Création d\'une image de test...\n');
    
    const testImagePath = path.join(__dirname, 'test-photo-auto.jpg');
    
    // Créer un JPEG valide (1x1 pixel)
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
    console.log(`   ✅ Image créée: ${testImagePath}`);
    console.log(`   ℹ️  Taille: ${jpegData.length} bytes (JPEG 1x1 pixel)\n`);

    // 2. Obtenir un token valide depuis la base de données
    console.log('🔑 2. Obtention d\'un token de test...\n');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'agrikonbit'
    });

    const [users] = await connection.query('SELECT id, email FROM users LIMIT 1');
    
    if (users.length === 0) {
      console.log('   ❌ Aucun utilisateur en base\n');
      await connection.end();
      fs.unlinkSync(testImagePath);
      return;
    }

    const user = users[0];
    console.log(`   ✅ Utilisateur trouvé: ${user.email} (ID: ${user.id})\n`);

    // Générer un token JWT simple
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '1h' }
    );

    console.log(`   ✅ Token généré (longueur: ${token.length})\n`);

    await connection.end();

    // 3. Tester l'upload
    console.log('📤 3. Test de l\'upload...\n');

    const formData = new FormData();
    formData.append('profileImage', fs.createReadStream(testImagePath), {
      filename: 'test-photo-auto.jpg',
      contentType: 'image/jpeg'
    });

    console.log('   📦 FormData préparé:');
    console.log('      - Champ: profileImage');
    console.log('      - Fichier: test-photo-auto.jpg');
    console.log('      - Type: image/jpeg');
    console.log('      - Taille:', jpegData.length, 'bytes\n');

    console.log('   🚀 Envoi vers http://localhost:3001/api/users/profile/image...\n');

    try {
      const response = await axios.post(
        'http://localhost:3001/api/users/profile/image',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${token}`
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║     ✅ SUCCÈS !                                          ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');
      
      console.log('📊 Réponse du serveur:\n');
      console.log('   Status:', response.status);
      console.log('   Data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.data?.profile_image) {
        console.log('\n   ✅ Image uploadée:', response.data.data.profile_image);
        console.log('   🌐 URL complète: http://localhost:3001' + response.data.data.profile_image);
      }

      console.log('\n╔═══════════════════════════════════════════════════════════╗');
      console.log('║     🎉 L\'UPLOAD FONCTIONNE !                            ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');

    } catch (error) {
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║     ❌ ERREUR                                            ║');
      console.log('╚═══════════════════════════════════════════════════════════╝\n');

      if (error.response) {
        console.log('📊 Réponse du serveur:\n');
        console.log('   Status:', error.response.status);
        console.log('   Status Text:', error.response.statusText);
        console.log('   Data:', JSON.stringify(error.response.data, null, 2));
        console.log('   Headers:', error.response.headers);
        
        console.log('\n🔍 DIAGNOSTIC:\n');
        
        if (error.response.status === 400) {
          console.log('   ❌ Erreur 400 - Bad Request');
          console.log('   Message:', error.response.data?.message || 'Aucun message');
          console.log('\n   Causes possibles:');
          console.log('   - Le fichier n\'arrive pas à Multer');
          console.log('   - Content-Type incorrect');
          console.log('   - Nom du champ FormData incorrect\n');
        } else if (error.response.status === 401) {
          console.log('   ❌ Erreur 401 - Non autorisé');
          console.log('   Le token JWT est invalide ou expiré\n');
        } else if (error.response.status === 500) {
          console.log('   ❌ Erreur 500 - Erreur serveur');
          console.log('   Problème dans le traitement backend\n');
        }
      } else if (error.request) {
        console.log('   ❌ Aucune réponse du serveur');
        console.log('   Le backend ne répond pas sur http://localhost:3001\n');
        console.log('   Vérifiez que le backend est démarré:\n');
        console.log('   cd server && npm start\n');
      } else {
        console.log('   ❌ Erreur:', error.message, '\n');
      }
    }

    // 4. Nettoyage
    console.log('🧹 4. Nettoyage...\n');
    fs.unlinkSync(testImagePath);
    console.log('   ✅ Image de test supprimée\n');

  } catch (error) {
    console.error('❌ Erreur fatale:', error.message);
    console.error(error);
  }
}

console.log('⏳ Démarrage du test...\n');
testUpload().then(() => {
  console.log('✅ Test terminé\n');
}).catch(err => {
  console.error('❌ Erreur:', err);
});
