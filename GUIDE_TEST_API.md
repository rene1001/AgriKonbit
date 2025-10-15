# 🧪 Guide de Test des Nouvelles API

## Configuration

### Prérequis
1. Serveur backend démarré : `cd server && npm start`
2. Base de données avec les migrations appliquées
3. Utilisateurs de test créés (admin, farmer, investor)

---

## 🔧 Tests Admin

### 1. Configurer les Frais de Retrait

**GET** - Voir les frais actuels
```bash
curl -X GET http://localhost:5000/api/admin/settings/withdrawal-fee \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**PUT** - Définir les frais à 2.5%
```bash
curl -X PUT http://localhost:5000/api/admin/settings/withdrawal-fee \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "withdrawalFeePct": 2.5,
    "minWithdrawalAmount": 10
  }'
```

### 2. Voir les Demandes de Retrait

**GET** - Demandes en attente
```bash
curl -X GET http://localhost:5000/api/admin/withdrawal-requests?status=pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Approuver une Demande de Retrait

**POST** - Approuver
```bash
curl -X POST http://localhost:5000/api/admin/withdrawal-requests/1/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Demande approuvée, fonds transférés"
  }'
```

### 4. Distribuer les Retours aux Investisseurs

**POST** - Distribuer
```bash
curl -X POST http://localhost:5000/api/admin/projects/1/distribute-returns \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🌾 Tests Farmer

### 1. Demander le Retrait des Fonds d'un Projet

**POST** - Demande de retrait
```bash
curl -X POST http://localhost:5000/api/farmer/projects/1/request-withdrawal \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN"
```

### 2. Voir les Demandes de Retrait d'un Projet

**GET** - Liste des demandes
```bash
curl -X GET http://localhost:5000/api/farmer/projects/1/withdrawal-requests \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN"
```

### 3. Créer une Mise à Jour de Projet

**POST** - Nouvelle mise à jour
```bash
curl -X POST http://localhost:5000/api/farmer/projects/1/updates \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Première récolte réussie !",
    "content": "Nous avons récolté 500kg de tomates cette semaine. La qualité est excellente et nous sommes en avance sur le planning.",
    "images": ["https://example.com/image1.jpg"],
    "isPublic": true
  }'
```

### 4. Voir les Mises à Jour d'un Projet

**GET** - Liste des mises à jour
```bash
curl -X GET http://localhost:5000/api/farmer/projects/1/updates \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN"
```

### 5. Modifier une Mise à Jour

**PUT** - Modifier
```bash
curl -X PUT http://localhost:5000/api/farmer/projects/1/updates/1 \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Première récolte réussie ! (Mise à jour)",
    "content": "Correction: Nous avons récolté 600kg de tomates cette semaine."
  }'
```

### 6. Supprimer une Mise à Jour

**DELETE** - Supprimer
```bash
curl -X DELETE http://localhost:5000/api/farmer/projects/1/updates/1 \
  -H "Authorization: Bearer YOUR_FARMER_TOKEN"
```

---

## 🛒 Tests Orders (Consumer/Investor)

### 1. Voir le Suivi Détaillé d'une Commande

**GET** - Suivi complet
```bash
curl -X GET http://localhost:5000/api/orders/1/tracking \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### 2. Voir l'Historique des Statuts

**GET** - Historique
```bash
curl -X GET http://localhost:5000/api/orders/1/status-history \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### 3. Confirmer la Livraison

**POST** - Confirmer
```bash
curl -X POST http://localhost:5000/api/orders/1/confirm-delivery \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Produits reçus en excellent état, merci !"
  }'
```

### 4. Annuler une Commande

**POST** - Annuler
```bash
curl -X POST http://localhost:5000/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "J'\''ai changé d'\''avis, je ne souhaite plus recevoir cette commande"
  }'
```

---

## 📊 Scénarios de Test Complets

### Scénario 1 : Cycle Complet d'un Projet

```bash
# 1. Farmer crée un projet
POST /api/projects
{
  "title": "Culture de tomates bio",
  "description": "...",
  "budgetUsd": 5000,
  "durationDays": 120,
  "estimatedReturnPct": 15
}

# 2. Admin valide le projet
PATCH /api/admin/projects/1/validate
{ "action": "approve" }

# 3. Investor investit 1000 GYT
POST /api/investments
{
  "projectId": 1,
  "amountGyt": 1000,
  "returnType": "financial"
}

# 4. Projet complètement financé (5000 GYT)
# Status change automatiquement à 'active'

# 5. Farmer demande le retrait
POST /api/farmer/projects/1/request-withdrawal

# 6. Admin approuve
POST /api/admin/withdrawal-requests/1/approve
{ "notes": "Approuvé" }

# 7. Farmer recharge son compte avec capital + bénéfices
# (Manuellement via wallet)

# 8. Admin distribue les retours
POST /api/admin/projects/1/distribute-returns

# 9. Investisseurs reçoivent 1000 * 1.15 = 1150 GYT
```

### Scénario 2 : Suivi de Commande

```bash
# 1. Consumer crée une commande
POST /api/orders
{
  "items": [
    { "productId": 1, "quantity": 2 }
  ],
  "paymentMethod": "gyt_wallet",
  "shippingAddress": {...}
}

# 2. Paiement effectué → status: 'paid'

# 3. Farmer expédie → status: 'shipped'
PATCH /api/orders/1/status
{ "status": "shipped" }

# 4. Consumer suit la commande
GET /api/orders/1/tracking

# 5. Consumer confirme la livraison
POST /api/orders/1/confirm-delivery
{ "notes": "Tout est parfait !" }
```

### Scénario 3 : Mises à Jour de Projet

```bash
# 1. Farmer publie une mise à jour
POST /api/farmer/projects/1/updates
{
  "title": "Semaine 1 : Plantation terminée",
  "content": "Toutes les graines ont été plantées..."
}

# 2. Investors voient la mise à jour
GET /api/projects/1
# Retourne le projet avec toutes les updates

# 3. Farmer publie une autre mise à jour
POST /api/farmer/projects/1/updates
{
  "title": "Semaine 4 : Première pousse",
  "content": "Les plants commencent à pousser..."
}

# 4. Farmer modifie une mise à jour
PUT /api/farmer/projects/1/updates/1
{
  "content": "Correction: 95% des graines ont germé"
}
```

---

## ✅ Vérifications Importantes

### Après Approbation de Retrait
```sql
-- Vérifier que le wallet du farmer a été crédité
SELECT * FROM user_wallets WHERE user_id = FARMER_ID;

-- Vérifier que le projet est marqué comme funds_withdrawn
SELECT funds_withdrawn, withdrawn_at FROM projects WHERE id = PROJECT_ID;

-- Vérifier la transaction
SELECT * FROM transactions 
WHERE user_id = FARMER_ID 
AND type = 'project_withdrawal' 
ORDER BY created_at DESC LIMIT 1;
```

### Après Distribution des Retours
```sql
-- Vérifier que les investisseurs ont été crédités
SELECT u.full_name, uw.gyt_balance 
FROM user_wallets uw
JOIN users u ON uw.user_id = u.id
WHERE u.role = 'investor';

-- Vérifier les investissements
SELECT * FROM investments 
WHERE project_id = PROJECT_ID 
AND return_status = 'distributed';

-- Vérifier que le projet est finalisé
SELECT status FROM projects WHERE id = PROJECT_ID;
-- Devrait être 'finalized'
```

### Après Confirmation de Livraison
```sql
-- Vérifier le statut de la commande
SELECT status, delivery_confirmed_at, delivery_notes 
FROM orders WHERE id = ORDER_ID;

-- Vérifier l'historique
SELECT * FROM order_status_history 
WHERE order_id = ORDER_ID 
ORDER BY created_at;
```

---

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifiez que le token JWT est valide
- Vérifiez que le token n'a pas expiré

### Erreur 403 Forbidden
- Vérifiez que l'utilisateur a le bon rôle (admin, farmer, etc.)

### Erreur 404 Not Found
- Vérifiez que la ressource existe (projet, commande, etc.)
- Vérifiez que l'utilisateur est propriétaire de la ressource

### Erreur 400 Bad Request
- Vérifiez les données envoyées (format JSON, champs requis)
- Lisez le message d'erreur pour plus de détails

---

## 📝 Notes

- Toutes les routes nécessitent une authentification (sauf routes publiques)
- Les montants sont en GYT (token de la plateforme)
- Les dates sont au format ISO 8601
- Les images sont stockées comme URLs (JSON array)

**Le backend est maintenant prêt pour les tests !** 🚀
