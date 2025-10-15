# Guide de Test - Suppression des Notifications et Messages

## 🎯 Objectif
Tester la nouvelle fonctionnalité de suppression des notifications et messages.

## 📋 Prérequis
- Serveurs backend et frontend démarrés
- Au moins 2 comptes utilisateurs (pour tester les messages)
- Quelques notifications et messages existants

## 🧪 Tests à Effectuer

### Test 1: Suppression de Notifications (InvestorDashboard)

#### Étapes:
1. Se connecter en tant qu'**investisseur**
2. Aller sur le dashboard investisseur
3. Cliquer sur l'icône de notification 🔔 en haut à droite
4. Observer le dropdown avec les notifications

#### Vérifications:
- ✅ Chaque notification affiche un bouton "Lire" (si non lue)
- ✅ Chaque notification affiche un bouton "Suppr." en rouge
- ✅ Les boutons sont alignés à droite
- ✅ Le layout est propre et lisible

#### Actions:
1. Cliquer sur "Suppr." pour une notification
2. Observer:
   - ✅ Toast de confirmation "Notification supprimée"
   - ✅ La notification disparaît immédiatement
   - ✅ Le compteur de notifications se met à jour
   - ✅ Le dropdown reste ouvert

### Test 2: Suppression de Notifications (ConsumerDashboard)

#### Étapes:
1. Se connecter en tant que **consommateur**
2. Aller sur le dashboard consommateur
3. Cliquer sur le bouton "🔔 Notifications"
4. Observer le dropdown

#### Vérifications:
- ✅ Bouton "Suppr." présent pour chaque notification
- ✅ Fonctionnalité identique à l'InvestorDashboard

### Test 3: Suppression de Notifications (FarmerDashboard)

#### Étapes:
1. Se connecter en tant qu'**agriculteur**
2. Aller sur le dashboard agriculteur
3. Cliquer sur l'onglet "🔔 Notifications"
4. Observer la liste complète des notifications

#### Vérifications:
- ✅ Bouton "Supprimer" présent pour chaque notification
- ✅ Bouton "Marquer comme lu" pour les notifications non lues
- ✅ Suppression fonctionne correctement

### Test 4: Suppression de Messages

#### Étapes:
1. Se connecter en tant qu'**agriculteur** ou **investisseur**
2. Aller sur le dashboard
3. Cliquer sur l'onglet "💬 Messages"
4. Ouvrir une conversation existante
5. Envoyer un nouveau message de test

#### Vérifications:
- ✅ Le message apparaît en vert (message envoyé)
- ✅ Survoler le message fait apparaître un bouton "×" rouge en haut à droite
- ✅ Le bouton "×" n'apparaît PAS sur les messages reçus (gris)

#### Actions:
1. Survoler un message envoyé
2. Cliquer sur le bouton "×"
3. Observer:
   - ✅ Popup de confirmation "Voulez-vous vraiment supprimer ce message ?"
   - ✅ Cliquer "OK" → Toast "Message supprimé avec succès !"
   - ✅ Le message disparaît de la conversation
   - ✅ La liste des conversations se met à jour

### Test 5: Persistance de la Suppression

#### Étapes:
1. Supprimer une notification
2. Rafraîchir la page (F5)
3. Vérifier que la notification ne réapparaît pas

4. Supprimer un message
5. Fermer et rouvrir la conversation
6. Vérifier que le message ne réapparaît pas

#### Vérifications:
- ✅ Les suppressions sont persistantes
- ✅ Les compteurs sont corrects après rafraîchissement

### Test 6: Sécurité

#### Test 6.1: Notifications
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet Network
3. Supprimer une notification
4. Observer la requête:
   - ✅ Méthode: DELETE
   - ✅ URL: `/api/notifications/{id}`
   - ✅ Status: 200 OK
   - ✅ Header Authorization présent

#### Test 6.2: Messages
1. Supprimer un message
2. Observer la requête:
   - ✅ Méthode: DELETE
   - ✅ URL: `/api/messages/messages/{id}`
   - ✅ Status: 200 OK
   - ✅ Header Authorization présent

### Test 7: Cas Limites

#### Test 7.1: Supprimer la dernière notification
1. Supprimer toutes les notifications sauf une
2. Supprimer la dernière
3. Vérifier:
   - ✅ Message "Aucune notification pour le moment" s'affiche
   - ✅ Compteur affiche 0

#### Test 7.2: Supprimer tous les messages d'une conversation
1. Supprimer tous les messages d'une conversation
2. Vérifier:
   - ✅ La conversation reste visible dans la liste
   - ✅ Le dernier message affiché est vide ou "Aucun message"

#### Test 7.3: Suppression rapide
1. Cliquer rapidement sur plusieurs boutons "Suppr."
2. Vérifier:
   - ✅ Toutes les suppressions sont traitées
   - ✅ Pas d'erreur dans la console
   - ✅ L'interface reste réactive

### Test 8: Responsive (Mobile)

#### Étapes:
1. Ouvrir les DevTools (F12)
2. Activer le mode responsive (Ctrl+Shift+M)
3. Sélectionner un appareil mobile (iPhone, Android)
4. Tester la suppression de notifications et messages

#### Vérifications:
- ✅ Les boutons sont cliquables sur mobile
- ✅ Le layout s'adapte correctement
- ✅ Les toasts sont visibles
- ✅ Les confirmations fonctionnent

## 🐛 Problèmes Potentiels et Solutions

### Problème 1: Le bouton "Suppr." ne s'affiche pas
**Solution**: Vérifier que le composant a bien été modifié et que le serveur frontend est redémarré.

### Problème 2: Erreur 404 lors de la suppression
**Solution**: Vérifier que les routes backend sont bien enregistrées dans `server/index.js`:
```javascript
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/messages', require('./routes/messages'));
```

### Problème 3: La notification ne disparaît pas après suppression
**Solution**: Vérifier que React Query invalide bien les queries:
```javascript
queryClient.invalidateQueries(['notifications']);
queryClient.invalidateQueries(['notifications-recent']);
```

### Problème 4: Le message supprimé réapparaît
**Solution**: Vérifier que la requête SQL filtre bien les messages supprimés:
```sql
WHERE ... AND (m.is_deleted IS NULL OR m.is_deleted = false)
```

## ✅ Checklist Finale

Avant de considérer les tests comme terminés, vérifier:

- [ ] Suppression de notifications fonctionne dans InvestorDashboard
- [ ] Suppression de notifications fonctionne dans ConsumerDashboard
- [ ] Suppression de notifications fonctionne dans FarmerDashboard
- [ ] Suppression de messages fonctionne dans MessagingSection
- [ ] Les toasts de confirmation s'affichent
- [ ] Les compteurs se mettent à jour correctement
- [ ] Les suppressions sont persistantes (après F5)
- [ ] Pas d'erreur dans la console navigateur
- [ ] Pas d'erreur dans les logs backend
- [ ] Fonctionne sur mobile/responsive
- [ ] Les messages supprimés ne réapparaissent pas
- [ ] Seul l'expéditeur peut supprimer ses messages

## 📊 Résultats Attendus

### Notifications:
- Suppression immédiate
- Toast de confirmation
- Compteur mis à jour
- Persistance après rafraîchissement

### Messages:
- Bouton visible au survol (messages envoyés uniquement)
- Confirmation avant suppression
- Toast de confirmation
- Message disparaît immédiatement
- Persistance après rafraîchissement

---

**Durée estimée des tests**: 15-20 minutes  
**Niveau de difficulté**: Facile  
**Prérequis techniques**: Aucun (tests manuels)
