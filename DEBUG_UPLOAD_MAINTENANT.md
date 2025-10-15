# 🔍 DEBUG DE L'UPLOAD - INSTRUCTIONS

## ✅ État Actuel

**Progrès :** 404 → 400 (La route fonctionne !)
**Erreur :** "No image uploaded" - Le fichier n'arrive pas au serveur

## 🚀 Serveur Redémarré avec Debug

Le backend a été **redémarré avec des logs de debug**.

Maintenant, quand vous essayez d'uploader, vous verrez dans le **terminal du backend** :
```
📸 Upload request received
Headers: { ... }
Body: { ... }
File: undefined  ← Si undefined, le fichier n'est pas reçu
```

---

## 🧪 TESTEZ MAINTENANT

### Étape 1 : Ouvrir le Terminal Backend
- Trouver le terminal où `npm start` (server) tourne
- **Garder ce terminal visible** pendant le test

### Étape 2 : Ouvrir la Page Profile
- Naviguer vers : http://localhost:3000/profile
- Appuyer sur **F12** (console navigateur)

### Étape 3 : Tester l'Upload
1. Cliquer sur **"📷 Changer la photo"**
2. Sélectionner une petite image (JPG, PNG, < 1 Mo pour commencer)
3. **Regarder immédiatement le terminal backend**

### Étape 4 : Observer les Logs

**Dans le terminal backend, vous devriez voir :**
```
📸 Upload request received
Headers: {
  'content-type': 'multipart/form-data; boundary=...',
  'authorization': 'Bearer ...',
  ...
}
Body: {}
File: undefined  OU  File: { fieldname: 'profileImage', ... }
```

---

## 🔍 Diagnostic Selon les Logs

### CAS 1 : File: undefined ❌
**Problème :** Le fichier n'est PAS envoyé

**Solutions à essayer :**
1. Vérifier que le fichier est bien sélectionné
2. Ajouter un log dans Profile.js avant l'upload :
   ```javascript
   console.log('File to upload:', file);
   ```
3. Vérifier le Content-Type dans Network (F12)

### CAS 2 : File: { fieldname: 'profileImage', ... } ✅
**Problème :** Le fichier est reçu mais autre erreur

**Solutions :**
1. Le problème est ailleurs dans le code
2. Vérifier les permissions du dossier uploads
3. Regarder les autres erreurs dans les logs

### CAS 3 : Aucun log n'apparaît ❌
**Problème :** La requête n'arrive pas au backend

**Solutions :**
1. Vérifier que le backend tourne bien
2. Vérifier le port (3000 ou 3001)
3. Vérifier CORS

### CAS 4 : Erreur Multer
**Problème :** Multer rejette le fichier

**Solutions :**
1. Vérifier le type de fichier (JPG, PNG acceptés)
2. Vérifier la taille (max 5 Mo)
3. Regarder le message d'erreur exact

---

## 📝 Informations à Collecter

Quand vous testez, notez :

1. **Dans la console navigateur (F12) :**
   - Le message d'erreur complet
   - L'onglet Network → Voir la requête POST /api/users/profile/image
   - Headers de la requête
   - Payload de la requête

2. **Dans le terminal backend :**
   - Les logs qui s'affichent
   - En particulier la ligne "File: ..."

3. **Le fichier testé :**
   - Type : JPG, PNG, etc.
   - Taille : X Mo/Ko

---

## 🎯 Scénarios Probables

### Scénario A : Content-Type Incorrect
**Symptôme :** File: undefined
**Cause :** Le Content-Type n'est pas multipart/form-data
**Solution :** Vérifier dans Network (F12) que le Content-Type contient "multipart/form-data"

### Scénario B : Champ Mal Nommé
**Symptôme :** File: undefined
**Cause :** FormData.append utilise un nom différent de 'profileImage'
**Solution :** Vérifier dans Profile.js : `formData.append('profileImage', file)`

### Scénario C : Axios Ajoute un Header Incorrect
**Symptôme :** File: undefined
**Cause :** L'intercepteur Axios modifie les headers
**Solution :** Vérifier api.js que l'intercepteur ne touche pas au Content-Type

### Scénario D : Le Fichier n'est Pas Sélectionné
**Symptôme :** File: undefined
**Cause :** L'input file ne retourne pas de fichier
**Solution :** Ajouter console.log avant l'upload pour vérifier

---

## 🛠️ Actions de Debug Supplémentaires

### Si File: undefined persiste

**Ajouter dans Profile.js (ligne 88-91) :**
```javascript
try {
  setUploading(true);
  const formData = new FormData();
  formData.append('profileImage', file);
  
  // 🔍 DEBUG : Vérifier le fichier
  console.log('=== DEBUG UPLOAD ===');
  console.log('File object:', file);
  console.log('File name:', file?.name);
  console.log('File size:', file?.size);
  console.log('File type:', file?.type);
  console.log('FormData entries:');
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  console.log('=== END DEBUG ===');
  
  const res = await api.post(endpoints.users.uploadProfileImage, formData);
```

### Tester avec curl (Test manuel)

Pour vérifier que le backend fonctionne :
```bash
# Remplacer YOUR_TOKEN et le chemin de l'image
curl -X POST http://localhost:3001/api/users/profile/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@C:\chemin\vers\image.jpg"
```

Si curl fonctionne, le problème est côté frontend.

---

## 📊 Checklist de Debug

- [ ] Terminal backend visible et actif
- [ ] Page /profile ouverte
- [ ] Console navigateur (F12) ouverte
- [ ] Onglet Network ouvert
- [ ] Upload testé
- [ ] Logs backend vérifiés
- [ ] Logs frontend vérifiés
- [ ] Type de fichier : JPG/PNG
- [ ] Taille de fichier : < 5 Mo

---

## 🎯 ESSAYEZ MAINTENANT !

1. **Ouvrez le terminal backend** (gardez-le visible)
2. **Allez sur** http://localhost:3000/profile
3. **Ouvrez F12** (Console + Network)
4. **Uploadez une image**
5. **Regardez les logs du backend**

**Les logs nous diront exactement où est le problème ! 🔍**

---

## 💡 Besoin d'Aide ?

Si après avoir suivi ces étapes le problème persiste, partagez :
1. ✅ Les logs du terminal backend (copier-coller)
2. ✅ La console du navigateur (screenshot ou copier-coller)
3. ✅ L'onglet Network - détails de la requête POST
4. ✅ Le type et la taille du fichier testé

Avec ces informations, on pourra identifier le problème exact !

---

**🚀 Le backend est prêt avec les logs de debug. Testez maintenant !**
