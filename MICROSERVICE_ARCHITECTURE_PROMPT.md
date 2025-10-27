# 🏗️ PROMPT: מאפיינים ואסטרטגיות פיתוח של המערכת

## 📋 תוכן עיניינים
- [מבנה כללי](#מבנה-כללי)
- [FRONTEND - מאפיינים ו-Tech Stack](#frontend)
- [BACKEND - מאפיינים ו-Tech Stack](#backend)
- [DATABASE - מאפיינים ו-Tech Stack](#database)
- [הארכיטקטורה הכללית](#הארכיטקטורה-הכללית)
- [הוראות פריסה (Deployment)](#הוראות-פריסה-deployment)

---

## 🎯 מבנה כללי

**שם הפרויקט**: Contextual Corporate Assistant RAG/GRAPH
**סגנון ארכיטקטורה**: Microservices Architecture
**פלטפורמת פריסה**:
  - **FRONTEND** → **Vercel** (Static Site & Serverless Functions)
  - **BACKEND** → **Railway** (Node.js Container Deployment)
  - **DATABASE** → **Supabase** (PostgreSQL + BaaS)
**גרסה**: 1.0

המערכת מורכבת משלושה מוקדים עיקריים:
1. **FRONTEND** - ממשק המשתמש והלוגיקה בצד הלקוח **[Vercel]**
2. **BACKEND** - שרת ה-API, לוגיקה עסקית ועיבוד AI **[Railway]**
3. **DATABASE** - אחסון נתונים, וקטורים וגרף הידע **[Supabase]**

---

## 💻 FRONTEND

### תפקיד ומטרה
FRONTEND אחראי על יצירת ממשק המשתמש המודרני והאינטראקטיבי, ניהול מצב אפליקציה, תקשורת עם ה-API וניהול אימות משתמשים.

### טכנולוגיות וספריות עיקריות

#### Core Framework
- **React 18.2.0** - ספריית UI מובילה
- **React DOM 18.2.0** - רינדור דומי
- **React Router 6.20.1** - ניווט בין עמודים
- **Create React App 5.0.1** - כלי בנייה ותצורה

#### State Management
- **Redux Toolkit 2.0.1** - ניהול מצב גלובלי
- **React Redux 9.0.4** - אינטגרציה בין React ל-Redux
- **React Query 3.39.3** - ניהול שרת state

#### UI Components & Styling
- **Material-UI (MUI) 5.15.0** - ספריית קומפוננטים
- **Material Icons 5.15.0** - אייקונים
- **Emotion React 11.11.1** - CSS-in-JS
- **Styled Components 6.1.6** - קומפוננטים מעוצבים
- **Framer Motion 10.16.16** - אנימציות

#### API & Backend Integration
- **Axios 1.6.2** - HTTP client לתקשורת API
- **Supabase JS 2.38.4** - אינטגרציה עם Supabase
- **React Hook Form 7.48.2** - טיפול בטפסים

#### Utilities & Helpers
- **date-fns 2.30.0** - עבודה עם תאריכים
- **lodash 4.17.21** - כלי עזר למידע
- **react-markdown 9.0.1** - רינדור Markdown
- **react-syntax-highlighter 15.5.0** - הדגשת קוד
- **react-hot-toast 2.4.1** - הודעות למשתמש

### מבנה תיקיות
```
FRONTEND/
├── src/
│   ├── components/          # קומפוננטים לשימוש חוזר
│   │   ├── chat/           # קומפוננטים של צ'אט
│   │   ├── common/         # קומפוננטים משותפים
│   │   └── layout/         # קומפוננטים של מבנה
│   ├── pages/              # עמודים ראשיים
│   │   ├── DashboardPage.js
│   │   ├── ChatPage.js
│   │   ├── ContentPage.js
│   │   └── ProfilePage.js
│   ├── store/              # ניהול מצב Redux
│   │   ├── slices/         # פרוסות מצב
│   │   └── store.js
│   ├── services/           # שירותי API
│   │   └── api.js
│   ├── hooks/              # React Hooks מותאמים
│   ├── theme/              # ערכת נושא
│   └── utils/              # כלי עזר
├── public/                 # קבצים סטטיים
└── package.json
```

### תכונות עיקריות
1. **Multi-platform Support** - תמיכה ב-Slack, Teams, Web
2. **Real-time Chat** - צ'אט בזמן אמת עם WebSocket
3. **Authentication** - ניהול JWT tokens ו-refresh tokens
4. **State Management** - ניהול מצב מורכב עם Redux
5. **Responsive Design** - תמיכה בנייד
6. **Error Handling** - טיפול מרכזי בשגיאות
7. **Loading States** - אינדיקטורים של טעינה
8. **Form Validation** - ולידציה של טפסים

### סביבות פיתוח
- **Development**: `npm start` - פותח ב-localhost:3000
- **Production Build**: `npm run build` - בנייה לפרודקשן
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier

### תלויות סביבה
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### פריסה ב-Vercel
- **פלטפורמה**: Vercel
- **סוג פריסה**: Static Site + Serverless Functions
- **Build Command**: `cd FRONTEND && npm ci && npm run build`
- **Output Directory**: `FRONTEND/build`
- **Auto-Deploy**: פריסה אוטומטית מ-GitHub
- **Environment**: משתני סביבה מוגדרים ב-Vercel Dashboard
- **CDN**: פריסה גלובלית עם CDN של Vercel
- **Custom Domain**: תמיכה בדומיין מותאם
- **Preview Deployments**: התקנות preview לכל commit

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

### תפקיד ומטרה
BACKEND אחראי על לוגיקה עסקית, עיבוד AI (RAG), ניהול API endpoints, אינטגרציה עם מיקרו-שירותים וניהול גרף הידע.

### טכנולוגיות וספריות עיקריות

#### Core Runtime & Framework
- **Node.js 18+** - סביבת ריצה
- **Express.js 4.18.2** - מסגרת web framework
- **CORS 2.8.5** - טיפול ב-CORS
- **Helmet 7.1.0** - אבטחה בסיסית

#### Database & ORM
- **Prisma 5.7.1** - ORM לניהול מסד נתונים
- **@prisma/client 5.7.1** - לקוח Prisma
- **PostgreSQL** - מסד נתונים ראשי עם pgvector

#### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT tokens
- **bcryptjs 2.4.3** - הצפנת סיסמאות
- **express-rate-limit 7.1.5** - הגבלת בקשות
- **Supabase JS 2.38.4** - אינטגרציה עם Supabase Auth

#### AI & RAG Services
- **OpenAI 4.20.1** - API ל-GPT-4 ועיבוד טקסט
- **Custom RAG Service** - מימוש מותאם ל-RAG

#### Caching & Performance
- **Redis 4.6.10** - זיכרון מטמון רב-שכבתי
- **compression 1.7.4** - דחיסת תגובות

#### Utilities & Helpers
- **dotenv 16.3.1** - ניהול משתני סביבה
- **joi 17.11.0** - ולידציה של schema
- **winston 3.11.0** - מערכת logging
- **axios 1.6.2** - HTTP client
- **multer 1.4.5-lts.1** - טיפול בהעלאות קבצים
- **express-validator 7.0.1** - ולידציה של נתונים

### מבנה תיקיות
```
BACKEND/
├── src/
│   ├── routes/             # תוואי API
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── content.js
│   │   ├── users.js
│   │   └── analytics.js
│   ├── services/           # לוגיקה עסקית
│   │   ├── ragService.js  # שירות RAG
│   │   └── ...
│   ├── middleware/         # middleware של Express
│   │   └── auth.js
│   ├── database/          # כלי מסד נתונים
│   │   └── seed.js
│   ├── config/            # קבצי תצורה
│   │   └── mock.js
│   ├── tests/             # בדיקות
│   └── server.js          # נקודת הכניסה
├── prisma/                # סכמת Prisma
│   └── schema.prisma
└── package.json
```

### API Endpoints עיקריים

#### Authentication
- `POST /api/auth/login` - התחברות משתמש
- `POST /api/auth/refresh` - רענון token
- `POST /api/auth/logout` - התנתקות

#### Chat & RAG
- `POST /api/chat/message` - שליחת הודעת צ'אט
- `GET /api/chat/history` - היסטוריית צ'אט
- `POST /api/chat/search` - חיפוש ב-RAG

#### Content Management
- `GET /api/content` - רשימת תוכן
- `GET /api/content/:id` - פרטי תוכן
- `POST /api/content` - יצירת תוכן חדש

#### Analytics
- `GET /api/analytics/progress` - התקדמות משתמש
- `GET /api/analytics/performance` - ביצועים
- `GET /api/analytics/recommendations` - המלצות

### תכונות עיקריות
1. **RAG Engine** - מנוע RAG עם OpenAI GPT-4
2. **Knowledge Graph** - ניהול גרף ידע עם PostgreSQL
3. **Vector Search** - חיפוש דמיון וקטורי עם pgvector
4. **Microservices Integration** - אינטגרציה עם מיקרו-שירותים
5. **Authentication** - ניהול JWT ו-Supabase Auth
6. **Rate Limiting** - הגבלת קצב בקשות
7. **Caching** - זיכרון מטמון עם Redis
8. **Logging** - יומני מערכת עם Winston

### סביבות פיתוח
- **Development**: `npm run dev` - עם nodemon
- **Production**: `npm start` - הרצה סטנדרטית
- **Testing**: Jest עם supertest
- **Database**: Prisma Studio `npm run db:studio`

### משתני סביבה
```env
DATABASE_URL=postgresql://username:password@localhost:5432/db
SUPABASE_SERVICE_ROLE_KEY=your-key
OPENAI_API_KEY=sk-your-key
PORT=3001
NODE_ENV=development
REDIS_URL=redis://localhost:6379
```

### פריסה ב-Railway
- **פלטפורמה**: Railway
- **סוג פריסה**: Containerized Node.js Application
- **Build**: Docker Container from Dockerfile
- **Auto-Deploy**: פריסה אוטומטית מ-GitHub
- **Environment Variables**: מוגדרות ב-Railway Dashboard
- **Custom Domain**: תמיכה בדומיין מותאם
- **Health Checks**: ניטור בריאות השרת
- **Logs**: צפייה ביומני שרת בזמן אמת

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

### תפקיד ומטרה
DATABASE אחראי על אחסון נתונים, וקטורים, גרף ידע, מידע משתמשים ותוכן למידה. כולל תמיכה ב-vector search ל-RAG.

### טכנולוגיות וכלים עיקריים

#### Database Engine
- **PostgreSQL 15+** - מסד נתונים יחסי ראשי
- **pgvector Extension** - תמיכה בווקטורים ו-similarity search
- **HNSW Indexing** - אינדקס מהיר לחיפוש דמיון

#### Backend Services
- **Supabase** - Backend-as-a-Service כולל:
  - PostgreSQL Database
  - Authentication & Authorization
  - Real-time Subscriptions
  - Storage & File Management
  - Edge Functions (Serverless)

#### ORM & Schema
- **Prisma ORM** - יצירת סכמה ושכבת גישה לנתונים
- **Prisma Migrations** - ניהול גרסאות מסד נתונים
- **Prisma Studio** - GUI לניהול נתונים

### מבנה תיקיות
```
DATABASE/
├── schema/                 # סכמות SQL
│   ├── 01_core_tables.sql       # טבלאות ליבה
│   ├── 02_vector_tables.sql     # טבלאות וקטורים
│   └── 07_rls_policies.sql      # מדיניות אבטחה
├── functions/              # פונקציות מסד נתונים
│   └── vector_search.sql  # חיפוש וקטורי
├── seed/                  # נתוני דוגמה
│   └── sample_data.sql
├── docs/                  # תיעוד
│   └── hnsw_optimization.md
└── config/                # תצורה
    └── supabase_config.md
```

### מודלים עיקריים (Prisma Schema)

#### Core Models
1. **User** - משתמשים ופרופילים
   - id, email, name, department, role
   - learningProfile, preferences
   - timestamps

2. **Skill** - מיומנויות
   - id, name, description, category
   - level, prerequisites, learningObjectives

3. **LearningContent** - תוכן למידה
   - id, title, description, contentType
   - difficultyLevel, skillsCovered
   - contentData, metadata

#### Progress & Analytics
4. **UserProgress** - התקדמות משתמש
   - userId, contentId, skillId
   - progressType, completionPercentage
   - status, timestamps

5. **ChatMessage** - הודעות צ'אט
   - userId, sessionId, messageType
   - content, metadata, confidenceScore

6. **Recommendation** - המלצות
   - userId, recommendationType
   - targetId, targetType, reason
   - confidenceScore

7. **LearningAnalytics** - אנליטיקה
   - userId, metricName, metricValue
   - metricData, period dates

#### Vectoral Models
8. **DocumentEmbedding** - וקטורים של מסמכים
   - contentId, contentType, contentText
   - embedding (vector(1536))

9. **QueryEmbedding** - וקטורים של שאילתות
   - userId, sessionId, queryText
   - embedding (vector(1536))

10. **SkillEmbedding** - וקטורים של מיומנויות
    - skillId, skillText
    - embedding (vector(1536))

#### Knowledge Graph
11. **KnowledgeNode** - צמתים בגרף
    - nodeType, nodeId, nodeText
    - embedding (vector(1536))
    - properties (JSON)

12. **KnowledgeEdge** - קשתות בגרף
    - sourceNodeId, targetNodeId
    - relationshipType, weight
    - metadata

13. **VectorSearchCache** - מטמון חיפוש
    - queryHash, queryEmbedding
    - searchResults, searchTimeMs

### תכונות עיקריות
1. **Vector Search** - חיפוש דמיון וקטורי עם pgvector
2. **Knowledge Graph** - גרף יחסים דינמי
3. **Real-time** - עדכונים בזמן אמת עם Supabase
4. **Row Level Security (RLS)** - אבטחה ברמת שורות
5. **Full-text Search** - חיפוש טקסטואלי מלא
6. **HNSW Indexing** - אינדקס מהיר לחיפוש וקטורי
7. **Audit Trail** - מעקב אחר שינויים
8. **Automatic Backups** - גיבויים אוטומטיים

### אסטרטגיית אינדוקסים
- **Primary Indexes** - על כל מפתחות ראשיים
- **Foreign Key Indexes** - על מפתחות זרים
- **Vector Indexes** - HNSW על עמודות embedding
- **Composite Indexes** - על עמודות משולבות
- **Full-text Indexes** - על טקסט חיפוש

### אבטחה (RLS Policies)
- **User Data** - משתמשים רואים רק את הנתונים שלהם
- **Content Access** - הרשאות על פי תפקיד
- **Admin Access** - גישה מלאה למנהלים
- **Audit Logging** - רישום כל פעולות האבטחה

---

## 🌐 הארכיטקטורה הכללית

### זרימת נתונים

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

### תקשורת בין רכיבים

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

### אבטחה
- **HTTPS**: הצפנה end-to-end
- **JWT Tokens**: אימות משתמשים
- **RLS**: Row Level Security
- **Input Validation**: ולידציה מלאה
- **Rate Limiting**: הגבלת בקשות
- **CORS**: בקרת גישה צדדית
- **Helmet**: אבטחת HTTP headers

### ביצועים
- **Caching**: Redis multi-level caching
- **CDN**: Supabase CDN
- **Connection Pooling**: PostgreSQL pooling
- **Compression**: Gzip/Brotli
- **Lazy Loading**: Frontend lazy loading
- **Indexing**: Database indexes
- **Vector Search**: HNSW optimization

### סקלביליות
- **Horizontal Scaling**: Auto-scaling Edge Functions
- **Load Balancing**: Supabase load balancer
- **Database Replicas**: Read replicas
- **Caching**: Distributed cache
- **Serverless**: Pay-per-use model

---

## 📊 סיכום Tech Stack

### FRONTEND Stack
| קטגוריה | טכנולוגיה |
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
| קטגוריה | טכנולוגיה |
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
| קטגוריה | טכנולוגיה |
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

## 🚀 נקודות כניסה והפעלה

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

## 🌐 הוראות פריסה (Deployment)

### פריסת FRONTEND ל-Vercel

#### דרך 1: פריסה דרך Vercel Dashboard
1. היכנס ל-[Vercel](https://vercel.com)
2. **New Project** → בחר את ה-repository
3. הגדר Root Directory: `FRONTEND`
4. הגדר Build Command: `npm ci && npm run build`
5. הגדר Output Directory: `build`
6. הוסף Environment Variables:
   - `REACT_APP_API_URL` → Railway Backend URL
   - `REACT_APP_SUPABASE_URL` → Supabase Project URL
   - `REACT_APP_SUPABASE_ANON_KEY` → Supabase Anon Key
7. לחץ **Deploy**

#### דרך 2: פריסה דרך Vercel CLI
```bash
# התקן Vercel CLI
npm i -g vercel

# היכנס לספריית FRONTEND
cd FRONTEND

# התחבר ל-Vercel
vercel login

# פריסת Development
vercel

# פריסת Production
vercel --prod
```

### פריסת BACKEND ל-Railway

#### דרך 1: פריסה דרך Railway Dashboard
1. היכנס ל-[Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. בחר את ה-repository
4. הגדר:
   - **Root Directory**: `BACKEND`
   - **Watch Paths**: `BACKEND/**`
5. הוסף Environment Variables:
   - `DATABASE_URL` → Supabase Database URL
   - `SUPABASE_SERVICE_ROLE_KEY` → Supabase Service Key
   - `OPENAI_API_KEY` → OpenAI API Key
   - `PORT` → `3001` (אופציונלי, Railway יקבע אוטומטית)
6. **Deploy** - Railway יבנה ויפרס אוטומטית

#### דרך 2: פריסה דרך Railway CLI
```bash
# התקן Railway CLI
npm i -g @railway/cli

# היכנס לספריית BACKEND
cd BACKEND

# התחבר ל-Railway
railway login

# צור Project חדש
railway init

# הוסף Environment Variables
railway variables set DATABASE_URL=your-db-url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-key
railway variables set OPENAI_API_KEY=your-openai-key

# פריסה
railway up
```

### פריסת DATABASE ל-Supabase

#### דרך Supabase Dashboard
1. היכנס ל-[Supabase](https://supabase.com)
2. **New Project** → יצירת פרויקט חדש
3. בחר:
   - **Region** - אזור גיאוגרפי
   - **Database Password** - סיסמת מסד נתונים
4. לאחר יצירת הפרויקט:
   - **SQL Editor** → הרץ את הסכמות מ-`DATABASE/schema/`
   - **Settings → API** → העתק API Keys
5. הוסף את ה-API Keys ל-FRONTEND ול-BACKEND

#### הרצת Migrations
```bash
cd BACKEND
npm run db:migrate
npm run db:seed
```

---

## 🔗 קישורים חשובים

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Repository**: [GitHub Repository URL]

---

**Document Status**: Complete
**Last Updated**: December 2024
**Version**: 1.0
**Language**: Hebrew

