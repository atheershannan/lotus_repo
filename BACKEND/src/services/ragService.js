const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const mockConfig = require('../config/mock');

const prisma = new PrismaClient();

// Initialize OpenAI client (only if not in mock mode)
let openai = null;
if (!mockConfig.USE_MOCK_MODE) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

class RAGService {
  constructor() {
    this.embeddingModel = 'text-embedding-ada-002';
    this.chatModel = 'gpt-4';
    this.maxTokens = 2000;
    this.temperature = 0.7;
    this.mockMode = mockConfig.USE_MOCK_MODE;
  }

  // Generate embedding for text
  async generateEmbedding(text) {
    // Use mock embeddings in development mode
    if (this.mockMode) {
      console.log('🎭 Using mock embedding for:', text);
      return mockConfig.getMockEmbedding(text);
    }

    try {
      const response = await openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Store document embedding in database
  async storeDocumentEmbedding(contentId, contentType, contentText, metadata = {}) {
    try {
      const embedding = await this.generateEmbedding(contentText);
      
      const documentEmbedding = await prisma.documentEmbedding.create({
        data: {
          contentId,
          contentType,
          contentText,
          embedding: `[${embedding.join(',')}]`, // Convert array to PostgreSQL vector format
          metadata
        }
      });

      return documentEmbedding;
    } catch (error) {
      console.error('Error storing document embedding:', error);
      throw new Error('Failed to store document embedding');
    }
  }

  // Search for similar documents using vector similarity
  async searchSimilarDocuments(queryEmbedding, options = {}) {
    const {
      matchThreshold = 0.7,
      matchCount = 5,
      contentType = null,
      userId = null
    } = options;

    try {
      // Check cache first
      const queryHash = crypto.createHash('sha256')
        .update(JSON.stringify({ queryEmbedding, options }))
        .digest('hex');

      const cachedResult = await prisma.vectorSearchCache.findFirst({
        where: {
          queryHash,
          expiresAt: { gt: new Date() }
        }
      });

      if (cachedResult) {
        return JSON.parse(cachedResult.searchResults);
      }

      // Perform vector search using database function
      const embeddingStr = `[${queryEmbedding.join(',')}]`;
      
      // Build query based on whether contentType filter is needed
      let results;
      if (contentType) {
        results = await prisma.$queryRawUnsafe(`
          SELECT 
            de.id,
            de.content_id as "contentId",
            de.content_type as "contentType",
            de.content_text as "contentText",
            1 - (de.embedding <=> $1::vector) as similarity,
            de.metadata
          FROM document_embeddings de
          WHERE 1 - (de.embedding <=> $1::vector) > $2
            AND de.content_type = $3
          ORDER BY de.embedding <=> $1::vector
          LIMIT $4
        `, embeddingStr, matchThreshold, contentType, matchCount);
      } else {
        results = await prisma.$queryRawUnsafe(`
          SELECT 
            de.id,
            de.content_id as "contentId",
            de.content_type as "contentType",
            de.content_text as "contentText",
            1 - (de.embedding <=> $1::vector) as similarity,
            de.metadata
          FROM document_embeddings de
          WHERE 1 - (de.embedding <=> $1::vector) > $2
          ORDER BY de.embedding <=> $1::vector
          LIMIT $3
        `, embeddingStr, matchThreshold, matchCount);
      }

      // Cache the results
      try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Expire in 1 hour
        
        await prisma.vectorSearchCache.create({
          data: {
            queryHash,
            // Skip queryEmbedding - Prisma doesn't support VECTOR type well
            searchResults: JSON.stringify(results),
            resultCount: results.length,
            searchTimeMs: Date.now(), // This would be calculated properly in real implementation
            expiresAt
          }
        });
      } catch (cacheError) {
        console.log('⚠️  Could not cache search results (non-critical):', cacheError.message);
      }

      return results;
    } catch (error) {
      console.error('Error searching similar documents:', error);
      throw new Error('Failed to search similar documents');
    }
  }

  // Generate RAG response using retrieved documents
  async generateRAGResponse(query, userId, sessionId, options = {}) {
    // Use mock RAG in development mode
    if (this.mockMode) {
      console.log('🎭 Using mock RAG response for:', query);
      return {
        response: mockConfig.getMockRAGResponse(query),
        sources: [
          {
            id: 'mock-content-1',
            text_segment: 'This is a mock document for testing RAG functionality.',
            similarity: 0.95,
            metadata: { type: 'mock', content: query.toLowerCase() }
          }
        ],
        confidenceScore: 0.90
      };
    }

    const startTime = Date.now();
    
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Store query embedding (skip embedding field - Prisma doesn't support VECTOR type yet)
      try {
        await prisma.queryEmbedding.create({
          data: {
            userId,
            sessionId,
            queryText: query,
            // Skip embedding field - Prisma doesn't support VECTOR type
            metadata: { timestamp: new Date().toISOString() }
          }
        });
      } catch (embeddingError) {
        console.log('⚠️  Could not store query embedding (non-critical):', embeddingError.message);
      }

      // Search for relevant documents
      let relevantDocs = [];
      try {
        relevantDocs = await this.searchSimilarDocuments(queryEmbedding, {
          matchThreshold: options.matchThreshold || 0.7,
          matchCount: options.matchCount || 5,
          contentType: options.contentType
        });
      } catch (searchError) {
        console.log('⚠️  Vector search failed (non-critical):', searchError.message);
        console.log('📝 Continuing with direct OpenAI response...');
        // Continue with empty results - will use OpenAI without context
      }

      if (relevantDocs.length === 0) {
        console.log('📭 No relevant documents found, using general knowledge...');
        
        // Generate response using OpenAI without specific context
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful corporate learning assistant. Provide clear, professional responses to help users with their learning goals.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        const response = completion.choices[0].message.content;

        // Save chat message
        try {
          await prisma.chatMessage.create({
            data: {
              userId,
              sessionId,
              messageType: 'user',
              content: query,
              metadata: { noContext: true }
            }
          });

          await prisma.chatMessage.create({
            data: {
              userId,
              sessionId,
              messageType: 'assistant',
              content: response,
              metadata: { noContext: true, model: 'gpt-3.5-turbo' }
            }
          });
        } catch (saveError) {
          console.log('⚠️  Could not save chat messages (non-critical):', saveError.message);
        }

        return {
          success: true,
          response,
          confidence: 0.5,
          sources: [],
          responseTime: Date.now() - startTime
        };
      }

      // Prepare context for GPT
      const context = relevantDocs.map(doc => ({
        content: doc.contentText,
        type: doc.contentType,
        similarity: doc.similarity,
        metadata: doc.metadata
      }));

      // Generate response using GPT-4
      const systemPrompt = `You are a helpful corporate learning assistant. Use the provided context to answer the user's question accurately and helpfully. 

Context information:
${context.map((doc, index) => `[${index + 1}] ${doc.content} (Type: ${doc.type}, Relevance: ${doc.similarity.toFixed(2)})`).join('\n')}

Guidelines:
- Answer based on the provided context
- If the context doesn't contain enough information, say so
- Provide actionable advice when possible
- Be concise but comprehensive
- Include relevant learning recommendations
- Use a helpful and professional tone`;

      const completion = await openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature
      });

      const response = completion.choices[0].message.content;
      const confidence = this.calculateConfidence(relevantDocs, response);

      // Store the chat message
      await prisma.chatMessage.create({
        data: {
          userId,
          sessionId,
          messageType: 'assistant',
          content: response,
          confidenceScore: confidence,
          responseTimeMs: Date.now() - startTime,
          metadata: {
            relevantDocs: relevantDocs.length,
            avgSimilarity: relevantDocs.reduce((sum, doc) => sum + doc.similarity, 0) / relevantDocs.length,
            model: this.chatModel
          }
        }
      });

      return {
        success: true,
        response,
        confidence,
        sources: relevantDocs.map(doc => ({
          id: doc.id,
          contentId: doc.contentId,
          type: doc.contentType,
          similarity: doc.similarity,
          preview: doc.contentText.substring(0, 200) + '...'
        })),
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('Error generating RAG response:', error);
      
      // Store error message (skip if sessionId is invalid)
      try {
        await prisma.chatMessage.create({
          data: {
            userId,
            sessionId,
            messageType: 'assistant',
            content: "I apologize, but I encountered an error while processing your request. Please try again.",
            confidenceScore: 0.1,
            responseTimeMs: Date.now() - startTime,
            metadata: { error: error.message }
          }
        });
      } catch (saveError) {
        console.log('⚠️  Could not save error message:', saveError.message);
      }

      return {
        success: false,
        response: "I apologize, but I encountered an error while processing your request. Please try again.",
        confidence: 0.1,
        sources: [],
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  // Calculate confidence score based on document similarity and response quality
  calculateConfidence(relevantDocs, response) {
    if (relevantDocs.length === 0) return 0.1;

    const avgSimilarity = relevantDocs.reduce((sum, doc) => sum + doc.similarity, 0) / relevantDocs.length;
    const docCountScore = Math.min(relevantDocs.length / 5, 1); // Normalize to max 1
    const responseLengthScore = Math.min(response.length / 500, 1); // Normalize to max 1

    return Math.min(avgSimilarity * 0.6 + docCountScore * 0.2 + responseLengthScore * 0.2, 1);
  }

  // Process and index learning content
  async processLearningContent(contentId) {
    try {
      const content = await prisma.learningContent.findUnique({
        where: { id: contentId },
        include: {
          createdBy: {
            select: { name: true, department: true }
          }
        }
      });

      if (!content) {
        throw new Error('Content not found');
      }

      // Extract text content for embedding
      const textContent = this.extractTextContent(content);
      
      // Store embedding
      const embedding = await this.storeDocumentEmbedding(
        contentId,
        content.contentType,
        textContent,
        {
          title: content.title,
          difficultyLevel: content.difficultyLevel,
          skillsCovered: content.skillsCovered,
          createdBy: content.createdBy.name,
          department: content.createdBy.department
        }
      );

      return embedding;
    } catch (error) {
      console.error('Error processing learning content:', error);
      throw new Error('Failed to process learning content');
    }
  }

  // Extract text content from learning content
  extractTextContent(content) {
    let textContent = `${content.title}\n${content.description || ''}\n`;
    
    // Extract text from content data JSON
    if (content.contentData && typeof content.contentData === 'object') {
      if (content.contentData.modules) {
        textContent += `Modules: ${content.contentData.modules.join(', ')}\n`;
      }
      if (content.contentData.resources) {
        textContent += `Resources: ${content.contentData.resources.join(', ')}\n`;
      }
      if (content.contentData.content) {
        textContent += content.contentData.content + '\n';
      }
    }

    // Add learning objectives
    if (content.learningObjectives && Array.isArray(content.learningObjectives)) {
      textContent += `Learning Objectives: ${content.learningObjectives.join(', ')}\n`;
    }

    // Add skills covered
    if (content.skillsCovered && Array.isArray(content.skillsCovered)) {
      textContent += `Skills Covered: ${content.skillsCovered.join(', ')}\n`;
    }

    return textContent.trim();
  }

  // Get user learning context for personalized responses
  async getUserLearningContext(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          learningProfile: true,
          department: true,
          role: true
        }
      });

      const progress = await prisma.userProgress.findMany({
        where: { userId },
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

      return {
        user,
        recentProgress: progress
      };
    } catch (error) {
      console.error('Error getting user learning context:', error);
      return null;
    }
  }
}

module.exports = new RAGService();

