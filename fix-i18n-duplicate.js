/**
 * Script pour supprimer le doublon de la section EN dans i18n.js
 * 
 * Problème : Il y a 2 sections "en:" dans le fichier
 * - Ligne 5 : Section complète avec profile (À GARDER)
 * - Ligne 1042 : Section doublon sans profile (À SUPPRIMER)
 */

const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'client', 'src', 'i18n.js');

console.log('🔍 Lecture du fichier i18n.js...\n');

// Lire le fichier
let content = fs.readFileSync(i18nPath, 'utf8');
const lines = content.split('\n');

console.log(`📊 Fichier original : ${lines.length} lignes\n`);

// Trouver toutes les occurrences de "  en: {"
const enSections = [];
lines.forEach((line, index) => {
  if (line.trim() === 'en: {') {
    enSections.push(index + 1); // +1 pour numérotation humaine
  }
});

console.log(`🔎 Sections "en:" trouvées : ${enSections.length}`);
enSections.forEach((lineNum, i) => {
  console.log(`   ${i + 1}. Ligne ${lineNum}`);
});

if (enSections.length !== 2) {
  console.log('\n⚠️  ATTENTION : Nombre de sections EN inattendu !');
  console.log('   Vérification manuelle recommandée.');
  process.exit(1);
}

console.log('\n✂️  Suppression de la deuxième section EN (doublon)...\n');

// La deuxième section EN commence à la ligne 1042 (index 1041)
// Elle se termine à la ligne 1394 (index 1393)
// On supprime de 1041 à 1393 inclus

const startDelete = 1041; // Ligne 1042 en index 0
const endDelete = 1393;   // Ligne 1394 en index 0

// Créer le nouveau contenu sans les lignes du doublon
const newLines = [
  ...lines.slice(0, startDelete),
  ...lines.slice(endDelete + 1)
];

const newContent = newLines.join('\n');

console.log(`📊 Nouveau fichier : ${newLines.length} lignes`);
console.log(`✅ ${endDelete - startDelete + 1} lignes supprimées\n`);

// Sauvegarder une copie de backup
const backupPath = i18nPath + '.backup';
fs.writeFileSync(backupPath, content, 'utf8');
console.log(`💾 Backup créé : ${backupPath}\n`);

// Écrire le nouveau fichier
fs.writeFileSync(i18nPath, newContent, 'utf8');
console.log(`✅ Fichier i18n.js corrigé !\n`);

// Vérification finale
const verifyContent = fs.readFileSync(i18nPath, 'utf8');
const enMatches = (verifyContent.match(/  en: \{/g) || []).length;
const frMatches = (verifyContent.match(/  fr: \{/g) || []).length;
const esMatches = (verifyContent.match(/  es: \{/g) || []).length;

console.log('🔍 Vérification finale :');
console.log(`   - Sections EN : ${enMatches} (devrait être 1)`);
console.log(`   - Sections FR : ${frMatches} (devrait être 1)`);
console.log(`   - Sections ES : ${esMatches} (devrait être 1)`);

if (enMatches === 1 && frMatches === 1 && esMatches === 1) {
  console.log('\n✅ ✅ ✅ SUCCÈS ! Le fichier est maintenant correct.\n');
  console.log('🚀 Prochaines étapes :');
  console.log('   1. Redémarrer le serveur client');
  console.log('   2. Tester /profile en anglais');
  console.log('   3. Vérifier que tout change correctement\n');
} else {
  console.log('\n⚠️  ATTENTION : La vérification a échoué !');
  console.log('   Restaurez le backup et vérifiez manuellement.\n');
}
