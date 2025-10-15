# Guide de Vérification des Traductions Admin

## Checklist de Vérification Visuelle

### 🎯 En-tête du Dashboard

| Élément | Traduction Correcte |
|---------|-------------------|
| Titre principal | ✅ "Tableau de Bord Administrateur" |
| Sous-titre | ✅ "Vue d'ensemble, actions rapides et analytiques de la plateforme" |
| Bouton Utilisateurs | ✅ "Utilisateurs" |
| Bouton Produits | ✅ "Produits" |

### 📊 Cartes KPI (Indicateurs)

| Carte | Libellé Attendu |
|-------|----------------|
| Carte 1 | ✅ "Utilisateurs" |
| Carte 2 | ✅ "Projets" |
| Carte 3 | ✅ "Commandes" |
| Carte 4 | ✅ "Projets Validés" |
| Carte 5 | ✅ "Total Investi (USD)" |
| Carte 6 | ✅ "Revenus Marketplace (USD)" |

### 🗣️ Section Communication Globale

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre section | ✅ "Communication Globale" |
| Label Type | ✅ "Type" |
| Option Message privé | ✅ "Message Privé (boîte de réception)" |
| Option Annonce | ✅ "Annonce (notification)" |
| Label Portée | ✅ "Portée" |
| Option Tous | ✅ "Tous les Utilisateurs" |
| Option Par rôle | ✅ "Par Rôle" |
| Option Par IDs | ✅ "Par Identifiants Utilisateurs" |
| Checkbox | ✅ "Inclure les Administrateurs" |
| Label Rôles | ✅ "Rôles Cibles" |
| Label IDs | ✅ "Identifiants Utilisateurs Cibles (séparés par virgule)" |
| Label Sujet | ✅ "Sujet" |
| Label Titre | ✅ "Titre" |
| Label Contenu | ✅ "Contenu" |
| Label Message | ✅ "Message" |
| Bouton Envoyer privé | ✅ "Envoyer un Message Privé" |
| Bouton Publier | ✅ "Publier l'Annonce" |
| Bouton Réinitialiser | ✅ "Réinitialiser" |
| État envoi | ✅ "Envoi en cours..." |

### 📊 Section Exports & Rapports

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre | ✅ "Exportations et Rapports" |
| Sous-titre | ✅ "Téléchargez les Données au Format CSV pour Analyse" |
| Bouton Utilisateurs | ✅ "Utilisateurs" |
| Bouton Projets | ✅ "Projets" |
| Bouton Investissements | ✅ "Investissements" |
| Bouton Commandes | ✅ "Commandes" |

### 📈 Section Analytics

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre principal | ✅ "Analytiques et Métriques Clés" |
| Graphique 1 | ✅ "Répartition des Utilisateurs" |
| Graphique 2 | ✅ "Statut des Projets" |
| Graphique 3 | ✅ "Comparaison Investissements contre Revenus" |

### 🎬 Section Vidéo

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre section | ✅ "Vidéo Explicative des Projets" |
| Label titre vidéo | ✅ "Titre de la Vidéo" |
| Label URL | ✅ "URL de la Vidéo (YouTube, Vimeo, etc.)" |
| Placeholder titre | ✅ "Titre de la vidéo explicative" |
| Placeholder URL | ✅ "https://www.youtube.com/embed/..." |
| Bouton sauvegarder | ✅ "Enregistrer la Vidéo" |

### 📋 Section Projets en Attente

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre | ✅ "Projets en Attente de Validation" |
| Placeholder notes | ✅ "Notes de validation (optionnel)" |
| Bouton approuver | ✅ "Approuver" |
| Bouton rejeter | ✅ "Rejeter" |
| Message vide | ✅ "Aucun Projet en Attente" |
| Bouton précédent | ✅ "Précédent" |
| Label page | ✅ "Page" |
| Bouton suivant | ✅ "Suivant" |

### 📊 Sections Activité Récente

| Élément | Traduction Attendue |
|---------|-------------------|
| Titre projets | ✅ "Activité Récente – Projets" |
| Titre investissements | ✅ "Activité Récente – Investissements" |
| Message vide | ✅ "Aucune Activité Récente" |

### 🔔 Messages Toast (Notifications)

| Type | Message Attendu |
|------|----------------|
| Projet mis à jour | ✅ "Projet Mis à Jour" |
| Action échouée | ✅ "Action Échouée" |
| Messages envoyés | ✅ "Messages Privés Envoyés" |
| Échec envoi messages | ✅ "Échec de l'Envoi des Messages Privés" |
| Annonce envoyée | ✅ "Annonce Envoyée" |
| Échec annonce | ✅ "Échec de l'Envoi de l'Annonce" |
| Contenu requis | ✅ "Contenu Requis" |
| Message requis | ✅ "Message Requis" |
| Export réussi | ✅ "Exportation Réussie" |
| Export échoué | ✅ "Échec de l'Exportation" |
| Champs requis | ✅ "Veuillez Remplir Tous les Champs" |
| Vidéo mise à jour | ✅ "Vidéo Mise à Jour avec Succès" |
| Erreur vidéo | ✅ "Erreur lors de la Mise à Jour de la Vidéo" |

## 🧪 Scénarios de Test

### Test 1 : Communication Globale
1. Accéder au dashboard admin
2. Localiser la section "Communication Globale"
3. Vérifier tous les labels des champs
4. Tester l'envoi d'un message privé
5. Vérifier le message toast de confirmation

### Test 2 : Exports
1. Cliquer sur chaque bouton d'export
2. Vérifier les messages de succès/erreur
3. S'assurer que les labels sont en français

### Test 3 : Validation de Projets
1. Accéder à la section "Projets en Attente de Validation"
2. Vérifier le titre et les boutons
3. Tester l'approbation d'un projet
4. Vérifier le message de confirmation

### Test 4 : Section Vidéo
1. Localiser "Vidéo Explicative des Projets"
2. Vérifier tous les labels
3. Tester la sauvegarde
4. Vérifier les messages d'erreur/succès

### Test 5 : Analytics
1. Vérifier le titre "Analytiques et Métriques Clés"
2. Contrôler les titres des graphiques
3. S'assurer qu'il n'y a pas de termes en anglais

## ❌ Erreurs à Éviter

| ❌ Incorrect | ✅ Correct |
|-------------|-----------|
| "Admin Dashboard" | "Tableau de Bord Administrateur" |
| "Analytics & Métriques" | "Analytiques et Métriques Clés" |
| "Investissements vs Revenus" | "Investissements contre Revenus" |
| "IDs utilisateurs" | "Identifiants Utilisateurs" |
| "Message privé (inbox)" | "Message Privé (boîte de réception)" |
| "Envoi..." | "Envoi en cours..." |
| "Export réussi" | "Exportation Réussie" |
| "Vidéo explicative du projet" | "Vidéo Explicative des Projets" |

## 🎨 Style de Capitalisation

### Règles Appliquées
1. **Titres de sections** : Capitalisation de chaque mot principal
   - Exemple : "Tableau de Bord Administrateur"

2. **Labels de formulaires** : Capitalisation des mots importants
   - Exemple : "Rôles Cibles", "Identifiants Utilisateurs"

3. **Boutons d'action** : Capitalisation du premier mot et mots importants
   - Exemple : "Envoyer un Message Privé", "Publier l'Annonce"

4. **Messages de statut** : Capitalisation cohérente
   - Exemple : "Projet Mis à Jour", "Exportation Réussie"

## 📱 Points d'Attention Mobile

Vérifier que les traductions plus longues ne causent pas de problèmes sur mobile :
- "Identifiants Utilisateurs Cibles (séparés par virgule)"
- "Téléchargez les Données au Format CSV pour Analyse"
- "Comparaison Investissements contre Revenus"

## ✅ Validation Finale

- [ ] Tous les textes sont en français (pas d'anglicismes)
- [ ] La capitalisation est cohérente
- [ ] Les messages sont clairs et professionnels
- [ ] Aucune duplication de traductions
- [ ] Les placeholders sont appropriés
- [ ] Les messages d'erreur sont explicites
- [ ] La navigation est bien traduite
- [ ] Les tooltips (si présents) sont traduits

## 🔄 Prochaines Étapes

1. Redémarrer le serveur client
2. Se connecter en tant qu'admin
3. Parcourir toutes les sections du dashboard
4. Cocher chaque élément de cette checklist
5. Signaler toute anomalie trouvée
