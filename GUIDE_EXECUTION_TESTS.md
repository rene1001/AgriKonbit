# Guide d'Exécution des Tests - AgriKonbit

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
npm run e2e:install
```

### 2. Démarrer les serveurs
```bash
npm run dev
```
Serveurs démarrés sur:
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

### 3. Exécuter les tests

**Windows:**
```batch
run-all-tests.bat
```

**Par catégorie:**
```bash
npm run test:functional      # Tests fonctionnels
npm run test:performance     # Tests de performance
npm run test:security        # Tests de sécurité
npm run test:ui              # Tests UI/UX
npm run test:seo             # Tests SEO
npm run test:accessibility   # Tests accessibilité
npm run test:compatibility   # Tests compatibilité
npm run test:integration     # Tests d'intégration
npm run test:regression      # Tests de régression
npm run test:content         # Tests de contenu
```

## 📊 Catégories de Tests

| Catégorie | Outil | Fichiers |
|-----------|-------|----------|
| Fonctionnels | Jest | `tests/functional/*.test.js` |
| Performance | Jest | `tests/performance/*.test.js` |
| Sécurité | Jest | `tests/security/*.test.js` |
| UI/UX | Playwright | `tests/ui/*.test.js` |
| SEO | Playwright | `tests/seo/*.test.js` |
| Accessibilité | Playwright | `tests/accessibility/*.test.js` |
| Compatibilité | Playwright | `tests/compatibility/*.test.js` |
| Intégration | Jest | `tests/integration/*.test.js` |
| Régression | Jest | `tests/regression/*.test.js` |
| Contenu | Playwright | `tests/content/*.test.js` |

## 🎯 Critères de Qualité

- **Couverture Backend**: > 80%
- **Couverture Frontend**: > 70%
- **Temps réponse API**: < 500ms
- **Score Lighthouse**: > 90
- **WCAG 2.1 AA**: Conforme
- **Vulnérabilités**: 0 critique

## 📝 Générer le Rapport

```bash
npm run test:report
```

Consulter: `RAPPORT_TESTS_FINAL.md`

## 🐛 Debugging

```bash
# Test spécifique
npx jest tests/functional/auth.test.js
npx playwright test tests/ui/responsive.test.js --debug

# Voir rapports
npx playwright show-report
npm run test:functional -- --coverage
```

## 🆘 Problèmes Courants

**Serveurs ne démarrent pas:**
```bash
# Vérifier ports occupés
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

**Tests échouent:**
- Vérifier que les serveurs sont démarrés
- Vérifier la base de données
- Consulter les logs dans `test-results/`

**Installation Playwright échoue:**
```bash
npx playwright install --with-deps --force
```

## 📚 Documentation

- Plan complet: `PLAN_TESTS_COMPLET.md`
- Configuration Jest: `jest.config.js`
- Configuration Playwright: `playwright.config.js`
