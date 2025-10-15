# Guide de Test - Système de Messagerie

## 🚀 Démarrage Rapide

Suivez ce guide pour tester les fonctionnalités de messagerie après les corrections.

---

## ⚙️ Préparation

### 1. Démarrer les Serveurs

```bash
# Terminal 1 : Backend
cd server
npm start

# Terminal 2 : Frontend
cd client
npm start
```

**Vérification** : 
- Backend sur `http://localhost:3000`
- Frontend sur `http://localhost:3001`

### 2. Créer des Comptes de Test

Vous aurez besoin de 3 comptes :
- 1 Admin
- 1 Agriculteur
- 1 Investisseur

**Option A : Utiliser les comptes existants**
Consultez `CREDENTIALS.md` pour les identifiants de test.

**Option B : Créer de nouveaux comptes**
1. Aller sur `/register`
2. Créer les 3 types de comptes
3. Connecter l'admin et valider les comptes

### 3. Préparer les Données

Pour tester la communication investisseur ↔ agriculteur :

1. **Agriculteur** : Créer un projet
2. **Admin** : Valider le projet
3. **Investisseur** : Investir dans le projet (minimum 10 DOLLAR)

---

## ✅ Tests Critiques

### Test 1 : Investisseur → Agriculteur (NOUVEAU)

**Objectif** : Vérifier que les investisseurs peuvent maintenant envoyer des messages aux agriculteurs.

#### Étapes :

1. **Connexion Investisseur**
   ```
   Se connecter avec compte investisseur
   ```

2. **Naviguer vers Messagerie**
   ```
   Dashboard → Onglet "Communication" (💬)
   ```

3. **Vérifier l'Interface**
   - ✅ Le composant MessagingSection s'affiche (pas de contenu statique)
   - ✅ Liste des conversations (vide si première fois)
   - ✅ Bouton "Nouveau message" visible

4. **Ouvrir Nouveau Message**
   ```
   Cliquer sur "Nouveau message"
   ```

5. **Vérifier Liste des Destinataires**
   - ✅ Groupe "Agriculteurs" présent
   - ✅ Liste affiche les agriculteurs des projets investis
   - ✅ Format : "Nom de l'agriculteur - Titre du projet"
   - ✅ Groupe "Admins/Support" présent

6. **Envoyer un Message**
   ```
   Destinataire : [Sélectionner un agriculteur]
   Sujet : "Question sur le projet"
   Message : "Bonjour, j'aimerais avoir des nouvelles de la récolte."
   → Cliquer "Envoyer"
   ```

7. **Vérifier Confirmation**
   - ✅ Toast "Message envoyé avec succès !"
   - ✅ Modal se ferme
   - ✅ Nouvelle conversation apparaît dans la liste

**✅ Test Réussi** : Message envoyé et conversation créée

---

### Test 2 : Agriculteur Reçoit Message (VÉRIFICATION)

**Objectif** : Vérifier que l'agriculteur reçoit bien le message de l'investisseur.

#### Étapes :

1. **Déconnexion + Connexion Agriculteur**
   ```
   Se déconnecter de compte investisseur
   Se connecter avec compte agriculteur
   ```

2. **Naviguer vers Messagerie**
   ```
   Dashboard → Onglet "Messages" (💬)
   ```

3. **Vérifier Nouvelle Conversation**
   - ✅ Badge de notification (chiffre) sur l'onglet Messages
   - ✅ Nouvelle conversation dans la liste
   - ✅ Badge "non lu" ou compteur visible
   - ✅ Nom de l'investisseur affiché
   - ✅ Aperçu du dernier message

4. **Ouvrir la Conversation**
   ```
   Cliquer sur la conversation
   ```

5. **Vérifier le Message**
   - ✅ Message de l'investisseur affiché
   - ✅ Sujet "Question sur le projet" visible
   - ✅ Contenu complet du message
   - ✅ Timestamp correct

6. **Répondre**
   ```
   Message : "Bonjour ! La récolte se passe très bien. Voici les dernières photos..."
   → Envoyer
   ```

7. **Vérifier Réponse**
   - ✅ Message envoyé (bulle verte à droite)
   - ✅ Badge "non lu" disparaît

**✅ Test Réussi** : Communication bidirectionnelle fonctionne

---

### Test 3 : Investisseur Reçoit Réponse

**Objectif** : Cycle complet de communication.

#### Étapes :

1. **Retour au Compte Investisseur**
   ```
   Se déconnecter → Se reconnecter investisseur
   ```

2. **Vérifier Notification**
   - ✅ Badge notification sur onglet Communication
   - ✅ Compteur "messages non lus"

3. **Ouvrir Conversation**
   ```
   Cliquer sur conversation avec agriculteur
   ```

4. **Vérifier Réponse**
   - ✅ Message de l'agriculteur affiché (bulle grise à gauche)
   - ✅ Contenu complet
   - ✅ Historique préservé (2 messages visibles)

**✅ Test Réussi** : Cycle complet validé

---

### Test 4 : Investisseur → Admin (NOUVEAU)

**Objectif** : Vérifier que les investisseurs peuvent contacter le support.

#### Étapes :

1. **Nouveau Message depuis Compte Investisseur**
   ```
   Dashboard → Communication → Nouveau message
   ```

2. **Sélectionner Admin**
   ```
   Groupe : Admins/Support
   Destinataire : [Admin]
   Sujet : "Question technique"
   Message : "J'ai besoin d'aide pour..."
   → Envoyer
   ```

3. **Connexion Admin**
   ```
   Se connecter avec compte admin
   ```

4. **Vérifier Réception**
   - ✅ Admin voit le message dans ses conversations
   - ✅ Peut répondre normalement

**✅ Test Réussi** : Support accessible aux investisseurs

---

### Test 5 : Agriculteur → Investisseur (RÉGRESSION)

**Objectif** : S'assurer que les fonctionnalités existantes n'ont pas été cassées.

#### Étapes :

1. **Connexion Agriculteur**

2. **Nouveau Message**
   ```
   Messages → Nouveau message
   ```

3. **Vérifier Groupe Investisseurs**
   - ✅ Groupe "Investisseurs" présent
   - ✅ Liste affiche les investisseurs
   - ✅ Format : "Nom - X DOLLAR investis"

4. **Envoyer Message**
   ```
   Destinataire : [Investisseur]
   Message : "Merci pour votre investissement !"
   → Envoyer
   ```

5. **Vérifier Réception** (côté investisseur)
   - ✅ Message reçu correctement

**✅ Test Réussi** : Pas de régression

---

### Test 6 : Multi-Projets (AVANCÉ)

**Objectif** : Investisseur investi dans plusieurs projets voit tous les agriculteurs.

#### Prérequis :
- Investisseur investi dans au moins 2 projets de 2 agriculteurs différents

#### Étapes :

1. **Connexion Investisseur**

2. **Nouveau Message**

3. **Vérifier Liste Agriculteurs**
   - ✅ TOUS les agriculteurs des projets investis apparaissent
   - ✅ Chaque ligne affiche : "Nom - Titre du projet"
   - ✅ Si plusieurs projets du même agriculteur → plusieurs lignes

4. **Envoyer à Différents Agriculteurs**
   ```
   Message 1 → Agriculteur A (Projet Tomates)
   Message 2 → Agriculteur B (Projet Maïs)
   ```

5. **Vérifier Conversations**
   - ✅ 2 conversations distinctes créées
   - ✅ Noms corrects affichés

**✅ Test Réussi** : Multi-projets géré correctement

---

## 🔧 Tests Techniques

### Test 7 : Vérification Backend

#### Route : GET `/api/messages/investor/farmers-list`

```bash
# Dans le terminal ou Postman/Insomnia

# 1. Obtenir un token investisseur
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "investisseur@test.com", "password": "password123"}'

# Copier le token retourné

# 2. Tester la route
curl -X GET http://localhost:3000/api/messages/investor/farmers-list \
  -H "Authorization: Bearer [TOKEN]"
```

**Réponse Attendue** :
```json
{
  "success": true,
  "data": {
    "farmers": [
      {
        "id": 2,
        "full_name": "Jean Agriculteur",
        "email": "jean@farm.com",
        "role": "farmer",
        "project_title": "Culture de Tomates Bio",
        "project_id": 1,
        "investments_count": "1",
        "total_invested_gyt": "500.00"
      }
    ]
  }
}
```

**Vérifications** :
- ✅ Status 200
- ✅ `success: true`
- ✅ Tableau `farmers` présent
- ✅ Données complètes (id, nom, projet, montant)

---

### Test 8 : Permissions de Sécurité

#### Test A : Sans Token (Doit Échouer)

```bash
curl -X GET http://localhost:3000/api/messages/investor/farmers-list
```

**Attendu** :
```json
{
  "success": false,
  "message": "No token provided"
}
```
- ✅ Status 401

#### Test B : Token Agriculteur sur Route Investisseur

```bash
# Utiliser token d'agriculteur sur route investisseur
curl -X GET http://localhost:3000/api/messages/investor/farmers-list \
  -H "Authorization: Bearer [TOKEN_AGRICULTEUR]"
```

**Attendu** :
- ✅ Liste vide ou erreur (agriculteur n'a pas d'investissements)

---

## 📊 Checklist Complète

### Backend
- [ ] Route `/api/messages/investor/farmers-list` accessible
- [ ] Route retourne les bons agriculteurs (seulement ceux investis)
- [ ] Protection par `authenticateToken` active
- [ ] Requête SQL optimisée (JOIN correct)
- [ ] Statut `completed` filtré

### Frontend - Investisseur
- [ ] Onglet "Communication" visible
- [ ] `MessagingSection` s'affiche (pas de mockup)
- [ ] Bouton "Nouveau message" fonctionne
- [ ] Liste agriculteurs chargée correctement
- [ ] Format "Nom - Projet" affiché
- [ ] Envoi de message réussi
- [ ] Conversation créée
- [ ] Notifications fonctionnent

### Frontend - Agriculteur
- [ ] Onglet "Messages" intact
- [ ] Liste investisseurs toujours visible
- [ ] Peut envoyer/recevoir normalement
- [ ] Pas de régression

### Communication Bidirectionnelle
- [ ] Investisseur → Agriculteur ✅
- [ ] Agriculteur → Investisseur ✅
- [ ] Investisseur → Admin ✅
- [ ] Admin → Investisseur ✅
- [ ] Historique préservé ✅

---

## 🐛 Problèmes Courants

### Problème 1 : "Liste agriculteurs vide"

**Causes possibles** :
1. Investisseur n'a pas investi dans de projet
2. Investissements en statut `pending` (pas `completed`)
3. Projets pas encore validés

**Solution** :
- Créer projet → Valider → Investir → Tester

---

### Problème 2 : "Erreur 404 - Route not found"

**Causes** :
1. Backend pas redémarré après modifications
2. Typo dans l'URL

**Solution** :
```bash
cd server
npm start
```

---

### Problème 3 : "useAuth is not defined"

**Causes** :
- Context AuthContext pas importé

**Vérification** :
```javascript
// Dans MessagingSection.js
import { useAuth } from '../../contexts/AuthContext';
```

---

### Problème 4 : "Cannot read property 'farmers' of undefined"

**Causes** :
- Requête API en cours ou échouée

**Vérification** :
- Vérifier `contactsData?.farmers` (optional chaining)
- Vérifier console pour erreurs réseau

---

## 📈 Métriques de Succès

**Test réussi si** :
- ✅ 8/8 tests passent
- ✅ Aucune erreur console
- ✅ Aucune erreur backend
- ✅ Communication fluide entre tous les rôles

---

## 🎯 Prochaines Étapes

Après validation de ces tests :

1. **Tests de Performance**
   - Tester avec 100+ conversations
   - Tester avec 50+ agriculteurs/investisseurs

2. **Tests Multi-Navigateurs**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅

3. **Tests Mobiles**
   - Responsive design
   - Touch interactions

4. **Tests de Charge**
   - Broadcast à 1000+ utilisateurs
   - Envoi simultané de messages

---

## 📞 Support

En cas de problème :

1. **Vérifier Logs Backend**
   ```bash
   cd server
   npm start
   # Voir logs dans terminal
   ```

2. **Vérifier Console Frontend**
   ```
   F12 → Console
   Rechercher erreurs en rouge
   ```

3. **Vérifier Base de Données**
   ```sql
   SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;
   SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
   ```

4. **Consulter Documentation**
   - `RAPPORT_VERIFICATION_MESSAGERIE.md`
   - `CORRECTIONS_MESSAGERIE_APPLIQUEES.md`

---

**Guide créé le 13 Octobre 2025**  
**Version : 1.0**
