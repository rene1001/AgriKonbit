const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get GYT token info
router.get('/gyt/info', async (req, res) => {
  try {
    // In a real implementation, this would fetch from the blockchain
    // For simulation, return static data
    res.json({
      success: true,
      data: {
        name: 'AgriKonbit Yield Token',
        symbol: 'GYT',
        decimals: 4,
        totalSupply: '1000000',
        contractAddress: process.env.CONTRACT_ADDRESS_GYT || '0x...',
        usdRate: 1.0, // 1 GYT = 1 USD
        network: 'Polygon Mumbai'
      }
    });

  } catch (error) {
    console.error('Get GYT info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GYT token info'
    });
  }
});

// Get user's GYT balance
router.get('/gyt/balance', authenticateToken, async (req, res) => {
  try {
    const wallets = await query(
      'SELECT gyt_balance FROM user_wallets WHERE user_id = ?',
      [req.user.id]
    );

    const balance = wallets.length > 0 ? wallets[0].gyt_balance : 0;

    res.json({
      success: true,
      data: {
        balance: parseFloat(balance),
        symbol: 'GYT',
        usdValue: parseFloat(balance) * 1.0 // 1:1 rate
      }
    });

  } catch (error) {
    console.error('Get GYT balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GYT balance'
    });
  }
});

// Get GYT transaction history
router.get('/gyt/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Get investment transactions
    const investments = await query(`
      SELECT 
        'investment' as type,
        i.amount_gyt as amount,
        'out' as direction,
        i.created_at,
        p.title as description,
        'GYT' as symbol
      FROM investments i
      JOIN projects p ON i.project_id = p.id
      WHERE i.investor_id = ?
      ORDER BY i.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        transactions: investments,
        pagination: {
          page: pageNum,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get GYT transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GYT transactions'
    });
  }
});

// Get NFT info for product traceability
router.get('/nft/:nftId', async (req, res) => {
  try {
    const { nftId } = req.params;

    // Get product with NFT info
    const products = await query(`
      SELECT 
        p.*,
        u.full_name as farmer_name,
        u.country as farmer_country,
        pr.title as project_title
      FROM products p
      JOIN users u ON p.farmer_id = u.id
      LEFT JOIN projects pr ON p.project_id = pr.id
      WHERE p.nft_id = ?
    `, [nftId]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }

    const product = products[0];

    // Parse NFT metadata
    let metadata = {};
    if (product.nft_metadata) {
      try {
        metadata = JSON.parse(product.nft_metadata);
      } catch (error) {
        console.error('Error parsing NFT metadata:', error);
        metadata = {};
      }
    }

    // Parse images safely
    let image = null;
    if (product.images) {
      try {
        const images = JSON.parse(product.images);
        image = images[0] || null;
      } catch (error) {
        console.error('Error parsing product images:', error);
        image = null;
      }
    }

    res.json({
      success: true,
      data: {
        nftId: product.nft_id,
        name: product.name,
        description: product.description,
        image: image,
        attributes: [
          {
            trait_type: 'Origin Country',
            value: product.origin_country
          },
          {
            trait_type: 'Origin Region',
            value: product.origin_region
          },
          {
            trait_type: 'Harvest Date',
            value: product.harvest_date
          },
          {
            trait_type: 'Organic Certified',
            value: product.organic_certified
          },
          {
            trait_type: 'Farmer',
            value: product.farmer_name
          },
          {
            trait_type: 'Project',
            value: product.project_title
          }
        ],
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
          farmer: {
            name: product.farmer_name,
            country: product.farmer_country
          },
          project: product.project_title
        },
        metadata,
        contractAddress: process.env.CONTRACT_ADDRESS_NFT || '0x...',
        network: 'Polygon Mumbai'
      }
    });

  } catch (error) {
    console.error('Get NFT info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT info'
    });
  }
});

// Generate QR code for product traceability
router.get('/product/:productId/qr', async (req, res) => {
  try {
    const { productId } = req.params;

    const products = await query(
      'SELECT nft_id FROM products WHERE id = ? AND is_active = true',
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];
    const qrData = {
      nftId: product.nft_id,
      productId: productId,
      traceabilityUrl: `${process.env.FRONTEND_URL}/traceability/${product.nft_id}`,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: {
        qrData,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`
      }
    });

  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
});

// Verify blockchain transaction
router.post('/verify-transaction', authenticateToken, async (req, res) => {
  try {
    const { txHash, type } = req.body;

    // In a real implementation, this would verify the transaction on the blockchain
    // For simulation, we'll just return success
    res.json({
      success: true,
      data: {
        verified: true,
        txHash,
        type,
        blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
        gasUsed: Math.floor(Math.random() * 100000) + 50000,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Verify transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify transaction'
    });
  }
});

// Top up GYT balance (simulate deposit via provider)
router.post('/gyt/topup', authenticateToken, [
  body('amountGyt').isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) > 0),
  body('provider').isIn(['stripe', 'paypal', 'metamask'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { amountGyt, provider } = req.body;
    const amount = parseFloat(amountGyt);

    await query(`
      UPDATE user_wallets
      SET gyt_balance = gyt_balance + ?, total_deposited_gyt = total_deposited_gyt + ?, updated_at = NOW()
      WHERE user_id = ?
    `, [amount, amount, req.user.id]);

    // Log transaction
    await query(`
      INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type)
      VALUES (?, 'deposit', ?, 'completed', ?, 'wallet')
    `, [req.user.id, amount, `Top up via ${provider}`]);

    res.status(201).json({ success: true, message: 'Top up successful' });
  } catch (error) {
    console.error('GYT topup error:', error);
    res.status(500).json({ success: false, message: 'Failed to top up' });
  }
});

// Convert GYT to fiat (simulate)
router.post('/gyt/convert', authenticateToken, [
  body('direction').equals('gyt_to_fiat'),
  body('amountGyt').isDecimal({ decimal_digits: '0,4' }).custom(v => parseFloat(v) > 0),
  body('currency').isIn(['USD'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { amountGyt, currency } = req.body;
    const amount = parseFloat(amountGyt);

    // Check balance
    const wallets = await query('SELECT gyt_balance FROM user_wallets WHERE user_id = ?', [req.user.id]);
    const balance = wallets.length ? parseFloat(wallets[0].gyt_balance) : 0;
    if (amount > balance) {
      return res.status(400).json({ success: false, message: 'Insufficient GYT balance' });
    }

    // Deduct and log
    await query(`
      UPDATE user_wallets
      SET gyt_balance = gyt_balance - ?, updated_at = NOW()
      WHERE user_id = ?
    `, [amount, req.user.id]);

    await query(`
      INSERT INTO transactions (user_id, type, amount_gyt, status, description, reference_type)
      VALUES (?, 'conversion', ?, 'completed', ?, 'wallet')
    `, [req.user.id, amount, `Convert ${amount} GYT to ${currency}`]);

    res.json({ success: true, message: 'Conversion completed', data: { amountGyt: amount, currency, rate: 1.0, amountFiat: amount } });
  } catch (error) {
    console.error('GYT convert error:', error);
    res.status(500).json({ success: false, message: 'Failed to convert' });
  }
});

module.exports = router;
