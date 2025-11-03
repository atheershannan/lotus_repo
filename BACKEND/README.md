# Corporate Learning Assistant - Backend API

## 🚀 Overview

This is the backend API for the Corporate Learning Assistant, a sophisticated RAG (Retrieval-Augmented Generation) system that provides intelligent learning guidance using knowledge graphs and vector search.

## 🏗️ Architecture

- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4 and Embeddings API
- **ORM**: Prisma
- **Caching**: Redis (optional)
- **Testing**: Jest with Supertest

## 📁 Project Structure

```
BACKEND/
├── src/
│   ├── server.js              # Main server file
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management
│   │   ├── content.js         # Learning content management
│   │   ├── skills.js          # Skills management
│   │   ├── progress.js        # Learning progress tracking
│   │   ├── chat.js            # RAG chat interface
│   │   ├── search.js          # Vector and text search
│   │   ├── recommendations.js # AI recommendations
│   │   └── analytics.js       # Learning analytics
│   ├── services/
│   │   └── ragService.js      # RAG service with OpenAI
│   ├── database/
│   │   └── seed.js            # Database seeding
│   └── tests/
│       ├── api.test.js        # API tests
│       └── setup.js           # Test setup
├── prisma/
│   └── schema.prisma          # Database schema
├── package.json
├── jest.config.js
└── env.example
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with pgvector extension
- Supabase account
- OpenAI API key

### 2. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
# - DATABASE_URL: PostgreSQL connection string
# - SUPABASE_URL: Your Supabase project URL
# - SUPABASE_SERVICE_ROLE_KEY: Supabase service role key
# - OPENAI_API_KEY: OpenAI API key
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List users (admin/HR)
- `POST /api/users` - Create user (admin)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Deactivate user (admin)

### Content Management
- `GET /api/content` - List learning content
- `GET /api/content/:id` - Get specific content
- `POST /api/content` - Create content (trainer/admin)
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content (admin)
- `POST /api/content/:id/publish` - Publish content

### Skills
- `GET /api/skills` - List skills
- `GET /api/skills/:id` - Get specific skill
- `POST /api/skills` - Create skill (trainer/admin)
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill (admin)

### Learning Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress
- `GET /api/progress/stats` - Get progress statistics

### RAG Chat Interface
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/sessions` - Get user sessions
- `DELETE /api/chat/session/:sessionId` - Delete session
- `POST /api/chat/feedback` - Provide feedback

### Search
- `POST /api/search/content` - Search learning content
- `POST /api/search/skills` - Search skills
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/trending` - Get trending searches

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/recommendations/feedback` - Provide feedback

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/learning` - Get learning analytics
- `GET /api/analytics/users` - Get user analytics

## 🔐 Authentication

The API uses Supabase Auth for authentication. All protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

### User Roles
- **learner**: Basic user, can access own data
- **hr_manager**: Can view department data
- **trainer**: Can create and manage content
- **admin**: Full access to all features

## 🧠 RAG Service

The RAG service provides intelligent responses by:

1. **Generating embeddings** for user queries using OpenAI
2. **Vector search** using pgvector with HNSW algorithm
3. **Retrieving relevant documents** from the knowledge base
4. **Generating responses** using GPT-4 with context
5. **Storing interactions** for learning and analytics

### Key Features
- **HNSW vector search** for fast similarity matching
- **Hybrid search** combining vector and text search
- **Context-aware responses** based on user profile
- **Confidence scoring** for response quality
- **Caching** for improved performance

## 📊 Database Functions

The system includes several PostgreSQL functions:

- `get_user_learning_analytics(user_id)` - User analytics
- `generate_recommendations(user_id, limit)` - AI recommendations
- `search_learning_content(query, content_type, limit)` - Content search
- `match_documents(query_embedding, threshold, count)` - Vector search

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- api.test.js
```

### Test Coverage
- API endpoint testing
- Authentication middleware
- Database function testing
- Performance testing
- Error handling

## 📈 Performance

### Optimizations
- **HNSW vector indexing** for fast similarity search
- **Connection pooling** with Prisma
- **Response caching** for repeated queries
- **Rate limiting** to prevent abuse
- **Compression** for API responses

### Monitoring
- **Health check endpoint** at `/health`
- **Request logging** with Winston
- **Performance metrics** tracking
- **Error monitoring** and alerting

## 🔒 Security

### Security Features
- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** with Joi
- **SQL injection protection** with Prisma
- **Row Level Security** (RLS) policies

### Best Practices
- Environment variables for secrets
- JWT token validation
- Role-based access control
- Input sanitization
- Secure headers

## 🚀 Deployment

### Environment Variables
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=production
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

## 📚 API Documentation

For detailed API documentation, see:
- [API Endpoints Specification](../FULLSTACK_TEMPLATES/Stage_02_System_and_Architecture/ENDPOINTS_SPEC.md)
- [Database Schema](../DATABASE/schema/)
- [Authentication Guide](../DATABASE/config/supabase_config.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the test cases
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for corporate learning excellence**


