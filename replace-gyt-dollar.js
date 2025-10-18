const fs = require('fs');
const path = require('path');

// Fichiers à modifier
const filesToUpdate = [
  'client/src/pages/Dashboard/InvestorDashboard.js',
  'client/src/components/Dashboard/InvestmentReturnsSection.js',
  'client/src/pages/Farmer/ProjectManagement.js',
  'client/src/pages/OrderTrackingDetail.js',
  'client/src/pages/Checkout.js',
  'client/src/pages/Farmer/ManageOrder.js',
  'client/src/components/Dashboard/MarketplaceSection.js'
];

console.log('🔄 Remplacement de GYT par DOLLAR...\n');

let totalReplacements = 0;

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remplacer GYT par DOLLAR (en préservant les contextes)
    content = content.replace(/ GYT/g, ' DOLLAR');
    content = content.replace(/\(GYT\)/g, '(DOLLAR)');
    content = content.replace(/GYT-only/g, 'DOLLAR-only');
    content = content.replace(/GYT Wallet/g, 'DOLLAR Wallet');
    content = content.replace(/availableGYT/g, 'availableDOLLAR');
    content = content.replace(/inProgressGYT/g, 'inProgressDOLLAR');
    content = content.replace(/totalGyt/g, 'totalDollar');
    content = content.replace(/gytBalance/g, 'dollarBalance');
    content = content.replace(/total_gyt/g, 'total_dollar');
    content = content.replace(/price_gyt/g, 'price_dollar');
    content = content.replace(/funded_amount_gyt/g, 'funded_amount_dollar');
    content = content.replace(/budget_gyt/g, 'budget_dollar');
    content = content.replace(/amount_gyt/g, 'amount_dollar');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const changes = (originalContent.match(/GYT/g) || []).length;
      totalReplacements += changes;
      console.log(`✅ ${file} - ${changes} remplacement(s)`);
    } else {
      console.log(`➖ ${file} - Aucun changement`);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${file}:`, error.message);
  }
});

console.log(`\n📊 Total: ${totalReplacements} remplacement(s) effectué(s)`);
console.log('✅ Remplacement terminé!\n');
