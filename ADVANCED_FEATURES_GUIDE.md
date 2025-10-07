# 🚀 Admin Panel - Fonctionnalités Avancées

**Version:** 2.0.0  
**Date:** 2025-10-04  
**Fonctionnalités:** Audit Logs • WebSocket Notifications • Tests E2E

---

## 📋 Table des Matières

1. [Logs d'Audit](#logs-daudit)
2. [Notifications Temps Réel (WebSocket)](#notifications-temps-réel)
3. [Tests E2E Playwright](#tests-e2e-playwright)
4. [Installation & Configuration](#installation--configuration)
5. [Guide d'utilisation](#guide-dutilisation)

---

## 🔍 Logs d'Audit

### Vue d'ensemble

Le système de logs d'audit enregistre automatiquement toutes les actions des administrateurs et modérateurs pour:
- **Traçabilité**: Qui a fait quoi et quand
- **Sécurité**: Détecter les abus ou accès non autorisés
- **Conformité**: Répondre aux exigences réglementaires
- **Debug**: Analyser les problèmes

### Architecture

#### Table `admin_actions`

```sql
CREATE TABLE admin_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,              -- ID de l'admin/moderator
  action_type VARCHAR(50) NOT NULL,   -- Type d'action
  target_type VARCHAR(50) NOT NULL,   -- Type de cible
  target_id INT,                      -- ID de la cible
  details JSON,                       -- Détails supplémentaires
  ip_address VARCHAR(45),             -- Adresse IP
  user_agent TEXT,                    -- Navigateur/OS
  created_at TIMESTAMP,               -- Date/heure
  
  INDEX idx_admin_id (admin_id),
  INDEX idx_action_type (action_type),
  INDEX idx_created_at (created_at)
);
```

#### Types d'actions loggées

```javascript
// Utilisateurs
'user.activate'      // Activation de compte
'user.deactivate'    // Désactivation de compte
'user.role_change'   // Changement de rôle

// Projets
'project.approve'    // Approbation de projet
'project.reject'     // Rejet de projet

// Produits
'product.activate'   // Activation de produit
'product.deactivate' // Désactivation de produit

// Système
'settings.update'    // Modification des paramètres
'export.csv'         // Export de données
```

### API Endpoints

#### Consulter les logs

```http
GET /api/admin/audit-logs
```

**Query Parameters:**
```javascript
{
  adminId: number,      // Filtrer par admin
  actionType: string,   // Filtrer par type d'action
  targetType: string,   // Filtrer par type de cible
  startDate: string,    // Date de début (ISO)
  endDate: string,      // Date de fin (ISO)
  page: number,         // Page (default: 1)
  limit: number         // Items par page (default: 50)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 123,
        "admin_id": 1,
        "admin_name": "John Admin",
        "admin_email": "admin@agrikonbit.com",
        "admin_role": "admin",
        "action_type": "project.approve",
        "target_type": "project",
        "target_id": 456,
        "details": {
          "action": "approve",
          "notes": "Excellent dossier",
          "previousStatus": "pending",
          "newStatus": "validated"
        },
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 234,
      "pages": 5
    }
  }
}
```

### Utilisation dans le code

#### Logger une action manuellement

```javascript
const { logAdminAction } = require('../middleware/auditLog');

// Dans votre route/controller
await logAdminAction(
  req.user.id,              // Admin ID
  'product.activate',       // Action type
  'product',                // Target type
  productId,                // Target ID
  { reason: 'Quality OK' }, // Additional details
  req                       // Request object (pour IP/UA)
);
```

#### Middleware automatique

```javascript
const { auditLogMiddleware } = require('../middleware/auditLog');

router.patch('/users/:id/status', 
  authenticateToken,
  requireAdmin,
  auditLogMiddleware('user.activate', 'user'),
  async (req, res) => {
    // Votre logique ici
    // Le log sera créé automatiquement si success: true
  }
);
```

### Exemples de requêtes

#### Voir toutes les actions d'un admin

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3001/api/admin/audit-logs?adminId=1"
```

#### Voir tous les projets approuvés

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3001/api/admin/audit-logs?actionType=project.approve"
```

#### Voir l'activité des 7 derniers jours

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3001/api/admin/audit-logs?startDate=2024-01-01&endDate=2024-01-07"
```

---

## 📡 Notifications Temps Réel

### Vue d'ensemble

Système de notifications en temps réel utilisant **Socket.IO** pour:
- Notifier instantanément les admins des nouvelles actions
- Alerter les utilisateurs de changements de statut
- Diffuser des annonces système
- Afficher le compteur de notifications non lues

### Architecture

#### Stack technique
- **Backend**: Socket.IO + Express
- **Frontend**: Socket.IO Client + React
- **Authentification**: JWT via handshake
- **Rooms**: user_{id}, admins, system

### Installation

#### Backend

```bash
cd server
npm install socket.io
```

#### Frontend

```bash
cd client
npm install socket.io-client
```

### Configuration Backend

#### 1. Initialiser dans `server/index.js`

```javascript
const http = require('http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./config/socket');
const notificationService = require('./services/notificationService');

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

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready`);
});
```

#### 2. Service de notifications

```javascript
const { sendNotificationToUser } = require('../services/notificationService');

// Envoyer notification à un utilisateur
await sendNotificationToUser(userId, {
  title: 'Projet approuvé',
  message: 'Votre projet a été approuvé par l\'admin',
  type: 'success',
  data: { projectId: 123 }
});
```

#### 3. Notifier tous les admins

```javascript
const { sendNotificationToAdmins } = require('../services/notificationService');

await sendNotificationToAdmins({
  title: 'Nouveau projet en attente',
  message: 'Un agriculteur a soumis un nouveau projet',
  type: 'info',
  data: { projectId: 456 }
});
```

### Configuration Frontend

#### 1. Créer le hook `useSocket`

```javascript
// client/src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketInstance = io('http://localhost:3001', {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    });

    socketInstance.on('notification', (data) => {
      console.log('🔔 New notification:', data);
      setNotifications(prev => [data, ...prev]);
      // Afficher toast
      toast.info(data.title);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  return { socket, connected, notifications };
}
```

#### 2. Utiliser dans un composant

```javascript
import { useSocket } from '../hooks/useSocket';

function AdminDashboard() {
  const { socket, connected, notifications } = useSocket();

  useEffect(() => {
    if (socket) {
      // Demander le compteur de non-lus
      socket.emit('get_unread_count');
      
      socket.on('unread_count', ({ count }) => {
        console.log(`📬 ${count} notifications non lues`);
      });
    }
  }, [socket]);

  return (
    <div>
      {connected ? '🟢 Connecté' : '🔴 Déconnecté'}
      <NotificationBadge count={notifications.length} />
    </div>
  );
}
```

### Events disponibles

#### Client → Server

```javascript
// Marquer notification comme lue
socket.emit('mark_read', { notificationId: 123 });

// Obtenir compteur non-lus
socket.emit('get_unread_count');
```

#### Server → Client

```javascript
// Notification personnelle
socket.on('notification', (data) => {
  // { id, title, message, type, data, created_at }
});

// Notification admin
socket.on('admin_notification', (data) => {
  // Réservé aux admins/moderators
});

// Annonce système
socket.on('system_announcement', (data) => {
  // Broadcast à tous
});

// Compteur mis à jour
socket.on('unread_count', ({ count }) => {
  // Nombre de notifications non lues
});

// Notification marquée
socket.on('notification_read', ({ notificationId }) => {
  // Confirmation de lecture
});
```

### Rooms

```javascript
// Rooms automatiques
user_123        // Room privée de l'utilisateur ID 123
admins          // Tous les admins et moderators

// Rejoindre une room custom
socket.join('project_456');
io.to('project_456').emit('update', { status: 'funded' });
```

---

## 🧪 Tests E2E Playwright

### Vue d'ensemble

Tests end-to-end automatisés pour valider les flux complets du Panel Admin.

### Installation

```bash
cd /path/to/AgriKonbit
npm install --save-dev @playwright/test
npx playwright install
```

### Configuration

#### `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
```

### Tests implémentés

#### 1. Authentification
- ✅ Redirection non-authentifié
- ✅ Login admin réussi
- ✅ Accès refusé pour non-admin

#### 2. Dashboard
- ✅ Affichage des KPIs
- ✅ Affichage des graphiques Recharts
- ✅ Navigation vers Users/Products

#### 3. Validation Projets
- ✅ Affichage projets en attente
- ✅ Approuver avec notes
- ✅ Rejeter avec notes
- ✅ Pagination

#### 4. Gestion Utilisateurs
- ✅ Affichage table users
- ✅ Filtres rôle/statut
- ✅ Changement de rôle
- ✅ Activer/Désactiver
- ✅ Export CSV
- ✅ Pagination

#### 5. Modération Produits
- ✅ Affichage table produits
- ✅ Filtres statut/catégorie
- ✅ Recherche
- ✅ Toggle actif/inactif

#### 6. Exports CSV
- ✅ Export users
- ✅ Export projects
- ✅ Export investments
- ✅ Export orders

### Exécuter les tests

#### Tous les tests

```bash
npx playwright test
```

#### Tests spécifiques

```bash
# Authentification uniquement
npx playwright test tests/e2e/admin.spec.ts --grep "Authentication"

# Dashboard uniquement
npx playwright test tests/e2e/admin.spec.ts --grep "Dashboard"
```

#### Mode interactif

```bash
npx playwright test --ui
```

#### Mode debug

```bash
npx playwright test --debug
```

#### Avec rapport HTML

```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Variables d'environnement

```bash
# .env.test
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001
ADMIN_EMAIL=admin@agrikonbit.com
ADMIN_PASSWORD=your_secure_password
```

### Bonnes pratiques

#### 1. Utiliser des sélecteurs robustes

```javascript
// ❌ Mauvais (fragile)
await page.click('.btn-primary');

// ✅ Bon (texte visible)
await page.click('button:has-text("Approuver")');

// ✅ Bon (attribut data-testid)
await page.click('[data-testid="approve-button"]');
```

#### 2. Attendre les éléments

```javascript
// ❌ Mauvais
await page.click('button');

// ✅ Bon
await page.waitForSelector('button');
await page.click('button');

// ✅ Mieux
await expect(page.locator('button')).toBeVisible();
await page.click('button');
```

#### 3. Isoler les tests

```javascript
test.beforeEach(async ({ page }) => {
  // Setup propre pour chaque test
  await page.goto('/admin');
});

test.afterEach(async ({ page }) => {
  // Cleanup si nécessaire
});
```

---

## ⚙️ Installation & Configuration

### 1. Exécuter les migrations

```bash
# Migration audit logs
mysql -u root -p agrikonbit < migrations/011_create_admin_actions_table.sql
```

### 2. Installer les dépendances

```bash
# Backend
cd server
npm install socket.io

# Frontend
cd client
npm install socket.io-client

# Tests
npm install --save-dev @playwright/test
npx playwright install
```

### 3. Configuration environnement

```bash
# server/.env
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

# client/.env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=http://localhost:3001
```

### 4. Initialiser Socket.IO dans `server/index.js`

Voir section [Notifications Temps Réel](#configuration-backend)

---

## 📖 Guide d'utilisation

### Consulter les logs d'audit

```bash
# Via API
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/admin/audit-logs

# Ou créer une page UI admin
# /admin/audit-logs avec filtres et tableau
```

### Tester les notifications WebSocket

```bash
# 1. Démarrer backend avec Socket.IO
cd server && npm start

# 2. Démarrer frontend
cd client && npm start

# 3. Se connecter en admin
# 4. Ouvrir DevTools → Console
# 5. Voir les logs WebSocket
```

### Exécuter les tests E2E

```bash
# Tests complets
npx playwright test

# Tests avec interface
npx playwright test --ui

# Tests en mode debug
npx playwright test --debug
```

---

## 🐛 Troubleshooting

### Socket.IO ne se connecte pas

```bash
# Vérifier que Socket.IO est bien initialisé
# Dans server/index.js, chercher:
const io = new Server(server, { ... });

# Vérifier les logs serveur
✅ WebSocket ready
✅ User connected: John Admin...
```

### Tests Playwright échouent

```bash
# Vérifier que les serveurs tournent
ps aux | grep node

# Relancer les navigateurs
npx playwright install --force

# Vérifier les variables d'environnement
echo $ADMIN_PASSWORD
```

### Logs d'audit vides

```bash
# Vérifier que la table existe
mysql -u root -p agrikonbit -e "SHOW TABLES LIKE 'admin_actions';"

# Vérifier que le middleware est appelé
# Voir logs serveur lors d'une action admin
```

---

## 📊 Statistiques & Monitoring

### Requêtes utiles

```sql
-- Actions par admin
SELECT 
  admin_id,
  admin_name,
  COUNT(*) as total_actions
FROM admin_actions
JOIN users ON admin_actions.admin_id = users.id
GROUP BY admin_id
ORDER BY total_actions DESC;

-- Actions par type
SELECT action_type, COUNT(*) as count
FROM admin_actions
GROUP BY action_type
ORDER BY count DESC;

-- Activité des 7 derniers jours
SELECT DATE(created_at) as date, COUNT(*) as actions
FROM admin_actions
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date;
```

---

## 🎯 Prochaines évolutions

### Court terme
- [ ] Page UI pour consulter les logs d'audit
- [ ] Notifications push navigateur (Web Push API)
- [ ] Tests E2E pour les notifications

### Moyen terme
- [ ] Export logs d'audit en CSV/PDF
- [ ] Dashboard de monitoring en temps réel
- [ ] Alertes automatiques (ex: 5 rejets en 1h)

### Long terme
- [ ] Machine learning sur les logs (détection anomalies)
- [ ] Archivage automatique des vieux logs
- [ ] Intégration avec outils de monitoring (Grafana, Sentry)

---

**Version:** 2.0.0  
**Développé avec ❤️ pour AgriKonbit**  
**Dernière mise à jour:** 2025-10-04
