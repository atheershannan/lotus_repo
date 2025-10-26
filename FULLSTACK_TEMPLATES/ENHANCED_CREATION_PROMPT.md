# 🧠 CURSOR FULLSTACK PROJECT TEMPLATE GENERATOR (Enhanced Creation Prompt)

You are an **AI Architect and Prompt Engineer** inside Cursor. Your mission: **create a comprehensive FULLSTACK_TEMPLATES folder** that serves as a complete, intelligent, and reusable template system for building full-stack projects from start to finish.

## 🎯 CRITICAL REQUIREMENTS

### 1️⃣ **Dynamic Question System**
- **MANDATORY**: Every stage MUST begin with a **Dynamic Question Phase**
- **Context-aware questions** that adapt based on previous stage outputs
- **Conditional follow-up questions** when inconsistencies are detected
- **Blocking mechanism** - Cursor MUST NOT proceed until all required answers are provided
- **Validation system** - Automatic consistency checks across all stages

### 2️⃣ **Complete Directory Structure**
Create this EXACT structure:
```
FULLSTACK_TEMPLATES/
├── README.md
├── HOW_TO_USE_TEMPLATES.md
├── 00_MASTER_WORKFLOW_GUIDE.md
├── ROADMAP.md
├── GLOBAL_CHECKLIST.md
├── GLOBAL_FALLBACKS.md
├── PROJECT_SUMMARY.md
├── Stage_01_Requirements_and_Planning/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── REQUIREMENTS_TEMPLATE.prompt
│   ├── USER_STORIES_TEMPLATE.prompt
│   ├── PSEUDOCODE_DIALOGUE.prompt
│   └── CHECKLIST.md
├── Stage_02_System_and_Architecture/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── ARCHITECTURE_TEMPLATE.prompt
│   ├── TECH_STACK_TEMPLATE.prompt
│   ├── ENDPOINTS_SPEC.md
│   ├── PSEUDOCODE_DIALOGUE.prompt
│   └── CHECKLIST.md
├── Stage_03_Project_Flow/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── FLOW_DIAGRAM_TEMPLATE.prompt
│   ├── INTERACTION_LOGIC_TEMPLATE.prompt
│   ├── PSEUDOCODE_DIALOGUE.prompt
│   └── CHECKLIST.md
├── Stage_04_Backend/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── API_DESIGN_TEMPLATE.prompt
│   ├── TDD_PLAN_TEMPLATE.prompt
│   ├── CODE_REVIEW_TEMPLATE.prompt
│   ├── IMPLEMENTATION_TEMPLATE.prompt
│   └── CHECKLIST.md
├── Stage_05_Frontend/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── UI_FLOW_TEMPLATE.prompt
│   ├── COMPONENT_STRUCTURE_TEMPLATE.prompt
│   ├── TDD_PLAN_TEMPLATE.prompt
│   ├── CODE_REVIEW_TEMPLATE.prompt
│   ├── IMPLEMENTATION_TEMPLATE.prompt
│   └── CHECKLIST.md
├── Stage_06_Database/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── DATA_MODEL_TEMPLATE.prompt
│   ├── SCHEMA_AND_RELATIONS_TEMPLATE.prompt
│   └── CHECKLIST.md
├── Stage_07_QA_and_Testing/
│   ├── 00_STAGE_OVERVIEW.prompt
│   ├── UNIT_TEST_PLAN_TEMPLATE.prompt
│   ├── INTEGRATION_TEST_PLAN_TEMPLATE.prompt
│   └── CHECKLIST.md
└── Stage_08_Deployment/
    ├── 00_STAGE_OVERVIEW.prompt
    ├── DEPLOYMENT_SCRIPT_TEMPLATE.prompt
    ├── GITHUB_ACTIONS_TEMPLATE.yml
    ├── CLOUD_CONFIG_TEMPLATE.prompt
    └── CHECKLIST.md
```

### 3️⃣ **Dynamic Question Phase Template**
Each stage overview MUST include this format:
```
## 🧬 Dynamic Question Phase

Before we start this stage, please answer the following:

### 1️⃣ [Context-specific question based on previous stages]
### 2️⃣ [Follow-up question depending on user's previous answers]
### 3️⃣ [Validation question if inconsistencies are detected]
### 4️⃣ [Additional context-aware questions]
### 5️⃣ [Final confirmation question]

> Cursor waits for all responses.
> If data are missing → auto-generate clarification prompts.
> If data conflict with earlier answers → summarize conflict and request correction.
> Once validated → proceed with generation.
```

### 4️⃣ **ENDPOINTS_SPEC.md System**
- **MANDATORY**: Create comprehensive API specification template
- **Dynamic generation** based on user requirements from Stage 1
- **Complete endpoint documentation** with request/response schemas
- **Authentication and authorization** specifications
- **Error handling and status codes**
- **Rate limiting and security considerations**

### 5️⃣ **ROADMAP.md System**
- **Auto-progress tracking** with timestamps
- **Stage unlocking** based on dependencies
- **Analytics and metrics** tracking
- **Reset mechanism** with confirmation prompts
- **Quality gates** and validation checkpoints

### 6️⃣ **TDD Integration**
- **Test-driven development** templates for backend and frontend
- **Comprehensive test plans** with coverage targets
- **Code review templates** with quality gates
- **Automated testing** integration with CI/CD

### 7️⃣ **GitHub Actions CI/CD**
- **Complete CI/CD pipeline** with 8+ jobs
- **Multi-stage deployment** (staging → production)
- **Security scanning** and vulnerability assessment
- **Performance testing** and monitoring
- **Rollback capabilities** and cleanup procedures

## 🧬 DYNAMIC QUESTION EXAMPLES

### Stage 1 (Requirements):
- "What is the name and type of your project?"
- "Who will use this application and what are their demographics?"
- "What are the main features you want to build?"
- "How will you measure success and what are your timeline constraints?"

### Stage 2 (Architecture):
- "What are your technology preferences and team constraints?"
- "What are your scalability and performance requirements?"
- "What security considerations and compliance requirements do you have?"
- "What external services or APIs do you need to integrate?"

### Stage 3 (Project Flow):
- "How do users navigate through your application?"
- "How does data move through your system?"
- "How will you manage application state?"
- "Do you need real-time functionality and how will conflicts be handled?"

## 🔄 WORKFLOW REQUIREMENTS

### Stage Progression Rules:
1. **Sequential unlocking** - Next stage only unlocks when previous is complete
2. **Dependency validation** - All prerequisites must be met
3. **Quality gates** - Each stage must pass quality checks
4. **Non-destructive operations** - No overwrites without confirmation
5. **Audit trails** - Complete decision tracking and version control

### Safety Features:
- **Backup creation** before major changes
- **Confirmation prompts** for destructive operations
- **Rollback support** to previous states
- **Data validation** and consistency checks
- **Error recovery** with comprehensive fallback procedures

## 📊 SUCCESS CRITERIA

### Must Have (Blocking):
- [ ] All 8 stages with dynamic question phases
- [ ] Complete ENDPOINTS_SPEC.md system
- [ ] ROADMAP.md with auto-progress tracking
- [ ] TDD integration with code review templates
- [ ] Complete GitHub Actions CI/CD pipeline
- [ ] Non-destructive workflow with safety measures

### Should Have (Important):
- [ ] Comprehensive documentation and usage guides
- [ ] Error recovery and fallback procedures
- [ ] Quality gates and validation checkpoints
- [ ] Analytics and metrics tracking

### Could Have (Nice to Have):
- [ ] Advanced customization options
- [ ] Integration with external tools
- [ ] Extended monitoring and alerting
- [ ] Additional deployment options

## 🚨 CRITICAL IMPLEMENTATION NOTES

1. **Start with Stage 1** - Create the complete directory structure first
2. **Implement dynamic questions** - Each stage must have intelligent question phases
3. **Create ENDPOINTS_SPEC.md** - This is crucial for API-driven development
4. **Build ROADMAP system** - Progress tracking and stage unlocking
5. **Add TDD templates** - Test-driven development integration
6. **Complete CI/CD pipeline** - Production-ready deployment automation
7. **Implement safety measures** - Non-destructive operations and error recovery

## 🎯 FINAL DELIVERABLE

Create a **complete, production-ready FULLSTACK_TEMPLATES folder** that:
- Guides developers from idea to deployment
- Provides intelligent, context-aware guidance
- Ensures quality and consistency throughout development
- Includes comprehensive testing and deployment automation
- Maintains safety and provides error recovery
- Tracks progress and provides analytics

**This template system should be the definitive solution for building full-stack projects with Cursor AI assistance.**

---

**Execute this prompt to create the complete FULLSTACK_TEMPLATES system! 🚀**
