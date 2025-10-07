const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// GET /deliveries/my - list deliveries for current user (derived from orders with tracking)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const orders = await query(
      `SELECT id as orderId, order_number, tracking_number as trackingNumber, status,
              created_at, updated_at
       FROM orders
       WHERE user_id = ? AND tracking_number IS NOT NULL
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    const orderIds = orders.map(o => o.orderId);
    let eventsByOrder = {};
    if (orderIds.length) {
      const events = await query(
        `SELECT order_id, status, location, latitude, longitude, details, occurred_at
         FROM delivery_events
         WHERE order_id IN (${orderIds.map(() => '?').join(',')})
         ORDER BY occurred_at ASC`,
        orderIds
      );
      for (const ev of events) {
        if (!eventsByOrder[ev.order_id]) eventsByOrder[ev.order_id] = [];
        eventsByOrder[ev.order_id].push({
          ts: ev.occurred_at,
          status: ev.status,
          location: ev.location,
          latitude: ev.latitude,
          longitude: ev.longitude,
          details: ev.details
        });
      }
    }

    const deliveries = orders.map(o => ({
      orderId: o.orderId,
      order_number: o.order_number,
      trackingNumber: o.trackingNumber,
      status: o.status,
      checkpoints: eventsByOrder[o.orderId] || [],
      lastUpdate: o.updated_at
    }));

    res.json({ success: true, data: { deliveries } });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch deliveries' });
  }
});

// GET /deliveries/track/:trackingNumber - detail for a tracking number
router.get('/track/:trackingNumber', authenticateToken, async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const rows = await query(
      `SELECT id as orderId, order_number, tracking_number as trackingNumber, status,
              created_at, updated_at
       FROM orders
       WHERE user_id = ? AND tracking_number = ?
       LIMIT 1`,
      [req.user.id, trackingNumber]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Tracking not found' });
    }

    const o = rows[0];
    const events = await query(
      `SELECT status, location, latitude, longitude, details, occurred_at FROM delivery_events
       WHERE order_id = ? ORDER BY occurred_at ASC`,
      [o.orderId]
    );
    const delivery = {
      orderId: o.orderId,
      order_number: o.order_number,
      trackingNumber: o.trackingNumber,
      status: o.status,
      checkpoints: events.map(ev => ({ ts: ev.occurred_at, status: ev.status, location: ev.location, latitude: ev.latitude, longitude: ev.longitude, details: ev.details })),
      lastUpdate: o.updated_at
    };

    res.json({ success: true, data: delivery });
  } catch (error) {
    console.error('Track delivery error:', error);
    res.status(500).json({ success: false, message: 'Failed to track delivery' });
  }
});

// POST /deliveries/:orderId/events - append a delivery event and notify the user
router.post('/:orderId/events', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, location = null, latitude = null, longitude = null, details = null, occurred_at = new Date() } = req.body;

    // Check order and get owner
    const orders = await query('SELECT id, user_id, order_number FROM orders WHERE id = ?', [orderId]);
    if (!orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const order = orders[0];

    // Insert event
    await query(
      `INSERT INTO delivery_events (order_id, status, location, latitude, longitude, details, occurred_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, status, location, latitude, longitude, details, new Date(occurred_at)]
    );

    // Optionally update order status and eta
    if (status) {
      await query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, orderId]);
    }

    // Create notification for the order owner
    await query(
      `INSERT INTO notifications (user_id, title, message, type, data, created_at)
       VALUES (?, ?, ?, 'delivery_update', ?, NOW())`,
      [
        order.user_id,
        'Mise à jour de livraison',
        `Commande ${order.order_number}: ${status}`,
        JSON.stringify({ orderId, status, location, details })
      ]
    );

    res.status(201).json({ success: true, message: 'Delivery event added' });
  } catch (error) {
    console.error('Append delivery event error:', error);
    res.status(500).json({ success: false, message: 'Failed to append delivery event' });
  }
});

module.exports = router;
