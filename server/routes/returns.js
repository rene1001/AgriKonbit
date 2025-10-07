const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireInvestor } = require('../middleware/auth');
const router = express.Router();

// List returns for the authenticated investor
router.get('/', authenticateToken, requireInvestor, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let where = 'WHERE r.investor_id = ?';
    const params = [req.user.id];
    if (type && ['financial','physical'].includes(type)) {
      where += ' AND r.type = ?';
      params.push(type);
    }

    // Ensure table exists (idempotent)
    await query(`
      CREATE TABLE IF NOT EXISTS \`returns\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        investor_id INT NOT NULL,
        project_id INT NOT NULL,
        type ENUM('financial','physical') NOT NULL,
        amount_gyt DECIMAL(18,4) DEFAULT NULL,
        quantity DECIMAL(18,4) DEFAULT NULL,
        unit VARCHAR(50) DEFAULT NULL,
        status ENUM('pending','available','delivered','withdrawn') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (investor_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_investor (investor_id),
        INDEX idx_project (project_id),
        INDEX idx_type (type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB;
    `);

    const items = await query(`
      SELECT 
        r.id,
        r.type,
        r.amount_gyt,
        r.quantity,
        r.unit,
        r.status,
        r.created_at,
        p.id AS project_id,
        p.title AS project_title
      FROM \`returns\` r
      JOIN projects p ON r.project_id = p.id
      ${where}
      ORDER BY r.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    const countRows = await query(`
      SELECT COUNT(*) AS total
      FROM \`returns\` r
      ${where}
    `, params);
    const countRow = countRows[0] || { total: 0 };

    res.json({
      success: true,
      data: {
        returns: items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countRow.total,
          pages: Math.ceil(countRow.total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('List returns error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch returns', error: error.message });
  }
});

// Delete a return (investor can remove from their history)
router.delete('/:id', authenticateToken, requireInvestor, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM \`returns\` WHERE id = ? AND investor_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Return not found' });
    }

    res.json({ success: true, message: 'Return deleted' });
  } catch (error) {
    console.error('Delete return error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete return', error: error.message });
  }
});

module.exports = router;
