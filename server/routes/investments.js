const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireInvestor } = require('../middleware/auth');
const router = express.Router();

// Get user's investments
router.get('/my-investments', authenticateToken, requireInvestor, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE i.investor_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND i.status = ?';
      params.push(status);
    }

    const investments = await query(`
      SELECT 
        i.*,
        p.title as project_title,
        p.description as project_description,
        p.status as project_status,
        p.location as project_location,
        p.category as project_category,
        p.estimated_return_pct,
        p.start_date,
        p.end_date,
        u.full_name as farmer_name,
        ROUND((p.funded_amount_gyt / p.budget_gyt) * 100, 2) as project_funding_percentage
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON p.farmer_id = u.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM investments i
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investments'
    });
  }
});

// Create investment
router.post('/', authenticateToken, requireInvestor, [
  body('projectId').isInt(),
  body('amountGyt').isDecimal({ decimal_digits: '0,4' }),
  body('paymentMethod').isIn(['stripe', 'paypal', 'metamask', 'gyt_wallet']),
  body('returnType').optional().isIn(['financial', 'physical', 'mixed']),
  body('physicalReturnQty').optional().isDecimal({ decimal_digits: '0,2' }),
  body('physicalReturnUnit').optional().isLength({ min: 1, max: 50 })
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

    const {
      projectId,
      amountGyt,
      paymentMethod,
      returnType = 'financial',
      physicalReturnQty,
      physicalReturnUnit
    } = req.body;

    // Validate project exists and is active
    const projects = await query(`
      SELECT id, status, budget_gyt, funded_amount_gyt, estimated_return_pct
      FROM projects WHERE id = ?
    `, [projectId]);

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const project = projects[0];

    if (project.status !== 'validated') {
      return res.status(400).json({
        success: false,
        message: 'Project is not available for investment'
      });
    }

    // Check if investment would exceed project budget
    const newFundedAmount = parseFloat(project.funded_amount_gyt) + parseFloat(amountGyt);
    if (newFundedAmount > parseFloat(project.budget_gyt)) {
      return res.status(400).json({
        success: false,
        message: 'Investment amount exceeds remaining project budget'
      });
    }

    // Check minimum investment amount
    const minInvestment = 10; // 10 GYT minimum
    if (parseFloat(amountGyt) < minInvestment) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment amount is ${minInvestment} GYT`
      });
    }

    // For GYT wallet payments, check balance
    if (paymentMethod === 'gyt_wallet') {
      const wallets = await query(
        'SELECT gyt_balance FROM user_wallets WHERE user_id = ?',
        [req.user.id]
      );

      if (wallets.length === 0 || parseFloat(wallets[0].gyt_balance) < parseFloat(amountGyt)) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient GYT balance'
        });
      }
    }

    // Calculate USD amount (1:1 for now)
    const amountUsd = amountGyt;

    const result = await transaction(async (connection) => {
      // Create investment record
      const [investmentResult] = await connection.execute(`
        INSERT INTO investments (
          project_id, investor_id, amount_gyt, amount_usd, payment_method,
          return_type, physical_return_qty, physical_return_unit, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [
        projectId, req.user.id, amountGyt, amountUsd, paymentMethod,
        returnType, physicalReturnQty || null, physicalReturnUnit || null
      ]);

      const investmentId = investmentResult.insertId;

      // Update project funding
      await connection.execute(`
        UPDATE projects 
        SET funded_amount_gyt = funded_amount_gyt + ?, 
            funded_amount_usd = funded_amount_usd + ?,
            investor_count = investor_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [amountGyt, amountUsd, projectId]);

      // If using GYT wallet, deduct from balance
      if (paymentMethod === 'gyt_wallet') {
        await connection.execute(`
          UPDATE user_wallets 
          SET gyt_balance = gyt_balance - ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, [amountGyt, req.user.id]);
      }

      // Check if project is now fully funded
      const [updatedProject] = await connection.execute(
        'SELECT budget_gyt, funded_amount_gyt FROM projects WHERE id = ?',
        [projectId]
      );

      if (updatedProject[0].funded_amount_gyt >= updatedProject[0].budget_gyt) {
        // Mark project as active and set start date
        await connection.execute(`
          UPDATE projects 
          SET status = 'active', start_date = CURRENT_TIMESTAMP,
              end_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL duration_days DAY)
          WHERE id = ?
        `, [projectId]);
      }

      return investmentId;
    });

    res.status(201).json({
      success: true,
      message: 'Investment created successfully',
      data: {
        investmentId: result,
        amountGyt,
        amountUsd,
        paymentMethod
      }
    });

  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create investment'
    });
  }
});

// Get investment details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const investments = await query(`
      SELECT 
        i.*,
        p.title as project_title,
        p.description as project_description,
        p.status as project_status,
        p.location as project_location,
        p.category as project_category,
        p.estimated_return_pct,
        p.start_date,
        p.end_date,
        p.images as project_images,
        u.full_name as farmer_name,
        u.country as farmer_country,
        ROUND((p.funded_amount_gyt / p.budget_gyt) * 100, 2) as project_funding_percentage
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      JOIN users u ON p.farmer_id = u.id
      WHERE i.id = ? AND i.investor_id = ?
    `, [id, req.user.id]);

    if (investments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Investment not found'
      });
    }

    res.json({
      success: true,
      data: investments[0]
    });

  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment'
    });
  }
});

// Get investment statistics
router.get('/stats/overview', authenticateToken, requireInvestor, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_investments,
        SUM(amount_gyt) as total_invested_gyt,
        SUM(amount_usd) as total_invested_usd,
        AVG(amount_gyt) as avg_investment_gyt,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_investments,
        COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_investments,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as finished_projects
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.investor_id = ?
    `, [req.user.id]);

    // Get recent investments
    const recentInvestments = await query(`
      SELECT 
        i.amount_gyt,
        i.created_at,
        p.title as project_title,
        p.status as project_status
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.investor_id = ?
      ORDER BY i.created_at DESC
      LIMIT 5
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        overview: stats[0],
        recentInvestments
      }
    });

  } catch (error) {
    console.error('Get investment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment statistics'
    });
  }
});

// Schedule delivery for physical returns
router.post('/returns/schedule-delivery', authenticateToken, requireInvestor, [
  body('investmentId').isInt(),
  body('preferredDate').optional().isISO8601(),
  body('address').optional().isLength({ min: 10 })
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

    const { investmentId, preferredDate, address, notes } = req.body;

    // Verify investment ownership
    const investments = await query(
      'SELECT id, project_id FROM investments WHERE id = ? AND investor_id = ?',
      [investmentId, req.user.id]
    );

    if (investments.length === 0) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    // Create a notification for admins to process delivery (placeholder workflow)
    await query(
      `INSERT INTO notifications (user_id, title, message, type, data, created_at)
       VALUES (?, ?, ?, 'info', ?, NOW())`,
      [
        req.user.id,
        'Demande de livraison programmée',
        'Vous avez demandé la planification d\'une livraison de retour physique.',
        JSON.stringify({ investmentId, preferredDate, address, notes })
      ]
    );

    res.json({
      success: true,
      message: 'Delivery request submitted successfully'
    });
  } catch (error) {
    console.error('Schedule delivery error:', error);
    res.status(500).json({ success: false, message: 'Failed to schedule delivery' });
  }
});

module.exports = router;
