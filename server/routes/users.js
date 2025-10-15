const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const userId = req.user?.id || 'user';
    cb(null, `profile-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés: JPG, PNG, GIF, WEBP'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        u.id, u.email, u.full_name, u.role, u.phone, u.country, 
        u.city, u.address, u.profile_image, 
        COALESCE(u.bio, '') as bio, 
        COALESCE(u.theme_preference, 'light') as theme_preference, 
        u.kyc_status,
        COALESCE(uw.gyt_balance, 0) as gyt_balance, 
        COALESCE(uw.total_deposited_usd, 0) as total_deposited_usd, 
        COALESCE(uw.total_deposited_gyt, 0) as total_deposited_gyt,
        COALESCE(uw.total_spent_gyt, 0) as total_spent_gyt
      FROM users u
      LEFT JOIN user_wallets uw ON u.id = uw.user_id
      WHERE u.id = ?
    `, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('country').optional().trim().isLength({ min: 2 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('address').optional().trim().isLength({ min: 5 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('themePreference').optional().isIn(['light', 'dark', 'auto'])
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

    const { fullName, phone, country, city, address, bio, themePreference } = req.body;

    // Build update query
    const updateFields = [];
    const values = [];

    if (fullName) {
      updateFields.push('full_name = ?');
      values.push(fullName);
    }

    if (phone) {
      updateFields.push('phone = ?');
      values.push(phone);
    }

    if (country) {
      updateFields.push('country = ?');
      values.push(country);
    }

    if (city) {
      updateFields.push('city = ?');
      values.push(city);
    }

    if (address) {
      updateFields.push('address = ?');
      values.push(address);
    }

    if (bio !== undefined) {
      updateFields.push('bio = ?');
      values.push(bio);
    }

    if (themePreference) {
      updateFields.push('theme_preference = ?');
      values.push(themePreference);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(req.user.id);

    await query(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Le fichier est trop volumineux (max 5 Mo)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Erreur d'upload: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Erreur lors de l\'upload'
    });
  }
  next();
};

// Upload profile image  
router.post('/profile/image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  console.log('\n═══ UPLOAD DEBUG ═══');
  console.log('User:', req.user?.id);
  console.log('File:', req.file ? 'YES' : 'NO');
  if (req.file) {
    console.log('Details:', req.file.originalname, req.file.size, 'bytes');
  }
  console.log('═══════════════════\n');
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucune image uploadée'
      });
    }

    // Get old profile image
    const [user] = await query(
      'SELECT profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    // Delete old image if exists
    if (user && user.profile_image) {
      const oldImagePath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profile_image));
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
    }

    // Update profile image path in database
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    await query(
      'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [imagePath, req.user.id]
    );

    console.log('✅ Image uploaded successfully:', imagePath);

    res.json({
      success: true,
      data: {
        profile_image: imagePath
      },
      message: 'Photo de profil uploadée avec succès'
    });

  } catch (error) {
    console.error('Upload profile image error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image'
    });
  }
});

// Delete profile image
router.delete('/profile/image', authenticateToken, async (req, res) => {
  try {
    // Get current profile image
    const [user] = await query(
      'SELECT profile_image FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user || !user.profile_image) {
      return res.status(404).json({
        success: false,
        message: 'Aucune photo de profil à supprimer'
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../../uploads/profiles', path.basename(user.profile_image));
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log('✅ Image file deleted:', imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    // Update database
    await query(
      'UPDATE users SET profile_image = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.user.id]
    );

    console.log('✅ Profile image deleted for user:', req.user.id);

    res.json({
      success: true,
      message: 'Photo de profil supprimée avec succès'
    });

  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la photo'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
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

    const { currentPassword, newPassword } = req.body;

    // Get current password hash
    const users = await query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Get user notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE user_id = ?';
    let params = [req.user.id];

    if (unreadOnly === 'true') {
      whereClause += ' AND is_read = false';
    }

    const notifications = await query(`
      SELECT * FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get total count
    const [countResult] = await query(`
      SELECT COUNT(*) as total
      FROM notifications
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      'UPDATE notifications SET is_read = true WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.patch('/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = ? AND is_read = false',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

module.exports = router;
