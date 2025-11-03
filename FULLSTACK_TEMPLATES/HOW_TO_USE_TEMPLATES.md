# 📖 HOW TO USE THESE TEMPLATES

> **Complete guide for navigating and using the Fullstack Templates system**

---

## 🎯 Introduction

This template system helps you build full-stack applications with a disciplined, TDD-driven approach. Follow this guide to maximize its effectiveness.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Access to Cursor AI
- ✅ A GitHub account (for CI/CD)
- ✅ Basic knowledge of the tech stack you'll use
- ✅ A clear project idea (or willing to define one)

---

## 🚦 Getting Started

### Step 1: Initial Setup

1. **Review** `README.md` - Understand the overall structure
2. **Open** `ROADMAP.md` - This tracks your progress
3. **Read** `GLOBAL_CHECKLIST.md` - Master checklist reference

### Step 2: Start Stage 01

Navigate to `Stage_01_Requirements_and_Planning/`

```bash
cd Stage_01_Requirements_and_Planning
```

### Step 3: Answer Entry Questions

Every stage begins with entry questions. **Answer them honestly and thoroughly** - they shape all generated content.

---

## 🔄 Using Each Stage

### Standard Stage Workflow

1. **Entry Questionnaire**
   - Read all questions carefully
   - Answer completely and thoughtfully
   - Provide context, not just yes/no answers

2. **Template Generation**
   - Cursor will generate content based on your answers
   - Review all generated files
   - Request modifications if needed

3. **Complete Checklist**
   - Open the stage's `CHECKLIST.md`
   - Mark items complete as you go
   - All items must be ✅ before moving forward

4. **Sign Off**
   - Document decisions in `ROADMAP.md`
   - Save checkpoints
   - Proceed to next stage

---

## 📂 Stage Details

### **Stage 01: Requirements & Planning**
- Define project scope
- Create user stories
- Establish acceptance criteria
- ⏱️ Estimated time: 2-3 hours

### **Stage 02: System & Architecture**
- Choose tech stack
- Design system architecture
- Define endpoints (`ENDPOINTS_SPEC.md`)
- ⏱️ Estimated time: 3-4 hours

### **Stage 03: Project Flow**
- Create flow diagrams
- Define user interactions
- Map screens and components
- ⏱️ Estimated time: 2-3 hours

### **Stage 04: Backend (TDD Planning)**
- Plan API structure
- Define TDD strategy
- Create test cases (not implementation yet)
- ⏱️ Estimated time: 4-6 hours

### **Stage 05: Frontend (TDD Planning)**
- Plan component structure
- Define UI/UX flow
- Create TDD test cases
- ⏱️ Estimated time: 4-6 hours

### **Stage 06: Database**
- Design data models
- Define schemas and relations
- Plan migrations
- ⏱️ Estimated time: 2-3 hours

### **Stage 07: QA & Testing**
- Create test plans
- Define test coverage requirements
- Set up testing infrastructure
- ⏱️ Estimated time: 3-4 hours

### **Stage 08: Implementation** 🎯
- **ACTUAL CODING BEGINS HERE**
- Implement backend with tests
- Implement frontend with tests
- Integrate and test end-to-end
- ⏱️ Estimated time: 20-40 hours

### **Stage 09: Deployment**
- Configure CI/CD
- Set up GitHub Actions
- Deploy to staging/production
- ⏱️ Estimated time: 4-6 hours

---

## 🛡️ Safety Features

### Entry Questions
Every stage starts with questions to ensure:
- No content is generated inappropriately
- Context is gathered before proceeding
- Templates match your actual needs

### Checklist Enforcement
- Checklists prevent skipping steps
- Gate-keeping ensures quality
- Cannot proceed without ✅ mark

### Reset Mechanism
If you need to restart a stage:
1. Use `RESET_STAGE` command
2. Confirm the reset
3. Receive backup of previous work
4. Start fresh

---

## 📊 Tracking Progress

### ROADMAP.md
Update `ROADMAP.md` after each stage:
```markdown
## Stage 01 - Requirements & Planning
- Started: 2024-01-15 10:00 AM
- Completed: 2024-01-15 1:30 PM
- Decisions:
  - User authentication via JWT
  - PostgreSQL for database
```

### GLOBAL_CHECKLIST.md
Check off items globally:
- ✅ Requirements defined
- ✅ Architecture approved
- ⏳ Implementation in progress

---

## 🔧 Customization

### Modifying Templates
To customize for your organization:
1. Edit `.prompt` files in each stage
2. Update entry questions
3. Adjust checklists to match your process
4. Save changes to your fork

### Adding Stages
If you need additional stages:
1. Create new directory
2. Add entry question template
3. Create checklist
4. Update main README

---

## ⚠️ Common Mistakes to Avoid

1. **Rushing through questions** - Take time to answer thoroughly
2. **Skipping checklists** - They exist for your protection
3. **Skipping stages** - Gate-keeping prevents issues
4. **Ignoring pseudo-code dialogues** - They clarify decisions
5. **Going straight to Stage 08** - Implementation needs planning

---

## 🆘 Getting Help

### If a stage fails:
1. Check `GLOBAL_FALLBACKS.md`
2. Review the stage's checklist
3. Reset and retry with more context

### If generated content is wrong:
1. Provide specific feedback
2. Request regeneration with corrections
3. Use entry questions to clarify

### If stuck on a decision:
1. Review pseudo-code dialogue output
2. Consult the architecture documentation
3. Consider fallback options

---

## 🎓 Best Practices

1. **Document decisions** - Every choice should be logged
2. **Complete checklists** - Don't mark done until truly done
3. **Review pseudo-dialogues** - They catch issues early
4. **Test as you plan** - TDD works best when planned
5. **Iterate gradually** - Each stage is revisitable

---

## 📈 Success Metrics

Track these to measure progress:
- ✅ All stages completed
- ✅ 80%+ test coverage achieved
- ✅ Code review sign-offs obtained
- ✅ CI/CD pipeline green
- ✅ No critical security issues

---

## 🚀 Next Steps

1. Open `ROADMAP.md` and initialize it
2. Go to `Stage_01_Requirements_and_Planning/`
3. Read `REQUIREMENTS_TEMPLATE.prompt`
4. Start answering entry questions!

**Good luck! 🎉**

