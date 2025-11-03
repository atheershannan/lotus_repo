// Corporate Learning Assistant - Database Connection Test
// Run this to verify your database setup is working

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  console.log('\n🧪 Testing Database Connection...\n');
  console.log('Database URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing');
  console.log('');

  try {
    // Test 1: Connect to database
    console.log('📡 Test 1: Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected successfully!\n');

    // Test 2: Check if core tables exist
    console.log('📊 Test 2: Checking core tables...');
    const coreTables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'skills', 'learning_content', 'user_progress')
      ORDER BY tablename;
    `;
    
    const expectedCoreTables = ['learning_content', 'skills', 'user_progress', 'users'];
    const foundCoreTables = coreTables.map(t => t.tablename);
    
    console.log('Expected core tables:', expectedCoreTables);
    console.log('Found tables:', foundCoreTables);
    
    if (foundCoreTables.length === expectedCoreTables.length) {
      console.log('✅ All core tables exist!\n');
    } else {
      console.log('⚠️  Some core tables missing!\n');
    }

    // Test 3: Check if vector tables exist
    console.log('🔍 Test 3: Checking vector tables...');
    const vectorTables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('document_embeddings', 'query_embeddings', 'skill_embeddings')
      ORDER BY tablename;
    `;
    
    const expectedVectorTables = ['document_embeddings', 'query_embeddings', 'skill_embeddings'];
    const foundVectorTables = vectorTables.map(t => t.tablename);
    
    console.log('Expected vector tables:', expectedVectorTables);
    console.log('Found tables:', foundVectorTables);
    
    if (foundVectorTables.length === expectedVectorTables.length) {
      console.log('✅ All vector tables exist!\n');
    } else {
      console.log('⚠️  Some vector tables missing!\n');
    }

    // Test 4: Check if pgvector extension is installed
    console.log('🔬 Test 4: Checking pgvector extension...');
    const extensions = await prisma.$queryRaw`
      SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
    `;
    
    if (extensions.length > 0) {
      console.log('✅ pgvector extension installed!');
      console.log('   Version:', extensions[0].extversion, '\n');
    } else {
      console.log('⚠️  pgvector extension not installed!\n');
      console.log('   Run: CREATE EXTENSION IF NOT EXISTS vector;\n');
    }

    // Test 5: Count records in key tables
    console.log('📈 Test 5: Checking table counts...');
    
    const userCount = await prisma.user.count();
    const skillCount = await prisma.skill.count();
    const contentCount = await prisma.learningContent.count();
    const embeddingCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM document_embeddings;
    `;
    
    console.log('   Users:', userCount);
    console.log('   Skills:', skillCount);
    console.log('   Learning Content:', contentCount);
    console.log('   Document Embeddings:', embeddingCount[0]?.count || 0);
    
    if (userCount === 0) {
      console.log('\n💡 Tip: No users found. Run seed script to add sample data.');
      console.log('   npm run db:seed or DATABASE/seed/sample_data.sql\n');
    } else {
      console.log('\n✅ Database has data!\n');
    }

    // Test 6: Check vector index
    console.log('🎯 Test 6: Checking vector indexes...');
    const vectorIndexes = await prisma.$queryRaw`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE '%vector%'
      LIMIT 3;
    `;
    
    if (vectorIndexes.length > 0) {
      console.log('✅ Vector indexes found:', vectorIndexes.length);
      console.log('   Examples:', vectorIndexes.map(i => i.indexname).join(', '), '\n');
    } else {
      console.log('⚠️  No vector indexes found!\n');
    }

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📋 SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log('✅ Connection: OK');
    console.log(`${coreTables.length}/${expectedCoreTables.length} core tables`);
    console.log(`${vectorTables.length}/${expectedVectorTables.length} vector tables`);
    console.log(`${extensions.length > 0 ? '✅' : '❌'} pgvector extension`);
    console.log(`${userCount > 0 ? '✅' : '⚠️ '} Data: ${userCount} users, ${skillCount} skills`);
    console.log('═══════════════════════════════════════\n');

    if (extensions.length === 0) {
      console.log('🔧 Next step: Install pgvector extension');
      console.log('   Run in SQL Editor: CREATE EXTENSION vector;\n');
    } else if (userCount === 0) {
      console.log('🔧 Next step: Add sample data');
      console.log('   Run: DATABASE/seed/sample_data.sql\n');
    } else {
      console.log('🎉 Database is ready to use!\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n🔍 Troubleshooting:');
    
    if (error.message.includes('connection')) {
      console.log('   - Check DATABASE_URL in .env file');
      console.log('   - Verify database is running');
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('   - Tables not created yet');
      console.log('   - Run: DATABASE/schema/01_core_tables.sql');
      console.log('   - Run: DATABASE/schema/02_vector_tables.sql');
    } else if (error.message.includes('extension "vector"')) {
      console.log('   - pgvector not installed');
      console.log('   - Run: CREATE EXTENSION vector;');
    }
    
    console.log('');
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database.\n');
  }
}

// Run the test
testConnection();

