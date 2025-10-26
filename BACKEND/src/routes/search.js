const express = require('express');
const router = express.Router();
const { authenticateToken, asyncHandler, validateRequest } = require('../middleware/auth');
const ragService = require('../services/ragService');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Validation schemas
const searchSchema = Joi.object({
  query: Joi.string().min(1).max(500).required(),
  type: Joi.string().valid('vector', 'text', 'hybrid').default('hybrid'),
  contentType: Joi.string().valid('course', 'lesson', 'module', 'exercise', 'assessment').optional(),
  limit: Joi.number().min(1).max(50).default(10),
  threshold: Joi.number().min(0).max(1).default(0.7)
});

// POST /api/search/content - Search learning content
router.post('/content', authenticateToken, validateRequest(searchSchema), asyncHandler(async (req, res) => {
  const { query, type, contentType, limit, threshold } = req.body;
  const userId = req.user.id;

  try {
    let results = [];

    if (type === 'vector' || type === 'hybrid') {
      // Vector search
      const queryEmbedding = await ragService.generateEmbedding(query);
      const vectorResults = await ragService.searchSimilarDocuments(queryEmbedding, {
        matchThreshold: threshold,
        matchCount: limit,
        contentType
      });

      results = vectorResults.map(doc => ({
        id: doc.id,
        contentId: doc.contentId,
        contentType: doc.contentType,
        content: doc.contentText,
        similarity: doc.similarity,
        type: 'vector',
        metadata: doc.metadata
      }));
    }

    if (type === 'text' || type === 'hybrid') {
      // Full-text search
      const textResults = await prisma.$queryRaw`
        SELECT 
          lc.id,
          lc.title,
          lc.description,
          lc.content_type as "contentType",
          lc.difficulty_level as "difficultyLevel",
          lc.estimated_duration as "estimatedDuration",
          lc.skills_covered as "skillsCovered",
          ts_rank(
            to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')),
            plainto_tsquery('english', ${query})
          ) as relevance_score
        FROM learning_content lc
        WHERE lc.is_published = true
        AND (
          ${contentType ? prisma.$queryRaw`lc.content_type = ${contentType}` : prisma.$queryRaw`true`}
        )
        AND (
          to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')) @@ 
          plainto_tsquery('english', ${query})
        )
        ORDER BY relevance_score DESC
        LIMIT ${limit}
      `;

      const textSearchResults = textResults.map(doc => ({
        id: doc.id,
        contentId: doc.id,
        contentType: doc.contentType,
        content: `${doc.title}\n${doc.description || ''}`,
        similarity: doc.relevance_score,
        type: 'text',
        metadata: {
          title: doc.title,
          difficultyLevel: doc.difficultyLevel,
          estimatedDuration: doc.estimatedDuration,
          skillsCovered: doc.skillsCovered
        }
      }));

      if (type === 'hybrid') {
        // Combine and deduplicate results
        const combinedResults = [...results, ...textSearchResults];
        const uniqueResults = new Map();
        
        combinedResults.forEach(result => {
          const key = result.contentId;
          if (!uniqueResults.has(key) || uniqueResults.get(key).similarity < result.similarity) {
            uniqueResults.set(key, result);
          }
        });

        results = Array.from(uniqueResults.values())
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, limit);
      } else {
        results = textSearchResults;
      }
    }

    // Get additional content details
    const contentIds = results.map(r => r.contentId);
    const contentDetails = await prisma.learningContent.findMany({
      where: {
        id: { in: contentIds },
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        description: true,
        contentType: true,
        difficultyLevel: true,
        estimatedDuration: true,
        skillsCovered: true,
        learningObjectives: true,
        createdBy: {
          select: {
            name: true,
            department: true
          }
        }
      }
    });

    // Merge results with content details
    const enrichedResults = results.map(result => {
      const details = contentDetails.find(d => d.id === result.contentId);
      return {
        ...result,
        title: details?.title,
        description: details?.description,
        difficultyLevel: details?.difficultyLevel,
        estimatedDuration: details?.estimatedDuration,
        skillsCovered: details?.skillsCovered,
        learningObjectives: details?.learningObjectives,
        createdBy: details?.createdBy
      };
    });

    res.json({
      success: true,
      data: {
        query,
        type,
        results: enrichedResults,
        count: enrichedResults.length,
        threshold
      }
    });

  } catch (error) {
    console.error('Content search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search content',
      details: error.message
    });
  }
}));

// POST /api/search/skills - Search skills
router.post('/skills', authenticateToken, validateRequest(Joi.object({
  query: Joi.string().min(1).max(200).required(),
  category: Joi.string().optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  limit: Joi.number().min(1).max(50).default(20)
})), asyncHandler(async (req, res) => {
  const { query, category, level, limit } = req.body;

  try {
    const skills = await prisma.skill.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        },
        ...(category && { category }),
        ...(level && { level })
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        level: true,
        prerequisites: true,
        learningObjectives: true
      },
      take: limit,
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: {
        query,
        skills,
        count: skills.length
      }
    });

  } catch (error) {
    console.error('Skills search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search skills',
      details: error.message
    });
  }
}));

// GET /api/search/suggestions - Get search suggestions
router.get('/suggestions', authenticateToken, asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;
  const userId = req.user.id;

  try {
    const suggestions = [];

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    if (type === 'all' || type === 'content') {
      // Content suggestions
      const contentSuggestions = await prisma.learningContent.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          title: true,
          contentType: true
        },
        take: 5,
        orderBy: { title: 'asc' }
      });

      suggestions.push(...contentSuggestions.map(c => ({
        type: 'content',
        id: c.id,
        text: c.title,
        subtitle: `${c.contentType} - ${c.title}`,
        category: 'Learning Content'
      })));
    }

    if (type === 'all' || type === 'skills') {
      // Skills suggestions
      const skillSuggestions = await prisma.skill.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true,
          category: true
        },
        take: 5,
        orderBy: { name: 'asc' }
      });

      suggestions.push(...skillSuggestions.map(s => ({
        type: 'skill',
        id: s.id,
        text: s.name,
        subtitle: `${s.category} skill`,
        category: 'Skills'
      })));
    }

    if (type === 'all' || type === 'users') {
      // User suggestions (for HR managers)
      if (req.user.role === 'hr_manager' || req.user.role === 'admin') {
        const userSuggestions = await prisma.user.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } }
            ],
            ...(req.user.role === 'hr_manager' && { department: req.user.department })
          },
          select: {
            id: true,
            name: true,
            email: true,
            department: true
          },
          take: 5,
          orderBy: { name: 'asc' }
        });

        suggestions.push(...userSuggestions.map(u => ({
          type: 'user',
          id: u.id,
          text: u.name,
          subtitle: `${u.department} - ${u.email}`,
          category: 'Users'
        })));
      }
    }

    res.json({
      success: true,
      data: {
        query: q,
        suggestions: suggestions.slice(0, 10) // Limit total suggestions
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get search suggestions',
      details: error.message
    });
  }
}));

// GET /api/search/trending - Get trending search terms
router.get('/trending', authenticateToken, asyncHandler(async (req, res) => {
  const { period = '7d', limit = 10 } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get trending queries from query embeddings
    const trendingQueries = await prisma.queryEmbedding.groupBy({
      by: ['queryText'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: parseInt(limit)
    });

    const trending = trendingQueries.map(query => ({
      query: query.queryText,
      count: query._count.id,
      period
    }));

    res.json({
      success: true,
      data: {
        trending,
        period,
        count: trending.length
      }
    });

  } catch (error) {
    console.error('Trending search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trending searches',
      details: error.message
    });
  }
}));

module.exports = router;


