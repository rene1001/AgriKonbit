# 🔧 Guide de Dépannage - Dashboard Agriculteur

## 🚨 Problème de Connexion Résolu

### ✅ Diagnostics Effectués

#### 1. Base de Données ✅
- **Status** : ✅ Connectée avec succès
- **Tables** : 10 tables détectées
- **Utilisateurs** : 5 utilisateurs trouvés (3 farmers + 2 investors)

#### 2. Configuration Frontend ✅
- **Problème corrigé** : `.env` du client mal configuré
- **Solution appliquée** :
  ```
  PORT=3000
  REACT_APP_API_URL=http://localhost:3001/api
  ```

#### 3. Middleware d'Authentification ✅
- **JWT_SECRET** : Configuré
- **requireFarmer** : Accepte roles 'farmer' et 'admin'

---

## 🔍 Diagnostic Complet

### Étape 1 : Vérifier WAMP/MySQL
```bash
# Ouvrir WAMP et vérifier que les services sont verts
# Tous les services doivent être "Online"
```

✅ **Résultat** : MySQL fonctionne sur port 3306

### Étape 2 : Tester la Connexion DB
```bash
node test-connection.js
```

✅ **Résultat** : Connection réussie, 10 tables trouvées

### Étape 3 : Comptes Disponibles
Les comptes farmers disponibles pour se connecter :
- `farmer1@agrikonbit.com`
- `farmer2@agrikonbit.com`
- `farmer3@agrikonbit.com`

---

## 🚀 Procédure de Démarrage Corrigée

### 1. Redémarrer le Backend
```bash
cd server
npm start
```

**Attendez de voir** :
```
✅ Database connected successfully
🚀 Server running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

### 2. Redémarrer le Frontend
```bash
cd client
npm start
```

**Attendez de voir** :
```
Compiled successfully!
You can now view agrikonbit-client in the browser.
Local: http://localhost:3000
```

### 3. Se Connecter
1. Ouvrez http://localhost:3000
2. Cliquez sur **Login**
3. Utilisez un des comptes farmers :
   - **Email** : `farmer1@agrikonbit.com`
   - **Password** : Vérifiez dans votre base de données ou créez un nouveau compte

---

## 🔑 Obtenir/Créer un Compte de Test

### Option 1 : Vérifier les Mots de Passe Existants
```sql
-- Se connecter à MySQL via phpMyAdmin ou CLI
USE agrikonbit;
SELECT id, email, role FROM users WHERE role = 'farmer';
```

### Option 2 : Créer un Nouveau Compte Farmer
Via l'API :
```bash
# POST http://localhost:3001/api/auth/register
{
  "email": "test.farmer@agrikonbit.com",
  "password": "Test123!",
  "full_name": "Test Farmer",
  "role": "farmer",
  "country": "Haiti"
}
```

### Option 3 : Mise à Jour Direct en BDD
```sql
-- Créer un farmer avec mot de passe "Test123!"
-- Hash bcrypt pour "Test123!" (10 rounds)
INSERT INTO users (email, password_hash, full_name, role, country, is_active, kyc_status)
VALUES (
  'test@farmer.com',
  '$2b$10$YourHashedPasswordHere',
  'Test Farmer',
  'farmer',
  'Haiti',
  true,
  'verified'
);

-- Créer un wallet pour ce user
INSERT INTO user_wallets (user_id, gyt_balance, usd_balance)
VALUES (LAST_INSERT_ID(), 1000, 500);
```

---

## 🐛 Problèmes Courants et Solutions

### ❌ Erreur : "Cannot connect to MySQL"
**Cause** : WAMP/MySQL n'est pas démarré

**Solution** :
1. Ouvrir WAMP
2. Vérifier que l'icône est verte
3. Si orange/rouge, cliquer → Redémarrer les services

---

### ❌ Erreur : "Access token required"
**Cause** : Token JWT manquant ou expiré

**Solution** :
1. Se déconnecter complètement
2. Vider le localStorage : `localStorage.clear()` dans la console navigateur
3. Se reconnecter

---

### ❌ Erreur : "User not found" ou "Invalid credentials"
**Cause** : Compte inexistant ou mauvais mot de passe

**Solution** :
1. Vérifier l'email dans la base de données
2. Utiliser l'inscription pour créer un nouveau compte
3. Vérifier que `role = 'farmer'` dans la table users

---

### ❌ Erreur : "Insufficient permissions"
**Cause** : Le compte n'est pas un farmer

**Solution** :
```sql
UPDATE users SET role = 'farmer' WHERE email = 'your-email@example.com';
```

---

### ❌ Erreur : "CORS policy"
**Cause** : Configuration CORS incorrecte

**Solution** : Vérifier dans `server/index.js` :
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
```

---

### ❌ Erreur : "Cannot read property 'gyt_balance' of undefined"
**Cause** : Wallet manquant pour l'utilisateur

**Solution** :
```sql
INSERT INTO user_wallets (user_id, gyt_balance, usd_balance)
SELECT id, 0, 0 FROM users WHERE id NOT IN (SELECT user_id FROM user_wallets);
```

---

### ❌ Page blanche ou composant ne s'affiche pas
**Cause** : Erreur JavaScript dans le composant

**Solution** :
1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs dans l'onglet Console
3. Vérifier les erreurs dans l'onglet Network (appels API)
4. Si erreur d'import, vérifier les chemins des composants

---

## 🔧 Commandes de Debug Utiles

### Test de l'API Backend
```bash
# Tester health check
curl http://localhost:3001/health

# Tester login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer1@agrikonbit.com","password":"YourPassword"}'

# Tester dashboard stats (avec token)
curl http://localhost:3001/api/farmer/stats/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Vérifier les Logs
```bash
# Logs du serveur backend
# (vérifier dans le terminal où npm start est lancé)

# Logs MySQL (si disponible)
tail -f /wamp64/logs/mysql.log
```

### Nettoyer le Cache
```bash
# Backend
cd server
rm -rf node_modules
npm install

# Frontend
cd client
rm -rf node_modules
rm -rf build
npm install
```

---

## ✅ Checklist de Vérification

Avant de démarrer l'application, vérifier :

- [ ] WAMP est démarré (icône verte)
- [ ] MySQL tourne sur port 3306
- [ ] Base de données `agrikonbit` existe
- [ ] Les 10 tables sont créées
- [ ] Au moins 1 utilisateur avec `role='farmer'` existe
- [ ] Chaque utilisateur a un wallet dans `user_wallets`
- [ ] `server/.env` est configuré (DB credentials, JWT_SECRET)
- [ ] `client/.env` contient `REACT_APP_API_URL=http://localhost:3001/api`
- [ ] Ports 3000 et 3001 sont libres

---

## 📞 Support

### Logs à Vérifier en Cas de Problème
1. **Console du navigateur** (F12 → Console)
2. **Network tab** (F12 → Network) pour voir les requêtes API
3. **Terminal backend** pour les erreurs serveur
4. **Terminal frontend** pour les erreurs de compilation

### Informations à Collecter
- Message d'erreur exact
- Screenshot de la console
- Logs du terminal backend
- Version de Node.js : `node -v`
- Version de npm : `npm -v`

---

## 🎯 Étapes de Validation

### Test 1 : Backend
```bash
curl http://localhost:3001/health
# Attendu: {"status":"OK","timestamp":"..."}
```

### Test 2 : Login
1. Ouvrir http://localhost:3000
2. Cliquer Login
3. Entrer credentials farmer
4. Vérifier redirection vers /dashboard

### Test 3 : Dashboard
1. Vérifier que les 6 onglets s'affichent
2. Cliquer sur chaque onglet
3. Vérifier que les données se chargent
4. Vérifier qu'il n'y a pas d'erreur dans la console

---

## ✅ Status Actuel

- ✅ Base de données connectée
- ✅ 10 tables créées
- ✅ 5 utilisateurs de test disponibles
- ✅ Configuration client corrigée
- ✅ Middleware d'authentification fonctionnel
- ✅ Routes API enregistrées
- ✅ Composants React créés

**Prochaine étape** : 
1. Redémarrer les serveurs
2. Tester la connexion avec un compte farmer
3. Naviguer dans le dashboard

---

**Mis à jour** : 2025-10-01 16:25 UTC  
**Status** : ✅ PRÊT À TESTER
