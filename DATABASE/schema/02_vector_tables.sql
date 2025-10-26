-- Corporate Learning Assistant Database Schema
-- Vector Tables for pgvector Integration

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Document Embeddings table for RAG
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES learning_content(id),
    content_type VARCHAR(50) NOT NULL, -- 'course', 'lesson', 'module', 'exercise'
    content_text TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Query Embeddings table
CREATE TABLE query_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_id UUID NOT NULL,
    query_text TEXT NOT NULL,
    embedding VECTOR(1536),
    response_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Embeddings table
CREATE TABLE skill_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID NOT NULL REFERENCES skills(id),
    skill_text TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Graph Nodes table
CREATE TABLE knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_type VARCHAR(50) NOT NULL, -- 'concept', 'skill', 'content', 'user'
    node_id UUID NOT NULL, -- Reference to the actual entity
    node_text TEXT NOT NULL,
    embedding VECTOR(1536),
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Graph Edges table
CREATE TABLE knowledge_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id UUID NOT NULL REFERENCES knowledge_nodes(id),
    target_node_id UUID NOT NULL REFERENCES knowledge_nodes(id),
    relationship_type VARCHAR(100) NOT NULL, -- 'prerequisite', 'related', 'part_of', 'teaches'
    weight DECIMAL(3,2) DEFAULT 1.0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector Search Results Cache table
CREATE TABLE vector_search_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_hash VARCHAR(64) NOT NULL,
    query_embedding VECTOR(1536),
    search_results JSONB NOT NULL,
    result_count INTEGER NOT NULL,
    search_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Create indexes for vector operations
CREATE INDEX idx_document_embeddings_content ON document_embeddings(content_id);
CREATE INDEX idx_document_embeddings_type ON document_embeddings(content_type);
CREATE INDEX idx_document_embeddings_vector ON document_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_query_embeddings_user ON query_embeddings(user_id);
CREATE INDEX idx_query_embeddings_session ON query_embeddings(session_id);
CREATE INDEX idx_query_embeddings_vector ON query_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_skill_embeddings_skill ON skill_embeddings(skill_id);
CREATE INDEX idx_skill_embeddings_vector ON skill_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_knowledge_nodes_type ON knowledge_nodes(node_type);
CREATE INDEX idx_knowledge_nodes_node_id ON knowledge_nodes(node_id);
CREATE INDEX idx_knowledge_nodes_vector ON knowledge_nodes USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_knowledge_edges_source ON knowledge_edges(source_node_id);
CREATE INDEX idx_knowledge_edges_target ON knowledge_edges(target_node_id);
CREATE INDEX idx_knowledge_edges_relationship ON knowledge_edges(relationship_type);

CREATE INDEX idx_vector_cache_query_hash ON vector_search_cache(query_hash);
CREATE INDEX idx_vector_cache_expires ON vector_search_cache(expires_at);

-- Create composite indexes for common queries
CREATE INDEX idx_document_embeddings_content_type ON document_embeddings(content_id, content_type);
CREATE INDEX idx_query_embeddings_user_session ON query_embeddings(user_id, session_id);
CREATE INDEX idx_knowledge_edges_source_target ON knowledge_edges(source_node_id, target_node_id);
