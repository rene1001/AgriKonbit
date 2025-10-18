# 🧪 Guide de Test - Agriculteur (Farmer)

**Date:** 18 Octobre 2025, 12:45 UTC  
**Rôle:** Farmer (Agriculteur)

---

## 🔑 Connexion

### Compte Farmer de Test

**Email:** `kagambegarene5@gmail.com`  
**Mot de passe:** [Votre mot de passe]

**URL de connexion:** http://localhost:3000/login

---

## 📋 Checklist de Test Complète

### ✅ 1. Connexion
```
1. Allez sur http://localhost:3000/login
2. Email: kagambegarene5@gmail.com
3. Entrez votre mot de passe
4. Cliquez "Se connecter"
5. ✅ Redirection vers /dashboard
```

**Vérifications:**
- [ ] Connexion réussie
- [ ] Token stocké dans localStorage
- [ ] Nom affiché en haut à droite
- [ ] Menu farmer accessible

---

### ✅ 2. Dashboard Farmer
```
URL: http://localhost:3000/dashboard
```

**À vérifier:**
- [ ] Statistiques affichées (projets, investissements, commandes)
- [ ] Section "Mes Projets"
- [ ] Section "Mes Produits"
- [ ] Section "Commandes Récentes"
- [ ] Graphiques/Charts visibles

---

### ✅ 3. Mes Projets
```
URL: http://localhost:3000/farmer/my-projects
```

**À vérifier:**
- [ ] 4 cartes statistiques (Total, Actifs, En attente, Budget)
- [ ] Projets affichés en grille (3 colonnes)
- [ ] Images des projets visibles
- [ ] Barres de progression du financement
- [ ] Budget et montant collecté affichés en DOLLAR
- [ ] Badge statut coloré (Active, Pending, etc.)
- [ ] Bouton "Gérer" sur chaque projet
- [ ] Bouton "Modifier" sur projets pending

**Vos projets:**
- Projet #4: Culture de Tomates Bio (Active, 56.7%)
- Projet #5: Élevage de Poulets (Active, 90%)
- Projet #6: Café Arabica Premium (Active, 48%)
- Projet #7: Maraîchage Diversifié (Validated, 33.3%)
- Projet #8: Apiculture et Miel (Pending, 0%)

---

### ✅ 4. Gérer un Projet
```
URL: http://localhost:3000/farmer/projects/4/manage
```

**Onglet Overview:**
- [ ] Budget total visible (15,000 DOLLAR)
- [ ] Montant financé visible (8,500 DOLLAR)
- [ ] Nombre d'investisseurs (12)
- [ ] Barre de progression (56.7%)
- [ ] Informations du projet complètes

**Onglet Updates:**
- [ ] Liste des mises à jour existantes
- [ ] Bouton "Publier une mise à jour"
- [ ] Formulaire de création:
  - Titre (min 5 caractères)
  - Contenu (min 20 caractères)
  - Images (optionnel)
  - Public/Privé
- [ ] Bouton "Modifier" sur chaque mise à jour
- [ ] Bouton "Supprimer" sur chaque mise à jour

**Test: Créer une mise à jour**
```
1. Cliquez "Publier une mise à jour"
2. Titre: "Récolte en cours - Excellents résultats!"
3. Contenu: "Nous sommes heureux d'annoncer que la récolte progresse bien. Les tomates sont de très belle qualité grâce aux conditions météo favorables. Nous estimons dépasser nos objectifs de production de 15%."
4. Image: https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600
5. Cochez "Public"
6. Cliquez "Publier"
7. ✅ Toast de succès
8. ✅ Mise à jour apparaît dans la liste
```

**Onglet Withdrawal:**
- [ ] Bouton "Demander un retrait"
- [ ] Formulaire de demande
- [ ] Historique des demandes
- [ ] Statuts des demandes

⚠️ **Note:** La table `project_withdrawal_requests` peut manquer

---

### ✅ 5. Modifier un Projet (Pending uniquement)
```
URL: http://localhost:3000/farmer/projects/8/edit
```

**À vérifier:**
- [ ] Formulaire pré-rempli avec données existantes
- [ ] Titre modifiable
- [ ] Description modifiable
- [ ] Localisation modifiable
- [ ] Latitude/Longitude modifiables
- [ ] Images existantes affichées
- [ ] Bouton "Ajouter une image"
- [ ] Bouton "Supprimer" sur chaque image
- [ ] Bouton "Enregistrer" actif

**Test: Modifier le projet #8**
```
1. Modifiez la description
2. Ajoutez une nouvelle image: 
   https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600
3. Cliquez "Enregistrer"
4. ✅ Toast de succès
5. ✅ Redirection vers /dashboard
```

---

### ✅ 6. Ajouter une Mise à Jour de Projet
```
URL: http://localhost:3000/farmer/project-updates/4
```

**À vérifier:**
- [ ] Titre du projet affiché
- [ ] Champ "Titre" (min 5 caractères)
- [ ] Champ "Contenu" (min 20 caractères)
- [ ] Checkbox "Public"
- [ ] Champ URL image
- [ ] Bouton "Ajouter" image
- [ ] Aperçu des images ajoutées
- [ ] Bouton "Publier"

**Test:**
```
1. Titre: "Irrigation installée"
2. Contenu: "Le nouveau système d'irrigation est maintenant opérationnel. Cela va nous permettre d'optimiser l'usage de l'eau et d'améliorer les rendements."
3. Image: https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600
4. Cochez "Public"
5. Cliquez "Publier"
6. ✅ Toast de succès
7. ✅ Redirection vers /dashboard
```

---

### ✅ 7. Soumettre un Nouveau Projet
```
URL: http://localhost:3000/farmer/submit-project
```

**Formulaire complet:**
- [ ] Champ "Titre" (min 5 caractères)
- [ ] Champ "Description" (min 50 caractères)
- [ ] Champ "Budget USD" (> 0)
- [ ] Champ "Durée jours" (>= 30)
- [ ] Champ "Rendement %" (>= 0)
- [ ] Champ "Localisation" (min 3 caractères)
- [ ] Sélecteur "Catégorie"
- [ ] Champs "Latitude" et "Longitude" (optionnels)
- [ ] **🎥 Champ "Vidéo explicative"** (optionnel) ✅ NOUVEAU
- [ ] Gestion des images (URL + Upload)
- [ ] Bouton "Soumettre"

**Test: Créer un nouveau projet avec vidéo**
```
1. Titre: "Élevage de Chèvres Laitières"

2. Description: "Projet d'élevage de 30 chèvres laitières pour la production de lait frais et de fromage de chèvre artisanal. Le projet inclut la construction d'une étable moderne, l'achat des chèvres, et la mise en place d'une unité de transformation du lait. Nous visons le marché local et les restaurants haut de gamme de Port-au-Prince."

3. Budget: 12000

4. Durée: 365

5. Rendement: 25

6. Localisation: Kenscoff, Haiti

7. Catégorie: livestock

8. 🎥 Vidéo: https://www.youtube.com/watch?v=8BRKfNZV6Dk

9. Images:
   - https://images.unsplash.com/photo-1529066918102-06dae0c43f36?w=600
   - https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600

10. Cliquez "Soumettre"
11. ✅ Toast: "Projet soumis, en attente de validation"
12. ✅ Redirection vers /dashboard
13. ✅ Projet apparaît avec statut "pending"
14. ✅ Vidéo sauvegardée avec le projet
```

**Vérifications vidéo:**
- [ ] Message de confirmation: "✅ Vidéo ajoutée!"
- [ ] Lien de prévisualisation cliquable
- [ ] Vidéo s'ouvre dans nouvel onglet

---

### ✅ 8. Mes Produits
```
URL: http://localhost:3000/farmer/my-products
```

**À vérifier:**
- [ ] Liste des produits affichée
- [ ] Images des produits visibles
- [ ] Prix en DOLLAR (pas en $)
- [ ] Stock affiché
- [ ] Bouton "Modifier" sur chaque produit
- [ ] Bouton "Ajouter un produit"

**Vos produits:**
- Tomates Bio - 1kg (4.50 DOLLAR, Stock: 500)
- Salade Verte Bio (2.00 DOLLAR, Stock: 200)
- Autres produits...

---

### ✅ 9. Ajouter un Produit
```
URL: http://localhost:3000/farmer/add-product
```

**Formulaire:**
- [ ] Nom (requis)
- [ ] Description (min 10 caractères)
- [ ] Prix en DOLLAR (> 0)
- [ ] Stock (> 0)
- [ ] Catégorie (vegetables, fruits, cereals, etc.)
- [ ] Localisation (min 3 caractères)
- [ ] Bio certifié (Oui/Non)
- [ ] Images (URLs)

**Test: Créer un nouveau produit**
```
1. Nom: "Mangues Françaises Bio - 1kg"

2. Description: "Mangues juteuses et sucrées, récoltées à maturité parfaite. Cultivées de manière biologique dans nos plantations. Idéales pour les jus, smoothies et desserts tropicaux."

3. Prix: 6.00

4. Stock: 250

5. Catégorie: fruits

6. Bio certifié: Oui

7. Localisation: Les Cayes

8. Image: https://images.unsplash.com/photo-1605027990121-cbae9d3ce0f5?w=600

9. Cliquez "Soumettre"
10. ✅ Toast de succès
11. ✅ Redirection vers /farmer/my-products
12. ✅ Produit apparaît dans la liste
```

---

### ✅ 10. Modifier un Produit
```
URL: http://localhost:3000/farmer/products/1/edit
```

**À vérifier:**
- [ ] Formulaire pré-rempli
- [ ] Tous les champs modifiables
- [ ] Images existantes affichées
- [ ] Bouton "Activer/Désactiver"
- [ ] Bouton "Enregistrer"

**Test:**
```
1. Modifiez le prix: 4.50 → 5.00
2. Modifiez le stock: 500 → 450
3. Ajoutez une nouvelle image
4. Cliquez "Enregistrer"
5. ✅ Toast de succès
6. ✅ Modifications sauvegardées
```

---

### ✅ 11. Commandes Reçues
```
URL: http://localhost:3000/farmer/orders
(ou via Dashboard)
```

**À vérifier:**
- [ ] Liste des commandes
- [ ] Statuts des commandes
- [ ] Montants en DOLLAR
- [ ] Détails des produits commandés
- [ ] Bouton "Gérer" sur chaque commande

---

## 🎯 Scénarios Complets

### Scénario 1: Cycle de Vie d'un Projet

```
1. Créer un nouveau projet avec vidéo ✅
   → Statut: pending

2. Admin valide le projet
   → Statut: validated

3. Projet financé par investisseurs
   → Statut: active

4. Publier des mises à jour régulières ✅
   → Investisseurs notifiés

5. Demander un retrait de fonds
   → En attente d'approbation admin

6. Projet terminé
   → Statut: completed
```

### Scénario 2: Gestion de Produits

```
1. Créer un nouveau produit ✅
   → Visible sur marketplace

2. Recevoir des commandes
   → Notifications

3. Mettre à jour le stock ✅
   → Stock diminue automatiquement

4. Modifier le prix si besoin ✅
   → Nouveau prix appliqué

5. Désactiver si rupture de stock
   → Produit masqué du marketplace
```

---

## 🐛 Problèmes Connus

### 1. Table `project_withdrawal_requests` manquante
**Symptôme:** Erreur dans l'onglet Withdrawal  
**Solution:** Créer la table ou ne pas utiliser cette fonctionnalité

### 2. URLs doublées (CORRIGÉ ✅)
**Avant:** `/api/api/projects/4` → 404  
**Maintenant:** `/api/projects/4` → 200 OK

### 3. Images ne se chargent pas
**Solution:** Vérifier que les URLs Unsplash sont correctes

---

## 📊 Données de Test

### Vos Projets (Farmer ID: 1)

| ID | Titre | Status | Budget | Financé | % |
|----|-------|--------|--------|---------|---|
| 4 | Culture de Tomates Bio | active | 15,000 | 8,500 | 56.7% |
| 5 | Élevage de Poulets | active | 8,000 | 7,200 | 90.0% |
| 6 | Café Arabica Premium | active | 25,000 | 12,000 | 48.0% |
| 7 | Maraîchage Diversifié | validated | 6,000 | 2,000 | 33.3% |
| 8 | Apiculture et Miel | pending | 10,000 | 0 | 0% |

### Vos Produits (Farmer ID: 1)

| ID | Nom | Prix | Stock |
|----|-----|------|-------|
| 1 | Tomates Bio - 1kg | 4.50 | 500 |
| 2 | Salade Verte Bio | 2.00 | 200 |
| 3 | Œufs Fermiers | 5.00 | 300 |

---

## ✅ Checklist Finale

### Navigation
- [ ] Dashboard accessible
- [ ] Mes Projets accessible
- [ ] Mes Produits accessible
- [ ] Soumettre projet accessible
- [ ] Ajouter produit accessible

### Projets
- [ ] Voir tous mes projets
- [ ] Gérer un projet (3 onglets)
- [ ] Modifier un projet pending
- [ ] Publier une mise à jour
- [ ] Créer un projet avec vidéo ✅

### Produits
- [ ] Voir tous mes produits
- [ ] Ajouter un produit
- [ ] Modifier un produit
- [ ] Gérer le stock

### Affichage
- [ ] Images visibles
- [ ] Prix en DOLLAR
- [ ] Statistiques correctes
- [ ] Barres de progression
- [ ] Badges de statut

---

## 🎥 Fonctionnalités Nouvelles à Tester

### 1. Vidéos Explicatives ✅
- [ ] Champ vidéo dans formulaire projet
- [ ] Message de confirmation
- [ ] Lien de prévisualisation
- [ ] Vidéo sauvegardée dans BDD

### 2. Page Mes Projets Améliorée ✅
- [ ] 4 cartes statistiques
- [ ] Images des projets
- [ ] Design moderne
- [ ] Boutons Gérer/Modifier

### 3. URLs Corrigées ✅
- [ ] Plus d'erreur 404 sur /projects/:id
- [ ] Plus d'erreur 404 sur /updates
- [ ] Console propre (logs de debug)

---

## 📝 Notes de Test

**Prenez des notes pendant vos tests:**

```
✅ Fonctionnalité testée: _______________________
❌ Problème rencontré: _________________________
💡 Suggestion: _________________________________
```

---

## 🚀 Après les Tests

### Si tout fonctionne:
1. ✅ Créer des projets réels
2. ✅ Ajouter vos vrais produits
3. ✅ Inviter d'autres farmers
4. ✅ Promouvoir la plateforme

### Si problèmes:
1. Noter les erreurs exactes
2. Prendre des screenshots
3. Vérifier la console (F12)
4. Partager les logs

---

**Bon test! 🧪**

**N'hésitez pas à explorer toutes les fonctionnalités!** 🚀
