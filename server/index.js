const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const investmentRoutes = require('./routes/investments');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const blockchainRoutes = require('./routes/blockchain');
const paymentRoutes = require('./routes/payments');
const deliveriesRoutes = require('./routes/deliveries');
const favoritesRoutes = require('./routes/favorites');
const subscriptionsRoutes = require('./routes/subscriptions');
const farmerRoutes = require('./routes/farmer');
const messageRoutes = require('./routes/messages');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');
const placeholderRoutes = require('./routes/placeholder');
const walletRoutes = require('./routes/wallet');
const returnsRoutes = require('./routes/returns');
const reportsRoutes = require('./routes/reports');
const treasuryRoutes = require('./routes/treasury');

const http = require('http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./config/socket');
const { setIO } = require('./config/io');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware with relaxed CSP for images, fonts, and styles
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:", "http:"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "data:"]
    }
  }
}));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));

// Rate limiting (more permissive in development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests in dev, 100 in prod
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cache middleware pour API (GET seulement)
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    // Cache court pour données read-only
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute
  } else {
    // Pas de cache pour POST/PUT/DELETE
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Placeholder images (no rate limiting)
app.use('/api/placeholder', placeholderRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliveries', deliveriesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/treasury', treasuryRoutes);
app.use('/api/settings', require('./routes/settings'));

// Serve static files with optimized caching
if (process.env.NODE_ENV === 'production') {
  // Assets avec hash dans le nom (JS, CSS) - cache long terme
  app.use('/static', express.static(path.join(__dirname, '../client/build/static'), {
    maxAge: '1y', // 1 an
    immutable: true,
    etag: true,
    setHeaders: (res, filePath) => {
      // Assets avec hash sont immuables
      if (filePath.match(/\.(js|css|woff2?|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  
  // Autres fichiers statiques - cache court
  app.use(express.static(path.join(__dirname, '../client/build'), {
    maxAge: 0,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // HTML pas de cache (pour avoir toujours la dernière version)
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  
  // Catch-all: serve React index.html for all non-API routes (production only)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Serve uploaded files (images/documents) avec cache
app.use('/uploads', (req, res, next) => {
  // Allow embedding uploads from different origins (e.g., client on :3000)
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  // Cache images 1 semaine
  res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 jours
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  });
});

// Database connection and server start
db.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001'
        ],
        credentials: true,
        methods: ['GET', 'POST']
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000
    });
    initializeSocket(io);
    setIO(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server (HTTP + Socket.IO) running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

module.exports = app;
