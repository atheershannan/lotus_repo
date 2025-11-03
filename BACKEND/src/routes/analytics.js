const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, requireDepartmentAccess, asyncHandler } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/analytics/overview - Get analytics overview
router.get('/overview', authenticateToken, requireRole(['admin', 'hr_manager']), requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get department filter for HR managers
    const departmentFilter = req.departmentFilter;

    const whereClause = {
      createdAt: { gte: startDate },
      ...(departmentFilter && {
        user: {
          department: departmentFilter
        }
      })
    };

    const [
      totalUsers,
      activeUsers,
      totalProgress,
      completedProgress,
      totalContent,
      totalSkills
    ] = await Promise.all([
      prisma.user.count({
        where: {
          isActive: true,
          ...(departmentFilter && { department: departmentFilter })
        }
      }),
      prisma.user.count({
        where: {
          isActive: true,
          lastActiveAt: { gte: startDate },
          ...(departmentFilter && { department: departmentFilter })
        }
      }),
      prisma.userProgress.count({
        where: whereClause
      }),
      prisma.userProgress.count({
        where: {
          ...whereClause,
          status: 'completed'
        }
      }),
      prisma.learningContent.count({
        where: { isPublished: true }
      }),
      prisma.skill.count()
    ]);

    const completionRate = totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0;

    res.json({
      success: true,
      data: {
        period,
        overview: {
          totalUsers,
          activeUsers,
          totalProgress,
          completedProgress,
          completionRate: Math.round(completionRate * 100) / 100,
          totalContent,
          totalSkills
        }
      }
    });

  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics overview',
      details: error.message
    });
  }
}));

// GET /api/analytics/learning - Get learning analytics
router.get('/learning', authenticateToken, requireRole(['admin', 'hr_manager']), requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { period = '30d', department } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const departmentFilter = department || req.departmentFilter;

    const whereClause = {
      createdAt: { gte: startDate },
      ...(departmentFilter && {
        user: {
          department: departmentFilter
        }
      })
    };

    // Get learning analytics by content type
    const contentAnalytics = await prisma.userProgress.groupBy({
      by: ['progressType'],
      where: whereClause,
      _count: {
        id: true
      },
      _avg: {
        completionPercentage: true
      }
    });

    // Get top skills
    const topSkills = await prisma.userProgress.groupBy({
      by: ['skillId'],
      where: {
        ...whereClause,
        skillId: { not: null }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    // Get skill details
    const skillIds = topSkills.map(skill => skill.skillId);
    const skillDetails = await prisma.skill.findMany({
      where: { id: { in: skillIds } },
      select: {
        id: true,
        name: true,
        category: true,
        level: true
      }
    });

    const topSkillsWithDetails = topSkills.map(skill => {
      const details = skillDetails.find(d => d.id === skill.skillId);
      return {
        skillId: skill.skillId,
        count: skill._count.id,
        ...details
      };
    });

    res.json({
      success: true,
      data: {
        period,
        department: departmentFilter,
        contentAnalytics,
        topSkills: topSkillsWithDetails
      }
    });

  } catch (error) {
    console.error('Get learning analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve learning analytics',
      details: error.message
    });
  }
}));

// GET /api/analytics/users - Get user analytics
router.get('/users', authenticateToken, requireRole(['admin', 'hr_manager']), requireDepartmentAccess, asyncHandler(async (req, res) => {
  const { period = '30d', department } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const departmentFilter = department || req.departmentFilter;

    // Get user analytics by department
    const userAnalytics = await prisma.user.groupBy({
      by: ['department', 'role'],
      where: {
        isActive: true,
        ...(departmentFilter && { department: departmentFilter })
      },
      _count: {
        id: true
      }
    });

    // Get active users by department
    const activeUsers = await prisma.user.groupBy({
      by: ['department'],
      where: {
        isActive: true,
        lastActiveAt: { gte: startDate },
        ...(departmentFilter && { department: departmentFilter })
      },
      _count: {
        id: true
      }
    });

    res.json({
      success: true,
      data: {
        period,
        department: departmentFilter,
        userAnalytics,
        activeUsers
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


