const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().isLength({ min: 2 }),
  body('role').isIn(['investor', 'farmer', 'consumer'])
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

    const { email, password, fullName, role, walletAddress } = req.body;

    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    // Use 10 rounds in development for better performance, 12 in production for security
    const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await transaction(async (connection) => {
      // Insert user
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password_hash, full_name, role, wallet_address) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, fullName, role, walletAddress || null]
      );

      const userId = userResult.insertId;

      // Create wallet for the user
      await connection.execute(
        'INSERT INTO user_wallets (user_id) VALUES (?)',
        [userId]
      );

      return { userId, email, fullName, role };
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.userId, email: result.email, role: result.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: result.userId,
          email: result.email,
          fullName: result.fullName,
          role: result.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
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

    const { email, password } = req.body;

    // Get user
    const users = await query(
      'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Web3 Login (simulate MetaMask)
router.post('/web3-login', [
  body('walletAddress').isLength({ min: 42, max: 42 }),
  body('signature').notEmpty()
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

    const { walletAddress, signature } = req.body;

    // In a real implementation, you would verify the signature here
    // For simulation, we'll just check if the wallet exists

    // Get user by wallet address
    const users = await query(
      'SELECT id, email, full_name, role, is_active FROM users WHERE wallet_address = ?',
      [walletAddress]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not registered. Please register first.'
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Web3 login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Web3 login error:', error);
    res.status(500).json({
      success: false,
      message: 'Web3 login failed'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get user wallet balance
    const wallets = await query(
      'SELECT gyt_balance FROM user_wallets WHERE user_id = ?',
      [req.user.id]
    );

    const wallet = wallets[0] || { gyt_balance: 0 };

    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          fullName: req.user.full_name,
          role: req.user.role,
          gytBalance: parseFloat(wallet.gyt_balance) || 0
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
