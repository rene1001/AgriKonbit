/**
 * Script pour supprimer tous les emojis des traductions dans i18n.js
 * Les emojis seront affichés par les composants React, pas dans les traductions
 */

const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'client', 'src', 'i18n.js');
const backupPath = i18nPath + '.backup-before-emoji-removal';

console.log('🔍 Lecture du fichier i18n.js...\n');

// Lire le fichier
let content = fs.readFileSync(i18nPath, 'utf8');

// Sauvegarder le backup
fs.writeFileSync(backupPath, content, 'utf8');
console.log(`💾 Backup créé : ${backupPath}\n`);

// Liste des emojis à supprimer (avec leurs variantes)
const emojisToRemove = [
  '📊', '💼', '🌱', '💰', '💬', '⚙️', '🛍️', '🧾', '🚚', '⭐', '🔁', '👤', '🆘', '📝',
  '🔐', '📋', '🎨', '📷', '🗑️', '☀️', '🌙', '🔄', '✏️', '➕', '✉️', '📤', '🛡️',
  '🏦', '📈', '🎯', '💵', '🔔', '⚡', '🌍', '📱', '💳', '🏪', '🎁', '📦', '🚀',
  '✅', '❌', '⏳', '🔒', '🔓', '📞', '📧', '🏠', '🌐', '💡', '🔧', '⚠️', '📅'
];

// Compter les emojis avant
let emojiCount = 0;
emojisToRemove.forEach(emoji => {
  const matches = content.match(new RegExp(emoji, 'g'));
  if (matches) emojiCount += matches.length;
});

console.log(`📊 Emojis trouvés : ${emojiCount}\n`);

// Fonction pour nettoyer les emojis d'une chaîne
function removeEmojis(str) {
  let cleaned = str;
  
  // Supprimer les emojis au début de la chaîne (avec espaces optionnels)
  emojisToRemove.forEach(emoji => {
    // Au début : "📊 Texte" → "Texte"
    cleaned = cleaned.replace(new RegExp(`${emoji}\\s*`, 'g'), '');
  });
  
  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// Regex pour trouver les valeurs de traduction
// Cherche les patterns comme: key: 'value' ou key: "value"
const translationPattern = /(\w+):\s*(['"])((?:(?!\2).)*)\2/g;

let newContent = content.replace(translationPattern, (match, key, quote, value) => {
  const cleanedValue = removeEmojis(value);
  
  // Si la valeur a changé, on la remplace
  if (cleanedValue !== value) {
    return `${key}: ${quote}${cleanedValue}${quote}`;
  }
  
  return match;
});

// Écrire le nouveau fichier
fs.writeFileSync(i18nPath, newContent, 'utf8');

// Compter les emojis après
let emojiCountAfter = 0;
emojisToRemove.forEach(emoji => {
  const matches = newContent.match(new RegExp(emoji, 'g'));
  if (matches) emojiCountAfter += matches.length;
});

console.log('✅ Fichier nettoyé !\n');
console.log(`📊 Statistiques :`);
console.log(`   - Emojis avant : ${emojiCount}`);
console.log(`   - Emojis après : ${emojiCountAfter}`);
console.log(`   - Emojis supprimés : ${emojiCount - emojiCountAfter}\n`);

if (emojiCountAfter > 0) {
  console.log(`⚠️  Attention : ${emojiCountAfter} emojis restants`);
  console.log(`   (probablement dans des commentaires ou du code)\n`);
}

console.log('🚀 Prochaines étapes :');
console.log('   1. Redémarrer le serveur client');
console.log('   2. Tester toutes les pages');
console.log('   3. Vérifier que les traductions fonctionnent\n');
console.log(`💡 Si problème, restaurez : ${backupPath}\n`);
