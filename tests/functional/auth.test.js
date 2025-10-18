const request = require('supertest');
const app = require('../../server/index');
const { query } = require('../../server/config/database');

describe('Tests Fonctionnels - Authentification', () => {
  let testUserId;
  const testEmail = `test-auth-${Date.now()}@agrikonbit.com`;

  afterAll(async () => {
    // Nettoyage
    if (testUserId) {
      await query('DELETE FROM users WHERE id = ?', [testUserId]);
    }
  });

  describe('Inscription utilisateur', () => {
    it('devrait créer un nouveau compte farmer', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          fullName: 'Test Farmer',
          role: 'farmer',
          phone: '+50937123456'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe(testEmail);
      expect(res.body.data.user.role).toBe('farmer');
      
      testUserId = res.body.data.user.id;
    });

    it('devrait refuser une inscription avec email existant', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          fullName: 'Test User Duplicate',
          role: 'consumer'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/existe déjà|already exists/i);
    });

    it('devrait valider le format de l\'email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          fullName: 'Test User',
          role: 'consumer'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('devrait valider la force du mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test-weak-${Date.now()}@test.com`,
          password: '123',
          fullName: 'Test User',
          role: 'consumer'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Connexion utilisateur', () => {
    it('devrait connecter un utilisateur avec identifiants valides', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('devrait refuser une connexion avec mot de passe incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('devrait refuser une connexion avec email inexistant', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Gestion du profil', () => {
    let authToken;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!'
        });
      authToken = loginRes.body.data.token;
    });

    it('devrait récupérer le profil de l\'utilisateur connecté', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testEmail);
    });

    it('devrait mettre à jour le profil', async () => {
      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          fullName: 'Updated Test Farmer',
          phone: '+50937999999'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.fullName).toBe('Updated Test Farmer');
    });

    it('devrait refuser l\'accès sans token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('devrait refuser l\'accès avec token invalide', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Réinitialisation du mot de passe', () => {
    it('devrait demander une réinitialisation de mot de passe', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: testEmail
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('devrait accepter une demande pour email inexistant (sécurité)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@test.com'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Vérification JWT', () => {
    let authToken;

    beforeAll(async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'Password123!'
        });
      authToken = loginRes.body.data.token;
    });

    it('devrait valider un token JWT valide', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('user');
    });

    it('devrait rejeter un token expiré ou malformé', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
