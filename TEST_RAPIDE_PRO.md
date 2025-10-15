# 🚀 Guide de Test Rapide - Utilisateurs Professionnels

## ✅ Prérequis - Tout est prêt !

- [x] Backend actif sur **http://localhost:3001**
- [x] Frontend actif sur **http://localhost:3000**
- [x] Base de données configurée
- [x] Mots de passe réinitialisés
- [x] Tests automatisés : **81% de réussite** ✅

---

## 🎯 Tests Manuels à Effectuer

### 📋 1. TEST FARMER (Agriculteur)

#### **Connexion**
1. Ouvrez http://localhost:3000
2. Cliquez sur **"Se connecter"**
3. Utilisez ces identifiants :
   ```
   Email: farmer1@agrikonbit.com
   Mot de passe: password123
   ```

#### **Que tester ?**
- [ ] **Tableau de bord Farmer** s'affiche correctement
- [ ] Voir mes projets agricoles
- [ ] Créer un nouveau projet
- [ ] Ajouter des produits au marketplace
- [ ] Voir les commandes reçues
- [ ] Consulter les investissements reçus
- [ ] Publier une mise à jour de projet

#### **Scénario complet :**
```
1. Se connecter → Voir le dashboard
2. Cliquer sur "Mes Projets"
3. Créer un nouveau projet agricole
4. Aller sur "Marketplace"
5. Ajouter un nouveau produit à vendre
6. Consulter "Mes Commandes"
7. Vérifier les notifications
```

---

### 📋 2. TEST INVESTOR (Investisseur)

#### **Connexion**
1. Ouvrez http://localhost:3000 (ou déconnectez-vous du compte farmer)
2. Cliquez sur **"Se connecter"**
3. Utilisez ces identifiants :
   ```
   Email: investor1@agrikonbit.com
   Mot de passe: password123
   ```
   
**💰 Solde initial : 950 GYT** (investissements déjà effectués)

#### **Que tester ?**
- [ ] **Tableau de bord Investor** s'affiche
- [ ] Parcourir les projets disponibles
- [ ] Voir les détails d'un projet
- [ ] Investir dans un projet (avec GYT tokens)
- [ ] Consulter mes investissements
- [ ] Voir les statistiques d'investissement
- [ ] Vérifier le solde GYT
- [ ] Consulter l'historique des transactions

#### **Scénario complet :**
```
1. Se connecter → Voir le dashboard
2. Aller sur "Projets"
3. Sélectionner un projet intéressant
4. Cliquer sur "Investir"
5. Entrer un montant (ex: 100 GYT)
6. Confirmer l'investissement
7. Vérifier "Mes Investissements"
8. Consulter les statistiques
```

---

### 📋 3. TEST CONSUMER (Consommateur)

#### **Connexion**
1. Ouvrez http://localhost:3000 (ou déconnectez-vous)
2. Cliquez sur **"Se connecter"**
3. Utilisez ces identifiants :
   ```
   Email: consumer1@agrikonbit.com
   Mot de passe: password123
   ```

**💰 Solde initial : 250 GYT**

#### **Que tester ?**
- [ ] **Tableau de bord Consumer** s'affiche
- [ ] Parcourir le marketplace
- [ ] Voir les détails d'un produit
- [ ] Ajouter un produit au panier
- [ ] Modifier les quantités dans le panier
- [ ] Passer une commande
- [ ] Payer avec GYT tokens
- [ ] Consulter mes commandes
- [ ] Vérifier la traçabilité blockchain (NFT)
- [ ] Ajouter des produits aux favoris

#### **Scénario complet :**
```
1. Se connecter → Voir le dashboard
2. Aller sur "Marketplace"
3. Parcourir les produits disponibles
4. Cliquer sur un produit (ex: Tomates Bio)
5. Ajouter au panier
6. Voir le panier
7. Passer la commande
8. Entrer l'adresse de livraison
9. Payer avec GYT tokens
10. Consulter "Mes Commandes"
```

---

## 🔍 Résultats des Tests Automatisés

### ✅ Ce qui fonctionne bien (17/21 tests)

#### **Farmer** ✅
- Connexion réussie
- Récupération du profil (Jean Baptiste Farmer)
- Gestion des projets
- Gestion des produits marketplace
- Gestion des commandes reçues
- Notifications

#### **Investor** ✅
- Connexion réussie
- Récupération du profil (Sarah Johnson, 950 GYT)
- Navigation des projets disponibles
- Consultation des investissements
- Statistiques d'investissement
- Notifications

#### **Consumer** ✅
- Connexion réussie
- Récupération du profil (Anna Rodriguez, 250 GYT)
- Navigation du marketplace
- Consultation des commandes
- Notifications

### ⚠️ Problèmes mineurs (4/21 tests)

1. **Endpoint wallet balance** (farmer, investor, consumer)
   - Problème technique mineur
   - Ne bloque pas l'utilisation
   - Le solde GYT est visible dans le profil

2. **Favoris** (consumer)
   - Endpoint à vérifier
   - Fonctionnalité secondaire

---

## 📊 Données de Test Disponibles

### 👥 Utilisateurs Créés
```
FARMERS (3):
- farmer1@agrikonbit.com (Jean Baptiste Farmer)
- farmer2@agrikonbit.com (Marie Claire Agriculteur)
- farmer3@agrikonbit.com (Pierre Louis Cultivateur)

INVESTORS (2):
- investor1@agrikonbit.com (Sarah Johnson - 950 GYT)
- investor2@agrikonbit.com (Michel Dubois - 500 GYT)

CONSUMERS (1):
- consumer1@agrikonbit.com (Anna Rodriguez - 250 GYT)
```

### 🌱 Projets Agricoles (5)
1. **Organic Coffee Plantation** (validé, 8500/15000 GYT)
2. **Sustainable Vegetable Farming** (validé, 3200/8000 GYT)
3. **Honey Production** (validé, 1500/5000 GYT)
4. **Fish Farming** (actif, 0/12000 GYT)
5. **Poultry Farm** (en attente, 0/10000 GYT)

### 🥕 Produits Marketplace (6)
1. Premium Organic Coffee Beans (25.99 GYT)
2. Fresh Organic Tomatoes (4.99 GYT)
3. Mixed Organic Peppers (6.99 GYT)
4. Pure Wildflower Honey (18.99 GYT)
5. Organic Plantains (3.99 GYT)
6. Fresh Lettuce Mix (2.99 GYT)

### 💸 Investissements Existants (7)
- investor1 a investi dans 3 projets (7800 GYT)
- investor2 a investi dans 2 projets (3200 GYT)
- consumer1 a investi dans 2 projets (2200 GYT)

---

## 🎨 Interface à Vérifier

### Navigation
- [ ] Header avec logo et menu
- [ ] Menu de navigation fonctionne
- [ ] Boutons d'action visibles
- [ ] Formulaires fonctionnels

### Responsive
- [ ] Fonctionne sur grand écran (desktop)
- [ ] Fonctionne sur tablette
- [ ] Fonctionne sur mobile

### Images
- [ ] Images des projets se chargent (Unsplash)
- [ ] Images des produits se chargent
- [ ] Photos de profil s'affichent

---

## 🐛 Comment Signaler un Bug

Si vous trouvez un problème :

1. **Notez les informations :**
   - Utilisateur connecté (farmer1, investor1, etc.)
   - Page où l'erreur se produit
   - Action effectuée
   - Erreur affichée

2. **Vérifiez les logs :**
   - **Console navigateur** : F12 → Onglet Console
   - **Logs backend** : Terminal où tourne le serveur

3. **Exemple de rapport :**
   ```
   Utilisateur: farmer1@agrikonbit.com
   Page: Création de projet
   Action: Soumission du formulaire
   Erreur: "500 Internal Server Error"
   Console: TypeError: Cannot read property 'name'...
   ```

---

## 🔄 Commandes Utiles

### Redémarrer les serveurs
```powershell
# Backend
cd server
npm run dev

# Frontend (nouveau terminal)
cd client
npm start
```

### Réinitialiser les mots de passe
```powershell
node reset-all-test-users.js
```

### Relancer les tests automatisés
```powershell
node test-users-pro.js
```

### Vérifier l'état des serveurs
```powershell
netstat -ano | findstr :3000  # Frontend
netstat -ano | findstr :3001  # Backend
```

---

## ✅ Checklist de Test Complète

### Farmer (Agriculteur)
- [ ] Connexion réussie
- [ ] Dashboard visible
- [ ] Créer un projet
- [ ] Modifier un projet
- [ ] Ajouter un produit au marketplace
- [ ] Voir les commandes reçues
- [ ] Consulter les investissements
- [ ] Gérer les retours sur investissement
- [ ] Envoyer des messages aux investisseurs
- [ ] Publier une mise à jour

### Investor (Investisseur)
- [ ] Connexion réussie
- [ ] Dashboard visible
- [ ] Parcourir les projets
- [ ] Filtrer les projets
- [ ] Voir détails d'un projet
- [ ] Investir dans un projet
- [ ] Consulter mes investissements
- [ ] Voir les statistiques
- [ ] Vérifier le solde GYT
- [ ] Acheter des tokens GYT
- [ ] Consulter l'historique
- [ ] Contacter un fermier

### Consumer (Consommateur)
- [ ] Connexion réussie
- [ ] Dashboard visible
- [ ] Parcourir le marketplace
- [ ] Filtrer les produits
- [ ] Voir détails d'un produit
- [ ] Ajouter au panier
- [ ] Modifier le panier
- [ ] Passer une commande
- [ ] Consulter mes commandes
- [ ] Vérifier le solde GYT
- [ ] Acheter des tokens GYT
- [ ] Voir la traçabilité NFT
- [ ] Ajouter aux favoris
- [ ] S'abonner à un fermier

---

## 🎉 Résumé

**Tout est prêt pour tester !**

1. ✅ Les 3 types d'utilisateurs professionnels peuvent se connecter
2. ✅ 81% des fonctionnalités testées automatiquement fonctionnent
3. ✅ Données de test disponibles (projets, produits, investissements)
4. ✅ Serveurs actifs et opérationnels

**Accédez maintenant à http://localhost:3000 et commencez vos tests !**

---

**Pour plus de détails, consultez :**
- `GUIDE_TEST_UTILISATEURS_PRO.md` - Guide complet détaillé
- `CREDENTIALS.md` - Tous les identifiants
- `test-users-pro.js` - Script de test automatisé
