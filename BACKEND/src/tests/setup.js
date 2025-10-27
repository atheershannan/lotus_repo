// Mock mode - skip database connection
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
process.env.USE_MOCK_DATA = 'true';

// Skip database connection in mock mode
let prisma = null;

if (!process.env.USE_MOCK_DATA || process.env.USE_MOCK_DATA === 'false') {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
}

// Clean up after each test
afterEach(async () => {
  // Clean up test data if needed
  // This can be customized based on test requirements
});

// Global test utilities (mock mode)
global.testUtils = {
  createTestUser: async (userData = {}) => {
    if (prisma) {
      return await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          department: 'Engineering',
          role: 'learner',
          learningProfile: {},
          preferences: {},
          isActive: true,
          ...userData
        }
      });
    }
    // Return mock user in mock mode
    return { id: 'mock-user', ...userData };
  },

  createTestContent: async (contentData = {}) => {
    if (prisma) {
      return await prisma.learningContent.create({
        data: {
          title: 'Test Course',
          description: 'A test course',
          contentType: 'course',
          contentData: {},
          difficultyLevel: 'beginner',
          isPublished: true,
          createdById: 'test-user-id',
          ...contentData
        }
      });
    }
    // Return mock content in mock mode
    return { id: 'mock-content', ...contentData };
  },

  cleanupTestData: async () => {
    if (prisma) {
      await prisma.chatMessage.deleteMany({});
      await prisma.userProgress.deleteMany({});
      await prisma.learningContent.deleteMany({});
      await prisma.user.deleteMany({});
    }
    // No cleanup needed in mock mode
  }
};


