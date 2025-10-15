const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { query, transaction } = require('../config/database');
const { body, validationResult } = require('express-validator');

// GET /api/treasury - Obtenir le solde de la trésorerie
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [treasury] = await query('SELECT * FROM platform_treasury WHERE id = 1');
    
    if (!treasury || !treasury[0]) {
      return res.status(404).json({ success: false, message: 'Trésorerie non initialisée' });
    }

    res.json({ success: true, data: treasury[0] });
  } catch (error) {
    console.error('Get treasury error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// GET /api/treasury/transactions - Obtenir l'historique des transactions
router.get('/transactions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    let params = [];

    if (type && type !== 'all') {
      whereClause = 'WHERE type = ?';
      params.push(type);
    }

    const [transactions] = await query(
      `SELECT 
        ptt.*,
        u.username as admin_username
      FROM platform_treasury_transactions ptt
      LEFT JOIN users u ON ptt.admin_id = u.id
      ${whereClause}
      ORDER BY ptt.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM platform_treasury_transactions ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get treasury transactions error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// POST /api/treasury/withdraw - Retirer des fonds de la trésorerie (admin)
router.post('/withdraw', authenticateToken, requireAdmin, [
  body('amount').isFloat({ min: 0.01 }).withMessage('Montant invalide'),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, notes } = req.body;
    const adminId = req.user.id;

    await transaction(async (conn) => {
      // Récupérer le solde actuel
      const [treasury] = await conn.execute('SELECT * FROM platform_treasury WHERE id = 1 FOR UPDATE');
      
      if (!treasury || !treasury[0]) {
        throw new Error('Trésorerie non trouvée');
      }

      const currentBalance = parseFloat(treasury[0].balance_usd);
      
      if (currentBalance < amount) {
        throw new Error('Solde insuffisant dans la trésorerie');
      }

      const newBalance = currentBalance - amount;
      const newTotalWithdrawn = parseFloat(treasury[0].total_withdrawn) + amount;

      // Mettre à jour la trésorerie
      await conn.execute(
        'UPDATE platform_treasury SET balance_usd = ?, total_withdrawn = ? WHERE id = 1',
        [newBalance, newTotalWithdrawn]
      );

      // Enregistrer la transaction
      await conn.execute(
        `INSERT INTO platform_treasury_transactions 
        (type, amount_usd, admin_id, notes, balance_before, balance_after)
        VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin_withdrawal', amount, adminId, notes || 'Retrait administrateur', currentBalance, newBalance]
      );

      // Log admin action
      await conn.execute(
        `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, description)
        VALUES (?, ?, ?, ?, ?)`,
        [adminId, 'treasury_withdrawal', 'treasury', 1, `Retrait de ${amount} USD de la trésorerie`]
      );
    });

    res.json({ success: true, message: 'Retrait effectué avec succès' });
  } catch (error) {
    console.error('Treasury withdrawal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Erreur serveur' });
  }
});

// GET /api/treasury/stats - Statistiques de la trésorerie
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [treasury] = await query('SELECT * FROM platform_treasury WHERE id = 1');
    
    // Stats par type de frais
    const [feeStats] = await query(`
      SELECT 
        source,
        COUNT(*) as count,
        SUM(amount_usd) as total
      FROM platform_treasury_transactions
      WHERE type = 'fee_collection'
      GROUP BY source
    `);

    // Stats mensuelles
    const [monthlyStats] = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        type,
        SUM(amount_usd) as total
      FROM platform_treasury_transactions
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month, type
      ORDER BY month DESC
    `);

    res.json({
      success: true,
      data: {
        treasury: treasury[0],
        feeStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Get treasury stats error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;
