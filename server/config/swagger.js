const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgriKonbit API',
      version: '1.0.0',
      description: 'API documentation for AgriKonbit - Agricultural crowdfunding and marketplace platform',
      contact: {
        name: 'AgriKonbit Team',
        email: 'support@agrikonbit.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.agrikonbit.com' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            fullName: { type: 'string' },
            role: { type: 'string', enum: ['investor', 'farmer', 'consumer', 'admin'] },
            walletAddress: { type: 'string' },
            kycStatus: { type: 'string', enum: ['none', 'pending', 'verified', 'rejected'] },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            budgetUsd: { type: 'number' },
            budgetGyt: { type: 'number' },
            durationDays: { type: 'integer' },
            estimatedReturnPct: { type: 'number' },
            location: { type: 'string' },
            category: { type: 'string', enum: ['crops', 'livestock', 'fishing', 'forestry', 'other'] },
            status: { type: 'string', enum: ['pending', 'validated', 'rejected', 'active', 'completed', 'cancelled'] },
            fundedAmountUsd: { type: 'number' },
            fundedAmountGyt: { type: 'number' },
            investorCount: { type: 'integer' },
            fundingPercentage: { type: 'number' },
            farmerName: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Investment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            projectId: { type: 'integer' },
            investorId: { type: 'integer' },
            amountGyt: { type: 'number' },
            amountUsd: { type: 'number' },
            paymentMethod: { type: 'string', enum: ['stripe', 'paypal', 'metamask', 'gyt_wallet'] },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            returnType: { type: 'string', enum: ['financial', 'physical', 'mixed'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            priceUsd: { type: 'number' },
            priceGyt: { type: 'number' },
            stock: { type: 'integer' },
            category: { type: 'string', enum: ['cereals', 'fruits', 'vegetables', 'honey', 'dairy', 'meat', 'other'] },
            originCountry: { type: 'string' },
            organicCertified: { type: 'boolean' },
            harvestDate: { type: 'string', format: 'date' },
            nftId: { type: 'string' },
            farmerName: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            orderNumber: { type: 'string' },
            totalUsd: { type: 'number' },
            totalGyt: { type: 'number' },
            paymentMethod: { type: 'string', enum: ['stripe', 'paypal', 'gyt_wallet'] },
            status: { type: 'string', enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
            shippingAddress: { type: 'object' },
            trackingNumber: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to the API files
};

const specs = swaggerJSDoc(options);

module.exports = specs;
