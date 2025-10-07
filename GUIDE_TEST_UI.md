# 🧪 Guide de Test - Interface Utilisateur Dashboard

**Date** : 2025-10-01 17:51 UTC  
**Objectif** : Tester toutes les nouvelles fonctionnalités via l'interface

---

## ✅ Tests Backend Réussis

Avant de tester l'interface, les tests backend ont confirmé :
- ✅ Tables créées (conversations, messages, user_documents)
- ✅ Conversation de test créée
- ✅ Message de test créé
- ✅ Tous les wallets présents
- ✅ Tous les fichiers présents

---

## 🚀 Démarrer les Serveurs

### Option 1 : Deux terminaux séparés

**Terminal 1 - Backend** :
```bash
cd c:\wamp64\www\AgriKonbit\server
npm start
```

Attendez :
```
✅ Database connected successfully
🚀 Server running on port 3001
```

**Terminal 2 - Frontend** :
```bash
cd c:\wamp64\www\AgriKonbit\client
npm start
```

Attendez :
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 🧪 Tests à Effectuer

### 📝 ÉTAPE 1 : Connexion

1. Ouvrez votre navigateur : `http://localhost:3000`
2. Cliquez sur "Se connecter"
3. **Credentials** :
   - Email : `farmer1@agrikonbit.com`
   - Password : `password123`
4. Cliquez sur "Connexion"

**Résultat attendu** :
- ✅ Redirection vers le Dashboard
- ✅ Nom de l'utilisateur affiché en haut

---

### 📊 ÉTAPE 2 : Vue d'Ensemble (Onglet 1)

**À vérifier** :
- ✅ Cartes de statistiques affichées
  - Total projets
  - Total produits
  - Commandes
  - Financement total
- ✅ Widgets fonctionnels
- ✅ Graphiques/aperçus visibles
- ✅ Aucune erreur dans la console (F12)

---

### 🌱 ÉTAPE 3 : Mes Projets (Onglet 2)

**À vérifier** :
- ✅ Liste des projets affichée
- ✅ Bouton "➕ Nouveau Projet" visible
- ✅ Badges de statut colorés (pending, validated, active)
- ✅ Barre de progression de financement
- ✅ Boutons "Modifier" et "Ajouter MAJ" fonctionnels
- ✅ **Pas d'erreur 500 dans la console**

**Test** :
- Cliquez sur "Voir détails" d'un projet
- Vérifiez que la page s'ouvre sans erreur

---

### 🛍️ ÉTAPE 4 : Marketplace (Onglet 3)

**À vérifier** :
- ✅ Bouton "➕ Ajouter Produit" visible
- ✅ Liste des produits affichée
- ✅ Onglets de filtres (Tous, En attente, Payées, Expédiées)
- ✅ Bouton "Modifier" sur chaque produit
- ✅ **Pas d'erreur 500 dans la console**

**Test** :
- Changez d'onglet entre les filtres
- Vérifiez que les commandes se chargent

---

### 💰 ÉTAPE 5 : Finances (Onglet 4)

**À vérifier** :
- ✅ Carte "Solde Disponible" : 0.0000 GYT
- ✅ Carte "Total Gagné"
- ✅ Carte "Total Retiré"
- ✅ Bouton "💸 Retirer" (désactivé si solde = 0)
- ✅ Liste des investisseurs (si existants)
- ✅ Tableau des transactions

**Test** :
- Si solde > 0, cliquez sur "Retirer"
- Vérifiez que le modal s'ouvre
- Testez les 3 méthodes de retrait

---

### 🔔 ÉTAPE 6 : Notifications (Onglet 5)

**À vérifier** :
- ✅ Badge avec nombre de notifications non lues
- ✅ Liste des notifications
- ✅ Bouton "Marquer tout comme lu"
- ✅ Icônes différentes par type de notification
- ✅ Dates formatées correctement

**Test** :
- Cliquez sur "Marquer tout comme lu"
- Vérifiez que le badge disparaît

---

### 💬 ÉTAPE 7 : Messages ⭐ NOUVEAU

**À vérifier** :
- ✅ Interface de messagerie affichée
- ✅ Bouton "✉️ Nouveau" visible
- ✅ Liste des conversations (côté gauche)
- ✅ Zone de messages (côté droit)

**Test 1 : Consulter conversation existante**
1. Une conversation doit être visible : "investor1@agrikonbit.com"
2. Cliquez dessus
3. Vérifiez que le message de test s'affiche :
   - Subject : "Test de la messagerie"
   - Content : "Ceci est un message de test..."
4. Badge "1" doit être visible sur la conversation

**Test 2 : Envoyer un nouveau message**
1. Cliquez sur "✉️ Nouveau"
2. Modal s'ouvre
3. Sélectionnez un destinataire :
   - Section "📊 Mes Investisseurs" (si investissements existent)
   - Section "🛡️ Administrateurs"
4. Entrez un sujet : "Test messagerie farmer"
5. Entrez un message : "Ceci est un test de la nouvelle messagerie"
6. Cliquez sur "📤 Envoyer"

**Résultat attendu** :
- ✅ Message "Message envoyé avec succès !"
- ✅ Modal se ferme
- ✅ Nouvelle conversation apparaît dans la liste

**Test 3 : Répondre à un message**
1. Sélectionnez une conversation
2. Tapez un message dans le champ en bas
3. Cliquez sur "📤 Envoyer"

**Résultat attendu** :
- ✅ Message apparaît immédiatement
- ✅ Aligné à droite (en vert)
- ✅ Timestamp affiché

---

### 📚 ÉTAPE 8 : Ressources ⭐ NOUVEAU

**À vérifier** :
- ✅ 4 onglets visibles : Guides, Vidéos, FAQ, Support
- ✅ Header avec titre "📚 Centre de Ressources"

**Test 1 : Onglet Guides**
1. Cliquez sur "📖 Guides"
2. Vérifiez que 6 guides s'affichent :
   - 🌱 Guide du Démarrage
   - 💰 Maximiser vos Chances de Financement
   - 🛒 Vendre sur la Marketplace
   - 🌾 Bonnes Pratiques Agricoles
   - 🐄 Guide de l'Élevage Durable
   - 📊 Gérer vos Finances
3. Chaque guide affiche :
   - Badge de catégorie (Débutant, Financement, etc.)
   - Durée estimée
   - Liste de topics
   - Bouton "📖 Lire le guide"

**Test 2 : Onglet Vidéos**
1. Cliquez sur "🎥 Vidéos"
2. Vérifiez que 3 vidéos s'affichent
3. Chaque vidéo affiche :
   - Thumbnail
   - Titre
   - Durée
   - Nombre de vues
   - Bouton "▶️ Regarder"

**Test 3 : Onglet FAQ**
1. Cliquez sur "❓ FAQ"
2. Vérifiez que 8 questions s'affichent
3. Cliquez sur une question
4. Vérifiez que la réponse s'affiche/masque

**Questions à tester** :
- Comment créer mon premier projet ?
- Combien de temps pour la validation ?
- Comment retirer mes gains ?
- Quels sont les frais ?

**Test 4 : Onglet Support**
1. Cliquez sur "🛟 Support"
2. Vérifiez que 4 canaux s'affichent :
   - 💬 Chat en Direct (bientôt disponible)
   - ✉️ Contacter le Support
   - 📞 Assistance Téléphonique
   - 📧 Email
3. Cliquez sur "Envoyer un message"
4. Devrait rediriger vers onglet Messages

---

### 👤 ÉTAPE 9 : Profil (Onglet 8)

**À vérifier** :
- ✅ Informations personnelles affichées
- ✅ Bouton "✏️ Modifier"
- ✅ Section KYC status
- ✅ Formulaire d'édition fonctionnel

**Test** :
1. Cliquez sur "Modifier"
2. Modifiez le téléphone ou l'adresse
3. Cliquez sur "Enregistrer"
4. Vérifiez le message de succès

---

## 🔍 Vérifications Console (F12)

Pendant tous les tests, gardez la console ouverte (F12) et vérifiez :

### ✅ Pas d'erreurs 500
- Ancien problème : `GET .../projects/farmer/my-projects 500`
- Ancien problème : `GET .../products/farmer/my-products 500`
- **Maintenant** : Devrait être 200 OK

### ✅ Requêtes réussies
```
GET /api/farmer/stats/dashboard - 200 OK
GET /api/projects/farmer/my-projects?limit=5 - 200 OK
GET /api/products/farmer/my-products?limit=5 - 200 OK
GET /api/messages/conversations - 200 OK
GET /api/messages/farmer/investors-list - 200 OK
GET /api/messages/admins - 200 OK
GET /api/documents/my-documents - 200 OK
```

### ✅ Pas d'erreurs React
- Pas de "Cannot read property of undefined"
- Pas de "Failed to fetch"
- Pas de warnings critiques

---

## 📊 Checklist Finale de Test

### Backend
- [ ] ✅ Serveur backend démarré (port 3001)
- [ ] ✅ Base de données connectée
- [ ] ✅ Aucune erreur dans les logs backend
- [ ] ✅ Routes messages enregistrées
- [ ] ✅ Routes documents enregistrées

### Frontend
- [ ] ✅ Serveur frontend démarré (port 3000)
- [ ] ✅ Compilation sans erreurs
- [ ] ✅ Connexion réussie
- [ ] ✅ Dashboard accessible

### Sections Dashboard (1-8)
- [ ] ✅ Vue d'ensemble - Fonctionne
- [ ] ✅ Mes Projets - Fonctionne (pas d'erreur 500)
- [ ] ✅ Marketplace - Fonctionne (pas d'erreur 500)
- [ ] ✅ Finances - Fonctionne
- [ ] ✅ Notifications - Fonctionne
- [ ] ✅ Messages - Fonctionne ⭐
- [ ] ✅ Ressources - Fonctionne ⭐
- [ ] ✅ Profil - Fonctionne

### Nouvelles Fonctionnalités
- [ ] ✅ Messagerie complète
  - [ ] Liste conversations
  - [ ] Lecture messages
  - [ ] Envoi message
  - [ ] Nouveau message modal
  - [ ] Sélection investisseurs/admins
- [ ] ✅ Centre de ressources
  - [ ] 6 guides affichés
  - [ ] 3 vidéos affichées
  - [ ] 8 FAQ affichées
  - [ ] 4 canaux support
- [ ] ✅ API documents prête
  - [ ] Endpoint upload fonctionnel
  - [ ] Endpoint liste documents fonctionnel

---

## 📸 Captures d'Écran Recommandées

Pour documenter les tests :

1. **Dashboard Overview** - Onglet 1
2. **Projets sans erreur 500** - Console + Liste projets
3. **Marketplace sans erreur 500** - Console + Liste produits
4. **Messagerie** - Interface complète avec conversation
5. **Ressources - Guides** - Les 6 guides
6. **Ressources - FAQ** - Questions/réponses
7. **Console sans erreurs** - F12 Network tab avec 200 OK

---

## 🐛 Problèmes Potentiels et Solutions

### Problème 1 : Erreur "Cannot find module 'multer'"
**Solution** :
```bash
cd server
npm install multer
```

### Problème 2 : Table 'conversations' doesn't exist
**Solution** :
```bash
node run-migrations.js
```

### Problème 3 : Serveur ne démarre pas
**Solution** :
- Vérifier que MySQL (WAMP) est démarré
- Vérifier les ports 3000 et 3001 sont libres
- Vérifier le fichier `.env`

### Problème 4 : Conversations vides
**Solution** :
C'est normal ! Le système de messagerie est nouveau. Pour tester :
1. Cliquez sur "Nouveau message"
2. Sélectionnez un admin
3. Envoyez un message test

### Problème 5 : Liste investisseurs vide
**Solution** :
Normal si aucun investissement n'a été fait. Le système fonctionne quand même avec les admins.

---

## ✅ Résultat Attendu Final

Après tous les tests, vous devriez avoir :

### Score de Fonctionnalité
- ✅ **8/8 sections** du Dashboard fonctionnelles
- ✅ **0 erreur 500** (corrigées)
- ✅ **Messagerie** complète et opérationnelle
- ✅ **Ressources** complètes (guides, FAQ, support)
- ✅ **API documents** prête à l'emploi

### Performance
- ✅ Chargement rapide des pages
- ✅ Navigation fluide entre onglets
- ✅ Aucune erreur console
- ✅ Interface responsive

### Conformité aux Objectifs
- ✅ Publier, gérer et suivre ses projets : 100%
- ✅ Vendre sa production sur la marketplace : 100%
- ✅ Suivre ses financements et paiements : 100%
- ✅ Communiquer avec investisseurs et admins : 100%

---

## 🎉 Message de Succès

Si tous les tests passent, vous verrez :

```
✅ Dashboard Agriculteur - 100% Fonctionnel
✅ 8 sections opérationnelles
✅ Messagerie complète
✅ Centre de ressources complet
✅ Aucune erreur backend
✅ Prêt pour la production
```

---

**Créé par** : Cascade AI  
**Date** : 2025-10-01 17:51 UTC  
**Version** : 2.0.0 Final  
**Status** : ✅ Prêt pour tests UI
