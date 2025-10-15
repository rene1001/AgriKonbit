# Guide d'Amélioration du Profil Utilisateur

## 🎯 Fonctionnalités Ajoutées

Le système de profil utilisateur a été considérablement amélioré avec les fonctionnalités suivantes :

### 1. **Photo de Profil** 📷
- Upload de photo de profil (JPG, PNG, GIF, WEBP)
- Taille maximale : 5 Mo
- Suppression de la photo de profil
- Remplacement automatique de l'ancienne photo
- Affichage d'un avatar par défaut si aucune photo

### 2. **Bio/Description** ✍️
- Champ de description personnalisé (max 500 caractères)
- Compteur de caractères en temps réel
- Affichage formaté de la bio sur le profil

### 3. **Changement de Thème** 🎨
- 3 options de thème :
  - **Clair** ☀️ : Mode clair standard
  - **Sombre** 🌙 : Mode sombre pour réduire la fatigue oculaire
  - **Auto** 🔄 : S'adapte automatiquement aux préférences système
- Persistance du thème dans localStorage et base de données
- Application immédiate du thème sur tout le site
- Support complet du dark mode avec Tailwind CSS

### 4. **Modification des Informations** 📝
- Édition en ligne des informations personnelles
- Validation des données
- Confirmation visuelle des modifications
- Annulation possible avant enregistrement

### 5. **Sécurité** 🔐
- Changement de mot de passe sécurisé
- Validation du mot de passe actuel
- Confirmation du nouveau mot de passe
- Minimum 6 caractères requis

## 🗄️ Modifications Base de Données

### Migration 013 : Ajout de colonnes
```sql
ALTER TABLE users 
ADD COLUMN bio TEXT NULL,
ADD COLUMN theme_preference ENUM('light', 'dark', 'auto') DEFAULT 'light';
```

### Exécution de la Migration

```bash
# Depuis la racine du projet
node run-profile-migration.js
```

## 📁 Fichiers Créés/Modifiés

### Backend
1. **migrations/013_add_profile_enhancements.sql** - Migration de la base de données
2. **run-profile-migration.js** - Script d'exécution de la migration
3. **server/routes/users.js** - Routes améliorées :
   - `GET /api/users/profile` - Récupérer le profil (inclut bio et theme_preference)
   - `PUT /api/users/profile` - Mettre à jour le profil (inclut bio et themePreference)
   - `POST /api/users/profile/image` - Upload de photo de profil
   - `DELETE /api/users/profile/image` - Supprimer la photo de profil

### Frontend
1. **client/src/contexts/ThemeContext.js** - Context pour la gestion du thème
2. **client/src/pages/Profile.js** - Page de profil complètement refaite
3. **client/src/utils/api.js** - Endpoints ajoutés
4. **client/src/App.js** - Intégration du ThemeProvider
5. **client/tailwind.config.js** - Configuration dark mode

## 🚀 Installation et Configuration

### 1. Installer les dépendances (si nécessaire)
```bash
# Backend (déjà installé)
cd server
npm install

# Frontend (déjà installé)
cd client
npm install
```

### 2. Exécuter la migration de la base de données
```bash
# Depuis la racine du projet
node run-profile-migration.js
```

### 3. Créer le dossier uploads pour les photos de profil
Le dossier sera créé automatiquement lors du premier upload, mais vous pouvez le créer manuellement :
```bash
mkdir -p uploads/profiles
```

### 4. Redémarrer le serveur backend
```bash
cd server
npm start
```

### 5. Démarrer le client (si non démarré)
```bash
cd client
npm start
```

## 💡 Utilisation

### Pour les Utilisateurs

1. **Accéder au Profil**
   - Cliquer sur l'icône de profil dans le header
   - Naviguer vers `/profile`

2. **Changer la Photo de Profil**
   - Cliquer sur "📷 Changer la photo"
   - Sélectionner une image (JPG, PNG, GIF, WEBP)
   - L'image est uploadée automatiquement

3. **Modifier les Informations**
   - Cliquer sur "✏️ Modifier"
   - Éditer les champs désirés
   - Cliquer sur "💾 Enregistrer"

4. **Ajouter/Modifier la Bio**
   - Dans le mode édition, remplir le champ "Bio / Description"
   - Maximum 500 caractères
   - Sauvegarder

5. **Changer le Thème**
   - Sélectionner l'un des 3 thèmes dans la section "🎨 Thème"
   - Le thème est appliqué immédiatement
   - Le choix est sauvegardé automatiquement

6. **Changer le Mot de Passe**
   - Cliquer sur "Changer le mot de passe"
   - Entrer le mot de passe actuel
   - Entrer et confirmer le nouveau mot de passe
   - Sauvegarder

## 🎨 Interface Utilisateur

### Layout
- **Colonne Gauche** (1/3) :
  - Photo de profil
  - Boutons d'upload/suppression
  - Sélecteur de thème
  - Informations du compte (KYC, solde GYT)

- **Colonne Droite** (2/3) :
  - Informations personnelles (mode lecture/édition)
  - Bio/Description
  - Section sécurité

### Dark Mode
- Support complet du dark mode
- Transitions fluides
- Contrastes optimisés
- Classes Tailwind : `dark:bg-gray-900`, `dark:text-white`, etc.

## 🔒 Sécurité

### Upload de Fichiers
- Validation du type de fichier (images uniquement)
- Limite de taille : 5 Mo
- Noms de fichiers uniques avec timestamp
- Suppression automatique de l'ancienne photo

### Validation des Données
- Validation côté client et serveur
- Express-validator pour le backend
- Messages d'erreur descriptifs

### Permissions
- Seul l'utilisateur authentifié peut modifier son profil
- Middleware `authenticateToken` sur toutes les routes

## 📊 Structure des Données

### Table users (après migration)
```sql
- id (INT)
- email (VARCHAR)
- full_name (VARCHAR)
- role (ENUM)
- phone (VARCHAR)
- country (VARCHAR)
- city (VARCHAR)
- address (TEXT)
- profile_image (VARCHAR)  -- Chemin de l'image
- bio (TEXT)                -- NOUVEAU
- theme_preference (ENUM)   -- NOUVEAU: 'light', 'dark', 'auto'
- kyc_status (ENUM)
- created_at (DATETIME)
- updated_at (DATETIME)
```

## 🧪 Tests

### Tests Manuels à Effectuer

1. **Upload de Photo**
   - [ ] Upload d'une image valide
   - [ ] Tentative d'upload d'un fichier non-image
   - [ ] Tentative d'upload d'un fichier > 5 Mo
   - [ ] Suppression de la photo
   - [ ] Remplacement de la photo existante

2. **Modification du Profil**
   - [ ] Modification des informations personnelles
   - [ ] Ajout/modification de la bio
   - [ ] Validation des champs requis
   - [ ] Annulation de l'édition

3. **Thème**
   - [ ] Changement vers mode clair
   - [ ] Changement vers mode sombre
   - [ ] Changement vers mode auto
   - [ ] Persistance après rechargement de la page
   - [ ] Synchronisation avec les préférences système (mode auto)

4. **Mot de Passe**
   - [ ] Changement avec mot de passe correct
   - [ ] Erreur avec mauvais mot de passe actuel
   - [ ] Erreur si mots de passe ne correspondent pas
   - [ ] Erreur si mot de passe trop court

## 🐛 Dépannage

### La migration échoue
- Vérifier la connexion à la base de données
- S'assurer que les colonnes n'existent pas déjà
- Vérifier les permissions MySQL

### L'upload d'image ne fonctionne pas
- Vérifier que le dossier `uploads/profiles` existe et est accessible en écriture
- Vérifier la configuration de `multer`
- Vérifier la taille du fichier

### Le thème ne s'applique pas
- Vérifier que `darkMode: 'class'` est dans `tailwind.config.js`
- Vérifier que le ThemeProvider enveloppe l'application
- Vider le cache du navigateur

### Les images ne s'affichent pas
- Vérifier que le serveur sert les fichiers statiques depuis `/uploads`
- Vérifier le chemin de l'image dans la base de données
- Vérifier les permissions du dossier uploads

## ✅ Checklist de Déploiement

- [ ] Migration 013 exécutée sur la base de données de production
- [ ] Dossier `uploads/profiles` créé avec les bonnes permissions
- [ ] Variables d'environnement configurées
- [ ] Tests de toutes les fonctionnalités
- [ ] Documentation mise à jour
- [ ] Backup de la base de données effectué

## 📚 Ressources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Multer Documentation](https://github.com/expressjs/multer)
- [React Context API](https://react.dev/reference/react/useContext)

## 🎉 Résumé

Le système de profil utilisateur est maintenant complet avec :
- ✅ Upload et gestion de photo de profil
- ✅ Bio/Description personnalisée
- ✅ Système de thème (clair/sombre/auto)
- ✅ Modification des informations
- ✅ Changement de mot de passe sécurisé
- ✅ Interface moderne et responsive
- ✅ Support complet du dark mode

Toutes les fonctionnalités demandées ont été implémentées avec succès !
