# 🔧 Debug: "Projet non trouvé" sur /farmer/projects/4/manage

**Problème:** La page affiche "Projet non trouvé" alors que le projet existe

---

## ✅ Ce que j'ai vérifié

### 1. Backend API - OK
```bash
curl http://localhost:3001/api/projects/4
# Résultat: 200 OK, projet trouvé ✅
```

### 2. Fichier existe - OK
- `ProjectManagement.js` existe ✅
- Route configurée dans `App.js` ✅

### 3. Code amélioré - OK
- Ajout de `console.log` pour debug ✅
- Meilleure gestion d'erreur ✅
- Message d'erreur plus explicite ✅

---

## 🔍 Étapes de Débogage

### Étape 1: Ouvrir la Console du Navigateur

1. Ouvrez http://localhost:3000/farmer/projects/4/manage
2. **Appuyez sur F12** pour ouvrir DevTools
3. Allez dans l'onglet **Console**
4. **Rechargez la page** (Ctrl+R ou F5)

### Étape 2: Regarder les Logs

Vous devriez voir dans la console:
```javascript
Project API Response: {success: true, data: {...}}
```

**Si vous voyez ça:** ✅ L'API fonctionne, le problème est ailleurs

**Si vous voyez une erreur:** ❌ Lisez le message d'erreur

---

## 🚨 Causes Possibles

### Cause 1: Vous n'êtes pas connecté
**Symptôme:** Erreur 401 Unauthorized dans la console

**Solution:**
1. Allez sur http://localhost:3000/login
2. Connectez-vous avec:
   ```
   Email: kagambegarene5@gmail.com
   Mot de passe: (votre mot de passe)
   ```
3. Retournez sur /farmer/projects/4/manage

---

### Cause 2: Vous n'êtes pas farmer
**Symptôme:** "Vous n'avez pas les permissions"

**Solution:**
1. Vérifiez votre rôle dans la console:
   ```javascript
   localStorage.getItem('token')
   // Copiez le token
   ```
2. Décodez le token sur https://jwt.io
3. Vérifiez que `role: "farmer"`

**Si ce n'est pas le cas:**
- Créez un nouveau compte farmer
- Ou demandez à l'admin de changer votre rôle

---

### Cause 3: Le projet n'appartient pas au farmer connecté
**Symptôme:** Le projet se charge mais "Projet non trouvé" s'affiche

**Vérification:**
```sql
-- Dans MySQL
SELECT id, farmer_id, title FROM projects WHERE id = 4;
```

**Si farmer_id = 1:**
- Connectez-vous avec le compte farmer ID 1
- Ou testez avec un autre projet qui vous appartient

---

### Cause 4: React Query ne rafraîchit pas
**Symptôme:** La page reste bloquée sur "Chargement..."

**Solution:**
1. Ouvrez la console
2. Tapez:
   ```javascript
   localStorage.clear()
   location.reload()
   ```
3. Reconnectez-vous

---

## 🧪 Tests à Faire

### Test 1: Vérifier l'authentification
```javascript
// Dans la console du navigateur
console.log('Token:', localStorage.getItem('token') ? 'Exists' : 'Missing');
```

**Résultat attendu:** `Token: Exists`

---

### Test 2: Vérifier la réponse API
```javascript
// Dans la console du navigateur (après rechargement de la page)
// Cherchez dans la console:
"Project API Response:"
```

**Résultat attendu:** Un objet avec les données du projet

---

### Test 3: Test API direct avec token
```bash
# Dans PowerShell
$token = "VOTRE_TOKEN_ICI"
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/projects/4" -Headers $headers
```

**Résultat attendu:** Données du projet

---

## 🔧 Solutions Rapides

### Solution 1: Nettoyer et Reconnecter
```javascript
// Console du navigateur
localStorage.clear();
sessionStorage.clear();
location.href = '/login';
```

Puis reconnectez-vous comme farmer.

---

### Solution 2: Utiliser un autre projet
Si le projet #4 pose problème, testez avec d'autres:

```
http://localhost:3000/farmer/projects/5/manage
http://localhost:3000/farmer/projects/6/manage
http://localhost:3000/farmer/projects/7/manage
http://localhost:3000/farmer/projects/8/manage
```

---

### Solution 3: Créer un nouveau projet
1. Allez sur `/farmer/submit-project`
2. Créez un nouveau projet
3. Notez l'ID du nouveau projet
4. Testez avec `/farmer/projects/[NOUVEL_ID]/manage`

---

## 📊 Informations de Debug Ajoutées

J'ai modifié `ProjectManagement.js` pour ajouter:

### Console Logs
```javascript
console.log('Project API Response:', res.data);
console.error('Error loading project:', error);
```

### Message d'Erreur Détaillé
Au lieu de juste "Projet non trouvé", vous verrez maintenant:
```
Projet non trouvé
Ce projet n'existe pas ou vous n'avez pas les permissions.
[Message d'erreur de l'API si disponible]
```

---

## 🔄 Prochaines Étapes

1. **Ouvrez la console F12**
2. **Rechargez la page**
3. **Lisez les logs**
4. **Partagez-moi ce que vous voyez**

Je pourrai alors vous aider davantage selon le message d'erreur exact!

---

## 📝 Commandes Utiles

### Vérifier le backend
```bash
curl http://localhost:3001/api/projects/4
```

### Vérifier l'authentification
```javascript
// Console navigateur
fetch('http://localhost:3001/api/auth/me', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(console.log)
```

### Vérifier les projets du farmer
```javascript
// Console navigateur
fetch('http://localhost:3001/api/projects/farmer/my-projects', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
}).then(r => r.json()).then(console.log)
```

---

## ✅ Checklist de Débogage

- [ ] Backend tourne sur port 3001
- [ ] Frontend tourne sur port 3000
- [ ] Je suis connecté (token dans localStorage)
- [ ] Je suis farmer (vérifié dans le token)
- [ ] Le projet #4 existe (testé avec curl)
- [ ] Console F12 ouverte
- [ ] Page rechargée avec F5
- [ ] Logs lus dans la console

---

**Une fois la console ouverte, partagez-moi les messages que vous voyez! 🔍**
