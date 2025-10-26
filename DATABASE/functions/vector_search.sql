-- Corporate Learning Assistant Database Functions
-- Vector Search and RAG Functions

-- Function: Vector similarity search for RAG queries
CREATE OR REPLACE FUNCTION match_documents (
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    content_id UUID,
    content_type VARCHAR(50),
    content_text TEXT,
    similarity FLOAT,
    metadata JSONB
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        de.id,
        de.content_id,
        de.content_type,
        de.content_text,
        1 - (de.embedding <=> query_embedding) AS similarity,
        de.metadata
    FROM document_embeddings de
    WHERE 1 - (de.embedding <=> query_embedding) > match_threshold
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Function: Get user learning analytics
CREATE OR REPLACE FUNCTION get_user_learning_analytics(user_id_param TEXT)
RETURNS TABLE (
    total_skills INTEGER,
    completed_skills INTEGER,
    total_courses INTEGER,
    completed_courses INTEGER,
    total_progress FLOAT,
    recent_activity JSONB,
    skill_distribution JSONB,
    learning_velocity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    WITH user_stats AS (
        SELECT 
            COUNT(DISTINCT up.skill_id) as total_skills,
            COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.skill_id END) as completed_skills,
            COUNT(DISTINCT up.content_id) as total_courses,
            COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.content_id END) as completed_courses,
            AVG(up.completion_percentage) as total_progress
        FROM user_progress up
        WHERE up.user_id = user_id_param::UUID
    ),
    recent_activity AS (
        SELECT jsonb_agg(
            jsonb_build_object(
                'type', up.progress_type,
                'content_id', up.content_id,
                'skill_id', up.skill_id,
                'status', up.status,
                'completion_percentage', up.completion_percentage,
                'last_accessed_at', up.last_accessed_at
            )
        ) as activity_data
        FROM user_progress up
        WHERE up.user_id = user_id_param::UUID
        AND up.last_accessed_at > NOW() - INTERVAL '7 days'
        ORDER BY up.last_accessed_at DESC
        LIMIT 10
    ),
    skill_distribution AS (
        SELECT jsonb_agg(
            jsonb_build_object(
                'skill_id', s.id,
                'skill_name', s.name,
                'category', s.category,
                'level', s.level,
                'progress', COALESCE(up.completion_percentage, 0)
            )
        ) as skill_data
        FROM skills s
        LEFT JOIN user_progress up ON s.id = up.skill_id AND up.user_id = user_id_param::UUID
        WHERE up.user_id = user_id_param::UUID OR up.user_id IS NULL
    ),
    learning_velocity AS (
        SELECT COALESCE(
            AVG(up.completion_percentage / 
                EXTRACT(EPOCH FROM (up.completed_at - up.started_at)) / 3600
            ), 0
        ) as velocity
        FROM user_progress up
        WHERE up.user_id = user_id_param::UUID
        AND up.status = 'completed'
        AND up.completed_at IS NOT NULL
        AND up.started_at IS NOT NULL
    )
    SELECT 
        us.total_skills,
        us.completed_skills,
        us.total_courses,
        us.completed_courses,
        us.total_progress,
        ra.activity_data,
        sd.skill_data,
        lv.velocity
    FROM user_stats us, recent_activity ra, skill_distribution sd, learning_velocity lv;
$$;

-- Function: Generate personalized recommendations
CREATE OR REPLACE FUNCTION generate_recommendations(
    user_id_param TEXT,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    recommendation_type VARCHAR(50),
    target_id UUID,
    target_type VARCHAR(50),
    reason TEXT,
    confidence_score DECIMAL(3,2),
    metadata JSONB
)
LANGUAGE SQL STABLE
AS $$
    WITH user_skills AS (
        SELECT DISTINCT s.id, s.category, s.level
        FROM skills s
        JOIN user_progress up ON s.id = up.skill_id
        WHERE up.user_id = user_id_param::UUID
        AND up.status IN ('completed', 'in_progress')
    ),
    user_content AS (
        SELECT DISTINCT lc.id, lc.content_type, lc.difficulty_level
        FROM learning_content lc
        JOIN user_progress up ON lc.id = up.content_id
        WHERE up.user_id = user_id_param::UUID
        AND up.status IN ('completed', 'in_progress')
    ),
    skill_based_recommendations AS (
        SELECT 
            uuid_generate_v4() as id,
            'skill' as recommendation_type,
            s.id as target_id,
            'skill' as target_type,
            'Based on your completed skills in ' || s.category as reason,
            0.8 as confidence_score,
            jsonb_build_object(
                'skill_category', s.category,
                'skill_level', s.level,
                'prerequisites', s.prerequisites
            ) as metadata
        FROM skills s
        WHERE s.category IN (SELECT category FROM user_skills)
        AND s.level IN (SELECT level FROM user_skills)
        AND s.id NOT IN (SELECT id FROM user_skills)
        LIMIT limit_count / 2
    ),
    content_based_recommendations AS (
        SELECT 
            uuid_generate_v4() as id,
            'content' as recommendation_type,
            lc.id as target_id,
            'content' as target_type,
            'Recommended based on your learning history' as reason,
            0.7 as confidence_score,
            jsonb_build_object(
                'content_type', lc.content_type,
                'difficulty_level', lc.difficulty_level,
                'estimated_duration', lc.estimated_duration,
                'skills_covered', lc.skills_covered
            ) as metadata
        FROM learning_content lc
        WHERE lc.content_type IN (SELECT content_type FROM user_content)
        AND lc.difficulty_level IN (SELECT difficulty_level FROM user_content)
        AND lc.id NOT IN (SELECT id FROM user_content)
        AND lc.is_published = true
        LIMIT limit_count / 2
    )
    SELECT * FROM skill_based_recommendations
    UNION ALL
    SELECT * FROM content_based_recommendations
    ORDER BY confidence_score DESC
    LIMIT limit_count;
$$;

-- Function: Full-text search across learning content
CREATE OR REPLACE FUNCTION search_learning_content(
    search_query TEXT,
    content_types TEXT[] DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    description TEXT,
    content_type VARCHAR(50),
    difficulty_level VARCHAR(50),
    estimated_duration INTEGER,
    skills_covered JSONB,
    relevance_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        lc.id,
        lc.title,
        lc.description,
        lc.content_type,
        lc.difficulty_level,
        lc.estimated_duration,
        lc.skills_covered,
        ts_rank(
            to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')),
            plainto_tsquery('english', search_query)
        ) as relevance_score,
        lc.created_at
    FROM learning_content lc
    WHERE (
        content_types IS NULL OR lc.content_type = ANY(content_types)
    )
    AND lc.is_published = true
    AND (
        to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')) @@ 
        plainto_tsquery('english', search_query)
    )
    ORDER BY relevance_score DESC
    LIMIT limit_count;
$$;

-- Function: Get knowledge graph connections
CREATE OR REPLACE FUNCTION get_knowledge_connections(
    node_id_param TEXT,
    relationship_types TEXT[] DEFAULT NULL,
    max_depth INTEGER DEFAULT 2
)
RETURNS TABLE (
    source_id UUID,
    target_id UUID,
    relationship_type VARCHAR(100),
    weight DECIMAL(3,2),
    depth INTEGER,
    path JSONB
)
LANGUAGE SQL STABLE
AS $$
    WITH RECURSIVE knowledge_paths AS (
        -- Base case: direct connections
        SELECT 
            ke.source_node_id as source_id,
            ke.target_node_id as target_id,
            ke.relationship_type,
            ke.weight,
            1 as depth,
            jsonb_build_array(ke.source_node_id, ke.target_node_id) as path
        FROM knowledge_edges ke
        WHERE ke.source_node_id = node_id_param::UUID
        AND (relationship_types IS NULL OR ke.relationship_type = ANY(relationship_types))
        
        UNION ALL
        
        -- Recursive case: indirect connections
        SELECT 
            kp.source_id,
            ke.target_node_id as target_id,
            ke.relationship_type,
            ke.weight,
            kp.depth + 1,
            kp.path || ke.target_node_id
        FROM knowledge_paths kp
        JOIN knowledge_edges ke ON kp.target_id = ke.source_node_id
        WHERE kp.depth < max_depth
        AND NOT (ke.target_node_id = ANY(kp.path)) -- Avoid cycles
        AND (relationship_types IS NULL OR ke.relationship_type = ANY(relationship_types))
    )
    SELECT DISTINCT * FROM knowledge_paths
    ORDER BY depth, weight DESC;
$$;

-- Function: Update user progress
CREATE OR REPLACE FUNCTION update_user_progress(
    user_id_param TEXT,
    content_id_param TEXT,
    progress_percentage DECIMAL(5,2),
    status_param TEXT DEFAULT 'in_progress'
)
RETURNS UUID
LANGUAGE SQL
AS $$
    INSERT INTO user_progress (
        user_id,
        content_id,
        progress_type,
        completion_percentage,
        status,
        started_at,
        last_accessed_at
    )
    VALUES (
        user_id_param::UUID,
        content_id_param::UUID,
        'content',
        progress_percentage,
        status_param,
        CASE WHEN status_param = 'in_progress' AND NOT EXISTS (
            SELECT 1 FROM user_progress 
            WHERE user_id = user_id_param::UUID 
            AND content_id = content_id_param::UUID
        ) THEN NOW() ELSE NULL END,
        NOW()
    )
    ON CONFLICT (user_id, content_id, progress_type) 
    DO UPDATE SET
        completion_percentage = EXCLUDED.completion_percentage,
        status = EXCLUDED.status,
        completed_at = CASE WHEN EXCLUDED.status = 'completed' THEN NOW() ELSE user_progress.completed_at END,
        last_accessed_at = NOW(),
        updated_at = NOW()
    RETURNING id;
$$;


