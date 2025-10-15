# 🔧 Solution : Erreur d'Upload d'Image

## ✅ Diagnostic Effectué

Le diagnostic révèle que :
- ✅ Multer est installé
- ✅ Les dossiers uploads existent
- ✅ Les permissions sont correctes
- ✅ Les routes sont configurées
- ✅ Le serveur sert les fichiers statiques

## 🎯 Solution en 3 Étapes

### **Étape 1 : Redémarrer le Backend (CRITIQUE)**

Le serveur **DOIT** être redémarré pour charger les nouvelles routes.

**Option A - Via le terminal où le serveur tourne :**
1. Trouver le terminal avec le serveur backend
2. Appuyer sur `Ctrl + C`
3. Puis :
```bash
npm start
```

**Option B - Arrêter tous les Node et redémarrer :**
```powershell
# Dans PowerShell
Get-Process -Name node | Stop-Process -Force

# Puis redémarrer
cd c:\wamp64\www\AgriKonbit\server
npm start
```

### **Étape 2 : Vérifier que le serveur est bien démarré**

Vous devriez voir :
```
✅ Server running on port 3000 (ou 3001)
✅ Database connected
```

**Testez le serveur :**
```
Ouvrir : http://localhost:3000/health
ou
http://localhost:3001/health
```

Vous devriez voir : `{"status":"OK","timestamp":"..."}`

### **Étape 3 : Tester l'upload avec la console ouverte**

1. Ouvrir le navigateur sur http://localhost:3000/profile
2. Appuyer sur **F12** pour ouvrir les outils développeur
3. Aller dans l'onglet **Console**
4. Aller dans l'onglet **Network** (Réseau)
5. Essayer d'uploader une image
6. Regarder les détails de la requête dans l'onglet Network

## 🔍 Analyser l'Erreur dans la Console

Après avoir essayé l'upload, vous verrez dans la console :
```javascript
Upload error: ...
Error details: { message: "...", ... }
```

### Erreurs Possibles et Solutions

#### **404 Not Found - `/api/users/profile/image`**
➡️ **Cause :** Le serveur n'a pas été redémarré
➡️ **Solution :** Redémarrer le backend (Étape 1)

#### **400 Bad Request - "No file uploaded"**
➡️ **Cause :** Le fichier n'est pas envoyé correctement
➡️ **Solution :** Vérifier que le champ FormData s'appelle bien `profileImage`

#### **413 Payload Too Large**
➡️ **Cause :** L'image est trop grande (> 5 Mo)
➡️ **Solution :** Utiliser une image plus petite

#### **500 Internal Server Error**
➡️ **Cause :** Erreur côté serveur (permissions, multer, etc.)
➡️ **Solution :** Regarder les logs du serveur backend

## 📊 Vérifications Supplémentaires

### 1. Vérifier le Port du Backend

Dans `client/src/utils/api.js` :
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

Vérifier que le port correspond au port du backend (3000 ou 3001).

### 2. Vérifier le CORS

Si vous voyez une erreur CORS :
- Le backend doit autoriser l'origine du frontend
- Vérifier dans `server/index.js` que le CORS est configuré

### 3. Vérifier l'URL de l'Endpoint

Dans `client/src/utils/api.js`, vérifier :
```javascript
users: {
  uploadProfileImage: '/users/profile/image',  // ✅ Correct
  // PAS: '/api/users/profile/image'  // ❌ Incorrect (déjà dans baseURL)
}
```

## 🧪 Test Manuel avec curl

Pour tester directement la route backend :

```bash
# Remplacer YOUR_TOKEN par votre token JWT
curl -X POST http://localhost:3000/api/users/profile/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@C:\chemin\vers\photo.jpg"
```

Si ça fonctionne, vous devriez voir :
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "imagePath": "/uploads/profiles/profile-1-123456.jpg"
  }
}
```

## 📝 Checklist Complète

Avant de tester à nouveau :

- [ ] Le backend a été **redémarré** (Ctrl+C puis npm start)
- [ ] Le serveur affiche "Server running on port..."
- [ ] http://localhost:3000/health ou 3001/health répond OK
- [ ] Le frontend tourne sur http://localhost:3000
- [ ] La console développeur est ouverte (F12)
- [ ] L'onglet Network est ouvert pour voir les requêtes

## 🎯 Commandes Finales

```bash
# Terminal 1 - Backend
cd c:\wamp64\www\AgriKonbit\server
npm start

# Terminal 2 - Frontend (si pas démarré)
cd c:\wamp64\www\AgriKonbit\client
npm start
```

Puis :
1. Ouvrir http://localhost:3000/profile
2. Ouvrir F12 (Console + Network)
3. Uploader une image
4. Regarder les erreurs dans Console et Network

## 💡 Message d'Erreur Amélioré

J'ai modifié le code pour afficher l'erreur exacte du serveur :

```javascript
// Dans Profile.js
catch (error) {
  console.error('Upload error:', error);
  console.error('Error details:', error.response?.data);
  const errorMsg = error.response?.data?.message || 'Erreur lors de l\'upload de l\'image';
  toast.error(errorMsg);
}
```

Maintenant, le **message d'erreur exact du serveur** s'affichera dans le toast ET dans la console.

## 🚀 Si Tout Est Correct

Si après le redémarrage ça ne fonctionne toujours pas :

1. **Copier-coller l'erreur complète** de la console
2. **Copier-coller les logs du serveur backend**
3. **Faire un screenshot** de l'onglet Network (F12)

Et partagez ces informations pour un diagnostic plus précis.

---

**Après le redémarrage du backend, tout devrait fonctionner ! 🎉**
