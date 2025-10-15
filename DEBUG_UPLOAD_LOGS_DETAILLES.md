# 🔍 DEBUG UPLOAD - LOGS DÉTAILLÉS ACTIVÉS

## ✅ MODIFICATIONS APPLIQUÉES

J'ai ajouté des **logs de debug très détaillés** côté backend ET frontend pour identifier exactement où l'upload bloque.

---

## 📊 Ce Qui a Été Ajouté

### Backend (server/routes/users.js)

**Logs avant Multer :**
```
═══════════════════════════════════════════
📸 UPLOAD REQUEST RECEIVED
═══════════════════════════════════════════
User ID: 1
Content-Type: multipart/form-data; boundary=...
Content-Length: 12345
Body: {}
```

**Logs après Multer :**
```
--- APRÈS MULTER ---
Erreur Multer: Aucune
Fichier reçu: OUI
Détails fichier: {
  fieldname: 'profileImage',
  originalname: 'photo.jpg',
  mimetype: 'image/jpeg',
  size: 12345,
  filename: 'profile-1-1234567890.jpg'
}
═══════════════════════════════════════════
```

### Frontend (client/src/pages/Profile.js)

**Logs avant envoi :**
```
═══════════════════════════════════════════
📸 UPLOAD PHOTO - DEBUG FRONTEND
═══════════════════════════════════════════
Fichier sélectionné: {
  name: 'photo.jpg',
  type: 'image/jpeg',
  size: 12345,
  lastModified: '2025-10-11T...'
}
✅ Validations passées
FormData créé avec champ "profileImage"
URL cible: /users/profile/image
Token présent: true
🚀 Envoi de la requête...
```

**Logs en cas d'erreur :**
```
❌ ERREUR UPLOAD
Status: 400
Status Text: Bad Request
Data: { success: false, message: '...' }
Headers: { ... }
Erreur complète: { ... }
═══════════════════════════════════════════
```

---

## 🚀 REDÉMARRER LES SERVEURS

### 1. Redémarrer Backend
```bash
cd c:\wamp64\www\AgriKonbit\server
npm start
```

### 2. Redémarrer Frontend (si arrêté)
```bash
cd c:\wamp64\www\AgriKonbit\client
npm start
```

---

## 🧪 TESTER AVEC LES NOUVEAUX LOGS

### Étape 1 : Préparer les Terminaux

Vous aurez besoin de **3 fenêtres** :

**Fenêtre 1 : Terminal Backend**
- Le terminal où `npm start` (server) tourne
- **GARDER VISIBLE** pendant le test
- C'est là que les logs backend s'afficheront

**Fenêtre 2 : Navigateur**
- http://localhost:3000/profile
- F12 ouvert (Console + Network)

**Fenêtre 3 : (Optionnel) Ce guide**
- Pour suivre les instructions

### Étape 2 : Ouvrir la Console

1. Aller sur **http://localhost:3000/profile**
2. Appuyer sur **F12**
3. Onglet **Console** (pour voir les logs JavaScript)
4. Onglet **Network** (pour voir les requêtes HTTP)

### Étape 3 : Essayer l'Upload

1. Cliquer sur **"📷 Changer la photo"**
2. Sélectionner une **petite** image (JPG ou PNG, < 1 Mo pour commencer)
3. **REGARDER IMMÉDIATEMENT** :
   - La console du navigateur (F12)
   - Le terminal du backend

### Étape 4 : Analyser les Logs

---

## 📊 SCÉNARIOS POSSIBLES

### Scénario 1 : Frontend Bloque AVANT l'Envoi ❌

**Logs dans la console navigateur :**
```
📸 UPLOAD PHOTO - DEBUG FRONTEND
Fichier sélectionné: { ... }
❌ Fichier trop volumineux: 6000000 bytes
```
OU
```
❌ Type de fichier invalide: application/pdf
```

**Diagnostic :** Le fichier ne passe pas les validations frontend
**Solution :** Utiliser un fichier image JPG/PNG < 5 Mo

---

### Scénario 2 : Frontend Envoie, Backend Ne Reçoit RIEN ❌

**Logs dans la console navigateur :**
```
📸 UPLOAD PHOTO - DEBUG FRONTEND
Fichier sélectionné: { name: 'photo.jpg', ... }
✅ Validations passées
FormData créé avec champ "profileImage"
URL cible: /users/profile/image
Token présent: true
🚀 Envoi de la requête...
```

**Logs dans le terminal backend :**
```
(RIEN - aucun log n'apparaît)
```

**Diagnostic :** La requête n'arrive pas au backend
**Causes possibles :**
- Backend pas démarré
- Mauvais port (devrait être 3001)
- CORS bloque la requête
- URL incorrecte

**Solutions :**
1. Vérifier que le backend tourne : http://localhost:3001/health
2. Vérifier le port dans `client/src/utils/api.js`
3. Regarder l'onglet Network (F12) pour voir si la requête part

---

### Scénario 3 : Backend Reçoit, Multer REJETTE ❌

**Logs dans le terminal backend :**
```
═══════════════════════════════════════════
📸 UPLOAD REQUEST RECEIVED
═══════════════════════════════════════════
User ID: 1
Content-Type: multipart/form-data; boundary=...
Content-Length: 12345
Body: {}

--- APRÈS MULTER ---
Erreur Multer: Type de fichier non autorisé. Formats acceptés: JPG, PNG, GIF, WEBP
Fichier reçu: NON
═══════════════════════════════════════════
```

**Diagnostic :** Multer rejette le fichier
**Causes possibles :**
- Type de fichier non autorisé
- Fichier trop volumineux (> 5 Mo)
- Extension non reconnue

**Solutions :**
- Utiliser un fichier JPG, PNG, GIF ou WEBP
- Vérifier la taille < 5 Mo
- Renommer le fichier avec la bonne extension

---

### Scénario 4 : Multer Accepte, Mais "Aucun Fichier" ❌

**Logs dans le terminal backend :**
```
═══════════════════════════════════════════
📸 UPLOAD REQUEST RECEIVED
═══════════════════════════════════════════
User ID: 1
Content-Type: multipart/form-data; boundary=...
Content-Length: 12345
Body: {}

--- APRÈS MULTER ---
Erreur Multer: Aucune
Fichier reçu: NON
═══════════════════════════════════════════

❌ AUCUN FICHIER APRÈS MULTER
```

**Diagnostic :** Le fichier n'est pas détecté par Multer
**Causes possibles :**
- Nom du champ FormData incorrect (devrait être 'profileImage')
- Content-Type mal configuré
- Boundary mal formé

**Solutions :**
1. Vérifier dans les logs que `Content-Type` contient `multipart/form-data`
2. Vérifier dans les logs frontend : `FormData créé avec champ "profileImage"`

---

### Scénario 5 : SUCCÈS ! ✅

**Logs dans le terminal backend :**
```
═══════════════════════════════════════════
📸 UPLOAD REQUEST RECEIVED
═══════════════════════════════════════════
User ID: 1
Content-Type: multipart/form-data; boundary=...
Content-Length: 12345
Body: {}

--- APRÈS MULTER ---
Erreur Multer: Aucune
Fichier reçu: OUI
Détails fichier: {
  fieldname: 'profileImage',
  originalname: 'photo.jpg',
  mimetype: 'image/jpeg',
  size: 12345,
  filename: 'profile-1-1234567890.jpg'
}
═══════════════════════════════════════════

✅ Image uploaded successfully: /uploads/profiles/profile-1-1234567890.jpg
```

**Logs dans la console navigateur :**
```
📸 UPLOAD PHOTO - DEBUG FRONTEND
Fichier sélectionné: { name: 'photo.jpg', ... }
✅ Validations passées
FormData créé avec champ "profileImage"
URL cible: /users/profile/image
Token présent: true
🚀 Envoi de la requête...

✅ SUCCÈS - Réponse: {
  success: true,
  data: { profile_image: '/uploads/profiles/...' },
  message: 'Photo de profil uploadée avec succès'
}
```

**Résultat :** L'image apparaît immédiatement ! 🎉

---

## 🐛 INFORMATIONS À PARTAGER

Si l'upload ne fonctionne toujours pas, **copiez et partagez** :

### 1. Logs de la Console Navigateur (F12)
- Tout ce qui s'affiche dans la console après avoir cliqué sur l'upload
- Surtout la section entre les `═══════`

### 2. Logs du Terminal Backend
- Tout ce qui s'affiche dans le terminal après avoir tenté l'upload
- Surtout la section entre les `═══════`

### 3. Onglet Network (F12)
- Cliquer sur la requête POST /api/users/profile/image
- **Headers** : Copier Request Headers
- **Payload** : Copier FormData
- **Response** : Copier la réponse

### 4. Informations sur le Fichier
- Nom du fichier
- Type (JPG, PNG, etc.)
- Taille (en Ko ou Mo)

---

## 🎯 CHECKLIST AVANT DE TESTER

- [ ] Backend redémarré (avec les nouveaux logs)
- [ ] Frontend redémarré (avec les nouveaux logs)
- [ ] Terminal backend VISIBLE pendant le test
- [ ] Console navigateur (F12) OUVERTE
- [ ] Onglet Network OUVERT
- [ ] Petite image prête (JPG, < 1 Mo)
- [ ] Prêt à copier les logs des deux côtés

---

## 📝 COMMANDES RAPIDES

### Redémarrer Backend
```powershell
Get-Process -Name node | Stop-Process -Force
cd c:\wamp64\www\AgriKonbit\server
npm start
```

### Redémarrer Frontend
```powershell
cd c:\wamp64\www\AgriKonbit\client
npm start
```

### Vérifier Backend
```
http://localhost:3001/health
```

### Vérifier Frontend
```
http://localhost:3000/profile
```

---

## 🚀 PRÊT À DEBUGGER !

**Les logs détaillés vont révéler EXACTEMENT où ça bloque.**

1. ✅ Redémarrez les serveurs
2. ✅ Ouvrez /profile avec F12
3. ✅ Gardez le terminal backend visible
4. ✅ Essayez l'upload
5. ✅ Copiez les logs des deux côtés
6. ✅ Partagez les logs pour diagnostic

**Les logs nous diront exactement ce qui ne va pas ! 🔍**
