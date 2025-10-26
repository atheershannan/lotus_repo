# 📖 HOW TO USE TEMPLATES

## 🎯 Overview

This template system guides you through building a complete full-stack project using Cursor's AI capabilities. Each stage includes dynamic questions, validation, and intelligent progression.

## 🚀 Getting Started

### Step 1: Initialize Your Project
```bash
# Start with Stage 1
cd FULLSTACK_TEMPLATES/Stage_01_Requirements_and_Planning/
# Open 00_STAGE_OVERVIEW.prompt in Cursor
```

### Step 2: Follow the Dynamic Question Flow
1. **Read the stage overview**
2. **Answer the dynamic questions** (required before generation)
3. **Review generated content**
4. **Mark stage as complete** in ROADMAP.md
5. **Proceed to next stage**

## 🧬 Dynamic Question System

### How It Works
1. **Context Analysis** - System analyzes previous stage outputs
2. **Question Generation** - Creates context-aware questions
3. **Validation** - Checks for inconsistencies
4. **Blocking** - Prevents progression until all data is validated
5. **Generation** - Creates content based on validated inputs

### Question Types
- **Clarification** - When information is ambiguous
- **Validation** - When inconsistencies are detected
- **Follow-up** - Based on previous answers
- **Confirmation** - Before making changes

## 📊 Progress Tracking

### ROADMAP.md System
- **Stage Status** - Pending, In Progress, Complete
- **Timestamps** - Start and completion times
- **Dependencies** - Stage unlocking rules
- **Analytics** - Progress metrics and decisions

### Stage States
- `[ ] Pending` - Not started
- `[🔄] In Progress` - Currently working
- `[✅] Complete` - Finished and validated
- `[❌] Blocked` - Waiting for dependencies

## 🔄 Reset Mechanism

### When to Reset
- Major scope changes
- Technology stack changes
- Architecture modifications
- Data inconsistencies

### How to Reset
1. **Manual Reset**: Add `RESET_STAGE: <Stage_Name>` to ROADMAP.md
2. **Confirmation**: System asks for confirmation
3. **Cleanup**: Clears old data and timestamps
4. **Restart**: Marks stage as pending

## 🛡️ Safety Features

### Non-destructive Operations
- **Backup Creation** - Before major changes
- **Confirmation Prompts** - For destructive operations
- **Version Control** - Track all changes
- **Rollback Support** - Revert to previous states

### Data Validation
- **Consistency Checks** - Cross-stage validation
- **Dependency Verification** - Ensure prerequisites
- **Format Validation** - Check data formats
- **Completeness Checks** - Verify required fields

## 🎯 Best Practices

### Before Starting
1. **Read the master workflow guide**
2. **Understand the dynamic question system**
3. **Prepare project requirements**
4. **Set up version control**

### During Development
1. **Answer questions thoroughly**
2. **Review generated content**
3. **Update ROADMAP.md regularly**
4. **Use checklists for validation**

### After Completion
1. **Verify all stages are complete**
2. **Review the analytics summary**
3. **Test the deployment pipeline**
4. **Document any customizations**

## 🚨 Troubleshooting

### Common Issues

#### Stage Won't Unlock
- **Check dependencies** - Previous stage must be complete
- **Verify ROADMAP.md** - Ensure proper status
- **Review validation** - Check for missing data

#### Dynamic Questions Not Appearing
- **Check context** - Ensure previous stage data exists
- **Verify templates** - Confirm template files are present
- **Review logs** - Check for error messages

#### Generation Fails
- **Validate inputs** - Check all required data
- **Review dependencies** - Ensure prerequisites are met
- **Check fallbacks** - Use recovery prompts

### Recovery Steps
1. **Check GLOBAL_FALLBACKS.md**
2. **Review error messages**
3. **Use reset mechanism if needed**
4. **Contact support if issues persist**

## 📈 Advanced Usage

### Custom Templates
- Modify stage templates for specific needs
- Add custom validation rules
- Extend the question system
- Create project-specific checklists

### Integration
- Connect with external tools
- Add custom analytics
- Integrate with CI/CD systems
- Extend deployment options

### Collaboration
- Share templates with team
- Use version control for changes
- Document customizations
- Maintain consistency across projects

---

**Need help? Check the GLOBAL_FALLBACKS.md for detailed troubleshooting! 🛠️**
