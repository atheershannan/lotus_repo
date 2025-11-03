-- Corporate Learning Assistant Seed Data
-- Sample data for development and testing

-- Insert sample users
INSERT INTO users (id, email, name, department, role, learning_profile, preferences) VALUES
-- Demo user for public chatbot (no authentication required)
('00000000-0000-0000-0000-000000000001', 'demo@company.com', 'Demo User', 'General', 'learner',
 '{"skills": [], "interests": ["learning"], "learning_style": "visual"}',
 '{"notifications": false, "theme": "light", "language": "en"}'),

('550e8400-e29b-41d4-a716-446655440001', 'john.doe@company.com', 'John Doe', 'Engineering', 'learner', 
 '{"skills": ["javascript", "react", "nodejs"], "interests": ["web development", "machine learning"], "learning_style": "visual"}',
 '{"notifications": true, "theme": "light", "language": "en"}'),
 
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@company.com', 'Jane Smith', 'HR', 'hr_manager',
 '{"skills": ["leadership", "communication", "project management"], "interests": ["employee development", "training"], "learning_style": "auditory"}',
 '{"notifications": true, "theme": "dark", "language": "en"}'),
 
('550e8400-e29b-41d4-a716-446655440003', 'mike.trainer@company.com', 'Mike Trainer', 'Training', 'trainer',
 '{"skills": ["instructional design", "facilitation", "assessment"], "interests": ["learning technology", "curriculum development"], "learning_style": "kinesthetic"}',
 '{"notifications": true, "theme": "light", "language": "en"}'),
 
('550e8400-e29b-41d4-a716-446655440004', 'admin@company.com', 'System Admin', 'IT', 'admin',
 '{"skills": ["system administration", "security", "database management"], "interests": ["infrastructure", "automation"], "learning_style": "visual"}',
 '{"notifications": true, "theme": "light", "language": "en"}');

-- Insert sample skills
INSERT INTO skills (id, name, description, category, level, prerequisites, learning_objectives) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'JavaScript Fundamentals', 'Core JavaScript programming concepts', 'Programming', 'beginner',
 '[]',
 '["Understand variables and data types", "Master functions and scope", "Learn DOM manipulation"]'),
 
('660e8400-e29b-41d4-a716-446655440002', 'React Development', 'Building user interfaces with React', 'Programming', 'intermediate',
 '["JavaScript Fundamentals"]',
 '["Create React components", "Manage state and props", "Handle events and forms"]'),
 
('660e8400-e29b-41d4-a716-446655440003', 'Node.js Backend', 'Server-side JavaScript development', 'Programming', 'intermediate',
 '["JavaScript Fundamentals"]',
 '["Build REST APIs", "Handle HTTP requests", "Work with databases"]'),
 
('660e8400-e29b-41d4-a716-446655440004', 'Leadership Skills', 'Essential leadership and management skills', 'Soft Skills', 'intermediate',
 '["Communication Skills"]',
 '["Lead teams effectively", "Make strategic decisions", "Motivate and inspire others"]'),
 
('660e8400-e29b-41d4-a716-446655440005', 'Project Management', 'Planning and executing projects successfully', 'Management', 'intermediate',
 '["Leadership Skills"]',
 '["Create project plans", "Manage resources", "Track progress and deliverables"]'),
 
('660e8400-e29b-41d4-a716-446655440006', 'Machine Learning Basics', 'Introduction to ML concepts and algorithms', 'Data Science', 'beginner',
 '["Python Programming", "Statistics"]',
 '["Understand ML algorithms", "Build predictive models", "Evaluate model performance"]');

-- Insert sample learning content
INSERT INTO learning_content (id, title, description, content_type, content_data, difficulty_level, estimated_duration, skills_covered, prerequisites, learning_objectives, created_by, is_published) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'JavaScript Basics Course', 'Complete introduction to JavaScript programming', 'course',
 '{"modules": ["Variables and Data Types", "Functions and Scope", "Objects and Arrays", "DOM Manipulation"], "resources": ["video_lectures", "coding_exercises", "quizzes"]}',
 'beginner', 480,
 '["JavaScript Fundamentals"]',
 '[]',
 '["Master JavaScript syntax", "Build interactive web pages", "Understand programming fundamentals"]',
 '550e8400-e29b-41d4-a716-446655440003', true),
 
('770e8400-e29b-41d4-a716-446655440002', 'React Component Development', 'Building reusable React components', 'lesson',
 '{"content": "Learn how to create and manage React components", "examples": ["Button component", "Form component", "Card component"]}',
 'intermediate', 120,
 '["React Development"]',
 '["JavaScript Fundamentals"]',
 '["Create functional components", "Use hooks effectively", "Implement component composition"]',
 '550e8400-e29b-41d4-a716-446655440003', true),
 
('770e8400-e29b-41d4-a716-446655440003', 'Node.js API Development', 'Building RESTful APIs with Node.js', 'course',
 '{"modules": ["Express.js Setup", "Route Handling", "Middleware", "Database Integration"], "resources": ["video_tutorials", "code_examples", "api_documentation"]}',
 'intermediate', 360,
 '["Node.js Backend"]',
 '["JavaScript Fundamentals"]',
 '["Build scalable APIs", "Handle authentication", "Integrate with databases"]',
 '550e8400-e29b-41d4-a716-446655440003', true),
 
('770e8400-e29b-41d4-a716-446655440004', 'Leadership Workshop', 'Interactive workshop on leadership principles', 'workshop',
 '{"format": "interactive", "activities": ["case_studies", "role_playing", "group_discussions"], "duration": "2 days"}',
 'intermediate', 960,
 '["Leadership Skills"]',
 '["Communication Skills"]',
 '["Develop leadership style", "Practice decision making", "Build team relationships"]',
 '550e8400-e29b-41d4-a716-446655440003', true),
 
('770e8400-e29b-41d4-a716-446655440005', 'Project Management Fundamentals', 'Essential project management concepts and tools', 'course',
 '{"modules": ["Project Planning", "Resource Management", "Risk Assessment", "Quality Control"], "tools": ["Gantt charts", "Risk matrices", "Status reports"]}',
 'intermediate', 240,
 '["Project Management"]',
 '["Leadership Skills"]',
 '["Plan projects effectively", "Manage resources", "Track progress"]',
 '550e8400-e29b-41d4-a716-446655440003', true),
 
('770e8400-e29b-41d4-a716-446655440006', 'Introduction to Machine Learning', 'Basic concepts and applications of ML', 'course',
 '{"modules": ["ML Concepts", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"], "labs": ["Linear regression", "Classification", "Clustering"]}',
 'beginner', 300,
 '["Machine Learning Basics"]',
 '["Python Programming", "Statistics"]',
 '["Understand ML concepts", "Build simple models", "Evaluate performance"]',
 '550e8400-e29b-41d4-a716-446655440003', true);

-- Insert sample user progress
-- For content progress (use content_id)
INSERT INTO user_progress (user_id, content_id, skill_id, progress_type, completion_percentage, status, started_at, last_accessed_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', NULL, 'content', 75.0, 'in_progress', '2024-01-15 09:00:00', '2024-01-20 14:30:00'),
('550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', NULL, 'content', 100.0, 'completed', '2024-01-10 10:00:00', '2024-01-18 16:45:00'),
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440004', NULL, 'content', 60.0, 'in_progress', '2024-01-14 13:00:00', '2024-01-21 10:15:00'),
('550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', NULL, 'content', 100.0, 'completed', '2024-01-05 14:30:00', '2024-01-16 12:00:00');

-- For skill progress (use skill_id)
INSERT INTO user_progress (user_id, content_id, skill_id, progress_type, completion_percentage, status, started_at, last_accessed_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', NULL, '660e8400-e29b-41d4-a716-446655440001', 'skill', 80.0, 'in_progress', '2024-01-12 08:30:00', '2024-01-19 11:20:00'),
('550e8400-e29b-41d4-a716-446655440001', NULL, '660e8400-e29b-41d4-a716-446655440002', 'skill', 100.0, 'completed', '2024-01-08 09:15:00', '2024-01-17 15:30:00'),
('550e8400-e29b-41d4-a716-446655440002', NULL, '660e8400-e29b-41d4-a716-446655440004', 'skill', 90.0, 'in_progress', '2024-01-11 11:45:00', '2024-01-20 09:30:00'),
('550e8400-e29b-41d4-a716-446655440002', NULL, '660e8400-e29b-41d4-a716-446655440005', 'skill', 100.0, 'completed', '2024-01-03 15:20:00', '2024-01-15 14:45:00');

-- Insert sample chat messages
INSERT INTO chat_messages (user_id, session_id, message_type, content, confidence_score, response_time_ms) VALUES
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'user', 'What JavaScript concepts should I focus on next?', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'assistant', 'Based on your progress in JavaScript Fundamentals, I recommend focusing on: 1) Async programming with Promises and async/await, 2) ES6+ features like destructuring and arrow functions, 3) Error handling and debugging techniques. These will prepare you well for React development.', 0.92, 1250),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'user', 'Can you recommend some practice exercises?', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'assistant', 'Here are some great practice exercises: 1) Build a todo list with local storage, 2) Create a weather app using an API, 3) Implement a simple calculator with error handling, 4) Build a quiz application with timer functionality. These projects will help you apply the concepts you''ve learned.', 0.88, 980),
('550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'user', 'How can I improve my team''s learning culture?', NULL, NULL),
('550e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'assistant', 'To improve your team''s learning culture, consider: 1) Lead by example - share your own learning journey, 2) Create learning time - allocate dedicated time for skill development, 3) Encourage knowledge sharing - organize lunch-and-learn sessions, 4) Recognize learning achievements - celebrate milestones and certifications, 5) Provide resources - ensure access to learning materials and tools.', 0.95, 1100);

-- Insert sample recommendations
INSERT INTO recommendations (user_id, recommendation_type, target_id, target_type, reason, confidence_score, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'content', '770e8400-e29b-41d4-a716-446655440003', 'content', 'Based on your JavaScript and React skills, Node.js would be a natural next step', 0.85, '{"skill_gap": "backend_development", "learning_path": "full_stack"}'),
('550e8400-e29b-41d4-a716-446655440001', 'skill', '660e8400-e29b-41d4-a716-446655440003', 'skill', 'Your JavaScript skills make you ready for Node.js backend development', 0.90, '{"prerequisites_met": true, "skill_level": "intermediate"}'),
('550e8400-e29b-41d4-a716-446655440002', 'content', '770e8400-e29b-41d4-a716-446655440005', 'content', 'Complete your project management knowledge with this comprehensive course', 0.80, '{"completion_rate": 0.6, "relevance": "high"}'),
('550e8400-e29b-41d4-a716-446655440002', 'skill', '660e8400-e29b-41d4-a716-446655440006', 'skill', 'Expand your skillset with machine learning basics', 0.75, '{"trending_skill": true, "future_relevance": "high"}');

-- Insert sample learning analytics
INSERT INTO learning_analytics (user_id, metric_name, metric_value, metric_data, period_start, period_end) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'learning_time_minutes', 1200.0, '{"breakdown": {"javascript": 600, "react": 400, "other": 200}}', '2024-01-01 00:00:00', '2024-01-31 23:59:59'),
('550e8400-e29b-41d4-a716-446655440001', 'completion_rate', 0.75, '{"completed_courses": 2, "total_courses": 3, "in_progress": 1}', '2024-01-01 00:00:00', '2024-01-31 23:59:59'),
('550e8400-e29b-41d4-a716-446655440001', 'skill_progress', 0.80, '{"skills_completed": 1, "skills_in_progress": 1, "total_skills": 2}', '2024-01-01 00:00:00', '2024-01-31 23:59:59'),
('550e8400-e29b-41d4-a716-446655440002', 'learning_time_minutes', 1800.0, '{"breakdown": {"leadership": 800, "project_management": 600, "other": 400}}', '2024-01-01 00:00:00', '2024-01-31 23:59:59'),
('550e8400-e29b-41d4-a716-446655440002', 'completion_rate', 0.60, '{"completed_courses": 1, "total_courses": 2, "in_progress": 1}', '2024-01-01 00:00:00', '2024-01-31 23:59:59'),
('550e8400-e29b-41d4-a716-446655440002', 'skill_progress', 0.90, '{"skills_completed": 1, "skills_in_progress": 1, "total_skills": 2}', '2024-01-01 00:00:00', '2024-01-31 23:59:59');


