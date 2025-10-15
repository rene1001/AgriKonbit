/**
 * Script pour supprimer TOUS les doublons dans i18n.js
 * 
 * Problème : Il y a des doublons pour EN et ES
 * Solution : Garder seulement la PREMIÈRE occurrence de chaque langue
 */

const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'client', 'src', 'i18n.js');
const backupPath = i18nPath + '.backup-' + Date.now();

console.log('🔍 Analyse du fichier i18n.js...\n');

// Lire le fichier
let content = fs.readFileSync(i18nPath, 'utf8');
const lines = content.split('\n');

console.log(`📊 Fichier original : ${lines.length} lignes\n`);

// Trouver toutes les sections de langue
const sections = { en: [], fr: [], es: [] };

lines.forEach((line, index) => {
  const trimmed = line.trim();
  if (trimmed === 'en: {') sections.en.push(index);
  if (trimmed === 'fr: {') sections.fr.push(index);
  if (trimmed === 'es: {') sections.es.push(index);
});

console.log('🔎 Sections trouvées :');
console.log(`   EN : ${sections.en.length} occurrences aux lignes ${sections.en.map(i => i + 1).join(', ')}`);
console.log(`   FR : ${sections.fr.length} occurrences aux lignes ${sections.fr.map(i => i + 1).join(', ')}`);
console.log(`   ES : ${sections.es.length} occurrences aux lignes ${sections.es.map(i => i + 1).join(', ')}`);
console.log('');

// Stratégie : Garder EN (ligne 5), FR (première occurrence), ES (première occurrence)
// Supprimer tous les doublons

// Trouver les sections à garder
const keepSections = [
  sections.en[0],  // Première EN
  sections.fr[0],  // Première FR  
  sections.es[0]   // Première ES
].sort((a, b) => a - b);

console.log('✅ Sections à GARDER :');
keepSections.forEach(index => {
  const lang = lines[index].trim().split(':')[0];
  console.log(`   ${lang.toUpperCase()} à la ligne ${index + 1}`);
});
console.log('');

// Trouver les sections à supprimer
const removeSections = [
  ...sections.en.slice(1),  // Toutes les EN sauf la première
  ...sections.fr.slice(1),  // Toutes les FR sauf la première
  ...sections.es.slice(1)   // Toutes les ES sauf la première
].sort((a, b) => a - b);

console.log('❌ Sections à SUPPRIMER :');
removeSections.forEach(index => {
  const lang = lines[index].trim().split(':')[0];
  console.log(`   ${lang.toUpperCase()} à la ligne ${index + 1}`);
});
console.log('');

if (removeSections.length === 0) {
  console.log('✅ Aucun doublon trouvé ! Le fichier est déjà correct.\n');
  process.exit(0);
}

// Fonction pour trouver la fin d'une section (trouve le } correspondant)
function findSectionEnd(startIndex) {
  let braceCount = 0;
  let inSection = false;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Compter les accolades
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        inSection = true;
      }
      if (char === '}') {
        braceCount--;
        if (inSection && braceCount === 0) {
          // Trouver la ligne avec },
          for (let j = i; j < Math.min(i + 3, lines.length); j++) {
            if (lines[j].trim() === '},') {
              return j;
            }
          }
          return i;
        }
      }
    }
  }
  return -1;
}

// Calculer les plages à supprimer
const rangesToDelete = [];
for (const startIndex of removeSections) {
  const endIndex = findSectionEnd(startIndex);
  if (endIndex !== -1) {
    rangesToDelete.push({ start: startIndex, end: endIndex });
    const lang = lines[startIndex].trim().split(':')[0];
    console.log(`📍 ${lang.toUpperCase()} doublon : lignes ${startIndex + 1} à ${endIndex + 1} (${endIndex - startIndex + 1} lignes)`);
  }
}
console.log('');

// Sauvegarder le backup
fs.writeFileSync(backupPath, content, 'utf8');
console.log(`💾 Backup créé : ${backupPath}\n`);

// Supprimer les plages en ordre inverse pour ne pas décaler les indices
rangesToDelete.reverse();

let newLines = [...lines];
let totalDeleted = 0;

for (const range of rangesToDelete) {
  const count = range.end - range.start + 1;
  newLines.splice(range.start, count);
  totalDeleted += count;
}

// Écrire le nouveau fichier
const newContent = newLines.join('\n');
fs.writeFileSync(i18nPath, newContent, 'utf8');

console.log(`✅ Fichier corrigé !`);
console.log(`   ${totalDeleted} lignes supprimées`);
console.log(`   ${newLines.length} lignes restantes\n`);

// Vérification finale
const verifyContent = fs.readFileSync(i18nPath, 'utf8');
const enCount = (verifyContent.match(/  en: \{/g) || []).length;
const frCount = (verifyContent.match(/  fr: \{/g) || []).length;
const esCount = (verifyContent.match(/  es: \{/g) || []).length;

console.log('🔍 Vérification finale :');
console.log(`   - Sections EN : ${enCount} ${enCount === 1 ? '✅' : '❌'}`);
console.log(`   - Sections FR : ${frCount} ${frCount === 1 ? '✅' : '❌'}`);
console.log(`   - Sections ES : ${esCount} ${esCount === 1 ? '✅' : '❌'}`);
console.log('');

if (enCount === 1 && frCount === 1 && esCount === 1) {
  console.log('✅ ✅ ✅ SUCCÈS ! Le fichier est maintenant correct.\n');
  console.log('🚀 Prochaines étapes :');
  console.log('   1. Redémarrer le serveur client (Ctrl+C puis npm start)');
  console.log('   2. Tester /profile en FR/EN/ES');
  console.log('   3. Vérifier que tout change correctement\n');
  console.log(`💡 Si problème, restaurez : ${backupPath}\n`);
} else {
  console.log('⚠️  ATTENTION : La vérification a échoué !');
  console.log(`   Restaurez le backup : ${backupPath}\n`);
}
