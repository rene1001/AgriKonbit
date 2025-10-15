# 🚀 Démarrage Rapide - AgriKonbit

## ✅ Corrections Appliquées avec Succès

Toutes les erreurs critiques ont été identifiées et corrigées :

### 🔧 Corrections Backend
- ✅ Routes dupliquées supprimées dans `farmer.js`
- ✅ Validation des statuts de commande corrigée
- ✅ Colonnes manquantes ajoutées à la base de données
- ✅ Types de transactions mis à jour

### 🎨 Corrections Frontend
- ✅ Affichage "DOLLAR" → "GYT" corrigé dans ManageOrder.js

---

## 📋 Prérequis

Avant de démarrer, assurez-vous que :
- ✅ WAMP/MySQL est démarré
- ✅ Node.js est installé
- ✅ Les migrations ont été exécutées (voir ci-dessous)

---

## 🗄️ Étape 1: Vérifier la Base de Données

### Option A: Vérification Automatique (Recommandé)

```bash
cd migrations
node verify-fixes.js
```

Vous devriez voir :
```
✅ delivery_confirmed_at: datetime
✅ delivery_notes: text
✅ total_earned_gyt: decimal
✅ Type "payment" présent dans l'ENUM
```

### Option B: Vérification Manuelle

Ouvrez phpMyAdmin et exécutez :

```sql
USE agrikonbit;

-- Vérifier les colonnes orders
DESCRIBE orders;

-- Vérifier les colonnes user_wallets
DESCRIBE user_wallets;

-- Vérifier les types de transactions
SHOW COLUMNS FROM transactions LIKE 'type';
```

---

## 🖥️ Étape 2: Démarrer le Serveur Backend

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

**Attendez de voir :**
```
✅ Database connected successfully
🚀 Server (HTTP + Socket.IO) running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

---

## 🌐 Étape 3: Démarrer le Client Frontend

### Terminal 2 - Frontend

```bash
cd client
npm start
```

**Le navigateur devrait s'ouvrir automatiquement sur :**
```
http://localhost:3000
```

---

## 🧪 Étape 4: Tester les Corrections

### Test 1: Connexion Farmer

1. Allez sur http://localhost:3000/login
2. Connectez-vous avec un compte Farmer
3. Allez dans "Mes Commandes"
4. Vérifiez que les commandes s'affichent correctement
5. Cliquez sur une commande pour voir les détails
6. ✅ Vérifiez que "GYT" s'affiche (pas "DOLLAR")

### Test 2: Mise à Jour de Statut

1. Dans les détails d'une commande
2. Essayez de changer le statut
3. ✅ Vérifiez qu'il n'y a pas d'erreur 500
4. ✅ Vérifiez que le statut se met à jour

### Test 3: API Backend

Testez l'API directement :

```bash
# Remplacez YOUR_TOKEN par un vrai token JWT
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/farmer/orders
```

---

## 📊 État de la Base de Données

D'après la vérification :
- **22 tables** créées
- **6 utilisateurs** (2 investors, 3 farmers, 1 consumer)
- **0 commandes** actuellement

---

## 🐛 Résolution de Problèmes

### Problème: "Cannot connect to database"

**Solution:**
1. Vérifiez que WAMP/MySQL est démarré
2. Vérifiez le fichier `server/.env` :
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=agrikonbit
   ```

### Problème: "Port 3001 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Ou changez le port dans server/.env
PORT=5000
```

### Problème: "Module not found"

**Solution:**
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Problème: Erreur 500 sur /api/farmer/orders

**Solution:**
1. Vérifiez que les migrations ont été exécutées
2. Redémarrez le serveur backend
3. Vérifiez les logs du serveur

---

## 📝 Fichiers Importants

### Configuration
- `server/.env` - Configuration du serveur
- `client/.env` - Configuration du client (si existe)

### Migrations
- `migrations/022_add_order_delivery_fields.sql`
- `migrations/023_add_wallet_earned_field.sql`
- `migrations/024_update_transaction_types.sql`

### Routes Corrigées
- `server/routes/farmer.js` - Routes farmer (dupliqués supprimés)

### Frontend Corrigé
- `client/src/pages/Farmer/ManageOrder.js` - Affichage GYT

---

## 🔍 Logs et Débogage

### Voir les logs du serveur
Les logs s'affichent dans le terminal où vous avez lancé `npm run dev`

### Voir les erreurs frontend
Ouvrez la console du navigateur (F12) → Console

### Tester une route API
```bash
# Health check
curl http://localhost:3001/health

# Farmer orders (nécessite un token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/farmer/orders
```

---

## 📚 Documentation API

Une fois le serveur démarré, accédez à :
```
http://localhost:3001/api-docs
```

---

## ✅ Checklist de Démarrage

- [ ] WAMP/MySQL démarré
- [ ] Migrations exécutées (`node verify-fixes.js` OK)
- [ ] Backend démarré (port 3001)
- [ ] Frontend démarré (port 3000)
- [ ] Connexion réussie avec un compte Farmer
- [ ] Page "Mes Commandes" accessible
- [ ] Affichage "GYT" correct (pas "DOLLAR")

---

## 🎯 Prochaines Étapes

1. ✅ **Créer des commandes de test** pour vérifier le système complet
2. 🔍 **Tester toutes les fonctionnalités Farmer**
3. 📝 **Documenter les flux de travail**
4. 🧪 **Créer des tests automatisés**

---

## 💡 Conseils

- **Gardez les deux terminaux ouverts** (backend + frontend)
- **Surveillez les logs** pour détecter les erreurs rapidement
- **Utilisez la console du navigateur** (F12) pour le débogage frontend
- **Consultez la documentation API** à http://localhost:3001/api-docs

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs du serveur
2. Vérifiez la console du navigateur
3. Relancez `node verify-fixes.js` pour vérifier la DB
4. Consultez `CORRECTIONS_APPLIQUEES.md` pour plus de détails

---

**Dernière mise à jour:** 14 Octobre 2025, 18:15 UTC

**Status:** ✅ Prêt pour le développement et les tests
