const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Helper to convert to CSV
const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';
  
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Export users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;

    const users = await query(`
      SELECT 
        u.id, u.email, u.full_name, u.role, u.country, u.phone,
        u.kyc_status, u.is_active, u.created_at,
        COALESCE(uw.gyt_balance, 0) as gyt_balance
      FROM users u
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      WHERE u.role != 'admin'
      ORDER BY u.created_at DESC
    `);

    if (format === 'csv') {
      const headers = ['id', 'email', 'full_name', 'role', 'country', 'phone', 'kyc_status', 'is_active', 'gyt_balance', 'created_at'];
      const csv = convertToCSV(users, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="users-export-${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.json({ success: true, data: users });
    }

  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, message: 'Failed to export users' });
  }
});

// Export investments
router.get('/investments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;

    const investments = await query(`
      SELECT 
        i.id, i.amount_gyt, i.amount_usd, i.expected_return_percentage,
        i.status, i.created_at,
        u.full_name as investor_name, u.email as investor_email,
        p.title as project_title, p.category as project_category,
        f.full_name as farmer_name
      FROM investments i
      JOIN users u ON i.investor_id = u.id
      JOIN projects p ON i.project_id = p.id
      JOIN users f ON p.farmer_id = f.id
      ORDER BY i.created_at DESC
    `);

    if (format === 'csv') {
      const headers = ['id', 'investor_name', 'investor_email', 'project_title', 'project_category', 
                       'farmer_name', 'amount_gyt', 'amount_usd', 'expected_return_percentage', 
                       'status', 'created_at'];
      const csv = convertToCSV(investments, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="investments-export-${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.json({ success: true, data: investments });
    }

  } catch (error) {
    console.error('Export investments error:', error);
    res.status(500).json({ success: false, message: 'Failed to export investments' });
  }
});

// Export orders
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;

    const orders = await query(`
      SELECT 
        o.id, o.total_gyt, o.total_usd, o.status, o.payment_method,
        o.shipping_address, o.created_at, o.updated_at,
        u.full_name as customer_name, u.email as customer_email, u.phone as customer_phone,
        f.full_name as farmer_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN users f ON o.farmer_id = f.id
      ORDER BY o.created_at DESC
    `);

    if (format === 'csv') {
      const headers = ['id', 'customer_name', 'customer_email', 'customer_phone', 'farmer_name',
                       'total_gyt', 'total_usd', 'payment_method', 'status', 
                       'shipping_address', 'created_at', 'updated_at'];
      const csv = convertToCSV(orders, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="orders-export-${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.json({ success: true, data: orders });
    }

  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to export orders' });
  }
});

// Export projects
router.get('/projects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;

    const projects = await query(`
      SELECT 
        p.id, p.title, p.category, p.funding_goal_usd, p.current_funding_usd,
        p.status, p.created_at, p.start_date, p.end_date,
        u.full_name as farmer_name, u.email as farmer_email, u.country as farmer_country,
        COUNT(DISTINCT i.id) as total_investors,
        COALESCE(SUM(i.amount_usd), 0) as total_invested
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN investments i ON p.id = i.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    if (format === 'csv') {
      const headers = ['id', 'title', 'category', 'farmer_name', 'farmer_email', 'farmer_country',
                       'funding_goal_usd', 'current_funding_usd', 'total_investors', 'total_invested',
                       'status', 'start_date', 'end_date', 'created_at'];
      const csv = convertToCSV(projects, headers);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="projects-export-${Date.now()}.csv"`);
      res.send(csv);
    } else {
      res.json({ success: true, data: projects });
    }

  } catch (error) {
    console.error('Export projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to export projects' });
  }
});

module.exports = router;
