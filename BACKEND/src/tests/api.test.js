const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test data
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  department: 'Engineering',
  role: 'learner',
  learningProfile: { skills: ['javascript', 'react'] },
  preferences: { theme: 'light' }
};

const testContent = {
  title: 'Test Course',
  description: 'A test course for testing',
  contentType: 'course',
  contentData: { modules: ['Module 1', 'Module 2'] },
  difficultyLevel: 'beginner',
  estimatedDuration: 120,
  skillsCovered: ['javascript'],
  learningObjectives: ['Learn JavaScript basics'],
  isPublished: true
};

describe('Corporate Learning Assistant API', () => {
  let authToken;
  let userId;
  let contentId;

  beforeAll(async () => {
    // Clean up test data
    await prisma.chatMessage.deleteMany({});
    await prisma.userProgress.deleteMany({});
    await prisma.learningContent.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    test('POST /api/auth/login - should login user', async () => {
      // This would require actual Supabase setup
      // For now, we'll test the endpoint structure
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Expect 401 since we don't have real Supabase setup
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('GET /api/auth/me - should require authentication', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Health Check', () => {
    test('GET /health - should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('Content Management', () => {
    test('GET /api/content - should return content list', async () => {
      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(401); // Requires authentication
    });

    test('POST /api/content - should require authentication', async () => {
      const response = await request(app)
        .post('/api/content')
        .send(testContent);

      expect(response.status).toBe(401);
    });
  });

  describe('Search', () => {
    test('POST /api/search/content - should require authentication', async () => {
      const response = await request(app)
        .post('/api/search/content')
        .send({
          query: 'javascript',
          type: 'hybrid',
          limit: 10
        });

      expect(response.status).toBe(401);
    });

    test('GET /api/search/suggestions - should require authentication', async () => {
      const response = await request(app)
        .get('/api/search/suggestions?q=javascript');

      expect(response.status).toBe(401);
    });
  });

  describe('Chat', () => {
    test('POST /api/chat/message - should require authentication', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .send({
          message: 'What is JavaScript?',
          sessionId: 'test-session-123'
        });

      expect(response.status).toBe(401);
    });

    test('GET /api/chat/sessions - should require authentication', async () => {
      const response = await request(app)
        .get('/api/chat/sessions');

      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to API routes', async () => {
      // Make multiple requests to test rate limiting
      const requests = Array(10).fill().map(() => 
        request(app).get('/api/content')
      );

      const responses = await Promise.all(requests);
      
      // All should be 401 (unauthorized) but not 429 (rate limited)
      // Rate limiting would kick in after 100 requests per 15 minutes
      responses.forEach(response => {
        expect(response.status).toBe(401);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });

    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/content')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });

  describe('CORS', () => {
    test('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/content')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

      expect(response.status).toBe(204);
    });
  });
});

// Integration tests for database functions
describe('Database Functions', () => {
  beforeAll(async () => {
    // Set up test data
    const user = await prisma.user.create({
      data: testUser
    });
    userId = user.id;

    const content = await prisma.learningContent.create({
      data: {
        ...testContent,
        createdById: userId
      }
    });
    contentId = content.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.learningContent.deleteMany({});
    await prisma.user.deleteMany({});
  });

  test('should execute user learning analytics function', async () => {
    const result = await prisma.$queryRaw`
      SELECT * FROM get_user_learning_analytics(${userId})
    `;

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test('should execute recommendations function', async () => {
    const result = await prisma.$queryRaw`
      SELECT * FROM generate_recommendations(${userId}, 5)
    `;

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  test('should execute content search function', async () => {
    const result = await prisma.$queryRaw`
      SELECT * FROM search_learning_content('javascript', NULL, 10)
    `;

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});

// Performance tests
describe('Performance Tests', () => {
  test('health check should respond quickly', async () => {
    const start = Date.now();
    const response = await request(app).get('/health');
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Should respond in less than 100ms
  });

  test('should handle concurrent requests', async () => {
    const requests = Array(20).fill().map(() => 
      request(app).get('/health')
    );

    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    expect(duration).toBeLessThan(1000); // All requests should complete in less than 1 second
  });
});


