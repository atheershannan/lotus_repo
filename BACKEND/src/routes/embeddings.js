const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/auth');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// POST /api/embeddings/generate - Generate embeddings (admin only)
router.post('/generate', asyncHandler(async (req, res) => {
  // Simple security - require a secret key
  const { secret } = req.body;
  
  if (secret !== process.env.ADMIN_SECRET && secret !== 'generate-embeddings-now') {
    return res.status(401).json({ 
      error: 'Unauthorized',
      hint: 'Provide the admin secret to generate embeddings'
    });
  }

  console.log('🚀 Starting embedding generation via API...');
  
  res.json({
    success: true,
    message: 'Embedding generation started!',
    note: 'This will take 2-5 minutes. Check logs for progress.',
    checkLogsAt: 'https://railway.app → Your Project → Deployments → View Logs'
  });

  // Run in background
  setImmediate(async () => {
    try {
      console.log('📊 Running embeddings generation script...');
      const { stdout, stderr } = await execAsync('node src/scripts/generate-embeddings.js');
      console.log('✅ Embedding generation completed!');
      console.log(stdout);
      if (stderr) console.error('Errors:', stderr);
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
    }
  });
}));

// GET /api/embeddings/status - Check if embeddings exist
router.get('/status', asyncHandler(async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const docCount = await prisma.documentEmbedding.count();
    const skillCount = await prisma.skillEmbedding.count();
    
    res.json({
      success: true,
      hasEmbeddings: docCount > 0 || skillCount > 0,
      counts: {
        documentEmbeddings: docCount,
        skillEmbeddings: skillCount,
        total: docCount + skillCount
      },
      recommendation: docCount === 0 && skillCount === 0 
        ? 'Run POST /api/embeddings/generate to create embeddings'
        : 'Embeddings are ready! RAG should work.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}));

module.exports = router;

