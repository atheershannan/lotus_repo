### Regeneration Prompts (EN)

Below are three standalone prompts for regenerating the project templates: Frontend, Backend, and Database.

---

#### FRONTEND PROMPT (Floating Chat Widget with paragraphized answers + loading spinner)

```markdown
FRONTEND PROMPT (Floating Chat Widget)

Goal: Build the “Contextual Corporate Assistant RAG/GRAPH” frontend as a minimal, embeddable floating chat widget with a clean white page, toggle open/close, and production-ready UX.

Requirements:
- Architecture: SPA, embeddable widget
- Design System: Material-UI with corporate theme (Light + Dark), WCAG 2.1 AA
- UI/UX:
  - Floating widget on right; minimized button → expanded chat
  - Loading:
    - Show a circular loading indicator (spinner) specifically for assistant answers while the response is being generated/streamed.
    - Keep typing indicators for interim feedback.
  - Answer rendering (reformatting):
    - Do NOT render assistant answers as one monolithic block.
    - Reformat plain text answers into paragraphs for readability (e.g., split by double line breaks or sentence grouping into <p> elements with sensible max width and line height).
    - Preserve minimal inline formatting (bold/italic/links). Only render code blocks when the backend explicitly marks content as code.
    - Support message metadata from the backend like isCode, blocks[], or paragraphs[] if provided; otherwise perform client-side paragraphization.
  - Errors: Toast notifications with retry
  - Mobile-first responsiveness
- Tech Stack:
  - React 18, React DOM, React Router
  - Redux Toolkit + RTK Query (or Axios service)
  - Styled-components / MUI styled / CSS-in-JS
- Structure (feature-based + atomic):
  - components/common (Button, Input, Modal, Toast, LoadingSpinner)
  - components/chat (ChatInterface, MessageList, MessageInput, TypingIndicator, ChatHeader)
  - components/layout (Header, Sidebar, Footer, Layout)
  - pages (ChatPage, DashboardPage, ProfilePage, LoginPage)
  - store (slices: auth, chat, user, ui; api/*)
  - services (api.js, supabase.js)
  - hooks (useAuth, useChat, useRealtime)
  - theme (MUI theme)
- Realtime: Supabase realtime subscriptions; Redux sync; basic offline caching
- Performance: initial bundle < 500KB; code splitting; <2s initial load; <1s responses
- Security: JWT from Supabase; secure storage/refresh; CORS config
- Deliverables:
  - Production-ready widget
  - Example embedding snippet
  - Environment usage for API base URL and keys
  - Demonstration of answer reformatting into paragraphs and an answer-specific circular loading spinner during generation
```

---

#### BACKEND PROMPT (RAG + REST API)

```markdown
BACKEND PROMPT (RAG + REST API)

Goal: Build the “Contextual Corporate Assistant RAG/GRAPH” backend: Express.js REST API with business logic, RAG service, Prisma, PostgreSQL+pgvector, Supabase Auth, and OpenAI integration.

Requirements:
- Tech: Node.js + Express, Prisma, PostgreSQL (pgvector), Supabase Auth (JWT), OpenAI (GPT-4/mini + Embeddings), Redis (optional), Jest + Supertest
- Auth:
  - Supabase JWT validation middleware
  - Roles: learner, hr_manager, trainer, admin
  - Per-route authorization + audit logging
- Routes (examples, implement fully):
  - /api/auth: login/refresh/logout, /me
  - /api/users: profiles CRUD
  - /api/content: learning content CRUD, get by id
  - /api/skills: CRUD
  - /api/progress: GET/POST, /stats
  - /api/chat: POST /message, GET /history/:sessionId, GET /sessions, DELETE /session/:sessionId, POST /feedback
  - /api/search: POST /content, POST /skills, GET /suggestions, GET /trending
  - /api/recommendations: GET /, POST /feedback
  - /api/analytics: GET /overview, /learning, /users
- RAG service (services/ragService.js):
  - Generate embeddings for query
  - Vector similarity search via pgvector (HNSW/IVFFLAT)
  - Retrieve user context/profile
  - Generate response with GPT-4 including sources + confidence
  - Persist chat messages; update progress; produce recommendations
- Performance & Ops:
  - Rate limiting, compression, connection pooling
  - Optional Redis caching
  - Robust error handling + structured logging
- Testing: Jest + Supertest for critical endpoints and RAG logic seams
- Deliverables: runnable API with env-config, OpenAPI/Swagger spec, seed scripts and health checks
```

---

#### DATABASE PROMPT (PostgreSQL + pgvector on Supabase)

```markdown
DATABASE PROMPT (PostgreSQL + pgvector on Supabase)

Goal: Provision and document the “Contextual Corporate Assistant RAG/GRAPH” database on Supabase using PostgreSQL + pgvector, with Prisma schema and migrations.

Requirements:
- Tech: PostgreSQL 15+ with pgvector (Supabase), Prisma ORM
- Principles: ACID, indexing, RLS, backups; read replicas; security policies
- Core tables (Prisma/SQL):
  - users: id UUID, email, name, department, role default 'learner', learning_profile JSONB, preferences JSONB, timestamps, last_active_at, is_active
  - skills: id, name, description, category, level, prerequisites JSONB, learning_objectives JSONB, timestamps
  - learning_content: id, title, description, content_type, content_data JSONB, difficulty_level, estimated_duration, skills_covered JSONB, prerequisites JSONB, learning_objectives JSONB, metadata JSONB, created_by, timestamps, is_published; embedding VECTOR(1536) + vector index
  - user_progress: userId, contentId, skillId, progressType, status, completionPercentage, timestamps
  - chat_messages: userId, sessionId, messageType, content, metadata, confidenceScore, timestamps
  - recommendations: userId, recommendationType, targetId/targetType, reason, confidenceScore, timestamps
  - learning_analytics: userId, metricName, metricValue, metricData JSONB, period fields
  - embeddings tables: document_embeddings / skill_embeddings / query_embeddings with vector columns + indexes
  - (optional) knowledge_nodes for knowledge graph relationships
- Vector search:
  - Functions for cosine/L2 similarity; indexes (IVFFLAT/HNSW) tuned for 1536-d
- Security:
  - RLS policies by userId/role; storage access policies; encryption in transit
- Realtime:
  - Triggers for progress/chat to broadcast via Supabase Realtime
- Prisma:
  - Provide schema.prisma reflecting the above
  - Generate migrations; document seeding strategy
- Deliverables: DATABASE folder with schema/functions/seed SQL, Prisma schema + migrations, Supabase config notes, and operational runbook
```


