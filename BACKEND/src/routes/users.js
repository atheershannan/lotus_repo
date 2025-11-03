const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireDepartmentAccess, asyncHandler, validateRequest } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const updateProfileSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  department: Joi.string().max(100).optional(),
  learningProfile: Joi.object().optional(),
  preferences: Joi.object().optional()
});

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(1).max(255).required(),
  department: Joi.string().max(100).optional(),
  role: Joi.string().valid('learner', 'hr_manager', 'trainer', 'admin').default('learner'),
  learningProfile: Joi.object().default({}),
  preferences: Joi.object().default({})
});

// GET /api/users/profile - Get current user profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user profile',
      details: error.message
    });
  }
}));

// PUT /api/users/profile - Update current user profile
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
      details: error.message
    });
  }
}));

// GET /api/users - Get users (admin/HR manager only)
router.get('/', authenticateToken, requireRole(['admin', 'hr_manager']), requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, department, role, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereClause = {
      isActive: true,
      ...(req.departmentFilter && { department: req.departmentFilter }),
      ...(department && { department }),
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          department: true,
          role: true,
          createdAt: true,
          lastActiveAt: true,
          learningProfile: true
        },
        orderBy: { name: 'asc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.user.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      details: error.message
    });
  }
}));

// POST /api/users - Create new user (admin only)
router.post('/', authenticateToken, requireRole(['admin']), validateRequest(createUserSchema), asyncHandler(async (req, res) => {
  const userData = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        createdAt: true,
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      data: { user: newUser }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
}));

// GET /api/users/:userId - Get specific user details
router.get('/:userId', authenticateToken, requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    // Users can view their own profile, admins can view all, HR managers can view department
    const canView = userId === currentUserId || 
                   req.user.role === 'admin' || 
                   (req.user.role === 'hr_manager' && req.departmentFilter);

    if (!canView) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to view this user'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      details: error.message
    });
  }
}));

// PUT /api/users/:userId - Update user (admin only)
router.put('/:userId', authenticateToken, requireRole(['admin']), validateRequest(updateProfileSchema), asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        department: true,
        role: true,
        learningProfile: true,
        preferences: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
}));

// DELETE /api/users/:userId - Deactivate user (admin only)
router.delete('/:userId', authenticateToken, requireRole(['admin']), asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user',
      details: error.message
    });
  }
}));

// GET /api/users/:userId/progress - Get user learning progress
router.get('/:userId/progress', authenticateToken, requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    // Users can view their own progress, admins can view all, HR managers can view department
    const canView = userId === currentUserId || 
                   req.user.role === 'admin' || 
                   (req.user.role === 'hr_manager' && req.departmentFilter);

    if (!canView) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to view this user\'s progress'
      });
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        content: {
          select: {
            id: true,
            title: true,
            contentType: true,
            difficultyLevel: true,
            estimatedDuration: true
          }
        },
        skill: {
          select: {
            id: true,
            name: true,
            category: true,
            level: true
          }
        }
      },
      orderBy: { lastAccessedAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        userId,
        progress,
        count: progress.length
      }
    });

  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user progress',
      details: error.message
    });
  }
}));

// GET /api/users/:userId/analytics - Get user learning analytics
router.get('/:userId/analytics', authenticateToken, requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { period = '30d' } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get analytics using database function
    const analytics = await prisma.$queryRaw`
      SELECT * FROM get_user_learning_analytics(${userId})
    `;

    // Get additional analytics data
    const recentActivity = await prisma.userProgress.findMany({
      where: {
        userId,
        lastAccessedAt: { gte: startDate }
      },
      include: {
        content: {
          select: { title: true, contentType: true }
        },
        skill: {
          select: { name: true, category: true }
        }
      },
      orderBy: { lastAccessedAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        userId,
        period,
        analytics: analytics[0] || {},
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user analytics',
      details: error.message
    });
  }
}));

module.exports = router;


