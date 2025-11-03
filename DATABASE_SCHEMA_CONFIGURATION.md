# 🗄️ DATABASE SCHEMA & CONFIGURATION

## 🎯 PostgreSQL with pgvector Database Design

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Database Version**: 1.0
**Date**: December 2024
**Status**: Implementation

---

## 📊 Database Architecture

### 1. Core Tables Design

#### Users Table
```sql
-- Users table for authentication and profiles
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT,
  role TEXT,
  learning_profile JSONB,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);
```

#### Learning Content Table (with pgvector)
```sql
-- Learning content table with vector embeddings
CREATE TABLE learning_content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('course', 'lesson', 'skill', 'assessment', 'tutorial', 'reference')),
  embedding VECTOR(1536), -- OpenAI embedding dimension
  metadata JSONB,
  source_service TEXT, -- Which microservice this came from
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for learning content
CREATE INDEX idx_learning_content_type ON learning_content(content_type);
CREATE INDEX idx_learning_content_source ON learning_content(source_service);
CREATE INDEX idx_learning_content_created ON learning_content(created_at);

-- Vector similarity search index
CREATE INDEX ON learning_content USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

#### Skills Table
```sql
-- Skills and competencies
CREATE TABLE skills (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level INTEGER DEFAULT 1,
  prerequisites TEXT[], -- Array of prerequisite skill IDs
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for skills
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_level ON skills(level);
CREATE INDEX idx_skills_name ON skills(name);
```

#### Courses Table
```sql
-- Courses and learning paths
CREATE TABLE courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- Duration in minutes
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  prerequisites TEXT[], -- Array of prerequisite skill/course IDs
  learning_objectives TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for courses
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_duration ON courses(duration);
CREATE INDEX idx_courses_title ON courses(title);
```

#### Learning Progress Table
```sql
-- User learning progress tracking
CREATE TABLE learning_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES skills(id) ON DELETE SET NULL,
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  level INTEGER DEFAULT 1,
  progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for learning progress
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_skill ON learning_progress(skill_id);
CREATE INDEX idx_learning_progress_course ON learning_progress(course_id);
CREATE INDEX idx_learning_progress_completed ON learning_progress(completed_at);
```

#### Chat Messages Table
```sql
-- Chat conversation history
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  confidence FLOAT,
  sources JSONB, -- Array of source documents
  processing_time INTEGER, -- Processing time in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for chat messages
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_confidence ON chat_messages(confidence);
```

#### Recommendations Table
```sql
-- Personalized recommendations
CREATE TABLE recommendations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('skill', 'course', 'content')),
  item_id TEXT NOT NULL,
  score FLOAT NOT NULL CHECK (score >= 0 AND score <= 1),
  reason TEXT,
  clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for recommendations
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_type ON recommendations(type);
CREATE INDEX idx_recommendations_score ON recommendations(score);
CREATE INDEX idx_recommendations_created ON recommendations(created_at);
```

#### Assessments Table
```sql
-- Assessments and quizzes
CREATE TABLE assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB, -- Array of question objects
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  time_limit INTEGER, -- Time limit in minutes
  passing_score FLOAT DEFAULT 70,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for assessments
CREATE INDEX idx_assessments_difficulty ON assessments(difficulty);
CREATE INDEX idx_assessments_title ON assessments(title);
```

#### Assessment Results Table
```sql
-- User assessment results
CREATE TABLE assessment_results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,
  answers JSONB, -- User's answers
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_taken INTEGER -- Time taken in seconds
);

-- Indexes for assessment results
CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_assessment ON assessment_results(assessment_id);
CREATE INDEX idx_assessment_results_score ON assessment_results(score);
```

### 2. Database Functions

#### Vector Similarity Search Function
```sql
-- Function for vector similarity search using pgvector
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  content_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  content TEXT,
  content_type TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    lc.id,
    lc.title,
    lc.content,
    lc.content_type,
    1 - (lc.embedding <=> query_embedding) AS similarity,
    lc.metadata
  FROM learning_content lc
  WHERE lc.embedding IS NOT NULL
    AND 1 - (lc.embedding <=> query_embedding) > match_threshold
    AND (content_types IS NULL OR lc.content_type = ANY(content_types))
  ORDER BY lc.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

#### User Learning Analytics Function
```sql
-- Function to get user learning analytics
CREATE OR REPLACE FUNCTION get_user_learning_analytics(user_id_param TEXT)
RETURNS TABLE (
  total_skills INTEGER,
  completed_skills INTEGER,
  total_courses INTEGER,
  completed_courses INTEGER,
  total_progress FLOAT,
  recent_activity JSONB
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    COUNT(DISTINCT lp.skill_id)::INTEGER as total_skills,
    COUNT(DISTINCT CASE WHEN lp.progress = 100 THEN lp.skill_id END)::INTEGER as completed_skills,
    COUNT(DISTINCT lp.course_id)::INTEGER as total_courses,
    COUNT(DISTINCT CASE WHEN lp.progress = 100 THEN lp.course_id END)::INTEGER as completed_courses,
    COALESCE(AVG(lp.progress), 0) as total_progress,
    jsonb_build_object(
      'recent_messages', (
        SELECT COUNT(*) FROM chat_messages cm 
        WHERE cm.user_id = user_id_param 
        AND cm.created_at > NOW() - INTERVAL '7 days'
      ),
      'recent_progress', (
        SELECT COUNT(*) FROM learning_progress lp2 
        WHERE lp2.user_id = user_id_param 
        AND lp2.updated_at > NOW() - INTERVAL '7 days'
      )
    ) as recent_activity
  FROM learning_progress lp
  WHERE lp.user_id = user_id_param;
$$;
```

#### Recommendation Generation Function
```sql
-- Function to generate personalized recommendations
CREATE OR REPLACE FUNCTION generate_recommendations(
  user_id_param TEXT,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  type TEXT,
  title TEXT,
  description TEXT,
  score FLOAT,
  reason TEXT
)
LANGUAGE SQL STABLE
AS $$
  WITH user_profile AS (
    SELECT learning_profile, preferences
    FROM users
    WHERE id = user_id_param
  ),
  user_skills AS (
    SELECT skill_id, level, progress
    FROM learning_progress
    WHERE user_id = user_id_param AND skill_id IS NOT NULL
  ),
  skill_recommendations AS (
    SELECT 
      s.id,
      'skill'::TEXT as type,
      s.name as title,
      s.description,
      CASE 
        WHEN EXISTS(SELECT 1 FROM user_skills us WHERE us.skill_id = s.id) THEN 0.3
        ELSE 0.8
      END as score,
      'Recommended based on your learning profile'::TEXT as reason
    FROM skills s
    WHERE NOT EXISTS(SELECT 1 FROM user_skills us WHERE us.skill_id = s.id AND us.progress = 100)
    ORDER BY s.level ASC, s.name ASC
    LIMIT limit_count / 2
  ),
  course_recommendations AS (
    SELECT 
      c.id,
      'course'::TEXT as type,
      c.title,
      c.description,
      CASE 
        WHEN EXISTS(SELECT 1 FROM learning_progress lp WHERE lp.course_id = c.id AND lp.user_id = user_id_param) THEN 0.2
        ELSE 0.7
      END as score,
      'Course matches your skill development goals'::TEXT as reason
    FROM courses c
    WHERE NOT EXISTS(SELECT 1 FROM learning_progress lp WHERE lp.course_id = c.id AND lp.user_id = user_id_param AND lp.progress = 100)
    ORDER BY c.difficulty ASC, c.title ASC
    LIMIT limit_count / 2
  )
  SELECT * FROM skill_recommendations
  UNION ALL
  SELECT * FROM course_recommendations
  ORDER BY score DESC, title ASC
  LIMIT limit_count;
$$;
```

### 3. Row Level Security (RLS) Policies

#### Users Table Policies
```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Service role can manage all users
CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');
```

#### Learning Content Policies
```sql
-- Enable RLS on learning content table
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read learning content
CREATE POLICY "Authenticated users can read learning content" ON learning_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- Service role can manage learning content
CREATE POLICY "Service role can manage learning content" ON learning_content
  FOR ALL USING (auth.role() = 'service_role');
```

#### Learning Progress Policies
```sql
-- Enable RLS on learning progress table
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own progress
CREATE POLICY "Users can view own progress" ON learning_progress
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress" ON learning_progress
  FOR ALL USING (auth.uid()::text = user_id);

-- Service role can manage all progress
CREATE POLICY "Service role can manage progress" ON learning_progress
  FOR ALL USING (auth.role() = 'service_role');
```

#### Chat Messages Policies
```sql
-- Enable RLS on chat messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view and insert their own messages
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Service role can manage all messages
CREATE POLICY "Service role can manage messages" ON chat_messages
  FOR ALL USING (auth.role() = 'service_role');
```

#### Recommendations Policies
```sql
-- Enable RLS on recommendations table
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Users can view their own recommendations
CREATE POLICY "Users can view own recommendations" ON recommendations
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own recommendations" ON recommendations
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Service role can manage all recommendations
CREATE POLICY "Service role can manage recommendations" ON recommendations
  FOR ALL USING (auth.role() = 'service_role');
```

### 4. Database Triggers

#### Update Timestamp Trigger
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_content_updated_at BEFORE UPDATE ON learning_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at BEFORE UPDATE ON learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Database Views

#### User Learning Dashboard View
```sql
-- View for user learning dashboard
CREATE VIEW user_learning_dashboard AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.department,
  u.role,
  COALESCE(stats.total_skills, 0) as total_skills,
  COALESCE(stats.completed_skills, 0) as completed_skills,
  COALESCE(stats.total_courses, 0) as total_courses,
  COALESCE(stats.completed_courses, 0) as completed_courses,
  COALESCE(stats.total_progress, 0) as overall_progress,
  COALESCE(recent_messages.count, 0) as recent_messages,
  COALESCE(recent_progress.count, 0) as recent_progress_updates
FROM users u
LEFT JOIN LATERAL get_user_learning_analytics(u.id) stats ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count
  FROM chat_messages cm
  WHERE cm.user_id = u.id
  AND cm.created_at > NOW() - INTERVAL '7 days'
) recent_messages ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count
  FROM learning_progress lp
  WHERE lp.user_id = u.id
  AND lp.updated_at > NOW() - INTERVAL '7 days'
) recent_progress ON true;
```

#### Learning Content Search View
```sql
-- View for learning content search with metadata
CREATE VIEW learning_content_search AS
SELECT 
  lc.id,
  lc.title,
  lc.content,
  lc.content_type,
  lc.source_service,
  lc.metadata,
  lc.created_at,
  lc.updated_at,
  CASE 
    WHEN lc.content_type = 'course' THEN c.difficulty
    WHEN lc.content_type = 'skill' THEN s.level::TEXT
    ELSE NULL
  END as difficulty_level,
  CASE 
    WHEN lc.content_type = 'course' THEN c.duration
    ELSE NULL
  END as duration
FROM learning_content lc
LEFT JOIN courses c ON lc.metadata->>'course_id' = c.id
LEFT JOIN skills s ON lc.metadata->>'skill_id' = s.id;
```

### 6. Database Indexes for Performance

#### Additional Performance Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_learning_progress_user_skill ON learning_progress(user_id, skill_id);
CREATE INDEX idx_learning_progress_user_course ON learning_progress(user_id, course_id);
CREATE INDEX idx_chat_messages_user_created ON chat_messages(user_id, created_at);
CREATE INDEX idx_recommendations_user_type ON recommendations(user_id, type);

-- Partial indexes for better performance
CREATE INDEX idx_learning_progress_active ON learning_progress(user_id) 
WHERE completed_at IS NULL;

CREATE INDEX idx_chat_messages_recent ON chat_messages(user_id, created_at) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- GIN indexes for JSONB columns
CREATE INDEX idx_users_learning_profile ON users USING GIN (learning_profile);
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
CREATE INDEX idx_learning_content_metadata ON learning_content USING GIN (metadata);
```

### 7. Database Seeding Script

#### Initial Data Seeding
```sql
-- Insert sample skills
INSERT INTO skills (name, description, category, level) VALUES
('Python Programming', 'Python programming language skills', 'Technical', 1),
('Machine Learning', 'Machine learning algorithms and techniques', 'Technical', 2),
('Data Analysis', 'Data analysis and visualization skills', 'Technical', 2),
('Project Management', 'Project management methodologies', 'Management', 1),
('Communication', 'Effective communication skills', 'Soft Skills', 1),
('Leadership', 'Leadership and team management', 'Management', 2);

-- Insert sample courses
INSERT INTO courses (title, description, duration, difficulty, learning_objectives) VALUES
('Python Fundamentals', 'Learn Python programming basics', 480, 'beginner', ARRAY['Variables and data types', 'Control structures', 'Functions', 'Modules']),
('Machine Learning Basics', 'Introduction to machine learning concepts', 720, 'intermediate', ARRAY['Supervised learning', 'Unsupervised learning', 'Model evaluation', 'Feature engineering']),
('Data Analysis with Python', 'Data analysis using Python libraries', 600, 'intermediate', ARRAY['Pandas basics', 'Data visualization', 'Statistical analysis', 'Data cleaning']),
('Project Management Fundamentals', 'Essential project management skills', 360, 'beginner', ARRAY['Project planning', 'Risk management', 'Team coordination', 'Timeline management']);

-- Insert sample learning content
INSERT INTO learning_content (title, content, content_type, source_service, metadata) VALUES
('Python Variables', 'Variables in Python are containers for storing data values...', 'tutorial', 'content-studio', '{"difficulty": "beginner", "tags": ["python", "basics"]}'),
('Machine Learning Overview', 'Machine learning is a subset of artificial intelligence...', 'tutorial', 'content-studio', '{"difficulty": "intermediate", "tags": ["ml", "ai"]}'),
('Data Visualization Best Practices', 'Effective data visualization helps communicate insights...', 'reference', 'content-studio', '{"difficulty": "intermediate", "tags": ["visualization", "data"]}'),
('Project Planning Techniques', 'Successful project planning involves several key steps...', 'tutorial', 'course-builder', '{"difficulty": "beginner", "tags": ["project", "planning"]}');
```

---

## 🔧 Database Configuration Files

### 1. Prisma Schema File
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String
  department        String?
  role              String?
  learningProfile   Json?
  preferences       Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relationships
  learningProgress  LearningProgress[]
  chatMessages      ChatMessage[]
  recommendations   Recommendation[]
  assessmentResults AssessmentResult[]

  @@map("users")
}

model LearningContent {
  id          String   @id @default(cuid())
  title       String
  content     String
  contentType String   // 'course', 'lesson', 'skill', 'assessment', 'tutorial', 'reference'
  embedding   Unsupported("vector(1536)")? // OpenAI embedding dimension
  metadata    Json?
  sourceService String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("learning_content")
}

model Skill {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String?
  level       Int      @default(1)
  prerequisites String[]
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  learningProgress LearningProgress[]

  @@map("skills")
}

model Course {
  id                String   @id @default(cuid())
  title             String
  description       String?
  duration          Int?     // Duration in minutes
  difficulty        String?  // 'beginner', 'intermediate', 'advanced'
  prerequisites     String[]
  learningObjectives String[]
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relationships
  learningProgress LearningProgress[]

  @@map("courses")
}

model LearningProgress {
  id          String   @id @default(cuid())
  userId      String
  skillId     String?
  courseId    String?
  level       Int      @default(1)
  progress    Float    @default(0)
  completedAt DateTime?
  startedAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  skill       Skill?   @relation(fields: [skillId], references: [id])
  course      Course?  @relation(fields: [courseId], references: [id])

  @@map("learning_progress")
}

model ChatMessage {
  id            String   @id @default(cuid())
  userId        String
  message       String
  response      String?
  confidence    Float?
  sources       Json?
  processingTime Int?
  createdAt     DateTime @default(now())

  // Relationships
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("chat_messages")
}

model Recommendation {
  id          String   @id @default(cuid())
  userId      String
  type        String   // 'skill', 'course', 'content'
  itemId      String
  score       Float
  reason      String?
  clicked     Boolean  @default(false)
  createdAt   DateTime @default(now())

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("recommendations")
}

model Assessment {
  id          String   @id @default(cuid())
  title       String
  description String?
  questions   Json?
  difficulty  String?  // 'beginner', 'intermediate', 'advanced'
  timeLimit   Int?     // Time limit in minutes
  passingScore Float   @default(70)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  results     AssessmentResult[]

  @@map("assessments")
}

model AssessmentResult {
  id          String   @id @default(cuid())
  userId      String
  assessmentId String
  score       Float
  answers     Json?
  completedAt DateTime @default(now())
  timeTaken   Int?     // Time taken in seconds

  // Relationships
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  assessment  Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@map("assessment_results")
}
```

### 2. Database Migration Scripts
```bash
# Migration commands
npx prisma migrate dev --name init
npx prisma migrate dev --name add_vector_extension
npx prisma migrate dev --name add_rls_policies
npx prisma generate
npx prisma db seed
```

---

**Document Status**: Implementation
**Last Updated**: December 2024
**Next Review**: Testing and Optimization
**Approved By**: [Name and Title]


