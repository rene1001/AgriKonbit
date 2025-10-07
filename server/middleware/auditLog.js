const { query } = require('../config/database');

/**
 * Log admin/moderator actions to admin_actions table
 * @param {number} adminId - ID of the admin/moderator performing the action
 * @param {string} actionType - Type of action (e.g., 'user.activate', 'project.approve')
 * @param {string} targetType - Type of target (e.g., 'user', 'project', 'product')
 * @param {number} targetId - ID of the target entity
 * @param {object} details - Additional details about the action
 * @param {object} req - Express request object (for IP and user agent)
 */
async function logAdminAction(adminId, actionType, targetType, targetId, details = {}, req = null) {
  try {
    const ipAddress = req ? (req.ip || req.connection.remoteAddress) : null;
    const userAgent = req ? req.get('user-agent') : null;

    await query(`
      INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      adminId,
      actionType,
      targetType,
      targetId || null,
      JSON.stringify(details),
      ipAddress,
      userAgent
    ]);
  } catch (error) {
    console.error('Error logging admin action:', error);
    // Don't throw - logging failure shouldn't break the main action
  }
}

/**
 * Middleware to automatically log admin actions
 * Add to routes where you want automatic logging
 */
function auditLogMiddleware(actionType, targetType) {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to log after successful response
    res.json = function(data) {
      // Only log if action was successful
      if (data.success !== false) {
        const adminId = req.user?.id;
        const targetId = req.params.id || req.body.id;
        const details = {
          body: req.body,
          params: req.params,
          query: req.query
        };

        // Log asynchronously (don't wait)
        logAdminAction(adminId, actionType, targetType, targetId, details, req)
          .catch(err => console.error('Audit log failed:', err));
      }

      // Call original json method
      return originalJson(data);
    };

    next();
  };
}

/**
 * Get audit logs with filters
 */
async function getAuditLogs(filters = {}) {
  const { adminId, actionType, targetType, startDate, endDate, page = 1, limit = 50 } = filters;
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 50;
  const offset = (pageNum - 1) * limitNum;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (adminId) {
    whereClause += ' AND a.admin_id = ?';
    params.push(adminId);
  }

  if (actionType) {
    whereClause += ' AND a.action_type = ?';
    params.push(actionType);
  }

  if (targetType) {
    whereClause += ' AND a.target_type = ?';
    params.push(targetType);
  }

  if (startDate) {
    whereClause += ' AND a.created_at >= ?';
    params.push(startDate);
  }

  if (endDate) {
    whereClause += ' AND a.created_at <= ?';
    params.push(endDate);
  }

  const logs = await query(`
    SELECT 
      a.*,
      u.full_name as admin_name,
      u.email as admin_email,
      u.role as admin_role
    FROM admin_actions a
    JOIN users u ON a.admin_id = u.id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT ${limitNum} OFFSET ${offset}
  `, params);

  const countResult = await query(`
    SELECT COUNT(*) as total
    FROM admin_actions a
    ${whereClause}
  `, params);

  return {
    logs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: countResult[0]?.total || 0,
      pages: Math.ceil((countResult[0]?.total || 0) / limitNum)
    }
  };
}

module.exports = {
  logAdminAction,
  auditLogMiddleware,
  getAuditLogs
};
