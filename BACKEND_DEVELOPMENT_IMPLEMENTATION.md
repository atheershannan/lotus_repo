# ⚙️ STAGE 4: BACKEND DEVELOPMENT

## 🎯 Backend Development Implementation

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Backend Version**: 1.0
**Date**: December 2024
**Status**: Implementation

---

## 📊 Dynamic Questions Answered

### 1️⃣ API Implementation Strategy
**Technology Choices Based on Architecture:**

- **Framework**: Express.js with Supabase Edge Functions for serverless deployment
- **API Structure**: RESTful APIs with Supabase auto-generated APIs and custom Edge Functions
- **Authentication**: JWT tokens with Supabase Auth and corporate SSO integration
- **Validation**: Joi schemas for request validation, Prisma for database validation

### 2️⃣ Database Integration
**PostgreSQL + pgvector Implementation:**

- **ORM**: Prisma for PostgreSQL with pgvector extension support
- **Migrations**: Prisma migrations with Supabase database management
- **Query Optimization**: PostgreSQL query optimization with pgvector similarity indexes
- **Caching**: Redis for multi-layer caching with Supabase built-in caching

### 3️⃣ Testing Strategy
**Comprehensive Testing Approach:**

- **Framework**: Jest with comprehensive test coverage and mocking
- **Test Types**: Unit tests, integration tests, API tests, RAG service tests
- **Coverage**: 85%+ coverage for critical business logic and RAG processing
- **Mocking**: Jest mocks for OpenAI API, Supabase services, and external microservices

### 4️⃣ Security Implementation
**Enterprise-Grade Security:**

- **Input Validation**: Joi schemas with comprehensive validation and sanitization
- **SQL Injection Prevention**: Prisma ORM with parameterized queries and Row Level Security
- **XSS Protection**: Content Security Policy, input sanitization, and output encoding
- **Rate Limiting**: Express rate limiting with Redis backend and per-user limits

### 5️⃣ Error Handling
**Comprehensive Error Management:**

- **Error Handling**: Centralized error handling with custom error classes and middleware
- **Logging**: Winston with structured logging, Supabase logging, and correlation IDs
- **Monitoring**: Supabase built-in monitoring with custom dashboards and alerts
- **Debugging**: Comprehensive error tracking with stack traces and context

---

## 🏗️ Project Structure

```
BACKEND/
├── src/
│   ├── controllers/          # API controllers
│   ├── services/             # Business logic services
│   ├── middleware/           # Express middleware
│   ├── models/              # Prisma models and schemas
│   ├── routes/              # API route definitions
│   ├── utils/                # Utility functions
│   ├── config/              # Configuration files
│   └── tests/               # Test suites
├── supabase/
│   ├── functions/           # Supabase Edge Functions
│   ├── migrations/          # Database migrations
│   └── config/             # Supabase configuration
├── package.json
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Prisma migrations
└── README.md

FRONTEND/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Redux store
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   └── tests/               # Test suites
├── public/
├── package.json
└── README.md

DATABASE/
├── schema/                  # Database schemas
├── migrations/              # Database migrations
├── seeds/                   # Seed data
├── indexes/                # Database indexes
└── README.md

DEPLOYMENT/
├── docker/                  # Docker configurations
├── kubernetes/             # Kubernetes manifests
├── scripts/                # Deployment scripts
├── monitoring/              # Monitoring configurations
└── README.md
```

---

## 🔧 Backend Implementation

### 1. Package.json Configuration
```json
{
  "name": "corporate-assistant-backend",
  "version": "1.0.0",
  "description": "Contextual Corporate Assistant RAG/GRAPH Backend",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "node prisma/seed.js",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "redis": "^4.6.12",
    "openai": "^4.20.1",
    "@supabase/supabase-js": "^2.38.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.56.0",
    "@types/jest": "^29.5.8"
  }
}
```

### 2. Main Application Entry Point
```javascript
// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');
const { connectRedis } = require('./config/redis');
const { connectDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const ragRoutes = require('./routes/rag');
const userRoutes = require('./routes/user');
const integrationRoutes = require('./routes/integration');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/user', userRoutes);
app.use('/api/integration', integrationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Initialize services
async function startServer() {
  try {
    await connectDatabase();
    await connectRedis();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
```

### 3. Database Configuration with Prisma
```javascript
// src/config/database.js
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Database Query:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`
    });
  });
}

prisma.$on('error', (e) => {
  logger.error('Database Error:', e);
});

prisma.$on('info', (e) => {
  logger.info('Database Info:', e);
});

prisma.$on('warn', (e) => {
  logger.warn('Database Warning:', e);
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Database disconnection failed:', error);
    throw error;
  }
}

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase
};
```

### 4. Prisma Schema with pgvector
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enable pgvector extension
model LearningContent {
  id          String   @id @default(cuid())
  title       String
  content     String
  contentType String   // 'course', 'lesson', 'skill', 'assessment'
  embedding   Unsupported("vector(1536)")? // OpenAI embedding dimension
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  skills      Skill[]
  courses     Course[]
  assessments Assessment[]

  @@map("learning_content")
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String
  department        String?
  role              String?
  learningProfile   Json?
  preferences       Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relationships
  learningProgress  LearningProgress[]
  chatHistory       ChatMessage[]
  recommendations   Recommendation[]

  @@map("users")
}

model LearningProgress {
  id          String   @id @default(cuid())
  userId      String
  skillId     String?
  courseId    String?
  level       Int      @default(1)
  progress    Float    @default(0)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill       Skill?   @relation(fields: [skillId], references: [id])
  course      Course?  @relation(fields: [courseId], references: [id])

  @@map("learning_progress")
}

model ChatMessage {
  id          String   @id @default(cuid())
  userId      String
  message     String
  response    String?
  confidence  Float?
  sources     Json?
  createdAt   DateTime @default(now())

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("chat_messages")
}

model Skill {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String?
  level       Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  learningContent LearningContent[]
  learningProgress LearningProgress[]

  @@map("skills")
}

model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  duration    Int?     // in minutes
  difficulty  String?  // 'beginner', 'intermediate', 'advanced'
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  learningContent LearningContent[]
  learningProgress LearningProgress[]

  @@map("courses")
}

model Assessment {
  id          String   @id @default(cuid())
  title       String
  description String?
  questions   Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  learningContent LearningContent[]

  @@map("assessments")
}

model Recommendation {
  id          String   @id @default(cuid())
  userId      String
  type        String   // 'course', 'skill', 'content'
  itemId      String
  score       Float
  reason      String?
  createdAt   DateTime @default(now())

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("recommendations")
}
```

### 5. RAG Service Implementation
```javascript
// src/services/ragService.js
const { OpenAI } = require('openai');
const { prisma } = require('../config/database');
const { logger } = require('../utils/logger');

class RAGService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.embeddingModel = 'text-embedding-ada-002';
    this.chatModel = 'gpt-4';
  }

  async processQuery(query, userId, context = {}) {
    try {
      logger.info('Processing RAG query', { query: query.substring(0, 100), userId });

      // 1. Generate embeddings for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // 2. Perform vector similarity search
      const similarContent = await this.vectorSimilaritySearch(queryEmbedding, 5);

      // 3. Get user context and learning profile
      const userContext = await this.getUserContext(userId);

      // 4. Generate response using GPT-4
      const response = await this.generateResponse(query, similarContent, userContext, context);

      // 5. Save chat message and update learning progress
      await this.saveChatMessage(userId, query, response);

      // 6. Generate personalized recommendations
      const recommendations = await this.generateRecommendations(userId, query, response);

      return {
        response: response.text,
        confidence: response.confidence,
        sources: similarContent.map(item => ({
          id: item.id,
          title: item.title,
          contentType: item.contentType,
          relevance: item.similarity
        })),
        recommendations,
        processingTime: response.processingTime
      };

    } catch (error) {
      logger.error('RAG processing error:', error);
      throw new Error('Failed to process query');
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      logger.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async vectorSimilaritySearch(embedding, limit = 5) {
    try {
      // Use raw SQL query for pgvector similarity search
      const results = await prisma.$queryRaw`
        SELECT 
          id,
          title,
          content,
          content_type,
          1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
        FROM learning_content
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
        LIMIT ${limit}
      `;

      return results.filter(result => result.similarity > 0.7); // Threshold for relevance
    } catch (error) {
      logger.error('Vector similarity search error:', error);
      throw new Error('Failed to perform similarity search');
    }
  }

  async getUserContext(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          learningProgress: {
            include: {
              skill: true,
              course: true
            }
          },
          chatHistory: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      });

      return {
        profile: user?.learningProfile,
        preferences: user?.preferences,
        recentProgress: user?.learningProgress,
        chatHistory: user?.chatHistory
      };
    } catch (error) {
      logger.error('User context retrieval error:', error);
      return {};
    }
  }

  async generateResponse(query, similarContent, userContext, context) {
    try {
      const startTime = Date.now();

      // Prepare context for GPT-4
      const contextText = similarContent
        .map(item => `Title: ${item.title}\nContent: ${item.content}\nType: ${item.contentType}`)
        .join('\n\n');

      const userProfileText = userContext.profile 
        ? `User Profile: ${JSON.stringify(userContext.profile)}`
        : '';

      const systemPrompt = `You are a corporate learning assistant. Provide helpful, accurate, and personalized responses based on the learning content and user context. Always cite your sources and provide actionable recommendations.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context:\n${contextText}\n\n${userProfileText}\n\nQuery: ${query}` }
      ];

      const response = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const processingTime = Date.now() - startTime;
      const responseText = response.choices[0].message.content;

      // Calculate confidence score based on response quality and context relevance
      const confidence = this.calculateConfidence(responseText, similarContent);

      return {
        text: responseText,
        confidence,
        processingTime
      };

    } catch (error) {
      logger.error('Response generation error:', error);
      throw new Error('Failed to generate response');
    }
  }

  calculateConfidence(responseText, similarContent) {
    // Simple confidence calculation based on response length and context relevance
    const avgSimilarity = similarContent.reduce((sum, item) => sum + item.similarity, 0) / similarContent.length;
    const responseLength = responseText.length;
    
    // Normalize confidence score between 0.5 and 1.0
    const lengthScore = Math.min(responseLength / 200, 1);
    const similarityScore = avgSimilarity;
    
    return Math.max(0.5, (lengthScore + similarityScore) / 2);
  }

  async saveChatMessage(userId, query, response) {
    try {
      await prisma.chatMessage.create({
        data: {
          userId,
          message: query,
          response: response.text,
          confidence: response.confidence,
          sources: JSON.stringify(response.sources || [])
        }
      });
    } catch (error) {
      logger.error('Chat message save error:', error);
    }
  }

  async generateRecommendations(userId, query, response) {
    try {
      // Simple recommendation logic - in production, this would be more sophisticated
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          learningProgress: true
        }
      });

      // Get skills and courses related to the query
      const relatedSkills = await prisma.skill.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });

      const relatedCourses = await prisma.course.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });

      return [
        ...relatedSkills.map(skill => ({
          type: 'skill',
          id: skill.id,
          title: skill.name,
          description: skill.description,
          score: 0.8
        })),
        ...relatedCourses.map(course => ({
          type: 'course',
          id: course.id,
          title: course.title,
          description: course.description,
          score: 0.7
        }))
      ];

    } catch (error) {
      logger.error('Recommendation generation error:', error);
      return [];
    }
  }
}

module.exports = new RAGService();
```

### 6. Authentication Service
```javascript
// src/services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { logger } = require('../utils/logger');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshExpiry = process.env.REFRESH_EXPIRY || '7d';
  }

  async authenticateUser(email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // In a real implementation, you'd verify the password
      // For now, we'll assume corporate SSO handles this
      const isValid = await bcrypt.compare(password, user.password || '');

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      logger.error('Authentication error:', error);
      throw error;
    }
  }

  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry
    });

    const refreshToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.refreshExpiry
    });

    return { accessToken, refreshToken };
  }

  async verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      logger.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword
        }
      });

      return user;
    } catch (error) {
      logger.error('User creation error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          learningProfile: profileData.learningProfile,
          preferences: profileData.preferences
        }
      });

      return user;
    } catch (error) {
      logger.error('Profile update error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
```

### 7. Error Handling Middleware
```javascript
// src/middleware/errorHandler.js
const { logger } = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { AppError, errorHandler };
```

### 8. Validation Middleware
```javascript
// src/middleware/validation.js
const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }
    next();
  };
};

const schemas = {
  ragQuery: Joi.object({
    query: Joi.string().min(1).max(1000).required(),
    context: Joi.object().optional()
  }),

  userRegistration: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(50).required(),
    department: Joi.string().optional(),
    role: Joi.string().optional(),
    password: Joi.string().min(8).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  profileUpdate: Joi.object({
    learningProfile: Joi.object().optional(),
    preferences: Joi.object().optional()
  })
};

module.exports = { validateRequest, schemas };
```

---

## 🧪 Testing Implementation

### 1. Test Configuration
```javascript
// src/tests/setup.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL
    }
  }
});

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up test data
  await prisma.chatMessage.deleteMany();
  await prisma.learningProgress.deleteMany();
  await prisma.user.deleteMany();
});

module.exports = { prisma };
```

### 2. RAG Service Tests
```javascript
// src/tests/services/ragService.test.js
const ragService = require('../../services/ragService');
const { prisma } = require('../setup');

// Mock OpenAI
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      embeddings: {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: new Array(1536).fill(0.1) }]
        })
      },
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Test response' } }]
          })
        }
      }
    }))
  };
});

describe('RAG Service', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        department: 'Engineering',
        role: 'Developer'
      }
    });
  });

  describe('processQuery', () => {
    it('should process a query and return response', async () => {
      const query = 'What is machine learning?';
      
      const result = await ragService.processQuery(query, testUser.id);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('sources');
      expect(result).toHaveProperty('recommendations');
      expect(result.response).toBe('Test response');
    });

    it('should handle empty query', async () => {
      await expect(ragService.processQuery('', testUser.id))
        .rejects.toThrow('Failed to process query');
    });
  });

  describe('generateEmbedding', () => {
    it('should generate embedding for text', async () => {
      const embedding = await ragService.generateEmbedding('test text');
      
      expect(embedding).toBeInstanceOf(Array);
      expect(embedding).toHaveLength(1536);
    });
  });
});
```

---

## 🔐 Security Implementation

### 1. Rate Limiting Configuration
```javascript
// src/middleware/rateLimiting.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL
});

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later.'
);

const ragLimiter = createRateLimit(
  60 * 1000, // 1 minute
  20, // 20 requests
  'Too many RAG requests, please slow down.'
);

const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests from this IP, please try again later.'
);

module.exports = {
  authLimiter,
  ragLimiter,
  generalLimiter
};
```

### 2. Input Sanitization
```javascript
// src/middleware/sanitization.js
const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = validator.escape(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) {
    sanitizeObject(req.body);
  }

  if (req.query) {
    sanitizeObject(req.query);
  }

  next();
};

module.exports = { sanitizeInput };
```

---

## 📊 Monitoring and Logging

### 1. Winston Logger Configuration
```javascript
// src/utils/logger.js
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'corporate-assistant-backend' },
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log')
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = { logger };
```

---

**Document Status**: Implementation
**Last Updated**: December 2024
**Next Review**: Testing and Deployment
**Approved By**: [Name and Title]

