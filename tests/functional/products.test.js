const request = require('supertest');
const app = require('../../server/index');
const { query } = require('../../server/config/database');

describe('Tests Fonctionnels - Gestion des Produits', () => {
  let farmerToken;
  let farmerId;
  let productId;
  let consumerToken;

  beforeAll(async () => {
    // Créer un farmer
    const farmerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `farmer-prod-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Test Farmer Products',
        role: 'farmer'
      });
    farmerToken = farmerRes.body.data.token;
    farmerId = farmerRes.body.data.user.id;

    // Créer un consumer
    const consumerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `consumer-prod-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Test Consumer',
        role: 'consumer'
      });
    consumerToken = consumerRes.body.data.token;
  });

  afterAll(async () => {
    // Nettoyage
    if (productId) {
      await query('DELETE FROM products WHERE id = ?', [productId]);
    }
    if (farmerId) {
      await query('DELETE FROM users WHERE id = ?', [farmerId]);
    }
  });

  describe('Création de produits', () => {
    it('devrait créer un nouveau produit (farmer)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Tomates Bio',
          description: 'Tomates cultivées sans pesticides',
          category: 'vegetables',
          price: 2.50,
          unit: 'kg',
          quantity: 100,
          location: 'Port-au-Prince'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Tomates Bio');
      productId = res.body.data.id;
    });

    it('devrait refuser la création par un consumer', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${consumerToken}`)
        .send({
          name: 'Product Test',
          category: 'vegetables',
          price: 10,
          quantity: 50
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('devrait valider les champs obligatoires', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Incomplete Product'
          // Manque price, category, quantity
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('devrait valider le prix positif', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Invalid Price Product',
          category: 'vegetables',
          price: -5,
          quantity: 10
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Consultation des produits', () => {
    it('devrait lister tous les produits disponibles', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('devrait filtrer les produits par catégorie', async () => {
      const res = await request(app)
        .get('/api/products?category=vegetables')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(product => {
        expect(product.category).toBe('vegetables');
      });
    });

    it('devrait chercher les produits par nom', async () => {
      const res = await request(app)
        .get('/api/products?search=Tomates')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.some(p => p.name.includes('Tomates'))).toBe(true);
    });

    it('devrait récupérer un produit par ID', async () => {
      const res = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(productId);
      expect(res.body.data.name).toBe('Tomates Bio');
    });

    it('devrait retourner 404 pour produit inexistant', async () => {
      const res = await request(app)
        .get('/api/products/999999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Mise à jour des produits', () => {
    it('devrait mettre à jour un produit (propriétaire)', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          price: 3.00,
          quantity: 150,
          description: 'Tomates bio fraîches'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(3.00);
      expect(res.body.data.quantity).toBe(150);
    });

    it('devrait refuser la modification par non-propriétaire', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${consumerToken}`)
        .send({
          price: 1.00
        })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Gestion du stock', () => {
    it('devrait mettre à jour la quantité disponible', async () => {
      const res = await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          quantity: 200
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(200);
    });

    it('devrait marquer comme indisponible si quantité = 0', async () => {
      await request(app)
        .patch(`/api/products/${productId}/stock`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          quantity: 0
        })
        .expect(200);

      const checkRes = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(checkRes.body.data.status).toBe('unavailable');
    });
  });

  describe('Suppression de produits', () => {
    it('devrait supprimer un produit (propriétaire)', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);

      // Vérifier suppression
      const checkRes = await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);

      expect(checkRes.body.success).toBe(false);
    });
  });

  describe('Photos de produits', () => {
    let newProductId;

    beforeAll(async () => {
      const prodRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Produit avec photo',
          category: 'fruits',
          price: 5,
          quantity: 50
        });
      newProductId = prodRes.body.data.id;
    });

    it('devrait uploader une photo de produit', async () => {
      const res = await request(app)
        .post(`/api/products/${newProductId}/photo`)
        .set('Authorization', `Bearer ${farmerToken}`)
        .attach('photo', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('photo_url');
    });

    afterAll(async () => {
      if (newProductId) {
        await query('DELETE FROM products WHERE id = ?', [newProductId]);
      }
    });
  });
});
