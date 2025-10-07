# 🚀 Admin Panel - Guide de Démarrage Rapide

**Prérequis:** Node.js, MySQL, serveurs backend et frontend existants

---

## ⚡ Installation en 3 étapes

### 1️⃣ Installer Recharts (Graphiques)

```bash
cd client
npm install recharts
```

### 2️⃣ Exécuter la migration (Rôle Moderator)

```bash
# Option A: Depuis MySQL CLI
mysql -u root -p agrikonbit < migrations/010_add_moderator_role.sql

# Option B: Depuis MySQL Workbench
# Ouvrir migrations/010_add_moderator_role.sql et exécuter
```

**Contenu de la migration:**
```sql
ALTER TABLE users
  MODIFY COLUMN role ENUM('admin','investor','farmer','consumer','moderator') 
  NOT NULL DEFAULT 'consumer';
```

### 3️⃣ Démarrer les serveurs

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

---

## 🎯 Accès immédiat

1. **Ouvrir le navigateur:** `http://localhost:3000/admin`
2. **Se connecter** avec un compte admin existant
3. **Profiter du panel !** ✨

---

## 🧪 Tester rapidement

### Checklist 5 minutes

```bash
✅ Dashboard s'affiche avec KPIs
✅ Graphiques recharts visibles (pie, bar)
✅ Section "Exports CSV" → cliquer un bouton → fichier téléchargé
✅ "Projets en attente" → approuver/rejeter → notification créée
✅ Menu "👥 Utilisateurs" → filtrer par rôle → pagination fonctionne
✅ Changer le rôle d'un user → dropdown → toast confirmation
✅ Menu "🛒 Produits" → filtrer par statut → activer/désactiver
✅ Activité récente affiche derniers projets et investissements
```

---

## 👤 Créer un compte Moderator (optionnel)

```sql
-- Remplacer le password hashé par le vôtre (bcrypt)
INSERT INTO users (email, password, full_name, role, is_active, created_at) 
VALUES (
  'moderator@agrikonbit.com',
  '$2a$10$...VotreHashBcryptIci...',
  'Test Moderator',
  'moderator',
  1,
  NOW()
);

-- Créer le wallet associé
INSERT INTO user_wallets (user_id, gyt_balance, created_at)
SELECT id, 0, NOW()
FROM users
WHERE email = 'moderator@agrikonbit.com';
```

**Permissions du Moderator:**
- ✅ Voir les produits et les désactiver
- ✅ Voir les projets en attente
- ❌ Ne peut PAS valider/rejeter les projets
- ❌ Ne peut PAS gérer les utilisateurs
- ❌ Ne peut PAS modifier les settings

---

## 📊 Fonctionnalités disponibles

### Dashboard (`/admin`)
- **6 KPIs:** Users, Projects, Orders, Validated, Invested, Revenue
- **4 Exports CSV:** Users, Projects, Investments, Orders
- **3 Métriques:** Taux validation, Taux complétion, Revenu moyen
- **3 Graphiques:** Répartition rôles, Statuts projets, Revenus
- **Validation projets:** Approve/Reject avec notes
- **Activité récente:** 5 derniers projets + 5 derniers investissements

### Utilisateurs (`/admin/users`)
- Filtres: rôle + statut
- Pagination: 20 par page
- Actions: Changer rôle, Activer/Désactiver
- Export CSV en un clic

### Produits (`/admin/products`)
- Filtres: statut + catégorie + recherche
- Pagination: 20 par page
- Actions: Activer/Désactiver
- Vue détails agriculteur

---

## 🔐 Sécurité

**Backend:**
- ✅ Toutes les routes protégées par `authenticateToken`
- ✅ RBAC avec `requireAdmin` / `requireAdminOrModerator`
- ✅ Validation des inputs avec `express-validator`
- ✅ Impossible de modifier les comptes admin

**Frontend:**
- ✅ `AdminGuard` bloque l'accès non autorisé
- ✅ Redirect automatique vers `/login` si non connecté
- ✅ Page "Accès refusé" si rôle insuffisant

---

## 🐛 Problèmes courants

### Erreur: "recharts is not defined"
```bash
cd client
npm install recharts
npm start
```

### Erreur: "Unknown column 'moderator' in 'field list'"
```bash
# La migration n'a pas été exécutée
mysql -u root -p agrikonbit < migrations/010_add_moderator_role.sql
```

### Dashboard vide / pas de données
```bash
# Vérifier que les tables ont des données
mysql -u root -p agrikonbit

SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM investments;
```

### Graphiques ne s'affichent pas
```bash
# Vérifier que recharts est installé
cd client
npm list recharts

# Si absent:
npm install recharts
```

### CSV ne télécharge pas
- Vérifier que le backend tourne sur port 3001
- Ouvrir DevTools → Network → voir la requête
- Vérifier les données dans la DB

---

## 📚 Documentation complète

- **`ADMIN_PANEL_IMPLEMENTATION.md`** - Guide complet du panel (60 pages)
- **`ADMIN_ANALYTICS_GUIDE.md`** - Guide des graphiques Recharts
- **`README.md`** - Documentation générale du projet

---

## 🎨 Personnalisation rapide

### Changer les couleurs des graphiques
Fichier: `client/src/components/admin/AnalyticsCharts.js`
```javascript
const COLORS = [
  '#3B82F6',  // Bleu
  '#10B981',  // Vert
  '#F59E0B',  // Orange
  // Ajoutez vos couleurs
];
```

### Modifier le nombre d'items par page
Fichier: `client/src/pages/Admin/Users.js` ou `Products.js`
```javascript
const [limit] = useState(20); // Changer à 50, 100, etc.
```

### Ajouter un export
Fichier: `server/routes/reports.js`
```javascript
router.get('/mon-export', authenticateToken, requireAdmin, async (req, res) => {
  // Votre logique ici
});
```

---

## 📞 Support & Ressources

### En cas de problème

1. **Vérifier les logs serveur**
   ```bash
   # Terminal backend
   # Les erreurs s'affichent dans la console
   ```

2. **Vérifier les logs navigateur**
   ```
   F12 → Console → voir les erreurs JS
   F12 → Network → voir les requêtes API
   ```

3. **Consulter la documentation**
   - Lire `ADMIN_PANEL_IMPLEMENTATION.md`
   - Section "Troubleshooting"

4. **Tester avec Postman**
   ```
   GET http://localhost:3001/api/admin/dashboard
   Header: Authorization: Bearer {votre_token}
   ```

---

## ✅ Checklist finale

Avant de considérer le panel opérationnel:

```bash
✅ Recharts installé (npm list recharts)
✅ Migration 010 exécutée (SHOW COLUMNS FROM users LIKE 'role')
✅ Backend démarre sans erreur (port 3001)
✅ Frontend démarre sans erreur (port 3000)
✅ Connexion admin réussie
✅ Dashboard affiche les KPIs
✅ Graphiques visibles
✅ Export CSV fonctionne (au moins 1)
✅ Validation projet fonctionne
✅ Changement rôle user fonctionne
✅ Activation/désactivation produit fonctionne
```

---

## 🚀 Prochaines étapes recommandées

### Priorité Haute
1. **Tests complets** - Suivre la checklist dans `ADMIN_PANEL_IMPLEMENTATION.md`
2. **Créer données de test** - Projets, users, commandes pour remplir les graphiques
3. **Compte moderator** - Tester les permissions RBAC

### Priorité Moyenne
4. **Line chart temporel** - Évolution des investissements dans le temps
5. **Top performers** - Classement agriculteurs/investisseurs
6. **Filtres de période** - 7j, 30j, 3m, 1an sur les graphiques

### Priorité Basse
7. **Dark mode** - Thème sombre pour le dashboard
8. **Notifications push** - WebSocket pour notifs temps réel
9. **Logs d'audit** - Table `admin_actions`
10. **Tests E2E** - Playwright pour flux admin

---

## 🎉 Félicitations !

Vous avez maintenant un **Panel Admin complet et professionnel** pour AgriKonbit, avec:

✨ **Gestion complète** - Users, Projects, Products  
📊 **Visualisations** - Graphiques interactifs  
📥 **Exports** - CSV en un clic  
🔐 **Sécurité** - RBAC frontend + backend  
📱 **Responsive** - Fonctionne sur tous les écrans  
🚀 **Performant** - Pagination, cache React Query  

**Bon admin et bonne modération ! 💪**

---

**Version:** 1.0.0  
**Date:** 2025-10-04  
**Support:** Voir documentation complète dans `ADMIN_PANEL_IMPLEMENTATION.md`
