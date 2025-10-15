# ✅ SOLUTION : 404 - Cannot POST /api/users/profile/image

## 🔴 Erreur Actuelle

```
❌ POST http://localhost:3001/api/users/profile/image 404 (Not Found)
❌ Cannot POST /api/users/profile/image
```

## ✅ Diagnostic

J'ai vérifié le code :
- ✅ La route **existe bien** dans `server/routes/users.js` (ligne 170)
- ✅ Multer est configuré correctement
- ✅ Le dossier uploads existe
- ❌ **Le serveur n'a PAS été redémarré** → C'est le problème !

## 🎯 SOLUTION IMMÉDIATE

### Option 1 : Double-cliquer sur le script (RECOMMANDÉ)

J'ai créé un script qui fait tout automatiquement :

```
📁 AgriKonbit/
   📄 RESTART_SERVERS_NOW.bat  ← DOUBLE-CLIQUER ICI !
```

**Ce script va :**
1. Arrêter tous les Node.js
2. Redémarrer le backend dans une nouvelle fenêtre
3. Redémarrer le frontend dans une autre fenêtre
4. Ouvrir automatiquement les bons terminaux

### Option 2 : Manuellement (2 terminaux)

**Terminal 1 - Backend :**
```bash
cd c:\wamp64\www\AgriKonbit\server
npm start
```

Attendez de voir :
```
✅ Server running on port 3000 (ou 3001)
✅ Database connected
```

**Terminal 2 - Frontend :**
```bash
cd c:\wamp64\www\AgriKonbit\client
npm start
```

## 🧪 Après le Redémarrage

1. **Ouvrir** http://localhost:3000/profile
2. **Appuyer sur F12** (ouvrir la console)
3. **Essayer d'uploader** une image
4. **Vérifier** que ça fonctionne !

## ✅ Résultat Attendu

Après le redémarrage, vous devriez voir dans le terminal backend :

```
Server running on port 3001
Database connected
✅ POST /api/users/profile/image  ← Cette route existe maintenant !
```

Et dans le navigateur :
- ✅ L'upload fonctionne
- ✅ Toast "Photo de profil mise à jour!"
- ✅ L'image apparaît immédiatement

## 🔍 Si l'Erreur Persiste

Si après le redémarrage vous voyez toujours le 404 :

1. **Vérifier le port** du backend dans le terminal
   - Si c'est 3000 : OK
   - Si c'est 3001 : Vérifier que `client/src/utils/api.js` utilise le bon port

2. **Vérifier les logs du backend** dans le terminal
   - Chercher des erreurs au démarrage
   - Vérifier que le fichier `users.js` est bien chargé

3. **Tester la route manuellement** :
```bash
# Dans PowerShell (remplacer YOUR_TOKEN par votre vrai token)
curl -X POST http://localhost:3001/api/users/profile/image `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -F "profileImage=@C:\chemin\vers\photo.jpg"
```

## 📊 Checklist Finale

Avant de tester :

- [ ] **Backend redémarré** (nouvelle fenêtre de terminal)
- [ ] Voir "Server running" dans le terminal backend
- [ ] Voir "Database connected" dans le terminal backend
- [ ] **Frontend redémarré** (autre fenêtre)
- [ ] Page http://localhost:3000 chargée
- [ ] Console F12 ouverte
- [ ] Onglet Network ouvert

## 🎯 Pourquoi le Redémarrage est Nécessaire

Node.js **charge les fichiers au démarrage** et les **garde en mémoire**. 

Quand j'ai ajouté les nouvelles routes dans `users.js`, le serveur qui tournait utilisait **l'ancienne version en mémoire**.

Le redémarrage force Node.js à **recharger tous les fichiers**, incluant les nouvelles routes !

---

## 🚀 ACTION IMMÉDIATE

**Double-cliquez sur :** `RESTART_SERVERS_NOW.bat`

Ou manuellement :
1. Terminal 1 : `cd server && npm start`
2. Terminal 2 : `cd client && npm start`
3. Ouvrir : http://localhost:3000/profile
4. Tester l'upload !

---

**Après le redémarrage, l'upload fonctionnera ! 🎉**
