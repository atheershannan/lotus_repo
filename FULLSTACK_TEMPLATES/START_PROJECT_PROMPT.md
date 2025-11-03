# 🚀 START NEW PROJECT - Prompt for Cursor AI

> **Copy and paste this prompt to start your new full-stack project**

---

## 📋 START HERE: Copy this entire prompt

```
I want to create a new full-stack application using the FULLSTACK_TEMPLATES system.

PROJECT DETAILS:
Project Name: [YOUR_PROJECT_NAME]
Problem Statement: [What problem does this solve?]
Target Users: [Who will use this application?]
Timeline: [How long do you have?]
Budget: [What's your budget?]

MVP FEATURES (Must have - list 3-5 features):
1. [Feature 1 description]
2. [Feature 2 description]
3. [Feature 3 description]
4. [Feature 4 description]
5. [Feature 5 description]

FUTURE FEATURES (Nice to have):
- [Future feature 1]
- [Future feature 2]

AUTHENTICATION:
- Will users log in? (Yes/No)
- Authentication method: [JWT/Sessions/OAuth]

DATA STORAGE:
- What data will be stored: [List main entities like users, products, orders]

PAYMENTS:
- Will you handle payments? (Yes/No)
- Payment method: [Stripe/PayPal/None]

DEVICES:
- Desktop only, Mobile responsive, or Native apps?

TECH PREFERENCES (optional):
- Backend: [Node.js/Python/Java]
- Frontend: [React/Vue/Next.js]
- Database: [PostgreSQL/MySQL/MongoDB]

INSTRUCTIONS:
1. Use FULLSTACK_TEMPLATES/Stage_01_Requirements_and_Planning/REQUIREMENTS_TEMPLATE.prompt
2. Ask me the 10 entry questions from that template
3. Once I answer, generate requirements.md according to the template structure
4. Then proceed to generate user_stories.md using USER_STORIES_TEMPLATE.prompt
5. Create pseudo_dialogues.md using PSEUDOCODE_DIALOGUE.prompt
6. Mark items in Stage_01 CHECKLIST.md as we progress

Let's start building!
```

---

## 💡 EXAMPLE: Task Manager Project

Here's a complete example you can copy and modify:

```
I want to create a new full-stack application using the FULLSTACK_TEMPLATES system.

PROJECT DETAILS:
Project Name: Task Manager Pro
Problem Statement: People struggle to keep track of their daily tasks and remember what needs to be done
Target Users: Individuals and busy professionals who need a simple task management system
Timeline: 2 months
Budget: $0 (using only open-source technologies)

MVP FEATURES (Must have):
1. Create new tasks with title and description
2. Mark tasks as complete/incomplete
3. Delete tasks
4. View all tasks in a list
5. User authentication (register/login)

FUTURE FEATURES:
- Task categories and tags
- Due dates and reminders
- Priority levels
- Search functionality
- Mobile app

AUTHENTICATION:
- Will users log in? Yes
- Authentication method: JWT tokens with email/password

DATA STORAGE:
- Users (id, email, password_hash, name, created_at)
- Tasks (id, user_id, title, description, status, created_at, updated_at)

PAYMENTS:
- Will you handle payments? No

DEVICES:
- Mobile responsive web application (desktop + mobile)

TECH PREFERENCES:
- Backend: Node.js with Express
- Frontend: React
- Database: PostgreSQL

INSTRUCTIONS:
1. Use FULLSTACK_TEMPLATES/Stage_01_Requirements_and_Planning/REQUIREMENTS_TEMPLATE.prompt
2. Go through all 10 entry questions
3. Generate requirements.md according to the template
4. Proceed with user_stories.md using USER_STORIES_TEMPLATE.prompt
5. Create pseudo_dialogues.md using PSEUDOCODE_DIALOGUE.prompt
6. Complete Stage 01 checklist
7. Move to Stage 02 once Stage 01 is complete

Let's start!
```

---

## 🎯 HOW TO USE

### Step 1: Copy the Prompt
Copy either:
- The blank template (fill in your details)
- The Task Manager example (modify for your needs)

### Step 2: Paste in Cursor
- Open Cursor
- Create a new chat
- Paste the prompt

### Step 3: AI Will Guide You
The AI will:
1. Ask clarifying questions if needed
2. Create requirements.md
3. Create user_stories.md
4. Create pseudo_dialogues.md
5. Complete Stage 01 checklist
6. Prepare for Stage 02

### Step 4: Continue Through Stages
Once Stage 01 is complete, proceed to:
- Stage 02: System & Architecture
- Stage 03: Project Flow
- Stage 04: Backend TDD Planning
- Stage 05: Frontend TDD Planning
- Stage 06: Database Design
- Stage 07: QA & Testing Strategy
- Stage 08: Implementation (Actual coding!)
- Stage 09: Deployment

---

## 📝 Customize for Your Project

Replace the placeholders with your actual project details:

**For a Blog Platform:**
```
Project Name: My Blog Platform
Problem Statement: Writers need a simple platform to publish articles
MVP Features: User registration, Create post, Edit post, Delete post, View posts
```

**For an E-commerce Site:**
```
Project Name: Online Shop
Problem Statement: Small businesses need to sell products online
MVP Features: Product catalog, Shopping cart, Checkout, Payments, Order management
```

**For a Chat Application:**
```
Project Name: Chat App
Problem Statement: Teams need real-time communication
MVP Features: User auth, Send messages, Receive messages, Chat rooms, Online status
```

---

## ✅ Verification Checklist

Before starting, make sure you have:
- [ ] FULLSTACK_TEMPLATES folder in your workspace
- [ ] ROADMAP.md open and ready to fill
- [ ] Clear idea of what you want to build
- [ ] Cursor AI ready (you're using it now!)

---

## 🚀 Quick Start Commands

**To initialize the project:**
```bash
# Open and edit ROADMAP.md
code FULLSTACK_TEMPLATES/ROADMAP.md

# Fill in project name and start date
# Project Name: Your Project Name
# Started: 2024-01-XX
```

**Then use the prompt above in a new Cursor chat.**

---

**You're all set! Copy the prompt above and start building! 🎉**

