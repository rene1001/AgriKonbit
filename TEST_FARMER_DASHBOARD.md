# 🧪 Test du Dashboard Agriculteur - Guide Complet

## ✅ Checklist de Vérification

### 1. Backend - Routes API

#### Test des routes farmer
```bash
# 1. S'authentifier en tant qu'agriculteur
POST http://localhost:3001/api/auth/login
{
  "email": "farmer@test.com",
  "password": "password123"
}
# → Récupérer le token

# 2. Tester les statistiques du dashboard
GET http://localhost:3001/api/farmer/stats/dashboard
Headers: Authorization: Bearer {token}
# → Doit retourner : projects, products, orders, investors, wallet

# 3. Tester les commandes
GET http://localhost:3001/api/farmer/orders
Headers: Authorization: Bearer {token}
# → Doit retourner la liste des commandes

# 4. Tester les investisseurs
GET http://localhost:3001/api/farmer/investors
Headers: Authorization: Bearer {token}
# → Doit retourner la liste des investisseurs

# 5. Tester les transactions
GET http://localhost:3001/api/farmer/transactions
Headers: Authorization: Bearer {token}
# → Doit retourner l'historique

# 6. Tester les activités
GET http://localhost:3001/api/farmer/activities
Headers: Authorization: Bearer {token}
# → Doit retourner les activités récentes
```

### 2. Frontend - Composants React

#### Vérifications visuelles

**OverviewSection :**
- [ ] Les 4 cartes de statistiques s'affichent correctement
- [ ] Les cartes de financement (3 widgets) sont visibles
- [ ] Les projets récents (max 3) s'affichent
- [ ] Les commandes récentes (max 3) s'affichent
- [ ] Les produits récents (max 3) s'affichent
- [ ] Les liens "Voir tous" fonctionnent

**ProjectsSection :**
- [ ] Les 5 cartes de statistiques par statut s'affichent
- [ ] La liste complète des projets s'affiche
- [ ] Les badges de statut ont les bonnes couleurs
- [ ] La barre de progression du financement fonctionne
- [ ] Le bouton "Nouveau Projet" est visible
- [ ] Le bouton "Modifier" apparaît pour projets pending
- [ ] Le bouton "Ajouter MAJ" apparaît pour projets actifs

**MarketplaceSection :**
- [ ] Les 3 cartes de statistiques produits s'affichent
- [ ] Les 4 cartes de statistiques commandes s'affichent
- [ ] La grille de produits s'affiche (3 colonnes sur desktop)
- [ ] Les filtres de commandes fonctionnent (all, pending, paid, shipped, delivered)
- [ ] Le bouton "Ajouter Produit" est visible
- [ ] Les boutons "Voir" et "Modifier" fonctionnent

**FinancesSection :**
- [ ] Les 3 cartes de portefeuille s'affichent (disponible, gagné, retiré)
- [ ] Les 2 cartes de sources de revenus s'affichent
- [ ] La liste des investisseurs s'affiche (max 5)
- [ ] Le tableau des transactions s'affiche
- [ ] Le bouton "Retirer" est actif si solde > 0
- [ ] La modal de retrait s'ouvre correctement
- [ ] Le formulaire de retrait fonctionne

**NotificationsSection :**
- [ ] Le compteur de notifications non lues s'affiche
- [ ] La liste des notifications s'affiche
- [ ] Les icônes par type de notification sont correctes
- [ ] Le bouton "Marquer comme lu" fonctionne
- [ ] Le bouton "Tout marquer comme lu" fonctionne
- [ ] Les notifications se classent par date (plus récente en premier)

**ProfileSection :**
- [ ] Les informations du profil s'affichent
- [ ] Le mode édition fonctionne (bouton "Modifier")
- [ ] Le formulaire de modification s'enregistre
- [ ] Les informations du compte (KYC, solde) s'affichent
- [ ] L'annulation de l'édition restaure les données

### 3. Navigation et UX

#### Tests de navigation
- [ ] Les onglets changent au clic sans recharger la page
- [ ] L'onglet actif est visuellement distinct (bordure verte)
- [ ] Le badge de notifications (chiffre rouge) s'affiche correctement
- [ ] Le badge disparaît quand toutes les notifications sont lues
- [ ] Les transitions sont fluides

#### Tests responsive
- [ ] Desktop (>1024px) : 3-4 colonnes
- [ ] Tablet (768-1024px) : 2 colonnes
- [ ] Mobile (<768px) : 1 colonne
- [ ] La navigation par onglets scroll horizontalement sur mobile
- [ ] Les boutons sont utilisables sur tactile

### 4. Intégration des Données

#### React Query
- [ ] Les données se chargent au montage du composant
- [ ] L'état de chargement s'affiche ("Chargement...")
- [ ] Les erreurs sont gérées gracieusement
- [ ] Les mutations invalident le cache correctement
- [ ] Les données se rechargent après une action

#### États vides
- [ ] Message "Aucun projet pour le moment" si pas de projets
- [ ] Message "Aucun produit pour le moment" si pas de produits
- [ ] Message "Aucune commande pour le moment" si pas de commandes
- [ ] Message "Aucune notification pour le moment" si pas de notifications
- [ ] Boutons CTA présents dans les états vides

### 5. Fonctionnalités Avancées

#### Retrait de fonds
- [ ] Le solde disponible s'affiche correctement
- [ ] Le bouton est désactivé si solde = 0
- [ ] La modal s'ouvre avec les bons champs
- [ ] La validation du montant fonctionne (max = solde)
- [ ] Les 3 méthodes de retrait sont disponibles
- [ ] La soumission crée une demande de retrait
- [ ] Une notification de succès s'affiche
- [ ] Le cache se rafraîchit après retrait

#### Mise à jour de commande
- [ ] La page de détail de commande charge les données
- [ ] Le formulaire de mise à jour de statut fonctionne
- [ ] Les statuts valides sont : preparing, shipped, delivered
- [ ] Le champ "Numéro de suivi" est optionnel
- [ ] Une notification est envoyée au client
- [ ] Le cache se rafraîchit après mise à jour

#### Notifications
- [ ] Les nouvelles notifications apparaissent en temps réel (ou au refresh)
- [ ] Le badge dans la navigation se met à jour
- [ ] Les notifications non lues ont un fond bleu
- [ ] Les notifications lues ont un fond blanc
- [ ] Le marquage comme lu met à jour l'UI instantanément

### 6. Performance

#### Temps de chargement
- [ ] Dashboard initial : < 2 secondes
- [ ] Changement d'onglet : instantané (données en cache)
- [ ] Chargement des listes : < 1 seconde
- [ ] Mutations (création, modification) : < 1 seconde

#### Optimisations
- [ ] Les images sont optimisées
- [ ] Pas de re-render inutiles
- [ ] Les queries sont mises en cache
- [ ] Lazy loading des composants (optionnel)

### 7. Sécurité

#### Authentification
- [ ] Redirection vers /login si pas de token
- [ ] Token expiré → redirection
- [ ] Seuls les farmers peuvent accéder au dashboard
- [ ] Les routes API vérifient le rôle

#### Validation
- [ ] Les montants de retrait sont validés
- [ ] Les formulaires ont des validations côté client
- [ ] Les API rejettent les données invalides
- [ ] Les messages d'erreur sont clairs

### 8. Tests de Bout en Bout

#### Scénario complet
```
1. Connexion en tant qu'agriculteur
   → Redirection vers /dashboard
   
2. Vue d'ensemble
   → Voir les statistiques
   → Cliquer sur "Voir tous" (projets) → Navigation
   
3. Onglet Projets
   → Voir tous les projets
   → Cliquer "Nouveau Projet" → Navigation vers formulaire
   
4. Onglet Marketplace
   → Voir les produits
   → Changer le filtre des commandes
   → Cliquer sur "Gérer" une commande
   
5. Onglet Finances
   → Voir le solde
   → Ouvrir la modal de retrait
   → Remplir le formulaire
   → Soumettre
   → Vérifier la notification
   
6. Onglet Notifications
   → Voir les notifications
   → Marquer une comme lue
   → Tout marquer comme lu
   
7. Onglet Profil
   → Voir les infos
   → Cliquer "Modifier"
   → Changer des infos
   → Enregistrer
   → Vérifier la mise à jour
```

## 🐛 Problèmes Connus et Solutions

### Problème : "Cannot read property 'gyt_balance' of undefined"
**Solution :** Vérifier que le user_wallets existe pour l'utilisateur
```sql
INSERT INTO user_wallets (user_id, gyt_balance) VALUES (1, 0);
```

### Problème : "404 on /api/farmer/stats/dashboard"
**Solution :** Vérifier que les routes sont enregistrées dans `server/index.js`
```javascript
app.use('/api/farmer', farmerRoutes);
```

### Problème : Les composants ne s'affichent pas
**Solution :** Vérifier les imports dans `FarmerDashboard.js`
```javascript
import OverviewSection from '../../components/Dashboard/OverviewSection';
```

### Problème : Les données ne se chargent pas
**Solution :** Vérifier la console du navigateur pour les erreurs API
- Token expiré ?
- CORS configuré ?
- Route correcte ?

### Problème : React Query ne met pas à jour
**Solution :** Vérifier les keys de query et l'invalidation
```javascript
queryClient.invalidateQueries(['farmer-stats']);
```

## 📝 Commandes Utiles

### Démarrer le backend
```bash
cd server
npm start
```

### Démarrer le frontend
```bash
cd client
npm start
```

### Tester les routes avec curl
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"password123"}'

# Dashboard stats
curl http://localhost:3001/api/farmer/stats/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Vérifier les logs
```bash
# Backend logs
tail -f server/logs/app.log

# Database queries
mysql -u root -p agrikonbit
```

## ✅ Critères de Succès

Le Dashboard est considéré comme **fonctionnel** si :

1. ✅ Toutes les 6 sections s'affichent sans erreur
2. ✅ Les données se chargent depuis l'API
3. ✅ Les statistiques sont correctes
4. ✅ Les mutations (retrait, mise à jour) fonctionnent
5. ✅ La navigation est fluide
6. ✅ Le design est responsive
7. ✅ Les notifications fonctionnent
8. ✅ Aucune erreur dans la console

## 🎯 Next Steps

Après validation des tests :
- [ ] Déployer sur staging
- [ ] Tests utilisateurs réels
- [ ] Ajustements UX basés sur feedback
- [ ] Optimisations de performance
- [ ] Documentation utilisateur finale

---

**Test réalisé par** : _____________  
**Date** : _____________  
**Résultat** : ✅ PASS | ❌ FAIL  
**Notes** : _____________
