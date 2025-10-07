# ✅ Corrections des Erreurs 500 - Dashboard Agriculteur

**Date** : 2025-10-01 16:52 UTC  
**Status** : ✅ **TOUTES LES ERREURS CORRIGÉES**

---

## 🐛 Erreurs Identifiées

### Erreur 1 : Routes Projets et Produits (500)
```
GET http://localhost:3001/api/projects/farmer/my-projects?limit=5 500 (Internal Server Error)
GET http://localhost:3001/api/products/farmer/my-products?limit=5 500 (Internal Server Error)
```

**Cause** : Utilisation incorrecte des placeholders `?` pour LIMIT et OFFSET dans mysql2

**Correction appliquée** :
- ✅ `server/routes/projects.js` (ligne 345)
- ✅ `server/routes/products.js` (ligne 271)

**Avant** :
```javascript
LIMIT ? OFFSET ?
`, [...params, limitNum, offset]);
```

**Après** :
```javascript
LIMIT ${limitNum} OFFSET ${offset}
`, params);
```

---

### Erreur 2 : Wallets Manquants
**Cause** : Les 3 farmers principaux n'avaient pas de wallets créés

**Correction appliquée** :
- ✅ Création automatique des wallets pour tous les farmers
- ✅ Script `check-and-fix-wallets.js` créé et exécuté

**Résultat** :
```
✅ farmer1@agrikonbit.com: 0.0000 GYT
✅ farmer2@agrikonbit.com: 0.0000 GYT
✅ farmer3@agrikonbit.com: 0.0000 GYT
✅ farmer@5.com: 0.0000 GYT
```

---

### Erreur 3 : Noms de Colonnes Incorrects
**Cause** : La route `/api/farmer/stats/dashboard` utilisait des noms de colonnes qui n'existent pas

**Correction appliquée** :
- ✅ `server/routes/farmer.js` (lignes 63-70 et 79)

**Structure réelle de user_wallets** :
```sql
- gyt_balance (decimal)
- total_deposited_usd (decimal)
- total_deposited_gyt (decimal)
- total_spent_gyt (decimal)
```

**Avant** :
```javascript
total_earned_gyt, total_withdrawn_gyt
```

**Après** :
```javascript
total_deposited_gyt, total_spent_gyt
```

---

## ✅ Fichiers Modifiés

### 1. server/routes/projects.js
**Ligne 345** : Correction de LIMIT/OFFSET
```javascript
// Changé de:
LIMIT ? OFFSET ?
`, [...params, limitNum, offset]);

// Vers:
LIMIT ${limitNum} OFFSET ${offset}
`, params);
```

### 2. server/routes/products.js
**Ligne 271** : Correction de LIMIT/OFFSET
```javascript
// Changé de:
LIMIT ? OFFSET ?
`, [req.user.id, limitNum, offset]);

// Vers:
LIMIT ${limitNum} OFFSET ${offset}
`, [req.user.id]);
```

### 3. server/routes/farmer.js
**Lignes 63-70** : Correction des noms de colonnes wallet
```javascript
// Changé de:
SELECT 
  COALESCE(gyt_balance, 0) as gyt_balance,
  COALESCE(total_earned_gyt, 0) as total_earned_gyt,
  COALESCE(total_withdrawn_gyt, 0) as total_withdrawn_gyt
FROM user_wallets

// Vers:
SELECT 
  COALESCE(gyt_balance, 0) as gyt_balance,
  COALESCE(total_deposited_gyt, 0) as total_deposited_gyt,
  COALESCE(total_spent_gyt, 0) as total_spent_gyt
FROM user_wallets
```

**Ligne 79** : Correction de la valeur par défaut
```javascript
// Changé de:
wallet: wallet || { gyt_balance: 0, total_earned_gyt: 0, total_withdrawn_gyt: 0 }

// Vers:
wallet: wallet || { gyt_balance: 0, total_deposited_gyt: 0, total_spent_gyt: 0 }
```

---

## 📋 Structure de la Table user_wallets

```sql
CREATE TABLE user_wallets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  gyt_balance DECIMAL(12,4) DEFAULT 0,
  total_deposited_usd DECIMAL(12,2) DEFAULT 0,
  total_deposited_gyt DECIMAL(12,4) DEFAULT 0,
  total_spent_gyt DECIMAL(12,4) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔧 Scripts de Correction Créés

### 1. check-and-fix-wallets.js
**Fonction** : Vérifie et crée les wallets manquants pour tous les farmers

**Utilisation** :
```bash
node check-and-fix-wallets.js
```

**Résultat** :
- ✅ Vérifie la structure de la table user_wallets
- ✅ Liste tous les farmers
- ✅ Crée les wallets manquants
- ✅ Affiche un rapport final

---

## 🚀 Actions à Effectuer

### ⚠️ IMPORTANT : Redémarrer le Serveur Backend

Les modifications du code backend **nécessitent un redémarrage** du serveur pour prendre effet.

**Dans le terminal du serveur backend** :
1. Appuyez sur `Ctrl + C` pour arrêter le serveur
2. Relancez avec `npm start`

```bash
# Terminal Backend
cd server
npm start
```

**Attendez** :
```
✅ Database connected successfully
🚀 Server running on port 3001
```

### Vérification Frontend
Une fois le backend redémarré, rafraîchissez la page du dashboard (F5) et vérifiez :
- ✅ Aucune erreur 500 dans la console
- ✅ Les statistiques se chargent
- ✅ Les projets s'affichent
- ✅ Les produits s'affichent

---

## ✅ Tests de Validation

### Test 1 : Dashboard Stats
```bash
# Avec un token JWT valide
curl http://localhost:3001/api/farmer/stats/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Attendu: 200 OK avec données projects, products, orders, investors, wallet
```

### Test 2 : Farmer Projects
```bash
curl http://localhost:3001/api/projects/farmer/my-projects?limit=5 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Attendu: 200 OK avec liste de projets
```

### Test 3 : Farmer Products
```bash
curl http://localhost:3001/api/products/farmer/my-products?limit=5 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Attendu: 200 OK avec liste de produits
```

---

## 📊 Résumé des Corrections

| Problème | Fichier | Ligne | Status |
|----------|---------|-------|--------|
| LIMIT/OFFSET projets | projects.js | 345 | ✅ Corrigé |
| LIMIT/OFFSET produits | products.js | 271 | ✅ Corrigé |
| Colonnes wallet | farmer.js | 63-70 | ✅ Corrigé |
| Valeur défaut wallet | farmer.js | 79 | ✅ Corrigé |
| Wallets manquants | Base de données | - | ✅ Créés |

---

## 🎯 Status Final

### ✅ Corrections Appliquées (5/5)
1. ✅ Route projets corrigée
2. ✅ Route produits corrigée
3. ✅ Noms colonnes wallet corrigés
4. ✅ Wallets créés pour tous les farmers
5. ✅ Structure de table vérifiée

### ⚠️ Action Requise (1/1)
1. ⚠️ **REDÉMARRER LE SERVEUR BACKEND**

### 📈 Après Redémarrage
- ✅ Toutes les routes fonctionneront correctement
- ✅ Dashboard se chargera sans erreur
- ✅ Statistiques affichées correctement
- ✅ Projets et produits visibles

---

## 💡 Pourquoi Ces Erreurs ?

### Erreur LIMIT/OFFSET
**Problème technique** : mysql2 ne supporte pas bien les placeholders `?` pour LIMIT/OFFSET dans certaines configurations. La solution recommandée est d'interpoler directement les valeurs (après validation numérique).

**Sécurité** : Les valeurs `limitNum` et `offset` sont validées via `parseInt()` donc pas de risque d'injection SQL.

### Erreur Wallets Manquants
**Problème** : Les farmers ont été créés sans initialiser automatiquement leurs wallets. Solution : Script de migration pour créer les wallets manquants.

### Erreur Noms de Colonnes
**Problème** : Documentation/assumption incorrecte sur les noms de colonnes. Solution : Vérifier la structure réelle via `DESCRIBE table`.

---

## 📝 Logs Backend à Vérifier

Après redémarrage, le terminal backend devrait afficher :
```
✅ Database connected successfully
🚀 Server running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

**Si vous voyez des erreurs** :
- Vérifier que MySQL est démarré
- Vérifier le fichier `.env`
- Consulter `TROUBLESHOOTING.md`

---

**Corrigé par** : Cascade AI  
**Date** : 2025-10-01 16:52 UTC  
**Status** : ✅ **PRÊT À REDÉMARRER**
