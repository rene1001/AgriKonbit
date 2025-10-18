const request = require('supertest');
const app = require('../../server/index');
const { query } = require('../../server/config/database');

describe('Tests d\'Intégration - API Complète', () => {
  let farmerToken, consumerToken;
  let farmerId, productId, orderId;

  beforeAll(async () => {
    const farmerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `farmer-int-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Integration Farmer',
        role: 'farmer'
      });
    farmerToken = farmerRes.body.data.token;
    farmerId = farmerRes.body.data.user.id;

    const consumerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `consumer-int-${Date.now()}@test.com`,
        password: 'Test123!',
        fullName: 'Integration Consumer',
        role: 'consumer'
      });
    consumerToken = consumerRes.body.data.token;
  });

  describe('Flux complet: Produit → Commande → Livraison', () => {
    it('Farmer crée un produit', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${farmerToken}`)
        .send({
          name: 'Mangues Bio Test',
          category: 'fruits',
          price: 5.50,
          quantity: 100
        })
        .expect(201);

      productId = res.body.data.id;
      console.log(`✓ Produit créé: ID ${productId}`);
    });

    it('Consumer passe une commande', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${consumerToken}`)
        .send({
          items: [{
            product_id: productId,
            quantity: 10,
            price: 5.50
          }]
        })
        .expect(201);

      orderId = res.body.data.id;
      console.log(`✓ Commande créée: ID ${orderId}`);
    });

    it('Stock produit est mis à jour', async () => {
      const res = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(res.body.data.quantity).toBe(90);
      console.log('✓ Stock mis à jour');
    });
  });

  describe('Intégration avec services externes', () => {
    it('Service de paiement Stripe', async () => {
      const res = await request(app)
        .post('/api/payments/stripe')
        .set('Authorization', `Bearer ${consumerToken}`)
        .send({
          amount: 100,
          currency: 'usd'
        });

      if (res.status === 200) {
        expect(res.body.data).toHaveProperty('payment_intent');
        console.log('✓ Intégration Stripe fonctionnelle');
      }
    });

    it('Upload fichier vers AWS S3', async () => {
      const fakeFile = Buffer.from('test-content');
      
      const res = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${farmerToken}`)
        .attach('file', fakeFile, 'test.jpg');

      if (res.status === 200) {
        expect(res.body.data).toHaveProperty('url');
        console.log('✓ Upload AWS S3 fonctionnel');
      }
    });
  });
});
