# 🧪 QA & TESTING IMPLEMENTATION

## 🎯 Comprehensive Testing Strategy

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Testing Version**: 1.0
**Date**: December 2024
**Status**: Implementation

---

## 📊 Dynamic Questions Answered

### 1️⃣ Testing Scope
**Corporate Learning Assistant Testing:**

- **Test Types**: Unit, integration, E2E, performance, security, RAG accuracy testing
- **Test Coverage**: 85%+ overall coverage target
- **Test Environments**: Dev, staging, production testing with Supabase
- **Test Data**: Synthetic data with vector embeddings, masked production data

### 2️⃣ Quality Metrics
**Enterprise Quality Standards:**

- **Performance Metrics**: <3 second RAG queries, <1 second user lookups, 99.9% uptime
- **Reliability Metrics**: 99.9% availability, <0.1% error rate
- **Security Metrics**: Zero critical vulnerabilities, 100% RLS policy coverage
- **User Experience**: WCAG 2.1 AA compliance, <2 second page load times

### 3️⃣ Testing Tools
**Technology Stack Testing:**

- **Unit Testing**: Jest for Node.js backend, React Testing Library for frontend
- **Integration Testing**: Supertest for API testing, Prisma for database testing
- **E2E Testing**: Playwright for cross-browser testing
- **Performance Testing**: K6 for load testing, Lighthouse for frontend performance

### 4️⃣ Test Automation
**CI/CD Integration:**

- **CI/CD Integration**: GitHub Actions with automated testing
- **Test Execution**: Parallel execution for speed, sequential for critical tests
- **Test Reporting**: HTML reports, Slack notifications, dashboard integration
- **Test Maintenance**: Automated test data management, cleanup procedures

### 5️⃣ Quality Gates
**Enterprise Quality Standards:**

- **Code Coverage**: 85% minimum coverage, 90% for critical components
- **Performance Benchmarks**: <3 second RAG queries, <1 second API responses
- **Security Requirements**: Zero critical vulnerabilities, 100% security test pass
- **User Acceptance**: UAT criteria with stakeholder approval

---

## 🧪 TDD (Test-Driven Development) Plan

### TDD Principles Implementation
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code while keeping tests passing

### Testing Pyramid for Corporate Assistant
- **Unit Tests**: 70% - Individual functions, components, and services
- **Integration Tests**: 20% - API endpoints, database, Supabase integration
- **E2E Tests**: 10% - Complete user workflows and RAG queries

---

## 🔧 Backend Testing Implementation

### 1. Unit Testing Setup
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/migrations/**',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  maxWorkers: '50%'
};
```

### 2. RAG Service Unit Tests
```javascript
// tests/unit/services/ragService.test.js
const RAGService = require('../../src/services/ragService');
const { supabase } = require('../../src/config/supabase');

jest.mock('../../src/config/supabase');

describe('RAG Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processQuery', () => {
    it('should process valid query and return response', async () => {
      // Arrange
      const query = 'How do I learn Python programming?';
      const userId = 'user-123';
      const mockEmbedding = [0.1, 0.2, 0.3, /* ... 1536 dimensions */];
      const mockDocuments = [
        {
          id: 'doc-1',
          title: 'Python Fundamentals',
          content: 'Python is a versatile programming language...',
          similarity: 0.85
        }
      ];

      supabase.functions.invoke.mockResolvedValue({
        data: { embedding: mockEmbedding },
        error: null
      });

      supabase.rpc.mockResolvedValue({
        data: mockDocuments,
        error: null
      });

      // Act
      const result = await RAGService.processQuery(query, userId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.response).toBeDefined();
      expect(result.data.confidence).toBeGreaterThan(0.7);
      expect(result.data.sources).toHaveLength(1);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-embedding', {
        body: { text: query }
      });
    });

    it('should handle embedding generation failure', async () => {
      // Arrange
      const query = 'Invalid query';
      const userId = 'user-123';

      supabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Embedding generation failed' }
      });

      // Act
      const result = await RAGService.processQuery(query, userId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Failed to generate embedding');
    });

    it('should handle no relevant documents found', async () => {
      // Arrange
      const query = 'Very specific query with no matches';
      const userId = 'user-123';
      const mockEmbedding = [0.1, 0.2, 0.3];

      supabase.functions.invoke.mockResolvedValue({
        data: { embedding: mockEmbedding },
        error: null
      });

      supabase.rpc.mockResolvedValue({
        data: [],
        error: null
      });

      // Act
      const result = await RAGService.processQuery(query, userId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.response).toContain('I couldn\'t find specific information');
      expect(result.data.confidence).toBeLessThan(0.5);
    });
  });

  describe('generateResponse', () => {
    it('should generate response with high confidence', async () => {
      // Arrange
      const query = 'What is machine learning?';
      const documents = [
        {
          title: 'Machine Learning Basics',
          content: 'Machine learning is a subset of AI...',
          similarity: 0.9
        }
      ];

      supabase.functions.invoke.mockResolvedValue({
        data: {
          response: 'Machine learning is a subset of artificial intelligence...',
          confidence: 0.92
        },
        error: null
      });

      // Act
      const result = await RAGService.generateResponse(query, documents);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.response).toContain('Machine learning');
      expect(result.data.confidence).toBeGreaterThan(0.9);
    });

    it('should handle low confidence responses', async () => {
      // Arrange
      const query = 'Unclear question';
      const documents = [
        {
          title: 'Unrelated Content',
          content: 'This content is not relevant...',
          similarity: 0.3
        }
      ];

      supabase.functions.invoke.mockResolvedValue({
        data: {
          response: 'I\'m not sure I understand your question...',
          confidence: 0.25
        },
        error: null
      });

      // Act
      const result = await RAGService.generateResponse(query, documents);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.confidence).toBeLessThan(0.5);
      expect(result.data.response).toContain('not sure');
    });
  });
});
```

### 3. Authentication Service Unit Tests
```javascript
// tests/unit/services/authService.test.js
const AuthService = require('../../src/services/authService');
const { supabase } = require('../../src/config/supabase');

jest.mock('../../src/config/supabase');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          department: 'Engineering'
        }
      };

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Act
      const result = await AuthService.authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.user.id).toBe('user-123');
      expect(result.data.user.email).toBe('test@example.com');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
    });

    it('should reject invalid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' }
      });

      // Act
      const result = await AuthService.authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Invalid login credentials');
    });

    it('should handle authentication errors', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      supabase.auth.signInWithPassword.mockRejectedValue(
        new Error('Network error')
      );

      // Act
      const result = await AuthService.authenticateUser(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Authentication failed');
    });
  });

  describe('validateToken', () => {
    it('should validate valid JWT token', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com'
      };

      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Act
      const result = await AuthService.validateToken(token);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.user.id).toBe('user-123');
    });

    it('should reject invalid JWT token', async () => {
      // Arrange
      const token = 'invalid-jwt-token';

      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid JWT' }
      });

      // Act
      const result = await AuthService.validateToken(token);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Invalid token');
    });
  });
});
```

### 4. User Service Unit Tests
```javascript
// tests/unit/services/userService.test.js
const UserService = require('../../src/services/userService');
const { supabase } = require('../../src/config/supabase');

jest.mock('../../src/config/supabase');

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const mockProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        department: 'Engineering',
        role: 'learner',
        learning_profile: {
          skills: ['python', 'javascript'],
          interests: ['machine learning', 'web development']
        }
      };

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null
            })
          })
        })
      });

      // Act
      const result = await UserService.getUserProfile(userId);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.profile.id).toBe('user-123');
      expect(result.data.profile.name).toBe('Test User');
    });

    it('should handle user not found', async () => {
      // Arrange
      const userId = 'non-existent-user';

      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'User not found' }
            })
          })
        })
      });

      // Act
      const result = await UserService.getUserProfile(userId);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error.message).toBe('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData = {
        name: 'Updated Name',
        department: 'Marketing'
      };
      const mockUpdatedProfile = {
        id: 'user-123',
        name: 'Updated Name',
        department: 'Marketing'
      };

      supabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockUpdatedProfile,
                error: null
              })
            })
          })
        })
      });

      // Act
      const result = await UserService.updateUserProfile(userId, updateData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.profile.name).toBe('Updated Name');
      expect(result.data.profile.department).toBe('Marketing');
    });
  });
});
```

---

## 🔗 Integration Testing Implementation

### 1. API Integration Tests
```javascript
// tests/integration/api/chat.test.js
const request = require('supertest');
const app = require('../../../src/app');
const { setupTestDatabase, teardownTestDatabase } = require('../../helpers/database');

describe('Chat API Integration', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await setupTestDatabase();
    
    // Create test user and get auth token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    
    authToken = userResponse.body.data.access_token;
    testUser = userResponse.body.data.user;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/chat/message', () => {
    it('should process chat message and return AI response', async () => {
      // Arrange
      const message = {
        message: 'How do I learn Python programming?',
        userId: testUser.id
      };

      // Act
      const response = await request(app)
        .post('/api/chat/message')
        .set('Authorization', `Bearer ${authToken}`)
        .send(message);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.response).toBeDefined();
      expect(response.body.data.confidence).toBeGreaterThan(0);
      expect(response.body.data.sources).toBeDefined();
      expect(response.body.data.processingTime).toBeGreaterThan(0);
    });

    it('should handle empty message', async () => {
      // Arrange
      const message = {
        message: '',
        userId: testUser.id
      };

      // Act
      const response = await request(app)
        .post('/api/chat/message')
        .set('Authorization', `Bearer ${authToken}`)
        .send(message);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Message cannot be empty');
    });

    it('should require authentication', async () => {
      // Arrange
      const message = {
        message: 'Test message',
        userId: testUser.id
      };

      // Act
      const response = await request(app)
        .post('/api/chat/message')
        .send(message);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Authentication required');
    });
  });

  describe('GET /api/chat/history', () => {
    it('should return user chat history', async () => {
      // Act
      const response = await request(app)
        .get('/api/chat/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ userId: testUser.id });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.messages)).toBe(true);
    });

    it('should support pagination', async () => {
      // Act
      const response = await request(app)
        .get('/api/chat/history')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          userId: testUser.id,
          page: 1,
          limit: 10
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });
  });
});
```

### 2. Database Integration Tests
```javascript
// tests/integration/database/ragQueries.test.js
const { PrismaClient } = require('@prisma/client');
const { setupTestDatabase, teardownTestDatabase } = require('../../helpers/database');

describe('RAG Database Integration', () => {
  let prisma;

  beforeAll(async () => {
    await setupTestDatabase();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await teardownTestDatabase();
  });

  describe('Vector Similarity Search', () => {
    it('should find relevant documents using vector similarity', async () => {
      // Arrange
      const queryEmbedding = [0.1, 0.2, 0.3, /* ... 1536 dimensions */];
      const threshold = 0.7;
      const limit = 5;

      // Act
      const result = await prisma.$queryRaw`
        SELECT 
          id,
          title,
          content,
          content_type,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity,
          metadata
        FROM learning_content
        WHERE embedding IS NOT NULL
          AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT ${limit}
      `;

      // Assert
      expect(Array.isArray(result)).toBe(true);
      result.forEach(doc => {
        expect(doc.similarity).toBeGreaterThan(threshold);
        expect(doc.id).toBeDefined();
        expect(doc.title).toBeDefined();
        expect(doc.content).toBeDefined();
      });
    });

    it('should handle empty results gracefully', async () => {
      // Arrange
      const queryEmbedding = [0.9, 0.9, 0.9, /* ... 1536 dimensions */];
      const threshold = 0.99; // Very high threshold

      // Act
      const result = await prisma.$queryRaw`
        SELECT 
          id,
          title,
          content,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
        FROM learning_content
        WHERE embedding IS NOT NULL
          AND 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > ${threshold}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        LIMIT 5
      `;

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('User Learning Analytics', () => {
    it('should calculate user learning analytics correctly', async () => {
      // Arrange
      const userId = 'test-user-123';

      // Act
      const result = await prisma.$queryRaw`
        SELECT 
          COUNT(DISTINCT lp.skill_id)::INTEGER as total_skills,
          COUNT(DISTINCT CASE WHEN lp.progress = 100 THEN lp.skill_id END)::INTEGER as completed_skills,
          COUNT(DISTINCT lp.course_id)::INTEGER as total_courses,
          COUNT(DISTINCT CASE WHEN lp.progress = 100 THEN lp.course_id END)::INTEGER as completed_courses,
          COALESCE(AVG(lp.progress), 0) as total_progress
        FROM learning_progress lp
        WHERE lp.user_id = ${userId}
      `;

      // Assert
      expect(result[0]).toBeDefined();
      expect(typeof result[0].total_skills).toBe('number');
      expect(typeof result[0].completed_skills).toBe('number');
      expect(typeof result[0].total_courses).toBe('number');
      expect(typeof result[0].completed_courses).toBe('number');
      expect(typeof result[0].total_progress).toBe('string'); // PostgreSQL returns numeric as string
    });
  });
});
```

---

## 🎭 End-to-End Testing Implementation

### 1. E2E Test Setup
```javascript
// tests/e2e/setup.js
const { chromium } = require('playwright');

let browser;
let context;
let page;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext();
  page = await context.newPage();
});

afterAll(async () => {
  await browser.close();
});

beforeEach(async () => {
  page = await context.newPage();
});

afterEach(async () => {
  await page.close();
});

module.exports = { page };
```

### 2. Chat Interface E2E Tests
```javascript
// tests/e2e/chatWorkflow.test.js
const { page } = require('./setup');

describe('Chat Interface E2E', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  describe('User Chat Workflow', () => {
    it('should complete full chat interaction', async () => {
      // Arrange
      const testMessage = 'How do I learn Python programming?';

      // Act - Login
      await page.click('[data-testid="login-button"]');
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-submit"]');

      // Wait for login to complete
      await page.waitForSelector('[data-testid="chat-interface"]');

      // Act - Send message
      await page.fill('[data-testid="message-input"]', testMessage);
      await page.click('[data-testid="send-button"]');

      // Assert - Wait for response
      await page.waitForSelector('[data-testid="ai-response"]', { timeout: 10000 });
      
      const response = await page.textContent('[data-testid="ai-response"]');
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);

      // Assert - Check confidence score
      const confidenceElement = await page.querySelector('[data-testid="confidence-score"]');
      if (confidenceElement) {
        const confidence = await page.textContent('[data-testid="confidence-score"]');
        expect(parseFloat(confidence)).toBeGreaterThan(0);
      }

      // Assert - Check sources
      const sources = await page.querySelectorAll('[data-testid="source-item"]');
      expect(sources.length).toBeGreaterThan(0);
    });

    it('should handle typing indicator', async () => {
      // Arrange
      const testMessage = 'What is machine learning?';

      // Act - Send message
      await page.fill('[data-testid="message-input"]', testMessage);
      await page.click('[data-testid="send-button"]');

      // Assert - Check typing indicator appears
      await page.waitForSelector('[data-testid="typing-indicator"]');
      
      // Assert - Check typing indicator disappears
      await page.waitForSelector('[data-testid="typing-indicator"]', { state: 'hidden' });
    });

    it('should display chat history', async () => {
      // Act - Navigate to chat history
      await page.click('[data-testid="chat-history-button"]');

      // Assert - Check history is displayed
      await page.waitForSelector('[data-testid="chat-history"]');
      
      const historyItems = await page.querySelectorAll('[data-testid="history-item"]');
      expect(historyItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling E2E', () => {
    it('should handle network errors gracefully', async () => {
      // Arrange - Simulate network error
      await page.route('**/api/chat/message', route => {
        route.abort('failed');
      });

      // Act
      await page.fill('[data-testid="message-input"]', 'Test message');
      await page.click('[data-testid="send-button"]');

      // Assert - Check error message
      await page.waitForSelector('[data-testid="error-message"]');
      const errorMessage = await page.textContent('[data-testid="error-message"]');
      expect(errorMessage).toContain('error');
    });

    it('should handle empty message submission', async () => {
      // Act - Try to send empty message
      await page.click('[data-testid="send-button"]');

      // Assert - Check validation message
      await page.waitForSelector('[data-testid="validation-error"]');
      const validationError = await page.textContent('[data-testid="validation-error"]');
      expect(validationError).toContain('empty');
    });
  });
});
```

### 3. Learning Dashboard E2E Tests
```javascript
// tests/e2e/dashboardWorkflow.test.js
const { page } = require('./setup');

describe('Learning Dashboard E2E', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000/dashboard');
  });

  describe('Dashboard Display', () => {
    it('should display user learning progress', async () => {
      // Assert - Check progress elements
      await page.waitForSelector('[data-testid="learning-progress"]');
      
      const progressBars = await page.querySelectorAll('[data-testid="progress-bar"]');
      expect(progressBars.length).toBeGreaterThan(0);

      const skillCount = await page.textContent('[data-testid="total-skills"]');
      expect(parseInt(skillCount)).toBeGreaterThanOrEqual(0);
    });

    it('should display recommendations', async () => {
      // Assert - Check recommendations section
      await page.waitForSelector('[data-testid="recommendations-section"]');
      
      const recommendations = await page.querySelectorAll('[data-testid="recommendation-item"]');
      expect(recommendations.length).toBeGreaterThanOrEqual(0);
    });

    it('should display recent activity', async () => {
      // Assert - Check recent activity
      await page.waitForSelector('[data-testid="recent-activity"]');
      
      const activityItems = await page.querySelectorAll('[data-testid="activity-item"]');
      expect(activityItems.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Dashboard Interactions', () => {
    it('should navigate to skill details', async () => {
      // Act - Click on a skill
      await page.click('[data-testid="skill-item"]:first-child');

      // Assert - Check navigation to skill details
      await page.waitForSelector('[data-testid="skill-details"]');
      
      const skillTitle = await page.textContent('[data-testid="skill-title"]');
      expect(skillTitle).toBeDefined();
    });

    it('should filter recommendations by type', async () => {
      // Act - Filter by course type
      await page.click('[data-testid="filter-courses"]');

      // Assert - Check filtered results
      const courseRecommendations = await page.querySelectorAll('[data-testid="course-recommendation"]');
      expect(courseRecommendations.length).toBeGreaterThanOrEqual(0);
    });
  });
});
```

---

## 📊 Performance Testing Implementation

### 1. Load Testing with K6
```javascript
// tests/performance/loadTest.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3 seconds
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
    errors: ['rate<0.1'],              // Custom error rate under 10%
  },
};

export default function() {
  // Test chat message endpoint
  const chatPayload = JSON.stringify({
    message: 'How do I learn Python programming?',
    userId: 'test-user-' + Math.random()
  });

  const chatResponse = http.post('http://localhost:8000/api/chat/message', chatPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const chatSuccess = check(chatResponse, {
    'chat response status is 200': (r) => r.status === 200,
    'chat response time < 3s': (r) => r.timings.duration < 3000,
    'chat response has confidence': (r) => JSON.parse(r.body).data.confidence > 0,
  });

  errorRate.add(!chatSuccess);

  // Test user profile endpoint
  const profileResponse = http.get('http://localhost:8000/api/users/profile', {
    headers: { 'Authorization': 'Bearer test-token' },
  });

  const profileSuccess = check(profileResponse, {
    'profile response status is 200': (r) => r.status === 200,
    'profile response time < 1s': (r) => r.timings.duration < 1000,
  });

  errorRate.add(!profileSuccess);

  sleep(1);
}
```

### 2. RAG Query Performance Test
```javascript
// tests/performance/ragPerformance.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 5, // 5 virtual users
  duration: '2m',
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% under 3 seconds
    http_req_failed: ['rate<0.05'],    // Error rate under 5%
  },
};

const testQueries = [
  'How do I learn Python programming?',
  'What is machine learning?',
  'Explain data analysis techniques',
  'What are the best practices for project management?',
  'How do I improve my communication skills?',
  'What is React development?',
  'Explain database design principles',
  'What is agile methodology?'
];

export default function() {
  const query = testQueries[Math.floor(Math.random() * testQueries.length)];
  
  const payload = JSON.stringify({
    message: query,
    userId: 'perf-test-user'
  });

  const response = http.post('http://localhost:8000/api/chat/message', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const success = check(response, {
    'RAG query successful': (r) => r.status === 200,
    'RAG response time < 3s': (r) => r.timings.duration < 3000,
    'RAG confidence > 0.5': (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.confidence > 0.5;
    },
    'RAG has sources': (r) => {
      const body = JSON.parse(r.body);
      return body.data && body.data.sources && body.data.sources.length > 0;
    },
  });

  if (!success) {
    console.log(`Failed query: ${query}, Status: ${response.status}, Duration: ${response.timings.duration}`);
  }

  sleep(1);
}
```

---

## 🔒 Security Testing Implementation

### 1. Authentication Security Tests
```javascript
// tests/security/authSecurity.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Authentication Security', () => {
  describe('JWT Token Security', () => {
    it('should reject expired tokens', async () => {
      // Arrange
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Expired token

      // Act
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('expired');
    });

    it('should reject malformed tokens', async () => {
      // Arrange
      const malformedToken = 'invalid-token-format';

      // Act
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${malformedToken}`);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error.message).toContain('invalid');
    });

    it('should reject tokens without Bearer prefix', async () => {
      // Arrange
      const token = 'valid-jwt-token';

      // Act
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', token);

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent SQL injection in chat messages', async () => {
      // Arrange
      const maliciousMessage = "'; DROP TABLE users; --";

      // Act
      const response = await request(app)
        .post('/api/chat/message')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: maliciousMessage });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('invalid');
    });

    it('should prevent XSS in user input', async () => {
      // Arrange
      const xssMessage = '<script>alert("XSS")</script>';

      // Act
      const response = await request(app)
        .post('/api/chat/message')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: xssMessage });

      // Assert
      expect(response.status).toBe(200);
      // Check that response is sanitized
      expect(response.body.data.response).not.toContain('<script>');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on chat endpoint', async () => {
      const promises = [];
      
      // Send 100 requests rapidly
      for (let i = 0; i < 100; i++) {
        promises.push(
          request(app)
            .post('/api/chat/message')
            .set('Authorization', 'Bearer valid-token')
            .send({ message: `Test message ${i}` })
        );
      }

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
```

### 2. Database Security Tests
```javascript
// tests/security/databaseSecurity.test.js
const { PrismaClient } = require('@prisma/client');

describe('Database Security', () => {
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Row Level Security', () => {
    it('should enforce RLS policies on users table', async () => {
      // This test would need to be run with different user contexts
      // to verify that users can only access their own data
      
      // Test with user A context
      const userAContext = await prisma.$queryRaw`
        SET LOCAL auth.uid = 'user-a-id';
        SELECT * FROM users WHERE id = 'user-b-id';
      `;
      
      // Should return empty result due to RLS
      expect(userAContext).toHaveLength(0);
    });

    it('should prevent unauthorized access to chat messages', async () => {
      // Test that users cannot access other users' chat messages
      const unauthorizedAccess = await prisma.$queryRaw`
        SET LOCAL auth.uid = 'user-a-id';
        SELECT * FROM chat_messages WHERE user_id = 'user-b-id';
      `;
      
      expect(unauthorizedAccess).toHaveLength(0);
    });
  });

  describe('Data Validation', () => {
    it('should enforce data type constraints', async () => {
      // Test that invalid data types are rejected
      try {
        await prisma.user.create({
          data: {
            email: 123, // Invalid type
            name: 'Test User'
          }
        });
        fail('Should have thrown validation error');
      } catch (error) {
        expect(error.message).toContain('validation');
      }
    });

    it('should enforce required field constraints', async () => {
      // Test that required fields cannot be null
      try {
        await prisma.user.create({
          data: {
            // Missing required email field
            name: 'Test User'
          }
        });
        fail('Should have thrown constraint error');
      } catch (error) {
        expect(error.message).toContain('required');
      }
    });
  });
});
```

---

## 🚀 Test Automation Pipeline

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run db:migrate:test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Start application
        run: npm run start:test &
      
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run start:test &
      
      - name: Wait for application
        run: npx wait-on http://localhost:3000
      
      - name: Run performance tests
        run: npm run test:performance
      
      - name: Upload performance results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: performance-results/

  security-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run security tests
        run: npm run test:security
      
      - name: Run security audit
        run: npm audit --audit-level moderate
```

### 2. Test Scripts Configuration
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:performance": "k6 run tests/performance/loadTest.js",
    "test:security": "jest --testPathPattern=security",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "db:migrate:test": "prisma migrate deploy --schema=./prisma/schema.prisma"
  }
}
```

---

## 📈 Quality Metrics and Reporting

### 1. Test Coverage Reporting
```javascript
// tests/coverage/report.js
const fs = require('fs');
const path = require('path');

class CoverageReporter {
  constructor() {
    this.coverageData = {};
  }

  generateReport(coverageData) {
    this.coverageData = coverageData;
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateSummary(),
      details: this.generateDetails(),
      trends: this.calculateTrends(),
      recommendations: this.generateRecommendations()
    };

    this.saveReport(report);
    return report;
  }

  calculateSummary() {
    const { statements, branches, functions, lines } = this.coverageData.total;
    
    return {
      overall: Math.round((statements.pct + branches.pct + functions.pct + lines.pct) / 4),
      statements: statements.pct,
      branches: branches.pct,
      functions: functions.pct,
      lines: lines.pct,
      threshold: 85,
      status: this.getCoverageStatus(statements.pct)
    };
  }

  getCoverageStatus(coverage) {
    if (coverage >= 90) return 'excellent';
    if (coverage >= 85) return 'good';
    if (coverage >= 75) return 'acceptable';
    return 'needs-improvement';
  }

  generateDetails() {
    const details = {};
    
    Object.keys(this.coverageData).forEach(file => {
      if (file === 'total') return;
      
      const fileData = this.coverageData[file];
      details[file] = {
        statements: fileData.statements.pct,
        branches: fileData.branches.pct,
        functions: fileData.functions.pct,
        lines: fileData.lines.pct,
        uncoveredLines: fileData.lines.uncovered
      };
    });

    return details;
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.calculateSummary();

    if (summary.overall < 85) {
      recommendations.push({
        type: 'coverage',
        priority: 'high',
        message: `Overall coverage is ${summary.overall}%, below the 85% threshold`
      });
    }

    if (summary.branches < 80) {
      recommendations.push({
        type: 'branches',
        priority: 'medium',
        message: `Branch coverage is ${summary.branches}%, consider adding more edge case tests`
      });
    }

    return recommendations;
  }

  saveReport(report) {
    const reportPath = path.join(__dirname, '../reports/coverage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  }
}

module.exports = CoverageReporter;
```

### 2. Performance Metrics Dashboard
```javascript
// tests/metrics/performanceMetrics.js
class PerformanceMetrics {
  constructor() {
    this.metrics = {
      responseTime: [],
      throughput: [],
      errorRate: [],
      memoryUsage: [],
      cpuUsage: []
    };
  }

  recordMetric(type, value, timestamp = Date.now()) {
    if (this.metrics[type]) {
      this.metrics[type].push({ value, timestamp });
    }
  }

  calculateAverages() {
    const averages = {};
    
    Object.keys(this.metrics).forEach(metric => {
      const values = this.metrics[metric].map(m => m.value);
      averages[metric] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    return averages;
  }

  generatePerformanceReport() {
    const averages = this.calculateAverages();
    const thresholds = {
      responseTime: 3000, // 3 seconds
      errorRate: 0.01,    // 1%
      memoryUsage: 512,   // 512 MB
      cpuUsage: 80        // 80%
    };

    const report = {
      timestamp: new Date().toISOString(),
      averages,
      thresholds,
      status: this.calculatePerformanceStatus(averages, thresholds),
      recommendations: this.generatePerformanceRecommendations(averages, thresholds)
    };

    return report;
  }

  calculatePerformanceStatus(averages, thresholds) {
    const status = {
      responseTime: averages.responseTime <= thresholds.responseTime ? 'pass' : 'fail',
      errorRate: averages.errorRate <= thresholds.errorRate ? 'pass' : 'fail',
      memoryUsage: averages.memoryUsage <= thresholds.memoryUsage ? 'pass' : 'fail',
      cpuUsage: averages.cpuUsage <= thresholds.cpuUsage ? 'pass' : 'fail'
    };

    const overallStatus = Object.values(status).every(s => s === 'pass') ? 'pass' : 'fail';
    
    return { ...status, overall: overallStatus };
  }

  generatePerformanceRecommendations(averages, thresholds) {
    const recommendations = [];

    if (averages.responseTime > thresholds.responseTime) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: `Average response time ${averages.responseTime}ms exceeds threshold ${thresholds.responseTime}ms`
      });
    }

    if (averages.errorRate > thresholds.errorRate) {
      recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: `Error rate ${averages.errorRate}% exceeds threshold ${thresholds.errorRate}%`
      });
    }

    return recommendations;
  }
}

module.exports = PerformanceMetrics;
```

---

## 📊 Test Data Management

### 1. Test Data Factory
```javascript
// tests/helpers/testDataFactory.js
class TestDataFactory {
  static createUser(overrides = {}) {
    return {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      email: `test-${Math.random().toString(36).substr(2, 9)}@example.com`,
      name: 'Test User',
      department: 'Engineering',
      role: 'learner',
      learning_profile: {
        skills: ['python', 'javascript'],
        interests: ['machine learning', 'web development']
      },
      preferences: {
        notifications: true,
        theme: 'light'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }

  static createLearningContent(overrides = {}) {
    return {
      id: `content-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Test Learning Content',
      content: 'This is test learning content for testing purposes.',
      content_type: 'tutorial',
      embedding: this.generateRandomEmbedding(),
      metadata: {
        difficulty: 'beginner',
        tags: ['test', 'example']
      },
      source_service: 'content-studio',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }

  static createChatMessage(overrides = {}) {
    return {
      id: `message-${Math.random().toString(36).substr(2, 9)}`,
      user_id: `user-${Math.random().toString(36).substr(2, 9)}`,
      message: 'Test chat message',
      response: 'Test AI response',
      confidence: 0.85,
      sources: [
        {
          id: 'source-1',
          title: 'Test Source',
          contentType: 'tutorial'
        }
      ],
      processing_time: 1200,
      created_at: new Date().toISOString(),
      ...overrides
    };
  }

  static generateRandomEmbedding() {
    // Generate random 1536-dimensional vector
    return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  }

  static createSkill(overrides = {}) {
    return {
      id: `skill-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test Skill',
      description: 'Test skill description',
      category: 'Technical',
      level: 1,
      prerequisites: [],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }

  static createCourse(overrides = {}) {
    return {
      id: `course-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Test Course',
      description: 'Test course description',
      duration: 60,
      difficulty: 'beginner',
      prerequisites: [],
      learning_objectives: ['Learn test concepts'],
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }
}

module.exports = TestDataFactory;
```

### 2. Database Test Helpers
```javascript
// tests/helpers/database.js
const { PrismaClient } = require('@prisma/client');

class DatabaseTestHelper {
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db'
        }
      }
    });
  }

  async setupTestDatabase() {
    // Run migrations
    await this.prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await this.prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS "vector"`;
    
    // Create test tables if they don't exist
    await this.createTestTables();
  }

  async teardownTestDatabase() {
    // Clean up test data
    await this.cleanTestData();
    await this.prisma.$disconnect();
  }

  async cleanTestData() {
    // Delete test data in reverse dependency order
    await this.prisma.chatMessage.deleteMany();
    await this.prisma.recommendation.deleteMany();
    await this.prisma.assessmentResult.deleteMany();
    await this.prisma.learningProgress.deleteMany();
    await this.prisma.learningContent.deleteMany();
    await this.prisma.assessment.deleteMany();
    await this.prisma.course.deleteMany();
    await this.prisma.skill.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async createTestUser(userData = {}) {
    const TestDataFactory = require('./testDataFactory');
    const user = TestDataFactory.createUser(userData);
    
    return await this.prisma.user.create({
      data: user
    });
  }

  async createTestLearningContent(contentData = {}) {
    const TestDataFactory = require('./testDataFactory');
    const content = TestDataFactory.createLearningContent(contentData);
    
    return await this.prisma.learningContent.create({
      data: content
    });
  }

  async createTestChatMessage(messageData = {}) {
    const TestDataFactory = require('./testDataFactory');
    const message = TestDataFactory.createChatMessage(messageData);
    
    return await this.prisma.chatMessage.create({
      data: message
    });
  }

  async createTestSkill(skillData = {}) {
    const TestDataFactory = require('./testDataFactory');
    const skill = TestDataFactory.createSkill(skillData);
    
    return await this.prisma.skill.create({
      data: skill
    });
  }

  async createTestCourse(courseData = {}) {
    const TestDataFactory = require('./testDataFactory');
    const course = TestDataFactory.createCourse(courseData);
    
    return await this.prisma.course.create({
      data: course
    });
  }
}

module.exports = DatabaseTestHelper;
```

---

**Document Status**: Implementation Complete
**Last Updated**: December 2024
**Next Review**: Testing Execution and Validation
**Approved By**: [Name and Title]


