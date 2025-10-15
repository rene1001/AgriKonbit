const jwt = require('jsonwebtoken');
const { query } = require('./database');

/**
 * Initialize Socket.IO with authentication and rooms
 * @param {object} io - Socket.IO server instance
 */
function initializeSocket(io) {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.warn('Socket connection attempt without token');
        return next(new Error('Authentication error: No token provided'));
      }

      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return next(new Error('Server configuration error'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const users = await query('SELECT id, email, full_name, role, is_active FROM users WHERE id = ?', [decoded.userId]);
      
      if (users.length === 0) {
        console.warn(`Socket authentication failed: User ${decoded.userId} not found`);
        return next(new Error('Authentication error: User not found'));
      }

      const user = users[0];

      // Check if user is active
      if (!user.is_active) {
        console.warn(`Socket authentication failed: User ${user.id} is deactivated`);
        return next(new Error('Authentication error: Account deactivated'));
      }

      socket.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        console.warn('Socket authentication failed: Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        console.warn('Socket authentication failed: Token expired');
      } else {
        console.error('Socket authentication error:', error.message);
      }
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    const user = socket.user;
    console.log(`✅ User connected: ${user.full_name} (${user.email}) [Socket ID: ${socket.id}]`);

    // Join user-specific room
    socket.join(`user_${user.id}`);

    // Join admin room if user is admin/moderator
    if (user.role === 'admin' || user.role === 'moderator') {
      socket.join('admins');
      console.log(`👤 Admin/Moderator joined admin room: ${user.full_name}`);
    }

    // Send welcome message with unread count
    socket.emit('connected', {
      message: 'Connected to AgriKonbit notifications',
      userId: user.id,
      role: user.role
    });

    // Handle custom events
    socket.on('mark_read', async (data) => {
      try {
        const { notificationId } = data;
        await query(
          'UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
          [notificationId, user.id]
        );
        socket.emit('notification_read', { notificationId });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('get_unread_count', async () => {
      try {
        const [result] = await query(
          'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
          [user.id]
        );
        socket.emit('unread_count', { count: result.count });
      } catch (error) {
        console.error('Error getting unread count:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${user.full_name} [Socket ID: ${socket.id}]`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${user.id}:`, error);
    });
  });

  return io;
}

module.exports = { initializeSocket };
