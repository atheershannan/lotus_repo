const express = require('express');
const router = express.Router();
const { authenticateToken, asyncHandler } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/recommendations - Get personalized recommendations
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 10, type } = req.query;

  try {
    // Get recommendations using database function
    const recommendations = await prisma.$queryRaw`
      SELECT * FROM generate_recommendations(${userId}, ${parseInt(limit)})
    `;

    // Filter by type if specified
    const filteredRecommendations = type 
      ? recommendations.filter(rec => rec.recommendation_type === type)
      : recommendations;

    res.json({
      success: true,
      data: {
        recommendations: filteredRecommendations,
        count: filteredRecommendations.length
      }
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve recommendations',
      details: error.message
    });
  }
}));

// POST /api/recommendations/feedback - Provide feedback on recommendations
router.post('/feedback', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { recommendationId, isAccepted, comment } = req.body;

  try {
    const updatedRecommendation = await prisma.recommendation.update({
      where: {
        id: recommendationId,
        userId
      },
      data: {
        isAccepted,
        metadata: {
          ...req.body.metadata,
          feedback: {
            isAccepted,
            comment: comment || '',
            timestamp: new Date().toISOString()
          }
        }
      }
    });

    res.json({
      success: true,
      data: { recommendation: updatedRecommendation }
    });

  } catch (error) {
    console.error('Recommendation feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit recommendation feedback',
      details: error.message
    });
  }
}));

module.exports = router;


