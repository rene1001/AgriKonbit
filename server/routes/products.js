const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireFarmer } = require('../middleware/auth');
const router = express.Router();

// Get all products (marketplace)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      origin, 
      organic, 
      minPrice, 
      maxPrice, 
      search,
      page = 1, 
      limit = 12 
    } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE p.is_active = true';
    let params = [];

    if (category) {
      whereClause += ' AND p.category = ?';
      params.push(category);
    }

    if (origin) {
      whereClause += ' AND p.origin_country = ?';
      params.push(origin);
    }

    if (organic === 'true') {
      whereClause += ' AND p.organic_certified = true';
    }

    if (minPrice) {
      whereClause += ' AND p.price_usd >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      whereClause += ' AND p.price_usd <= ?';
      params.push(maxPrice);
    }

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Note: Do not bind LIMIT/OFFSET as parameters; interpolate validated integers
    const products = await query(`
      SELECT 
        p.id,
        p.farmer_id,
        p.project_id,
        p.name,
        p.description,
        p.price_usd,
        p.price_gyt,
        p.stock,
        p.category,
        p.origin_country,
        p.origin_region,
        p.organic_certified,
        p.certification_number,
        p.harvest_date,
        p.expiry_date,
        p.weight_kg,
        p.nft_id,
        CAST(p.nft_metadata AS CHAR) as nft_metadata,
        p.qr_code,
        CAST(p.images AS CHAR) as images,
        p.is_active,
        p.created_at,
        p.updated_at,
        u.full_name as farmer_name,
        u.country as farmer_country,
        pr.title as project_title
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN projects pr ON p.project_id = pr.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(`
      SELECT 
        p.id,
        p.farmer_id,
        p.project_id,
        p.name,
        p.description,
        p.price_usd,
        p.price_gyt,
        p.stock,
        p.category,
        p.origin_country,
        p.origin_region,
        p.organic_certified,
        p.certification_number,
        p.harvest_date,
        p.expiry_date,
        p.weight_kg,
        p.nft_id,
        CAST(p.nft_metadata AS CHAR) as nft_metadata,
        p.qr_code,
        CAST(p.images AS CHAR) as images,
        p.is_active,
        p.created_at,
        p.updated_at,
        u.full_name as farmer_name,
        u.country as farmer_country,
        u.city as farmer_city,
        pr.title as project_title,
        pr.description as project_description
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN projects pr ON p.project_id = pr.id
      WHERE p.id = ? AND p.is_active = true
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: products[0]
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create product (farmer only)
router.post('/', authenticateToken, requireFarmer, [
  body('name').trim().isLength({ min: 3, max: 255 }),
  body('description').trim().isLength({ min: 20 }),
  body('priceUsd').isDecimal({ decimal_digits: '0,2' }),
  body('stock').isInt({ min: 0 }),
  body('category').isIn(['cereals', 'fruits', 'vegetables', 'honey', 'dairy', 'meat', 'other']),
  body('originCountry').trim().isLength({ min: 2, max: 100 }),
  body('harvestDate').optional().isISO8601()
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

    const {
      name,
      description,
      priceUsd,
      stock,
      category,
      originCountry,
      originRegion,
      organicCertified = false,
      certificationNumber,
      harvestDate,
      expiryDate,
      weightKg,
      images,
      projectId
    } = req.body;

    // Convert USD to GYT (1:1 for now)
    const priceGyt = priceUsd;

    const result = await query(`
      INSERT INTO products (
        farmer_id, project_id, name, description, price_usd, price_gyt,
        stock, category, origin_country, origin_region, organic_certified,
        certification_number, harvest_date, expiry_date, weight_kg, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, projectId || null, name, description, priceUsd, priceGyt,
      stock, category, originCountry, originRegion || null, organicCertified,
      certificationNumber || null, harvestDate || null, expiryDate || null, 
      weightKg || null, JSON.stringify(images || [])
    ]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        productId: result.insertId
      }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Get farmer's products
router.get('/farmer/my-products', authenticateToken, requireFarmer, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const products = await query(`
      SELECT 
        p.*,
        pr.title as project_title
      FROM products p
      LEFT JOIN projects pr ON p.project_id = pr.id
      WHERE p.farmer_id = ?
      ORDER BY p.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, [req.user.id]);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM products
      WHERE farmer_id = ?
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Update product stock
router.patch('/:id/stock', authenticateToken, requireFarmer, [
  body('stock').isInt({ min: 0 })
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
    const { stock } = req.body;

    // Check if product belongs to farmer
    const products = await query(
      'SELECT id FROM products WHERE id = ? AND farmer_id = ?',
      [id, req.user.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await query(
      'UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [stock, id]
    );

    res.json({
      success: true,
      message: 'Product stock updated successfully'
    });

  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product stock'
    });
  }
});

// Get product traceability (NFT info)
router.get('/:id/traceability', async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(`
      SELECT 
        p.nft_id,
        p.nft_metadata,
        p.qr_code,
        p.harvest_date,
        p.origin_country,
        p.origin_region,
        p.organic_certified,
        p.certification_number,
        u.full_name as farmer_name,
        pr.title as project_title
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN projects pr ON p.project_id = pr.id
      WHERE p.id = ? AND p.is_active = true
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    let metadata = null;
    if (product.nft_metadata) {
      try {
        metadata = JSON.parse(product.nft_metadata);
      } catch (error) {
        console.error('Error parsing NFT metadata:', error);
        metadata = null;
      }
    }

    res.json({
      success: true,
      data: {
        nftId: product.nft_id,
        metadata: metadata,
        qrCode: product.qr_code,
        traceability: {
          harvestDate: product.harvest_date,
          origin: {
            country: product.origin_country,
            region: product.origin_region
          },
          certification: {
            organic: product.organic_certified,
            number: product.certification_number
          },
          farmer: product.farmer_name,
          project: product.project_title
        }
      }
    });

  } catch (error) {
    console.error('Get product traceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product traceability'
    });
  }
});

module.exports = router;
