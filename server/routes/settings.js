const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM settings');
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// Get specific setting by key
router.get('/:key', async (req, res) => {
  try {
    const settings = await db.query('SELECT * FROM settings WHERE setting_key = ?', [req.params.key]);
    
    if (settings.length === 0) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    
    res.json({ value: settings[0].setting_value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ message: 'Error fetching setting', error: error.message });
  }
});

// Update setting (admin only)
router.put('/:key', authenticateToken, requireAdmin, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  
  if (!value) {
    return res.status(400).json({ message: 'Value is required' });
  }
  
  try {
    // Check if setting exists
    const existingSettings = await db.query('SELECT * FROM settings WHERE setting_key = ?', [key]);
    
    if (existingSettings.length === 0) {
      // Create new setting
      await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', [key, value]);
    } else {
      // Update existing setting
      await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [value, key]);
    }
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ message: 'Error updating setting', error: error.message });
  }
});

module.exports = router;