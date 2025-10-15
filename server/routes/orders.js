const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', authenticateToken, [
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('paymentMethod').isIn(['stripe', 'paypal', 'gyt_wallet']),
  body('shippingAddress').isObject()
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

    const { items, paymentMethod, shippingAddress, billingAddress, notes } = req.body;

    // Generate order number
    const orderNumber = `AK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result = await transaction(async (connection) => {
      let totalUsd = 0;
      let totalGyt = 0;
      const orderItems = [];

      // Validate products and calculate totals
      for (const item of items) {
        const products = await connection.execute(
          'SELECT id, price_usd, price_gyt, stock, name FROM products WHERE id = ? AND is_active = true',
          [item.productId]
        );

        if (products[0].length === 0) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product = products[0][0];

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemTotalUsd = product.price_usd * item.quantity;
        const itemTotalGyt = product.price_gyt * item.quantity;

        totalUsd += itemTotalUsd;
        totalGyt += itemTotalGyt;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceUsd: product.price_usd,
          priceGyt: product.price_gyt,
          totalUsd: itemTotalUsd,
          totalGyt: itemTotalGyt
        });
      }

      // Check GYT wallet balance if using GYT payment
      if (paymentMethod === 'gyt_wallet') {
        const wallets = await connection.execute(
          'SELECT gyt_balance FROM user_wallets WHERE user_id = ?',
          [req.user.id]
        );

        if (wallets[0].length === 0 || wallets[0][0].gyt_balance < totalGyt) {
          throw new Error('Insufficient GYT balance');
        }
      }

      // Create order
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (
          user_id, order_number, total_usd, total_gyt, payment_method,
          shipping_address, billing_address, notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [
        req.user.id, orderNumber, totalUsd, totalGyt, paymentMethod,
        JSON.stringify(shippingAddress), 
        JSON.stringify(billingAddress || shippingAddress),
        notes || null
      ]);

      const orderId = orderResult.insertId;

      // Create order items and update stock
      for (const item of orderItems) {
        await connection.execute(`
          INSERT INTO order_items (
            order_id, product_id, quantity, price_usd, price_gyt,
            total_usd, total_gyt
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          orderId, item.productId, item.quantity, item.priceUsd, item.priceGyt,
          item.totalUsd, item.totalGyt
        ]);

        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }

      // Deduct GYT from wallet if using GYT payment
      if (paymentMethod === 'gyt_wallet') {
        await connection.execute(`
          UPDATE user_wallets 
          SET gyt_balance = gyt_balance - ?, 
              total_spent_gyt = total_spent_gyt + ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `, [totalGyt, totalGyt, req.user.id]);

        // Mark order as paid
        await connection.execute(
          'UPDATE orders SET status = ? WHERE id = ?',
          ['paid', orderId]
        );
      }

      return { orderId, orderNumber, totalUsd, totalGyt };
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: result
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
});

// Get order invoice (stub: return a generated URL; replace with PDF stream if needed)
router.get('/:id/invoice', authenticateToken, async (req, res) => {
  const PDFDocument = require('pdfkit');
  try {
    const { id } = req.params;
    const orderRows = await query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = orderRows[0];
    const items = await query(`
      SELECT oi.*, p.name AS product_name FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE order_id = ?
    `, [id]);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${order.order_number}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(18).text('Facture', { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Commande: ${order.order_number}`, { align: 'right' });
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, { align: 'right' });
    doc.moveDown();

    // Billing/Shipping
    let ship;
    try { ship = order.shipping_address ? JSON.parse(order.shipping_address) : null; } catch (_) { ship = null; }
    doc.fontSize(12).text('Adresse de livraison');
    doc.fontSize(10).text(ship?.line1 || '—');
    doc.text(`${ship?.city || ''} ${ship?.country || ''}`);
    doc.moveDown();

    // Items table
    doc.fontSize(12).text('Articles');
    doc.moveDown(0.5);
    items.forEach((it) => {
      doc.fontSize(10).text(`${it.product_name} x${it.quantity} • $${Number(it.total_usd || 0).toFixed(2)}`);
    });
    doc.moveDown();

    // Totals
    doc.fontSize(12).text(`Total USD: $${Number(order.total_usd || 0).toFixed(2)}`);
    doc.fontSize(12).text(`Total GYT: ${Number(order.total_gyt || 0).toFixed(2)} GYT`);
    doc.moveDown();
    doc.fontSize(10).fillColor('#666').text('Merci pour votre achat sur AgriKonbit.');

    doc.end();
  } catch (error) {
    console.error('Get invoice error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate invoice' });
    }
  }
});

// Email order invoice (stub)
router.post('/:id/invoice/email', authenticateToken, async (req, res) => {
  const PDFDocument = require('pdfkit');
  const nodemailer = require('nodemailer');
  try {
    const { id } = req.params;
    const orderRows = await query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = orderRows[0];
    const items = await query(`
      SELECT oi.*, p.name AS product_name FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE order_id = ?
    `, [id]);

    // Generate PDF to buffer
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const done = new Promise((resolve) => doc.on('end', resolve));

    doc.fontSize(18).text('Facture', { align: 'right' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Commande: ${order.order_number}`, { align: 'right' });
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, { align: 'right' });
    doc.moveDown();
    let ship;
    try { ship = order.shipping_address ? JSON.parse(order.shipping_address) : null; } catch (_) { ship = null; }
    doc.fontSize(12).text('Adresse de livraison');
    doc.fontSize(10).text(ship?.line1 || '—');
    doc.text(`${ship?.city || ''} ${ship?.country || ''}`);
    doc.moveDown();
    doc.fontSize(12).text('Articles');
    doc.moveDown(0.5);
    items.forEach((it) => {
      doc.fontSize(10).text(`${it.product_name} x${it.quantity} • $${Number(it.total_usd || 0).toFixed(2)}`);
    });
    doc.moveDown();
    doc.fontSize(12).text(`Total USD: $${Number(order.total_usd || 0).toFixed(2)}`);
    doc.fontSize(12).text(`Total GYT: ${Number(order.total_gyt || 0).toFixed(2)} GYT`);
    doc.moveDown();
    doc.fontSize(10).fillColor('#666').text('Merci pour votre achat sur AgriKonbit.');
    doc.end();
    await done;
    const pdfBuffer = Buffer.concat(chunks);

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT || 2525),
      secure: false,
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    });

    const toEmail = req.body?.emailTo || req.user.email || process.env.DEFAULT_NOTIFICATION_EMAIL;
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@agrikonbit.local',
      to: toEmail,
      subject: `Facture ${order.order_number}`,
      text: 'Veuillez trouver votre facture en pièce jointe.',
      attachments: [{ filename: `invoice-${order.order_number}.pdf`, content: pdfBuffer }]
    });

    res.json({ success: true, message: 'Invoice email sent' });
  } catch (error) {
    console.error('Email invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to email invoice' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const page = Number.parseInt(req.query.page ?? '1', 10) || 1;
    const limit = Number.parseInt(req.query.limit ?? '10', 10) || 10;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.user_id = ?';
    let params = [req.user.id];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }

    const ordersSql = `
      SELECT 
        o.*,
        (
          SELECT COUNT(*) FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS item_count
      FROM orders o
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const orders = await query(ordersSql, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orders = await query(`
      SELECT * FROM orders 
      WHERE id = ? AND user_id = ?
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items with product details
    const orderItems = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        p.images as product_images,
        u.full_name as farmer_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON p.farmer_id = u.id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        ...order,
        items: orderItems
      }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Update order status (for tracking)
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['cancelled'])
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

    // Check if order exists and belongs to user
    const orders = await query(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    if (order.status !== 'pending' && order.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status'
      });
    }

    // If cancelling, restore product stock
    if (status === 'cancelled') {
      await transaction(async (connection) => {
        // Get order items
        const orderItems = await connection.execute(
          'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
          [id]
        );

        // Restore stock for each item
        for (const item of orderItems[0]) {
          await connection.execute(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }

        // Update order status
        await connection.execute(
          'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [status, id]
        );
      });
    } else {
      await query(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id]
      );
    }

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

// ============================================
// NOUVELLES ROUTES - Suivi de Commandes
// ============================================

// GET /api/orders/:id/tracking - Suivi détaillé d'une commande
router.get('/:id/tracking', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la commande
    const [orders] = await query(`
      SELECT 
        o.*,
        u.full_name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ? AND o.user_id = ?
    `, [id, req.user.id]);
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }
    
    const order = orders[0];
    
    // Récupérer les articles de la commande
    const items = await query(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        CAST(p.images AS CHAR) as product_images,
        u.full_name as farmer_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON p.farmer_id = u.id
      WHERE oi.order_id = ?
    `, [id]);
    
    // Récupérer l'historique de statut
    const statusHistory = await query(`
      SELECT 
        osh.*,
        u.full_name as changed_by_name
      FROM order_status_history osh
      LEFT JOIN users u ON osh.changed_by = u.id
      WHERE osh.order_id = ? 
      ORDER BY osh.created_at ASC
    `, [id]);
    
    res.json({ 
      success: true, 
      data: { 
        order, 
        items, 
        statusHistory 
      } 
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order tracking' });
  }
});

// GET /api/orders/:id/status-history - Historique des statuts uniquement
router.get('/:id/status-history', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que la commande appartient à l'utilisateur
    const [orders] = await query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
      [id, req.user.id]
    );
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }
    
    const statusHistory = await query(`
      SELECT 
        osh.*,
        u.full_name as changed_by_name
      FROM order_status_history osh
      LEFT JOIN users u ON osh.changed_by = u.id
      WHERE osh.order_id = ? 
      ORDER BY osh.created_at ASC
    `, [id]);
    
    res.json({ success: true, data: statusHistory });
  } catch (error) {
    console.error('Get status history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch status history' });
  }
});

// POST /api/orders/:id/confirm-delivery - Confirmer la réception de la commande
router.post('/:id/confirm-delivery', authenticateToken, [
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    await transaction(async (conn) => {
      // Vérifier que la commande appartient à l'utilisateur
      const [orders] = await conn.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
        [id, req.user.id]
      );
      
      if (!orders || orders.length === 0) {
        throw new Error('Commande non trouvée');
      }
      
      const order = orders[0];
      
      if (order.status !== 'shipped') {
        throw new Error('Seules les commandes expédiées peuvent être confirmées');
      }
      
      // Mettre à jour le statut de la commande
      await conn.execute(`
        UPDATE orders 
        SET status = 'delivered', 
            delivery_confirmed_at = NOW(), 
            delivery_notes = ?,
            updated_at = NOW()
        WHERE id = ?
      `, [notes || null, id]);
      
      // Ajouter à l'historique
      await conn.execute(`
        INSERT INTO order_status_history (order_id, status, notes, changed_by, created_at)
        VALUES (?, 'delivered', ?, ?, NOW())
      `, [id, notes || 'Livraison confirmée par le client', req.user.id]);
    });
    
    res.json({ success: true, message: 'Livraison confirmée avec succès' });
  } catch (error) {
    console.error('Confirm delivery error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to confirm delivery' });
  }
});

// POST /api/orders/:id/cancel - Annuler une commande (si pas encore expédiée)
router.post('/:id/cancel', authenticateToken, [
  body('reason').trim().isLength({ min: 10 }).withMessage('Veuillez fournir une raison pour l\'annulation (minimum 10 caractères)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { id } = req.params;
    const { reason } = req.body;
    
    await transaction(async (conn) => {
      // Vérifier que la commande appartient à l'utilisateur
      const [orders] = await conn.execute(
        'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
        [id, req.user.id]
      );
      
      if (!orders || orders.length === 0) {
        throw new Error('Commande non trouvée');
      }
      
      const order = orders[0];
      
      if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
        throw new Error('Cette commande ne peut plus être annulée');
      }
      
      // Mettre à jour le statut
      await conn.execute(`
        UPDATE orders 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = ?
      `, [id]);
      
      // Ajouter à l'historique
      await conn.execute(`
        INSERT INTO order_status_history (order_id, status, notes, changed_by, created_at)
        VALUES (?, 'cancelled', ?, ?, NOW())
      `, [id, `Annulée par le client: ${reason}`, req.user.id]);
      
      // Rembourser si payé avec GYT wallet
      if (order.payment_method === 'gyt_wallet' && order.status === 'paid') {
        await conn.execute(`
          UPDATE user_wallets 
          SET gyt_balance = gyt_balance + ?, updated_at = NOW()
          WHERE user_id = ?
        `, [order.total_gyt, req.user.id]);
        
        await conn.execute(`
          INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
          VALUES (?, 'refund', ?, 'completed', ?, 'order', ?)
        `, [req.user.id, order.total_gyt, `Remboursement commande #${order.order_number}`, id]);
      }
      
      // Restaurer le stock des produits
      const [items] = await conn.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );
      
      for (const item of items) {
        await conn.execute(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    });
    
    res.json({ success: true, message: 'Commande annulée avec succès' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to cancel order' });
  }
});

module.exports = router;
