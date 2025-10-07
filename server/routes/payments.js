const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Simulate Stripe payment
router.post('/stripe/create-payment-intent', authenticateToken, [
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('currency').isIn(['usd']),
  body('type').isIn(['investment', 'purchase', 'deposit'])
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

    const { amount, currency, type, metadata = {} } = req.body;

    // In a real implementation, this would create a Stripe PaymentIntent
    // For simulation, we'll generate a mock payment intent
    const paymentIntentId = `pi_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      data: {
        clientSecret: `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 24)}`,
        paymentIntentId,
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toUpperCase(),
        status: 'requires_payment_method'
      }
    });

  } catch (error) {
    console.error('Create Stripe payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// Confirm Stripe payment
router.post('/stripe/confirm-payment', authenticateToken, [
  body('paymentIntentId').notEmpty(),
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('type').isIn(['investment', 'purchase', 'deposit'])
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

    const { paymentIntentId, amount, type, metadata = {} } = req.body;

    // In a real implementation, this would confirm the payment with Stripe
    // For simulation, we'll just return success
    const gytAmount = amount; // 1:1 conversion for simulation

    if (type === 'deposit') {
      // Add GYT to user's wallet
      await query(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance + ?,
            total_deposited_usd = total_deposited_usd + ?,
            total_deposited_gyt = total_deposited_gyt + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [gytAmount, amount, gytAmount, req.user.id]);
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentIntentId,
        amount,
        gytAmount,
        type,
        status: 'succeeded'
      }
    });

  } catch (error) {
    console.error('Confirm Stripe payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
});

// Simulate PayPal payment
router.post('/paypal/create-order', authenticateToken, [
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('currency').isIn(['USD']),
  body('type').isIn(['investment', 'purchase', 'deposit'])
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

    const { amount, currency, type, metadata = {} } = req.body;

    // In a real implementation, this would create a PayPal order
    // For simulation, we'll generate a mock order ID
    const orderId = `PAYPAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      data: {
        orderId,
        amount,
        currency,
        status: 'CREATED',
        approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`
      }
    });

  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order'
    });
  }
});

// Confirm PayPal payment
router.post('/paypal/capture-order', authenticateToken, [
  body('orderId').notEmpty(),
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('type').isIn(['investment', 'purchase', 'deposit'])
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

    const { orderId, amount, type, metadata = {} } = req.body;

    // In a real implementation, this would capture the PayPal order
    // For simulation, we'll just return success
    const gytAmount = amount; // 1:1 conversion for simulation

    if (type === 'deposit') {
      // Add GYT to user's wallet
      await query(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance + ?,
            total_deposited_usd = total_deposited_usd + ?,
            total_deposited_gyt = total_deposited_gyt + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [gytAmount, amount, gytAmount, req.user.id]);
    }

    res.json({
      success: true,
      message: 'PayPal payment captured successfully',
      data: {
        orderId,
        amount,
        gytAmount,
        type,
        status: 'COMPLETED'
      }
    });

  } catch (error) {
    console.error('Capture PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal payment'
    });
  }
});

// Simulate MetaMask payment
router.post('/metamask/send-transaction', authenticateToken, [
  body('to').isLength({ min: 42, max: 42 }),
  body('value').isDecimal({ decimal_digits: '0,4' }),
  body('type').isIn(['investment', 'purchase', 'deposit'])
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

    const { to, value, type, metadata = {} } = req.body;

    // In a real implementation, this would interact with MetaMask
    // For simulation, we'll generate a mock transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    const gytAmount = value; // 1:1 conversion for simulation

    if (type === 'deposit') {
      // Add GYT to user's wallet
      await query(`
        UPDATE user_wallets 
        SET gyt_balance = gyt_balance + ?,
            total_deposited_usd = total_deposited_usd + ?,
            total_deposited_gyt = total_deposited_gyt + ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [gytAmount, value, gytAmount, req.user.id]);
    }

    res.json({
      success: true,
      message: 'MetaMask transaction sent successfully',
      data: {
        txHash,
        to,
        value,
        gytAmount,
        type,
        status: 'confirmed',
        blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
        gasUsed: Math.floor(Math.random() * 100000) + 50000
      }
    });

  } catch (error) {
    console.error('MetaMask transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send MetaMask transaction'
    });
  }
});

// Get payment methods
router.get('/methods', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        methods: [
          {
            id: 'stripe',
            name: 'Credit Card',
            type: 'card',
            icon: 'credit-card',
            enabled: true,
            fees: '2.9% + $0.30'
          },
          {
            id: 'paypal',
            name: 'PayPal',
            type: 'paypal',
            icon: 'paypal',
            enabled: true,
            fees: '2.9% + $0.30'
          },
          {
            id: 'metamask',
            name: 'MetaMask',
            type: 'crypto',
            icon: 'metamask',
            enabled: true,
            fees: 'Gas fees only'
          },
          {
            id: 'gyt_wallet',
            name: 'GYT Wallet',
            type: 'gyt',
            icon: 'wallet',
            enabled: true,
            fees: 'No fees'
          }
        ]
      }
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
});

module.exports = router;
