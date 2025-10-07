# 🔐 Références de Connexion - AgriKonbit

## 📊 Base de Données

```
Host:     localhost
Port:     3306
Database: agrikonbit
User:     root
Password: (vide)
```

## 👥 Comptes de Test

### 👨‍🌾 Fermiers (Farmers)

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| farmer1@agrikonbit.com | password123 | farmer |
| farmer2@agrikonbit.com | password123 | farmer |
| farmer3@agrikonbit.com | password123 | farmer |

**Permissions :**
- Créer et gérer des projets agricoles
- Ajouter des produits au marketplace
- Voir les investissements reçus
- Publier des mises à jour de projets

### 💰 Investisseurs (Investors)

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| investor1@agrikonbit.com | password123 | investor |
| investor2@agrikonbit.com | password123 | investor |

**Permissions :**
- Investir dans des projets
- Voir le portefeuille d'investissements
- Recevoir des retours sur investissement
- Accéder aux statistiques d'investissement

### 🛒 Consommateur (Consumer)

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| consumer1@agrikonbit.com | password123 | consumer |

**Permissions :**
- Acheter des produits sur le marketplace
- Suivre les commandes
- Accéder à la traçabilité des produits
- Gérer le panier d'achat

## 🚀 Démarrage de l'Application

### 1. Démarrer le Backend (Port 5000)
```bash
cd server
npm run dev
```

### 2. Démarrer le Frontend (Port 3000)
```bash
cd client
npm start
```

### 3. Démarrer les deux en même temps
```bash
npm run dev
```

## 🌐 URLs d'Accès

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api-docs (en mode développement)
- **Health Check:** http://localhost:5000/health

## 📋 Endpoints API Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Projets
- `GET /api/projects` - Liste des projets
- `GET /api/projects/:id` - Détails d'un projet
- `POST /api/projects` - Créer un projet (farmer)
- `GET /api/projects/farmer/my-projects` - Mes projets (farmer)

### Marketplace
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Ajouter un produit (farmer)

### Investissements
- `POST /api/investments` - Investir dans un projet
- `GET /api/investments/my-investments` - Mes investissements
- `GET /api/investments/stats/overview` - Statistiques

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/my-orders` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande

## 🔧 Scripts Utiles

```bash
# Migrer la base de données
npm run migrate

# Insérer des données de test
cd server && npm run seed

# Mettre à jour les mots de passe des utilisateurs de test
cd server && npm run update-users

# Lancer les tests
npm test

# Lancer les tests E2E
npm run e2e
```

## 💡 Données de Test Disponibles

### Projets
- 5 projets agricoles avec différents statuts (validated, active, pending)
- Images depuis Unsplash
- Différentes catégories : crops, livestock, fishing, other

### Produits
- 6 produits disponibles sur le marketplace
- Catégories : vegetables, fruits, honey, other
- Tous certifiés biologiques
- Stock disponible

### Investissements
- 7 investissements déjà effectués
- Différents types de retour : financial, physical, mixed
- Projets partiellement et totalement financés

### Portefeuilles
- Investisseurs avec solde GYT initial
- investor1: 1000 GYT
- investor2: 500 GYT
- consumer1: 250 GYT

## ⚠️ Notes Importantes

1. **JWT_SECRET** : Changez la clé JWT en production
2. **Mots de passe** : Les mots de passe de test ne doivent PAS être utilisés en production
3. **Base de données** : Sauvegardez vos données avant de relancer les migrations
4. **CORS** : Le backend accepte les requêtes depuis localhost:3000 et localhost:3001

## 🐛 Dépannage

### Problème de connexion à la base de données
```bash
# Vérifier que MySQL est démarré
# Vérifier les credentials dans .env
# Vérifier que la base de données existe
```

### Erreur JWT
```bash
# Vérifier que JWT_SECRET est défini dans .env
# Minimum 32 caractères recommandé
```

### Images ne s'affichent pas
```bash
# Les corrections ont été appliquées
# Vérifier la console du navigateur pour les erreurs
# Les images utilisent Unsplash (connexion internet requise)
```

## 📞 Support

Pour toute question ou problème, consultez :
- `BUGFIXES.md` - Corrections appliquées
- `IMAGE_FIXES.md` - Corrections d'affichage d'images
- Logs du serveur dans la console
