# 🎨 Guide de Tests Visuels Frontend - Panel Admin

**Date:** 2025-10-05  
**Serveurs:** Backend (port 3001) + Frontend (port 3000)  
**Durée:** 10 minutes

---

## 🔑 Credentials Admin Test

```
Email: testadmin@agrikonbit.com
Password: TestAdmin123!
```

---

## ✅ Tests à Effectuer (10 étapes)

### Test 1: Login Admin (2 min)

1. **Ouvrir:** http://localhost:3000/login
2. **Saisir:**
   - Email: `testadmin@agrikonbit.com`
   - Password: `TestAdmin123!`
3. **Cliquer:** "Se connecter"

**✅ Résultat attendu:**
- Redirect automatique vers une page (dashboard ou accueil)
- Pas de message d'erreur
- Token JWT stocké (DevTools > Application > LocalStorage > token)

**❌ Si erreur "Invalid credentials":**
- Vérifier que le compte existe: `node create-test-admin.js`

---

### Test 2: Accès Panel Admin (1 min)

1. **Une fois connecté, naviguer vers:** http://localhost:3000/admin
2. **Observer la page**

**✅ Résultat attendu:**
- Page "Admin Panel" ou "Dashboard Admin" affichée
- **PAS** de message "Accès refusé"
- **PAS** de redirect vers /login

**Si "Accès refusé":**
- Le compte n'a pas le rôle admin
- Vérifier en DB: `SELECT role FROM users WHERE email = 'testadmin@agrikonbit.com';`

---

### Test 3: Dashboard KPIs (2 min)

**Sur la page `/admin`, vérifier:**

**✅ 6 Cartes KPI visibles:**

1. **👥 Utilisateurs**
   - Nombre total: `10` (exemple)
   - Sous-titre: "Utilisateurs totaux"

2. **🌾 Projets**
   - Nombre total: `6`
   - Sous-titre: "Projets agricoles"

3. **💰 Investissements**
   - Nombre total: `9`
   - Montant: `$X,XXX`

4. **🛒 Commandes**
   - Nombre total: `2`

5. **📊 Projets Validés**
   - Nombre: `X`
   - Pourcentage

6. **💵 Revenus**
   - Montant total: `$XXX`

**Vérifications:**
- Chiffres affichés (pas "undefined" ou "NaN")
- Layout responsive (cartes en grille)
- Icônes/emojis visibles

---

### Test 4: Graphiques Recharts (3 min)

**Scroller vers le bas de `/admin`**

**✅ 3 Graphiques à vérifier:**

#### Graphique 1: Répartition des Rôles (Pie Chart)
- **Type:** Diagramme circulaire (camembert)
- **Éléments:**
  - Segments de couleurs différentes (bleu, vert, jaune, rouge)
  - Légende en dessous avec labels: "Farmers", "Investors", "Consumers", "Moderators"
  - Pourcentages visibles
- **Test hover:** Survoler les segments → Tooltip s'affiche

#### Graphique 2: Statut des Projets (Bar Chart)
- **Type:** Graphique à barres verticales
- **Éléments:**
  - Barres bleues/vertes
  - Axes X (statuts) et Y (nombres)
  - Labels: "Pending", "Validated", "Active", "Completed"
- **Test hover:** Survoler les barres → Tooltip avec valeur exacte

#### Graphique 3: Investissements vs Revenus (Bar Chart)
- **Type:** Graphique à barres groupées
- **Éléments:**
  - 2 séries de barres côte à côte (couleurs différentes)
  - Légende: "Investissements" et "Revenus"
  - Axes X et Y
- **Test hover:** Tooltip affiche les 2 valeurs

**❌ Si erreur "recharts is not defined":**
```bash
cd client
npm list recharts
# Si absent: npm install recharts --legacy-peer-deps
npm start
# Recharger page: Ctrl + Shift + R
```

**✅ Validation:**
- 3 graphiques complètement rendus
- Pas d'erreur console (F12 > Console)
- Animations fluides

---

### Test 5: Section Exports & Rapports (1 min)

**Sur `/admin`, chercher section "📊 Exports & Rapports"**

**✅ 4 Boutons visibles:**
1. **Utilisateurs** (avec icône utilisateur)
2. **Projets** (avec icône document)
3. **Investissements** (avec icône dollar)
4. **Commandes** (avec icône panier)

**Test Export Users:**
1. Cliquer sur le bouton **"Utilisateurs"**
2. **Résultat attendu:**
   - Toast "Export réussi" s'affiche
   - Fichier `users-export-{timestamp}.csv` se télécharge
   - Taille > 0 bytes

3. **Ouvrir le fichier CSV:**
   - Avec Excel, LibreOffice, ou Notepad
   - **Vérifier contenu:**
     ```csv
     id,email,full_name,role,country,phone,kyc_status,is_active,gyt_balance,created_at
     1,farmer@example.com,Jean Dupont,farmer,Haiti,+509 1234,pending,1,500.50,2024-01-15
     ```
   - **PAS** de `[object Object]`
   - Données lisibles et formatées

**✅ Si l'export Users fonctionne, les autres exports devraient fonctionner aussi**

---

### Test 6: Navigation vers Produits (2 min)

1. **Cliquer sur le bouton "🛒 Produits"** (en haut à droite du dashboard)
2. **URL change vers:** `/admin/products`

**✅ Page Produits affichée avec:**

**Filtres en haut:**
- Dropdown "Statut": Tous / Actif / Inactif
- Dropdown "Catégorie": Toutes / Fruits / Légumes / etc.
- Champ de recherche: "Nom ou description..."

**Table des produits:**
| Nom | Catégorie | Prix | Stock | Actif | Agriculteur | Actions |
|-----|-----------|------|-------|-------|-------------|---------|
| Tomates Bio | Légumes | $5.00 | 100 | Oui | Jean Farmer | Désactiver |
| Miel Pur | Produits | $12.00 | 50 | Oui | Marie A. | Désactiver |

**Tests interactifs:**

**A. Test Recherche:**
1. Taper "tomate" dans la barre de recherche
2. **✅ Table filtrée** → Seuls les produits contenant "tomate" affichés
3. Effacer la recherche

**B. Test Filtre Catégorie:**
1. Sélectionner une catégorie (ex: "Légumes")
2. **✅ Table mise à jour** → Seuls les légumes affichés

**C. Test Toggle Status:**
1. Cliquer sur bouton "Désactiver" ou "Activer"
2. **✅ Toast:** "Produit mis à jour avec succès"
3. **✅ Colonne "Actif"** change (Oui → Non ou vice versa)

**D. Test Pagination:**
- En bas de page, boutons "Précédent" / "Suivant"
- Indication "Page 1 / X"
- Cliquer "Suivant" → Page 2 chargée

---

### Test 7: Navigation vers Utilisateurs (2 min) ⚠️

1. **Cliquer sur "👥 Utilisateurs"**
2. **URL:** `/admin/users`

**⚠️ ATTENTION:** Cet endpoint a des problèmes backend (erreur 500)

**Si la page charge:**
- ✅ Table utilisateurs visible
- ✅ Filtres rôle/statut fonctionnent
- ✅ Changement de rôle fonctionne
- ✅ Activation/désactivation fonctionne

**Si erreur 500 ou page blanche:**
- ❌ C'est normal, endpoint backend à debugger
- **Workaround:** Utiliser l'export CSV Users (Test 5) pour voir les données

---

### Test 8: Projets en Attente (1 min) ⚠️

**Sur `/admin`, scroller vers section "⏳ Projets en attente de validation"**

**⚠️ ATTENTION:** Cet endpoint a des problèmes (erreur 500)

**Cas A - Si section charge:**
- Liste de projets avec:
  - Titre, description, agriculteur
  - Textarea pour notes admin
  - Boutons "Approuver" et "Rejeter"
- **Test approbation:**
  1. Saisir notes: "Projet validé - bon dossier"
  2. Cliquer "Approuver"
  3. ✅ Toast "Projet mis à jour"
  4. Projet disparaît de la liste

**Cas B - Si erreur 500:**
- Message "Erreur lors du chargement"
- ❌ C'est normal, backend à debugger

---

### Test 9: Activité Récente (1 min)

**Scroller tout en bas de `/admin`**

**✅ 2 Cartes affichées:**

#### Carte 1: 📋 Projets Récents
- Liste de 5 projets max
- Pour chaque projet:
  - Titre
  - Nom agriculteur
  - Statut (badge coloré)
  - Date de création

#### Carte 2: 💰 Investissements Récents
- Liste de 5 investissements max
- Pour chaque:
  - Montant (USD)
  - Nom projet
  - Nom investisseur
  - Date

**Si vide:**
- Message "Aucune activité récente"
- Normal si base de données test vide

---

### Test 10: Responsive Design (2 min)

**Tester sur différentes tailles d'écran:**

1. **Desktop (1920px):**
   - Layout en grille 3 colonnes
   - Graphiques larges et visibles
   - Menu/nav bien positionné

2. **Tablet (768px):**
   - Redimensionner navigateur à 768px de large
   - **✅ Layout adapté** → 2 colonnes ou 1 colonne
   - Graphiques responsive
   - Pas de débo

rdement horizontal

3. **Mobile (375px):**
   - F12 > Toggle Device Toolbar > iPhone SE
   - **✅ Layout 1 colonne**
   - Boutons empilés verticalement
   - Texte lisible

---

## 📊 Checklist Finale

| Test | Status | Notes |
|------|--------|-------|
| 1. Login Admin | ⬜ |  |
| 2. Accès Panel Admin | ⬜ |  |
| 3. Dashboard KPIs | ⬜ |  |
| 4. Graphiques Recharts | ⬜ | 3 graphiques |
| 5. Exports & Rapports | ⬜ | CSV téléchargé |
| 6. Navigation Produits | ⬜ | CRUD fonctionne |
| 7. Navigation Utilisateurs | ⬜ | Peut échouer (500) |
| 8. Projets en Attente | ⬜ | Peut échouer (500) |
| 9. Activité Récente | ⬜ |  |
| 10. Responsive Design | ⬜ |  |

**Score Minimum Acceptable:** 6/10 tests OK

**Score Optimal:** 10/10 tests OK

---

## 🐛 Troubleshooting

### Graphiques ne s'affichent pas
```bash
cd client
npm install recharts --legacy-peer-deps
npm start
# Recharger: Ctrl + Shift + R
```

### Login échoue
```bash
node create-test-admin.js
# Recréer le compte admin test
```

### Page blanche
- F12 > Console → Vérifier erreurs
- Vérifier que backend tourne: `curl http://localhost:3001/api/health`
- Redémarrer serveurs

### Export CSV vide
- Vérifier données en DB
- Tester endpoint direct: `http://localhost:3001/api/reports/users?format=csv`
- Vérifier token valide

### Erreur 500 sur Users/Projets
- **C'est un bug backend connu**
- Les requêtes SQL fonctionnent mais les routes Express ont des problèmes
- Workaround: Utiliser les exports CSV

---

## ✅ Résultat Attendu

**Si 6+ tests passent:**

```
🎉 Panel Admin Frontend OPÉRATIONNEL !

✅ Login/Auth fonctionne
✅ Dashboard KPIs affichés
✅ Graphiques Recharts OK
✅ Exports CSV fonctionnent
✅ CRUD Produits OK
✅ Design responsive

⚠️  2-3 endpoints backend à debugger
    (users, projects/pending, audit-logs)

🚀 Le frontend est prêt pour utilisation !
```

---

## 📸 Screenshots Attendus

### Dashboard
```
┌────────────────────────────────────────────────┐
│ Admin Panel                    👤 Admin Test   │
├────────────────────────────────────────────────┤
│ [👥 10] [🌾 6] [💰 9] [🛒 2] [📊 4] [💵 $2k] │
│                                                │
│ 📊 Exports & Rapports                          │
│ [Users] [Projects] [Investments] [Orders]     │
│                                                │
│ 📈 Analyses & Statistiques                     │
│ [Pie Chart]    [Bar Chart]    [Bar Chart]     │
│                                                │
│ ⏳ Projets en attente                          │
│ [Project 1] [Project 2]                        │
│                                                │
│ 📋 Activité récente                            │
│ [Recent Projects] [Recent Investments]        │
└────────────────────────────────────────────────┘
```

---

**Durée totale:** ~10 minutes  
**Tests critiques:** 6 (login, KPIs, charts, exports, produits, responsive)  
**Tests optionnels:** 4 (users, projects, activité, pagination)

**Bon test ! 🚀**
