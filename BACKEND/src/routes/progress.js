const express = require('express');
const router = express.Router();
const { authenticateToken, asyncHandler, validateRequest } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const updateProgressSchema = Joi.object({
  contentId: Joi.string().uuid().optional(),
  skillId: Joi.string().uuid().optional(),
  progressType: Joi.string().valid('content', 'skill', 'assessment').required(),
  progressData: Joi.object().default({}),
  completionPercentage: Joi.number().min(0).max(100).required(),
  status: Joi.string().valid('not_started', 'in_progress', 'completed', 'failed').required()
});

// GET /api/progress - Get user's progress
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { 
    page = 1, 
    limit = 20, 
    progressType, 
    status,
    contentType 
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereClause = {
      userId,
      ...(progressType && { progressType }),
      ...(status && { status }),
      ...(contentType && {
        content: {
          contentType
        }
      })
    };

    const [progress, total] = await Promise.all([
      prisma.userProgress.findMany({
        where: whereClause,
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
        orderBy: { lastAccessedAt: 'desc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.userProgress.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        progress,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress',
      details: error.message
    });
  }
}));

// POST /api/progress - Update user progress
router.post('/', authenticateToken, validateRequest(updateProgressSchema), asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { contentId, skillId, progressType, progressData, completionPercentage, status } = req.body;

  try {
    // Validate that either contentId or skillId is provided based on progressType
    if (progressType === 'content' && !contentId) {
      return res.status(400).json({
        success: false,
        error: 'contentId is required for content progress'
      });
    }

    if (progressType === 'skill' && !skillId) {
      return res.status(400).json({
        success: false,
        error: 'skillId is required for skill progress'
      });
    }

    // Check if progress already exists
    const existingProgress = await prisma.userProgress.findFirst({
      where: {
        userId,
        contentId: contentId || null,
        skillId: skillId || null,
        progressType
      }
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.userProgress.update({
        where: { id: existingProgress.id },
        data: {
          progressData,
          completionPercentage,
          status,
          completedAt: status === 'completed' ? new Date() : null,
          lastAccessedAt: new Date(),
          updatedAt: new Date()
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              contentType: true
            }
          },
          skill: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      });
    } else {
      // Create new progress
      progress = await prisma.userProgress.create({
        data: {
          userId,
          contentId,
          skillId,
          progressType,
          progressData,
          completionPercentage,
          status,
          startedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : null,
          lastAccessedAt: new Date()
        },
        include: {
          content: {
            select: {
              id: true,
              title: true,
              contentType: true
            }
          },
          skill: {
            select: {
              id: true,
              name: true,
              category: true
            }
          }
        }
      });
    }

    res.json({
      success: true,
      data: { progress }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress',
      details: error.message
    });
  }
}));

// GET /api/progress/stats - Get progress statistics
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period = '30d' } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const stats = await prisma.userProgress.groupBy({
      by: ['status', 'progressType'],
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      _avg: {
        completionPercentage: true
      }
    });

    const totalProgress = await prisma.userProgress.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    });

    const completedProgress = await prisma.userProgress.count({
      where: {
        userId,
        status: 'completed',
        createdAt: { gte: startDate }
      }
    });

    const avgCompletion = await prisma.userProgress.aggregate({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _avg: {
        completionPercentage: true
      }
    });

    res.json({
      success: true,
      data: {
        period,
        totalProgress,
        completedProgress,
        completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
        avgCompletionPercentage: avgCompletion._avg.completionPercentage || 0,
        breakdown: stats.map(stat => ({
          status: stat.status,
          progressType: stat.progressType,
          count: stat._count.id,
          avgCompletion: stat._avg.completionPercentage || 0
        }))
      }
    });

  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve progress statistics',
      details: error.message
    });
  }
}));

module.exports = router;


