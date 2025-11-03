const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, asyncHandler, validateRequest } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const ragService = require('../services/ragService');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const createContentSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  description: Joi.string().max(2000).optional(),
  contentType: Joi.string().valid('course', 'lesson', 'module', 'exercise', 'assessment').required(),
  contentData: Joi.object().default({}),
  difficultyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  estimatedDuration: Joi.number().min(1).optional(),
  skillsCovered: Joi.array().items(Joi.string()).default([]),
  prerequisites: Joi.array().items(Joi.string()).default([]),
  learningObjectives: Joi.array().items(Joi.string()).default([]),
  metadata: Joi.object().default({}),
  isPublished: Joi.boolean().default(false)
});

const updateContentSchema = Joi.object({
  title: Joi.string().min(1).max(500).optional(),
  description: Joi.string().max(2000).optional(),
  contentData: Joi.object().optional(),
  difficultyLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  estimatedDuration: Joi.number().min(1).optional(),
  skillsCovered: Joi.array().items(Joi.string()).optional(),
  prerequisites: Joi.array().items(Joi.string()).optional(),
  learningObjectives: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
  isPublished: Joi.boolean().optional()
});

// GET /api/content - Get learning content
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    contentType, 
    difficultyLevel, 
    published, 
    search,
    skills 
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereClause = {
      ...(published !== undefined && { isPublished: published === 'true' }),
      ...(contentType && { contentType }),
      ...(difficultyLevel && { difficultyLevel }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(skills && {
        skillsCovered: {
          hasSome: skills.split(',')
        }
      })
    };

    const [content, total] = await Promise.all([
      prisma.learningContent.findMany({
        where: whereClause,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              department: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.learningContent.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content',
      details: error.message
    });
  }
}));

// GET /api/content/:id - Get specific content
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const content = await prisma.learningContent.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    // Check if user can view unpublished content
    if (!content.isPublished && content.createdById !== req.user.id && !['admin', 'trainer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to unpublished content'
      });
    }

    res.json({
      success: true,
      data: { content }
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content',
      details: error.message
    });
  }
}));

// POST /api/content - Create new content
router.post('/', authenticateToken, requireRole(['trainer', 'admin']), validateRequest(createContentSchema), asyncHandler(async (req, res) => {
  const contentData = {
    ...req.body,
    createdById: req.user.id
  };

  try {
    const newContent = await prisma.learningContent.create({
      data: contentData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    // Process content for RAG if published
    if (newContent.isPublished) {
      try {
        await ragService.processLearningContent(newContent.id);
      } catch (ragError) {
        console.error('RAG processing error:', ragError);
        // Don't fail the request if RAG processing fails
      }
    }

    res.status(201).json({
      success: true,
      data: { content: newContent }
    });

  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content',
      details: error.message
    });
  }
}));

// PUT /api/content/:id - Update content
router.put('/:id', authenticateToken, validateRequest(updateContentSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if user can update this content
    const existingContent = await prisma.learningContent.findUnique({
      where: { id },
      select: { createdById: true, isPublished: true }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    const canUpdate = existingContent.createdById === req.user.id || 
                     req.user.role === 'admin' ||
                     (req.user.role === 'trainer' && !existingContent.isPublished);

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to update this content'
      });
    }

    const updatedContent = await prisma.learningContent.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    // Reprocess content for RAG if published
    if (updatedContent.isPublished) {
      try {
        await ragService.processLearningContent(updatedContent.id);
      } catch (ragError) {
        console.error('RAG processing error:', ragError);
        // Don't fail the request if RAG processing fails
      }
    }

    res.json({
      success: true,
      data: { content: updatedContent }
    });

  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content',
      details: error.message
    });
  }
}));

// DELETE /api/content/:id - Delete content
router.delete('/:id', authenticateToken, requireRole(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.learningContent.delete({
      where: { id }
    });

    res.json({
      success: true,
      data: { message: 'Content deleted successfully' }
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content',
      details: error.message
    });
  }
}));

// POST /api/content/:id/publish - Publish content
router.post('/:id/publish', authenticateToken, requireRole(['trainer', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user can publish this content
    const existingContent = await prisma.learningContent.findUnique({
      where: { id },
      select: { createdById: true, isPublished: true }
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }

    const canPublish = existingContent.createdById === req.user.id || req.user.role === 'admin';

    if (!canPublish) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to publish this content'
      });
    }

    const updatedContent = await prisma.learningContent.update({
      where: { id },
      data: {
        isPublished: true,
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            department: true
          }
        }
      }
    });

    // Process content for RAG
    try {
      await ragService.processLearningContent(updatedContent.id);
    } catch (ragError) {
      console.error('RAG processing error:', ragError);
      // Don't fail the request if RAG processing fails
    }

    res.json({
      success: true,
      data: { content: updatedContent }
    });

  } catch (error) {
    console.error('Publish content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish content',
      details: error.message
    });
  }
}));

// GET /api/content/:id/progress - Get content progress for users
router.get('/:id/progress', authenticateToken, requireRole(['trainer', 'admin', 'hr_manager']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [progress, total] = await Promise.all([
      prisma.userProgress.findMany({
        where: {
          contentId: id,
          progressType: 'content'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              department: true
            }
          }
        },
        orderBy: { lastAccessedAt: 'desc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.userProgress.count({
        where: {
          contentId: id,
          progressType: 'content'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        contentId: id,
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
    console.error('Get content progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve content progress',
      details: error.message
    });
  }
}));

module.exports = router;


