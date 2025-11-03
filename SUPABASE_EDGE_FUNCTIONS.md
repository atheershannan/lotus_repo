# 🚀 SUPABASE EDGE FUNCTIONS IMPLEMENTATION

## 🎯 Supabase Edge Functions for Corporate Assistant

**Project Name**: Contextual Corporate Assistant RAG/GRAPH
**Functions Version**: 1.0
**Date**: December 2024
**Status**: Implementation

---

## 📊 Supabase Configuration

### 1. Supabase Project Setup
```bash
# Initialize Supabase project
supabase init

# Start local development
supabase start

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

### 2. Supabase Configuration File
```toml
# supabase/config.toml
project_id = "your-project-id"

[api]
enabled = true
port = 54321
schemas = ["public", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
major_version = 15

[studio]
enabled = true
port = 54323

[inbucket]
enabled = true
port = 54324

[storage]
enabled = true
port = 54325
file_size_limit = "50MiB"

[auth]
enabled = true
port = 54326
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://your-domain.com"]
jwt_expiry = 3600
enable_signup = true

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = false

[edge_functions]
enabled = true
port = 54327
```

---

## 🔧 Edge Functions Implementation

### 1. RAG Query Function
```typescript
// supabase/functions/rag-query/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://esm.sh/openai@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RAGRequest {
  query: string;
  userId: string;
  context?: any;
}

interface RAGResponse {
  response: string;
  confidence: number;
  sources: Array<{
    id: string;
    title: string;
    contentType: string;
    relevance: number;
  }>;
  recommendations: Array<{
    type: string;
    id: string;
    title: string;
    description?: string;
    score: number;
  }>;
  processingTime: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, userId, context }: RAGRequest = await req.json()

    if (!query || !userId) {
      return new Response(
        JSON.stringify({ error: 'Query and userId are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    const startTime = Date.now()

    // 1. Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // 2. Perform vector similarity search
    const { data: similarContent, error: searchError } = await supabase
      .rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5
      })

    if (searchError) {
      throw new Error(`Search error: ${searchError.message}`)
    }

    // 3. Get user context
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        name,
        learning_profile,
        preferences,
        learning_progress (
          id,
          level,
          progress,
          skill:skills (name, description),
          course:courses (title, description)
        ),
        chat_history (
          id,
          message,
          response,
          created_at
        )
      `)
      .eq('id', userId)
      .single()

    if (userError) {
      throw new Error(`User error: ${userError.message}`)
    }

    // 4. Generate response using GPT-4
    const contextText = similarContent
      ?.map(item => `Title: ${item.title}\nContent: ${item.content}\nType: ${item.content_type}`)
      .join('\n\n') || ''

    const userProfileText = user.learning_profile 
      ? `User Profile: ${JSON.stringify(user.learning_profile)}`
      : ''

    const systemPrompt = `You are a corporate learning assistant. Provide helpful, accurate, and personalized responses based on the learning content and user context. Always cite your sources and provide actionable recommendations.`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Context:\n${contextText}\n\n${userProfileText}\n\nQuery: ${query}` }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const responseText = completion.choices[0].message.content || ''
    const processingTime = Date.now() - startTime

    // 5. Calculate confidence score
    const avgSimilarity = similarContent?.reduce((sum, item) => sum + item.similarity, 0) / similarContent.length || 0
    const confidence = Math.max(0.5, Math.min(1.0, avgSimilarity))

    // 6. Save chat message
    const { error: chatError } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: query,
        response: responseText,
        confidence: confidence,
        sources: JSON.stringify(similarContent || [])
      })

    if (chatError) {
      console.error('Chat message save error:', chatError)
    }

    // 7. Generate recommendations
    const recommendations = await generateRecommendations(supabase, userId, query, responseText)

    const response: RAGResponse = {
      response: responseText,
      confidence,
      sources: similarContent?.map(item => ({
        id: item.id,
        title: item.title,
        contentType: item.content_type,
        relevance: item.similarity
      })) || [],
      recommendations,
      processingTime
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('RAG processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process query',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateRecommendations(supabase: any, userId: string, query: string, response: string) {
  try {
    // Get related skills and courses
    const { data: skills } = await supabase
      .from('skills')
      .select('id, name, description')
      .limit(3)

    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, description')
      .limit(3)

    const recommendations = [
      ...(skills || []).map(skill => ({
        type: 'skill',
        id: skill.id,
        title: skill.name,
        description: skill.description,
        score: 0.8
      })),
      ...(courses || []).map(course => ({
        type: 'course',
        id: course.id,
        title: course.title,
        description: course.description,
        score: 0.7
      }))
    ]

    return recommendations
  } catch (error) {
    console.error('Recommendation generation error:', error)
    return []
  }
}
```

### 2. Authentication Function
```typescript
// supabase/functions/auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  email: string;
  password?: string;
  provider?: 'google' | 'azure' | 'okta';
  ssoToken?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, provider, ssoToken }: AuthRequest = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let authResult

    if (provider && ssoToken) {
      // Corporate SSO authentication
      authResult = await handleSSOAuth(supabase, provider, ssoToken)
    } else if (email && password) {
      // Email/password authentication
      authResult = await supabase.auth.signInWithPassword({
        email,
        password
      })
    } else {
      throw new Error('Invalid authentication parameters')
    }

    if (authResult.error) {
      throw new Error(authResult.error.message)
    }

    // Get user profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, department, role, learning_profile, preferences')
      .eq('email', email)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`User profile error: ${userError.message}`)
    }

    // Create user profile if it doesn't exist
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: authResult.data.user.email,
          name: authResult.data.user.user_metadata?.name || authResult.data.user.email,
          department: authResult.data.user.user_metadata?.department,
          role: authResult.data.user.user_metadata?.role
        })
        .select()
        .single()

      if (createError) {
        throw new Error(`User creation error: ${createError.message}`)
      }

      return new Response(
        JSON.stringify({
          user: newUser,
          session: authResult.data.session
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({
        user,
        session: authResult.data.session
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Authentication error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Authentication failed',
        details: error.message 
      }),
      { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleSSOAuth(supabase: any, provider: string, ssoToken: string) {
  // In a real implementation, you would validate the SSO token
  // with your corporate identity provider
  
  // For now, we'll simulate SSO authentication
  const mockUser = {
    email: 'user@company.com',
    user_metadata: {
      name: 'Corporate User',
      department: 'Engineering',
      role: 'Developer'
    }
  }

  // Create or sign in user
  return await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${Deno.env.get('SITE_URL')}/auth/callback`
    }
  })
}
```

### 3. Microservice Integration Function
```typescript
// supabase/functions/microservice-integration/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IntegrationRequest {
  service: 'course-builder' | 'skills-engine' | 'content-studio' | 'assessment';
  action: 'sync' | 'webhook' | 'query';
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { service, action, data }: IntegrationRequest = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let result

    switch (action) {
      case 'sync':
        result = await syncMicroserviceData(supabase, service)
        break
      case 'webhook':
        result = await handleWebhook(supabase, service, data)
        break
      case 'query':
        result = await queryMicroservice(supabase, service, data)
        break
      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Microservice integration error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Integration failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function syncMicroserviceData(supabase: any, service: string) {
  // Simulate microservice data sync
  const mockData = {
    'course-builder': [
      { id: '1', title: 'Introduction to Machine Learning', description: 'Learn ML basics' },
      { id: '2', title: 'Advanced Python', description: 'Master Python programming' }
    ],
    'skills-engine': [
      { id: '1', name: 'Python', description: 'Programming language', category: 'Technical' },
      { id: '2', name: 'Machine Learning', description: 'AI/ML skills', category: 'Technical' }
    ],
    'content-studio': [
      { id: '1', title: 'ML Tutorial', content: 'Comprehensive ML guide', type: 'tutorial' },
      { id: '2', title: 'Python Cheat Sheet', content: 'Quick reference', type: 'reference' }
    ],
    'assessment': [
      { id: '1', title: 'Python Assessment', questions: [], difficulty: 'intermediate' },
      { id: '2', title: 'ML Knowledge Test', questions: [], difficulty: 'advanced' }
    ]
  }

  const data = mockData[service] || []
  
  // Update learning content table
  for (const item of data) {
    const { error } = await supabase
      .from('learning_content')
      .upsert({
        id: `${service}-${item.id}`,
        title: item.title || item.name,
        content: item.description || item.content || '',
        content_type: service,
        metadata: item
      })

    if (error) {
      console.error(`Error syncing ${service} data:`, error)
    }
  }

  return {
    success: true,
    synced: data.length,
    service
  }
}

async function handleWebhook(supabase: any, service: string, data: any) {
  // Handle webhook from microservice
  console.log(`Webhook received from ${service}:`, data)
  
  // Process webhook data and update knowledge graph
  const { error } = await supabase
    .from('learning_content')
    .upsert({
      id: `${service}-${data.id}`,
      title: data.title || data.name,
      content: data.description || data.content || '',
      content_type: service,
      metadata: data,
      updated_at: new Date().toISOString()
    })

  if (error) {
    throw new Error(`Webhook processing error: ${error.message}`)
  }

  return {
    success: true,
    processed: data
  }
}

async function queryMicroservice(supabase: any, service: string, query: any) {
  // Query microservice for specific data
  const { data, error } = await supabase
    .from('learning_content')
    .select('*')
    .eq('content_type', service)
    .ilike('title', `%${query.search}%`)

  if (error) {
    throw new Error(`Query error: ${error.message}`)
  }

  return {
    success: true,
    results: data
  }
}
```

### 4. Personalization Function
```typescript
// supabase/functions/personalization/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PersonalizationRequest {
  userId: string;
  action: 'update-profile' | 'get-recommendations' | 'track-progress';
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, action, data }: PersonalizationRequest = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    let result

    switch (action) {
      case 'update-profile':
        result = await updateUserProfile(supabase, userId, data)
        break
      case 'get-recommendations':
        result = await getPersonalizedRecommendations(supabase, userId)
        break
      case 'track-progress':
        result = await trackLearningProgress(supabase, userId, data)
        break
      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Personalization error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Personalization failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function updateUserProfile(supabase: any, userId: string, profileData: any) {
  const { data, error } = await supabase
    .from('users')
    .update({
      learning_profile: profileData.learningProfile,
      preferences: profileData.preferences
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Profile update error: ${error.message}`)
  }

  return {
    success: true,
    user: data
  }
}

async function getPersonalizedRecommendations(supabase: any, userId: string) {
  // Get user's learning progress and preferences
  const { data: user, error: userError } = await supabase
    .from('users')
    .select(`
      learning_profile,
      preferences,
      learning_progress (
        skill_id,
        level,
        progress
      )
    `)
    .eq('id', userId)
    .single()

  if (userError) {
    throw new Error(`User data error: ${userError.message}`)
  }

  // Generate personalized recommendations based on progress and preferences
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .limit(5)

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .limit(5)

  const recommendations = [
    ...(skills || []).map(skill => ({
      type: 'skill',
      id: skill.id,
      title: skill.name,
      description: skill.description,
      score: calculateRecommendationScore(skill, user),
      reason: 'Based on your learning profile'
    })),
    ...(courses || []).map(course => ({
      type: 'course',
      id: course.id,
      title: course.title,
      description: course.description,
      score: calculateRecommendationScore(course, user),
      reason: 'Matches your skill development goals'
    }))
  ]

  // Sort by score and return top recommendations
  recommendations.sort((a, b) => b.score - a.score)

  return {
    success: true,
    recommendations: recommendations.slice(0, 10)
  }
}

async function trackLearningProgress(supabase: any, userId: string, progressData: any) {
  const { data, error } = await supabase
    .from('learning_progress')
    .upsert({
      user_id: userId,
      skill_id: progressData.skillId,
      course_id: progressData.courseId,
      level: progressData.level,
      progress: progressData.progress,
      completed_at: progressData.completed ? new Date().toISOString() : null
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Progress tracking error: ${error.message}`)
  }

  return {
    success: true,
    progress: data
  }
}

function calculateRecommendationScore(item: any, user: any) {
  // Simple scoring algorithm - in production, this would be more sophisticated
  let score = 0.5

  // Boost score based on user preferences
  if (user.preferences?.interests?.includes(item.category)) {
    score += 0.2
  }

  // Boost score based on learning level
  if (user.learning_profile?.level === 'beginner' && item.difficulty === 'beginner') {
    score += 0.3
  }

  return Math.min(1.0, score)
}
```

---

## 🗄️ Database Functions

### 1. Vector Similarity Search Function
```sql
-- supabase/migrations/20241201000001_vector_search.sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  content TEXT,
  content_type TEXT,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    learning_content.id,
    learning_content.title,
    learning_content.content,
    learning_content.content_type,
    1 - (learning_content.embedding <=> query_embedding) AS similarity
  FROM learning_content
  WHERE learning_content.embedding IS NOT NULL
    AND 1 - (learning_content.embedding <=> query_embedding) > match_threshold
  ORDER BY learning_content.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Create index for vector similarity search
CREATE INDEX ON learning_content USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 2. Row Level Security Policies
```sql
-- supabase/migrations/20241201000002_rls_policies.sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Learning content is readable by all authenticated users
CREATE POLICY "Authenticated users can read learning content" ON learning_content
  FOR SELECT USING (auth.role() = 'authenticated');

-- Learning progress is user-specific
CREATE POLICY "Users can view own progress" ON learning_progress
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress" ON learning_progress
  FOR ALL USING (auth.uid()::text = user_id);

-- Chat messages are user-specific
CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
```

---

## 🚀 Deployment Configuration

### 1. Supabase CLI Commands
```bash
# Deploy Edge Functions
supabase functions deploy rag-query
supabase functions deploy auth
supabase functions deploy microservice-integration
supabase functions deploy personalization

# Deploy database migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

### 2. Environment Variables
```bash
# .env.local
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
SITE_URL=http://localhost:3000
```

---

**Document Status**: Implementation
**Last Updated**: December 2024
**Next Review**: Testing and Integration
**Approved By**: [Name and Title]


