import i18n from './i18n';

console.log('=== TEST I18N ===');
console.log('Langue actuelle:', i18n.language);
console.log('Langues disponibles:', Object.keys(i18n.options.resources));

// Test des traductions admin
console.log('\n=== TRADUCTIONS ADMIN (FR) ===');
console.log('dashboard.admin.title:', i18n.t('dashboard.admin.title', { lng: 'fr' }));
console.log('dashboard.admin.subtitle:', i18n.t('dashboard.admin.subtitle', { lng: 'fr' }));
console.log('dashboard.admin.users:', i18n.t('dashboard.admin.users', { lng: 'fr' }));
console.log('dashboard.admin.products:', i18n.t('dashboard.admin.products', { lng: 'fr' }));

// Vérifier la structure
console.log('\n=== STRUCTURE ===');
console.log('resources.fr.translation.dashboard:', i18n.options.resources.fr.translation.dashboard ? 'EXISTS' : 'MISSING');
console.log('resources.fr.translation.dashboard.admin:', i18n.options.resources.fr.translation.dashboard?.admin ? 'EXISTS' : 'MISSING');
