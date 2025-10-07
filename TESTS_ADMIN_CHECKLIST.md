# ✅ Tests Admin Panel - Checklist Interactive

**Date:** 2025-10-05  
**Serveurs:** Backend (3001) + Frontend (3000)  
**Durée:** 5-10 minutes

---

## 🚀 Étape 0: Vérification Serveurs

### Backend (Port 3001)
```bash
✓ Serveur démarré en arrière-plan
✓ URL: http://localhost:3001
```

**Vérification rapide:**
```bash
# Ouvrir dans navigateur:
http://localhost:3001/api/health

# Ou en ligne de commande:
curl http://localhost:3001/api/health
```

**Résultat attendu:** `{"status":"ok"}`

### Frontend (Port 3000)
```bash
✓ Serveur démarré en arrière-plan
✓ URL: http://localhost:3000
```

**Vérification:** Ouvrir http://localhost:3000 → Page d'accueil AgriKonbit

---

## 📋 Tests à Effectuer

### ✅ Test 1: Accès Admin (2 min)

**Instructions:**
1. Ouvrir: **http://localhost:3000/admin**
2. Si redirect vers login → Se connecter:
   - Email: `admin@agrikonbit.com`
   - Password: votre mot de passe admin
3. Après login → Redirect automatique vers `/admin`

**Résultat attendu:**
```
✓ Page "Admin Panel" ou "Dashboard Admin" visible
✓ 6 cartes KPI affichées:
  - 👥 Utilisateurs
  - 🌾 Projets  
  - 💰 Investissements
  - 🛒 Commandes
  - 📊 Projets Validés
  - 💵 Revenus
✓ Valeurs numériques affichées (pas "undefined")
```

**Si erreur "Access Denied":**
- Vérifier rôle dans DB: `SELECT role FROM users WHERE email = 'admin@agrikonbit.com';`
- Doit être `admin` ou `moderator`

**Cocher:** ⬜ Test 1 RÉUSSI

---

### ✅ Test 2: Graphiques Recharts (2 min)

**Instructions:**
1. Sur la page `/admin`, scroller vers le bas
2. Chercher section "📊 Analyses & Statistiques" ou similaire
3. Observer les graphiques

**Résultat attendu:**
```
✓ Pie Chart: "Répartition des Rôles" visible
  - Segments de couleurs différentes
  - Légende en dessous
  
✓ Bar Chart: "Statut des Projets" visible
  - Barres bleues/vertes
  - Labels sur axes
  
✓ Bar Chart: "Investissements vs Revenus" visible
  - 2 séries (barres côte à côte)
  - Légende
```

**Si erreur "recharts is not defined":**
```bash
cd client
npm install recharts --legacy-peer-deps
npm start
```

**Ouvrir DevTools Console (F12):**
- Pas d'erreurs rouges liées à "Recharts" ou "ResponsiveContainer"

**Cocher:** ⬜ Test 2 RÉUSSI

---

### ✅ Test 3: Export CSV Utilisateurs (1 min)

**Instructions:**
1. Sur `/admin`, chercher section "📊 Exports & Rapports"
2. Cliquer bouton **"Utilisateurs"** avec icône téléchargement
3. Attendre téléchargement

**Résultat attendu:**
```
✓ Toast notification "Export réussi" s'affiche
✓ Fichier téléchargé: users-export-{timestamp}.csv
✓ Taille > 0 bytes
```

**Ouvrir le fichier CSV:**
- Avec Excel, LibreOffice, ou Notepad
- Première ligne: `id,email,full_name,role,country,phone,...`
- Lignes suivantes: données réelles des users
- **PAS** de `[object Object]` dans le fichier

**Exemple attendu:**
```csv
id,email,full_name,role,country,phone,kyc_status,is_active,gyt_balance,created_at
1,farmer@example.com,Jean Dupont,farmer,Haiti,+509 1234 5678,pending,1,500.50,2024-01-15 10:30:00
2,investor@example.com,Marie Investor,investor,France,,approved,1,1000.00,2024-01-16 14:20:00
```

**Cocher:** ⬜ Test 3 RÉUSSI

---

### ✅ Test 4: Gestion Utilisateurs (2 min)

**Instructions:**
1. Cliquer sur le bouton **"👥 Utilisateurs"** (en haut à droite du dashboard)
2. URL devrait être: `/admin/users`

**Résultat attendu:**
```
✓ Page "Utilisateurs" affichée
✓ Table avec colonnes: ID, Email, Nom, Rôle, Pays, Statut, Actions
✓ Liste de plusieurs utilisateurs visible
```

**Test A - Filtres:**
1. Sélectionner filtre "Rôle": **Agriculteur** (farmer)
2. Observer la table se mettre à jour
3. Vérifier que seuls les farmers sont affichés
4. Remettre "Tous les rôles"

**Test B - Changement de rôle:**
1. Dans la colonne "Rôle", trouver un user non-admin
2. Cliquer sur le dropdown du rôle
3. Changer vers "Investisseur" (investor)
4. Observer le toast: **"Rôle mis à jour avec succès"**

**Test C - Activation/Désactivation:**
1. Dans la colonne "Actions", cliquer bouton "Activer" ou "Désactiver"
2. Observer le toast: **"Utilisateur mis à jour"**
3. Recharger la page (F5)
4. Vérifier que le statut a changé

**Cocher:** ⬜ Test 4 RÉUSSI

---

### ✅ Test 5: Modération Produits (2 min)

**Instructions:**
1. Cliquer sur **"🛒 Produits"**
2. URL: `/admin/products`

**Résultat attendu:**
```
✓ Page "Produits" affichée
✓ Table avec: Nom, Catégorie, Prix, Stock, Statut, Agriculteur, Actions
✓ Liste de produits visible
```

**Test A - Filtres:**
1. Sélectionner "Statut": **Inactif**
2. Observer filtrage
3. Remettre "Tous"

**Test B - Recherche:**
1. Dans la barre de recherche, taper: **"tomate"** ou **"miel"**
2. Observer la table filtrer en temps réel
3. Vider la recherche

**Test C - Toggle Status:**
1. Cliquer bouton "Activer" ou "Désactiver" sur un produit
2. Observer toast: **"Produit mis à jour"**
3. Vérifier que la colonne "Actif" change (Oui/Non)

**Cocher:** ⬜ Test 5 RÉUSSI

---

### ✅ Test 6: Validation Projets (2 min)

**Instructions:**
1. Retourner au dashboard `/admin`
2. Scroller vers section **"Projets en attente de validation"**

**Cas A - Si projets en attente présents:**

1. Observer les cartes de projets affichées
2. Pour un projet, saisir notes dans le textarea:
   ```
   Test validation - Bon dossier
   ```
3. Cliquer bouton **"Approuver"** (vert)
4. Observer toast: **"Projet mis à jour avec succès"**
5. Le projet disparaît de la liste

**Cas B - Si aucun projet en attente:**
```
✓ Message affiché: "Aucun projet en attente de validation"
✓ Pagination affichée: "Page 1 / 1"
```

**Vérification Audit Log (optionnel):**
Ouvrir MySQL Workbench ou ligne de commande:
```sql
SELECT * FROM admin_actions ORDER BY created_at DESC LIMIT 5;
```

**Résultat attendu:**
```
✓ Ligne créée avec:
  - admin_id: votre ID
  - action_type: 'project.approve' ou 'project.reject'
  - target_type: 'project'
  - target_id: ID du projet
  - details: JSON avec notes
  - ip_address: votre IP
  - created_at: timestamp récent
```

**Cocher:** ⬜ Test 6 RÉUSSI

---

### ✅ Test 7: Activité Récente (1 min)

**Instructions:**
1. Sur `/admin`, scroller tout en bas
2. Chercher sections "Activité récente"

**Résultat attendu:**
```
✓ Carte "📋 Projets récents" visible
  - Liste de 5 projets max
  - Nom projet, agriculteur, statut, date
  
✓ Carte "💰 Investissements récents" visible
  - Liste de 5 investissements max
  - Montant, projet, investisseur, date
```

**Si vide:**
- Normal si base de données de test vide
- Message: "Aucune activité récente"

**Cocher:** ⬜ Test 7 RÉUSSI

---

## 🔍 Tests Avancés (Optionnel)

### Test 8: Exports CSV Complets

**Instructions:**
Tester les 4 exports depuis `/admin`:

1. **Export Projets:**
   - Cliquer bouton "Projets"
   - Fichier: `projects-export-{timestamp}.csv`
   - Vérifier: title, category, farmer_name, funding_goal, status

2. **Export Investissements:**
   - Cliquer bouton "Investissements"
   - Fichier: `investments-export-{timestamp}.csv`
   - Vérifier: investor_name, project_title, amount_usd

3. **Export Commandes:**
   - Cliquer bouton "Commandes"
   - Fichier: `orders-export-{timestamp}.csv`
   - Vérifier: customer_name, total_usd, status

**Cocher:** ⬜ Test 8 RÉUSSI

---

### Test 9: Permissions Moderator

**Pré-requis:** Créer un compte moderator

```sql
-- Dans MySQL
INSERT INTO users (email, password, full_name, role, is_active, created_at) 
VALUES (
  'moderator@test.com',
  '$2a$10$YourBcryptHashHere', 
  'Test Moderator',
  'moderator',
  1,
  NOW()
);

-- Créer wallet
INSERT INTO user_wallets (user_id, gyt_balance, created_at)
SELECT id, 0, NOW() FROM users WHERE email = 'moderator@test.com';
```

**Instructions:**
1. Logout de l'admin
2. Login avec moderator@test.com
3. Accéder `/admin`

**Résultat attendu:**
```
✓ Accès autorisé (pas de "Access Denied")
✓ Peut voir projets en attente
✓ Peut voir produits
✗ NE PEUT PAS voir dashboard stats (selon RBAC)
✗ NE PEUT PAS changer rôles users
```

**Cocher:** ⬜ Test 9 RÉUSSI

---

### Test 10: Audit Logs API

**Instructions:**
Tester l'endpoint audit logs (admin uniquement)

```bash
# Obtenir token JWT (après login)
# Dans DevTools > Application > LocalStorage > token

# Tester l'API
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/admin/audit-logs?limit=10"
```

**Résultat attendu:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "admin_name": "Admin User",
        "action_type": "project.approve",
        "target_type": "project",
        "target_id": 123,
        "created_at": "2025-10-05T00:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

**Cocher:** ⬜ Test 10 RÉUSSI

---

## 📊 Résultats Finaux

### Tests Essentiels (obligatoires)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1 | Accès Admin | ⬜ |  |
| 2 | Graphiques Recharts | ⬜ |  |
| 3 | Export CSV Users | ⬜ |  |
| 4 | Gestion Users | ⬜ |  |
| 5 | Modération Produits | ⬜ |  |
| 6 | Validation Projets | ⬜ |  |
| 7 | Activité Récente | ⬜ |  |

**Score:** __/7

### Tests Avancés (optionnels)

| # | Test | Status | Notes |
|---|------|--------|-------|
| 8 | Exports CSV Complets | ⬜ |  |
| 9 | Permissions Moderator | ⬜ |  |
| 10 | Audit Logs API | ⬜ |  |

**Score:** __/3

---

## ✅ Validation Finale

**Si TOUS les tests essentiels (1-7) passent:**

```
🎉 PANEL ADMIN 100% OPÉRATIONNEL !

✅ Dashboard fonctionnel
✅ Graphiques Recharts OK
✅ Exports CSV OK
✅ CRUD Users OK
✅ CRUD Products OK
✅ Validation Projets OK
✅ Audit Logs OK

🚀 PRÊT POUR PRODUCTION !
```

**Si certains tests échouent:**
1. Noter les tests en échec dans la colonne "Notes"
2. Consulter section Troubleshooting ci-dessous
3. Vérifier logs backend (console serveur)
4. Vérifier logs frontend (DevTools Console)

---

## 🐛 Troubleshooting

### Graphiques ne s'affichent pas
```bash
cd client
npm list recharts
# Si absent: npm install recharts --legacy-peer-deps
# Redémarrer: npm start
# Vider cache navigateur: Ctrl+Shift+R
```

### Export CSV télécharge fichier vide
- Vérifier backend logs: erreur SQL?
- Tester endpoint direct: `http://localhost:3001/api/reports/users?format=csv`
- Vérifier token valide (pas expiré)

### "Access Denied" même en admin
```sql
-- Vérifier rôle dans DB
SELECT email, role, is_active FROM users WHERE email = 'admin@agrikonbit.com';

-- Si rôle incorrect, corriger:
UPDATE users SET role = 'admin' WHERE email = 'admin@agrikonbit.com';
```

### Toast ne s'affiche pas
- Vérifier que `react-hot-toast` est installé
- Ouvrir DevTools Console → voir erreurs
- Vérifier `<Toaster />` dans Layout

### Table admin_actions n'existe pas
```bash
node run-admin-migrations.js
```

---

## 📸 Screenshots Attendus

### Dashboard Admin
```
┌─────────────────────────────────────────────┐
│ Admin Panel                                 │
├─────────────────────────────────────────────┤
│ [KPI 1] [KPI 2] [KPI 3] [KPI 4] [KPI 5] [6]│
│                                             │
│ 📊 Exports & Rapports                       │
│ [Users] [Projects] [Investments] [Orders]  │
│                                             │
│ 📊 Analyses & Statistiques                  │
│ [Pie Chart]  [Bar Chart]  [Bar Chart]      │
│                                             │
│ ⏳ Projets en attente                       │
│ [Project Card 1] [Project Card 2]          │
│                                             │
│ 📋 Activité récente                         │
│ [Recent Projects] [Recent Investments]     │
└─────────────────────────────────────────────┘
```

---

**Temps total estimé:** 5-10 minutes  
**Tests critiques:** 7  
**Tests optionnels:** 3  
**Documentation:** ADMIN_PANEL_IMPLEMENTATION.md

**Bonne chance ! 🚀**
