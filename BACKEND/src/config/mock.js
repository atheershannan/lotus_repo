// Mock Configuration for RAG Testing
// This enables mock mode without requiring database or external services

const USE_MOCK_MODE = process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;

// Mock OpenAI responses
const MOCK_EMBEDDINGS = [
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.1],
  [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.1, 0.2],
];

const MOCK_RAG_RESPONSES = {
  'javascript': 'JavaScript is a high-level programming language. It enables interactive web pages and is essential for web development.',
  'react': 'React is a JavaScript library for building user interfaces, particularly single-page applications.',
  'nodejs': 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine, allowing server-side development.',
  'leadership': 'Leadership involves guiding and motivating others to achieve common goals.',
  'project management': 'Project management involves planning, organizing, and managing resources to achieve specific objectives.',
  'machine learning': 'Machine learning enables systems to learn and improve from experience without explicit programming.'
};

const getMockEmbedding = (text) => {
  // Generate a mock embedding based on text
  const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array(1536).fill(0).map((_, i) => 
    (Math.sin(seed + i) * 0.5 + 0.5)
  );
};

const getMockRAGResponse = (query) => {
  const queryLower = query.toLowerCase();
  
  // Check for key topics
  for (const [topic, response] of Object.entries(MOCK_RAG_RESPONSES)) {
    if (queryLower.includes(topic)) {
      return response;
    }
  }
  
  // Default response
  return `Mock RAG response for: "${query}". This is a test response to verify the RAG system is working correctly. The system analyzed your query and generated this contextual answer.`;
};

module.exports = {
  USE_MOCK_MODE,
  MOCK_EMBEDDINGS,
  MOCK_RAG_RESPONSES,
  getMockEmbedding,
  getMockRAGResponse
};

