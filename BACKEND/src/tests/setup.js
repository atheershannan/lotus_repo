const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

// Clean up after each test
afterEach(async () => {
  // Clean up test data if needed
  // This can be customized based on test requirements
});

// Global test utilities
global.testUtils = {
  createTestUser: async (userData = {}) => {
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
  },

  createTestContent: async (contentData = {}) => {
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
  },

  cleanupTestData: async () => {
    await prisma.chatMessage.deleteMany({});
    await prisma.userProgress.deleteMany({});
    await prisma.learningContent.deleteMany({});
    await prisma.user.deleteMany({});
  }
};


