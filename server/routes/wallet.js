const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireInvestor } = require('../middleware/auth');
const router = express.Router();

// Investor wallet withdrawal
router.post('/withdraw', authenticateToken, requireInvestor, [
  body('amount').isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) > 0),
  body('method').isIn(['bank_transfer', 'mobile_money', 'crypto_wallet', 'paypal']),
  body('destination').trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { amount, method, destination, notes } = req.body;

    // Get platform settings for fees and minimum withdrawal
    const [settings] = await query('SELECT withdrawal_fee_pct, min_withdrawal_amount FROM platform_settings WHERE id = 1');
    const withdrawalFeePct = settings ? parseFloat(settings.withdrawal_fee_pct || 0) : 0;
    const minWithdrawalAmount = settings ? parseFloat(settings.min_withdrawal_amount || 10) : 10;

    const requestedAmount = parseFloat(amount);

    // Check minimum withdrawal amount
    if (requestedAmount < minWithdrawalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Le montant minimum de retrait est ${minWithdrawalAmount} GYT` 
      });
    }

    // Calculate fees
    const feeAmount = requestedAmount * (withdrawalFeePct / 100);
    const netAmount = requestedAmount - feeAmount;

    // Check wallet balance
    const wallets = await query('SELECT gyt_balance FROM user_wallets WHERE user_id = ?', [req.user.id]);
    const balance = wallets.length ? parseFloat(wallets[0].gyt_balance) : 0;
    if (requestedAmount > balance) {
      return res.status(400).json({ success: false, message: 'Solde GYT insuffisant' });
    }

    const withdrawalId = await transaction(async (connection) => {
      // Insert withdrawal request with fee information
      const [withdrawalResult] = await connection.execute(`
        INSERT INTO withdrawals (user_id, amount_gyt, fee_amount_gyt, fee_percentage, net_amount_gyt, method, destination, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [req.user.id, requestedAmount, feeAmount, withdrawalFeePct, netAmount, method, destination, notes || null]);

      // Insert transaction record for the withdrawal
      await connection.execute(`
        INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
        VALUES (?, 'withdrawal', ?, 'pending', ?, 'withdrawal', ?)
      `, [req.user.id, requestedAmount, `Retrait via ${method} (Frais: ${withdrawalFeePct}%)`, withdrawalResult.insertId]);

      // Insert transaction record for the fee if applicable
      if (feeAmount > 0) {
        await connection.execute(`
          INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type, reference_id)
          VALUES (?, 'fee', ?, 'completed', ?, 'withdrawal', ?)
        `, [req.user.id, feeAmount, `Frais de retrait (${withdrawalFeePct}%)`, withdrawalResult.insertId]);
      }

      // Reduce available balance immediately (hold the full amount)
      await connection.execute(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance - ?, updated_at = NOW()
        WHERE user_id = ?
      `, [requestedAmount, req.user.id]);

      return withdrawalResult.insertId;
    });

    res.status(201).json({
      success: true,
      message: 'Demande de retrait soumise avec succès',
      data: { 
        withdrawalId,
        requestedAmount,
        feeAmount,
        netAmount,
        feePercentage: withdrawalFeePct
      }
    });
  } catch (error) {
    console.error('Investor withdraw error:', error);
    res.status(500).json({ success: false, message: 'Échec du traitement du retrait' });
  }
});

// Get withdrawal history for investor
router.get('/withdrawals', authenticateToken, requireInvestor, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const withdrawals = await query(`
      SELECT 
        id, amount_gyt, fee_amount_gyt, fee_percentage, net_amount_gyt,
        method, destination, status, admin_notes, tx_hash,
        created_at, processed_at
      FROM withdrawals
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    const countResult = await query(`
      SELECT COUNT(*) as total FROM withdrawals ${whereClause}
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
    console.error('Get withdrawals error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawals' });
  }
});

module.exports = router;
