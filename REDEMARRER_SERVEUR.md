# 🔄 Redémarrage du Serveur Backend Requis

## ⚠️ Problème Détecté

Les erreurs 404 et 500 sur `/api/notifications/:id` indiquent que le serveur backend doit être redémarré pour prendre en compte les modifications apportées aux routes.

## 📋 Erreurs Observées

```
404 (Not Found) - /api/notifications/35
500 (Internal Server Error) - /api/notifications/35/read
```

## ✅ Solution: Redémarrer le Serveur Backend

### Option 1: Redémarrage Manuel

#### Étape 1: Arrêter le serveur actuel
1. Aller dans le terminal où le serveur backend tourne
2. Appuyer sur `Ctrl + C` pour arrêter le serveur
3. Attendre que le processus se termine complètement

#### Étape 2: Redémarrer le serveur
```bash
cd server
npm start
```

Ou si vous utilisez nodemon:
```bash
cd server
npm run dev
```

### Option 2: Utiliser le Script de Redémarrage

Si vous avez un script de démarrage automatique:
```bash
# À la racine du projet
.\START_SERVERS.ps1
```

Ou:
```bash
# À la racine du projet
.\RESTART_SERVERS_NOW.bat
```

## 🔍 Vérification

Une fois le serveur redémarré, vous devriez voir dans les logs:

```
✅ Database connected successfully
🚀 Server (HTTP + Socket.IO) running on port 3001
📚 API Documentation: http://localhost:3001/api-docs
```

## 🧪 Test Rapide

Après le redémarrage, testez dans le navigateur:

1. **Ouvrir la console du navigateur** (F12)
2. **Rafraîchir la page** (F5)
3. **Cliquer sur une notification**
4. **Cliquer sur "Suppr."**
5. **Vérifier qu'il n'y a plus d'erreur 404**

## 📝 Routes Notifications Disponibles

Après le redémarrage, ces routes devraient fonctionner:

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/notifications` | Liste des notifications |
| PATCH | `/api/notifications/:id/read` | Marquer comme lue |
| PATCH | `/api/notifications/read-all` | Tout marquer comme lu |
| DELETE | `/api/notifications/:id` | **Supprimer une notification** ✨ |
| POST | `/api/notifications` | Créer une notification |

## 🔧 Si le Problème Persiste

### 1. Vérifier que le serveur écoute sur le bon port
```bash
# Dans le terminal backend, vérifier:
Server running on port 3001
```

### 2. Vérifier les logs du serveur
Regarder s'il y a des erreurs au démarrage:
```
❌ Database connection failed
❌ Error loading routes
```

### 3. Vérifier la base de données
```sql
-- Vérifier que la table notifications existe
DESCRIBE notifications;
```

### 4. Nettoyer et réinstaller (si nécessaire)
```bash
cd server
rm -rf node_modules
npm install
npm start
```

## 💡 Pourquoi ce Redémarrage est Nécessaire?

Les modifications apportées aux fichiers suivants nécessitent un redémarrage:

1. ✅ `server/routes/notifications.js` - Route DELETE ajoutée
2. ✅ `server/routes/messages.js` - Filtrage des messages supprimés
3. ✅ Toute modification des routes Express

**Note**: Si vous utilisez `nodemon`, le serveur devrait redémarrer automatiquement. Si ce n'est pas le cas, redémarrez manuellement.

## 🎯 Résultat Attendu

Après le redémarrage:
- ✅ Pas d'erreur 404 sur `/api/notifications/:id`
- ✅ Pas d'erreur 500 sur `/api/notifications/:id/read`
- ✅ Suppression de notifications fonctionne
- ✅ Suppression de messages fonctionne
- ✅ Toast de confirmation s'affiche

---

**Action Immédiate**: Redémarrez le serveur backend maintenant! 🚀
