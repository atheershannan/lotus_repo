# 🏗️ PROMPT: System Characteristics and Development Strategies

## 📋 Table of Contents
- [General Structure](#general-structure)
- [FRONTEND - Characteristics and Tech Stack](#frontend)
- [BACKEND - Characteristics and Tech Stack](#backend)
- [DATABASE - Characteristics and Tech Stack](#database)
- [Overall Architecture](#overall-architecture)
- [Deployment Instructions](#deployment-instructions)

---

## 🎯 General Structure

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Architecture Style**: Microservices Architecture
**Deployment Platform**:
  - **FRONTEND** → **Vercel** (Static Site & Serverless Functions)
  - **BACKEND** → **Railway** (Node.js Container Deployment)
  - **DATABASE** → **Supabase** (PostgreSQL + BaaS)
**Version**: 1.0

The system consists of three main components:
1. **FRONTEND** - User interface and client-side logic **[Vercel]**
2. **BACKEND** - API server, business logic and AI processing **[Railway]**
3. **DATABASE** - Data storage, vectors and knowledge graph **[Supabase]**

---

## 💻 FRONTEND

### Role and Purpose
**IMPORTANT: The FRONTEND is a minimal interface consisting of a completely blank white page with a CHATBOT WIDGET that appears on the right side of the screen. The chatbot can be opened/closed (toggle functionality). This design allows for easy embedding into other microservices.**

The FRONTEND is responsible for:
- Creating a minimal, embeddable chatbot widget
- Managing application state
- Communicating with the API
- Managing user authentication

### Chatbot Widget Features
- **Floating Position**: Right side of the screen
- **Minimized State**: Shows as a button/icon when closed
- **Expanded State**: Opens as a chat interface when clicked
- **Embeddable**: Can be embedded via script tag in any microservice
- **Customizable**: Themes, colors, and positioning configurable
- **Minimal Footprint**: Lightweight, no heavy dependencies

### Technologies and Key Libraries

#### Core Framework
- **React 18.2.0** - Leading UI library
- **React DOM 18.2.0** - DOM rendering
- **React Router 6.20.1** - Page navigation (minimal use)
- **Create React App 5.0.1** - Build tool and configuration

#### State Management
- **Redux Toolkit 2.0.1** - Global state management
- **React Redux 9.0.4** - React-Redux integration
- **React Query 3.39.3** - Server state management

#### UI Components & Styling
- **Material-UI (MUI) 5.15.0** - UI component library
- **Material Icons 5.15.0** - Icons
- **Emotion React 11.11.1** - CSS-in-JS
- **Styled Components 6.1.6** - Styled components
- **Framer Motion 10.16.16** - Animations (for widget transitions)

#### API & Backend Integration
- **Axios 1.6.2** - HTTP client for API communication
- **Supabase JS 2.38.4** - Supabase integration
- **React Hook Form 7.48.2** - Form handling

#### Utilities & Helpers
- **date-fns 2.30.0** - Date operations
- **lodash 4.17.21** - Data utilities
- **react-markdown 9.0.1** - Markdown rendering
- **react-syntax-highlighter 15.5.0** - Code highlighting
- **react-hot-toast 2.4.1** - User notifications

### Folder Structure
```
FRONTEND/
├── src/
│   ├── components/          # Reusable components
│   │   ├── chat/           # Chat components
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── ChatbotUI.js
│   │   │   ├── MinimalChatWidget.jsx
│   │   │   ├── CollapsibleChatWidget.jsx
│   │   │   └── ChatButton.jsx
│   │   ├── common/         # Common components
│   │   └── layout/         # Layout components
│   ├── pages/              # Main pages
│   │   └── MinimalChatPage.jsx  # Minimal blank page with chatbot
│   ├── store/              # Redux state management
│   │   ├── slices/         # State slices
│   │   └── store.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── hooks/              # Custom React Hooks
│   ├── theme/              # Theme
│   └── utils/              # Utilities
├── public/                 # Static files
│   ├── chatbot-embed.js    # EMBEDDING SCRIPT for other microservices (NEEDS TO BE CREATED)
│   └── index.html
└── package.json
```

### Key Features
1. **Minimal Design** - Blank white page with floating chatbot widget
2. **Embeddable Widget** - Can be integrated into any microservice via script
3. **Real-time Chat** - Real-time chat with backend API
4. **Authentication** - JWT token and refresh token management
5. **State Management** - Complex state management with Redux
6. **Responsive Design** - Mobile support
7. **Error Handling** - Centralized error handling
8. **Loading States** - Loading indicators

### Chatbot Widget Component
The chatbot widget includes:
- **Position**: Fixed on right side (configurable)
- **Toggle Button**: Minimize/maximize functionality
- **Chat Interface**: Full chat UI when expanded
- **Message History**: Persistent chat history
- **Typing Indicators**: Show when AI is responding
- **Auto-scroll**: Automatically scroll to latest message

### Embedding Script for Microservices

**Purpose**: Allow easy integration of the chatbot into any microservice with a single script tag.

**File Location**: `public/chatbot-embed.js` **(NEEDS TO BE CREATED)**

**IMPLEMENTATION REQUIRED**: This script file needs to be built to allow embedding the chatbot widget in other microservices.

#### Usage Example:
```html
<!-- Add this script tag to any HTML page or microservice -->
<script src="https://your-frontend-url.vercel.app/chatbot-embed.js"></script>
```

#### Script Features (To Be Implemented):
- Automatically creates the chatbot widget
- Does not require any build steps
- Can be configured via data attributes
- Standalone (no conflicts with existing code)
- Auto-initializes on page load

#### Configuration Example (To Be Implemented):
```html
<!-- Basic Usage -->
<script src="https://your-frontend-url.vercel.app/chatbot-embed.js"></script>

<!-- With Custom Configuration -->
<script 
  src="https://your-frontend-url.vercel.app/chatbot-embed.js"
  data-api-url="https://your-railway-backend.railway.app/api"
  data-position="right"
  data-theme="light">
</script>

<!-- Available Configuration Options (To Be Implemented) -->
<!-- data-api-url: Backend API URL -->
<!-- data-position: left | right | bottom -->
<!-- data-theme: light | dark -->
<!-- data-bot-name: Custom bot name -->
<!-- data-welcome-message: Custom welcome message -->
<!-- data-primary-color: Hex color code -->
<!-- data-height: Widget height in pixels -->
<!-- data-width: Widget width in pixels -->
```

#### Implementation Requirements for chatbot-embed.js:
1. **Create** a standalone JavaScript file that can be included via `<script>` tag
2. **Create** the chatbot widget DOM elements dynamically
3. **Handle** its own CSS styling inline or via injected styles
4. **Communicate** with the Railway backend API
5. **Be** lightweight and load quickly
6. **Not interfere** with the host page's functionality
7. **Handle authentication** automatically if needed
8. **Support** toggle/minimize functionality
9. **Load** on page load automatically
10. **Be** configurable via HTML data attributes

### Development Environments
- **Development**: `npm start` - Opens on localhost:3000
- **Production Build**: `npm run build` - Build for production
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier

### Environment Dependencies
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Deployment on Vercel
- **Platform**: Vercel
- **Deployment Type**: Static Site + Serverless Functions
- **Build Command**: `cd FRONTEND && npm ci && npm run build`
- **Output Directory**: `FRONTEND/build`
- **Auto-Deploy**: Automatic deployment from GitHub
- **Environment**: Environment variables set in Vercel Dashboard
- **CDN**: Global deployment with Vercel CDN
- **Custom Domain**: Custom domain support
- **Preview Deployments**: Preview deployments for each commit

**Vercel Configuration** (vercel.json):
```json
{
  "buildCommand": "cd FRONTEND && npm ci && npm run build",
  "outputDirectory": "FRONTEND/build",
  "framework": "create-react-app",
  "env": {
    "REACT_APP_API_URL": "@railway_backend_url",
    "REACT_APP_SUPABASE_URL": "@supabase_url",
    "REACT_APP_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

---

## 🔧 BACKEND

### Role and Purpose
The BACKEND is responsible for business logic, AI processing (RAG), API endpoint management, microservice integration, and knowledge graph management.

### Technologies and Key Libraries

#### Core Runtime & Framework
- **Node.js 18+** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **CORS 2.8.5** - CORS handling
- **Helmet 7.1.0** - Basic security

#### Database & ORM
- **Prisma 5.7.1** - Database ORM management
- **@prisma/client 5.7.1** - Prisma client
- **PostgreSQL** - Primary database with pgvector

#### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT tokens
- **bcryptjs 2.4.3** - Password encryption
- **express-rate-limit 7.1.5** - Request limiting
- **Supabase JS 2.38.4** - Supabase Auth integration

#### AI & RAG Services
- **OpenAI 4.20.1** - API for GPT-4 and text processing
- **Custom RAG Service** - Custom RAG implementation

#### Caching & Performance
- **Redis 4.6.10** - Multi-level caching
- **compression 1.7.4** - Response compression

#### Utilities & Helpers
- **dotenv 16.3.1** - Environment variable management
- **joi 17.11.0** - Schema validation
- **winston 3.11.0** - Logging system
- **axios 1.6.2** - HTTP client
- **multer 1.4.5-lts.1** - File upload handling
- **express-validator 7.0.1** - Data validation

### Folder Structure
```
BACKEND/
├── src/
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── content.js
│   │   ├── users.js
│   │   └── analytics.js
│   ├── services/           # Business logic
│   │   ├── ragService.js  # RAG service
│   │   └── ...
│   ├── middleware/         # Express middleware
│   │   └── auth.js
│   ├── database/          # Database utilities
│   │   └── seed.js
│   ├── config/            # Configuration files
│   │   └── mock.js
│   ├── tests/             # Tests
│   └── server.js          # Entry point
├── prisma/                # Prisma schema
│   └── schema.prisma
└── package.json
```

### Main API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout

#### Chat & RAG
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Chat history
- `POST /api/chat/search` - RAG search

#### Content Management
- `GET /api/content` - Content list
- `GET /api/content/:id` - Content details
- `POST /api/content` - Create new content

#### Analytics
- `GET /api/analytics/progress` - User progress
- `GET /api/analytics/performance` - Performance
- `GET /api/analytics/recommendations` - Recommendations

### Key Features
1. **RAG Engine** - RAG engine with OpenAI GPT-4
2. **Knowledge Graph** - Knowledge graph management with PostgreSQL
3. **Vector Search** - Vector similarity search with pgvector
4. **Microservices Integration** - Integration with microservices
5. **Authentication** - JWT and Supabase Auth management
6. **Rate Limiting** - Request rate limiting
7. **Caching** - Redis caching
8. **Logging** - System logging with Winston

### Development Environments
- **Development**: `npm run dev` - With nodemon
- **Production**: `npm start` - Standard run
- **Testing**: Jest with supertest
- **Database**: Prisma Studio `npm run db:studio`

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@localhost:5432/db
SUPABASE_SERVICE_ROLE_KEY=your-key
OPENAI_API_KEY=sk-your-key
PORT=3001
NODE_ENV=development
REDIS_URL=redis://localhost:6379
```

### Deployment on Railway
- **Platform**: Railway
- **Deployment Type**: Containerized Node.js Application
- **Build**: Docker Container from Dockerfile
- **Auto-Deploy**: Automatic deployment from GitHub
- **Environment Variables**: Set in Railway Dashboard
- **Custom Domain**: Custom domain support
- **Health Checks**: Server health monitoring
- **Logs**: Real-time server log viewing

**Railway Configuration** (railway.json):
```json
{
  "buildCommand": "cd BACKEND && npm install",
  "startCommand": "node src/server.js",
  "watchPatterns": [
    "BACKEND/**"
  ]
}
```

**Dockerfile Configuration**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY BACKEND/package*.json ./
RUN npm ci --only=production
COPY BACKEND/ .
EXPOSE 3001
CMD ["node", "src/server.js"]
```

---

## 🗄️ DATABASE

### Role and Purpose
The DATABASE is responsible for storing data, vectors, knowledge graph, user information, and learning content. Includes support for vector search for RAG.

### Technologies and Key Tools

#### Database Engine
- **PostgreSQL 15+** - Primary relational database
- **pgvector Extension** - Support for vectors and similarity search
- **HNSW Indexing** - Fast index for similarity search

#### Backend Services
- **Supabase** - Backend-as-a-Service including:
  - PostgreSQL Database
  - Authentication & Authorization
  - Real-time Subscriptions
  - Storage & File Management
  - Edge Functions (Serverless)

#### ORM & Schema
- **Prisma ORM** - Schema creation and data access layer
- **Prisma Migrations** - Database versioning
- **Prisma Studio** - GUI for data management

### Folder Structure
```
DATABASE/
├── schema/                 # SQL schemas
│   ├── 01_core_tables.sql       # Core tables
│   ├── 02_vector_tables.sql     # Vector tables
│   └── 07_rls_policies.sql      # Security policies
├── functions/              # Database functions
│   └── vector_search.sql  # Vector search
├── seed/                  # Sample data
│   └── sample_data.sql
├── docs/                  # Documentation
│   └── hnsw_optimization.md
└── config/                # Configuration
    └── supabase_config.md
```

### Main Models (Prisma Schema)

#### Core Models
1. **User** - Users and profiles
   - id, email, name, department, role
   - learningProfile, preferences
   - timestamps

2. **Skill** - Skills
   - id, name, description, category
   - level, prerequisites, learningObjectives

3. **LearningContent** - Learning content
   - id, title, description, contentType
   - difficultyLevel, skillsCovered
   - contentData, metadata

#### Progress & Analytics
4. **UserProgress** - User progress
   - userId, contentId, skillId
   - progressType, completionPercentage
   - status, timestamps

5. **ChatMessage** - Chat messages
   - userId, sessionId, messageType
   - content, metadata, confidenceScore

6. **Recommendation** - Recommendations
   - userId, recommendationType
   - targetId, targetType, reason
   - confidenceScore

7. **LearningAnalytics** - Analytics
   - userId, metricName, metricValue
   - metricData, period dates

#### Vectoral Models
8. **DocumentEmbedding** - Document vectors
   - contentId, contentType, contentText
   - embedding (vector(1536))

9. **QueryEmbedding** - Query vectors
   - userId, sessionId, queryText
   - embedding (vector(1536))

10. **SkillEmbedding** - Skill vectors
    - skillId, skillText
    - embedding (vector(1536))

#### Knowledge Graph
11. **KnowledgeNode** - Graph nodes
    - nodeType, nodeId, nodeText
    - embedding (vector(1536))
    - properties (JSON)

12. **KnowledgeEdge** - Graph edges
    - sourceNodeId, targetNodeId
    - relationshipType, weight
    - metadata

13. **VectorSearchCache** - Search cache
    - queryHash, queryEmbedding
    - searchResults, searchTimeMs

### Key Features
1. **Vector Search** - Vector similarity search with pgvector
2. **Knowledge Graph** - Dynamic relationship graph
3. **Real-time** - Real-time updates with Supabase
4. **Row Level Security (RLS)** - Row-level security
5. **Full-text Search** - Full-text search
6. **HNSW Indexing** - Fast index for vector search
7. **Audit Trail** - Change tracking
8. **Automatic Backups** - Automatic backups

### Indexing Strategy
- **Primary Indexes** - On all primary keys
- **Foreign Key Indexes** - On foreign keys
- **Vector Indexes** - HNSW on embedding columns
- **Composite Indexes** - On composite columns
- **Full-text Indexes** - On search text

### Security (RLS Policies)
- **User Data** - Users only see their own data
- **Content Access** - Role-based permissions
- **Admin Access** - Full access for admins
- **Audit Logging** - Logging of all security actions

---

## 🌐 Overall Architecture

### Data Flow

#### 1. User Query Flow
```
User (Web/App) 
  → FRONTEND (React)
  → HTTP Request (Axios)
  → BACKEND API (Express)
  → RAG Service
  → Vector Search (pgvector)
  → OpenAI GPT-4
  → Response Generation
  → BACKEND Response
  → FRONTEND Update
  → User Display
```

#### 2. Knowledge Graph Update Flow
```
External Service
  → Backend Integration
  → Data Processing
  → DATABASE (PostgreSQL)
  → Vector Generation
  → Document Embedding
  → Knowledge Node Update
  → Cache Invalidation
  → Real-time Notification
```

#### 3. Authentication Flow
```
User Login
  → Supabase Auth
  → JWT Token Generation
  → Token Storage (Frontend)
  → API Requests with Token
  → Token Validation (Backend)
  → Authorized Access
```

### Communication Between Components

#### FRONTEND ↔ BACKEND
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Method**: REST API
- **Authentication**: JWT Bearer Token
- **Client**: Axios

#### BACKEND ↔ DATABASE
- **Protocol**: PostgreSQL Connection
- **ORM**: Prisma
- **Pooling**: Connection Pooling
- **Cache**: Redis Layer

#### BACKEND ↔ AI Services
- **Service**: OpenAI API
- **Functions**: GPT-4, Embeddings
- **Method**: REST API
- **Authentication**: API Key

### Security
- **HTTPS**: End-to-end encryption
- **JWT Tokens**: User authentication
- **RLS**: Row Level Security
- **Input Validation**: Complete validation
- **Rate Limiting**: Request limiting
- **CORS**: Cross-origin access control
- **Helmet**: HTTP header security

### Performance
- **Caching**: Redis multi-level caching
- **CDN**: Supabase CDN
- **Connection Pooling**: PostgreSQL pooling
- **Compression**: Gzip/Brotli
- **Lazy Loading**: Frontend lazy loading
- **Indexing**: Database indexes
- **Vector Search**: HNSW optimization

### Scalability
- **Horizontal Scaling**: Auto-scaling Edge Functions
- **Load Balancing**: Supabase load balancer
- **Database Replicas**: Read replicas
- **Caching**: Distributed cache
- **Serverless**: Pay-per-use model

---

## 📊 Tech Stack Summary

### FRONTEND Stack
| Category | Technology |
|---------|----------|
| **Deployment** | **Vercel** |
| Framework | React 18 |
| State Management | Redux Toolkit |
| UI Library | Material-UI 5 |
| Routing | React Router 6 |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Animations | Framer Motion |
| Styling | Emotion + Styled Components |
| Build Tool | Create React App |
| Testing | Jest + React Testing Library |

### BACKEND Stack
| Category | Technology |
|---------|----------|
| **Deployment** | **Railway** |
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database ORM | Prisma 5 |
| Authentication | JWT + Supabase Auth |
| AI/ML | OpenAI GPT-4 |
| Caching | Redis 4 |
| Logging | Winston |
| Validation | Joi + Express Validator |
| Security | Helmet + Rate Limiting |
| Testing | Jest + Supertest |

### DATABASE Stack
| Category | Technology |
|---------|----------|
| **Deployment** | **Supabase** |
| Database | PostgreSQL 15+ |
| Vector Extension | pgvector |
| Indexing | HNSW |
| Backend Service | Supabase BaaS |
| ORM | Prisma |
| Security | Row Level Security (RLS) |
| Real-time | Supabase Realtime |
| Storage | Supabase Storage |
| Migrations | Prisma Migrate |

---

## 🚀 Entry Points and Startup

### FRONTEND
```bash
cd FRONTEND
npm install
npm start              # Development on :3000
npm run build          # Production build
npm test               # Run tests
```

### BACKEND
```bash
cd BACKEND
npm install
npm run dev            # Development with nodemon
npm start              # Production
npm run db:migrate     # Run migrations
npm run db:studio      # Open Prisma Studio
```

### DATABASE
```bash
# Through Supabase Dashboard
# Or via Prisma:
cd BACKEND
npm run db:migrate     # Apply schema
npm run db:seed        # Seed data
npm run db:generate    # Generate Prisma client
```

---

## 🌐 Deployment Instructions

### Deploying FRONTEND to Vercel

#### Method 1: Deployment via Vercel Dashboard
1. Go to [Vercel](https://vercel.com)
2. **New Project** → Select repository
3. Set Root Directory: `FRONTEND`
4. Set Build Command: `npm ci && npm run build`
5. Set Output Directory: `build`
6. Add Environment Variables:
   - `REACT_APP_API_URL` → Railway Backend URL
   - `REACT_APP_SUPABASE_URL` → Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → Supabase Anon Key
7. Click **Deploy**

#### Method 2: Deployment via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to FRONTEND directory
cd FRONTEND

# Login to Vercel
vercel login

# Deploy to Development
vercel

# Deploy to Production
vercel --prod
```

### Deploying BACKEND to Railway

#### Method 1: Deployment via Railway Dashboard
1. Go to [Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Select repository
4. Configure:
   - **Root Directory**: `BACKEND`
   - **Watch Paths**: `BACKEND/**`
5. Add Environment Variables:
   - `DATABASE_URL` → Supabase Database URL
   - `SUPABASE_SERVICE_ROLE_KEY` → Supabase Service Key
   - `OPENAI_API_KEY` → OpenAI API Key
   - `PORT` → `3001` (Optional, Railway will set automatically)
6. **Deploy** - Railway will build and deploy automatically

#### Method 2: Deployment via Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Navigate to BACKEND directory
cd BACKEND

# Login to Railway
railway login

# Create new project
railway init

# Add Environment Variables
railway variables set DATABASE_URL=your-db-url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-key
railway variables set OPENAI_API_KEY=your-openai-key

# Deploy
railway up
```

### Deploying DATABASE to Supabase

#### Via Supabase Dashboard
1. Go to [Supabase](https://supabase.com)
2. **New Project** → Create new project
3. Select:
   - **Region** - Geographical region
   - **Database Password** - Database password
4. After project creation:
   - **SQL Editor** → Run schemas from `DATABASE/schema/`
   - **Settings → API** → Copy API Keys
5. Add API Keys to FRONTEND and BACKEND

#### Running Migrations
```bash
cd BACKEND
npm run db:migrate
npm run db:seed
```

---

## 🔗 Important Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Repository**: [GitHub Repository URL]

---

**Document Status**: Complete
**Last Updated**: December 2024
**Version**: 1.0
**Language**: English