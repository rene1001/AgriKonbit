const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireAdmin, requireAdminOrModerator } = require('../middleware/auth');
const { logAdminAction, getAuditLogs } = require('../middleware/auditLog');
const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role != 'admin') as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'farmer') as total_farmers,
        (SELECT COUNT(*) FROM users WHERE role = 'investor') as total_investors,
        (SELECT COUNT(*) FROM users WHERE role = 'consumer') as total_consumers,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'validated') as validated_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'active') as active_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'completed') as completed_projects,
        (SELECT COUNT(*) FROM investments) as total_investments,
        (SELECT SUM(amount_usd) FROM investments WHERE status = 'completed') as total_invested_usd,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT SUM(total_usd) FROM orders WHERE status = 'delivered') as total_revenue_usd
    `);

    // Get recent activity
    const recentProjects = await query(`
      SELECT 
        p.id, p.title, p.status, p.created_at,
        u.full_name as farmer_name
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    const recentInvestments = await query(`
      SELECT 
        i.amount_usd, i.created_at,
        p.title as project_title,
        u.full_name as investor_name
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON i.investor_id = u.id
      ORDER BY i.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        stats: stats[0],
        recentProjects,
        recentInvestments
      }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Change user role (admin-only)
router.patch('/users/:id/role', authenticateToken, requireAdmin, [
  body('role').isIn(['investor','farmer','consumer','moderator'])
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
    const { role } = req.body;

    // Prevent modifying admin accounts via this endpoint
    const users = await query(
      'SELECT id, role FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (users[0].role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot change role for admin users' });
    }

    await query(
      'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [role, id]
    );

    res.json({ success: true, message: 'User role updated successfully' });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
});

// Get products (for moderation)
router.get('/products', authenticateToken, requireAdminOrModerator, async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status === 'active') {
      whereClause += ' AND p.is_active = true';
    } else if (status === 'inactive') {
      whereClause += ' AND p.is_active = false';
    }

    if (category) {
      whereClause += ' AND p.category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const products = await query(`
      SELECT 
        p.id, p.name, p.description, p.price_usd, p.stock, p.category,
        p.origin_country, p.organic_certified, p.is_active, p.created_at,
        u.full_name AS farmer_name, u.email AS farmer_email
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    const countResult = await query(`
      SELECT COUNT(*) AS total
      FROM products p
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
});

// Update product active status
router.patch('/products/:id/status', authenticateToken, requireAdminOrModerator, [
  body('isActive').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    const products = await query('SELECT id FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await query('UPDATE products SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [isActive, id]);

    res.json({ success: true, message: `Product ${isActive ? 'activated' : 'deactivated'} successfully` });

  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product status' });
  }
});

// Get pending projects for validation
router.get('/projects/pending', authenticateToken, requireAdminOrModerator, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const projects = await query(`
      SELECT 
        p.*,
        u.full_name as farmer_name,
        u.email as farmer_email,
        u.country as farmer_country
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
      LIMIT ${limitNum} OFFSET ${offset}
    `);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM projects
      WHERE status = 'pending'
    `);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get pending projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending projects',
      error: error.message
    });
  }
});

// Validate project
router.patch('/projects/:id/validate', authenticateToken, requireAdmin, [
  body('action').isIn(['approve', 'reject']),
  body('notes').optional().trim()
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
    const { action, notes } = req.body;

    // Check if project exists and is pending
    const projects = await query(
      'SELECT id, farmer_id, status FROM projects WHERE id = ?',
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projects[0];

    if (project.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Project is not pending validation'
      });
    }

    const newStatus = action === 'approve' ? 'validated' : 'rejected';

    await query(`
      UPDATE projects 
      SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newStatus, notes || null, id]);

    // Create notification for farmer
    await query(`
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (?, ?, ?, ?, ?)
    `, [
      project.farmer_id,
      `Project ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      `Your project has been ${action === 'approve' ? 'approved and is now live for investment' : 'rejected'}. ${notes ? `Admin notes: ${notes}` : ''}`,
      action === 'approve' ? 'success' : 'error',
      JSON.stringify({ projectId: id, action })
    ]);

    // Log admin action
    await logAdminAction(
      req.user.id,
      `project.${action}`,
      'project',
      id,
      { action, notes, previousStatus: project.status, newStatus },
      req
    );

    res.json({
      success: true,
      message: `Project ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Validate project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate project'
    });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE u.role != "admin"';
    let params = [];

    if (role) {
      whereClause += ' AND u.role = ?';
      params.push(role);
    }

    if (status === 'active') {
      whereClause += ' AND u.is_active = true';
    } else if (status === 'inactive') {
      whereClause += ' AND u.is_active = false';
    }

    const users = await query(`
      SELECT 
        u.id, u.email, u.full_name, u.role, u.kyc_status, 
        u.is_active, u.created_at,
        uw.gyt_balance
      FROM users u
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Update user status
router.patch('/users/:id/status', authenticateToken, requireAdmin, [
  body('isActive').isBoolean()
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
    const { isActive } = req.body;

    // Check if user exists
    const users = await query(
      'SELECT id, email, full_name FROM users WHERE id = ? AND role != "admin"',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await query(
      'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isActive, id]
    );

    // Create notification for user
    await query(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `, [
      id,
      'Account Status Updated',
      `Your account has been ${isActive ? 'activated' : 'deactivated'}`,
      isActive ? 'success' : 'error'
    ]);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get system settings
router.get('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await query(
      'SELECT setting_key, setting_value, description FROM system_settings ORDER BY setting_key'
    );

    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = {
        value: setting.setting_value,
        description: setting.description
      };
    });

    res.json({
      success: true,
      data: settingsObj
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update system settings
router.put('/settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = req.body;

    await transaction(async (connection) => {
      for (const [key, value] of Object.entries(settings)) {
        await connection.execute(
          'UPDATE system_settings SET setting_value = ?, updated_at = CURRENT_TIMESTAMP WHERE setting_key = ?',
          [value, key]
        );
      }
    });

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Get audit logs
router.get('/audit-logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { adminId, actionType, targetType, startDate, endDate, page, limit } = req.query;
    
    const result = await getAuditLogs({
      adminId: adminId ? parseInt(adminId) : null,
      actionType,
      targetType,
      startDate,
      endDate,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// ============================================
// NOUVELLES ROUTES - Gestion des Frais et Retraits
// ============================================

// GET /api/admin/settings/withdrawal-fee
router.get('/settings/withdrawal-fee', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [settings] = await query('SELECT withdrawal_fee_pct, min_withdrawal_amount FROM platform_settings WHERE id = 1');
    
    res.json({ 
      success: true, 
      data: { 
        withdrawalFeePct: settings?.withdrawal_fee_pct || 0,
        minWithdrawalAmount: settings?.min_withdrawal_amount || 10
      } 
    });
  } catch (error) {
    console.error('Get withdrawal fee error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal fee settings' });
  }
});

// PUT /api/admin/settings/withdrawal-fee
router.put('/settings/withdrawal-fee', authenticateToken, requireAdmin, [
  body('withdrawalFeePct').isDecimal({ decimal_digits: '0,2' }).custom(v => parseFloat(v) >= 0 && parseFloat(v) <= 100),
  body('minWithdrawalAmount').optional().isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) >= 0)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { withdrawalFeePct, minWithdrawalAmount } = req.body;
    
    await query(
      'UPDATE platform_settings SET withdrawal_fee_pct = ?, min_withdrawal_amount = ? WHERE id = 1', 
      [withdrawalFeePct, minWithdrawalAmount || 10]
    );
    
    await logAdminAction(req.user.id, 'update_withdrawal_fee', 'platform_settings', 1, 
      `Frais de retrait mis à jour: ${withdrawalFeePct}%, Minimum: ${minWithdrawalAmount || 10} GYT`);
    
    res.json({ success: true, message: 'Frais de retrait mis à jour avec succès' });
  } catch (error) {
    console.error('Update withdrawal fee error:', error);
    res.status(500).json({ success: false, message: 'Failed to update withdrawal fee' });
  }
});

// GET /api/admin/withdrawal-requests - Demandes de retrait de projet
router.get('/withdrawal-requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    
    let whereClause = 'WHERE pwr.status = ?';
    let params = [status];
    
    if (status === 'all') {
      whereClause = 'WHERE 1=1';
      params = [];
    }
    
    const requests = await query(`
      SELECT 
        pwr.*,
        p.title as project_title,
        p.budget_gyt,
        p.funded_amount_gyt,
        u.full_name as farmer_name,
        u.email as farmer_email,
        u.phone as farmer_phone,
        approver.full_name as approved_by_name
      FROM project_withdrawal_requests pwr
      JOIN projects p ON pwr.project_id = p.id
      JOIN users u ON pwr.farmer_id = u.id
      LEFT JOIN users approver ON pwr.approved_by = approver.id
      ${whereClause}
      ORDER BY pwr.created_at DESC
    `, params);
    
    res.json({ success: true, data: requests });
  } catch (error) {
    console.error('Get withdrawal requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests' });
  }
});

// POST /api/admin/withdrawal-requests/:id/approve
router.post('/withdrawal-requests/:id/approve', authenticateToken, requireAdmin, [
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    await transaction(async (conn) => {
      // Récupérer la demande
      const [requests] = await conn.execute(
        'SELECT * FROM project_withdrawal_requests WHERE id = ?', 
        [id]
      );
      
      if (!requests || requests.length === 0) {
        throw new Error('Demande non trouvée');
      }
      
      const request = requests[0];
      
      if (request.status !== 'pending') {
        throw new Error('Cette demande a déjà été traitée');
      }
      
      // Approuver la demande
      await conn.execute(`
        UPDATE project_withdrawal_requests 
        SET status = 'approved', approved_by = ?, approved_at = NOW(), admin_notes = ?
        WHERE id = ?
      `, [req.user.id, notes || null, id]);
      
      // Créditer le compte de l'agriculteur
      await conn.execute(`
        INSERT INTO user_wallets (user_id, gyt_balance, updated_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        gyt_balance = gyt_balance + ?,
        updated_at = NOW()
      `, [request.farmer_id, request.amount_gyt, request.amount_gyt]);
      
      // Créer une transaction
      await conn.execute(`
        INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
        VALUES (?, 'project_withdrawal', ?, 'completed', ?, 'project', ?)
      `, [
        request.farmer_id, 
        request.amount_gyt, 
        'Retrait de fonds du projet approuvé', 
        request.project_id
      ]);
      
      // Marquer le projet comme ayant les fonds retirés
      await conn.execute(`
        UPDATE projects 
        SET funds_withdrawn = TRUE, withdrawn_at = NOW(), status = 'completed'
        WHERE id = ?
      `, [request.project_id]);
    });
    
    await logAdminAction(req.user.id, 'approve_withdrawal', 'project_withdrawal_requests', id, 
      `Demande de retrait approuvée: ${notes || 'Aucune note'}`);
    
    res.json({ success: true, message: 'Demande de retrait approuvée avec succès' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to approve withdrawal' });
  }
});

// POST /api/admin/withdrawal-requests/:id/reject
router.post('/withdrawal-requests/:id/reject', authenticateToken, requireAdmin, [
  body('notes').trim().isLength({ min: 10 }).withMessage('Veuillez fournir une raison pour le rejet (minimum 10 caractères)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const { notes } = req.body;
    
    const result = await query(`
      UPDATE project_withdrawal_requests 
      SET status = 'rejected', approved_by = ?, approved_at = NOW(), admin_notes = ?
      WHERE id = ? AND status = 'pending'
    `, [req.user.id, notes, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée ou déjà traitée' });
    }
    
    await logAdminAction(req.user.id, 'reject_withdrawal', 'project_withdrawal_requests', id, 
      `Demande de retrait rejetée: ${notes}`);
    
    res.json({ success: true, message: 'Demande de retrait rejetée' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject withdrawal' });
  }
});

// POST /api/admin/projects/:id/distribute-returns - Distribution des retours aux investisseurs
router.post('/projects/:id/distribute-returns', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await transaction(async (conn) => {
      // Récupérer le projet
      const [projects] = await conn.execute(
        'SELECT * FROM projects WHERE id = ? AND status = "completed"', 
        [id]
      );
      
      if (!projects || projects.length === 0) {
        throw new Error('Projet non trouvé ou non éligible pour distribution');
      }
      
      const project = projects[0];
      
      // Vérifier que les fonds ont été retirés
      if (!project.funds_withdrawn) {
        throw new Error('Les fonds du projet doivent d\'abord être retirés par l\'agriculteur');
      }
      
      // Récupérer tous les investissements complétés
      const [investments] = await conn.execute(`
        SELECT * FROM investments 
        WHERE project_id = ? AND status = 'completed' AND return_status = 'pending'
      `, [id]);
      
      if (investments.length === 0) {
        throw new Error('Aucun investissement à rembourser');
      }
      
      // Récupérer les frais de distribution
      const [settings] = await conn.execute('SELECT distribution_fee_pct FROM platform_settings WHERE id = 1');
      const distributionFeePct = settings && settings[0] ? parseFloat(settings[0].distribution_fee_pct || 0) : 0;
      
      let totalDistributed = 0;
      let totalFees = 0;
      
      // Pour chaque investisseur
      for (const investment of investments) {
        const investmentAmount = parseFloat(investment.amount_gyt);
        const returnPct = parseFloat(project.estimated_return_pct);
        const grossReturnAmount = investmentAmount * (1 + returnPct / 100);
        
        // Calculer les frais sur le retour
        const feeAmount = grossReturnAmount * (distributionFeePct / 100);
        const netReturnAmount = grossReturnAmount - feeAmount;
        
        // Créditer le compte de l'investisseur
        await conn.execute(`
          INSERT INTO user_wallets (user_id, gyt_balance, updated_at)
          VALUES (?, ?, NOW())
          ON DUPLICATE KEY UPDATE 
          gyt_balance = gyt_balance + ?,
          updated_at = NOW()
        `, [investment.investor_id, netReturnAmount, netReturnAmount]);
        
        // Créer une transaction pour le retour
        await conn.execute(`
          INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
          VALUES (?, 'return', ?, 'completed', ?, 'investment', ?)
        `, [
          investment.investor_id, 
          netReturnAmount, 
          `Retour sur investissement - Projet: ${project.title} (${returnPct}% de rendement, frais: ${distributionFeePct}%)`, 
          investment.id
        ]);
        
        // Créer une transaction pour les frais si applicable
        if (feeAmount > 0) {
          await conn.execute(`
            INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
            VALUES (?, 'fee', ?, 'completed', ?, 'investment', ?)
          `, [
            investment.investor_id, 
            feeAmount, 
            `Frais de distribution (${distributionFeePct}%) - Projet: ${project.title}`, 
            investment.id
          ]);
        }
        
        // Marquer l'investissement comme retourné
        await conn.execute(`
          UPDATE investments 
          SET return_status = 'distributed', return_amount_gyt = ?, returned_at = NOW()
          WHERE id = ?
        `, [netReturnAmount, investment.id]);
        
        totalDistributed += netReturnAmount;
        totalFees += feeAmount;
      }
      
      // Marquer le projet comme finalisé
      await conn.execute(`
        UPDATE projects SET status = 'finalized', updated_at = NOW() WHERE id = ?
      `, [id]);
      
      await logAdminAction(req.user.id, 'distribute_returns', 'projects', id, 
        `Retours distribués: ${totalDistributed.toFixed(4)} GYT à ${investments.length} investisseurs (Frais: ${totalFees.toFixed(4)} GYT)`);
    });
    
    res.json({ success: true, message: 'Retours distribués aux investisseurs avec succès' });
  } catch (error) {
    console.error('Distribute returns error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to distribute returns' });
  }
});

// GET /api/admin/investor-withdrawals - Demandes de retrait des investisseurs
router.get('/investor-withdrawals', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;
    
    let whereClause = 'WHERE 1=1';
    let params = [];
    
    if (status !== 'all') {
      whereClause += ' AND w.status = ?';
      params.push(status);
    }
    
    const withdrawals = await query(`
      SELECT 
        w.*,
        u.full_name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        processor.full_name as processed_by_name
      FROM withdrawals w
      JOIN users u ON w.user_id = u.id
      LEFT JOIN users processor ON w.processed_by = processor.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);
    
    const countResult = await query(`
      SELECT COUNT(*) as total FROM withdrawals w ${whereClause}
    `, params);
    
    res.json({ 
      success: true, 
      data: {
        withdrawals,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get investor withdrawals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch investor withdrawals' });
  }
});

// POST /api/admin/investor-withdrawals/:id/approve
router.post('/investor-withdrawals/:id/approve', authenticateToken, requireAdmin, [
  body('txHash').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { txHash, notes } = req.body;
    
    await transaction(async (conn) => {
      // Récupérer la demande
      const [withdrawals] = await conn.execute(
        'SELECT * FROM withdrawals WHERE id = ?', 
        [id]
      );
      
      if (!withdrawals || withdrawals.length === 0) {
        throw new Error('Demande de retrait non trouvée');
      }
      
      const withdrawal = withdrawals[0];
      
      if (withdrawal.status !== 'pending') {
        throw new Error('Cette demande a déjà été traitée');
      }
      
      // Approuver la demande
      await conn.execute(`
        UPDATE withdrawals 
        SET status = 'completed', processed_by = ?, processed_at = NOW(), 
            tx_hash = ?, admin_notes = ?
        WHERE id = ?
      `, [req.user.id, txHash || null, notes || null, id]);
      
      // Mettre à jour la transaction associée
      await conn.execute(`
        UPDATE transactions 
        SET status = 'completed', tx_hash = ?
        WHERE reference_type = 'withdrawal' AND reference_id = ?
      `, [txHash || null, id]);
      
      // Créer une notification pour l'utilisateur
      await conn.execute(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, ?)
      `, [
        withdrawal.user_id,
        'Retrait approuvé',
        `Votre demande de retrait de ${withdrawal.amount_gyt} GYT a été approuvée et traitée.`,
        'success'
      ]);
    });
    
    await logAdminAction(req.user.id, 'approve_investor_withdrawal', 'withdrawals', id, 
      `Retrait d'investisseur approuvé: ${notes || 'Aucune note'}`);
    
    res.json({ success: true, message: 'Demande de retrait approuvée avec succès' });
  } catch (error) {
    console.error('Approve investor withdrawal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to approve withdrawal' });
  }
});

// POST /api/admin/investor-withdrawals/:id/reject
router.post('/investor-withdrawals/:id/reject', authenticateToken, requireAdmin, [
  body('notes').trim().isLength({ min: 10 }).withMessage('Veuillez fournir une raison pour le rejet (minimum 10 caractères)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const { notes } = req.body;
    
    await transaction(async (conn) => {
      // Récupérer la demande
      const [withdrawals] = await conn.execute(
        'SELECT * FROM withdrawals WHERE id = ?', 
        [id]
      );
      
      if (!withdrawals || withdrawals.length === 0) {
        throw new Error('Demande de retrait non trouvée');
      }
      
      const withdrawal = withdrawals[0];
      
      if (withdrawal.status !== 'pending') {
        throw new Error('Cette demande a déjà été traitée');
      }
      
      // Rejeter la demande
      await conn.execute(`
        UPDATE withdrawals 
        SET status = 'rejected', processed_by = ?, processed_at = NOW(), admin_notes = ?
        WHERE id = ?
      `, [req.user.id, notes, id]);
      
      // Rembourser le montant à l'utilisateur (car il a été déduit lors de la demande)
      await conn.execute(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance + ?, updated_at = NOW()
        WHERE user_id = ?
      `, [withdrawal.amount_gyt, withdrawal.user_id]);
      
      // Mettre à jour la transaction associée
      await conn.execute(`
        UPDATE transactions 
        SET status = 'cancelled'
        WHERE reference_type = 'withdrawal' AND reference_id = ?
      `, [id]);
      
      // Créer une notification pour l'utilisateur
      await conn.execute(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (?, ?, ?, ?)
      `, [
        withdrawal.user_id,
        'Retrait rejeté',
        `Votre demande de retrait de ${withdrawal.amount_gyt} GYT a été rejetée. Raison: ${notes}. Le montant a été remboursé sur votre compte.`,
        'error'
      ]);
    });
    
    await logAdminAction(req.user.id, 'reject_investor_withdrawal', 'withdrawals', id, 
      `Retrait d'investisseur rejeté: ${notes}`);
    
    res.json({ success: true, message: 'Demande de retrait rejetée' });
  } catch (error) {
    console.error('Reject investor withdrawal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to reject withdrawal' });
  }
});

// PUT /api/admin/settings/fees - Mettre à jour tous les frais de la plateforme
router.put('/settings/fees', authenticateToken, requireAdmin, [
  body('withdrawalFeePct').optional().isDecimal({ decimal_digits: '0,2' }).custom(v => parseFloat(v) >= 0 && parseFloat(v) <= 100),
  body('distributionFeePct').optional().isDecimal({ decimal_digits: '0,2' }).custom(v => parseFloat(v) >= 0 && parseFloat(v) <= 100),
  body('projectWithdrawalFeePct').optional().isDecimal({ decimal_digits: '0,2' }).custom(v => parseFloat(v) >= 0 && parseFloat(v) <= 100),
  body('minWithdrawalAmount').optional().isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) >= 0)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { withdrawalFeePct, distributionFeePct, projectWithdrawalFeePct, minWithdrawalAmount } = req.body;
    
    const updates = [];
    const params = [];
    
    if (withdrawalFeePct !== undefined) {
      updates.push('withdrawal_fee_pct = ?');
      params.push(withdrawalFeePct);
    }
    if (distributionFeePct !== undefined) {
      updates.push('distribution_fee_pct = ?');
      params.push(distributionFeePct);
    }
    if (projectWithdrawalFeePct !== undefined) {
      updates.push('project_withdrawal_fee_pct = ?');
      params.push(projectWithdrawalFeePct);
    }
    if (minWithdrawalAmount !== undefined) {
      updates.push('min_withdrawal_amount = ?');
      params.push(minWithdrawalAmount);
    }
    
    if (updates.length > 0) {
      await query(
        `UPDATE platform_settings SET ${updates.join(', ')} WHERE id = 1`, 
        params
      );
      
      await logAdminAction(req.user.id, 'update_platform_fees', 'platform_settings', 1, 
        `Frais de plateforme mis à jour: ${JSON.stringify(req.body)}`);
    }
    
    res.json({ success: true, message: 'Frais de plateforme mis à jour avec succès' });
  } catch (error) {
    console.error('Update platform fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to update platform fees' });
  }
});

// GET /api/admin/settings/fees - Récupérer tous les frais de la plateforme
router.get('/settings/fees', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [settings] = await query('SELECT * FROM platform_settings WHERE id = 1');
    
    res.json({ 
      success: true, 
      data: { 
        withdrawalFeePct: settings?.withdrawal_fee_pct || 0,
        distributionFeePct: settings?.distribution_fee_pct || 0,
        projectWithdrawalFeePct: settings?.project_withdrawal_fee_pct || 0,
        minWithdrawalAmount: settings?.min_withdrawal_amount || 10
      } 
    });
  } catch (error) {
    console.error('Get platform fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch platform fees' });
  }
});

module.exports = router;
