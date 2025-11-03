# Corporate Learning Assistant Supabase Configuration

## Project Setup

### 1. Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Start local development
supabase start
```

### 2. Environment Variables
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Redis Configuration (for caching)
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-jwt-secret
```

### 3. Database Setup
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Run schema files in order:
-- 1. 01_core_tables.sql
-- 2. 02_vector_tables.sql
-- 3. 03_relationships.sql
-- 4. 04_indexes.sql
-- 5. 05_functions.sql
-- 6. 06_triggers.sql
-- 7. 07_rls_policies.sql
-- 8. 08_views.sql
```

### 4. Authentication Setup
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_search_cache ENABLE ROW LEVEL SECURITY;
```

### 5. Edge Functions Setup
```bash
# Create edge functions
supabase functions new rag-query
supabase functions new user-analytics
supabase functions new content-recommendations
supabase functions new knowledge-graph-search
supabase functions new microservice-integration

# Deploy functions
supabase functions deploy
```

### 6. Storage Setup
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('learning-content', 'learning-content', true),
('user-uploads', 'user-uploads', false),
('chat-attachments', 'chat-attachments', false);

-- Set up storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'learning-content');
CREATE POLICY "User Uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 7. Real-time Setup
```sql
-- Enable real-time for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE learning_analytics;
```

### 8. API Configuration
```typescript
// Supabase client configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

### 9. Testing Setup
```bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Run performance tests
npm run test:performance
```

### 10. Deployment
```bash
# Deploy to production
supabase db push
supabase functions deploy --project-ref your-project-ref

# Set up monitoring
supabase projects list
supabase projects api-keys --project-ref your-project-ref
```

## Security Considerations

1. **Row Level Security**: All tables have RLS enabled
2. **API Keys**: Store securely in environment variables
3. **CORS**: Configure appropriate CORS settings
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: Validate all inputs on both client and server
6. **SQL Injection**: Use parameterized queries
7. **XSS Protection**: Sanitize user inputs
8. **CSRF Protection**: Implement CSRF tokens

## Performance Optimization

1. **Indexing**: Proper indexes on frequently queried columns
2. **Caching**: Redis caching for frequently accessed data
3. **Connection Pooling**: Use connection pooling for database connections
4. **CDN**: Use Supabase CDN for static assets
5. **Compression**: Enable gzip compression
6. **Monitoring**: Set up performance monitoring

## Monitoring and Logging

1. **Supabase Dashboard**: Monitor usage and performance
2. **Custom Logging**: Implement structured logging
3. **Error Tracking**: Set up error tracking and alerting
4. **Analytics**: Track user behavior and system performance
5. **Health Checks**: Implement health check endpoints


