# 🚀 Guide de Démarrage Rapide - Profil Utilisateur Amélioré

## ✅ État de l'Implémentation

**TOUTES LES FONCTIONNALITÉS SONT IMPLÉMENTÉES ET TESTÉES !**

```
✅ Migration base de données : EXÉCUTÉE
✅ Backend (routes API) : PRÊT
✅ Frontend (interface) : PRÊT
✅ ThemeContext : PRÊT
✅ Dark Mode : CONFIGURÉ
✅ Upload de fichiers : CONFIGURÉ
✅ Tests : TOUS PASSÉS
```

## 🎯 Fonctionnalités Disponibles

1. **📷 Photo de Profil**
   - Upload d'image (JPG, PNG, GIF, WEBP)
   - Suppression de photo
   - Taille max : 5 Mo

2. **✍️ Bio/Description**
   - 500 caractères max
   - Compteur en temps réel

3. **🎨 Thème du Site**
   - ☀️ Clair
   - 🌙 Sombre
   - 🔄 Auto (suit le système)

4. **📝 Informations Personnelles**
   - Nom, téléphone, pays, ville, adresse
   - Mode édition avec validation

5. **🔐 Sécurité**
   - Changement de mot de passe

## 🏁 Démarrage en 3 Étapes

### Étape 1 : Démarrer le Backend
```bash
cd server
npm start
```

**Vous devriez voir :**
```
✅ Server running on port 3000
✅ Database connected
```

### Étape 2 : Démarrer le Frontend
```bash
# Dans un nouveau terminal
cd client
npm start
```

**Vous devriez voir :**
```
✅ Compiled successfully!
✅ Webpack compiled with 0 warnings
```

### Étape 3 : Tester les Fonctionnalités
1. Ouvrir http://localhost:3000
2. Se connecter avec un compte existant
3. Naviguer vers http://localhost:3000/profile

## 🧪 Vérification Rapide

### Test 1 : Migration de la Base de Données
```bash
node test-profile-features.js
```

**Résultat attendu :** ✅ TOUS LES TESTS PASSÉS

### Test 2 : Vérifier les Colonnes
```sql
USE agrikonbit;
SHOW COLUMNS FROM users LIKE 'bio';
SHOW COLUMNS FROM users LIKE 'theme_preference';
```

**Résultat attendu :**
- `bio` : text
- `theme_preference` : enum('light','dark','auto')

### Test 3 : Vérifier le Dossier Uploads
```bash
# Le dossier doit exister
dir uploads\profiles
```

## 📱 Utilisation par l'Utilisateur Final

### Accéder au Profil
1. Se connecter à l'application
2. Cliquer sur l'icône utilisateur dans le header
3. Ou naviguer vers `/profile`

### Changer la Photo de Profil
1. Cliquer sur **"📷 Changer la photo"**
2. Sélectionner une image depuis votre ordinateur
3. L'image est uploadée automatiquement
4. Pour supprimer : cliquer sur **"🗑️ Supprimer la photo"**

### Modifier les Informations
1. Cliquer sur **"✏️ Modifier"**
2. Modifier les champs souhaités
3. Ajouter/modifier la bio (max 500 caractères)
4. Cliquer sur **"💾 Enregistrer"** ou **"Annuler"**

### Changer le Thème
1. Dans la section **"🎨 Thème"**
2. Cliquer sur le thème désiré :
   - **"Clair ☀️"** - Mode lumineux
   - **"Sombre 🌙"** - Mode sombre
   - **"Auto 🔄"** - Suit le système
3. Le changement est **instantané** et **sauvegardé**

### Changer le Mot de Passe
1. Cliquer sur **"Changer le mot de passe"**
2. Entrer le mot de passe actuel
3. Entrer le nouveau mot de passe (min 6 caractères)
4. Confirmer le nouveau mot de passe
5. Cliquer sur **"Enregistrer"**

## 🔍 Endpoints API

### GET /api/users/profile
Récupère le profil complet de l'utilisateur connecté.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "country": "France",
    "city": "Paris",
    "address": "123 rue Example",
    "profile_image": "/uploads/profiles/profile-1-123456.jpg",
    "bio": "Agriculteur passionné...",
    "theme_preference": "dark",
    "role": "farmer",
    "kyc_status": "verified",
    "gyt_balance": 1500.50
  }
}
```

### PUT /api/users/profile
Met à jour les informations du profil.

**Body :**
```json
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "country": "France",
  "city": "Paris",
  "address": "123 rue Example",
  "bio": "Ma nouvelle bio...",
  "themePreference": "dark"
}
```

### POST /api/users/profile/image
Upload une photo de profil.

**Form Data :**
- `profileImage` : File (image)

**Headers :**
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

### DELETE /api/users/profile/image
Supprime la photo de profil actuelle.

### PUT /api/users/change-password
Change le mot de passe.

**Body :**
```json
{
  "currentPassword": "ancien123",
  "newPassword": "nouveau123"
}
```

## 🎨 Thème Dark Mode

### Classes Tailwind Utilisées
```jsx
// Arrière-plan
dark:bg-gray-900   // Fond sombre
dark:bg-gray-800   // Cards sombres
dark:bg-gray-700   // Inputs sombres

// Texte
dark:text-white    // Texte principal
dark:text-gray-300 // Texte secondaire
dark:text-gray-400 // Texte tertiaire

// Bordures
dark:border-gray-600 // Bordures
dark:border-gray-700 // Bordures foncées
```

### Configuration Tailwind
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ✅ Activé
  // ...
}
```

### ThemeContext
```javascript
import { useTheme } from '../contexts/ThemeContext';

const { theme, effectiveTheme, changeTheme, isDark } = useTheme();

// Changer le thème
changeTheme('dark');  // 'light' | 'dark' | 'auto'
```

## 📊 Statistiques (d'après les tests)

```
Total utilisateurs : 11
Avec bio : 1 (9%)
Avec photo : 0 (0%)
Thème clair : 10
Thème sombre : 1
Thème auto : 0
```

## 🐛 Dépannage Rapide

### Problème : L'image ne s'upload pas
**Solution :**
1. Vérifier que le dossier `uploads/profiles` existe
2. Vérifier les permissions du dossier
3. Vérifier la taille de l'image (max 5 Mo)
4. Vérifier le type de fichier (JPG, PNG, GIF, WEBP)

### Problème : Le thème ne change pas
**Solution :**
1. Vider le cache du navigateur
2. Vérifier que `darkMode: 'class'` est dans `tailwind.config.js`
3. Vérifier que le ThemeProvider enveloppe l'App
4. Ouvrir la console pour voir les erreurs

### Problème : Les données ne se sauvegardent pas
**Solution :**
1. Vérifier que le backend est démarré
2. Vérifier le token d'authentification
3. Ouvrir la console réseau (F12) pour voir les erreurs API
4. Vérifier que la migration a bien été exécutée

### Problème : Migration échoue
**Solution :**
1. Vérifier la connexion à MySQL
2. S'assurer que la base de données `agrikonbit` existe
3. Vérifier les identifiants dans `server/.env`
4. Exécuter : `node test-profile-features.js`

## 📚 Documentation Complète

- **Guide détaillé :** `PROFILE_IMPROVEMENTS_GUIDE.md`
- **Résumé complet :** `PROFILE_IMPLEMENTATION_COMPLETE.md`
- **Ce guide :** `PROFILE_QUICK_START.md`

## ✨ Prochaines Améliorations Possibles

- [ ] Crop d'image avant upload
- [ ] Filtres pour la photo de profil
- [ ] Galerie de photos (plusieurs photos)
- [ ] Partage de profil public
- [ ] QR code du profil
- [ ] Export des données du profil
- [ ] Historique des modifications

## 🎉 Conclusion

**Le système de profil utilisateur est 100% fonctionnel !**

Toutes les fonctionnalités demandées sont implémentées :
- ✅ Photo de profil
- ✅ Bio/Description
- ✅ Changement de thème
- ✅ Modification des informations
- ✅ Sécurité (mot de passe)

**Bon développement ! 🚀**
