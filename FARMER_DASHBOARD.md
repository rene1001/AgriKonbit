# 🌾 Dashboard Agriculteur/Éleveur - AgriKonbit

## Vue d'ensemble

Le Dashboard Agriculteur a été conçu comme un **centre de gestion complet** permettant aux agriculteurs et éleveurs de gérer tous les aspects de leur activité sur la plateforme AgriKonbit.

## 📁 Structure du Code

### Composants Modulaires
```
client/src/
├── pages/Dashboard/
│   └── FarmerDashboard.js          # Dashboard principal avec navigation par onglets
└── components/Dashboard/
    ├── OverviewSection.js           # Vue d'ensemble et statistiques
    ├── ProjectsSection.js           # Gestion des projets
    ├── MarketplaceSection.js        # Gestion des produits et commandes
    ├── FinancesSection.js           # Finances et retraits
    ├── NotificationsSection.js      # Centre de notifications
    └── ProfileSection.js            # Gestion du profil
```

### Routes API Backend
```
server/routes/
└── farmer.js                        # Routes API dédiées aux agriculteurs
```

## 🎯 Fonctionnalités Implémentées

### 1️⃣ Vue d'Ensemble (OverviewSection)
**Statistiques en temps réel :**
- 📊 Projets actifs
- 🛒 Produits en vente
- 📦 Commandes en cours
- 💰 Solde GYT disponible

**Widgets rapides :**
- Financement total reçu
- Nombre d'investisseurs
- Revenus de la marketplace
- Projets récents (top 3)
- Commandes récentes (top 3)
- Produits en vitrine (top 3)

### 2️⃣ Gestion des Projets (ProjectsSection)
**Fonctionnalités :**
- ✅ Vue complète de tous les projets
- 📊 Statistiques par statut (total, en attente, validés, actifs, terminés)
- 🔄 Statuts en temps réel (pending, validated, active, completed, rejected)
- 📈 Barre de progression du financement
- 👥 Nombre d'investisseurs par projet
- ✏️ Modification des projets en attente
- 📝 Ajout de mises à jour pour projets actifs
- ➕ Bouton création de nouveau projet

### 3️⃣ Marketplace (MarketplaceSection)
**Gestion des Produits :**
- 🛍️ Grille de tous les produits
- ✅ Statut actif/inactif
- 💰 Prix en USD et GYT
- 📦 Gestion des stocks
- 🏷️ Catégories et certifications bio
- ✏️ Modification des produits
- ➕ Ajout de nouveaux produits

**Gestion des Commandes :**
- 📋 Liste complète des commandes
- 🔍 Filtres par statut (pending, paid, shipped, delivered)
- 👤 Informations client
- 📊 Statistiques (pending, paid, shipped, delivered)
- 🚚 Mise à jour du statut de commande
- 📍 Numéro de suivi

### 4️⃣ Finances (FinancesSection)
**Portefeuille :**
- 💰 Solde GYT disponible
- 📈 Total gagné (all-time)
- 💸 Total retiré

**Sources de Revenus :**
- 🌱 Financement de projets
- 🛒 Ventes marketplace

**Retraits :**
- 💸 Demande de retrait
- 🏦 Méthodes : virement bancaire, mobile money, crypto wallet
- ✅ Validation et traitement

**Investisseurs :**
- 👥 Liste des investisseurs
- 💵 Montants investis
- 📊 Nombre d'investissements par investisseur

**Historique :**
- 📊 Table des transactions
- 🔍 Types : deposit, withdrawal, payment
- ✅ Statuts : completed, pending, failed

### 5️⃣ Notifications (NotificationsSection)
**Système de notifications :**
- 🔔 Centre de notifications complet
- 🔴 Badge de notifications non lues
- ✅ Marquer comme lu (individuel)
- ✅ Tout marquer comme lu
- 📅 Dates et heures formatées
- 🎨 Icônes par type de notification

**Types de notifications :**
- ✅ Projet validé
- 🔄 Projet actif
- ❌ Projet rejeté
- 💰 Nouvel investissement
- 📦 Commande reçue
- 🔄 Mise à jour de commande
- 💵 Paiement reçu

### 6️⃣ Profil (ProfileSection)
**Informations personnelles :**
- 👤 Nom complet
- 📧 Email
- 📱 Téléphone
- 🌍 Pays et ville
- 🏠 Adresse
- ✏️ Mode édition

**Informations du compte :**
- ✅ Statut KYC (verified, pending, not_verified)
- 💰 Solde GYT
- 🎭 Rôle (farmer)

## 🔌 API Endpoints

### Routes Farmer (`/api/farmer`)
```javascript
GET    /stats/dashboard        // Statistiques complètes du dashboard
GET    /orders                 // Commandes reçues
GET    /orders/:id             // Détails d'une commande
PATCH  /orders/:id/status      // Mise à jour du statut de commande
GET    /investors              // Liste des investisseurs
GET    /transactions           // Historique des transactions
POST   /withdraw               // Demande de retrait
GET    /activities             // Activités récentes
```

### Routes Projets (`/api/projects`)
```javascript
GET    /                       // Liste des projets
GET    /:id                    // Détails d'un projet
POST   /                       // Créer un projet
PUT    /:id                    // Modifier un projet
GET    /farmer/my-projects     // Mes projets
POST   /:id/updates            // Ajouter une mise à jour
```

### Routes Produits (`/api/products`)
```javascript
GET    /                       // Liste des produits
GET    /:id                    // Détails d'un produit
POST   /                       // Créer un produit
GET    /farmer/my-products     // Mes produits
PATCH  /:id/stock              // Mettre à jour le stock
```

### Routes Utilisateurs (`/api/users`)
```javascript
GET    /profile                // Mon profil
PUT    /profile                // Modifier le profil
GET    /notifications          // Mes notifications
PATCH  /notifications/:id/read // Marquer notification comme lue
PATCH  /notifications/read-all // Tout marquer comme lu
```

## 🎨 Interface Utilisateur

### Design System
- **Couleurs principales :**
  - Vert : `#16a34a` (actions principales, succès)
  - Bleu : `#2563eb` (informations)
  - Jaune : `#eab308` (en attente)
  - Rouge : `#dc2626` (erreurs, rejets)
  - Violet : `#9333ea` (finances)

- **Composants :**
  - Cartes avec ombres (`shadow-sm`)
  - Bordures arrondies (`rounded-lg`)
  - Transitions fluides
  - États hover interactifs
  - Responsive (mobile-first)

### Navigation
- **Onglets horizontaux** avec défilement sur mobile
- **Badge de notifications** sur l'onglet Notifications
- **Indicateurs visuels** pour l'onglet actif
- **Navigation fluide** sans rechargement de page

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px (1 colonne)
- **Tablet** : 768px - 1024px (2 colonnes)
- **Desktop** : > 1024px (3-4 colonnes)

### Adaptations mobiles
- Navigation par onglets avec scroll horizontal
- Grilles adaptatives (1 → 2 → 3 colonnes)
- Boutons pleine largeur sur mobile
- Textes et espaces optimisés

## 🔒 Sécurité

### Authentification
- Token JWT requis pour toutes les routes
- Middleware `requireFarmer` pour vérifier le rôle
- Validation des permissions par projet/produit

### Validation
- Validation des données avec `express-validator`
- Protection contre les injections SQL
- Sanitization des inputs utilisateur

## 🚀 Utilisation

### Pour les Développeurs

**1. Backend - Démarrer le serveur :**
```bash
cd server
npm install
npm start
```

**2. Frontend - Démarrer React :**
```bash
cd client
npm install
npm start
```

**3. Accéder au Dashboard :**
- Se connecter avec un compte `role: farmer`
- Naviguer vers `/dashboard`
- Le routeur affichera automatiquement `FarmerDashboard`

### Pour les Agriculteurs

**1. Connexion :**
- Email + mot de passe
- Ou Web3 (MetaMask)

**2. Navigation :**
- Cliquer sur les onglets pour changer de section
- Toutes les données se chargent en temps réel

**3. Actions rapides :**
- Boutons "Nouveau Projet" et "Ajouter Produit" toujours visibles
- Liens "Voir tous" pour accéder aux listes complètes

## 📊 Statistiques et Analytics

### Métriques Principales
- **Projets** : Total, validés, actifs, en attente, rejetés, terminés
- **Produits** : Actifs, inactifs, stock total
- **Commandes** : Pending, paid, shipped, delivered, total
- **Finances** : Solde, total gagné, total retiré, revenus par source
- **Investisseurs** : Total, investissements

### Agrégations
- Financement total en GYT et USD
- Revenus marketplace en GYT et USD
- Statistiques par investisseur

## 🔄 État et Gestion des Données

### React Query
- Cache automatique des données
- Invalidation intelligente après mutations
- Loading states et error handling
- Refetch automatique

### Queries principales
```javascript
['farmer-stats']           // Stats du dashboard
['farmer-projects']        // Projets de l'agriculteur
['farmer-products']        // Produits de l'agriculteur
['farmer-orders-recent']   // Commandes récentes
['farmer-orders', filter]  // Commandes filtrées
['farmer-investors']       // Investisseurs
['farmer-transactions']    // Transactions
['notifications']          // Notifications non lues
['notifications-all']      // Toutes les notifications
['profile']                // Profil utilisateur
```

## 🎯 Prochaines Améliorations

### Features à venir
- 📸 Upload d'images pour projets et produits
- 📊 Graphiques de performance (Chart.js)
- 💬 Messagerie directe avec investisseurs
- 📄 Export de rapports (PDF, CSV)
- 🔔 Notifications push en temps réel (WebSocket)
- 🌍 Carte interactive des projets
- 📱 Application mobile (React Native)
- 🤖 Suggestions IA pour optimiser les ventes

### Optimisations techniques
- Pagination côté serveur
- Lazy loading des composants
- Service Worker pour offline
- Compression des images
- CDN pour assets statiques

## 📝 Notes Importantes

### Base de données
- Tables requises : `projects`, `products`, `orders`, `order_items`, `investments`, `transactions`, `notifications`, `users`, `user_wallets`
- Indexes sur : `farmer_id`, `user_id`, `project_id`, `product_id`

### Performance
- Queries optimisées avec JOINs
- Limit/Offset pour pagination
- Caching côté client (React Query)

### Maintenance
- Code modulaire et réutilisable
- Composants découplés
- Documentation inline
- Tests unitaires recommandés

## ✅ Checklist de Déploiement

- [x] Routes API backend créées
- [x] Composants React modulaires
- [x] Dashboard principal assemblé
- [x] Intégration React Query
- [x] Design responsive
- [x] Gestion des erreurs
- [ ] Tests unitaires
- [ ] Tests E2E
- [ ] Documentation API (Swagger)
- [ ] Monitoring et logs

## 👥 Support

Pour toute question ou problème :
- Consulter cette documentation
- Vérifier les logs serveur
- Tester les endpoints avec Postman
- Valider l'authentification JWT

---

**Version** : 1.0.0  
**Date** : 2025-10-01  
**Auteur** : Équipe AgriKonbit
