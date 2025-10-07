const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// GET /favorites - return user's favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await query('SELECT type, target_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    const products = rows.filter(r => r.type === 'product').map(r => ({ id: r.target_id }));
    const producers = rows.filter(r => r.type === 'producer').map(r => ({ id: r.target_id }));
    res.json({ success: true, data: { products, producers } });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch favorites' });
  }
});

// POST /favorites - add a favorite
router.post('/', authenticateToken, [
  body('type').isIn(['product','producer']),
  body('id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { type, id } = req.body;
    await query('INSERT IGNORE INTO favorites (user_id, type, target_id) VALUES (?, ?, ?)', [req.user.id, type, id]);
    res.status(201).json({ success: true, message: 'Favorite added' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ success: false, message: 'Failed to add favorite' });
  }
});

// DELETE /favorites/:type/:id - remove a favorite
router.delete('/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!['product','producer'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    await query('DELETE FROM favorites WHERE user_id = ? AND type = ? AND target_id = ?', [req.user.id, type, id]);
    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove favorite' });
  }
});

module.exports = router;
