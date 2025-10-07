const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { query } = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Test route projects
app.get('/api/projects', async (req, res) => {
  try {
    console.log('📥 Request received for /api/projects');
    console.log('Query params:', req.query);
    
    const { status = 'validated', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.status = ?';
    let params = [status];

    console.log('🔍 Executing query...');
    const projects = await query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.budget_usd,
        p.budget_gyt,
        p.duration_days,
        p.estimated_return_pct,
        p.location,
        p.category,
        p.status,
        p.funded_amount_usd,
        p.funded_amount_gyt,
        p.investor_count,
        p.start_date,
        p.end_date,
        CAST(p.images AS CHAR) as images,
        p.created_at,
        u.full_name as farmer_name,
        u.country as farmer_country,
        ROUND((p.funded_amount_gyt / p.budget_gyt) * 100, 2) as funding_percentage
      FROM projects p
      JOIN users u ON p.farmer_id = u.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    console.log('✅ Query successful, found:', projects.length, 'projects');

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM projects p
      ${whereClause}
    `, params);

    console.log('✅ Total count:', countResult.total);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in /api/projects:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// Test route products
app.get('/api/products', async (req, res) => {
  try {
    console.log('📥 Request received for /api/products');
    
    const { limit = 12 } = req.query;
    
    console.log('🔍 Executing products query...');
    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price_usd,
        p.stock,
        CAST(p.images AS CHAR) as images,
        u.full_name as farmer_name
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    console.log('✅ Products found:', products.length);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: products.length
        }
      }
    });

  } catch (error) {
    console.error('❌ Error in /api/products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/projects`);
  console.log(`Test: http://localhost:${PORT}/api/products`);
});
