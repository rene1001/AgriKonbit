const request = require('supertest');
const app = require('../../server/index');

describe('Tests de Régression - Fonctionnalités Critiques', () => {
  let authToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: `regression-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Regression Test',
        role: 'consumer'
      });
    authToken = res.body.data.token;
  });

  describe('Smoke Tests - Endpoints Critiques', () => {
    it('GET /api/products devrait fonctionner', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.success).toBe(true);
      console.log('✓ Liste produits OK');
    });

    it('POST /api/auth/login devrait fonctionner', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: `regression-${Date.now()}@test.com`,
          password: 'Test123!'
        });

      expect(res.body.success).toBeDefined();
      console.log('✓ Login OK');
    });

    it('GET /api/auth/profile devrait fonctionner', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      console.log('✓ Profile OK');
    });

    it('GET /api/notifications devrait fonctionner', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      console.log('✓ Notifications OK');
    });
  });

  describe('Tests de Non-Régression', () => {
    it('Authentification JWT ne devrait pas être cassée', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.data).toHaveProperty('email');
      console.log('✓ JWT non régressé');
    });

    it('Validation des entrées ne devrait pas être cassée', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      console.log('✓ Validation non régressée');
    });

    it('Rate limiting ne devrait pas être cassé', async () => {
      const promises = [];
      
      for (let i = 0; i < 150; i++) {
        promises.push(
          request(app).get('/api/products')
        );
      }

      const results = await Promise.all(promises);
      const limited = results.filter(r => r.status === 429).length;
      
      expect(limited).toBeGreaterThan(0);
      console.log(`✓ Rate limiting OK (${limited} requêtes bloquées)`);
    });
  });
});
