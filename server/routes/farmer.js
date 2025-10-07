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
  body('status').isIn(['preparing', 'shipped', 'delivered'])
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

// Get farmer's orders
router.get('/orders', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.farmer_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    const orders = await query(`
      SELECT DISTINCT
        o.*,
        u.full_name as customer_name,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    // Get total count
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
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
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

// Get order details for farmer
router.get('/orders/:id', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order with customer info
    const orders = await query(`
      SELECT DISTINCT
        o.*,
        u.full_name as customer_name,
        u.email as customer_email
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND p.farmer_id = ?
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items with product details (only farmer's products)
    const orderItems = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        p.images as product_images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ? AND p.farmer_id = ?
    `, [id, req.user.id]);

    res.json({
      success: true,
      data: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Get farmer order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Update order status (farmer side)
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
    const { status } = req.body;

    // Check if order exists and farmer has products in it
    const orders = await query(`
      SELECT DISTINCT o.id, o.status, o.total_gyt
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND p.farmer_id = ?
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Validate status transitions
    const validTransitions = {
      'paid': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'pending': ['cancelled']
    };

    if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}`
      });
    }

    await transaction(async (connection) => {
      // Update order status
      await connection.execute(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );

      // If delivered, credit farmer's wallet
      if (status === 'delivered') {
        // Get farmer's share of the order (all items from this farmer)
        const farmerItems = await connection.execute(`
          SELECT SUM(oi.total_gyt) as farmer_total_gyt
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ? AND p.farmer_id = ?
        `, [id, req.user.id]);

        const farmerTotalGyt = farmerItems[0][0]?.farmer_total_gyt || 0;

        if (farmerTotalGyt > 0) {
          // Credit farmer's wallet
          await connection.execute(`
            UPDATE user_wallets 
            SET gyt_balance = gyt_balance + ?,
                total_earned_gyt = total_earned_gyt + ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
          `, [farmerTotalGyt, farmerTotalGyt, req.user.id]);

          // Create transaction record
          await connection.execute(`
            INSERT INTO transactions (
              user_id, type, amount_gyt, status, description, reference_type, reference_id
            ) VALUES (?, 'payment', ?, 'completed', ?, 'order', ?)
          `, [req.user.id, farmerTotalGyt, `Paiement commande #${order.id}`, id]);
        }
      }

      // If cancelled, restore product stock
      if (status === 'cancelled') {
        const orderItems = await connection.execute(`
          SELECT oi.product_id, oi.quantity
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ? AND p.farmer_id = ?
        `, [id, req.user.id]);

        for (const item of orderItems[0]) {
          await connection.execute(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }
      }
    });

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update farmer order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

module.exports = router;
