# ⚠️ REDÉMARRAGE REQUIS - Backend

## 🔴 Erreurs Actuelles

Vous voyez ces erreurs car le serveur backend doit être **redémarré** :

```
❌ 404 (Not Found) - /api/users/profile/image
❌ 400 (Bad Request) - /api/users/profile
❌ Upload error: AxiosError
❌ Failed to update theme preference: AxiosError
```

## ✅ Solution : Redémarrer le Backend

### Méthode 1 : Via le Terminal où le serveur tourne

1. **Trouver le terminal** où le backend est démarré
2. Appuyer sur **`Ctrl + C`** pour arrêter le serveur
3. Redémarrer avec :
```bash
npm start
```

### Méthode 2 : Via PowerShell (Arrêter tous les Node.js)

```powershell
# Arrêter tous les processus Node
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Redémarrer le backend
cd server
npm start
```

### Méthode 3 : Utiliser le script de redémarrage

```powershell
.\restart-backend.ps1
```

## 🎯 Vérification Après Redémarrage

Une fois le backend redémarré, vous devriez voir :

```
✅ Server running on port 3000
✅ Database connected
```

Puis rechargez la page `/profile` et testez :
- ✅ Upload de photo devrait fonctionner
- ✅ Changement de thème devrait fonctionner
- ✅ Modification du profil devrait fonctionner

## 📝 Pourquoi ce Redémarrage ?

J'ai ajouté de **nouvelles routes** dans `server/routes/users.js` :
- `POST /api/users/profile/image` - Upload photo
- `DELETE /api/users/profile/image` - Supprimer photo
- Modification de `PUT /api/users/profile` pour gérer `bio` et `themePreference`

Le serveur doit être redémarré pour charger ces modifications.

## 🚀 Commandes Complètes

```bash
# Terminal 1 - Redémarrer Backend
cd server
npm start

# Terminal 2 - Frontend (si besoin)
cd client
npm start

# Naviguer vers : http://localhost:3000/profile
```

---

**Après le redémarrage, tout devrait fonctionner ! 🎉**
