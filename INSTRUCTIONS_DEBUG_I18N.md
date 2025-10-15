# 🔍 Instructions de Débogage i18n

## Problème
Vous voyez "dashboard.admin.title" au lieu de "Tableau de Bord Administrateur"

## Étapes de Débogage

### 1. Ouvrir la Console du Navigateur
1. Appuyez sur **F12** pour ouvrir les DevTools
2. Allez dans l'onglet **Console**
3. Tapez cette commande et appuyez sur Entrée :

```javascript
localStorage.getItem('i18n_lng')
```

**Résultat attendu** : `"fr"`

Si vous voyez `null` ou `"en"`, tapez :
```javascript
localStorage.setItem('i18n_lng', 'fr')
```

Puis rechargez la page avec **Ctrl+Shift+R**

### 2. Vérifier i18n dans la Console

Tapez dans la console :

```javascript
window.i18n = require('./i18n').default
```

Puis :

```javascript
i18n.t('dashboard.admin.title')
```

**Résultat attendu** : `"Tableau de Bord Administrateur"`

Si vous voyez `"dashboard.admin.title"`, cela signifie que la traduction n'est pas chargée.

### 3. Vérifier la Langue Active

```javascript
i18n.language
```

**Résultat attendu** : `"fr"`

### 4. Forcer le Français

Si la langue n'est pas "fr", tapez :

```javascript
i18n.changeLanguage('fr')
```

Puis rechargez la page.

### 5. Vider le Cache Complètement

1. Ouvrez DevTools (F12)
2. Cliquez droit sur le bouton **Actualiser** (à côté de la barre d'adresse)
3. Sélectionnez **"Vider le cache et effectuer une actualisation forcée"**

### 6. Vérifier les Erreurs

Dans la console, cherchez des erreurs en rouge qui mentionnent :
- `i18n`
- `translation`
- `missing key`

## Si Rien ne Fonctionne

Envoyez-moi une capture d'écran de :
1. La page admin avec le problème
2. La console du navigateur (F12 → Console)
3. L'onglet Network (F12 → Network) filtré sur "i18n"
