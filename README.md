# 🎓 Corporate Learning Assistant

> AI-powered corporate learning assistant with RAG and knowledge graphs

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green.svg)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)](https://openai.com/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account
- OpenAI API key

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd corporate-learning-assistant

# Install dependencies
npm run install:all

# Setup environment variables
cp BACKEND/env.example BACKEND/.env
cp FRONTEND/env.example FRONTEND/.env
# Edit .env files with your configuration

# Setup database
npm run db:migrate
npm run db:seed

# Start the application
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
corporate-learning-assistant/
├── BACKEND/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── database/      # Database utilities
│   │   └── tests/         # Backend tests
│   ├── prisma/            # Database schema
│   └── package.json
├── FRONTEND/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── DATABASE/              # Database configuration
│   ├── schema/            # SQL schemas
│   ├── functions/         # Database functions
│   └── seed/             # Sample data
├── DEPLOYMENT/            # Deployment configuration
│   ├── docker/            # Docker files
│   └── kubernetes/       # K8s manifests
└── FULLSTACK_TEMPLATES/   # Development templates
```

## 🎯 Features

### Core Features
- **RAG-powered Chat**: AI assistant with retrieval-augmented generation
- **Knowledge Graph**: Dynamic relationships between learning content
- **Personalized Recommendations**: AI-driven content suggestions
- **Multi-modal Support**: Text, document, and video queries
- **Real-time Analytics**: Learning progress tracking
- **Microservice Integration**: Seamless connection to existing systems

### Technical Features
- **Vector Search**: HNSW algorithm for fast similarity search
- **Authentication**: JWT-based auth with Supabase
- **Real-time Updates**: WebSocket connections
- **Responsive Design**: Mobile-first UI
- **Performance**: Optimized for speed and scalability

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with pgvector
- **Prisma** ORM
- **Supabase** Backend-as-a-Service
- **OpenAI** GPT-4 API
- **Redis** for caching
- **Winston** for logging

### Frontend
- **React 18** with hooks
- **Redux Toolkit** for state management
- **Material-UI** for components
- **Framer Motion** for animations
- **Axios** for API calls
- **React Router** for navigation

### Database
- **PostgreSQL 15+** with pgvector extension
- **HNSW** indexing for vector search
- **Row Level Security** (RLS)
- **Real-time subscriptions**

### AI/ML
- **OpenAI GPT-4** for chat completions
- **OpenAI Embeddings** for vector search
- **RAG** (Retrieval-Augmented Generation)
- **Knowledge Graph** construction

## 📚 Documentation

- [Quick Start Guide](QUICK_START_GUIDE.md)
- [Backend Documentation](BACKEND/README.md)
- [Frontend Documentation](FRONTEND/README.md)
- [Database Schema](DATABASE/README.md)
- [Implementation Guide](IMPLEMENTATION_COMPLETE.md)
- [Deployment Guide](DEPLOYMENT/DEPLOYMENT_GUIDE.md)

## 🔧 Development

### Available Scripts

```bash
# Installation
npm run install:all        # Install all dependencies
npm run install:backend    # Install backend dependencies
npm run install:frontend   # Install frontend dependencies

# Development
npm start                  # Start both frontend and backend
npm run start:backend      # Start only backend
npm run start:frontend     # Start only frontend

# Database
npm run db:migrate         # Run database migrations
npm run db:generate        # Generate Prisma client
npm run db:seed           # Seed database with sample data
npm run db:studio         # Open Prisma Studio

# Testing
npm test                  # Run all tests
npm run test:backend      # Run backend tests
npm run test:frontend     # Run frontend tests

# Linting
npm run lint              # Run linting for all projects
npm run lint:fix          # Fix linting issues

# Build
npm run build             # Build frontend for production

# Utilities
npm run setup             # Complete setup (install + migrate + seed)
npm run clean             # Clean all node_modules
npm run reset             # Clean and setup from scratch
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/corporate_learning_assistant"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
OPENAI_API_KEY="sk-your-openai-api-key"
PORT=3001
NODE_ENV="development"
```

#### Frontend (.env)
```env
REACT_APP_API_URL="http://localhost:3001/api"
REACT_APP_SUPABASE_URL="https://your-project.supabase.co"
REACT_APP_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## 🧪 Testing

### Backend Tests
```bash
cd BACKEND
npm test                  # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
```

### Frontend Tests
```bash
cd FRONTEND
npm test                  # Run unit tests
npm run test:e2e          # Run E2E tests
```

### Performance Tests
```bash
# Load testing with K6
cd tests/performance
k6 run load-test.js
```

## 🚀 Deployment

### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Build frontend: `npm run build`
2. Deploy backend to your server
3. Configure environment variables
4. Run database migrations
5. Start the application

### Cloud Deployment
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Railway, Heroku, or AWS EC2
- **Database**: Supabase, AWS RDS, or Google Cloud SQL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@corporate-learning.com
- 💬 Discord: [Join our community](https://discord.gg/corporate-learning)
- 📖 Documentation: [Read the docs](https://docs.corporate-learning.com)
- 🐛 Issues: [Report bugs](https://github.com/your-org/corporate-learning-assistant/issues)

---

**Built with ❤️ by the Corporate Learning Team**


