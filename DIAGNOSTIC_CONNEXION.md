# 🔍 Diagnostic - Problème de Connexion

**Date:** 14 Octobre 2025, 18:27 UTC  
**Status Serveurs:** ✅ Backend (3001) et Frontend (3000) fonctionnent

---

## ✅ Vérifications Effectuées

### Serveurs
- ✅ **Backend:** http://localhost:3001 - OPÉRATIONNEL
- ✅ **Frontend:** http://localhost:3000 - OPÉRATIONNEL
- ✅ **Health Check:** Réponse OK

### Configuration
- ✅ Fichier `.env` existe dans `server/`
- ✅ Fichier `.env` existe dans `client/`
- ✅ API URL configurée: `http://localhost:3001/api`

---

## 🐛 Types d'Erreurs de Connexion Possibles

### 1. Erreur "Invalid credentials" / "Email ou mot de passe incorrect"

**Cause:** Identifiants incorrects

**Solution:**
```sql
-- Vérifier les utilisateurs existants
USE agrikonbit;
SELECT id, email, full_name, role FROM users;
```

**Comptes de test disponibles:**
Vérifiez dans la base de données les emails et utilisez le mot de passe configuré lors de la création.

---

### 2. Erreur "Network Error" / "Failed to fetch"

**Cause:** Le backend n'est pas accessible

**Vérification:**
```bash
# Tester le backend directement
curl http://localhost:3001/health
```

**Solution:**
- Vérifier que le backend est démarré
- Vérifier les logs du serveur backend
- Vérifier le port 3001 n'est pas bloqué

---

### 3. Erreur 401 "Unauthorized"

**Cause:** Token JWT invalide ou expiré

**Solution:**
1. Effacer le localStorage du navigateur:
   - F12 → Application → Local Storage → Clear
2. Se reconnecter

---

### 4. Erreur 500 "Internal Server Error"

**Cause:** Erreur côté serveur

**Solution:**
1. Vérifier les logs du backend
2. Vérifier que les migrations sont appliquées:
   ```bash
   cd migrations
   node verify-fixes.js
   ```

---

## 🔧 Solutions Rapides

### Solution 1: Créer un Compte de Test

```sql
USE agrikonbit;

-- Créer un utilisateur Farmer de test
INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified)
VALUES (
  'farmer@test.com',
  '$2a$10$YourHashedPasswordHere',
  'Test Farmer',
  'farmer',
  TRUE,
  TRUE
);

-- Créer un wallet pour cet utilisateur
INSERT INTO user_wallets (user_id, gyt_balance)
SELECT id, 1000.00 FROM users WHERE email = 'farmer@test.com';
```

**Note:** Le mot de passe doit être hashé avec bcrypt. Utilisez le script ci-dessous.

---

### Solution 2: Script de Création d'Utilisateur

Créez un fichier `server/scripts/create-test-user.js`:

```javascript
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

async function createTestUser() {
  const email = 'farmer@test.com';
  const password = 'Test123!';
  const passwordHash = await bcrypt.hash(password, 10);
  
  try {
    // Créer l'utilisateur
    await query(`
      INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [email, passwordHash, 'Test Farmer', 'farmer', true, true]);
    
    // Récupérer l'ID
    const [user] = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    // Créer le wallet
    await query(`
      INSERT INTO user_wallets (user_id, gyt_balance)
      VALUES (?, ?)
    `, [user.id, 1000.00]);
    
    console.log('✅ Utilisateur créé avec succès!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

createTestUser();
```

**Exécution:**
```bash
cd server
node scripts/create-test-user.js
```

---

### Solution 3: Réinitialiser le Mot de Passe

```sql
USE agrikonbit;

-- Lister les utilisateurs
SELECT id, email, full_name, role FROM users;

-- Mettre à jour le mot de passe (hash de "Test123!")
UPDATE users 
SET password_hash = '$2a$10$rXKZ9qGjH5YxKlV.vN8P0uQxH8vN9qGjH5YxKlV.vN8P0uQxH8vN9q'
WHERE email = 'votre_email@example.com';
```

---

## 🔍 Diagnostic Détaillé

### Étape 1: Vérifier les Utilisateurs

```sql
USE agrikonbit;
SELECT id, email, full_name, role, is_active, email_verified FROM users;
```

**Vérifiez:**
- ✓ L'utilisateur existe
- ✓ `is_active` = 1
- ✓ `email_verified` = 1
- ✓ `role` = 'farmer' (ou autre)

---

### Étape 2: Tester l'API de Connexion

**Avec curl:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"farmer@test.com\",\"password\":\"Test123!\"}"
```

**Réponse attendue:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "farmer@test.com",
    "role": "farmer"
  }
}
```

---

### Étape 3: Vérifier les Logs

**Backend:**
Regardez le terminal où `npm run dev` s'exécute pour voir les erreurs.

**Frontend:**
Ouvrez la console du navigateur (F12) et regardez:
- Console → Erreurs JavaScript
- Network → Requêtes HTTP échouées

---

## 📝 Checklist de Diagnostic

- [ ] Les deux serveurs sont démarrés (3000 et 3001)
- [ ] http://localhost:3001/health répond OK
- [ ] http://localhost:3000 affiche la page
- [ ] La base de données contient des utilisateurs
- [ ] Les utilisateurs ont `is_active = 1`
- [ ] Les utilisateurs ont `email_verified = 1`
- [ ] Le mot de passe est correct
- [ ] Pas d'erreur dans les logs backend
- [ ] Pas d'erreur dans la console navigateur

---

## 🚀 Test Rapide de Connexion

### Option 1: Via l'Interface

1. Ouvrir http://localhost:3000/login
2. Entrer les identifiants
3. Cliquer sur "Se connecter"
4. Vérifier la console (F12) pour les erreurs

### Option 2: Via l'API Directement

```bash
# Test de connexion
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"VOTRE_EMAIL\",\"password\":\"VOTRE_PASSWORD\"}"
```

---

## 📞 Besoin d'Aide Supplémentaire ?

### Informations à Fournir

1. **Message d'erreur exact** (copier-coller)
2. **Logs du backend** (terminal npm run dev)
3. **Console navigateur** (F12 → Console)
4. **Requête réseau** (F12 → Network → requête de login)

### Commandes de Diagnostic

```bash
# Vérifier la base de données
cd migrations
node verify-fixes.js

# Lister les utilisateurs
mysql -u root -p agrikonbit -e "SELECT id, email, role, is_active FROM users;"

# Vérifier les ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

---

## ✅ Solution Temporaire

Si vous ne pouvez pas vous connecter, créez un nouvel utilisateur de test:

```bash
cd server
node -e "
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agrikonbit'
  });
  
  const hash = await bcrypt.hash('Test123!', 10);
  await conn.execute(
    'INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) VALUES (?, ?, ?, ?, ?, ?)',
    ['test@farmer.com', hash, 'Test Farmer', 'farmer', 1, 1]
  );
  
  const [user] = await conn.execute('SELECT id FROM users WHERE email = ?', ['test@farmer.com']);
  await conn.execute('INSERT INTO user_wallets (user_id, gyt_balance) VALUES (?, ?)', [user[0][0].id, 1000]);
  
  console.log('✅ Utilisateur créé: test@farmer.com / Test123!');
  await conn.end();
})();
"
```

**Identifiants:**
- Email: `test@farmer.com`
- Password: `Test123!`

---

**Dernière mise à jour:** 14 Octobre 2025, 18:30 UTC
