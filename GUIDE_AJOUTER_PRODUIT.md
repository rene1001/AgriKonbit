# 📦 Guide - Ajouter un Produit

**URL:** http://localhost:3000/farmer/add-product

---

## 📋 Formulaire d'Ajout de Produit

La page permet aux farmers d'ajouter leurs produits au marketplace.

### ✅ Champs Obligatoires

1. **Nom du Produit** (minimum 3 caractères)
   - Exemple: "Tomates Bio - 1kg"
   - Exemple: "Café Arabica Premium - 250g"

2. **Description** (minimum 10 caractères)
   - Décrivez le produit en détail
   - Mentionnez les qualités, l'origine, etc.
   - Exemple: "Tomates fraîches biologiques cultivées sans pesticides"

3. **Prix** (doit être > 0)
   - Prix en DOLLAR
   - Supporte les décimales (ex: 4.50)

4. **Stock** (doit être ≥ 0)
   - Nombre d'unités disponibles
   - Exemple: 500

5. **Localisation** (minimum 3 caractères)
   - Lieu de production
   - Exemple: "Port-au-Prince, Haïti"

---

## 🎛️ Champs Optionnels

### Unité
Choisir parmi:
- **kg** - Kilogramme
- **g** - Gramme
- **l** - Litre
- **ml** - Millilitre
- **piece** - Pièce
- **box** - Boîte
- **bottle** - Bouteille

### Catégorie
Choisir parmi:
- **crops** - Cultures
- **livestock** - Élevage
- **dairy** - Produits laitiers
- **honey** - Miel
- **fruits** - Fruits
- **vegetables** - Légumes
- **grains** - Céréales
- **other** - Autre

---

## 🖼️ Ajouter des Images

1. **Coller l'URL d'une image** dans le champ
2. **Cliquer sur "Ajouter une image"**
3. L'image apparaît dans la grille
4. **Supprimer** une image en cliquant sur le "×"

### Sources d'Images Gratuites
- **Unsplash:** https://unsplash.com
- **Pexels:** https://pexels.com
- **Pixabay:** https://pixabay.com

### Exemple d'URL
```
https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600
```

---

## 📝 Exemple de Produit Complet

```
Nom: Tomates Bio - 1kg
Description: Tomates fraîches biologiques cultivées sans pesticides. Parfaites pour salades et sauces.
Prix: 4.50
Stock: 500
Unité: kg
Catégorie: vegetables
Localisation: Port-au-Prince, Haïti
Images: 
  - https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600
```

---

## ⚠️ Messages d'Erreur

Si vous voyez une erreur:

| Erreur | Solution |
|--------|----------|
| "Nom du produit trop court" | Le nom doit faire au moins 3 caractères |
| "Description trop courte" | La description doit faire au moins 10 caractères |
| "Prix invalide" | Le prix doit être supérieur à 0 |
| "Stock invalide" | Le stock doit être un nombre positif ou 0 |
| "Localisation requise" | Remplissez le champ localisation (min 3 caractères) |

---

## ✅ Validation et Soumission

1. **Remplissez tous les champs obligatoires**
2. **Ajoutez au moins une image** (recommandé)
3. **Cliquez sur "Soumettre"**
4. Si succès → Redirection vers "Mes Produits"
5. Si erreur → Message toast avec l'erreur

---

## 🔄 Après la Création

Une fois le produit créé:
- ✅ Il apparaît dans **"Mes Produits"** (`/farmer/my-products`)
- ✅ Il est visible sur le **Marketplace** (`/marketplace`)
- ✅ Les clients peuvent l'acheter
- ✅ Vous pouvez le **modifier** ou le **supprimer**

---

## 🛠️ Routes Disponibles

| URL | Description |
|-----|-------------|
| `/farmer/add-product` | Ajouter un produit |
| `/farmer/my-products` | Liste de vos produits |
| `/farmer/products/:id/edit` | Modifier un produit |

---

## 🎯 Conseils

### Pour un Bon Produit
1. ✅ **Nom clair et descriptif** avec le poids/quantité
2. ✅ **Description détaillée** (100-200 mots idéal)
3. ✅ **Prix compétitif** basé sur le marché
4. ✅ **Stock réaliste** que vous pouvez honorer
5. ✅ **Images de qualité** (HD, bien éclairées)
6. ✅ **Localisation précise** pour la confiance

### Images Optimales
- **Format:** JPG ou PNG
- **Taille:** 600-1000px de largeur
- **Qualité:** Haute résolution
- **Éclairage:** Naturel, bien exposé
- **Fond:** Neutre ou contexte agricole
- **Nombre:** 1-3 images par produit

---

## 🧪 Tester la Page

### Méthode 1: Navigateur
```
http://localhost:3000/farmer/add-product
```

### Méthode 2: Depuis le Dashboard Farmer
1. Se connecter en tant que farmer
2. Aller au dashboard
3. Cliquer sur "Ajouter un produit"

---

## 🔧 Dépannage

### La page ne charge pas
```bash
# Vérifier que le frontend tourne
# Terminal frontend doit montrer:
webpack compiled successfully
```

### "Unauthorized" en soumettant
```
Solution: Connectez-vous avec un compte farmer
Email: kagambegarene5@gmail.com
```

### Images ne s'affichent pas
```
1. Vérifier l'URL de l'image
2. L'URL doit commencer par http:// ou https://
3. Tester l'URL dans un navigateur
4. Utiliser des images depuis Unsplash
```

---

## 📊 Produits Exemples (Pour Inspiration)

### Légumes Bio
```
Nom: Tomates Bio - 1kg
Prix: 4.50 DOLLAR
Catégorie: vegetables
Stock: 500
Image: https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600
```

### Produits Fermiers
```
Nom: Œufs Fermiers - Douzaine
Prix: 5.00 DOLLAR
Catégorie: other
Stock: 300
Image: https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600
```

### Café Premium
```
Nom: Café Arabica Premium - 250g
Prix: 12.00 DOLLAR
Catégorie: other
Stock: 150
Image: https://images.unsplash.com/photo-1447933968403-c146f1c7c456?w=600
```

---

**Dernière mise à jour:** 18 Octobre 2025, 11:40 UTC  
**Status:** ✅ Page fonctionnelle et accessible
