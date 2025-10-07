const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get conversations for the authenticated user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user is sender or recipient
    const conversations = await query(`
      SELECT 
        c.*,
        CASE 
          WHEN c.user1_id = ? THEN c.user2_id
          ELSE c.user1_id
        END as other_user_id,
        CASE 
          WHEN c.user1_id = ? THEN u2.full_name
          ELSE u1.full_name
        END as other_user_name,
        CASE 
          WHEN c.user1_id = ? THEN u2.role
          ELSE u1.role
        END as other_user_role,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.receiver_id = ? 
         AND m.is_read = false) as unread_count,
        (SELECT content FROM messages m 
         WHERE m.conversation_id = c.id 
         ORDER BY m.created_at DESC 
         LIMIT 1) as last_message,
        (SELECT created_at FROM messages m 
         WHERE m.conversation_id = c.id 
         ORDER BY m.created_at DESC 
         LIMIT 1) as last_message_at
      FROM conversations c
      JOIN users u1 ON c.user1_id = u1.id
      JOIN users u2 ON c.user2_id = u2.id
      WHERE c.user1_id = ? OR c.user2_id = ?
      ORDER BY last_message_at DESC
    `, [userId, userId, userId, userId, userId, userId]);

    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// Get messages in a conversation
router.get('/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    // Verify user is part of this conversation
    const [conversation] = await query(
      'SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [id, userId, userId]
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get messages
    const messages = await query(`
      SELECT 
        m.*,
        u.full_name as sender_name,
        u.role as sender_role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `, [id]);

    // Mark messages as read
    await query(
      'UPDATE messages SET is_read = true WHERE conversation_id = ? AND receiver_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      data: { messages: messages.reverse() } // Reverse to show oldest first
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Send a message
router.post('/send', authenticateToken, [
  body('receiver_id').isInt(),
  body('content').trim().notEmpty().isLength({ max: 2000 }),
  body('subject').optional().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { receiver_id, content, subject } = req.body;
    const senderId = req.user.id;

    // Check if receiver exists
    const [receiver] = await query('SELECT id FROM users WHERE id = ?', [receiver_id]);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Check if conversation exists
    let [conversation] = await query(
      'SELECT id FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [senderId, receiver_id, receiver_id, senderId]
    );

    // Create conversation if doesn't exist
    if (!conversation) {
      const result = await query(
        'INSERT INTO conversations (user1_id, user2_id, created_at) VALUES (?, ?, NOW())',
        [senderId, receiver_id]
      );
      conversation = { id: result.insertId };
    }

    // Insert message
    const messageResult = await query(`
      INSERT INTO messages (
        conversation_id, sender_id, receiver_id, content, subject, created_at
      ) VALUES (?, ?, ?, ?, ?, NOW())
    `, [conversation.id, senderId, receiver_id, content, subject || null]);

    // Update conversation timestamp
    await query(
      'UPDATE conversations SET updated_at = NOW() WHERE id = ?',
      [conversation.id]
    );

    // Create notification for receiver
    await query(`
      INSERT INTO notifications (user_id, type, title, message, created_at)
      VALUES (?, 'new_message', ?, ?, NOW())
    `, [
      receiver_id,
      subject || 'Nouveau message',
      `${req.user.full_name} vous a envoyé un message`
    ]);

    res.json({
      success: true,
      data: {
        message_id: messageResult.insertId,
        conversation_id: conversation.id
      },
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get user's investors (for farmer to message)
router.get('/farmer/investors-list', authenticateToken, async (req, res) => {
  try {
    const investors = await query(`
      SELECT DISTINCT
        u.id,
        u.full_name,
        u.email,
        u.role,
        COUNT(i.id) as investment_count,
        SUM(i.amount_gyt) as total_invested_gyt
      FROM users u
      JOIN investments i ON u.id = i.investor_id
      JOIN projects p ON i.project_id = p.id
      WHERE p.farmer_id = ? AND i.status = 'completed'
      GROUP BY u.id
      ORDER BY total_invested_gyt DESC
    `, [req.user.id]);

    res.json({
      success: true,
      data: { investors }
    });
  } catch (error) {
    console.error('Get investors list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investors'
    });
  }
});

// Get admins (for farmer to contact support)
router.get('/admins', authenticateToken, async (req, res) => {
  try {
    const admins = await query(`
      SELECT id, full_name, email, role
      FROM users
      WHERE role = 'admin' AND is_active = true
      ORDER BY full_name
    `);

    res.json({
      success: true,
      data: { admins }
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins'
    });
  }
});

// Delete a message (soft delete)
router.delete('/messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify user owns the message
    const [message] = await query(
      'SELECT * FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)',
      [id, userId, userId]
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Soft delete
    await query(
      'UPDATE messages SET is_deleted = true WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// Admin: Broadcast private messages to many recipients (creates conversations and messages)
router.post('/admin/broadcast-private', authenticateToken, requireAdmin, [
  body('content').trim().notEmpty().isLength({ max: 2000 }),
  body('subject').optional().trim().isLength({ max: 200 }),
  body('scope').isIn(['all', 'role', 'users']).withMessage('scope must be one of all|role|users'),
  body('roles').optional().isArray(),
  body('userIds').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    }

    const { content, subject, scope, roles = [], userIds = [], includeAdmins = false } = req.body;
    const senderId = req.user.id;

    // Resolve recipients based on scope
    let recipients = [];
    if (scope === 'all') {
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true ${includeAdmins ? '' : "AND role != 'admin'"}`
      );
    } else if (scope === 'role') {
      if (!roles.length) {
        return res.status(400).json({ success: false, message: 'roles array required for scope=role' });
      }
      const inClause = roles.map(() => '?').join(',');
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true AND role IN (${inClause})` + (includeAdmins ? '' : " AND role != 'admin'"),
        roles
      );
    } else if (scope === 'users') {
      if (!userIds.length) {
        return res.status(400).json({ success: false, message: 'userIds array required for scope=users' });
      }
      const inClause = userIds.map(() => '?').join(',');
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true AND id IN (${inClause})`,
        userIds
      );
    }

    // Remove sender from recipients if present
    const recipientIds = recipients.map(r => r.id).filter(id => id !== senderId);

    let createdCount = 0;
    await transaction(async (conn) => {
      for (const rid of recipientIds) {
        // Find conversation (order user ids to respect unique key)
        const u1 = Math.min(senderId, rid);
        const u2 = Math.max(senderId, rid);
        const [existing] = await conn.execute(
          'SELECT id FROM conversations WHERE user1_id = ? AND user2_id = ?',
          [u1, u2]
        );
        let conversationId;
        if (existing.length > 0) {
          conversationId = existing[0].id;
        } else {
          const [ins] = await conn.execute(
            'INSERT INTO conversations (user1_id, user2_id, created_at) VALUES (?, ?, NOW())',
            [u1, u2]
          );
          conversationId = ins.insertId;
        }

        // Insert message
        await conn.execute(
          `INSERT INTO messages (conversation_id, sender_id, receiver_id, content, subject, created_at)
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [conversationId, senderId, rid, content, subject || null]
        );

        // Update conversation timestamp
        await conn.execute('UPDATE conversations SET updated_at = NOW() WHERE id = ?', [conversationId]);

        // Notification
        await conn.execute(
          `INSERT INTO notifications (user_id, type, title, message, created_at)
           VALUES (?, 'new_message', ?, ?, NOW())`,
          [rid, subject || 'Nouveau message', 'Vous avez reçu un message de l\'administration']
        );

        createdCount += 1;
      }
    });

    return res.json({ success: true, data: { recipients: recipientIds.length, created: createdCount }, message: 'Broadcast privé envoyé' });
  } catch (error) {
    console.error('Admin broadcast-private error:', error);
    return res.status(500).json({ success: false, message: 'Failed to broadcast private messages' });
  }
});

// Admin: Broadcast public announcement via notifications to many recipients
router.post('/admin/broadcast-notification', authenticateToken, requireAdmin, [
  body('message').trim().notEmpty().isLength({ max: 2000 }),
  body('title').optional().trim().isLength({ max: 200 }),
  body('scope').isIn(['all', 'role', 'users']).withMessage('scope must be one of all|role|users'),
  body('roles').optional().isArray(),
  body('userIds').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
    }

    const { title = 'Annonce', message, scope, roles = [], userIds = [], includeAdmins = false } = req.body;

    // Resolve recipients
    let recipients = [];
    if (scope === 'all') {
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true ${includeAdmins ? '' : "AND role != 'admin'"}`
      );
    } else if (scope === 'role') {
      if (!roles.length) return res.status(400).json({ success: false, message: 'roles array required for scope=role' });
      const inClause = roles.map(() => '?').join(',');
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true AND role IN (${inClause})` + (includeAdmins ? '' : " AND role != 'admin'"),
        roles
      );
    } else if (scope === 'users') {
      if (!userIds.length) return res.status(400).json({ success: false, message: 'userIds array required for scope=users' });
      const inClause = userIds.map(() => '?').join(',');
      recipients = await query(
        `SELECT id FROM users WHERE is_active = true AND id IN (${inClause})`,
        userIds
      );
    }

    const recipientIds = recipients.map(r => r.id);

    let createdCount = 0;
    await transaction(async (conn) => {
      for (const rid of recipientIds) {
        await conn.execute(
          `INSERT INTO notifications (user_id, type, title, message, created_at)
           VALUES (?, 'announcement', ?, ?, NOW())`,
          [rid, title, message]
        );
        createdCount += 1;
      }
    });

    return res.json({ success: true, data: { recipients: recipientIds.length, created: createdCount }, message: 'Annonce envoyée' });
  } catch (error) {
    console.error('Admin broadcast-notification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to broadcast announcement' });
  }
});

module.exports = router;
