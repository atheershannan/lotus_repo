# 🗑️ Files to Remove from Repository

This document defines which files are **not necessary** for running and deploying the code and can be deleted from the repository.

---

## ✅ Files to Keep (Essential for Project)

### Basic Structure
- `README.md` - Main project documentation
- `.gitignore` - Git settings
- `docker-compose.yml` - Docker configuration
- `railway.json` - Railway configuration
- `vercel.json` - Vercel configuration

### Required Folders
- `BACKEND/` - Server code (entire folder)
- `FRONTEND/` - Client code (entire folder)
- `DATABASE/` - Database configuration
- `DEPLOYMENT/` - Deployment configuration

### Specific Files
- `index.html` - Main HTML page
- `standalone-chat-widget.html` - Standalone chat widget
- `CHATBOT.html` - Chat page
- `public/chatbot.html` - Chat bot

### Conditional Folders (Check if needed)
- `tests/performance/` - Performance tests (if present)
- `public/` - Static files (as applicable)

---

## ❌ Files to Delete - Categories:

### 1️⃣ .bat and .sh Files (Temporary Deployment Scripts)

All these .bat and .sh files are temporary deployment attempts and not needed:

```bash
# .bat files to remove:
CLEAN_GIT.bat, COMPLETE_FIX.bat, DEPLOY_CORRECT.bat, DEPLOY_FINAL.bat
DEPLOY_FIX.bat, DEPLOY_IT.bat, DEPLOY_SIMPLE.bat, DEPLOY_WORKING.bat
deploy-cloud que.bat, deploy-frontend.bat, FINAL_FIX_NO_LOGIN.bat
FINAL_FIX.bat, FINAL_PUSH.bat, FINAL_SOLUTION.bat, FIX_BOTH_ISSUES.bat
FIX_BUILD.bat, FIX_CSS.bat, FIX_MISSING_FILES.bat, FIX_VERCEL_404.bat
fix-and-push.bat, fix-secrets-forever.bat, PUSH_FIX.bat
PUSH_NO_LOGIN.bat, PUSH_NOW.bat, PUSH_TO_VERCEL.bat, push-fix.bat
quick-push.bat, quick_start.bat, REALLY_FIX_IT.bat, REMOVE_ZIP.bat
SIMPLE_DEPLOY.bat, START_BACKEND.bat, start.bat

# .sh files to remove:
DEPLOY_CHATBOT.sh, deploy-cloud.sh, quick_start.sh, start.sh
```

### 2️⃣ Text Files with Temporary Instructions (.txt)

```bash
DEPLOY_COMMANDS.txt, DEPLOY_NOW.txt, GIT_FIX_COMMANDS.txt
NO_LOGIN_JUST_CHATBOT.txt, PUSH_AND_DEPLOY.txt, PUSH_COMMANDS.txt
PUSH_DOCKERFIX.txt, PUSH_FINAL.txt, PUSH_OPENSSL_FIX.txt
PUSH_TO_GITHUB.txt, RAILWAY_FIX.txt, RAILWAY_URL.txt
SIMPLE_FIX.txt, VERCEL_ENV_SETUP.txt, VERCEL_SETTINGS.txt
WHERE_TO_UPDATE.txt
```

### 3️⃣ Temporary Documentation Files (.md)

```bash
# Fix documentation:
ADD_MISSING_DOMAIN.md, BACKEND_FIX_SUMMARY.md, BUILD_FIX.md
CHECK_BACKEND.md, CLEAN_PUSH.md, CORS_DOUBLE_API_FIX.md
CORS_FIX_SOLUTIONS.md, CORS_FIX.md, DEBUG_API_CONNECTION.md
FIX_CORS_ERRORS.md, FIX_CORS_HE.md, HEBREW_FIX_SUMMARY.md
LAST_FIX.md, PRISMA_OPENSSL_FIX.md, RAILWAY_CORS_FIX.md
RAILWAY_FIX.md, RAILWAY_ROOT_DIRECTORY_FIX.md, VERCEL_FIX_COMPLETE.md
VERCEL_FIX.md

# Deployment documentation:
CHATBOT_ONLY_README.md, CLOUD_DEPLOYMENT_SUMMARY.md
DEPLOY_CHAT_WIDGET_TO_CLOUD.md, DEPLOY_NOW_SIMPLE.md, DEPLOY_SOLUTION.md
deploy-chatbot.md, DEPLOYMENT_CLOUD_GUIDE.md, DEPLOYMENT_DEBUG.md
DEPLOYMENT_INDEPENDENT.md, DEPLOYMENT_SUCCESS_HE.md, DEPLOYMENT_SUCCESS.md
FINAL_DEPLOYMENT_INSTRUCTIONS.md, FINAL_DEPLOYMENT_STEPS.md
FINAL_STEPS.md, FINAL_SUMMARY.md, FRONTEND-ONLY-DEPLOY.md
HOW_TO_ADD_RAILWAY_ENV_VARIABLE.md, HOW_TO_DEPLOY.md
HOW_TO_GET_SECRETS.md, QUICK_DEPLOY.md, README_DEPLOY.md
THATS_IT.md, WHAT_TO_DO_NOW.md

# Stage completion summaries:
COMPLETE_FIX_CHECKLIST.md, COMPLETE_SUCCESS.md
FRONTEND_CHECK_COMPLETE.md, FRONTEND_NO_LOGIN_VERIFICATION adaptation.md
IMPLEMENTATION_COMPLETE.md, NO_LOGIN_NEEDED.md
OPENAI_INTEGRATION_COMPLETE.md, QA_TESTING_IMPLEMENTATION.md
SUCCESS_ALMOST_DONE.md, SUCCESS_FINAL.md, SUCCESS_READY.md
SUCCESS.md, TEST_AFTER_CONFIG.md, TEST_SUMMARY.md
UPDATED_TECHNOLOGY_STACK_SUMMARY.md

# Architecture and planning docs (not needed for runtime):
API_ENDPOINTS_SPECIFICATION.md, BACKEND_DEVELOPMENT_IMPLEMENTATION.md
DATABASE_SCHEMA_CONFIGURATION.md, DATABASE_SPECIFICATION.md
FLOATING_CHAT_IMPLEMENTATION_SUMMARY.md, FLOATING_CHAT_WIDGET_README.md
FRONTEND_DEVELOPMENT_IMPLEMENTATION.md, GITHUB_ACTIONS_SETUP.md
MOCK_DATA_README.md, MOCK_MODE_SETUP.md, PROJECT_FLOW_DIAGRAMS.md
PROJECT_FLOW_DOCUMENT.md, PROJECT_ROOT.json, PROJECT_SCOPE_DOCUMENT.md
PSEUDOCODE_DIALOGUE_REQUIREMENTS_REVIEW.md
REQUIREMENTS_ADJUSTMENTS_SUMMARY.md, REQUIREMENTS_DOCUMENT.md
SECURITY_ARCHITECTURE_DOCUMENT.md, SECURITY_IMPLEMENTATION.md
SETUP_INSTRUCTIONS.md, STANDALONE_CHAT_WIDGET_README.md
STAGE_1_COMPLETION_SUMMARY.md through STAGE_7_COMPLETION_SUMMARY.md
SUPABASE_EDGE_FUNCTIONS.md, SYSTEM_ARCHITECTURE_DOCUMENT.md
TECHNOLOGY_STACK_UPDATE_COMPLETION.md, USER_STORIES_DOCUMENT.md
VERCEL_DEPLOYMENT_SETUP.md

# Temporary guides:
LAST_STEP.md, QUICK_RUN.md, QUICK_START_GUIDE.md (if QUICK_START is in README)
RAILWAY_ENV_VARIABLES_NEEDED.md, RAILWAY_QUICK_STEPS.md
MICROSERVICE_ARCHITECTURE_PROMPT.md, MICROSERVICE_ARCHITECTURE_PROMPT_EN.md
PORT_EXPLANATION.md, TEST_NOW.md
```

### 4️⃣ Other Files and Folders

```bash
# Files to remove:
FRONTEND.zip              # ZIP file shouldn't be in repo
microservice-integration.js  # Utility script not needed

# Folders to remove:
contextual-corporate-assistant/  # Empty / not in use
FULLSTACK_TEMPLATES/              # Development templates, not needed for deployment
logs/                             # Logs are generated at runtime
FRONTEND/coverage/                # Test coverage reports

# Subfolders in BACKEND to remove:
BACKEND/logs/
BACKEND/RAILWAY_DEPLOYMENT_GUIDE.md
BACKEND/RAILWAY_SETUP_HE.md
BACKEND/TEST_FIXES.md

# Subfolders in FRONTEND to remove:
FRONTEND/coverage/
FRONTEND/DEPLOY_README.md
FRONTEND/TEST_FIXES_APPLIED.md, TEST_FIXES_FINAL.md
FRONTEND/TEST_SETUP_COMPLETE.md, TESTS_READY_FOR_CI.md
```

---

## 📊 Summary by Quantity:

| Type | Estimated Count |
|------|-----------------|
| .bat files | ~30 |
| .sh files | ~5 |
| .txt files | ~20 |
| Temporary .md files | ~120 |
| Folders | ~5 |
| **Total** | **~180 files** |

---

## 🚀 Recommended Action Steps:

### Step 1: Backup
```bash
# Create backup branch before deletion
git checkout -b backup-before-cleanup
git add .
git commit -m "Backup before cleanup"
```

### Step 2: Delete by Groups
```bash
# 1. Delete .bat files
git rm *.bat

# 2. Delete .sh files
git rm *.sh

# 3. Delete .txt files
git rm *.txt

# 4. Delete unnecessary folders
git rm -r FULLSTACK_TEMPLATES/
git rm -r contextual-corporate-assistant/
git rm -r logs/
rm -rf FRONTEND/coverage/
rm -rf BACKEND/logs/

# 5. Delete temporary .md files (selective)
# Execute in sections to avoid mistakes

# 6. Delete specific signs
git rm FRONTEND.zip
git rm microservice-integration.js
```

### Step 3: Update .gitignore
```bash
# Add to .gitignore:
*.bat
*.sh
*.zip
logs/
coverage/
*.local
*.temp
```

### Step 4: Merge and Start Fresh
```bash
# Return to main branch
git checkout main

# Create clean branch
git checkout -b cleanup/main

# Delete files
# ... (deletion operations)

# Merge to main
git checkout main
git merge cleanup/main
```

---

## ⚠️ Warning:

1. **Environment files** - Make sure there are no `.env` files (should be in .gitignore)
2. **Password files** - Make sure there's no sensitive information in the folder
3. **Backup** - Always backup before bulk deletion
4. **Git history** - Files will remain in history, so no worries

---

## 📝 Files to Keep/Check:

Check if needed:
- `standalone-chat-widget.html` - If used for standalone deployment
- `CHATBOT.html` - If main chat page
- Files in `public/` - If used for deployment
- `DEPLOYMENT/` folder - If contains important settings

---

**Created:** 2024
**Purpose:** Clean repository from temporary and unnecessary files

