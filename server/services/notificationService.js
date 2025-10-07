const { query } = require('../config/database');

/**
 * Notification Service with WebSocket support
 * Manages real-time notifications using Socket.IO
 */

let io = null;

// Initialize Socket.IO instance
function initializeSocket(socketIO) {
  io = socketIO;
  console.log('✅ Notification service initialized with Socket.IO');
}

// Get Socket.IO instance
function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initializeSocket first.');
  }
  return io;
}

/**
 * Send notification to specific user
 * @param {number} userId - Target user ID
 * @param {object} notification - Notification data
 */
async function sendNotificationToUser(userId, notification) {
  try {
    // Save to database
    const result = await query(`
      INSERT INTO notifications (user_id, title, message, type, data)
      VALUES (?, ?, ?, ?, ?)
    `, [
      userId,
      notification.title,
      notification.message,
      notification.type || 'info',
      notification.data ? JSON.stringify(notification.data) : null
    ]);

    const notificationId = result.insertId;

    // Send via WebSocket if user is connected
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        id: notificationId,
        ...notification,
        created_at: new Date().toISOString(),
        is_read: false
      });
    }

    return notificationId;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * Send notification to all admins/moderators
 * @param {object} notification - Notification data
 */
async function sendNotificationToAdmins(notification) {
  try {
    // Get all admin/moderator user IDs
    const admins = await query(`
      SELECT id FROM users WHERE role IN ('admin', 'moderator') AND is_active = 1
    `);

    // Send to each admin
    const promises = admins.map(admin => 
      sendNotificationToUser(admin.id, notification)
    );

    await Promise.all(promises);

    // Also broadcast via WebSocket to admin room
    if (io) {
      io.to('admins').emit('admin_notification', {
        ...notification,
        created_at: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}

/**
 * Broadcast system announcement to all users
 * @param {object} notification - Notification data
 */
async function broadcastToAllUsers(notification) {
  try {
    // Get all active users
    const users = await query(`
      SELECT id FROM users WHERE is_active = 1
    `);

    // Send to each user
    const promises = users.map(user => 
      sendNotificationToUser(user.id, notification)
    );

    await Promise.all(promises);

    // Also broadcast via WebSocket
    if (io) {
      io.emit('system_announcement', {
        ...notification,
        created_at: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error broadcasting to all users:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID (for security check)
 */
async function markAsRead(notificationId, userId) {
  try {
    await query(`
      UPDATE notifications 
      SET is_read = 1, read_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [notificationId, userId]);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Get unread notification count for user
 * @param {number} userId - User ID
 */
async function getUnreadCount(userId) {
  try {
    const [result] = await query(`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ? AND is_read = 0
    `, [userId]);

    return result.count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToAdmins,
  broadcastToAllUsers,
  markAsRead,
  getUnreadCount
};
