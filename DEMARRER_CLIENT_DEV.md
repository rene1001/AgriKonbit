# 🚀 Démarrer le Client en Mode Développement

## ⚠️ Problème Actuel

Vous voyez des erreurs CSP (Content Security Policy) car le client React n'est **pas en mode développement**.

```
Refused to connect to 'http://localhost:3001/api/auth/me' 
because it violates the following Content Security Policy directive
```

## ✅ Solution: Démarrer le Serveur de Développement React

### Étape 1: Ouvrir un nouveau terminal

### Étape 2: Naviguer vers le dossier client
```bash
cd client
```

### Étape 3: Démarrer le serveur de développement
```bash
npm start
```

### Résultat Attendu

Vous devriez voir:
```
Compiled successfully!

You can now view agrikonbit in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

## 🌐 Accès à l'Application

Une fois le serveur démarré:

1. **Ouvrez votre navigateur**
2. **Allez sur**: `http://localhost:3000`
3. **Résultat**: L'application devrait fonctionner sans erreur CSP

## 📊 Architecture en Mode Développement

```
┌─────────────────────────────────────┐
│  Navigateur                         │
│  http://localhost:3000              │
└──────────────┬──────────────────────┘
               │
               │ Requêtes API
               ▼
┌─────────────────────────────────────┐
│  Serveur React Dev (Port 3000)     │
│  - Hot reload                       │
│  - Proxy vers backend               │
└──────────────┬──────────────────────┘
               │
               │ Proxy
               ▼
┌─────────────────────────────────────┐
│  Serveur Backend (Port 3001)       │
│  - API REST                         │
│  - Socket.IO                        │
└─────────────────────────────────────┘
```

## 🔧 Configuration du Proxy

Le fichier `client/package.json` devrait contenir:

```json
{
  "proxy": "http://localhost:3001"
}
```

Cela permet au serveur de développement React de proxifier les requêtes API vers le backend.

## ⚡ Script de Démarrage Complet

Si vous voulez démarrer les deux serveurs en même temps, utilisez:

```powershell
.\START_SERVERS.ps1
```

Ou créez deux terminaux:

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```

## 🐛 Dépannage

### Problème: Port 3000 déjà utilisé

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port
set PORT=3002 && npm start
```

### Problème: Module non trouvé

**Solution:**
```bash
cd client
rm -rf node_modules
npm install
npm start
```

### Problème: Erreur de compilation

**Solution:**
```bash
cd client
npm run build
npm start
```

## ✅ Checklist de Vérification

Avant de tester l'application:

- [ ] Serveur backend démarré (port 3001)
- [ ] Serveur frontend démarré (port 3000)
- [ ] Navigateur ouvert sur `http://localhost:3000`
- [ ] Pas d'erreur CSP dans la console
- [ ] Les requêtes API passent correctement

## 🎯 Test Final

1. Ouvrir `http://localhost:3000`
2. Se connecter
3. Cliquer sur les notifications 🔔
4. Cliquer sur "Lire" → ✅ Devrait fonctionner
5. Cliquer sur "Suppr." → ✅ Devrait supprimer

---

**Action Immédiate**: Démarrez le serveur de développement React maintenant!

```bash
cd client
npm start
```
