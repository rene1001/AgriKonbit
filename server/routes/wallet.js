const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireInvestor } = require('../middleware/auth');
const router = express.Router();

// Investor wallet withdrawal
router.post('/withdraw', authenticateToken, requireInvestor, [
  body('amount').isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) > 0),
  body('method').isIn(['bank_transfer', 'mobile_money', 'crypto_wallet']),
  body('destination').trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { amount, method, destination, notes } = req.body;

    // Check wallet balance
    const wallets = await query('SELECT gyt_balance FROM user_wallets WHERE user_id = ?', [req.user.id]);
    const balance = wallets.length ? parseFloat(wallets[0].gyt_balance) : 0;
    if (parseFloat(amount) > balance) {
      return res.status(400).json({ success: false, message: 'Insufficient GYT balance' });
    }

    const withdrawalId = await transaction(async (connection) => {
      // Insert withdrawal request
      const [withdrawalResult] = await connection.execute(`
        INSERT INTO withdrawals (user_id, amount_gyt, method, destination, notes, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
      `, [req.user.id, amount, method, destination, notes || null]);

      // Insert transaction record
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
        VALUES (?, 'withdrawal', ?, 'pending', ?, 'withdrawal', ?)
      `, [req.user.id, amount, `Retrait via ${method}`, withdrawalResult.insertId]);

      // Reduce available balance immediately (optional hold)
      await connection.execute(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance - ?, updated_at = NOW()
        WHERE user_id = ?
      `, [amount, req.user.id]);

      return withdrawalResult.insertId;
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: { withdrawalId }
    });
  } catch (error) {
    console.error('Investor withdraw error:', error);
    res.status(500).json({ success: false, message: 'Failed to process withdrawal' });
  }
});

module.exports = router;
