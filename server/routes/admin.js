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

module.exports = router;
