-- Add Demo User for Public Chatbot
-- This user is used for unauthenticated chat requests
-- UUID: 00000000-0000-0000-0000-000000000001

-- Check if demo user already exists
DO $$
BEGIN
    -- Delete if exists (for re-running)
    DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';
    
    -- Insert demo user
    INSERT INTO users (id, email, name, department, role, learning_profile, preferences, is_active, created_at, updated_at, last_active_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 
     'demo@company.com', 
     'Demo User', 
     'General', 
     'learner',
     '{"skills": [], "interests": ["learning"], "learning_style": "visual"}',
     '{"notifications": false, "theme": "light", "language": "en"}',
     true,
     NOW(),
     NOW(),
     NOW());
    
    RAISE NOTICE 'Demo user created successfully with ID: 00000000-0000-0000-0000-000000000001';
END $$;

-- Verify the user was created
SELECT id, email, name, department, role FROM users WHERE id = '00000000-0000-0000-0000-000000000001';

