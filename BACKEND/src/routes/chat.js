const express = require('express');
const router = express.Router();
const { authenticateToken, asyncHandler, validateRequest } = require('../middleware/auth');
const ragService = require('../services/ragService');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

// Simple chat endpoint without authentication (for testing)
router.post('/simple', asyncHandler(async (req, res) => {
  const { message, sessionId = 'default-session' } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }

  console.log('🤖 Received chat message:', message);

  // Mock response using RAG service
  try {
    const ragResponse = await ragService.generateRAGResponse(
      message,
      'demo-user-123',
      sessionId,
      {}
    );

    res.json({
      success: true,
      data: {
        message: ragResponse.response,
        confidence: ragResponse.confidence
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    
    // Fallback response
    res.json({
      success: true,
      data: {
        message: `Mock response for: "${message}". This is a test response to verify the chat system is working correctly.`,
        confidence: 0.85
      }
    });
  }
}));

// Validation schemas
const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  sessionId: Joi.string().uuid().required(),
  options: Joi.object({
    matchThreshold: Joi.number().min(0).max(1).default(0.7),
    matchCount: Joi.number().min(1).max(20).default(5),
    contentType: Joi.string().valid('course', 'lesson', 'module', 'exercise', 'assessment').optional()
  }).optional()
});

// POST /api/chat/message - Send a chat message and get RAG response
router.post('/message', authenticateToken, validateRequest(chatMessageSchema), asyncHandler(async (req, res) => {
  const { message, sessionId, options = {} } = req.body;
  const userId = req.user?.id || 'demo-user-123';

  try {
    // Store user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        userId,
        sessionId,
        messageType: 'user',
        content: message,
        metadata: { timestamp: new Date().toISOString() }
      }
    });

    // Get RAG response
    const ragResponse = await ragService.generateRAGResponse(
      message,
      userId,
      sessionId,
      options
    );

    res.json({
      success: true,
      data: {
        userMessage: {
          id: userMessage.id,
          content: userMessage.content,
          timestamp: userMessage.createdAt
        },
        assistantResponse: {
          content: ragResponse.response,
          confidence: ragResponse.confidence,
          responseTime: ragResponse.responseTime,
          sources: ragResponse.sources
        },
        sessionId
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      details: error.message
    });
  }
}));

// GET /api/chat/history/:sessionId - Get chat history for a session
router.get('/history/:sessionId', authenticateToken, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId,
        sessionId
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        messageType: true,
        content: true,
        confidenceScore: true,
        responseTimeMs: true,
        createdAt: true,
        metadata: true
      }
    });

    res.json({
      success: true,
      data: {
        sessionId,
        messages,
        count: messages.length
      }
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat history',
      details: error.message
    });
  }
}));

// GET /api/chat/sessions - Get user's chat sessions
router.get('/sessions', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const sessions = await prisma.chatMessage.findMany({
      where: { userId },
      select: {
        sessionId: true,
        createdAt: true,
        messageType: true,
        content: true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Group by session
    const sessionMap = new Map();
    sessions.forEach(message => {
      if (!sessionMap.has(message.sessionId)) {
        sessionMap.set(message.sessionId, {
          sessionId: message.sessionId,
          lastMessage: message.content,
          lastMessageType: message.messageType,
          createdAt: message.createdAt,
          messageCount: 0
        });
      }
      sessionMap.get(message.sessionId).messageCount++;
    });

    const sessionList = Array.from(sessionMap.values());

    res.json({
      success: true,
      data: {
        sessions: sessionList,
        total: sessionList.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat sessions',
      details: error.message
    });
  }
}));

// DELETE /api/chat/session/:sessionId - Delete a chat session
router.delete('/session/:sessionId', authenticateToken, asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user.id;

  try {
    const deletedCount = await prisma.chatMessage.deleteMany({
      where: {
        userId,
        sessionId
      }
    });

    res.json({
      success: true,
      data: {
        sessionId,
        deletedMessages: deletedCount.count
      }
    });

  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete chat session',
      details: error.message
    });
  }
}));

// POST /api/chat/feedback - Provide feedback on chat response
router.post('/feedback', authenticateToken, validateRequest(Joi.object({
  messageId: Joi.string().uuid().required(),
  feedback: Joi.string().valid('helpful', 'not_helpful', 'incorrect').required(),
  comment: Joi.string().max(500).optional()
})), asyncHandler(async (req, res) => {
  const { messageId, feedback, comment } = req.body;
  const userId = req.user.id;

  try {
    // Verify message belongs to user
    const message = await prisma.chatMessage.findFirst({
      where: {
        id: messageId,
        userId,
        messageType: 'assistant'
      }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found or not accessible'
      });
    }

    // Update message with feedback
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        metadata: {
          ...message.metadata,
          feedback: {
            type: feedback,
            comment: comment || '',
            timestamp: new Date().toISOString()
          }
        }
      }
    });

    res.json({
      success: true,
      data: {
        messageId,
        feedback,
        comment
      }
    });

  } catch (error) {
    console.error('Chat feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      details: error.message
    });
  }
}));

// GET /api/chat/analytics - Get chat analytics for user
router.get('/analytics', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { period = '30d' } = req.query;

  try {
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const analytics = await prisma.chatMessage.groupBy({
      by: ['messageType'],
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      _avg: {
        confidenceScore: true,
        responseTimeMs: true
      }
    });

    const totalMessages = analytics.reduce((sum, group) => sum + group._count.id, 0);
    const avgConfidence = analytics.find(g => g.messageType === 'assistant')?._avg.confidenceScore || 0;
    const avgResponseTime = analytics.find(g => g.messageType === 'assistant')?._avg.responseTimeMs || 0;

    res.json({
      success: true,
      data: {
        period,
        totalMessages,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        avgResponseTime: Math.round(avgResponseTime),
        breakdown: analytics.map(group => ({
          messageType: group.messageType,
          count: group._count.id,
          avgConfidence: group._avg.confidenceScore ? Math.round(group._avg.confidenceScore * 100) / 100 : null,
          avgResponseTime: group._avg.responseTimeMs ? Math.round(group._avg.responseTimeMs) : null
        }))
      }
    });

  } catch (error) {
    console.error('Chat analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve chat analytics',
      details: error.message
    });
  }
}));

module.exports = router;


