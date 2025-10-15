// Script de validation du fichier i18n.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Validation du fichier i18n.js...\n');

try {
  // Charger le fichier
  const i18nPath = path.join(__dirname, 'client', 'src', 'i18n.js');
  const content = fs.readFileSync(i18nPath, 'utf8');
  
  console.log('✅ Fichier chargé avec succès');
  console.log(`📏 Taille: ${content.length} caractères\n`);
  
  // Vérifier la structure de base
  const checks = [
    { name: 'Import i18next', pattern: /import i18n from ['"]i18next['"]/, required: true },
    { name: 'Import initReactI18next', pattern: /import.*initReactI18next/, required: true },
    { name: 'Const resources', pattern: /const resources = \{/, required: true },
    { name: 'Langue EN', pattern: /en:\s*\{/, required: true },
    { name: 'Langue FR', pattern: /fr:\s*\{/, required: true },
    { name: 'Langue ES', pattern: /es:\s*\{/, required: true },
    { name: 'Export default', pattern: /export default i18n/, required: true },
    { name: 'Section orders (FR)', pattern: /orders:\s*\{[\s\S]*?loadError:.*'Impossible de charger/, required: true },
    { name: 'Section orders (EN)', pattern: /orders:\s*\{[\s\S]*?loadError:.*'Failed to load/, required: true },
    { name: 'Section orders (ES)', pattern: /orders:\s*\{[\s\S]*?loadError:.*'No se pudo cargar/, required: true },
    { name: 'Section marketplace (FR)', pattern: /marketplace:\s*\{[\s\S]*?title:.*'Marketplace'/, required: true },
    { name: 'Section auth (FR)', pattern: /auth:\s*\{[\s\S]*?login:/, required: true },
  ];
  
  console.log('📋 Vérifications:\n');
  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.pattern.test(content);
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
    if (!passed && check.required) {
      allPassed = false;
    }
  });
  
  console.log('\n📊 Statistiques:');
  
  // Compter les occurrences de chaque langue
  const enMatches = content.match(/en:\s*\{/g);
  const frMatches = content.match(/fr:\s*\{/g);
  const esMatches = content.match(/es:\s*\{/g);
  
  console.log(`  - Sections EN: ${enMatches ? enMatches.length : 0}`);
  console.log(`  - Sections FR: ${frMatches ? frMatches.length : 0}`);
  console.log(`  - Sections ES: ${esMatches ? esMatches.length : 0}`);
  
  // Vérifier les accolades
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  console.log(`  - Accolades ouvrantes: ${openBraces}`);
  console.log(`  - Accolades fermantes: ${closeBraces}`);
  
  if (openBraces !== closeBraces) {
    console.log('\n❌ ERREUR: Nombre d\'accolades non équilibré !');
    console.log(`   Différence: ${Math.abs(openBraces - closeBraces)}`);
    allPassed = false;
  }
  
  if (allPassed) {
    console.log('\n✅ Toutes les vérifications sont passées !');
    console.log('\n💡 Le fichier i18n.js est valide.');
    console.log('   Si les traductions ne fonctionnent pas, le problème est ailleurs.');
  } else {
    console.log('\n❌ Certaines vérifications ont échoué.');
    console.log('   Vérifiez les erreurs ci-dessus.');
  }
  
} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  process.exit(1);
}
