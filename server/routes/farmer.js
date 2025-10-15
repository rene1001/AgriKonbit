const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireFarmer } = require('../middleware/auth');
const router = express.Router();

// Get farmer dashboard statistics
router.get('/stats/dashboard', authenticateToken, requireFarmer, async (req, res) => {
  try {
    // Projects statistics
    const [projectStats] = await query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'validated' THEN 1 ELSE 0 END) as validated_projects,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_projects,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_projects,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_projects,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
        COALESCE(SUM(funded_amount_gyt), 0) as total_funded_gyt,
        COALESCE(SUM(funded_amount_usd), 0) as total_funded_usd
      FROM projects
      WHERE farmer_id = ?
    `, [req.user.id]);

    // Products statistics
    const [productStats] = await query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_products,
        COALESCE(SUM(stock), 0) as total_stock
      FROM products
      WHERE farmer_id = ?
    `, [req.user.id]);

    // Orders statistics (as seller)
    const [orderStats] = await query(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN o.status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN o.status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
        COALESCE(SUM(oi.total_gyt), 0) as total_revenue_gyt,
        COALESCE(SUM(oi.total_usd), 0) as total_revenue_usd
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.farmer_id = ?
    `, [req.user.id]);

    // Investors who funded projects
    const [investorStats] = await query(`
      SELECT 
        COUNT(DISTINCT i.investor_id) as total_investors,
        COUNT(*) as total_investments
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE p.farmer_id = ? AND i.status = 'completed'
    `, [req.user.id]);

    // Wallet balance
    const [wallet] = await query(`
      SELECT 
        COALESCE(gyt_balance, 0) as gyt_balance,
        COALESCE(total_deposited_gyt, 0) as total_deposited_gyt,
        COALESCE(total_spent_gyt, 0) as total_spent_gyt
      FROM user_wallets
      WHERE user_id = ?
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        projects: projectStats,
        products: productStats,
        orders: orderStats,
        investors: investorStats,
        wallet: wallet || { gyt_balance: 0, total_deposited_gyt: 0, total_spent_gyt: 0 }
      }
    });

  } catch (error) {
    console.error('Get farmer dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get farmer orders (products sold)
router.get('/orders', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE p.farmer_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    const orders = await query(`
      SELECT DISTINCT
        o.id,
        o.order_number,
        o.total_usd,
        o.total_gyt,
        o.payment_method,
        o.status,
        o.created_at,
        o.updated_at,
        u.full_name as customer_name,
        u.email as customer_email,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    const [countResult] = await query(`
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order details with items
router.get('/orders/:id', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orders = await query(`
      SELECT DISTINCT o.*
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND p.farmer_id = ?
      LIMIT 1
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items for this farmer only
    const items = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        CAST(p.images AS CHAR) as product_images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ? AND p.farmer_id = ?
    `, [id, req.user.id]);

    // Get customer info
    const [customer] = await query(`
      SELECT full_name, email, phone
      FROM users
      WHERE id = ?
    `, [order.user_id]);

    res.json({
      success: true,
      data: {
        ...order,
        items,
        customer
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// Update order status (farmer can update their orders)
router.patch('/orders/:id/status', authenticateToken, requireFarmer, [
  body('status').isIn(['shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    // Verify order belongs to farmer's products
    const orders = await query(`
      SELECT DISTINCT o.id, o.status
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND p.farmer_id = ?
      LIMIT 1
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
    const values = [status];

    if (trackingNumber) {
      updateFields.push('tracking_number = ?');
      values.push(trackingNumber);
    }

    values.push(id);

    await query(`
      UPDATE orders 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, values);

    // Create notification for customer
    await query(`
      INSERT INTO notifications (user_id, type, title, message, reference_type, reference_id)
      VALUES (?, 'order_update', 'Commande mise à jour', ?, 'order', ?)
    `, [
      orders[0].user_id,
      `Votre commande a été mise à jour: ${status}`,
      id
    ]);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get investors who funded farmer's projects
router.get('/investors', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const investors = await query(`
      SELECT 
        u.id,
        u.full_name,
        u.country,
        u.email,
        COUNT(i.id) as investment_count,
        SUM(i.amount_gyt) as total_invested_gyt,
        SUM(i.amount_usd) as total_invested_usd,
        MAX(i.created_at) as last_investment_date
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON i.investor_id = u.id
      WHERE p.farmer_id = ? AND i.status = 'completed'
      GROUP BY u.id
      ORDER BY total_invested_gyt DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, [req.user.id]);

    const [countResult] = await query(`
      SELECT COUNT(DISTINCT i.investor_id) as total
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE p.farmer_id = ? AND i.status = 'completed'
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        investors,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get farmer investors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investors'
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE user_id = ?';
    let params = [req.user.id];

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    const transactions = await query(`
      SELECT *
      FROM transactions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM transactions
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

// Request withdrawal
router.post('/withdraw', authenticateToken, requireFarmer, [
  body('amount').isDecimal({ decimal_digits: '0,4' }).custom(value => parseFloat(value) > 0),
  body('method').isIn(['bank_transfer', 'mobile_money', 'crypto_wallet']),
  body('destination').trim().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, method, destination, notes } = req.body;

    // Check wallet balance
    const [wallet] = await query(`
      SELECT gyt_balance
      FROM user_wallets
      WHERE user_id = ?
    `, [req.user.id]);

    if (!wallet || parseFloat(wallet.gyt_balance) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const result = await transaction(async (connection) => {
      // Create withdrawal request
      const [withdrawalResult] = await connection.execute(`
        INSERT INTO withdrawals (
          user_id, amount_gyt, method, destination, notes, status
        ) VALUES (?, ?, ?, ?, ?, 'pending')
      `, [req.user.id, amount, method, destination, notes || null]);

      // Update wallet (reserve the amount)
      await connection.execute(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance - ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [amount, req.user.id]);

      // Create transaction record
      await connection.execute(`
        INSERT INTO transactions (
          user_id, type, amount_gyt, status, description, reference_type, reference_id
        ) VALUES (?, 'withdrawal', ?, 'pending', ?, 'withdrawal', ?)
      `, [req.user.id, amount, `Retrait via ${method}`, withdrawalResult.insertId]);

      return withdrawalResult.insertId;
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        withdrawalId: result
      }
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal'
    });
  }
});

// Get recent activities
router.get('/activities', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit) || 10;

    // Get recent project updates
    const projectActivities = await query(`
      SELECT 
        'project' as type,
        p.id as reference_id,
        p.title,
        p.status,
        p.updated_at as activity_date
      FROM projects p
      WHERE p.farmer_id = ?
      ORDER BY p.updated_at DESC
      LIMIT ${limitNum}
    `, [req.user.id]);

    // Get recent orders
    const orderActivities = await query(`
      SELECT DISTINCT
        'order' as type,
        o.id as reference_id,
        o.order_number as title,
        o.status,
        o.created_at as activity_date
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.farmer_id = ?
      ORDER BY o.created_at DESC
      LIMIT ${limitNum}
    `, [req.user.id]);

    // Get recent investments received
    const investmentActivities = await query(`
      SELECT 
        'investment' as type,
        i.id as reference_id,
        CONCAT(u.full_name, ' a investi ', i.amount_gyt, ' GYT') as title,
        i.status,
        i.created_at as activity_date
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON i.investor_id = u.id
      WHERE p.farmer_id = ?
      ORDER BY i.created_at DESC
      LIMIT ${limitNum}
    `, [req.user.id]);

    // Combine and sort all activities
    const allActivities = [
      ...projectActivities,
      ...orderActivities,
      ...investmentActivities
    ].sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date))
      .slice(0, limitNum);

    res.json({
      success: true,
      data: allActivities
    });

  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities'
    });
  }
});

// Routes dupliquées supprimées - voir lignes 93-294 pour les routes /orders

// ============================================
// NOUVELLES ROUTES - Demandes de Retrait et Mises à Jour de Projet
// ============================================

// POST /api/farmer/projects/:id/request-withdrawal - Demander le retrait des fonds d'un projet
router.post('/projects/:id/request-withdrawal', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [id, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    const project = projects[0];
    
    // Vérifier que le projet est complètement financé
    if (parseFloat(project.funded_amount_gyt) < parseFloat(project.budget_gyt)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le projet doit être complètement financé avant de demander un retrait' 
      });
    }
    
    // Vérifier que les fonds n'ont pas déjà été retirés
    if (project.funds_withdrawn) {
      return res.status(400).json({ 
        success: false, 
        message: 'Les fonds de ce projet ont déjà été retirés' 
      });
    }
    
    // Vérifier qu'il n'y a pas déjà une demande en attente
    const [existing] = await query(
      'SELECT * FROM project_withdrawal_requests WHERE project_id = ? AND status = "pending"', 
      [id]
    );
    
    if (existing && existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une demande de retrait est déjà en attente pour ce projet' 
      });
    }
    
    // Créer la demande
    const result = await query(`
      INSERT INTO project_withdrawal_requests (project_id, farmer_id, amount_gyt, status)
      VALUES (?, ?, ?, 'pending')
    `, [id, req.user.id, project.funded_amount_gyt]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Demande de retrait envoyée avec succès. Elle sera examinée par un administrateur.',
      data: { requestId: result.insertId } 
    });
  } catch (error) {
    console.error('Request withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Failed to request withdrawal' });
  }
});

// GET /api/farmer/projects/:id/withdrawal-requests - Voir les demandes de retrait d'un projet
router.get('/projects/:id/withdrawal-requests', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [id, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    const requests = await query(`
      SELECT 
        pwr.*,
        approver.full_name as approved_by_name
      FROM project_withdrawal_requests pwr
      LEFT JOIN users approver ON pwr.approved_by = approver.id
      WHERE pwr.project_id = ?
      ORDER BY pwr.created_at DESC
    `, [id]);
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get withdrawal requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests' });
  }
});

// POST /api/farmer/projects/:id/updates - Créer une mise à jour de projet
router.post('/projects/:id/updates', authenticateToken, requireFarmer, [
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('Le titre doit contenir entre 5 et 255 caractères'),
  body('content').trim().isLength({ min: 20 }).withMessage('Le contenu doit contenir au moins 20 caractères'),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, images, isPublic = true } = req.body;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [id, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    const result = await query(`
      INSERT INTO project_updates (project_id, title, content, images, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [id, title, content, JSON.stringify(images || []), isPublic]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Mise à jour publiée avec succès', 
      data: { updateId: result.insertId } 
    });
  } catch (error) {
    console.error('Create project update error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project update' });
  }
});

// GET /api/farmer/projects/:id/updates - Voir toutes les mises à jour d'un projet
router.get('/projects/:id/updates', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [id, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    const updates = await query(`
      SELECT * FROM project_updates 
      WHERE project_id = ?
      ORDER BY created_at DESC
    `, [id]);
    
    res.json({ success: true, data: updates });
  } catch (error) {
    console.error('Get project updates error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project updates' });
  }
});

// PUT /api/farmer/projects/:projectId/updates/:updateId - Modifier une mise à jour
router.put('/projects/:projectId/updates/:updateId', authenticateToken, requireFarmer, [
  body('title').optional().trim().isLength({ min: 5, max: 255 }),
  body('content').optional().trim().isLength({ min: 20 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const { projectId, updateId } = req.params;
    const { title, content, images, isPublic } = req.body;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [projectId, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    // Construire la requête de mise à jour
    const updates = [];
    const params = [];
    
    if (title) {
      updates.push('title = ?');
      params.push(title);
    }
    if (content) {
      updates.push('content = ?');
      params.push(content);
    }
    if (images !== undefined) {
      updates.push('images = ?');
      params.push(JSON.stringify(images));
    }
    if (isPublic !== undefined) {
      updates.push('is_public = ?');
      params.push(isPublic);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucune modification fournie' });
    }
    
    params.push(updateId, projectId);
    
    const result = await query(`
      UPDATE project_updates 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = ? AND project_id = ?
    `, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mise à jour non trouvée' });
    }
    
    res.json({ success: true, message: 'Mise à jour modifiée avec succès' });
  } catch (error) {
    console.error('Update project update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project update' });
  }
});

// DELETE /api/farmer/projects/:projectId/updates/:updateId - Supprimer une mise à jour
router.delete('/projects/:projectId/updates/:updateId', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { projectId, updateId } = req.params;
    
    // Vérifier que le projet appartient à l'agriculteur
    const [projects] = await query(
      'SELECT * FROM projects WHERE id = ? AND farmer_id = ?', 
      [projectId, req.user.id]
    );
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet non trouvé' });
    }
    
    const result = await query(
      'DELETE FROM project_updates WHERE id = ? AND project_id = ?',
      [updateId, projectId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mise à jour non trouvée' });
    }
    
    res.json({ success: true, message: 'Mise à jour supprimée avec succès' });
  } catch (error) {
    console.error('Delete project update error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project update' });
  }
});

module.exports = router;
