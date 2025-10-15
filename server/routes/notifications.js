const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const { getIO } = require('../config/io');

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE user_id = ?';
    let params = [req.user.id];

    if (unread_only === 'true') {
      whereClause += ' AND is_read = false';
    }

    const notifications = await query(`
      SELECT 
        id,
        title,
        message,
        type,
        is_read,
        created_at,
        data
      FROM notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `, params);

    // Get unread count
    const [unreadResult] = await query(`
      SELECT COUNT(*) as unread_count
      FROM notifications
      WHERE user_id = ? AND is_read = false
    `, [req.user.id]);

    res.json({
      success: true,
      data: {
        notifications,
        unread_count: unreadResult.unread_count,
        pagination: {
          page: pageNum,
          limit: limitNum
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
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await query(`
      UPDATE notifications 
      SET is_read = true
      WHERE id = ? AND user_id = ?
    `, [id, req.user.id]);

    // Emit updated unread count
    try {
      const [r] = await query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [req.user.id]
      );
      const io = getIO();
      if (io) io.to(`user_${req.user.id}`).emit('unread_count', { count: r.count });
    } catch (_) {}

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
router.patch('/read-all', authenticateToken, async (req, res) => {
  try {
    await query(`
      UPDATE notifications 
      SET is_read = true
      WHERE user_id = ? AND is_read = false
    `, [req.user.id]);

    // Emit updated unread count
    try {
      const [r] = await query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [req.user.id]
      );
      const io = getIO();
      if (io) io.to(`user_${req.user.id}`).emit('unread_count', { count: r.count });
    } catch (_) {}

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

// Create notification (internal use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, title, message, type = 'info', data = null } = req.body;

    const result = await query(`
      INSERT INTO notifications (user_id, title, message, type, data, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [user_id, title, message, type, JSON.stringify(data)]);

    // Emit new notification and updated unread count
    try {
      const io = getIO();
      if (io) {
        io.to(`user_${user_id}`).emit('notification:new', {
          id: result.insertId,
          title,
          message,
          type,
          data
        });
        const [r] = await query(
          'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
          [user_id]
        );
        io.to(`user_${user_id}`).emit('unread_count', { count: r.count });
      }
    } catch (_) {}

    res.json({
      success: true,
      data: {
        id: result.insertId,
        message: 'Notification created successfully'
      }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Delete a notification
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Emit updated unread count
    try {
      const [r] = await query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
        [req.user.id]
      );
      const io = getIO();
      if (io) io.to(`user_${req.user.id}`).emit('unread_count', { count: r.count });
    } catch (_) {}

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification' });
  }
});

module.exports = router;
