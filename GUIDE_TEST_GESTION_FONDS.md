# Guide de Test - Gestion des Fonds Administrateur

## 🎯 Objectif
Tester toutes les fonctionnalités de gestion des fonds implémentées pour l'administrateur.

---

## 📋 Prérequis

### 1. Base de Données
Assurez-vous que la base de données est à jour :

```bash
# Se connecter à MySQL
mysql -u root -p

# Sélectionner la base de données
USE agrikonbit;

# Vérifier que les tables existent
SHOW TABLES LIKE 'platform_settings';
SHOW TABLES LIKE 'project_withdrawal_requests';

# Vérifier les colonnes de withdrawals
DESCRIBE withdrawals;
```

### 2. Exécuter la Migration
Si les colonnes manquent :

```bash
mysql -u root -p agrikonbit < migrations/025_enhance_withdrawal_system.sql
```

### 3. Démarrer les Serveurs

**Terminal 1 - Backend :**
```bash
cd server
npm start
```

**Terminal 2 - Frontend :**
```bash
cd client
npm start
```

---

## 🧪 Tests à Effectuer

### Test 1 : Configuration des Frais de Plateforme

#### Étapes :
1. Se connecter avec un compte **admin**
2. Naviguer vers `/admin/platform-fees`
3. Vérifier l'affichage des paramètres actuels
4. Modifier les valeurs :
   - **Frais de retrait investisseur :** 2.5%
   - **Frais de distribution des retours :** 1.0%
   - **Frais de retrait de projet :** 3.0%
   - **Montant minimum de retrait :** 10 GYT
5. Observer les exemples de calcul se mettre à jour en temps réel
6. Cliquer sur "Enregistrer les Paramètres"
7. Vérifier le message de succès

#### Vérifications :
- ✅ Les exemples de calcul sont corrects
- ✅ L'estimation des revenus s'affiche
- ✅ Les paramètres sont sauvegardés
- ✅ Un toast de succès apparaît

#### Vérification en Base de Données :
```sql
SELECT * FROM platform_settings WHERE id = 1;
```

---

### Test 2 : Retrait d'Investisseur - Workflow Complet

#### Préparation :
1. Créer ou utiliser un compte **investisseur**
2. S'assurer qu'il a un solde (ex: 1000 GYT)

```sql
-- Vérifier/Ajouter du solde
INSERT INTO user_wallets (user_id, gyt_balance) 
VALUES (2, 1000.0000) 
ON DUPLICATE KEY UPDATE gyt_balance = 1000.0000;
```

#### A. Demande de Retrait (Investisseur)

1. Se connecter avec le compte **investisseur**
2. Aller au tableau de bord investisseur
3. Cliquer sur "Retirer des fonds"
4. Remplir le formulaire :
   - **Montant :** 500 GYT
   - **Méthode :** Virement bancaire
   - **Destination :** IBAN FR76 1234 5678 9012 3456 7890 123
   - **Notes :** Test de retrait
5. Observer l'affichage des frais avant confirmation
6. Confirmer la demande
7. Vérifier que le solde est déduit immédiatement

#### Vérifications Investisseur :
- ✅ Le montant brut, frais, et montant net sont affichés
- ✅ Le solde est réduit de 500 GYT
- ✅ Une notification de confirmation apparaît
- ✅ La demande apparaît dans l'historique avec statut "En attente"

#### B. Approbation (Admin)

1. Se connecter avec le compte **admin**
2. Naviguer vers `/admin/investor-withdrawals`
3. Filtrer par "En attente"
4. Localiser la demande de retrait
5. Vérifier les informations :
   - Montant brut : 500 GYT
   - Frais (2.5%) : 12.50 GYT
   - Montant net : 487.50 GYT
6. Cliquer sur "Approuver"
7. Dans le modal :
   - **Hash de transaction (optionnel) :** 0x123abc...
   - **Notes (optionnel) :** Traité via virement bancaire le 14/10/2025
8. Confirmer l'approbation

#### Vérifications Admin :
- ✅ Le statut passe à "Complété"
- ✅ La date de traitement est enregistrée
- ✅ Le nom de l'admin apparaît
- ✅ Un toast de succès apparaît

#### Vérifications en Base de Données :
```sql
-- Vérifier la demande de retrait
SELECT * FROM withdrawals ORDER BY id DESC LIMIT 1;

-- Vérifier les transactions associées
SELECT * FROM transactions 
WHERE reference_type = 'withdrawal' 
ORDER BY id DESC LIMIT 2;

-- Vérifier le solde du wallet
SELECT gyt_balance FROM user_wallets WHERE user_id = 2;
```

#### C. Test de Rejet

1. Créer une nouvelle demande de retrait (investisseur)
2. En tant qu'admin, cliquer sur "Rejeter"
3. Entrer une raison (minimum 10 caractères) :
   - "Informations bancaires incorrectes, veuillez mettre à jour vos coordonnées"
4. Confirmer le rejet

#### Vérifications Rejet :
- ✅ Le statut passe à "Rejeté"
- ✅ Le montant est remboursé au wallet de l'investisseur
- ✅ L'investisseur reçoit une notification avec la raison
- ✅ La transaction est annulée

---

### Test 3 : Retrait de Fonds de Projet (Agriculteur)

#### Préparation :
1. Créer un projet avec statut `active` et des investissements
2. S'assurer que `funded_amount_gyt >= budget_gyt`

```sql
-- Créer un projet test si nécessaire
INSERT INTO projects (farmer_id, title, description, budget_usd, budget_gyt, 
  duration_days, estimated_return_pct, location, category, status, 
  funded_amount_gyt, investor_count)
VALUES (3, 'Projet Test Retrait', 'Test de retrait de fonds', 
  5000, 5000, 90, 15.00, 'Port-au-Prince', 'crops', 'active', 
  5000.0000, 5);
```

#### A. Demande de Retrait (Agriculteur)

1. Se connecter avec le compte **agriculteur**
2. Aller dans "Mes Projets"
3. Sélectionner le projet actif
4. Cliquer sur "Demander le retrait des fonds"
5. Confirmer la demande

#### B. Approbation (Admin)

1. Se connecter avec le compte **admin**
2. Naviguer vers `/admin/withdrawal-requests`
3. Filtrer par "En attente"
4. Examiner la demande :
   - Titre du projet
   - Nom de l'agriculteur
   - Montant demandé : 5000 GYT
   - Budget du projet : 5000 GYT
   - Montant financé : 5000 GYT
5. Cliquer sur "Approuver"
6. Ajouter des notes (optionnel) : "Projet validé, fonds transférés"
7. Confirmer

#### Vérifications :
- ✅ Le wallet de l'agriculteur est crédité (5000 - 3% = 4850 GYT)
- ✅ Une transaction `project_withdrawal` est créée
- ✅ Le projet a `funds_withdrawn = TRUE`
- ✅ Le statut du projet passe à `completed`
- ✅ L'agriculteur reçoit une notification

#### Vérifications en Base de Données :
```sql
-- Vérifier la demande
SELECT * FROM project_withdrawal_requests ORDER BY id DESC LIMIT 1;

-- Vérifier le projet
SELECT id, title, status, funds_withdrawn, withdrawn_at 
FROM projects WHERE id = [project_id];

-- Vérifier le wallet de l'agriculteur
SELECT gyt_balance FROM user_wallets WHERE user_id = 3;

-- Vérifier la transaction
SELECT * FROM transactions 
WHERE type = 'project_withdrawal' 
ORDER BY id DESC LIMIT 1;
```

---

### Test 4 : Distribution des Retours aux Investisseurs

#### Préparation :
Le projet doit être :
- Statut : `completed`
- `funds_withdrawn = TRUE`
- Avoir des investissements avec `return_status = 'pending'`

#### Étapes :

1. Se connecter avec le compte **admin**
2. Naviguer vers `/admin/distribute-returns`
3. Localiser le projet complété
4. Examiner le calcul de distribution :
   - Montant investi total : 5000 GYT
   - Rendement : 15%
   - Retour brut : 5750 GYT
   - Frais de distribution (1%) : 57.50 GYT
   - Retour net à distribuer : 5692.50 GYT
5. Cliquer sur "Distribuer les Retours"
6. Vérifier les informations dans le modal
7. Lire l'avertissement
8. Confirmer la distribution

#### Vérifications :
- ✅ Chaque investisseur reçoit sa part proportionnelle
- ✅ Les frais sont correctement déduits
- ✅ Des transactions `return` sont créées
- ✅ Des transactions `fee` sont créées pour les frais
- ✅ Le statut des investissements passe à `distributed`
- ✅ Le projet passe au statut `finalized`
- ✅ Les investisseurs reçoivent des notifications

#### Vérifications en Base de Données :
```sql
-- Vérifier les investissements
SELECT id, investor_id, amount_gyt, return_status, return_amount_gyt, returned_at
FROM investments 
WHERE project_id = [project_id];

-- Vérifier les transactions de retour
SELECT user_id, type, amount_gyt, description
FROM transactions 
WHERE reference_type = 'investment' 
AND type IN ('return', 'fee')
ORDER BY id DESC;

-- Vérifier les wallets des investisseurs
SELECT u.full_name, uw.gyt_balance
FROM user_wallets uw
JOIN users u ON uw.user_id = u.id
WHERE u.role = 'investor';

-- Vérifier le statut du projet
SELECT id, title, status FROM projects WHERE id = [project_id];
```

#### Calcul Exemple pour un Investisseur :
Si un investisseur a investi **1000 GYT** :
- Retour brut : 1000 × 1.15 = **1150 GYT**
- Frais (1%) : 1150 × 0.01 = **11.50 GYT**
- Retour net : 1150 - 11.50 = **1138.50 GYT**
- Gain net : 1138.50 - 1000 = **138.50 GYT** (13.85%)

---

## 🔍 Tests de Validation

### Test 5 : Validations et Limites

#### A. Montant Minimum de Retrait
1. Configurer le minimum à 10 GYT
2. Tenter un retrait de 5 GYT
3. **Attendu :** Message d'erreur "Le montant minimum de retrait est 10 GYT"

#### B. Solde Insuffisant
1. Tenter un retrait supérieur au solde
2. **Attendu :** Message d'erreur "Solde GYT insuffisant"

#### C. Pourcentages Invalides
1. Tenter de configurer un frais de 150%
2. **Attendu :** Message d'erreur "Le pourcentage doit être entre 0 et 100"

#### D. Rejet sans Raison
1. Tenter de rejeter un retrait sans notes
2. **Attendu :** Message d'erreur "Veuillez fournir une raison (minimum 10 caractères)"

---

## 📊 Tests de Calcul

### Vérifier les Calculs de Frais

#### Scénario 1 : Retrait Investisseur
```
Montant : 1000 GYT
Frais : 2.5%
Calcul : 1000 × 0.025 = 25 GYT
Net : 1000 - 25 = 975 GYT
```

#### Scénario 2 : Distribution
```
Investissement : 2000 GYT
Rendement : 20%
Retour brut : 2000 × 1.20 = 2400 GYT
Frais distribution : 1%
Frais : 2400 × 0.01 = 24 GYT
Net : 2400 - 24 = 2376 GYT
```

#### Scénario 3 : Retrait Projet
```
Montant collecté : 10000 GYT
Frais : 3%
Frais : 10000 × 0.03 = 300 GYT
Net agriculteur : 10000 - 300 = 9700 GYT
```

---

## 🐛 Tests d'Erreurs

### Test 6 : Gestion des Erreurs

#### A. Distribution sur Projet Non Éligible
1. Tenter de distribuer sur un projet sans `funds_withdrawn`
2. **Attendu :** Erreur "Les fonds du projet doivent d'abord être retirés"

#### B. Double Distribution
1. Distribuer les retours d'un projet
2. Tenter de distribuer à nouveau
3. **Attendu :** Erreur "Aucun investissement à rembourser"

#### C. Approbation de Retrait Déjà Traité
1. Approuver un retrait
2. Tenter de l'approuver à nouveau
3. **Attendu :** Erreur "Cette demande a déjà été traitée"

---

## ✅ Checklist Complète

### Backend
- [ ] Migration 025 exécutée avec succès
- [ ] Table `platform_settings` existe avec données par défaut
- [ ] Colonnes de frais ajoutées à `withdrawals`
- [ ] Routes API fonctionnent correctement
- [ ] Validations en place
- [ ] Transactions atomiques (pas d'état incohérent)
- [ ] Notifications envoyées aux utilisateurs

### Frontend
- [ ] Page `/admin/platform-fees` accessible
- [ ] Page `/admin/investor-withdrawals` accessible
- [ ] Page `/admin/withdrawal-requests` accessible
- [ ] Page `/admin/distribute-returns` accessible
- [ ] Routes ajoutées dans `App.js`
- [ ] Calculs affichés correctement
- [ ] Modals de confirmation fonctionnent
- [ ] Messages d'erreur clairs
- [ ] Pagination fonctionne

### Fonctionnalités
- [ ] Configuration des frais sauvegardée
- [ ] Retrait investisseur : demande → approbation → notification
- [ ] Retrait investisseur : demande → rejet → remboursement
- [ ] Retrait projet : demande → approbation → crédit wallet
- [ ] Distribution : calcul → distribution → notifications
- [ ] Frais correctement appliqués partout
- [ ] Transactions enregistrées avec références

---

## 🎓 Résumé des Commandes Utiles

### Vérifier les Données
```sql
-- Paramètres de plateforme
SELECT * FROM platform_settings;

-- Retraits investisseurs
SELECT w.*, u.full_name 
FROM withdrawals w 
JOIN users u ON w.user_id = u.id 
ORDER BY w.created_at DESC LIMIT 10;

-- Retraits de projet
SELECT pwr.*, p.title, u.full_name 
FROM project_withdrawal_requests pwr
JOIN projects p ON pwr.project_id = p.id
JOIN users u ON pwr.farmer_id = u.id
ORDER BY pwr.created_at DESC;

-- Transactions récentes
SELECT t.*, u.full_name 
FROM transactions t
JOIN users u ON t.user_id = u.id
ORDER BY t.created_at DESC LIMIT 20;

-- Investissements avec retours
SELECT i.*, p.title, u.full_name
FROM investments i
JOIN projects p ON i.project_id = p.id
JOIN users u ON i.investor_id = u.id
WHERE i.return_status = 'distributed'
ORDER BY i.returned_at DESC;
```

### Réinitialiser pour Tests
```sql
-- Réinitialiser les frais à 0
UPDATE platform_settings SET 
  withdrawal_fee_pct = 0, 
  distribution_fee_pct = 0, 
  project_withdrawal_fee_pct = 0 
WHERE id = 1;

-- Supprimer les demandes de test
DELETE FROM withdrawals WHERE id > 0;
DELETE FROM project_withdrawal_requests WHERE id > 0;
```

---

## 📞 En Cas de Problème

### Logs à Consulter
- **Backend :** Console du serveur Node.js
- **Frontend :** Console du navigateur (F12)
- **Base de données :** Logs MySQL

### Erreurs Communes

**Erreur : "Table doesn't exist"**
→ Exécuter la migration 025

**Erreur : "Column not found"**
→ Vérifier que toutes les colonnes sont créées avec `DESCRIBE table_name`

**Erreur : "Unauthorized"**
→ Vérifier que vous êtes connecté avec un compte admin

**Calculs incorrects**
→ Vérifier les paramètres dans `platform_settings`

---

**Bonne chance avec les tests ! 🚀**
