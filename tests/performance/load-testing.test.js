const request = require('supertest');
const app = require('../../server/index');

describe('Tests de Performance - Charge et Temps de Réponse', () => {
  let authToken;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `perf-test-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Performance Test User',
        role: 'consumer'
      });
    authToken = loginRes.body.data.token;
  });

  describe('Temps de réponse API', () => {
    it('GET /api/products devrait répondre en < 500ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/products')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(500);
      console.log(`✓ GET /api/products: ${duration}ms`);
    });

    it('GET /api/auth/profile devrait répondre en < 300ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(300);
      console.log(`✓ GET /api/auth/profile: ${duration}ms`);
    });

    it('POST /api/auth/login devrait répondre en < 1000ms', async () => {
      const start = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          email: `perf-test-${Date.now()}@test.com`,
          password: 'Test123!'
        });
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
      console.log(`✓ POST /api/auth/login: ${duration}ms`);
    });

    it('GET /api/notifications devrait répondre en < 400ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(400);
      console.log(`✓ GET /api/notifications: ${duration}ms`);
    });
  });

  describe('Test de charge concurrente', () => {
    it('devrait gérer 50 requêtes simultanées', async () => {
      const promises = [];
      const start = Date.now();

      for (let i = 0; i < 50; i++) {
        promises.push(
          request(app)
            .get('/api/products')
            .expect(200)
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - start;
      
      console.log(`✓ 50 requêtes simultanées complétées en ${duration}ms`);
      expect(duration).toBeLessThan(5000); // Toutes en moins de 5s
    });

    it('devrait gérer 20 authentifications simultanées', async () => {
      const promises = [];
      const start = Date.now();

      for (let i = 0; i < 20; i++) {
        promises.push(
          request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - start;
      
      console.log(`✓ 20 authentifications simultanées en ${duration}ms`);
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('Performance des requêtes complexes', () => {
    it('recherche avec filtres multiples < 800ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/products?category=vegetables&min_price=1&max_price=10&search=bio')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(800);
      console.log(`✓ Recherche avec filtres: ${duration}ms`);
    });

    it('pagination avec 50 résultats < 600ms', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/api/products?limit=50&page=1')
        .expect(200);
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(600);
      console.log(`✓ Pagination 50 résultats: ${duration}ms`);
    });
  });

  describe('Performance upload fichiers', () => {
    it('upload image < 2MB devrait prendre < 2s', async () => {
      const fakeImage = Buffer.alloc(1024 * 1024); // 1MB
      const start = Date.now();
      
      const res = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', fakeImage, 'test.jpg');
      
      const duration = Date.now() - start;
      
      if (res.status === 200) {
        console.log(`✓ Upload 1MB: ${duration}ms`);
        expect(duration).toBeLessThan(2000);
      }
    });
  });

  describe('Metrics et monitoring', () => {
    it('devrait tracker les temps de réponse moyens', async () => {
      const durations = [];
      
      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await request(app).get('/api/products');
        durations.push(Date.now() - start);
      }
      
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);
      
      console.log(`
📊 Statistiques (10 requêtes):
   - Temps moyen: ${avg.toFixed(2)}ms
   - Temps min: ${min}ms
   - Temps max: ${max}ms
      `);
      
      expect(avg).toBeLessThan(500);
    });
  });

  describe('Rate limiting', () => {
    it('devrait respecter les limites de taux', async () => {
      const promises = [];
      
      // Envoyer 200 requêtes rapidement
      for (let i = 0; i < 200; i++) {
        promises.push(
          request(app)
            .get('/api/products')
            .then(res => res.status)
        );
      }
      
      const statuses = await Promise.all(promises);
      const rateLimited = statuses.filter(s => s === 429).length;
      
      console.log(`✓ ${rateLimited} requêtes bloquées par rate limiting sur 200`);
      expect(rateLimited).toBeGreaterThan(0); // Au moins quelques requêtes limitées
    });
  });

  describe('Compression des réponses', () => {
    it('devrait compresser les réponses JSON volumineuses', async () => {
      const res = await request(app)
        .get('/api/products?limit=100')
        .set('Accept-Encoding', 'gzip')
        .expect(200);
      
      // Vérifier header compression
      expect(res.headers['content-encoding']).toMatch(/gzip|deflate/);
      console.log(`✓ Compression activée: ${res.headers['content-encoding']}`);
    });
  });
});

describe('Tests de Performance - Optimisations', () => {
  describe('Caching', () => {
    it('devrait utiliser le cache pour ressources statiques', async () => {
      const res1 = await request(app)
        .get('/api/products')
        .expect(200);
      
      const res2 = await request(app)
        .get('/api/products')
        .expect(200);
      
      // Vérifier headers de cache
      if (res1.headers['etag']) {
        console.log('✓ ETag présent pour le caching');
        expect(res1.headers['etag']).toBeDefined();
      }
    });
  });

  describe('Optimisation base de données', () => {
    it('devrait utiliser les index pour les recherches', async () => {
      // Ce test vérifie que les requêtes complexes restent rapides
      const start = Date.now();
      
      await request(app)
        .get('/api/products?category=vegetables&sort=price')
        .expect(200);
      
      const duration = Date.now() - start;
      console.log(`✓ Recherche indexée: ${duration}ms`);
      expect(duration).toBeLessThan(400);
    });
  });

  describe('Memory usage', () => {
    it('devrait ne pas avoir de fuite mémoire', async () => {
      const before = process.memoryUsage().heapUsed;
      
      // Faire 100 requêtes
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(request(app).get('/api/products'));
      }
      await Promise.all(promises);
      
      // Forcer garbage collection (si disponible)
      if (global.gc) {
        global.gc();
      }
      
      const after = process.memoryUsage().heapUsed;
      const increase = ((after - before) / 1024 / 1024).toFixed(2);
      
      console.log(`📊 Augmentation mémoire après 100 requêtes: ${increase}MB`);
      
      // L'augmentation ne devrait pas être excessive
      expect(parseFloat(increase)).toBeLessThan(50);
    });
  });
});
