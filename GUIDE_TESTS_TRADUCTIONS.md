# 🧪 Guide de Tests - Système de Traduction AgriKonbit

## 📅 Date : 18 octobre 2025
## ✅ Status Serveurs : En ligne
- Backend : http://localhost:3001
- Frontend : http://localhost:3000

---

## 🎯 Objectif des Tests

Vérifier que **toutes les pages** du site AgriKonbit fonctionnent correctement dans les **3 langues** (FR, EN, ES).

---

## 🌍 Sélecteur de Langue

**Emplacement** : Header du site (en haut à droite)
- **FR** - Français
- **EN** - English
- **ES** - Español

**Comment tester** :
1. Cliquer sur FR / EN / ES
2. Vérifier que **tous les textes** changent de langue
3. Recharger la page (F5) - La langue doit persister

---

## 📋 Checklist de Tests par Catégorie

### ✅ **1. PAGES PUBLIQUES** (Sans connexion requise)

#### 🏠 **Page d'Accueil** - http://localhost:3000/

**Tests à effectuer** :
- [ ] Titre principal traduit
- [ ] Sous-titre traduit
- [ ] Boutons "Découvrir les projets" et "Accéder au marché" traduits
- [ ] Sections "Projets à la une" et "Produits à la une" traduites
- [ ] Statistiques (Investisseurs, Financés, Agriculteurs) traduites
- [ ] Footer traduit (liens, description)

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 📖 **Page À Propos** - http://localhost:3000/about

**Tests à effectuer** :
- [ ] Titre "Pourquoi investir avec AgriKonbit ?" traduit
- [ ] 6 cartes d'avantages traduites (Impact, Transparence, etc.)
- [ ] Section "Nos projets" traduite
- [ ] Section "Notre vision" traduite
- [ ] Section "Comment investir ?" traduite
- [ ] 4 étapes d'investissement traduites

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 🌱 **Page Projets** - http://localhost:3000/projects

**Tests à effectuer** :
- [ ] Titre "Projets agricoles" traduit
- [ ] Compteur "X projets" traduit
- [ ] Messages de chargement traduits
- [ ] Budget, Rendement, Durée traduits dans chaque carte
- [ ] Bouton "Détails" traduit

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 🛒 **Page Marketplace** - http://localhost:3000/marketplace

**Tests à effectuer** :
- [ ] Titre "Marketplace" traduit
- [ ] Section "Filtres" traduite
- [ ] Champ de recherche avec placeholder traduit
- [ ] Liste des catégories traduites (Céréales, Fruits, etc.)
- [ ] "Pays d'origine" et "Bio uniquement" traduits
- [ ] Cartes produits : "Par", "en stock", "Détails", "Ajouter au panier"

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 📦 **Détail Produit** - http://localhost:3000/marketplace/:id

**Tests à effectuer** :
- [ ] "en stock" traduit
- [ ] Bouton "Ajouter au panier" traduit
- [ ] "Voir la traçabilité" traduit
- [ ] "Origine", "Date de récolte", "Bio certifié" traduits
- [ ] Messages de chargement/erreur traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 🗺️ **Carte des Projets** - http://localhost:3000/map

**Tests à effectuer** :
- [ ] Titre "Carte des Projets" traduit
- [ ] Lien "Voir la liste" traduit
- [ ] Messages d'erreur traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 🔍 **Traçabilité** - http://localhost:3000/traceability/:id

**Tests à effectuer** :
- [ ] Titre "Traçabilité du Produit" traduit
- [ ] "Chargement de la traçabilité..." traduit
- [ ] "Non trouvé" traduit
- [ ] Labels "ID NFT", "Nom", "Description" traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 📍 **Suivi de Commande** - http://localhost:3000/track?t=xxx

**Tests à effectuer** :
- [ ] Titre "Suivi de Commande" traduit
- [ ] "Tracking" et "NFT" traduits
- [ ] Bouton "Vérifier l'Authenticité" traduit
- [ ] État "Vérification..." traduit
- [ ] "Authenticité: OK" traduit
- [ ] "Produit", "Origine", "Récolte" traduits
- [ ] "Aucune donnée NFT" traduit
- [ ] Messages d'erreur traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### ❌ **Page 404** - http://localhost:3000/page-inexistante

**Tests à effectuer** :
- [ ] Titre "404 - Page Non Trouvée" traduit
- [ ] Message "La page que vous recherchez n'existe pas" traduit
- [ ] Bouton "Retour à l'Accueil" traduit

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

### ✅ **2. PAGES AVEC CONNEXION REQUISE**

#### 🛒 **Panier** - http://localhost:3000/cart

**Tests à effectuer** :
- [ ] Titre "Votre panier" traduit
- [ ] Message "Votre panier est vide" traduit
- [ ] Lien "Continuer les achats" traduit
- [ ] Bouton "Retirer" traduit
- [ ] "Sous-total" traduit
- [ ] Bouton "Procéder au paiement" traduit

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 💳 **Checkout** - http://localhost:3000/checkout

**Tests à effectuer** :
- [ ] Titre "Checkout" / "Pago" / "Paiement" traduit
- [ ] "Votre panier est vide" traduit
- [ ] "Total (USD)" et "Total (DOLLAR)" traduits
- [ ] "Votre solde DOLLAR" traduit
- [ ] Bouton "Payer avec DOLLAR Wallet" traduit
- [ ] Messages d'état traduits
- [ ] Notifications toast traduites

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 👤 **Profil** - http://localhost:3000/profile

**Tests à effectuer** :
- [ ] Titre "Mon Profil" traduit
- [ ] Boutons "Modifier" et "Enregistrer" traduits
- [ ] Labels des champs traduits (Nom complet, Email, Téléphone, etc.)
- [ ] "Informations du Compte" traduit
- [ ] "Statut KYC" traduit
- [ ] "Solde DOLLAR" traduit

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 📊 **Dashboard** - http://localhost:3000/dashboard

**Tests à effectuer** :
- [ ] Message "Chargement..." traduit
- [ ] Message "Veuillez vous connecter" traduit
- [ ] Redirection vers le bon dashboard selon le rôle

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

### ✅ **3. DASHBOARDS PAR RÔLE**

#### 🛍️ **Dashboard Consommateur**

**Tests à effectuer** :
- [ ] Titre "Tableau de bord Consommateur" traduit
- [ ] Onglets (Vue d'ensemble, Mes commandes, etc.) traduits
- [ ] Statistiques traduites
- [ ] "Mes Commandes Récentes" traduit
- [ ] Cartes d'actions traduites

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 👨‍🌾 **Dashboard Agriculteur**

**Tests à effectuer** :
- [ ] Statistiques traduites (Projets Actifs, Produits en Vente, etc.)
- [ ] Sections traduites
- [ ] Boutons d'action traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 💼 **Dashboard Investisseur**

**Tests à effectuer** :
- [ ] Toutes les sections traduites
- [ ] Onglets Finances, Projets, Messagerie traduits
- [ ] Graphiques avec labels traduits
- [ ] Formulaires traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

#### 🛡️ **Dashboard Admin** - http://localhost:3000/admin

**Tests à effectuer** :
- [ ] Titre "Tableau de bord Admin" traduit
- [ ] Sous-titre "Gestion de la plateforme" traduit
- [ ] Menu latéral traduit :
  - [ ] Vue d'ensemble
  - [ ] Trésorerie Plateforme
  - [ ] Gestion des Fonds
  - [ ] Communication
  - [ ] Rapports & Exports
  - [ ] Analytiques
  - [ ] Configuration
  - [ ] Validation de Projets
  - [ ] Activité Récente
- [ ] Liens rapides traduits (Utilisateurs, Produits, Projets)
- [ ] Messages toast traduits

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

### ✅ **4. PAGES AGRICULTEUR**

#### 📝 **Soumettre un Projet** - /farmer/submit-project
#### 📋 **Mes Projets** - /farmer/my-projects
#### ➕ **Ajouter un Produit** - /farmer/add-product
#### 🛍️ **Mes Produits** - /farmer/my-products

**Tests à effectuer pour chaque page** :
- [ ] Tous les titres traduits
- [ ] Tous les labels de formulaire traduits
- [ ] Tous les boutons traduits
- [ ] Messages de validation traduits
- [ ] Messages d'erreur traduits
- [ ] Notifications toast traduites

**Langues à tester** : FR ✅ | EN ✅ | ES ✅

---

## 🔍 Tests Automatisés à Vérifier

### **1. Console Browser (F12)**

Ouvrir la console et vérifier qu'il n'y a **AUCUNE** :
- ❌ Erreur JavaScript
- ❌ Avertissement i18n (clés manquantes)
- ❌ Erreur de compilation React

**Comment vérifier** :
```bash
1. Appuyer sur F12
2. Aller dans l'onglet Console
3. Vérifier qu'il n'y a pas d'erreur en rouge
4. Changer de langue (FR → EN → ES)
5. Vérifier qu'aucune erreur n'apparaît
```

---

### **2. Test de Persistance**

**Scénario** :
1. Aller sur http://localhost:3000
2. Changer la langue en **EN**
3. Naviguer sur plusieurs pages
4. Recharger la page (F5)
5. ✅ Vérifier que la langue reste **EN**
6. Fermer le navigateur
7. Rouvrir et aller sur http://localhost:3000
8. ✅ Vérifier que la langue est toujours **EN**

---

### **3. Test de Changement Dynamique**

**Scénario** :
1. Aller sur une page (ex: /about)
2. Changer la langue : FR → EN
3. ✅ Vérifier que **tous** les textes changent immédiatement
4. Changer en ES
5. ✅ Vérifier que **tous** les textes changent en espagnol
6. Revenir en FR
7. ✅ Vérifier le retour au français

---

### **4. Test des Notifications Toast**

**Scénario** :
1. Se connecter en tant qu'admin
2. Aller sur /admin
3. Essayer d'exporter des données
4. ✅ Vérifier que le message toast est traduit
5. Changer de langue
6. Refaire une action qui génère un toast
7. ✅ Vérifier que le nouveau toast est dans la nouvelle langue

---

### **5. Test des Messages d'Erreur**

**Scénario** :
1. Aller sur /traceability/invalid-id
2. ✅ Vérifier que "Non trouvé" est traduit
3. Changer de langue en EN
4. ✅ Vérifier que "Not found" s'affiche
5. Changer en ES
6. ✅ Vérifier que "No encontrado" s'affiche

---

## 📊 Rapport de Test

### **Template de Rapport**

```markdown
## Test du [DATE] - [HEURE]

### Navigateur : [Chrome/Firefox/Safari/Edge]
### Testeur : [Nom]

#### ✅ Pages Testées : [X/43]
#### ❌ Erreurs Trouvées : [X]

### Détails des Tests

| Page | FR | EN | ES | Erreurs |
|------|----|----|----|----|
| Home | ✅ | ✅ | ✅ | Aucune |
| About | ✅ | ✅ | ✅ | Aucune |
| Projects | ✅ | ✅ | ✅ | Aucune |
| ... | ... | ... | ... | ... |

### Problèmes Identifiés
1. [Description du problème]
2. [Description du problème]

### Recommandations
1. [Recommandation]
2. [Recommandation]
```

---

## 🚀 Tests Rapides (5 minutes)

Pour un test rapide, vérifier ces **10 pages critiques** :

1. ✅ **/** - Home
2. ✅ **/about** - À propos
3. ✅ **/projects** - Projets
4. ✅ **/marketplace** - Marketplace
5. ✅ **/cart** - Panier
6. ✅ **/checkout** - Checkout
7. ✅ **/dashboard** - Dashboard
8. ✅ **/profile** - Profil
9. ✅ **/admin** - Admin
10. ✅ **/page-404** - Page 404

**Pour chaque page** :
1. Charger la page en FR
2. Changer en EN (vérifier les changements)
3. Changer en ES (vérifier les changements)
4. Retour en FR

---

## 📱 Tests Cross-Browser

### **Navigateurs à Tester** :
- [ ] **Chrome** (Windows/Mac)
- [ ] **Firefox** (Windows/Mac)
- [ ] **Safari** (Mac)
- [ ] **Edge** (Windows)
- [ ] **Mobile Chrome** (iOS/Android)
- [ ] **Mobile Safari** (iOS)

---

## 🐛 Que Faire en Cas d'Erreur ?

### **Texte non traduit trouvé** :
1. Identifier la page et le texte
2. Ouvrir `client/src/i18n.js`
3. Vérifier si la clé existe pour les 3 langues
4. Si manquante, l'ajouter
5. Dans la page, remplacer le texte par `t('cle.de.traduction')`

### **Erreur de compilation** :
1. Vérifier la console serveur (terminal)
2. Corriger l'erreur indiquée
3. Le serveur redémarre automatiquement

### **Langue ne change pas** :
1. Vider le cache du navigateur (Ctrl+Shift+Del)
2. Supprimer localStorage : F12 → Application → Local Storage → Supprimer
3. Recharger la page

---

## ✅ Critères de Succès

Le test est **réussi** si :
- ✅ **100%** des textes visibles changent de langue
- ✅ **0 erreur** dans la console
- ✅ La langue **persiste** après rechargement
- ✅ Les **notifications toast** sont traduites
- ✅ Les **messages d'erreur** sont traduits
- ✅ Les **formulaires** sont traduits
- ✅ Le **footer** est traduit
- ✅ La **navigation** est traduite

---

## 📞 Support

En cas de problème :
1. Consulter `TRADUCTIONS_COMPLETEES.md`
2. Consulter `VERIFICATION_TRADUCTIONS_COMPLETE.md`
3. Vérifier les logs du serveur
4. Vérifier la console browser (F12)

---

**Créé par:** Cascade AI  
**Date:** 18 octobre 2025  
**Version:** 1.0  
**Status:** ✅ **PRÊT POUR LES TESTS**
