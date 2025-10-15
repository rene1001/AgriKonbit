# 🧪 Guide de Test - Utilisateurs Professionnels AgriKonbit

## 🌐 Accès à l'Application

**URL Frontend** : http://localhost:3000  
**URL Backend API** : http://localhost:3001  
**API Documentation** : http://localhost:3001/api-docs

## 📋 Types d'Utilisateurs Professionnels

### 1. 👨‍🌾 FARMER (Agriculteur)

#### **Identifiants de Test**
| Email | Mot de passe |
|-------|--------------|
| farmer1@agrikonbit.com | password123 |
| farmer2@agrikonbit.com | password123 |
| farmer3@agrikonbit.com | password123 |

#### **Fonctionnalités à Tester**

##### ✅ Tableau de Bord Farmer
1. Accédez à http://localhost:3000
2. Cliquez sur **"Se connecter"**
3. Connectez-vous avec `farmer1@agrikonbit.com` / `password123`
4. Vérifiez que vous êtes redirigé vers le **Dashboard Farmer**

##### ✅ Gestion des Projets
- [ ] **Créer un nouveau projet agricole**
  - Titre du projet
  - Description détaillée
  - Catégorie (crops, livestock, fishing, other)
  - Montant à financer
  - Date de fin de financement
  - Images du projet
  
- [ ] **Voir mes projets**
  - Liste de tous vos projets
  - Statut (pending, validated, active, completed, cancelled)
  - Montant collecté vs objectif
  
- [ ] **Modifier un projet**
  - Mettre à jour les informations
  - Ajouter des images
  
- [ ] **Publier des mises à jour**
  - Ajouter des nouvelles sur l'avancement
  - Informer les investisseurs

##### ✅ Marketplace - Vente de Produits
- [ ] **Ajouter un produit**
  - Nom et description
  - Catégorie (vegetables, fruits, honey, other)
  - Prix unitaire
  - Unité de mesure (kg, piece, liter)
  - Stock disponible
  - Images du produit
  - Certification bio
  
- [ ] **Gérer les produits**
  - Voir la liste de mes produits
  - Modifier un produit
  - Activer/désactiver un produit
  
- [ ] **Gérer les commandes**
  - Voir les commandes reçues
  - Changer le statut (pending → confirmed → shipped → delivered)
  - Voir les détails de chaque commande

##### ✅ Gestion Financière
- [ ] **Voir les investissements reçus**
  - Liste des investisseurs
  - Montants investis par projet
  
- [ ] **Consulter le portefeuille GYT**
  - Solde actuel en tokens GYT
  - Historique des transactions
  
- [ ] **Gérer les retours sur investissement**
  - Définir les types de retour (financial, physical, mixed)
  - Planifier les retours

##### ✅ Communication
- [ ] **Messagerie**
  - Recevoir des messages des investisseurs
  - Répondre aux questions
  
- [ ] **Notifications**
  - Recevoir des alertes pour nouveaux investissements
  - Alertes pour nouvelles commandes

---

### 2. 💰 INVESTOR (Investisseur)

#### **Identifiants de Test**
| Email | Mot de passe | Solde GYT Initial |
|-------|--------------|-------------------|
| investor1@agrikonbit.com | password123 | 1000 GYT |
| investor2@agrikonbit.com | password123 | 500 GYT |

#### **Fonctionnalités à Tester**

##### ✅ Tableau de Bord Investisseur
1. Connectez-vous avec `investor1@agrikonbit.com` / `password123`
2. Vérifiez l'accès au **Dashboard Investisseur**

##### ✅ Explorer et Investir
- [ ] **Parcourir les projets**
  - Voir tous les projets disponibles
  - Filtrer par catégorie
  - Filtrer par statut
  - Rechercher par mots-clés
  
- [ ] **Détails d'un projet**
  - Voir toutes les informations
  - Photos et vidéos
  - Progression du financement
  - Profil du fermier
  - Mises à jour du projet
  
- [ ] **Investir dans un projet**
  - Sélectionner un montant
  - Choisir le mode de paiement (GYT tokens, Stripe, PayPal, MetaMask)
  - Confirmer l'investissement
  - Recevoir une confirmation

##### ✅ Portefeuille d'Investissements
- [ ] **Voir mes investissements**
  - Liste de tous les projets investis
  - Montant investi par projet
  - Type de retour attendu
  - Statut du projet
  
- [ ] **Statistiques d'investissement**
  - Total investi
  - Nombre de projets
  - Retours reçus
  - Retours attendus
  
- [ ] **Suivi des retours**
  - Retours financiers reçus
  - Retours physiques (produits)
  - Calendrier des retours prévus

##### ✅ Portefeuille GYT
- [ ] **Consulter le solde GYT**
  - Solde disponible
  - Tokens en attente
  
- [ ] **Acheter des tokens GYT**
  - Via Stripe
  - Via PayPal
  - Via MetaMask (crypto)
  
- [ ] **Historique des transactions**
  - Achats de tokens
  - Investissements effectués
  - Retours reçus

##### ✅ Marketplace
- [ ] **Acheter des produits**
  - Parcourir le marketplace
  - Ajouter au panier
  - Passer commande
  - Payer avec GYT tokens
  
- [ ] **Traçabilité blockchain**
  - Voir le NFT du produit
  - Vérifier l'authenticité
  - Consulter l'historique

##### ✅ Communication
- [ ] **Contacter les fermiers**
  - Envoyer des messages
  - Poser des questions sur les projets
  
- [ ] **Notifications**
  - Mises à jour des projets investis
  - Retours disponibles

---

### 3. 🛒 CONSUMER (Consommateur)

#### **Identifiants de Test**
| Email | Mot de passe | Solde GYT Initial |
|-------|--------------|-------------------|
| consumer1@agrikonbit.com | password123 | 250 GYT |

#### **Fonctionnalités à Tester**

##### ✅ Tableau de Bord Consommateur
1. Connectez-vous avec `consumer1@agrikonbit.com` / `password123`
2. Vérifiez l'accès au **Dashboard Consommateur**

##### ✅ Marketplace - Achat de Produits
- [ ] **Parcourir les produits**
  - Voir tous les produits disponibles
  - Filtrer par catégorie (vegetables, fruits, honey, other)
  - Filtrer par certification (bio)
  - Rechercher par nom
  - Trier par prix
  
- [ ] **Détails d'un produit**
  - Photos du produit
  - Description complète
  - Prix et unité
  - Stock disponible
  - Informations du fermier
  - Certification bio
  
- [ ] **Panier d'achat**
  - Ajouter des produits au panier
  - Modifier les quantités
  - Supprimer des produits
  - Voir le total
  
- [ ] **Passer une commande**
  - Vérifier le panier
  - Entrer l'adresse de livraison
  - Choisir le mode de paiement
  - Confirmer la commande

##### ✅ Gestion des Commandes
- [ ] **Voir mes commandes**
  - Liste de toutes les commandes
  - Statut de chaque commande
  - Date de commande
  
- [ ] **Détails d'une commande**
  - Produits commandés
  - Quantités et prix
  - Adresse de livraison
  - Statut de livraison
  - Suivi de la commande
  
- [ ] **Historique de commandes**
  - Commandes passées
  - Commandes en cours
  - Commandes livrées

##### ✅ Traçabilité Blockchain
- [ ] **Vérifier l'authenticité des produits**
  - Voir le NFT du produit acheté
  - Consulter l'historique blockchain
  - Vérifier l'origine
  - Vérifier les certifications

##### ✅ Portefeuille GYT
- [ ] **Consulter le solde**
  - Solde disponible en GYT
  
- [ ] **Recharger le portefeuille**
  - Acheter des tokens GYT
  - Via Stripe, PayPal, ou MetaMask
  
- [ ] **Historique des transactions**
  - Achats de tokens
  - Paiements de commandes

##### ✅ Favoris et Préférences
- [ ] **Ajouter aux favoris**
  - Marquer des produits favoris
  - Voir la liste des favoris
  
- [ ] **S'abonner à des fermiers**
  - Suivre vos fermiers préférés
  - Recevoir des notifications sur leurs nouveaux produits

---

## 🔧 Tests API Directs (Optionnel)

Pour tester les endpoints API directement :

### Test de Connexion
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer1@agrikonbit.com",
    "password": "password123"
  }'
```

### Test Récupération du Profil
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Liste des Projets (Farmer)
```bash
curl -X GET http://localhost:3001/api/projects/farmer/my-projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Liste des Investissements (Investor)
```bash
curl -X GET http://localhost:3001/api/investments/my-investments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Liste des Commandes (Consumer)
```bash
curl -X GET http://localhost:3001/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Données de Test Disponibles

### Projets Pré-Créés
- 5 projets agricoles avec différents statuts
- Catégories variées (cultures, élevage, pêche)
- Différents niveaux de financement

### Produits Marketplace
- 6 produits disponibles
- Catégories : légumes, fruits, miel
- Tous certifiés biologiques
- Stock disponible

### Investissements Existants
- 7 investissements déjà effectués
- Différents types de retours configurés

---

## ⚠️ Points Importants à Vérifier

### Sécurité et Authentification
- [ ] Les utilisateurs ne peuvent pas accéder aux données d'autres rôles
- [ ] Les tokens JWT expirent correctement
- [ ] Les mots de passe sont bien hashés

### Responsive Design
- [ ] L'interface fonctionne sur mobile
- [ ] L'interface fonctionne sur tablette
- [ ] L'interface fonctionne sur desktop

### Performance
- [ ] Les images se chargent correctement
- [ ] Les listes se chargent rapidement
- [ ] Pas d'erreurs dans la console du navigateur

### Intégration Blockchain
- [ ] Les tokens GYT sont bien gérés
- [ ] Les NFT de produits sont créés
- [ ] Les transactions sont enregistrées

---

## 🐛 Signaler des Bugs

Si vous trouvez des bugs pendant vos tests :

1. **Notez les détails :**
   - Quel utilisateur (farmer1, investor1, etc.)
   - Quelle action effectuée
   - Quel résultat attendu vs obtenu
   - Messages d'erreur (console navigateur ou serveur)

2. **Vérifiez les logs serveur :**
   - Dans le terminal où tourne le backend
   - Regardez les erreurs en rouge

3. **Vérifiez la console du navigateur :**
   - F12 pour ouvrir DevTools
   - Onglet Console
   - Onglet Network pour les requêtes API

---

## 📞 Support

Pour toute question :
- Consultez `CREDENTIALS.md` pour les identifiants
- Consultez `API_DOCS.md` pour la documentation API
- Vérifiez `TROUBLESHOOTING.md` pour les problèmes courants

---

## ✅ Checklist Finale

### Configuration
- [x] Backend démarré (port 3001)
- [x] Frontend démarré (port 3000)
- [x] MySQL en cours d'exécution
- [x] Base de données migrée

### Tests par Rôle
- [ ] Farmer testé et validé
- [ ] Investor testé et validé
- [ ] Consumer testé et validé

### Fonctionnalités Critiques
- [ ] Authentification fonctionne
- [ ] Création de projets (farmer)
- [ ] Investissements (investor)
- [ ] Achats marketplace (consumer)
- [ ] Portefeuille GYT
- [ ] Notifications
- [ ] Messagerie

---

**🎉 Bon test ! N'hésitez pas à explorer toutes les fonctionnalités de la plateforme.**
