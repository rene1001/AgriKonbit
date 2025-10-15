# 🚀 Instructions de Démarrage - Trésorerie Plateforme

## Étape 1 : Exécuter la Migration

### Option A : Via phpMyAdmin (Recommandé)
1. Ouvrir **phpMyAdmin** : `http://localhost/phpmyadmin`
2. Sélectionner la base de données **`agrikonbit`**
3. Cliquer sur l'onglet **"SQL"**
4. Ouvrir le fichier `migrations/027_platform_treasury.sql`
5. Copier tout le contenu
6. Coller dans la zone SQL de phpMyAdmin
7. Cliquer sur **"Exécuter"**

### Option B : Via Ligne de Commande
```bash
# Trouver le chemin de mysql.exe dans WAMP
# Généralement : C:\wamp64\bin\mysql\mysql[version]\bin\mysql.exe

# Puis exécuter :
cd C:\wamp64\www\AgriKonbit
"C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" -u root -p agrikonbit < migrations\027_platform_treasury.sql
```

### Option C : Double-cliquer sur le fichier batch
```
executer-migration-027.bat
```
(Entrez le mot de passe MySQL quand demandé)

---

## Étape 2 : Démarrer le Serveur Backend

### Terminal 1 - Backend
```bash
cd C:\wamp64\www\AgriKonbit\server
npm start
```

**Résultat attendu :**
```
Server running on port 3001
Database connected successfully
```

---

## Étape 3 : Démarrer le Client Frontend

### Terminal 2 - Frontend
```bash
cd C:\wamp64\www\AgriKonbit\client
npm start
```

**Résultat attendu :**
```
Compiled successfully!
Local: http://localhost:3000
```

---

## Étape 4 : Tester la Trésorerie

1. **Ouvrir le navigateur** : `http://localhost:3000`
2. **Se connecter** en tant qu'admin
3. **Aller sur** : `http://localhost:3000/admin`
4. **Cliquer** sur "💰 Trésorerie Plateforme" dans la sidebar
5. **Vérifier** que la page s'affiche correctement

---

## ✅ Vérifications

### Base de Données
```sql
-- Vérifier que les tables existent
USE agrikonbit;
SHOW TABLES LIKE 'platform_treasury%';

-- Vérifier l'enregistrement initial
SELECT * FROM platform_treasury WHERE id = 1;
```

**Résultat attendu :**
```
+----+-------------+----------------------+-----------------+---------------------+---------------------+
| id | balance_usd | total_fees_collected | total_withdrawn | last_updated        | created_at          |
+----+-------------+----------------------+-----------------+---------------------+---------------------+
|  1 |      0.0000 |               0.0000 |          0.0000 | 2025-10-15 10:00:00 | 2025-10-15 10:00:00 |
+----+-------------+----------------------+-----------------+---------------------+---------------------+
```

### Backend
```bash
# Tester l'API
curl http://localhost:3001/api/treasury
```

### Frontend
- Dashboard admin visible
- Sidebar avec 9 sections
- Section "Trésorerie Plateforme" présente
- Boutons retour dans Users et Products

---

## 🐛 Dépannage

### Erreur : "mysql n'est pas reconnu"
**Solution :** Utiliser phpMyAdmin ou le chemin complet de mysql.exe

### Erreur : "Cannot find module"
**Solution :** 
```bash
cd server
npm install

cd ../client
npm install
```

### Erreur : "Port 3001 already in use"
**Solution :** Tuer le processus existant ou changer le port dans `.env`

### Erreur : "ECONNREFUSED"
**Solution :** Vérifier que MySQL est démarré dans WAMP

---

## 📝 Commandes Rapides

### Tout en un (après migration)
```bash
# Terminal 1
cd C:\wamp64\www\AgriKonbit\server && npm start

# Terminal 2 (nouveau terminal)
cd C:\wamp64\www\AgriKonbit\client && npm start
```

### Ou utiliser le script de démarrage
```bash
start-dev.bat
```

---

## 🎯 Prochaines Étapes

Après le démarrage :
1. ✅ Tester la page trésorerie
2. ✅ Créer un retrait test
3. ✅ Vérifier l'historique
4. ✅ Tester les filtres
5. ✅ Vérifier que les frais s'ajoutent automatiquement lors des retraits

---

## 📖 Documentation

- **`TRESORERIE_PLATEFORME.md`** - Documentation technique complète
- **`RESUME_TRESORERIE.md`** - Résumé et guide d'utilisation
- **`NOUVEAU_DASHBOARD_SIDEBAR.md`** - Structure du dashboard

---

## ✅ Checklist Finale

- [ ] Migration 027 exécutée avec succès
- [ ] Tables créées dans la base de données
- [ ] Serveur backend démarré (port 3001)
- [ ] Client frontend démarré (port 3000)
- [ ] Page `/admin/treasury` accessible
- [ ] Sidebar affiche 9 sections
- [ ] Boutons retour fonctionnent

**Tout est prêt ! Bonne utilisation ! 🚀**
