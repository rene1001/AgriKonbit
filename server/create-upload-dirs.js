const fs = require('fs');
const path = require('path');

// Dossiers à créer
const uploadDirs = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../uploads/documents'),
  path.join(__dirname, '../uploads/project_images'),
  path.join(__dirname, '../uploads/product_images'),
  path.join(__dirname, '../uploads/profile_pictures'),
  path.join(__dirname, '../uploads/temp')
];

console.log('🗂️  Création des dossiers d\'upload...\n');

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Créé: ${dir}`);
  } else {
    console.log(`⏭️  Existe déjà: ${dir}`);
  }
});

console.log('\n🎉 Tous les dossiers d\'upload sont prêts!');
