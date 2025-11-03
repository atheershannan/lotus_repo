const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole, asyncHandler, validateRequest } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const createSkillSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  category: Joi.string().max(100).optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  prerequisites: Joi.array().items(Joi.string()).default([]),
  learningObjectives: Joi.array().items(Joi.string()).default([])
});

// GET /api/skills - Get skills
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    category, 
    level, 
    search 
  } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const whereClause = {
      ...(category && { category }),
      ...(level && { level }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where: whereClause,
        orderBy: { name: 'asc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.skill.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: {
        skills,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve skills',
      details: error.message
    });
  }
}));

// GET /api/skills/:id - Get specific skill
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await prisma.skill.findUnique({
      where: { id }
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    res.json({
      success: true,
      data: { skill }
    });

  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve skill',
      details: error.message
    });
  }
}));

// POST /api/skills - Create new skill
router.post('/', authenticateToken, requireRole(['trainer', 'admin']), validateRequest(createSkillSchema), asyncHandler(async (req, res) => {
  const skillData = req.body;

  try {
    const newSkill = await prisma.skill.create({
      data: skillData
    });

    res.status(201).json({
      success: true,
      data: { skill: newSkill }
    });

  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create skill',
      details: error.message
    });
  }
}));

// PUT /api/skills/:id - Update skill
router.put('/:id', authenticateToken, requireRole(['trainer', 'admin']), validateRequest(createSkillSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: { skill: updatedSkill }
    });

  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update skill',
      details: error.message
    });
  }
}));

// DELETE /api/skills/:id - Delete skill
router.delete('/:id', authenticateToken, requireRole(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.skill.delete({
      where: { id }
    });

    res.json({
      success: true,
      data: { message: 'Skill deleted successfully' }
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete skill',
      details: error.message
    });
  }
}));

module.exports = router;


