/**
 * Generate Embeddings Script
 * Creates vector embeddings for all content in the database
 * This enables RAG (Retrieval-Augmented Generation) to work with your data
 */

const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to generate embedding
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
}

// Generate embeddings for users
async function generateUserEmbeddings() {
  console.log('\n📊 Generating embeddings for users...');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      department: true,
      role: true,
      learningProfile: true,
      preferences: true
    }
  });

  console.log(`Found ${users.length} users`);

  for (const user of users) {
    try {
      // Create a text representation of the user
      const userText = `
User: ${user.name}
Email: ${user.email}
Department: ${user.department}
Role: ${user.role}
Learning Profile: ${JSON.stringify(user.learningProfile)}
Preferences: ${JSON.stringify(user.preferences)}
      `.trim();

      console.log(`  Processing: ${user.name}...`);

      const embedding = await generateEmbedding(userText);

      // Store in document_embeddings table
      // First create without embedding (Prisma doesn't support vector type in client)
      const docEmbedding = await prisma.documentEmbedding.create({
        data: {
          // Don't set contentId for user embeddings - it's only for learning content relation
          contentType: 'user',
          contentText: userText,
          metadata: {
            userId: user.id,
            userName: user.name,
            department: user.department,
            role: user.role,
            type: 'user_profile'
          }
        }
      });

      // Then update with embedding using raw SQL
      await prisma.$executeRaw`
        UPDATE document_embeddings 
        SET embedding = ${`[${embedding.join(',')}]`}::vector
        WHERE id = ${docEmbedding.id}::uuid
      `;

      console.log(`  ✅ ${user.name}`);
    } catch (error) {
      console.error(`  ❌ Failed for ${user.name}:`, error.message);
    }
  }

  console.log('✅ User embeddings complete!\n');
}

// Generate embeddings for skills
async function generateSkillEmbeddings() {
  console.log('🎯 Generating embeddings for skills...');
  
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      level: true,
      prerequisites: true,
      learningObjectives: true
    }
  });

  console.log(`Found ${skills.length} skills`);

  for (const skill of skills) {
    try {
      // Create a text representation of the skill
      const skillText = `
Skill: ${skill.name}
Description: ${skill.description}
Category: ${skill.category}
Level: ${skill.level}
Prerequisites: ${JSON.stringify(skill.prerequisites)}
Learning Objectives: ${JSON.stringify(skill.learningObjectives)}
      `.trim();

      console.log(`  Processing: ${skill.name}...`);

      const embedding = await generateEmbedding(skillText);

      // Store in skill_embeddings table
      // First create without embedding (Prisma doesn't support vector type in client)
      const skillEmbedding = await prisma.skillEmbedding.create({
        data: {
          skillId: skill.id,
          skillText: skillText, // Required field that was missing!
          metadata: {
            skillName: skill.name,
            category: skill.category,
            level: skill.level,
            type: 'skill_definition'
          }
        }
      });

      // Then update with embedding using raw SQL
      await prisma.$executeRaw`
        UPDATE skill_embeddings 
        SET embedding = ${`[${embedding.join(',')}]`}::vector
        WHERE id = ${skillEmbedding.id}::uuid
      `;

      console.log(`  ✅ ${skill.name}`);
    } catch (error) {
      console.error(`  ❌ Failed for ${skill.name}:`, error.message);
    }
  }

  console.log('✅ Skill embeddings complete!\n');
}

// Generate embeddings for learning content
async function generateContentEmbeddings() {
  console.log('📚 Generating embeddings for learning content...');
  
  const contents = await prisma.learningContent.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      contentType: true,
      contentData: true,
      difficultyLevel: true,
      estimatedDuration: true,
      skillsCovered: true,
      prerequisites: true,
      learningObjectives: true
    }
  });

  console.log(`Found ${contents.length} content items`);

  for (const content of contents) {
    try {
      // Create a text representation of the content
      const contentText = `
Title: ${content.title}
Description: ${content.description}
Type: ${content.contentType}
Difficulty: ${content.difficultyLevel}
Duration: ${content.estimatedDuration} minutes
Skills Covered: ${JSON.stringify(content.skillsCovered)}
Prerequisites: ${JSON.stringify(content.prerequisites)}
Learning Objectives: ${JSON.stringify(content.learningObjectives)}
Content Details: ${JSON.stringify(content.contentData)}
      `.trim();

      console.log(`  Processing: ${content.title}...`);

      const embedding = await generateEmbedding(contentText);

      // Store in document_embeddings table
      // First create without embedding (Prisma doesn't support vector type in client)
      const docEmbedding = await prisma.documentEmbedding.create({
        data: {
          contentId: content.id,
          contentType: 'learning_content',
          contentText: contentText,
          metadata: {
            title: content.title,
            contentType: content.contentType,
            difficultyLevel: content.difficultyLevel,
            duration: content.estimatedDuration,
            type: 'course_material'
          }
        }
      });

      // Then update with embedding using raw SQL
      await prisma.$executeRaw`
        UPDATE document_embeddings 
        SET embedding = ${`[${embedding.join(',')}]`}::vector
        WHERE id = ${docEmbedding.id}::uuid
      `;

      console.log(`  ✅ ${content.title}`);
    } catch (error) {
      console.error(`  ❌ Failed for ${content.title}:`, error.message);
    }
  }

  console.log('✅ Content embeddings complete!\n');
}

// Generate embeddings for user progress
async function generateProgressEmbeddings() {
  console.log('📈 Generating embeddings for user progress...');
  
  const progressRecords = await prisma.userProgress.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      content: {
        select: {
          title: true
        }
      },
      skill: {
        select: {
          name: true
        }
      }
    }
  });

  console.log(`Found ${progressRecords.length} progress records`);

  for (const progress of progressRecords) {
    try {
      // Create a text representation of progress
      const progressText = `
User: ${progress.user.name}
Progress Type: ${progress.progressType}
Item: ${progress.content?.title || progress.skill?.name || 'N/A'}
Completion: ${progress.completionPercentage}%
Status: ${progress.status}
Started: ${progress.startedAt}
Last Accessed: ${progress.lastAccessedAt}
      `.trim();

      console.log(`  Processing progress for: ${progress.user.name}...`);

      const embedding = await generateEmbedding(progressText);

      // Store in document_embeddings table
      // First create without embedding (Prisma doesn't support vector type in client)
      const docEmbedding = await prisma.documentEmbedding.create({
        data: {
          // Don't set contentId for progress embeddings - it's only for learning content relation
          contentType: 'user_progress',
          contentText: progressText,
          metadata: {
            progressId: progress.id,
            userName: progress.user.name,
            progressType: progress.progressType,
            status: progress.status,
            completion: progress.completionPercentage,
            type: 'learning_progress'
          }
        }
      });

      // Then update with embedding using raw SQL
      await prisma.$executeRaw`
        UPDATE document_embeddings 
        SET embedding = ${`[${embedding.join(',')}]`}::vector
        WHERE id = ${docEmbedding.id}::uuid
      `;

      console.log(`  ✅ Progress for ${progress.user.name}`);
    } catch (error) {
      console.error(`  ❌ Failed for progress:`, error.message);
    }
  }

  console.log('✅ Progress embeddings complete!\n');
}

// Main function
async function main() {
  console.log('🚀 Starting Embedding Generation Process...\n');
  console.log('This will create vector embeddings for all your data.');
  console.log('This enables the chatbot to understand and search your database.\n');

  try {
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('❌ OPENAI_API_KEY environment variable is not set!');
    }

    console.log('✅ OpenAI API Key found\n');

    // Clear existing embeddings (optional - comment out if you want to keep old ones)
    console.log('🗑️  Clearing old embeddings...');
    try {
      await prisma.documentEmbedding.deleteMany({});
      await prisma.skillEmbedding.deleteMany({});
      console.log('✅ Old embeddings cleared\n');
    } catch (deleteError) {
      console.log('⚠️  Could not clear old embeddings (continuing anyway):', deleteError.message);
    }

    // Generate all embeddings
    await generateUserEmbeddings();
    await generateSkillEmbeddings();
    await generateContentEmbeddings();
    await generateProgressEmbeddings();

    // Summary
    const docCount = await prisma.documentEmbedding.count();
    const skillCount = await prisma.skillEmbedding.count();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 EMBEDDING GENERATION COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Total Document Embeddings: ${docCount}`);
    console.log(`🎯 Total Skill Embeddings: ${skillCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Your chatbot is now ready to use RAG with your data!');
    console.log('🤖 Try asking: "What is Jane Smith\'s department?"');
    console.log('🤖 Or: "What skills does John Doe have?"');
    console.log('🤖 Or: "Tell me about the JavaScript Basics Course"\n');

  } catch (error) {
    console.error('❌ Error during embedding generation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();

