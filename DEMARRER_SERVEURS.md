# 🚀 GUIDE DE DÉMARRAGE - AgriKonbit

## ⚠️ PROBLÈME ACTUEL

Le backend n'est **pas démarré**, c'est pourquoi :
- ❌ Les produits ne s'affichent pas
- ❌ Les projets ne s'affichent pas
- ❌ La connexion est impossible

## ✅ SOLUTION : Démarrer le Backend

### Étape 1 : Vérifier la Base de Données

**WAMP doit être démarré !**

1. Ouvrir **WAMP**
2. Vérifier que l'icône est **verte**
3. Si elle est orange/rouge, cliquer et démarrer tous les services

### Étape 2 : Vérifier le fichier .env

Le fichier `server/.env` doit exister avec cette configuration :

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=agrikonbit
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000
```

**Si le fichier n'existe pas** :
```bash
cd server
copy env.example .env
```

### Étape 3 : Démarrer le Backend

**Option 1 : Via Terminal (Recommandé)**

```bash
# Ouvrir un terminal dans le dossier server
cd c:\wamp64\www\AgriKonbit\server

# Démarrer le serveur
npm start
```

**Option 2 : Via VS Code**

1. Ouvrir un nouveau terminal dans VS Code (Ctrl + `)
2. Naviguer vers le dossier server :
   ```bash
   cd server
   ```
3. Démarrer :
   ```bash
   npm start
   ```

### Étape 4 : Vérifier que le Backend fonctionne

Vous devriez voir :
```
✅ Server running on port 5000
✅ Database connected successfully
✅ Socket.IO initialized
```

**Test rapide** :
- Ouvrir un navigateur
- Aller sur : http://localhost:5000/api/health
- Vous devriez voir : `{"success":true,"message":"Server is running"}`

### Étape 5 : Démarrer le Frontend

**Dans un NOUVEAU terminal** :

```bash
# Ouvrir un nouveau terminal
cd c:\wamp64\www\AgriKonbit\client

# Démarrer le frontend
npm start
```

Le navigateur devrait s'ouvrir automatiquement sur http://localhost:3000

---

## 🔧 RÉSOLUTION DES PROBLÈMES

### Problème 1 : "Port 5000 already in use"

**Solution** :
```bash
# Trouver le processus qui utilise le port 5000
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID par le numéro affiché)
taskkill /PID <PID> /F

# Redémarrer le serveur
npm start
```

### Problème 2 : "Cannot connect to database"

**Solutions** :
1. Vérifier que WAMP est démarré (icône verte)
2. Vérifier que MySQL fonctionne dans WAMP
3. Vérifier les identifiants dans `.env` :
   - `DB_HOST=localhost`
   - `DB_USER=root`
   - `DB_PASSWORD=` (vide par défaut)
   - `DB_NAME=agrikonbit`

### Problème 3 : "Database 'agrikonbit' does not exist"

**Solution** :
```bash
# Créer la base de données
cd server
node migrations/run-migrations.js
```

Ou via phpMyAdmin :
1. Ouvrir http://localhost/phpmyadmin
2. Créer une nouvelle base de données nommée `agrikonbit`
3. Importer le fichier SQL si disponible

### Problème 4 : Le frontend ne se connecte pas au backend

**Vérifier** :
1. Le backend est bien sur le port 5000
2. Le frontend est bien sur le port 3000
3. Pas d'erreurs CORS dans la console du navigateur

---

## 📋 CHECKLIST DE DÉMARRAGE

Avant de tester l'application, vérifier :

- [ ] WAMP est démarré (icône verte)
- [ ] MySQL fonctionne dans WAMP
- [ ] La base de données `agrikonbit` existe
- [ ] Le fichier `server/.env` existe et est configuré
- [ ] Le backend est démarré (port 5000)
- [ ] Le frontend est démarré (port 3000)
- [ ] http://localhost:5000/api/health répond
- [ ] http://localhost:3000 s'affiche

---

## 🎯 COMMANDES RAPIDES

### Démarrage Complet

**Terminal 1 - Backend** :
```bash
cd c:\wamp64\www\AgriKonbit\server
npm start
```

**Terminal 2 - Frontend** :
```bash
cd c:\wamp64\www\AgriKonbit\client
npm start
```

### Vérification

```bash
# Vérifier le backend
curl http://localhost:5000/api/health

# Vérifier les processus
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## 🆘 SI RIEN NE FONCTIONNE

1. **Redémarrer WAMP complètement**
2. **Fermer tous les terminaux**
3. **Ouvrir 2 nouveaux terminaux**
4. **Suivre les étapes de démarrage ci-dessus**

---

## ✅ APRÈS LE DÉMARRAGE

Une fois les deux serveurs démarrés :

1. **Tester la connexion** :
   - Email : `admin@agrikonbit.com`
   - Mot de passe : `admin123`

2. **Vérifier les fonctionnalités** :
   - Voir les projets
   - Voir les produits
   - Se connecter
   - Naviguer dans les dashboards

---

## 📞 SUPPORT

Si les problèmes persistent :
1. Vérifier les logs du backend dans le terminal
2. Vérifier la console du navigateur (F12)
3. Vérifier les logs de WAMP

**Logs importants** :
- Backend : Affichés dans le terminal où `npm start` est lancé
- Frontend : Console du navigateur (F12 → Console)
- MySQL : Logs WAMP

---

**Bon démarrage ! 🚀**
