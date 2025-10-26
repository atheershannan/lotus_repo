# Corporate Learning Assistant Database Schema

## Overview
This directory contains all database-related files for the Corporate Learning Assistant project using PostgreSQL with pgvector extension and Supabase.

## Structure
```
DATABASE/
├── schema/
│   ├── 01_core_tables.sql          # Core user and content tables
│   ├── 02_vector_tables.sql       # pgvector tables for embeddings
│   ├── 03_relationships.sql       # Foreign key relationships
│   ├── 04_indexes.sql             # Performance indexes
│   ├── 05_functions.sql           # Database functions
│   ├── 06_triggers.sql            # Database triggers
│   ├── 07_rls_policies.sql        # Row Level Security policies
│   └── 08_views.sql               # Database views
├── migrations/
│   ├── 001_initial_schema.sql     # Initial migration
│   ├── 002_add_vector_support.sql # Add pgvector support
│   └── 003_add_analytics.sql      # Add analytics tables
├── seed/
│   ├── users.sql                  # Sample users
│   ├── content.sql                # Sample learning content
│   ├── skills.sql                 # Sample skills
│   └── relationships.sql          # Sample relationships
├── functions/
│   ├── vector_search.sql          # Vector similarity search
│   ├── analytics.sql              # Learning analytics
│   ├── recommendations.sql        # Recommendation engine
│   └── content_search.sql         # Full-text search
├── config/
│   ├── supabase_config.sql        # Supabase configuration
│   ├── pgvector_setup.sql         # pgvector setup
│   └── rls_setup.sql              # RLS configuration
└── docs/
    ├── schema_documentation.md    # Schema documentation
    ├── api_reference.md           # Database API reference
    └── performance_guide.md       # Performance optimization guide
```

## Key Features
- **PostgreSQL with pgvector** for vector similarity search
- **Supabase integration** for authentication and real-time features
- **Row Level Security (RLS)** for data protection
- **Comprehensive analytics** functions
- **Recommendation engine** with machine learning
- **Full-text search** capabilities
- **Performance optimization** with proper indexing

## Setup Instructions
1. Create Supabase project
2. Enable pgvector extension
3. Run schema migrations
4. Configure RLS policies
5. Seed with sample data
6. Test database functions

## Technology Stack
- **Database**: PostgreSQL 15+
- **Vector Extension**: pgvector
- **Backend Service**: Supabase
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage


