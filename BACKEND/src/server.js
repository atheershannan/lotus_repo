const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
const winston = require('winston');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Environment diagnostics
console.log("🔍 Checking OPENAI_API_KEY env...");
if (process.env.OPENAI_API_KEY) {
  console.log("✅ OPENAI_API_KEY found, length:", process.env.OPENAI_API_KEY.length);
} else {
  console.error("❌ OPENAI_API_KEY not found! Please define it in Railway → Variables.");
}

// Initialize Prisma client (only if DATABASE_URL is set)
let prisma = null;
if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
  console.log('✅ Database connected');
} else {
  console.log('⚠️  DATABASE_URL not set - running in mock mode (no database operations)');
}

// Initialize Supabase client (only if URLs are provided)
let supabase = null;
console.log('🔍 Checking Supabase environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Supabase client initialized successfully');
} else {
  console.log('⚠️  Supabase disabled (mock mode)');
}

// Ensure logs directory exists
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Create Express app
const app = express();

// Trust proxy for Railway (fix rate limiter warning)
app.set('trust proxy', 1);

const RAW_PORT = process.env.PORT;
const PORT = RAW_PORT ? Number(RAW_PORT) : 8080;
console.log('🛠 PORT env =', RAW_PORT, ' -> listening on', PORT);

// ---------- CORS (must be BEFORE helmet/routes) ----------
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [
      'https://lotus-repo.vercel.app',
      'https://lotus-repo-git-main-atheershannan.vercel.app',
      'http://localhost:3000'
    ];

console.log('🌐 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // allow no-origin (server-to-server/Postman/mobile) and dev (non-prod)
    if (!origin || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.log('⚠️ Blocked CORS request from:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH','HEAD'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','x-api-key','Accept','Origin'],
  exposedHeaders: ['Content-Length','Content-Type','X-Total-Count'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400,
};

app.use(cors(corsOptions));
// Explicitly handle preflight for *all* routes early
app.options('*', cors(corsOptions));

// Log preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('🔎 Preflight:', { path: req.path, origin: req.headers.origin });
  }
  next();
});

// Backup manual headers to guarantee presence even if a route/middleware forgets to set them
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin'); // cache correctness
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-api-key, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS debug endpoint to validate headers easily
app.get('/api/cors-debug', (req, res) => {
  res.json({
    ok: true,
    method: req.method,
    receivedOrigin: req.headers.origin || null,
    allowedOrigins,
    env: process.env.NODE_ENV || 'development',
    note: 'Check response headers for Access-Control-Allow-Origin'
  });
});

// Environment debug endpoint
app.get('/api/debug-env', (req, res) => {
  res.json({
    openaiKeyDetected: !!process.env.OPENAI_API_KEY,
    openaiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '(none)'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/content', require('./routes/content'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/search', require('./routes/search'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  if (prisma) await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  if (prisma) await prisma.$disconnect();
  process.exit(0);
});

// Startup diagnostics to surface crashes in logs
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  logger.error('Unhandled Rejection:', err);
});

// Start server - bind to 0.0.0.0 to accept external connections
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 Corporate Learning Assistant Backend running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;

