# 🚀 Guide de Démarrage des Serveurs

## ❌ Problème Actuel

Les erreurs WebSocket montrent que le **serveur backend n'est pas démarré** :
```
WebSocket connection to 'ws://localhost:3001/socket.io/?EIO=4&transport=websocket' failed
```

## ✅ Solution : Démarrer le Backend

### Option 1 : Démarrage Manuel (Recommandé)

#### Terminal 1 - Backend
```bash
cd c:\wamp64\www\AgriKonbit\server
npm start
```

Vous devriez voir :
```
✅ Database connected successfully
🚀 Server (HTTP + Socket.IO) running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

#### Terminal 2 - Frontend
```bash
cd c:\wamp64\www\AgriKonbit\client
npm start
```

### Option 2 : Script PowerShell (Windows)

J'ai créé un script `START_SERVERS.ps1` que vous pouvez utiliser :

```powershell
# Clic droit sur START_SERVERS.ps1 → Exécuter avec PowerShell
```

Ou en ligne de commande :
```powershell
cd c:\wamp64\www\AgriKonbit
.\START_SERVERS.ps1
```

## 🔍 Vérification

### 1. Backend est démarré
Ouvrez votre navigateur : http://localhost:3001/health

Vous devriez voir :
```json
{
  "status": "OK",
  "timestamp": "2025-10-13T16:16:00.000Z"
}
```

### 2. Socket.IO fonctionne
Ouvrez la console du navigateur (F12) et vous ne devriez **plus voir** les erreurs WebSocket.

### 3. Frontend connecté
Dans la console, vous devriez voir :
```
Socket connected: <socket-id>
```

## 🐛 Dépannage

### Erreur : "Port 3001 already in use"

**Solution :**
```bash
# Windows - Trouver le processus utilisant le port 3001
netstat -ano | findstr :3001

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Erreur : "Database connection failed"

**Solution :**
1. Vérifiez que WAMP/MySQL est démarré
2. Vérifiez les credentials dans `server/.env` :
```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=agrikonbit
```

### Erreur : "Cannot find module"

**Solution :**
```bash
cd server
npm install

cd ../client
npm install
```

## 📋 Checklist Avant de Démarrer

- [ ] WAMP/MySQL est démarré (icône verte dans la barre des tâches)
- [ ] Base de données `agrikonbit` existe
- [ ] Fichier `server/.env` existe et est configuré
- [ ] `npm install` a été exécuté dans `/server` et `/client`
- [ ] Aucun autre processus n'utilise les ports 3000 et 3001

## 🎯 Ordre de Démarrage Recommandé

1. **Démarrer WAMP/MySQL** (si pas déjà fait)
2. **Démarrer le Backend** (Terminal 1)
3. **Attendre** que le backend affiche "Server running"
4. **Démarrer le Frontend** (Terminal 2)
5. **Ouvrir le navigateur** sur http://localhost:3000

## ⚠️ Avertissements React Router

Les warnings suivants sont **normaux** et n'affectent pas le fonctionnement :
```
⚠️ React Router Future Flag Warning: v7_startTransition
⚠️ React Router Future Flag Warning: v7_relativeSplatPath
```

Ce sont des avertissements pour la future version de React Router. Vous pouvez les ignorer pour l'instant.

## 🔧 Configuration Socket.IO

Si vous continuez à avoir des problèmes de WebSocket, vérifiez :

### Backend (`server/index.js`)
```javascript
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ],
    credentials: true
  }
});
```

### Frontend (`client/src/contexts/SocketContext.js`)
```javascript
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});
```

## ✅ Confirmation Finale

Une fois les deux serveurs démarrés, vous devriez avoir :

1. ✅ Backend sur http://localhost:3001
2. ✅ Frontend sur http://localhost:3000
3. ✅ Aucune erreur WebSocket dans la console
4. ✅ Notifications real-time fonctionnelles
5. ✅ Badge de notifications mis à jour automatiquement

## 🆘 Besoin d'Aide ?

Si les problèmes persistent après avoir suivi ce guide :

1. Vérifiez les logs du terminal backend pour des erreurs
2. Vérifiez la console du navigateur (F12) pour des erreurs
3. Vérifiez que MySQL est bien démarré
4. Essayez de redémarrer WAMP et les deux serveurs

---

**Note Importante :** Le serveur backend **DOIT** être démarré en premier, sinon le frontend ne pourra pas se connecter à Socket.IO et vous aurez les erreurs WebSocket que vous voyez actuellement.
