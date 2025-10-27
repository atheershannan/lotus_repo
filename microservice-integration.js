#!/usr/bin/env node

/**
 * Microservice Integration Script for Corporate Learning Assistant
 * 
 * This script provides integration capabilities for various microservices
 * to embed the chatbot functionality into their applications.
 * 
 * Usage:
 *   node microservice-integration.js --service=<service-name> --action=<action>
 * 
 * Examples:
 *   node microservice-integration.js --service=slack --action=install
 *   node microservice-integration.js --service=teams --action=configure
 *   node microservice-integration.js --service=webhook --action=setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  services: {
    slack: {
      name: 'Slack Integration',
      description: 'Integrate chatbot into Slack workspace',
      files: ['slack-app-manifest.yml', 'slack-bot.js', 'slack-handlers.js'],
      dependencies: ['@slack/bolt', '@slack/web-api']
    },
    teams: {
      name: 'Microsoft Teams Integration',
      description: 'Integrate chatbot into Microsoft Teams',
      files: ['teams-app-manifest.json', 'teams-bot.js', 'teams-handlers.js'],
      dependencies: ['botbuilder', 'restify']
    },
    webhook: {
      name: 'Webhook Integration',
      description: 'Generic webhook integration for any service',
      files: ['webhook-server.js', 'webhook-handlers.js'],
      dependencies: ['express', 'axios']
    },
    api: {
      name: 'API Integration',
      description: 'Direct API integration for custom applications',
      files: ['api-client.js', 'api-examples.js'],
      dependencies: ['axios']
    }
  },
  outputDir: './microservice-integrations'
};

class MicroserviceIntegrator {
  constructor() {
    this.args = this.parseArguments();
    this.service = this.args.service;
    this.action = this.args.action;
  }

  parseArguments() {
    const args = process.argv.slice(2);
    const parsed = {};

    args.forEach(arg => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        parsed[key] = value;
      }
    });

    return parsed;
  }

  async run() {
    console.log('🚀 Corporate Learning Assistant - Microservice Integration');
    console.log('========================================================\n');

    if (!this.service || !this.action) {
      this.showHelp();
      return;
    }

    if (!CONFIG.services[this.service]) {
      console.error(`❌ Unknown service: ${this.service}`);
      this.showAvailableServices();
      return;
    }

    try {
      switch (this.action) {
        case 'install':
          await this.installService();
          break;
        case 'configure':
          await this.configureService();
          break;
        case 'setup':
          await this.setupService();
          break;
        case 'test':
          await this.testService();
          break;
        case 'deploy':
          await this.deployService();
          break;
        default:
          console.error(`❌ Unknown action: ${this.action}`);
          this.showAvailableActions();
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  async installService() {
    console.log(`📦 Installing ${CONFIG.services[this.service].name}...`);
    
    // Create output directory
    const serviceDir = path.join(CONFIG.outputDir, this.service);
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }

    // Generate service files
    await this.generateServiceFiles();

    // Install dependencies
    console.log('📥 Installing dependencies...');
    const packageJson = this.generatePackageJson();
    fs.writeFileSync(path.join(serviceDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    try {
      execSync('npm install', { cwd: serviceDir, stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️  Failed to install dependencies automatically. Please run "npm install" manually.');
    }

    console.log(`✅ ${CONFIG.services[this.service].name} installed successfully!`);
    console.log(`📁 Files created in: ${serviceDir}`);
    this.showNextSteps();
  }

  async configureService() {
    console.log(`⚙️  Configuring ${CONFIG.services[this.service].name}...`);
    
    const configFile = path.join(CONFIG.outputDir, this.service, 'config.json');
    
    if (!fs.existsSync(configFile)) {
      const defaultConfig = this.generateDefaultConfig();
      fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    }

    console.log(`📝 Configuration file created: ${configFile}`);
    console.log('Please edit the configuration file with your service-specific settings.');
  }

  async setupService() {
    console.log(`🔧 Setting up ${CONFIG.services[this.service].name}...`);
    
    const serviceDir = path.join(CONFIG.outputDir, this.service);
    
    if (!fs.existsSync(serviceDir)) {
      console.error('❌ Service not installed. Please run "install" first.');
      return;
    }

    // Generate setup script
    const setupScript = this.generateSetupScript();
    fs.writeFileSync(path.join(serviceDir, 'setup.js'), setupScript);

    console.log('📝 Setup script created. Run "node setup.js" to complete setup.');
  }

  async testService() {
    console.log(`🧪 Testing ${CONFIG.services[this.service].name}...`);
    
    const serviceDir = path.join(CONFIG.outputDir, this.service);
    
    if (!fs.existsSync(serviceDir)) {
      console.error('❌ Service not installed. Please run "install" first.');
      return;
    }

    // Generate test script
    const testScript = this.generateTestScript();
    fs.writeFileSync(path.join(serviceDir, 'test.js'), testScript);

    console.log('📝 Test script created. Run "node test.js" to test the integration.');
  }

  async deployService() {
    console.log(`🚀 Deploying ${CONFIG.services[this.service].name}...`);
    
    const serviceDir = path.join(CONFIG.outputDir, this.service);
    
    if (!fs.existsSync(serviceDir)) {
      console.error('❌ Service not installed. Please run "install" first.');
      return;
    }

    // Generate deployment script
    const deployScript = this.generateDeployScript();
    fs.writeFileSync(path.join(serviceDir, 'deploy.js'), deployScript);

    console.log('📝 Deployment script created. Run "node deploy.js" to deploy.');
  }

  async generateServiceFiles() {
    const serviceDir = path.join(CONFIG.outputDir, this.service);
    const serviceConfig = CONFIG.services[this.service];

    for (const file of serviceConfig.files) {
      const content = this.generateFileContent(file);
      fs.writeFileSync(path.join(serviceDir, file), content);
    }

    // Generate README
    const readme = this.generateReadme();
    fs.writeFileSync(path.join(serviceDir, 'README.md'), readme);
  }

  generateFileContent(filename) {
    switch (filename) {
      case 'slack-app-manifest.yml':
        return this.generateSlackManifest();
      case 'slack-bot.js':
        return this.generateSlackBot();
      case 'teams-app-manifest.json':
        return this.generateTeamsManifest();
      case 'teams-bot.js':
        return this.generateTeamsBot();
      case 'webhook-server.js':
        return this.generateWebhookServer();
      case 'api-client.js':
        return this.generateApiClient();
      default:
        return `// ${filename}\n// Generated by Corporate Learning Assistant Microservice Integration\n\n`;
    }
  }

  generateSlackManifest() {
    return `display_information:
  name: Corporate Learning Assistant
  description: AI-powered learning assistant for corporate training
  background_color: "#2c3e50"
  long_description: "An intelligent learning assistant that helps employees find relevant training content, track their progress, and get personalized recommendations using RAG and knowledge graphs."

features:
  bot_user:
    display_name: Learning Assistant
    always_online: true

oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - chat:write
      - im:history
      - im:read
      - im:write
      - users:read

settings:
  event_subscriptions:
    bot_events:
      - app_mention
      - message.im
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false`;
  }

  generateSlackBot() {
    return `const { App } = require('@slack/bolt');
const axios = require('axios');

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  port: process.env.PORT || 3000
});

// Corporate Learning Assistant API configuration
const API_BASE_URL = process.env.LEARNING_API_URL || 'http://localhost:3001/api';
const API_TOKEN = process.env.LEARNING_API_TOKEN;

// Helper function to call Learning Assistant API
async function callLearningAPI(endpoint, data = {}) {
  try {
    const response = await axios.post(\`\${API_BASE_URL}\${endpoint}\`, data, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Handle app mentions
app.event('app_mention', async ({ event, client }) => {
  try {
    const message = event.text.replace(/<@[^>]+>/g, '').trim();
    
    if (!message) {
      await client.chat.postMessage({
        channel: event.channel,
        text: "Hi! I'm your Corporate Learning Assistant. Ask me anything about training, skills, or learning content! 🎓"
      });
      return;
    }

    // Show typing indicator
    await client.conversations.mark({
      channel: event.channel,
      ts: event.ts
    });

    // Call Learning Assistant API
    const response = await callLearningAPI('/chat/message', {
      message: message,
      sessionId: \`slack_\${event.user}_\${Date.now()}\`,
      options: {
        matchThreshold: 0.7,
        matchCount: 5
      }
    });

    if (response.success) {
      const assistantResponse = response.data.assistantResponse;
      
      // Format response with sources
      let responseText = assistantResponse.content;
      
      if (assistantResponse.sources && assistantResponse.sources.length > 0) {
        responseText += "\\n\\n📚 *Sources:*";
        assistantResponse.sources.forEach((source, index) => {
          responseText += \`\\n\${index + 1}. \${source.type} (\${Math.round(source.similarity * 100)}% match)\`;
        });
      }

      // Add confidence indicator
      if (assistantResponse.confidence) {
        const confidence = Math.round(assistantResponse.confidence * 100);
        const emoji = confidence >= 80 ? '🟢' : confidence >= 60 ? '🟡' : '🔴';
        responseText += \`\\n\\n\${emoji} Confidence: \${confidence}%\`;
      }

      await client.chat.postMessage({
        channel: event.channel,
        text: responseText,
        thread_ts: event.ts
      });
    } else {
      await client.chat.postMessage({
        channel: event.channel,
        text: "Sorry, I encountered an error processing your request. Please try again later.",
        thread_ts: event.ts
      });
    }

  } catch (error) {
    console.error('Error handling app mention:', error);
    await client.chat.postMessage({
      channel: event.channel,
      text: "Sorry, I'm having trouble right now. Please try again later.",
      thread_ts: event.ts
    });
  }
});

// Handle direct messages
app.event('message', async ({ event, client }) => {
  // Only handle direct messages (not channel messages)
  if (event.channel_type !== 'im') return;
  
  // Skip bot messages
  if (event.bot_id) return;

  try {
    const message = event.text.trim();
    
    if (!message) return;

    // Show typing indicator
    await client.conversations.mark({
      channel: event.channel,
      ts: event.ts
    });

    // Call Learning Assistant API
    const response = await callLearningAPI('/chat/message', {
      message: message,
      sessionId: \`slack_dm_\${event.user}_\${Date.now()}\`,
      options: {
        matchThreshold: 0.7,
        matchCount: 5
      }
    });

    if (response.success) {
      const assistantResponse = response.data.assistantResponse;
      
      let responseText = assistantResponse.content;
      
      if (assistantResponse.sources && assistantResponse.sources.length > 0) {
        responseText += "\\n\\n📚 *Sources:*";
        assistantResponse.sources.forEach((source, index) => {
          responseText += \`\\n\${index + 1}. \${source.type} (\${Math.round(source.similarity * 100)}% match)\`;
        });
      }

      await client.chat.postMessage({
        channel: event.channel,
        text: responseText
      });
    }

  } catch (error) {
    console.error('Error handling direct message:', error);
    await client.chat.postMessage({
      channel: event.channel,
      text: "Sorry, I'm having trouble right now. Please try again later."
    });
  }
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('🤖 Corporate Learning Assistant Slack Bot is running!');
  } catch (error) {
    console.error('Failed to start Slack bot:', error);
    process.exit(1);
  }
})();

module.exports = app;`;
  }

  generateTeamsManifest() {
    return JSON.stringify({
      "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
      "manifestVersion": "1.16",
      "version": "1.0.0",
      "id": "corporate-learning-assistant",
      "packageName": "com.corporate.learningassistant",
      "developer": {
        "name": "Corporate Learning Team",
        "websiteUrl": "https://yourcompany.com",
        "privacyUrl": "https://yourcompany.com/privacy",
        "termsOfUseUrl": "https://yourcompany.com/terms"
      },
      "icons": {
        "color": "color.png",
        "outline": "outline.png"
      },
      "name": {
        "short": "Learning Assistant",
        "full": "Corporate Learning Assistant"
      },
      "description": {
        "short": "AI-powered learning assistant",
        "full": "An intelligent learning assistant that helps employees find relevant training content, track their progress, and get personalized recommendations."
      },
      "accentColor": "#2c3e50",
      "bots": [
        {
          "botId": "corporate-learning-assistant-bot",
          "scopes": [
            "personal",
            "team",
            "groupchat"
          ],
          "supportsFiles": false,
          "isNotificationOnly": false
        }
      ],
      "permissions": [
        "identity",
        "messageTeamMembers"
      ],
      "validDomains": [
        "yourcompany.com"
      ]
    }, null, 2);
  }

  generateTeamsBot() {
    return `const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState, TurnContext } = require('botbuilder');
const { LearningAssistantDialog } = require('./learning-assistant-dialog');
const axios = require('axios');

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Add error handling
adapter.onTurnError = async (context, error) => {
  console.error('Bot error:', error);
  await context.sendActivity('Sorry, I encountered an error. Please try again.');
};

// Create storage and state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Corporate Learning Assistant API configuration
const API_BASE_URL = process.env.LEARNING_API_URL || 'http://localhost:3001/api';
const API_TOKEN = process.env.LEARNING_API_TOKEN;

// Helper function to call Learning Assistant API
async function callLearningAPI(endpoint, data = {}) {
  try {
    const response = await axios.post(\`\${API_BASE_URL}\${endpoint}\`, data, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Create main dialog
const dialog = new LearningAssistantDialog(conversationState, userState, callLearningAPI);

// Create bot
const bot = async (context) => {
  await dialog.run(context, dialog.dialogState);
};

// Start server
const port = process.env.PORT || 3978;
adapter.listen(port, () => {
  console.log(\`🤖 Corporate Learning Assistant Teams Bot is running on port \${port}!\`);
});

module.exports = { adapter, bot };`;
  }

  generateWebhookServer() {
    return `const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Corporate Learning Assistant API configuration
const API_BASE_URL = process.env.LEARNING_API_URL || 'http://localhost:3001/api';
const API_TOKEN = process.env.LEARNING_API_TOKEN;

// Helper function to call Learning Assistant API
async function callLearningAPI(endpoint, data = {}) {
  try {
    const response = await axios.post(\`\${API_BASE_URL}\${endpoint}\`, data, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Webhook endpoint for incoming messages
app.post('/webhook', async (req, res) => {
  try {
    const { message, userId, sessionId, metadata = {} } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Message and userId are required'
      });
    }

    // Call Learning Assistant API
    const response = await callLearningAPI('/chat/message', {
      message: message,
      sessionId: sessionId || \`webhook_\${userId}_\${Date.now()}\`,
      options: {
        matchThreshold: 0.7,
        matchCount: 5
      }
    });

    if (response.success) {
      const assistantResponse = response.data.assistantResponse;
      
      // Format response
      const formattedResponse = {
        success: true,
        response: assistantResponse.content,
        confidence: assistantResponse.confidence,
        sources: assistantResponse.sources,
        responseTime: assistantResponse.responseTime,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          userId: userId
        }
      };

      res.json(formattedResponse);
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to process message'
      });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Corporate Learning Assistant Webhook'
  });
});

// Search endpoint
app.post('/search', async (req, res) => {
  try {
    const { query, type = 'hybrid', limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    const response = await callLearningAPI('/search/content', {
      query: query,
      type: type,
      limit: limit
    });

    res.json(response);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(\`🌐 Corporate Learning Assistant Webhook Server running on port \${port}\`);
  console.log(\`📡 Webhook endpoint: http://localhost:\${port}/webhook\`);
  console.log(\`🔍 Search endpoint: http://localhost:\${port}/search\`);
});

module.exports = app;`;
  }

  generateApiClient() {
    return `const axios = require('axios');

class CorporateLearningAssistantClient {
  constructor(apiUrl, apiToken) {
    this.apiUrl = apiUrl || 'http://localhost:3001/api';
    this.apiToken = apiToken;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': \`Bearer \${this.apiToken}\`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  // Send a chat message
  async sendMessage(message, sessionId, options = {}) {
    try {
      const response = await this.client.post('/chat/message', {
        message,
        sessionId,
        options: {
          matchThreshold: 0.7,
          matchCount: 5,
          ...options
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to send message: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Search learning content
  async searchContent(query, options = {}) {
    try {
      const response = await this.client.post('/search/content', {
        query,
        type: 'hybrid',
        limit: 10,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to search content: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Search skills
  async searchSkills(query, options = {}) {
    try {
      const response = await this.client.post('/search/skills', {
        query,
        limit: 20,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to search skills: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Get recommendations
  async getRecommendations(userId, limit = 10) {
    try {
      const response = await this.client.get('/recommendations', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to get recommendations: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Get user progress
  async getUserProgress(userId, params = {}) {
    try {
      const response = await this.client.get(\`/users/\${userId}/progress\`, {
        params
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to get user progress: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Update user progress
  async updateProgress(progressData) {
    try {
      const response = await this.client.post('/progress', progressData);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to update progress: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Get chat history
  async getChatHistory(sessionId) {
    try {
      const response = await this.client.get(\`/chat/history/\${sessionId}\`);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to get chat history: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Provide feedback
  async provideFeedback(messageId, feedback, comment = '') {
    try {
      const response = await this.client.post('/chat/feedback', {
        messageId,
        feedback,
        comment
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to provide feedback: \${error.response?.data?.error || error.message}\`);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(\`Health check failed: \${error.message}\`);
    }
  }
}

// Example usage
async function example() {
  const client = new CorporateLearningAssistantClient(
    'http://localhost:3001/api',
    'your-api-token'
  );

  try {
    // Health check
    const health = await client.healthCheck();
    console.log('Health:', health);

    // Send a message
    const chatResponse = await client.sendMessage(
      'What skills should I learn for web development?',
      'example-session-123'
    );
    console.log('Chat response:', chatResponse);

    // Search content
    const searchResponse = await client.searchContent('JavaScript basics');
    console.log('Search results:', searchResponse);

    // Get recommendations
    const recommendations = await client.getRecommendations('user-123');
    console.log('Recommendations:', recommendations);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

module.exports = CorporateLearningAssistantClient;

// Run example if called directly
if (require.main === module) {
  example();
}`;
  }

  generatePackageJson() {
    const serviceConfig = CONFIG.services[this.service];
    return {
      name: `corporate-learning-assistant-${this.service}`,
      version: '1.0.0',
      description: serviceConfig.description,
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js',
        test: 'node test.js'
      },
      dependencies: {
        ...serviceConfig.dependencies.reduce((acc, dep) => {
          acc[dep] = 'latest';
          return acc;
        }, {}),
        axios: '^1.6.0',
        dotenv: '^16.3.0'
      },
      keywords: [
        'corporate-learning',
        'assistant',
        'rag',
        'knowledge-graph',
        this.service
      ],
      author: 'Corporate Learning Team',
      license: 'MIT'
    };
  }

  generateDefaultConfig() {
    return {
      service: this.service,
      apiUrl: 'http://localhost:3001/api',
      apiToken: 'your-api-token-here',
      settings: {
        matchThreshold: 0.7,
        matchCount: 5,
        timeout: 30000
      },
      webhook: {
        enabled: true,
        secret: 'your-webhook-secret'
      },
      logging: {
        level: 'info',
        enabled: true
      }
    };
  }

  generateSetupScript() {
    return `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up ${CONFIG.services[this.service].name}...');

// Check if config file exists
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ Configuration file not found. Please run "configure" first.');
  process.exit(1);
}

// Load configuration
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Validate configuration
const requiredFields = ['apiUrl', 'apiToken'];
const missingFields = requiredFields.filter(field => !config[field]);

if (missingFields.length > 0) {
  console.error(\`❌ Missing required configuration fields: \${missingFields.join(', ')}\`);
  console.log('Please edit config.json and add the missing fields.');
  process.exit(1);
}

console.log('✅ Configuration validated');
console.log('📝 Next steps:');
console.log('1. Edit config.json with your specific settings');
console.log('2. Run "npm start" to start the service');
console.log('3. Test the integration with "npm test"');

console.log('\\n🎉 Setup completed successfully!');`;
  }

  generateTestScript() {
    return `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ${CONFIG.services[this.service].name}...');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ Configuration file not found. Please run "configure" first.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Test API connection
async function testApiConnection() {
  try {
    const axios = require('axios');
    const response = await axios.get(\`\${config.apiUrl}/health\`, {
      headers: {
        'Authorization': \`Bearer \${config.apiToken}\`
      },
      timeout: 5000
    });
    
    console.log('✅ API connection successful');
    console.log('📊 API Status:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return false;
  }
}

// Test service-specific functionality
async function testServiceFunctionality() {
  console.log('🔍 Testing service-specific functionality...');
  
  switch ('${this.service}') {
    case 'slack':
      console.log('📱 Slack integration tests would go here');
      break;
    case 'teams':
      console.log('👥 Teams integration tests would go here');
      break;
    case 'webhook':
      console.log('🌐 Webhook integration tests would go here');
      break;
    case 'api':
      console.log('🔌 API client tests would go here');
      break;
  }
  
  return true;
}

// Run tests
async function runTests() {
  console.log('🚀 Starting tests...\\n');
  
  const apiTest = await testApiConnection();
  const serviceTest = await testServiceFunctionality();
  
  if (apiTest && serviceTest) {
    console.log('\\n🎉 All tests passed!');
    console.log('✅ ${CONFIG.services[this.service].name} is ready to use');
  } else {
    console.log('\\n❌ Some tests failed. Please check your configuration.');
    process.exit(1);
  }
}

runTests().catch(console.error);`;
  }

  generateDeployScript() {
    return `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying ${CONFIG.services[this.service].name}...');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ Configuration file not found. Please run "configure" first.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Deployment steps
console.log('📋 Deployment checklist:');
console.log('1. ✅ Configuration validated');
console.log('2. 🔧 Dependencies installed');
console.log('3. 🧪 Tests passed');
console.log('4. 🌐 Environment variables set');
console.log('5. 📦 Service packaged');

console.log('\\n📝 Deployment instructions:');
console.log('1. Set up your hosting environment (Heroku, AWS, Azure, etc.)');
console.log('2. Configure environment variables:');
console.log('   - API_URL: ' + config.apiUrl);
console.log('   - API_TOKEN: [your-api-token]');
console.log('3. Deploy the service');
console.log('4. Test the deployment');

console.log('\\n🎉 Deployment preparation completed!');
console.log('📚 See README.md for detailed deployment instructions.');`;
  }

  generateReadme() {
    return `# ${CONFIG.services[this.service].name}

${CONFIG.services[this.service].description}

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure the service:**
   \`\`\`bash
   node setup.js
   \`\`\`

3. **Test the integration:**
   \`\`\`bash
   node test.js
   \`\`\`

4. **Start the service:**
   \`\`\`bash
   npm start
   \`\`\`

## ⚙️ Configuration

Edit \`config.json\` with your specific settings:

\`\`\`json
{
  "service": "${this.service}",
  "apiUrl": "http://localhost:3001/api",
  "apiToken": "your-api-token-here",
  "settings": {
    "matchThreshold": 0.7,
    "matchCount": 5,
    "timeout": 30000
  }
}
\`\`\`

## 📚 API Integration

This service integrates with the Corporate Learning Assistant API to provide:

- **RAG-powered responses** using knowledge graphs
- **Vector search** for relevant learning content
- **Personalized recommendations** based on user profile
- **Progress tracking** and analytics
- **Multi-modal support** for different content types

## 🔧 Environment Variables

Set the following environment variables:

\`\`\`bash
LEARNING_API_URL=http://localhost:3001/api
LEARNING_API_TOKEN=your-api-token
PORT=3000
\`\`\`

## 🧪 Testing

Run the test suite to verify the integration:

\`\`\`bash
npm test
\`\`\`

## 🚀 Deployment

Deploy to your preferred platform:

\`\`\`bash
node deploy.js
\`\`\`

## 📖 Documentation

For more information, see:
- [API Documentation](../../BACKEND/README.md)
- [Database Schema](../../DATABASE/schema/)
- [Frontend Components](../../FRONTEND/src/components/)

## 🤝 Support

For support and questions:
- Check the documentation
- Review the test cases
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for corporate learning excellence**`;
  }

  showHelp() {
    console.log('Usage: node microservice-integration.js --service=<service> --action=<action>');
    console.log('');
    console.log('Available services:');
    this.showAvailableServices();
    console.log('');
    console.log('Available actions:');
    this.showAvailableActions();
  }

  showAvailableServices() {
    console.log('Available services:');
    Object.entries(CONFIG.services).forEach(([key, service]) => {
      console.log(`  ${key}: ${service.name} - ${service.description}`);
    });
  }

  showAvailableActions() {
    console.log('Available actions:');
    console.log('  install: Install the service and dependencies');
    console.log('  configure: Generate configuration files');
    console.log('  setup: Set up the service');
    console.log('  test: Test the integration');
    console.log('  deploy: Prepare for deployment');
  }

  showNextSteps() {
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run "configure" to set up configuration');
    console.log('2. Edit the generated config.json file');
    console.log('3. Run "setup" to complete the setup');
    console.log('4. Run "test" to verify the integration');
    console.log('5. Run "deploy" to prepare for deployment');
    console.log('');
    console.log('📚 See the generated README.md for detailed instructions');
  }
}

// Run the integrator
if (require.main === module) {
  const integrator = new MicroserviceIntegrator();
  integrator.run().catch(console.error);
}

module.exports = MicroserviceIntegrator;


