# 📍 Routes Farmer - Guide Complet

**Date:** 18 Octobre 2025, 11:50 UTC

---

## ✅ Routes Disponibles

### 1. Gestion de Projet 🌱
**URL:** `/farmer/projects/:id/manage`  
**Exemple:** http://localhost:3000/farmer/projects/4/manage

#### Fonctionnalités:
- ✅ **Onglet Overview** - Vue d'ensemble du projet
  - Budget et financement
  - Progression
  - Statistiques investisseurs
  
- ✅ **Onglet Updates** - Mises à jour du projet
  - Publier des nouvelles
  - Historique des mises à jour
  - Notifications aux investisseurs
  
- ✅ **Onglet Withdrawal** - Retrait de fonds
  - Demander un retrait
  - Historique des demandes
  - Suivi du statut

#### Onglets:
```javascript
activeTab: 'overview' | 'updates' | 'withdrawal'
```

#### Backend Endpoints:
```
GET  /api/projects/:id
GET  /api/farmer/projects/:id/updates
GET  /api/farmer/projects/:id/withdrawal-requests
POST /api/farmer/projects/:id/updates
POST /api/farmer/projects/:id/request-withdrawal
```

---

### 2. Modifier un Produit 📦
**URL:** `/farmer/products/:id/edit`  
**Exemple:** http://localhost:3000/farmer/products/1/edit

#### Fonctionnalités:
- ✅ Modifier le nom
- ✅ Modifier la description
- ✅ Modifier le prix (DOLLAR)
- ✅ Modifier le stock
- ✅ Modifier la catégorie
- ✅ Modifier la localisation
- ✅ Ajouter/Supprimer des images
- ✅ Activer/Désactiver le produit

#### Champs Modifiables:
```javascript
{
  name: string,
  description: string,
  priceUsd: number,
  stock: number,
  category: 'cereals' | 'fruits' | 'vegetables' | 'honey' | 'dairy' | 'meat' | 'other',
  originCountry: string,
  originRegion: string,
  organicCertified: boolean,
  images: string[]
}
```

#### Backend Endpoints:
```
GET  /api/products/:id
PUT  /api/products/:id
```

---

### 3. Mises à Jour de Projet (Intégré) 📰

**Note:** La fonctionnalité "project-updates" est **intégrée** dans la page de gestion de projet.

**URL principale:** `/farmer/projects/:id/manage`  
**Onglet:** `updates`

#### Comment Accéder:
1. Aller sur `/farmer/projects/4/manage`
2. Cliquer sur l'onglet "Updates"
3. Publier une nouvelle mise à jour

#### Actions Disponibles:
- ✅ Créer une mise à jour
- ✅ Modifier une mise à jour existante
- ✅ Supprimer une mise à jour
- ✅ Choisir la visibilité (public/privé)
- ✅ Ajouter des images

#### Format d'une Mise à Jour:
```javascript
{
  title: string,
  content: string,
  images: string[],
  is_public: boolean,
  created_at: timestamp
}
```

---

## 📋 Toutes les Routes Farmer

| Route | Description | Status |
|-------|-------------|--------|
| `/farmer/submit-project` | Soumettre un nouveau projet | ✅ |
| `/farmer/my-projects` | Liste de mes projets | ✅ |
| `/farmer/projects/:id/manage` | Gérer un projet (Overview/Updates/Withdrawal) | ✅ |
| `/farmer/add-product` | Ajouter un produit | ✅ |
| `/farmer/my-products` | Liste de mes produits | ✅ |
| `/farmer/products/:id/edit` | Modifier un produit | ✅ |
| `/farmer/orders` | Mes commandes (via dashboard) | ✅ |
| `/farmer/dashboard` | Dashboard farmer | ✅ |

---

## 🎯 Exemples d'Utilisation

### Gérer le Projet #4
```
http://localhost:3000/farmer/projects/4/manage
```

**Onglet Overview:**
- Voir le budget: 15,000 DOLLAR
- Voir le financement: 8,500 DOLLAR (56.7%)
- Nombre d'investisseurs: 12

**Onglet Updates:**
- Publier: "Récolte terminée avec succès!"
- Notifier les 12 investisseurs

**Onglet Withdrawal:**
- Demander un retrait de 5,000 DOLLAR
- Voir le statut: En attente

---

### Modifier le Produit #1 (Tomates Bio)
```
http://localhost:3000/farmer/products/1/edit
```

**Modifications possibles:**
```
Prix: 4.50 → 5.00 DOLLAR (augmentation)
Stock: 500 → 450 unités (mise à jour)
Description: Améliorer la description
Images: Ajouter une nouvelle photo
```

---

## 🔧 Backend API Correspondant

### ProjectManagement
```javascript
// Vue d'ensemble
GET /api/projects/4

// Mises à jour
GET  /api/farmer/projects/4/updates
POST /api/farmer/projects/4/updates
PUT  /api/farmer/projects/4/updates/:updateId
DELETE /api/farmer/projects/4/updates/:updateId

// Retraits
GET  /api/farmer/projects/4/withdrawal-requests
POST /api/farmer/projects/4/request-withdrawal
```

### EditProduct
```javascript
// Récupérer le produit
GET /api/products/1

// Mettre à jour
PUT /api/products/1

// Mettre à jour le stock uniquement
PATCH /api/products/1/stock
```

---

## 📊 Données de Test Disponibles

### Projets
- **ID 4:** Culture de Tomates Bio (Active, 56.7% financé)
- **ID 5:** Élevage de Poulets Fermiers (Active, 90% financé)
- **ID 6:** Production de Café Arabica (Active, 48% financé)
- **ID 7:** Maraîchage Diversifié (Validated, 33.3% financé)
- **ID 8:** Apiculture et Miel Bio (Pending, 0% financé)

### Produits
- **ID 1:** Tomates Bio - 1kg (4.50 DOLLAR, Stock: 500)
- **ID 2:** Salade Verte Bio (2.00 DOLLAR, Stock: 200)
- **ID 3:** Œufs Fermiers (5.00 DOLLAR, Stock: 300)
- **ID 4:** Poulet Fermier (15.00 DOLLAR, Stock: 80)
- **ID 5:** Café Arabica 250g (12.00 DOLLAR, Stock: 150)

---

## 🧪 Tests Recommandés

### Test 1: Gestion Complète de Projet
```bash
# 1. Ouvrir le projet
http://localhost:3000/farmer/projects/4/manage

# 2. Onglet Overview
- Vérifier les stats
- Voir la progression

# 3. Onglet Updates
- Publier une mise à jour
- Vérifier qu'elle apparaît

# 4. Onglet Withdrawal
- Demander un retrait
- Vérifier le statut
```

### Test 2: Modification de Produit
```bash
# 1. Ouvrir le produit
http://localhost:3000/farmer/products/1/edit

# 2. Modifier les informations
- Changer le prix
- Mettre à jour le stock
- Ajouter une image

# 3. Sauvegarder
- Vérifier le toast de succès
- Voir les changements sur le marketplace
```

---

## 🚨 Notes Importantes

### 1. Authentification Required
Toutes ces routes nécessitent:
- ✅ Être connecté
- ✅ Avoir le rôle "farmer"
- ✅ Être propriétaire du projet/produit

### 2. Route /farmer/project-updates/:id
❌ **N'existe pas** et **n'est pas nécessaire**

✅ **Alternative:** Utiliser `/farmer/projects/:id/manage` avec l'onglet "updates"

### 3. Validation Backend
Chaque route a des validations:
- Ownership (le farmer doit être propriétaire)
- Permissions (rôle farmer requis)
- Données valides

---

## 🔄 Redirection après Actions

### Après création/modification:
- ✅ Projet créé → `/farmer/my-projects`
- ✅ Produit créé → `/farmer/my-products`
- ✅ Mise à jour publiée → Reste sur la page (onglet updates)
- ✅ Retrait demandé → Reste sur la page (onglet withdrawal)

---

## 📱 Responsive Design

Toutes les pages sont responsive:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

---

## ✅ Checklist Complète

- [x] `/farmer/projects/:id/manage` - Fonctionnel
- [x] `/farmer/products/:id/edit` - Fonctionnel
- [x] Onglet Updates intégré dans manage
- [x] Routes ajoutées dans App.js
- [x] Backend API compatible
- [x] Authentification en place
- [x] Données de test disponibles
- [x] Documentation créée

---

**Status:** ✅ Toutes les routes sont opérationnelles!

**Pages ouvertes dans votre navigateur:**
1. http://localhost:3000/farmer/projects/4/manage
2. http://localhost:3000/farmer/products/1/edit
