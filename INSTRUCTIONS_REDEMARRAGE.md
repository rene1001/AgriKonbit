# 🔄 Instructions de Redémarrage du Serveur

## ❌ Problème Actuel
La vidéo ne s'affiche PAS sur la page d'accueil car :
- Les endpoints `/api/settings/project_video_url` et `/api/settings/project_video_title` retournent 500
- Le serveur backend utilise encore l'ancien code avec le bug
- **Le serveur DOIT être redémarré** pour charger les corrections

---

## ✅ Solution : Redémarrer le Backend

### **Option 1 : Script PowerShell Automatique**
```powershell
.\restart-backend.ps1
```

### **Option 2 : Redémarrage Manuel**

#### Étape 1 : Arrêter le serveur actuel
Trouvez le terminal où le serveur tourne et :
- Appuyez sur **Ctrl + C**
- Ou fermez le terminal

#### Étape 2 : Redémarrer le serveur
```bash
cd server
npm start
```

Vous devriez voir :
```
✅ Database connected successfully
🚀 Server running on port 3001
```

#### Étape 3 : Vérifier que ça fonctionne
```bash
node test-settings-direct.js
```

**Résultat attendu :**
```
Testing: http://localhost:3001/api/settings/project_video_url
  Status: 200 ✅
  Response: {
    "value": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }

Testing: http://localhost:3001/api/settings/project_video_title
  Status: 200 ✅
  Response: {
    "value": "Vidéo explicative du projet AgriKonbit"
  }
```

---

## 📹 Vérifier la Vidéo sur la Page d'Accueil

Une fois le serveur redémarré :

1. **Ouvrez votre navigateur** : `http://localhost:3000`
2. **Allez sur la page d'accueil**
3. **Rechargez la page** (F5 ou Ctrl+R)
4. **Cherchez la section vidéo** - elle devrait apparaître entre les boutons CTA et les projets vedettes

### Ce que vous devriez voir :
```
┌─────────────────────────────────────────────────┐
│  Vidéo explicative du projet AgriKonbit        │
│  Description de la plateforme...               │
│  ┌───────────────────────────────────────┐     │
│  │                                       │     │
│  │      [VIDÉO YOUTUBE EMBARQUÉE]       │     │
│  │                                       │     │
│  └───────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Diagnostic Rapide

### Si la vidéo ne s'affiche toujours pas :

1. **Ouvrez la console du navigateur** (F12)
2. **Cherchez les erreurs** dans l'onglet Console
3. **Vérifiez l'onglet Network** :
   - Cherchez les appels à `/api/settings/project_video_url`
   - Vérifiez le status : doit être **200**, pas 500

### Si vous voyez encore des erreurs 500 :
- Le serveur n'a pas été correctement redémarré
- Vérifiez que vous avez bien stoppé l'ancien processus
- Relancez le serveur

---

## 📝 Résumé

**Avant redémarrage :** 500 errors → Vidéo NE s'affiche PAS ❌
**Après redémarrage :** 200 OK → Vidéo S'AFFICHE ✅

**Commande la plus simple :**
```bash
cd server
npm start
```

---

**Créé le :** 2025-10-10 23:47
