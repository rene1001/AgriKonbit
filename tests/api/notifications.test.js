const request = require('supertest');
const app = require('../../server/index');
const { query } = require('../../server/config/database');

describe('Notifications API', () => {
  let authToken;
  let userId;
  let notificationId;

  beforeAll(async () => {
    // Create test user and login
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `test-notif-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Test User Notif',
        role: 'consumer'
      });
    
    authToken = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    // Cleanup test data
    if (userId) {
      await query('DELETE FROM notifications WHERE user_id = ?', [userId]);
      await query('DELETE FROM users WHERE id = ?', [userId]);
    }
  });

  describe('GET /api/notifications', () => {
    it('should return notifications list with unread count', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('notifications');
      expect(res.body.data).toHaveProperty('unread_count');
      expect(Array.isArray(res.body.data.notifications)).toBe(true);
    });

    it('should filter unread notifications only', async () => {
      const res = await request(app)
        .get('/api/notifications?unread_only=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.notifications.forEach(notif => {
        expect(notif.is_read).toBe(false);
      });
    });
  });

  describe('POST /api/notifications', () => {
    it('should create a notification for the user', async () => {
      const res = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: userId,
          title: 'Test Notification',
          message: 'This is a test notification',
          type: 'info'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      notificationId = res.body.data.id;
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify it's marked as read
      const checkRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const notif = checkRes.body.data.notifications.find(n => n.id === notificationId);
      expect(notif.is_read).toBe(true);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', async () => {
      // Create another notification
      await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          user_id: userId,
          title: 'Test Notification 2',
          message: 'Another test notification',
          type: 'info'
        });

      const res = await request(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify unread count is 0
      const checkRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(checkRes.body.data.unread_count).toBe(0);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      const res = await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Verify it's deleted
      const checkRes = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const notif = checkRes.body.data.notifications.find(n => n.id === notificationId);
      expect(notif).toBeUndefined();
    });
  });

  describe('Notification scoping', () => {
    it('should only return notifications for the authenticated user', async () => {
      // Create another user
      const otherUserRes = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-notif-other-${Date.now()}@test.com`,
          password: 'Test123!',
          fullName: 'Other User',
          role: 'consumer'
        });

      const otherToken = otherUserRes.body.data.token;
      const otherUserId = otherUserRes.body.data.user.id;

      // Create notification for other user
      await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          user_id: otherUserId,
          title: 'Other User Notification',
          message: 'This should not be visible to first user',
          type: 'info'
        });

      // Fetch notifications as first user
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should not see other user's notification
      const hasOtherNotif = res.body.data.notifications.some(
        n => n.title === 'Other User Notification'
      );
      expect(hasOtherNotif).toBe(false);

      // Cleanup
      await query('DELETE FROM notifications WHERE user_id = ?', [otherUserId]);
      await query('DELETE FROM users WHERE id = ?', [otherUserId]);
    });
  });
});
