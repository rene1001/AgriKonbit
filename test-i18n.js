// Test script pour vérifier les traductions
const fs = require('fs');

try {
  const content = fs.readFileSync('./client/src/i18n.js', 'utf8');
  
  // Vérifier la structure
  console.log('✓ Fichier i18n.js chargé');
  
  // Vérifier les langues
  const hasEN = content.includes('en: {');
  const hasFR = content.includes('fr: {');
  const hasES = content.includes('es: {');
  
  console.log('Langues trouvées:');
  console.log('  EN:', hasEN ? '✓' : '✗');
  console.log('  FR:', hasFR ? '✓' : '✗');
  console.log('  ES:', hasES ? '✓' : '✗');
  
  // Vérifier les sections orders
  const ordersEN = content.match(/en:[\s\S]*?orders:/);
  const ordersFR = content.match(/fr:[\s\S]*?orders:/);
  const ordersES = content.match(/es:[\s\S]*?orders:/);
  
  console.log('\nSection orders:');
  console.log('  EN:', ordersEN ? '✓' : '✗');
  console.log('  FR:', ordersFR ? '✓' : '✗');
  console.log('  ES:', ordersES ? '✓' : '✗');
  
  // Vérifier les sections marketplace
  const marketEN = content.match(/en:[\s\S]*?marketplace:/);
  const marketFR = content.match(/fr:[\s\S]*?marketplace:/);
  const marketES = content.match(/es:[\s\S]*?marketplace:/);
  
  console.log('\nSection marketplace:');
  console.log('  EN:', marketEN ? '✓' : '✗');
  console.log('  FR:', marketFR ? '✓' : '✗');
  console.log('  ES:', marketES ? '✓' : '✗');
  
  // Vérifier l'export
  const hasExport = content.includes('export default i18n');
  console.log('\nExport:', hasExport ? '✓' : '✗');
  
  console.log('\n✓ Test terminé');
  
} catch (error) {
  console.error('✗ Erreur:', error.message);
  process.exit(1);
}
