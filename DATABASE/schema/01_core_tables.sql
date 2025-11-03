-- Corporate Learning Assistant Database Schema
-- Core Tables for Users, Content, and Learning Management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'learner',
    learning_profile JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50) DEFAULT 'beginner',
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Content table
CREATE TABLE learning_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'course', 'lesson', 'module', 'exercise', 'assessment'
    content_data JSONB DEFAULT '{}',
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    estimated_duration INTEGER, -- in minutes
    skills_covered JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE
);

-- User Progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    content_id UUID REFERENCES learning_content(id),
    skill_id UUID REFERENCES skills(id),
    progress_type VARCHAR(50) NOT NULL, -- 'content', 'skill', 'assessment'
    progress_data JSONB DEFAULT '{}',
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_id UUID NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    recommendation_type VARCHAR(50) NOT NULL, -- 'content', 'skill', 'path', 'peer'
    target_id UUID, -- ID of recommended content/skill/user
    target_type VARCHAR(50), -- 'content', 'skill', 'user'
    reason TEXT,
    confidence_score DECIMAL(3,2),
    metadata JSONB DEFAULT '{}',
    is_accepted BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Learning Analytics table
CREATE TABLE learning_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_data JSONB DEFAULT '{}',
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_level ON skills(level);

CREATE INDEX idx_content_type ON learning_content(content_type);
CREATE INDEX idx_content_difficulty ON learning_content(difficulty_level);
CREATE INDEX idx_content_published ON learning_content(is_published);
CREATE INDEX idx_content_created_by ON learning_content(created_by);

CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_content ON user_progress(content_id);
CREATE INDEX idx_progress_skill ON user_progress(skill_id);
CREATE INDEX idx_progress_status ON user_progress(status);
CREATE INDEX idx_progress_type ON user_progress(progress_type);

CREATE INDEX idx_chat_user ON chat_messages(user_id);
CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);

CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_type ON recommendations(recommendation_type);
CREATE INDEX idx_recommendations_target ON recommendations(target_id, target_type);

CREATE INDEX idx_analytics_user ON learning_analytics(user_id);
CREATE INDEX idx_analytics_metric ON learning_analytics(metric_name);
CREATE INDEX idx_analytics_period ON learning_analytics(period_start, period_end);


