# ✅ Test Manuel Admin Panel - 5 Minutes

**Date:** 2025-10-05  
**Durée:** 5 minutes  
**Prérequis:** Serveurs démarrés (backend + frontend)

---

## 🚀 Démarrage des Serveurs

### Terminal 1 - Backend
```bash
cd server
npm start
```
**Résultat attendu:** `🚀 Server running on port 3001`

### Terminal 2 - Frontend
```bash
cd client
npm start
```
**Résultat attendu:** `Compiled successfully! http://localhost:3000`

---

## 🧪 Tests à effectuer (5 min)

### ✅ Test 1: Accès Admin (30 sec)

1. **Ouvrir:** http://localhost:3000/admin
2. **Login:** admin@agrikonbit.com + votre mot de passe
3. **Vérifier:** Page "Admin Panel" s'affiche

**✓ OK si:** Dashboard visible avec KPIs

---

### ✅ Test 2: Graphiques Recharts (30 sec)

1. **Scroller** sur la page admin
2. **Chercher:** Section "📊 Statut des Projets"
3. **Vérifier:** Graphiques à barres visibles

**✓ OK si:** 3 graphiques s'affichent (Pie chart + 2 Bar charts)

**❌ Si erreur:** 
```bash
# Dans client/
npm list recharts
# Si vide: npm install recharts --legacy-peer-deps
```

---

### ✅ Test 3: Export CSV (1 min)

1. **Trouver:** Section "📊 Exports & Rapports"
2. **Cliquer:** Bouton "Utilisateurs"
3. **Vérifier:** Fichier `users-export-{timestamp}.csv` téléchargé

**✓ OK si:** Fichier CSV téléchargé et ouvrable dans Excel

**Test rapide du contenu:**
```csv
id,email,full_name,role,country,phone,...
1,farmer@example.com,Jean Dupont,farmer,Haiti,...
```

---

### ✅ Test 4: Gestion Utilisateurs (1 min)

1. **Cliquer:** Bouton "👥 Utilisateurs" (en haut à droite)
2. **Vérifier:** Table avec liste des users
3. **Tester filtres:**
   - Sélectionner "Rôle: Agriculteur"
   - **✓ OK si:** Seuls les farmers s'affichent

4. **Changer un rôle:**
   - Dans la colonne "Rôle", changer un user vers "Investisseur"
   - **✓ OK si:** Toast "Rôle mis à jour" s'affiche

---

### ✅ Test 5: Modération Produits (1 min)

1. **Cliquer:** Bouton "🛒 Produits"
2. **Vérifier:** Table avec liste des produits
3. **Tester recherche:**
   - Taper "tomate" dans la barre de recherche
   - **✓ OK si:** Filtrage fonctionne

4. **Toggle statut:**
   - Cliquer "Activer" ou "Désactiver" sur un produit
   - **✓ OK si:** Toast "Produit mis à jour"

---

### ✅ Test 6: Validation Projets (1 min)

1. **Retour:** Dashboard admin
2. **Scroller:** Section "Projets en attente"
3. **Si projets présents:**
   - Saisir notes: "Test validation"
   - Cliquer "Approuver"
   - **✓ OK si:** Toast "Projet mis à jour"

4. **Vérifier logs audit:**
```bash
# Ouvrir MySQL Workbench ou ligne de commande
SELECT * FROM admin_actions ORDER BY created_at DESC LIMIT 5;
```
**✓ OK si:** Ligne créée avec action_type = 'project.approve'

---

### ✅ Test 7: Activité Récente (30 sec)

1. **Scroller:** Bas du dashboard
2. **Vérifier:** 2 cartes "Activité récente"
   - 📋 Projets récents
   - 💰 Investissements récents

**✓ OK si:** Listes affichées avec données

---

## 📊 Checklist Finale

| Test | Status | Note |
|------|--------|------|
| ✅ Accès Admin | ⬜ | Login + Dashboard visible |
| ✅ Graphiques Recharts | ⬜ | 3 graphiques affichés |
| ✅ Export CSV | ⬜ | Fichier téléchargé |
| ✅ Gestion Users | ⬜ | Filtres + changement rôle |
| ✅ Modération Produits | ⬜ | Recherche + toggle status |
| ✅ Validation Projets | ⬜ | Approve/Reject fonctionne |
| ✅ Activité Récente | ⬜ | Listes affichées |

---

## 🐛 Troubleshooting Rapide

### Graphiques ne s'affichent pas
```bash
cd client
npm list recharts
# Si absent:
npm install recharts --legacy-peer-deps
npm start
```

### Export CSV ne télécharge rien
- Vérifier backend sur port 3001
- Ouvrir DevTools → Network → voir requête /api/reports/users
- Vérifier logs serveur

### "Access Denied"
- Vérifier que vous êtes connecté avec un compte admin
- Dans MySQL: `SELECT role FROM users WHERE email = 'votre@email.com';`
- Doit afficher: `admin`

### Table admin_actions n'existe pas
```bash
node run-admin-migrations.js
```

---

## ✅ Résultat Attendu

Si **TOUS les tests passent:**

```
🎉 Panel Admin 100% Opérationnel !

✅ Dashboard avec KPIs
✅ Graphiques Recharts
✅ Exports CSV
✅ Gestion Users (RBAC)
✅ Modération Produits
✅ Validation Projets
✅ Logs d'Audit
✅ Activité Récente

🚀 Prêt pour Production !
```

---

## 📚 Prochaines Étapes (Optionnel)

### 1. Tests E2E Playwright
```bash
npx playwright test
```

### 2. Configuration WebSocket (Notifications)
- Modifier `server/index.js` pour Socket.IO
- Voir guide: `FINAL_SETUP_GUIDE.md`

### 3. Créer compte Moderator
```sql
INSERT INTO users (email, password, full_name, role, is_active) 
VALUES ('moderator@agrikonbit.com', '$2a$10$...', 'Test Moderator', 'moderator', 1);
```

### 4. Tests de Permissions
- Login avec moderator
- Vérifier accès limité (pas de Users, pas de Dashboard stats)

---

**Durée totale:** ~5 minutes  
**Tests essentiels:** 7/7  
**Status:** ✅ Ready for Production

**Bon test ! 🚀**
