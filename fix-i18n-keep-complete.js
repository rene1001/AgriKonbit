/**
 * Script pour garder les sections COMPLÈTES avec profile
 */

const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'client', 'src', 'i18n.js');
const backupPath = i18nPath + '.backup-final';

console.log('🔍 Analyse du fichier i18n.js...\n');

let content = fs.readFileSync(i18nPath, 'utf8');

// Vérifier quelles sections ont "profile:"
const hasProfileEN1 = content.indexOf('en: {') < content.indexOf('profile: {') && 
                      content.indexOf('profile: {') < content.indexOf('fr: {');
const hasProfileES1 = content.indexOf('es: {') < content.indexOf('profile: {', content.indexOf('es: {')) &&
                      content.indexOf('profile: {', content.indexOf('es: {')) < content.indexOf('fr: {');

console.log('📊 Analyse des sections :');
console.log('   EN première occurrence a profile:', hasProfileEN1);
console.log('   ES première occurrence a profile:', hasProfileES1);
console.log('');

// Stratégie : Supprimer les sections INCOMPLÈTES
// - Garder EN ligne 5 (a profile)
// - Supprimer EN ligne 1042 (doublon)
// - Supprimer ES ligne 258 (PAS de profile)
// - Garder ES ligne 1042 (a profile)
// - Garder FR ligne 321 (a profile)

const lines = content.split('\n');

// Trouver les positions exactes
let enPositions = [];
let esPositions = [];
let frPositions = [];

lines.forEach((line, i) => {
  if (line.trim() === 'en: {') enPositions.push(i);
  if (line.trim() === 'es: {') esPositions.push(i);
  if (line.trim() === 'fr: {') frPositions.push(i);
});

console.log('📍 Positions trouvées :');
console.log(`   EN: lignes ${enPositions.map(i => i + 1).join(', ')}`);
console.log(`   ES: lignes ${esPositions.map(i => i + 1).join(', ')}`);
console.log(`   FR: lignes ${frPositions.map(i => i + 1).join(', ')}`);
console.log('');

// Vérifier quelle section ES a profile
function sectionHasProfile(startLine, endLine) {
  for (let i = startLine; i < endLine && i < lines.length; i++) {
    if (lines[i].includes('profile: {')) {
      return true;
    }
  }
  return false;
}

const es1HasProfile = sectionHasProfile(esPositions[0], frPositions[0]);
const es2HasProfile = esPositions[1] ? sectionHasProfile(esPositions[1], lines.length) : false;

console.log('🔍 Vérification profile dans ES :');
console.log(`   ES ligne ${esPositions[0] + 1}: ${es1HasProfile ? '✅ A profile' : '❌ PAS de profile'}`);
if (esPositions[1]) {
  console.log(`   ES ligne ${esPositions[1] + 1}: ${es2HasProfile ? '✅ A profile' : '❌ PAS de profile'}`);
}
console.log('');

// Fonction pour trouver la fin d'une section
function findSectionEnd(startIndex) {
  let braceCount = 0;
  for (let i = startIndex; i < lines.length; i++) {
    for (const char of lines[i]) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount === 0 && lines[i].includes('},')) {
        return i;
      }
    }
  }
  return -1;
}

// Sections à supprimer
const toDelete = [];

// Supprimer ES sans profile (première occurrence ligne 258)
if (!es1HasProfile && esPositions[0]) {
  const end = findSectionEnd(esPositions[0]);
  toDelete.push({ start: esPositions[0], end, lang: 'ES (sans profile)' });
}

// Supprimer EN doublon (deuxième occurrence ligne 1042)
if (enPositions[1]) {
  const end = findSectionEnd(enPositions[1]);
  toDelete.push({ start: enPositions[1], end, lang: 'EN (doublon)' });
}

console.log('❌ Sections à supprimer :');
toDelete.forEach(range => {
  console.log(`   ${range.lang}: lignes ${range.start + 1} à ${range.end + 1}`);
});
console.log('');

// Backup
fs.writeFileSync(backupPath, content, 'utf8');
console.log(`💾 Backup: ${backupPath}\n`);

// Supprimer en ordre inverse
toDelete.sort((a, b) => b.start - a.start);

let newLines = [...lines];
for (const range of toDelete) {
  newLines.splice(range.start, range.end - range.start + 1);
}

fs.writeFileSync(i18nPath, newLines.join('\n'), 'utf8');

console.log(`✅ Fichier corrigé: ${newLines.length} lignes\n`);

// Vérification
const verify = fs.readFileSync(i18nPath, 'utf8');
const enCount = (verify.match(/  en: \{/g) || []).length;
const frCount = (verify.match(/  fr: \{/g) || []).length;
const esCount = (verify.match(/  es: \{/g) || []).length;
const profileCount = (verify.match(/profile: \{/g) || []).length;

console.log('🔍 Vérification :');
console.log(`   EN: ${enCount} ${enCount === 1 ? '✅' : '❌'}`);
console.log(`   FR: ${frCount} ${frCount === 1 ? '✅' : '❌'}`);
console.log(`   ES: ${esCount} ${esCount === 1 ? '✅' : '❌'}`);
console.log(`   profile sections: ${profileCount} ${profileCount >= 3 ? '✅' : '❌'}`);
console.log('');

if (enCount === 1 && frCount === 1 && esCount === 1 && profileCount >= 3) {
  console.log('✅✅✅ SUCCÈS !\n');
} else {
  console.log('⚠️ Problème détecté\n');
}
