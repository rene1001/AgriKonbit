# 🚀 Plan d'Implémentation - Nouvelles Fonctionnalités

## 📋 Vue d'Ensemble

Ce document détaille le plan d'implémentation pour les nouvelles fonctionnalités demandées.

---

## ✅ Fonctionnalités Existantes

### 1. Barre de Progression des Projets
**Statut** : ✅ Déjà implémentée
- Calcul : `(funded_amount_gyt / budget_gyt) * 100`
- Mise à jour automatique à chaque investissement
- **Emplacement** : `server/routes/projects.js` ligne 45

### 2. Mises à Jour de Projets
**Statut** : ✅ Partiellement implémentée
- Table `project_updates` existe
- Récupération des updates : `server/routes/projects.js` lignes 130-135
- **À compléter** : Route pour créer des updates

### 3. Retrait de Fonds (Investisseurs)
**Statut** : ✅ Déjà implémentée
- Route : `POST /api/wallet/withdraw`
- **Emplacement** : `server/routes/wallet.js`
- **À ajouter** : Frais de retrait configurables

---

## 🔨 Fonctionnalités à Implémenter

### 1. Frais de Retrait Configurables (Admin)

#### Backend
**Fichier** : `server/routes/admin.js`

```javascript
// GET /api/admin/settings/withdrawal-fee
router.get('/settings/withdrawal-fee', authenticateToken, requireAdmin, async (req, res) => {
  const [settings] = await query('SELECT withdrawal_fee_pct FROM platform_settings WHERE id = 1');
  res.json({ success: true, data: { withdrawalFeePct: settings?.withdrawal_fee_pct || 0 } });
});

// PUT /api/admin/settings/withdrawal-fee
router.put('/settings/withdrawal-fee', authenticateToken, requireAdmin, [
  body('withdrawalFeePct').isDecimal({ decimal_digits: '0,2' }).custom(v => v >= 0 && v <= 100)
], async (req, res) => {
  const { withdrawalFeePct } = req.body;
  await query('UPDATE platform_settings SET withdrawal_fee_pct = ? WHERE id = 1', [withdrawalFeePct]);
  res.json({ success: true, message: 'Frais de retrait mis à jour' });
});
```

#### Migration SQL
**Fichier** : `migrations/018_add_withdrawal_fee.sql`

```sql
-- Ajouter colonne pour frais de retrait
ALTER TABLE platform_settings 
ADD COLUMN withdrawal_fee_pct DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pourcentage de frais sur les retraits';

-- Initialiser à 0%
UPDATE platform_settings SET withdrawal_fee_pct = 0.00 WHERE id = 1;
```

#### Frontend (Admin Dashboard)
**Fichier** : `client/src/pages/Admin/AdminDashboard.js`

Ajouter une section :
```jsx
<div className="bg-white border rounded-xl p-6">
  <h2 className="font-semibold mb-4">⚙️ Paramètres de Retrait</h2>
  <div>
    <label>Frais de retrait (%)</label>
    <input 
      type="number" 
      step="0.01" 
      min="0" 
      max="100"
      value={withdrawalFee}
      onChange={(e) => setWithdrawalFee(e.target.value)}
    />
    <button onClick={handleUpdateWithdrawalFee}>Enregistrer</button>
  </div>
</div>
```

---

### 2. Demande de Retrait de Fonds de Projet (Agriculteur)

#### Backend
**Fichier** : `server/routes/farmer.js`

```javascript
// POST /api/farmer/projects/:id/request-withdrawal
router.post('/projects/:id/request-withdrawal', authenticateToken, requireFarmer, async (req, res) => {
  const { id } = req.params;
  
  // Vérifier que le projet appartient à l'agriculteur
  const [project] = await query('SELECT * FROM projects WHERE id = ? AND farmer_id = ?', [id, req.user.id]);
  
  if (!project) {
    return res.status(404).json({ success: false, message: 'Projet non trouvé' });
  }
  
  // Vérifier que le projet est complètement financé
  if (project.funded_amount_gyt < project.budget_gyt) {
    return res.status(400).json({ success: false, message: 'Projet pas encore complètement financé' });
  }
  
  // Vérifier qu'il n'y a pas déjà une demande en attente
  const [existing] = await query(
    'SELECT * FROM project_withdrawal_requests WHERE project_id = ? AND status = "pending"', 
    [id]
  );
  
  if (existing) {
    return res.status(400).json({ success: false, message: 'Une demande est déjà en attente' });
  }
  
  // Créer la demande
  const result = await query(`
    INSERT INTO project_withdrawal_requests (project_id, farmer_id, amount_gyt, status)
    VALUES (?, ?, ?, 'pending')
  `, [id, req.user.id, project.funded_amount_gyt]);
  
  res.json({ success: true, message: 'Demande de retrait envoyée', data: { requestId: result.insertId } });
});
```

#### Migration SQL
**Fichier** : `migrations/019_project_withdrawal_requests.sql`

```sql
CREATE TABLE IF NOT EXISTS project_withdrawal_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  farmer_id INT NOT NULL,
  amount_gyt DECIMAL(15,4) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_notes TEXT,
  approved_by INT,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (farmer_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  INDEX idx_project (project_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3. Approbation de Retrait (Admin)

#### Backend
**Fichier** : `server/routes/admin.js`

```javascript
// GET /api/admin/withdrawal-requests
router.get('/withdrawal-requests', authenticateToken, requireAdmin, async (req, res) => {
  const requests = await query(`
    SELECT 
      pwr.*,
      p.title as project_title,
      u.full_name as farmer_name,
      u.email as farmer_email
    FROM project_withdrawal_requests pwr
    JOIN projects p ON pwr.project_id = p.id
    JOIN users u ON pwr.farmer_id = u.id
    WHERE pwr.status = 'pending'
    ORDER BY pwr.created_at DESC
  `);
  
  res.json({ success: true, data: requests });
});

// POST /api/admin/withdrawal-requests/:id/approve
router.post('/withdrawal-requests/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  
  await transaction(async (conn) => {
    // Récupérer la demande
    const [request] = await conn.execute(
      'SELECT * FROM project_withdrawal_requests WHERE id = ?', 
      [id]
    );
    
    if (!request || request.status !== 'pending') {
      throw new Error('Demande invalide');
    }
    
    // Approuver la demande
    await conn.execute(`
      UPDATE project_withdrawal_requests 
      SET status = 'approved', approved_by = ?, approved_at = NOW(), admin_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, id]);
    
    // Créditer le compte de l'agriculteur
    await conn.execute(`
      UPDATE user_wallets 
      SET gyt_balance = gyt_balance + ?
      WHERE user_id = ?
    `, [request.amount_gyt, request.farmer_id]);
    
    // Créer une transaction
    await conn.execute(`
      INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
      VALUES (?, 'project_withdrawal', ?, 'completed', ?, 'project', ?)
    `, [request.farmer_id, request.amount_gyt, 'Retrait de fonds du projet approuvé', request.project_id]);
    
    // Marquer le projet comme clôturé
    await conn.execute(`
      UPDATE projects SET status = 'completed' WHERE id = ?
    `, [request.project_id]);
  });
  
  res.json({ success: true, message: 'Retrait approuvé' });
});

// POST /api/admin/withdrawal-requests/:id/reject
router.post('/withdrawal-requests/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  
  await query(`
    UPDATE project_withdrawal_requests 
    SET status = 'rejected', approved_by = ?, approved_at = NOW(), admin_notes = ?
    WHERE id = ?
  `, [req.user.id, notes, id]);
  
  res.json({ success: true, message: 'Retrait rejeté' });
});
```

---

### 4. Suivi de Commandes (Investisseur/Consommateur)

#### Backend
**Fichier** : `server/routes/orders.js`

```javascript
// GET /api/orders/:id/tracking
router.get('/:id/tracking', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  const [order] = await query(`
    SELECT 
      o.*,
      u.full_name as customer_name,
      u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ? AND o.user_id = ?
  `, [id, req.user.id]);
  
  if (!order) {
    return res.status(404).json({ success: false, message: 'Commande non trouvée' });
  }
  
  // Récupérer les articles
  const items = await query(`
    SELECT 
      oi.*,
      p.name as product_name,
      p.images
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [id]);
  
  // Récupérer l'historique de statut
  const statusHistory = await query(`
    SELECT * FROM order_status_history 
    WHERE order_id = ? 
    ORDER BY created_at ASC
  `, [id]);
  
  res.json({ 
    success: true, 
    data: { 
      order, 
      items, 
      statusHistory 
    } 
  });
});

// POST /api/orders/:id/confirm-delivery
router.post('/:id/confirm-delivery', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  await transaction(async (conn) => {
    // Vérifier que la commande appartient à l'utilisateur
    const [order] = await conn.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (!order || order.status !== 'shipped') {
      throw new Error('Commande non éligible pour confirmation');
    }
    
    // Mettre à jour le statut
    await conn.execute(
      'UPDATE orders SET status = "delivered", updated_at = NOW() WHERE id = ?', 
      [id]
    );
    
    // Ajouter à l'historique
    await conn.execute(`
      INSERT INTO order_status_history (order_id, status, notes)
      VALUES (?, 'delivered', 'Confirmé par le client')
    `, [id]);
  });
  
  res.json({ success: true, message: 'Livraison confirmée' });
});
```

#### Migration SQL
**Fichier** : `migrations/020_order_status_history.sql`

```sql
CREATE TABLE IF NOT EXISTS order_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer l'historique pour les commandes existantes
INSERT INTO order_status_history (order_id, status, created_at)
SELECT id, status, created_at FROM orders;
```

---

### 5. Création de Mises à Jour de Projet (Agriculteur)

#### Backend
**Fichier** : `server/routes/farmer.js`

```javascript
// POST /api/farmer/projects/:id/updates
router.post('/projects/:id/updates', authenticateToken, requireFarmer, [
  body('title').trim().isLength({ min: 5, max: 255 }),
  body('content').trim().isLength({ min: 20 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  const { id } = req.params;
  const { title, content, images, isPublic = true } = req.body;
  
  // Vérifier que le projet appartient à l'agriculteur
  const [project] = await query(
    'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
    [id, req.user.id]
  );
  
  if (!project) {
    return res.status(404).json({ success: false, message: 'Projet non trouvé' });
  }
  
  const result = await query(`
    INSERT INTO project_updates (project_id, title, content, images, is_public)
    VALUES (?, ?, ?, ?, ?)
  `, [id, title, content, JSON.stringify(images || []), isPublic]);
  
  res.status(201).json({ 
    success: true, 
    message: 'Mise à jour publiée', 
    data: { updateId: result.insertId } 
  });
});
```

---

### 6. Remboursement des Investisseurs

#### Backend
**Fichier** : `server/routes/admin.js`

```javascript
// POST /api/admin/projects/:id/distribute-returns
router.post('/projects/:id/distribute-returns', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  await transaction(async (conn) => {
    // Récupérer le projet
    const [project] = await conn.execute('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project || project.status !== 'completed') {
      throw new Error('Projet non éligible pour distribution');
    }
    
    // Récupérer tous les investissements
    const investments = await conn.execute(`
      SELECT * FROM investments 
      WHERE project_id = ? AND status = 'completed'
    `, [id]);
    
    // Calculer le total investi
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount_gyt), 0);
    
    // Pour chaque investisseur
    for (const investment of investments) {
      const investmentAmount = parseFloat(investment.amount_gyt);
      const returnPct = parseFloat(project.estimated_return_pct);
      const returnAmount = investmentAmount * (1 + returnPct / 100);
      
      // Créditer le compte de l'investisseur
      await conn.execute(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance + ?
        WHERE user_id = ?
      `, [returnAmount, investment.investor_id]);
      
      // Créer une transaction
      await conn.execute(`
        INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
        VALUES (?, 'return', ?, 'completed', ?, 'investment', ?)
      `, [
        investment.investor_id, 
        returnAmount, 
        `Retour sur investissement - Projet: ${project.title}`, 
        investment.id
      ]);
      
      // Marquer l'investissement comme retourné
      await conn.execute(`
        UPDATE investments SET status = 'returned', updated_at = NOW() WHERE id = ?
      `, [investment.id]);
    }
    
    // Marquer le projet comme finalisé
    await conn.execute(`
      UPDATE projects SET status = 'finalized', updated_at = NOW() WHERE id = ?
    `, [id]);
  });
  
  res.json({ success: true, message: 'Retours distribués aux investisseurs' });
});
```

---

## 📊 Résumé des Fichiers à Créer/Modifier

### Migrations SQL
1. ✅ `migrations/018_add_withdrawal_fee.sql`
2. ✅ `migrations/019_project_withdrawal_requests.sql`
3. ✅ `migrations/020_order_status_history.sql`

### Backend (Routes)
1. ✅ `server/routes/admin.js` - Ajouter routes pour frais, approbations, distribution
2. ✅ `server/routes/farmer.js` - Ajouter routes pour demandes de retrait et updates
3. ✅ `server/routes/orders.js` - Ajouter routes pour suivi et confirmation
4. ✅ `server/routes/wallet.js` - Modifier pour inclure frais de retrait

### Frontend
1. ✅ `client/src/pages/Admin/AdminDashboard.js` - Section paramètres de retrait
2. ✅ `client/src/pages/Admin/WithdrawalRequests.js` - Nouvelle page
3. ✅ `client/src/pages/Farmer/ProjectUpdates.js` - Nouvelle page
4. ✅ `client/src/pages/Consumer/OrderTracking.js` - Améliorer
5. ✅ `client/src/pages/Investor/MyInvestments.js` - Ajouter suivi de retours

---

## 🎯 Ordre d'Implémentation Recommandé

1. **Phase 1** : Migrations SQL (toutes les tables)
2. **Phase 2** : Routes backend (admin, farmer, orders)
3. **Phase 3** : Frontend admin (paramètres + approbations)
4. **Phase 4** : Frontend farmer (demandes + updates)
5. **Phase 5** : Frontend consumer/investor (suivi)
6. **Phase 6** : Tests et validation

---

## ⏱️ Estimation de Temps

- Phase 1 : 30 minutes
- Phase 2 : 2-3 heures
- Phase 3 : 1-2 heures
- Phase 4 : 1-2 heures
- Phase 5 : 1-2 heures
- Phase 6 : 1 heure

**Total estimé** : 6-10 heures de développement

---

Voulez-vous que je commence l'implémentation maintenant ?
