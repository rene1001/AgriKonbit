# 🎯 AgriKonbit Admin Panel - Guide d'Installation Complet

**Version Finale:** 2.0.0  
**Date:** 2025-10-04  
**Statut:** ✅ Production Ready

---

## 📦 Vue d'ensemble des fonctionnalités

### ✅ Fonctionnalités Core (v1.0)
- **Dashboard Admin** avec KPIs et graphiques Recharts
- **Gestion Utilisateurs** (filtres, pagination, changement rôle, activation)
- **Modération Produits** (filtres, pagination, activation/désactivation)
- **Validation Projets** (approve/reject avec notes)
- **Exports CSV** (users, projects, investments, orders)
- **RBAC** (admin, moderator avec permissions granulaires)
- **AdminGuard** (protection routes côté client)

### ✨ Fonctionnalités Avancées (v2.0)
- **Logs d'Audit** (traçabilité complète des actions admin)
- **Notifications WebSocket** (temps réel avec Socket.IO)
- **Tests E2E Playwright** (automatisation complète)

---

## 🚀 Installation Complète

### Étape 1: Installer les dépendances NPM

```bash
# Backend
cd server
npm install socket.io

# Frontend
cd client
npm install recharts socket.io-client

# Tests E2E
cd ..
npm install --save-dev @playwright/test
npx playwright install
```

### Étape 2: Exécuter les migrations SQL

```bash
# Migration 010: Ajouter rôle moderator
mysql -u root -p agrikonbit < migrations/010_add_moderator_role.sql

# Migration 011: Créer table audit logs
mysql -u root -p agrikonbit < migrations/011_create_admin_actions_table.sql
```

**Vérification:**
```sql
-- Vérifier que moderator existe
SHOW COLUMNS FROM users LIKE 'role';

-- Vérifier que admin_actions existe
SHOW TABLES LIKE 'admin_actions';
```

### Étape 3: Configurer Socket.IO Backend

#### Modifier `server/index.js`

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./config/socket');
const notificationService = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 3001;

// ... votre config express existante ...

// Créer serveur HTTP
const server = http.createServer(app);

// Initialiser Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Configurer Socket.IO
initializeSocket(io);
notificationService.initializeSocket(io);

// Remplacer app.listen par server.listen
db.connect()
  .then(() => {
    console.log('✅ Database connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 WebSocket ready`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

module.exports = { app, server };
```

### Étape 4: Configuration Frontend WebSocket

#### Créer `client/src/hooks/useSocket.js`

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const socketInstance = io(API_URL, {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      socketInstance.emit('get_unread_count');
    });

    socketInstance.on('notification', (data) => {
      console.log('🔔 Notification:', data);
      toast.info(data.title);
      setUnreadCount(prev => prev + 1);
    });

    socketInstance.on('unread_count', ({ count }) => {
      setUnreadCount(count);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  const markAsRead = (notificationId) => {
    if (socket) {
      socket.emit('mark_read', { notificationId });
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return { socket, connected, unreadCount, markAsRead };
}
```

#### Utiliser dans Layout/Header

```javascript
import { useSocket } from '../../hooks/useSocket';

function Header() {
  const { connected, unreadCount } = useSocket();

  return (
    <header>
      {/* ... votre header existant ... */}
      
      {/* Badge notifications */}
      <div className="relative">
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Indicateur WebSocket */}
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
    </header>
  );
}
```

### Étape 5: Variables d'environnement

#### `server/.env`

```bash
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_me
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=agrikonbit
```

#### `client/.env`

```bash
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=http://localhost:3001
```

#### `.env.test` (pour Playwright)

```bash
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001
ADMIN_EMAIL=admin@agrikonbit.com
ADMIN_PASSWORD=your_admin_password
```

### Étape 6: Créer un compte Moderator (optionnel)

```sql
-- Générer hash bcrypt de votre mot de passe sur: https://bcrypt-generator.com/
-- Rounds: 10

INSERT INTO users (email, password, full_name, role, is_active, created_at) 
VALUES (
  'moderator@agrikonbit.com',
  '$2a$10$YOUR_BCRYPT_HASH_HERE',
  'Test Moderator',
  'moderator',
  1,
  NOW()
);

-- Créer wallet associé
INSERT INTO user_wallets (user_id, gyt_balance, created_at)
SELECT id, 0, NOW()
FROM users
WHERE email = 'moderator@agrikonbit.com';
```

---

## ✅ Vérification de l'installation

### Checklist Complète

```bash
# 1. Dépendances NPM
cd server && npm list socket.io
cd client && npm list recharts socket.io-client
npm list @playwright/test

# 2. Migrations SQL
mysql -u root -p agrikonbit -e "SHOW COLUMNS FROM users LIKE 'role';"
mysql -u root -p agrikonbit -e "SHOW TABLES LIKE 'admin_actions';"

# 3. Fichiers créés
ls server/middleware/auditLog.js
ls server/services/notificationService.js
ls server/config/socket.js
ls client/src/components/admin/AnalyticsCharts.js
ls client/src/components/guards/AdminGuard.js
ls client/src/hooks/useSocket.js
ls tests/e2e/admin.spec.ts

# 4. Serveurs démarrés
cd server && npm start  # Port 3001
cd client && npm start  # Port 3000

# 5. Tests E2E
npx playwright test --list
```

---

## 🧪 Tests de validation

### Test 1: Dashboard & Graphiques

```bash
# 1. Ouvrir http://localhost:3000/admin
# 2. Se connecter avec admin
# 3. Vérifier:
✓ 6 cartes KPI visibles
✓ Section "Exports & Rapports" visible
✓ 3 graphiques Recharts affichés
✓ Section "Projets en attente" visible
✓ Activité récente visible
```

### Test 2: Exports CSV

```bash
# 1. Sur /admin, cliquer "Utilisateurs" (export)
# 2. Fichier users-export-{timestamp}.csv téléchargé
# 3. Ouvrir avec Excel/LibreOffice
✓ Colonnes: id, email, full_name, role, etc.
✓ Données correctes (pas de [object Object])
```

### Test 3: Gestion Utilisateurs

```bash
# 1. Cliquer "👥 Utilisateurs"
# 2. Filtrer par rôle: farmer
# 3. Changer le rôle d'un user: investor
# 4. Activer/désactiver un compte
✓ Toast de confirmation affiché
✓ Table mise à jour
```

### Test 4: Modération Produits

```bash
# 1. Cliquer "🛒 Produits"
# 2. Filtrer par statut: inactive
# 3. Rechercher: "tomate"
# 4. Activer un produit
✓ Toast "Produit mis à jour"
✓ Statut changé en Oui
```

### Test 5: Validation Projets

```bash
# 1. Sur /admin, section "Projets en attente"
# 2. Saisir notes: "Excellent dossier"
# 3. Cliquer "Approuver"
✓ Toast "Projet mis à jour"
✓ Projet disparaît de la liste
✓ Notification créée pour l'agriculteur
✓ Log d'audit créé en DB
```

### Test 6: Logs d'Audit

```bash
# 1. Exécuter une action admin (ex: approuver projet)
# 2. Vérifier en DB:
SELECT * FROM admin_actions ORDER BY created_at DESC LIMIT 5;

✓ Ligne créée avec:
  - admin_id correct
  - action_type: 'project.approve'
  - target_id: ID du projet
  - details: JSON avec notes
  - ip_address: IP de l'admin
  - created_at: timestamp
```

### Test 7: WebSocket Notifications

```bash
# 1. Ouvrir DevTools → Console
# 2. Se connecter en admin
# 3. Chercher logs:
✅ WebSocket connected

# 4. Dans un autre onglet, créer un projet farmer
# 5. Sur admin, vérifier:
✓ Log console: "🔔 Notification: Nouveau projet..."
✓ Toast notification affiché
✓ Badge compteur +1
```

### Test 8: Tests E2E Playwright

```bash
# Exécuter tous les tests
npx playwright test

# Résultat attendu:
✓ Admin Panel - Authentication (3 passed)
✓ Admin Panel - Dashboard (3 passed)
✓ Admin Panel - Project Validation (4 passed)
✓ Admin Panel - User Management (7 passed)
✓ Admin Panel - Product Moderation (5 passed)
✓ Admin Panel - CSV Exports (4 passed)

Total: 26 tests passed
```

---

## 🎯 Workflows typiques

### Workflow 1: Valider un projet

1. Admin reçoit notification WebSocket "Nouveau projet en attente"
2. Va sur `/admin`
3. Section "Projets en attente" → voir le projet
4. Saisir notes de validation
5. Cliquer "Approuver"
6. ✅ Projet validé
7. ✅ Agriculteur notifié
8. ✅ Action loggée dans `admin_actions`

### Workflow 2: Modérer un produit

1. Moderator va sur `/admin/products`
2. Recherche "tomate"
3. Voir produit avec prix/stock incorrect
4. Cliquer "Désactiver"
5. ✅ Produit invisible sur marketplace
6. ✅ Action loggée

### Workflow 3: Exporter des données

1. Admin va sur `/admin`
2. Section "Exports & Rapports"
3. Cliquer "Investissements"
4. ✅ Fichier `investments-export-{timestamp}.csv` téléchargé
5. Ouvrir dans Excel → analyser les données

### Workflow 4: Consulter les logs

1. Admin exécute requête SQL:
```sql
SELECT 
  admin_name,
  action_type,
  target_type,
  target_id,
  created_at
FROM admin_actions
WHERE DATE(created_at) = CURDATE()
ORDER BY created_at DESC;
```
2. ✅ Voir toutes les actions de la journée

---

## 📊 Endpoints API Complets

### Administration

```javascript
GET    /api/admin/dashboard
GET    /api/admin/projects/pending
PATCH  /api/admin/projects/:id/validate
GET    /api/admin/users
PATCH  /api/admin/users/:id/status
PATCH  /api/admin/users/:id/role
GET    /api/admin/products
PATCH  /api/admin/products/:id/status
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/audit-logs
```

### Exports CSV

```javascript
GET    /api/reports/users?format=csv
GET    /api/reports/projects?format=csv
GET    /api/reports/investments?format=csv
GET    /api/reports/orders?format=csv
```

### WebSocket Events

```javascript
// Client → Server
emit('mark_read', { notificationId })
emit('get_unread_count')

// Server → Client
on('connected', data)
on('notification', data)
on('admin_notification', data)
on('unread_count', { count })
on('notification_read', { notificationId })
```

---

## 📚 Documentation complète

- **`README.md`** - Documentation générale du projet
- **`ADMIN_PANEL_IMPLEMENTATION.md`** - Guide panel admin v1.0 (60 pages)
- **`ADMIN_ANALYTICS_GUIDE.md`** - Guide graphiques Recharts
- **`ADMIN_QUICK_START.md`** - Démarrage rapide
- **`ADVANCED_FEATURES_GUIDE.md`** - Audit Logs, WebSocket, Tests E2E
- **`FINAL_SETUP_GUIDE.md`** - Ce fichier

---

## 🐛 Troubleshooting

### Problème: Recharts ne s'affiche pas

```bash
cd client
npm install recharts
npm start
# Vider cache navigateur (Ctrl+Shift+R)
```

### Problème: WebSocket ne se connecte pas

```bash
# Vérifier que Socket.IO est initialisé dans server/index.js
# Chercher: const io = new Server(server, { ... });

# Vérifier logs serveur
✅ WebSocket ready
✅ User connected: ...

# Vérifier logs console navigateur
✅ WebSocket connected
```

### Problème: Tests Playwright échouent

```bash
# Vérifier que les serveurs tournent
curl http://localhost:3001/health
curl http://localhost:3000

# Reinstaller navigateurs
npx playwright install --force

# Mode debug
npx playwright test --debug
```

### Problème: Migration échoue

```bash
# Vérifier syntaxe SQL
cat migrations/011_create_admin_actions_table.sql

# Exécuter manuellement dans MySQL Workbench
# ou ligne par ligne dans MySQL CLI
```

### Problème: Export CSV vide

```bash
# Vérifier données en DB
mysql -u root -p agrikonbit -e "SELECT COUNT(*) FROM users;"

# Vérifier route backend
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/reports/users?format=csv
```

---

## 🎉 Félicitations !

Vous avez maintenant un **Panel Admin professionnel et complet** pour AgriKonbit avec:

✅ **Gestion complète** - Users, Projects, Products  
✅ **Visualisations** - Graphiques Recharts interactifs  
✅ **Exports** - CSV en un clic  
✅ **RBAC** - Admin + Moderator  
✅ **Sécurité** - Frontend + Backend guards  
✅ **Audit Logs** - Traçabilité complète  
✅ **Notifications** - Temps réel WebSocket  
✅ **Tests E2E** - Automatisation Playwright  
✅ **Production Ready** - Scalable et maintenable  

---

**Version:** 2.0.0  
**Développé avec ❤️ pour AgriKonbit**  
**Date:** 2025-10-04  
**Status:** ✅ Production Ready

**Bon admin ! 🚀**
