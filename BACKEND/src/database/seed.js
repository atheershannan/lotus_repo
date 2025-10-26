const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read and execute SQL seed file
    const seedSqlPath = path.join(__dirname, '../../DATABASE/seed/sample_data.sql');
    
    if (fs.existsSync(seedSqlPath)) {
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      
      // Split SQL statements and execute them
      const statements = seedSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          await prisma.$executeRawUnsafe(statement);
        }
      }
      
      console.log('✅ Sample data seeded successfully');
    } else {
      console.log('⚠️  Sample data file not found, skipping...');
    }

    // Create additional seed data programmatically
    await createAdditionalSeedData();

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createAdditionalSeedData() {
  console.log('📊 Creating additional seed data...');

  // Create knowledge graph nodes
  const skills = await prisma.skill.findMany();
  const content = await prisma.learningContent.findMany();

  // Create knowledge nodes for skills
  for (const skill of skills) {
    await prisma.knowledgeNode.create({
      data: {
        nodeType: 'skill',
        nodeId: skill.id,
        nodeText: `${skill.name}: ${skill.description || ''}`,
        properties: {
          category: skill.category,
          level: skill.level,
          prerequisites: skill.prerequisites,
          learningObjectives: skill.learningObjectives
        }
      }
    });
  }

  // Create knowledge nodes for content
  for (const item of content) {
    await prisma.knowledgeNode.create({
      data: {
        nodeType: 'content',
        nodeId: item.id,
        nodeText: `${item.title}: ${item.description || ''}`,
        properties: {
          contentType: item.contentType,
          difficultyLevel: item.difficultyLevel,
          skillsCovered: item.skillsCovered,
          learningObjectives: item.learningObjectives
        }
      }
    });
  }

  // Create knowledge edges between related skills
  const skillNodes = await prisma.knowledgeNode.findMany({
    where: { nodeType: 'skill' }
  });

  for (let i = 0; i < skillNodes.length; i++) {
    for (let j = i + 1; j < skillNodes.length; j++) {
      const node1 = skillNodes[i];
      const node2 = skillNodes[j];
      
      // Create edges based on skill categories and levels
      if (node1.properties.category === node2.properties.category) {
        await prisma.knowledgeEdge.create({
          data: {
            sourceNodeId: node1.id,
            targetNodeId: node2.id,
            relationshipType: 'related',
            weight: 0.8,
            metadata: {
              reason: 'Same category',
              category: node1.properties.category
            }
          }
        });
      }
    }
  }

  console.log('✅ Additional seed data created');
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };


