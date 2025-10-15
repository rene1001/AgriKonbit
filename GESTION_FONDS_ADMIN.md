# Gestion des Fonds par l'Administrateur - Documentation Complète

## Vue d'ensemble

Le système de gestion des fonds permet à l'administrateur de contrôler tous les aspects financiers de la plateforme AgriKonbit, incluant :
- ✅ Gestion des retraits d'investisseurs
- ✅ Autorisation des retraits de fonds de projet par les agriculteurs
- ✅ Configuration des taux de frais (pourcentages de commission)
- ✅ Distribution des gains aux investisseurs après la fin d'un projet

---

## 🗄️ Structure de la Base de Données

### Nouvelles Tables et Colonnes

#### 1. Table `platform_settings`
Stocke les paramètres globaux de la plateforme.

```sql
CREATE TABLE platform_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00,           -- Frais sur retraits investisseurs
  distribution_fee_pct DECIMAL(5,2) DEFAULT 0.00,         -- Frais sur distribution des retours
  project_withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00,   -- Frais sur retraits de projet
  min_withdrawal_amount DECIMAL(15,4) DEFAULT 10.00,      -- Montant minimum de retrait
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Table `withdrawals` (améliorée)
Gère les demandes de retrait des investisseurs.

**Nouvelles colonnes ajoutées :**
- `fee_amount_gyt` : Montant des frais prélevés
- `fee_percentage` : Pourcentage de frais appliqué
- `net_amount_gyt` : Montant net après déduction des frais

#### 3. Table `project_withdrawal_requests`
Gère les demandes de retrait de fonds de projet par les agriculteurs.

```sql
CREATE TABLE project_withdrawal_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  farmer_id INT NOT NULL,
  amount_gyt DECIMAL(15,4) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  approved_by INT,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Table `investments` (améliorée)
**Nouvelles colonnes pour les retours :**
- `return_status` : ENUM('pending', 'distributed', 'completed')
- `return_amount_gyt` : Montant du retour reçu
- `returned_at` : Date de distribution du retour

#### 5. Table `transactions` (types étendus)
**Nouveaux types de transaction :**
- `return` : Retour sur investissement
- `project_withdrawal` : Retrait de fonds de projet
- `fee` : Frais de plateforme

---

## 🔧 Migrations à Exécuter

### Migration 025 - Système de Retrait Amélioré

```bash
# Exécuter la migration
mysql -u root -p agrikonbit < migrations/025_enhance_withdrawal_system.sql
```

Cette migration ajoute :
- Colonnes de frais aux retraits
- Paramètres de frais à `platform_settings`
- Nouveau type de transaction `fee`

---

## 🌐 API Backend - Routes Administrateur

### 1. Gestion des Frais de Plateforme

#### GET `/api/admin/settings/fees`
Récupère tous les frais configurés.

**Réponse :**
```json
{
  "success": true,
  "data": {
    "withdrawalFeePct": 2.5,
    "distributionFeePct": 1.0,
    "projectWithdrawalFeePct": 3.0,
    "minWithdrawalAmount": 10.0
  }
}
```

#### PUT `/api/admin/settings/fees`
Met à jour les frais de la plateforme.

**Body :**
```json
{
  "withdrawalFeePct": 2.5,
  "distributionFeePct": 1.0,
  "projectWithdrawalFeePct": 3.0,
  "minWithdrawalAmount": 10.0
}
```

---

### 2. Gestion des Retraits d'Investisseurs

#### GET `/api/admin/investor-withdrawals?status=pending&page=1&limit=20`
Liste les demandes de retrait des investisseurs.

**Paramètres :**
- `status` : pending | processing | completed | rejected | all
- `page` : Numéro de page
- `limit` : Nombre d'éléments par page

#### POST `/api/admin/investor-withdrawals/:id/approve`
Approuve une demande de retrait.

**Body :**
```json
{
  "txHash": "0x123...",  // Optionnel
  "notes": "Traité via virement bancaire"  // Optionnel
}
```

**Actions effectuées :**
1. Change le statut à `completed`
2. Met à jour la transaction associée
3. Envoie une notification à l'investisseur

#### POST `/api/admin/investor-withdrawals/:id/reject`
Rejette une demande de retrait.

**Body :**
```json
{
  "notes": "Informations bancaires incorrectes"  // Obligatoire, min 10 caractères
}
```

**Actions effectuées :**
1. Change le statut à `rejected`
2. Rembourse le montant au wallet de l'utilisateur
3. Annule la transaction
4. Envoie une notification à l'investisseur

---

### 3. Gestion des Retraits de Projet (Agriculteurs)

#### GET `/api/admin/withdrawal-requests?status=pending`
Liste les demandes de retrait de fonds de projet.

#### POST `/api/admin/withdrawal-requests/:id/approve`
Approuve le retrait de fonds d'un projet.

**Actions effectuées :**
1. Crédite le wallet de l'agriculteur
2. Crée une transaction `project_withdrawal`
3. Marque le projet comme `funds_withdrawn = TRUE`
4. Change le statut du projet à `completed`

#### POST `/api/admin/withdrawal-requests/:id/reject`
Rejette la demande de retrait.

---

### 4. Distribution des Retours aux Investisseurs

#### POST `/api/admin/projects/:id/distribute-returns`
Distribue les retours sur investissement aux investisseurs.

**Processus :**
1. Vérifie que le projet est `completed` et `funds_withdrawn = TRUE`
2. Récupère tous les investissements avec `return_status = 'pending'`
3. Pour chaque investissement :
   - Calcule le retour brut : `montant_investi * (1 + rendement%)`
   - Applique les frais de distribution : `frais = retour_brut * distribution_fee_pct%`
   - Calcule le retour net : `retour_net = retour_brut - frais`
   - Crédite le wallet de l'investisseur
   - Crée une transaction `return`
   - Crée une transaction `fee` si frais > 0
   - Met à jour `return_status = 'distributed'`
4. Change le statut du projet à `finalized`

**Exemple de calcul :**
```
Investissement : 1000 GYT
Rendement : 15%
Frais de distribution : 1%

Retour brut = 1000 * 1.15 = 1150 GYT
Frais = 1150 * 0.01 = 11.50 GYT
Retour net = 1150 - 11.50 = 1138.50 GYT
```

---

## 💻 Interface Administrateur (Frontend)

### Pages Créées

#### 1. `/admin/platform-fees` - Gestion des Frais
**Composant :** `PlatformFees.js`

**Fonctionnalités :**
- Configuration des 3 types de frais
- Configuration du montant minimum de retrait
- Exemples de calcul en temps réel
- Estimation des revenus de plateforme

**Utilisation :**
1. Accéder à la page
2. Modifier les pourcentages (0-100%)
3. Cliquer sur "Enregistrer les Paramètres"
4. Les changements prennent effet immédiatement

---

#### 2. `/admin/investor-withdrawals` - Retraits Investisseurs
**Composant :** `InvestorWithdrawals.js`

**Fonctionnalités :**
- Liste des demandes de retrait avec filtres
- Affichage du montant brut, frais, et montant net
- Approbation avec hash de transaction optionnel
- Rejet avec raison obligatoire
- Pagination

**Workflow :**
1. Filtrer par statut (En attente, Complétés, Rejetés)
2. Examiner les détails de la demande
3. Cliquer sur "Approuver" ou "Rejeter"
4. Remplir le formulaire modal
5. Confirmer l'action

---

#### 3. `/admin/withdrawal-requests` - Retraits de Projet
**Composant :** `WithdrawalRequests.js`

**Fonctionnalités :**
- Liste des demandes de retrait de projet
- Informations sur le projet et l'agriculteur
- Approbation/rejet avec notes

**Workflow :**
1. Vérifier les informations du projet
2. Valider que le montant correspond au budget
3. Approuver ou rejeter avec justification

---

#### 4. `/admin/distribute-returns` - Distribution des Retours
**Composant :** `DistributeReturns.js`

**Fonctionnalités :**
- Liste des projets complétés prêts pour distribution
- Calcul automatique des retours avec frais
- Confirmation avant distribution
- Affichage du nombre d'investisseurs

**Workflow :**
1. Sélectionner un projet complété
2. Vérifier le calcul de distribution
3. Cliquer sur "Distribuer les Retours"
4. Confirmer dans le modal
5. Le système distribue automatiquement à tous les investisseurs

---

## 🔄 Flux de Travail Complet

### Scénario 1 : Retrait d'un Investisseur

1. **Investisseur** : Demande un retrait de 1000 GYT
2. **Système** : 
   - Vérifie le solde
   - Applique les frais (ex: 2.5% = 25 GYT)
   - Déduit 1000 GYT du wallet
   - Crée une demande avec statut `pending`
3. **Admin** : 
   - Consulte `/admin/investor-withdrawals`
   - Vérifie les informations
   - Approuve la demande
   - Entre le hash de transaction (optionnel)
4. **Système** :
   - Change le statut à `completed`
   - Envoie une notification à l'investisseur
5. **Investisseur** : Reçoit 975 GYT (1000 - 25)

---

### Scénario 2 : Cycle Complet d'un Projet

1. **Agriculteur** : Crée un projet de 5000 GYT avec 15% de rendement
2. **Admin** : Valide le projet
3. **Investisseurs** : Investissent 5000 GYT au total
4. **Agriculteur** : 
   - Projet devient `active`
   - Demande le retrait des fonds
5. **Admin** : 
   - Consulte `/admin/withdrawal-requests`
   - Approuve le retrait
6. **Système** :
   - Applique les frais de retrait de projet (ex: 3% = 150 GYT)
   - Crédite 4850 GYT à l'agriculteur
   - Marque `funds_withdrawn = TRUE`
7. **Agriculteur** : Complète le projet
8. **Admin** :
   - Consulte `/admin/distribute-returns`
   - Clique sur "Distribuer les Retours"
9. **Système** :
   - Calcule pour chaque investisseur :
     - Retour brut = investissement * 1.15
     - Frais = retour brut * 1% (distribution fee)
     - Retour net = retour brut - frais
   - Crédite tous les investisseurs
   - Projet devient `finalized`
10. **Investisseurs** : Reçoivent leurs retours avec gains

**Exemple pour un investisseur ayant investi 1000 GYT :**
- Retour brut : 1000 * 1.15 = 1150 GYT
- Frais (1%) : 11.50 GYT
- Retour net : 1138.50 GYT
- Gain net : 138.50 GYT (13.85%)

---

## 📊 Revenus de la Plateforme

La plateforme génère des revenus via 3 sources :

### 1. Frais de Retrait Investisseur
- Appliqués sur chaque retrait d'investisseur
- Exemple : 2.5% sur 10,000 GYT = 250 GYT

### 2. Frais de Distribution
- Appliqués sur les retours distribués aux investisseurs
- Exemple : 1% sur 50,000 GYT de retours = 500 GYT

### 3. Frais de Retrait de Projet
- Appliqués quand l'agriculteur retire les fonds collectés
- Exemple : 3% sur 30,000 GYT = 900 GYT

**Total potentiel :** 1,650 GYT de revenus

---

## 🔒 Sécurité et Validations

### Backend
- ✅ Authentification requise (JWT)
- ✅ Vérification du rôle admin
- ✅ Validation des montants (positifs, dans les limites)
- ✅ Validation des pourcentages (0-100%)
- ✅ Transactions atomiques (rollback en cas d'erreur)
- ✅ Audit logs pour toutes les actions admin

### Frontend
- ✅ Guards sur les routes admin
- ✅ Validation des formulaires
- ✅ Confirmations modales pour actions critiques
- ✅ Messages d'erreur clairs
- ✅ Affichage des calculs avant confirmation

---

## 🧪 Tests à Effectuer

### 1. Tests de Configuration des Frais
```bash
# Tester la mise à jour des frais
curl -X PUT http://localhost:5000/api/admin/settings/fees \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawalFeePct": 2.5,
    "distributionFeePct": 1.0,
    "projectWithdrawalFeePct": 3.0,
    "minWithdrawalAmount": 10.0
  }'
```

### 2. Tests de Retrait Investisseur
1. Créer un investisseur avec solde
2. Demander un retrait
3. Vérifier que les frais sont calculés correctement
4. Approuver en tant qu'admin
5. Vérifier que le statut change et la notification est envoyée

### 3. Tests de Distribution
1. Créer un projet avec investissements
2. Marquer le projet comme complété
3. Retirer les fonds (agriculteur)
4. Distribuer les retours (admin)
5. Vérifier que chaque investisseur reçoit le bon montant

---

## 📝 Notes Importantes

1. **Frais configurables** : Les administrateurs peuvent ajuster les frais à tout moment
2. **Transparence** : Les utilisateurs voient les frais avant de confirmer
3. **Traçabilité** : Toutes les transactions sont enregistrées avec références
4. **Notifications** : Les utilisateurs sont notifiés à chaque étape
5. **Réversibilité** : Les retraits rejetés remboursent automatiquement l'utilisateur

---

## 🚀 Démarrage Rapide

### 1. Exécuter les Migrations
```bash
mysql -u root -p agrikonbit < migrations/025_enhance_withdrawal_system.sql
```

### 2. Démarrer le Serveur
```bash
cd server
npm start
```

### 3. Démarrer le Client
```bash
cd client
npm start
```

### 4. Accéder à l'Interface Admin
1. Se connecter avec un compte admin
2. Naviguer vers `/admin/platform-fees`
3. Configurer les frais initiaux
4. Tester les autres fonctionnalités

---

## 📞 Support

Pour toute question ou problème :
- Consulter les logs serveur : `server/logs/`
- Vérifier la console navigateur pour les erreurs frontend
- Consulter la documentation API complète

---

**Date de création :** 14 octobre 2025  
**Version :** 1.0.0  
**Statut :** ✅ Implémentation complète
