# 🔐 Comptes de Test - AgriKonbit

**Date de création:** 14 Octobre 2025  
**Environnement:** Développement

---

## ⚠️ AVERTISSEMENT

**Ces identifiants sont UNIQUEMENT pour l'environnement de développement/test.**

🚨 **NE JAMAIS utiliser ces mots de passe en production !**

---

## 👨‍💼 Compte Administrateur

### Admin Principal

```
📧 Email:    admin@agrikonbit.com
🔑 Password: Admin123!
👤 Rôle:     Admin
💰 Balance:  10000.00 GYT
```

**Accès:**
- Dashboard Admin
- Gestion des utilisateurs
- Validation des projets
- Gestion des produits
- Statistiques globales
- Configuration système

---

## 👨‍🌾 Comptes Farmers (Agriculteurs)

### Farmer de Test

```
📧 Email:    test@farmer.com
🔑 Password: Test123!
👤 Rôle:     Farmer
💰 Balance:  1000.00 GYT
```

**Accès:**
- Dashboard Farmer
- Mes Projets
- Mes Produits
- Mes Commandes ✅ (corrigé)
- Mes Investisseurs
- Transactions

### Autres Farmers (mot de passe inconnu)

```
📧 farmer1@agrikonbit.com - Jean Baptiste Farmer
📧 farmer2@agrikonbit.com - Marie Claire Agriculteur
📧 farmer3@agrikonbit.com - Pierre Louis Cultivateur
```

---

## 💼 Comptes Investors (Investisseurs)

### Investors (mot de passe inconnu)

```
📧 investor1@agrikonbit.com - Sarah Johnson (Balance: 1000 GYT)
📧 investor2@agrikonbit.com - Michel Dubois (Balance: 500 GYT)
```

**Accès:**
- Dashboard Investor
- Projets disponibles
- Mes Investissements
- Retours sur investissement
- Wallet

---

## 🛒 Comptes Consumers (Consommateurs)

### Consumer (mot de passe inconnu)

```
📧 consumer1@agrikonbit.com - Anna Rodriguez (Balance: 250 GYT)
```

**Accès:**
- Dashboard Consumer
- Marketplace
- Mes Commandes
- Panier
- Favoris

---

## 🚀 Comment Utiliser ces Comptes

### 1. Démarrer les Serveurs

```bash
# Option 1: Automatique
start-dev.bat

# Option 2: Manuel
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm start
```

### 2. Se Connecter

1. Ouvrir http://localhost:3000/login
2. Choisir un compte ci-dessus
3. Entrer l'email et le mot de passe
4. Cliquer sur "Se connecter"

---

## 🔧 Scripts de Gestion des Comptes

### Créer/Modifier le Compte Admin

```bash
cd migrations
node create-admin.js
```

### Créer un Compte Farmer de Test

```bash
cd migrations
node create-test-user.js
```

### Lister Tous les Utilisateurs

```bash
cd migrations
node check-users.js
```

---

## 🔑 Réinitialiser un Mot de Passe

### Via Script SQL (phpMyAdmin ou MySQL)

```sql
USE agrikonbit;

-- Mot de passe: Admin123!
UPDATE users 
SET password_hash = '$2a$10$YourBcryptHashHere'
WHERE email = 'admin@agrikonbit.com';
```

### Via Script Node.js

Créez un fichier `reset-password.js`:

```javascript
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetPassword(email, newPassword) {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agrikonbit'
  });
  
  const hash = await bcrypt.hash(newPassword, 10);
  await conn.execute(
    'UPDATE users SET password_hash = ? WHERE email = ?',
    [hash, email]
  );
  
  console.log(`✅ Mot de passe mis à jour pour ${email}`);
  await conn.end();
}

// Utilisation
resetPassword('admin@agrikonbit.com', 'NouveauMotDePasse123!');
```

---

## 📊 Résumé des Comptes

| Email | Rôle | Mot de Passe | Balance GYT | Status |
|-------|------|--------------|-------------|--------|
| admin@agrikonbit.com | Admin | ✅ Admin123! | 10000 | Actif |
| test@farmer.com | Farmer | ✅ Test123! | 1000 | Actif |
| farmer1@agrikonbit.com | Farmer | ❌ Inconnu | - | Actif |
| farmer2@agrikonbit.com | Farmer | ❌ Inconnu | - | Actif |
| farmer3@agrikonbit.com | Farmer | ❌ Inconnu | - | Actif |
| investor1@agrikonbit.com | Investor | ❌ Inconnu | 1000 | Actif |
| investor2@agrikonbit.com | Investor | ❌ Inconnu | 500 | Actif |
| consumer1@agrikonbit.com | Consumer | ❌ Inconnu | 250 | Actif |

**Total:** 8 utilisateurs (1 admin, 4 farmers, 2 investors, 1 consumer)

---

## 🧪 Tests Recommandés par Rôle

### Test Admin

1. Se connecter avec `admin@agrikonbit.com`
2. Accéder au Dashboard Admin
3. Voir les statistiques globales
4. Gérer les utilisateurs
5. Valider/rejeter des projets
6. Gérer les produits

### Test Farmer

1. Se connecter avec `test@farmer.com`
2. Accéder au Dashboard Farmer
3. Voir "Mes Commandes" ✅
4. Vérifier l'affichage "GYT" (pas "DOLLAR") ✅
5. Tester la mise à jour du statut d'une commande ✅
6. Créer un nouveau produit
7. Créer un nouveau projet

### Test Investor

1. Se connecter avec un compte investor (créer d'abord le mot de passe)
2. Parcourir les projets disponibles
3. Investir dans un projet
4. Voir le dashboard investor

### Test Consumer

1. Se connecter avec un compte consumer (créer d'abord le mot de passe)
2. Parcourir la marketplace
3. Ajouter des produits au panier
4. Passer une commande

---

## 🔒 Sécurité

### En Développement

✅ Mots de passe simples pour faciliter les tests  
✅ Comptes de test pré-configurés  
✅ Tous les utilisateurs sont actifs et vérifiés

### En Production

🚨 **À FAIRE ABSOLUMENT:**

1. **Changer tous les mots de passe**
2. **Supprimer les comptes de test**
3. **Utiliser des mots de passe forts** (min 12 caractères, majuscules, minuscules, chiffres, symboles)
4. **Activer la vérification email**
5. **Activer le KYC pour farmers et investors**
6. **Configurer le rate limiting strict**
7. **Activer HTTPS**
8. **Configurer les variables d'environnement sécurisées**

---

## 📞 Support

### Problème de Connexion ?

1. Vérifier que les serveurs sont démarrés
2. Consulter `DIAGNOSTIC_CONNEXION.md`
3. Exécuter `node migrations/check-users.js`
4. Vérifier les logs du backend

### Créer un Nouveau Compte de Test ?

```bash
cd migrations
node create-admin.js      # Pour un admin
node create-test-user.js  # Pour un farmer
```

---

## 📝 Notes

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 7 jours (configurable dans `.env`)
- Les wallets sont créés automatiquement pour les nouveaux utilisateurs
- Tous les comptes de test sont pré-vérifiés (email_verified = true)

---

**Dernière mise à jour:** 14 Octobre 2025, 19:35 UTC

**Prêt à tester ?** → http://localhost:3000/login
