-- Corporate Learning Assistant Row Level Security Policies
-- Security policies for data access control

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
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

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Service role can manage all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Skills table policies
CREATE POLICY "Anyone can view published skills" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Trainers can manage skills" ON skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::uuid 
            AND users.role IN ('trainer', 'admin')
        )
    );

CREATE POLICY "Service role can manage all skills" ON skills
    FOR ALL USING (auth.role() = 'service_role');

-- Learning Content table policies
CREATE POLICY "Anyone can view published content" ON learning_content
    FOR SELECT USING (is_published = true);

CREATE POLICY "Content creators can manage their content" ON learning_content
    FOR ALL USING (
        created_by = auth.uid()::uuid OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::uuid 
            AND users.role IN ('trainer', 'admin')
        )
    );

CREATE POLICY "Service role can manage all content" ON learning_content
    FOR ALL USING (auth.role() = 'service_role');

-- User Progress table policies
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "HR Managers can view department progress" ON user_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::uuid 
            AND users.role = 'hr_manager'
            AND users.department = (
                SELECT department FROM users 
                WHERE users.id = user_progress.user_id
            )
        )
    );

CREATE POLICY "Service role can manage all progress" ON user_progress
    FOR ALL USING (auth.role() = 'service_role');

-- Chat Messages table policies
CREATE POLICY "Users can view their own messages" ON chat_messages
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can insert their own messages" ON chat_messages
    FOR INSERT WITH CHECK (user_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage all messages" ON chat_messages
    FOR ALL USING (auth.role() = 'service_role');

-- Recommendations table policies
CREATE POLICY "Users can view their own recommendations" ON recommendations
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update their own recommendations" ON recommendations
    FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage all recommendations" ON recommendations
    FOR ALL USING (auth.role() = 'service_role');

-- Learning Analytics table policies
CREATE POLICY "Users can view their own analytics" ON learning_analytics
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "HR Managers can view department analytics" ON learning_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::uuid 
            AND users.role = 'hr_manager'
            AND users.department = (
                SELECT department FROM users 
                WHERE users.id = learning_analytics.user_id
            )
        )
    );

CREATE POLICY "Service role can manage all analytics" ON learning_analytics
    FOR ALL USING (auth.role() = 'service_role');

-- Document Embeddings table policies
CREATE POLICY "Service role can manage document embeddings" ON document_embeddings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read document embeddings" ON document_embeddings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Query Embeddings table policies
CREATE POLICY "Users can view their own query embeddings" ON query_embeddings
    FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Service role can manage all query embeddings" ON query_embeddings
    FOR ALL USING (auth.role() = 'service_role');

-- Skill Embeddings table policies
CREATE POLICY "Anyone can view skill embeddings" ON skill_embeddings
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage all skill embeddings" ON skill_embeddings
    FOR ALL USING (auth.role() = 'service_role');

-- Knowledge Nodes table policies
CREATE POLICY "Anyone can view knowledge nodes" ON knowledge_nodes
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage all knowledge nodes" ON knowledge_nodes
    FOR ALL USING (auth.role() = 'service_role');

-- Knowledge Edges table policies
CREATE POLICY "Anyone can view knowledge edges" ON knowledge_edges
    FOR SELECT USING (true);

CREATE POLICY "Service role can manage all knowledge edges" ON knowledge_edges
    FOR ALL USING (auth.role() = 'service_role');

-- Vector Search Cache table policies
CREATE POLICY "Service role can manage vector search cache" ON vector_search_cache
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can read vector search cache" ON vector_search_cache
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create helper functions for RLS
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
    SELECT COALESCE(
        (SELECT role FROM users WHERE id = auth.uid()::uuid),
        'anonymous'
    );
$$;

CREATE OR REPLACE FUNCTION auth.user_department()
RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
    SELECT COALESCE(
        (SELECT department FROM users WHERE id = auth.uid()::uuid),
        'unknown'
    );
$$;

-- Create indexes for RLS performance
CREATE INDEX idx_users_auth_id ON users(id) WHERE id = auth.uid()::uuid;
CREATE INDEX idx_user_progress_auth_user ON user_progress(user_id) WHERE user_id = auth.uid()::uuid;
CREATE INDEX idx_chat_messages_auth_user ON chat_messages(user_id) WHERE user_id = auth.uid()::uuid;
CREATE INDEX idx_recommendations_auth_user ON recommendations(user_id) WHERE user_id = auth.uid()::uuid;
CREATE INDEX idx_learning_analytics_auth_user ON learning_analytics(user_id) WHERE user_id = auth.uid()::uuid;
CREATE INDEX idx_query_embeddings_auth_user ON query_embeddings(user_id) WHERE user_id = auth.uid()::uuid;


