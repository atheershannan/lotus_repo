# 🎯 Generate Embeddings for RAG System

## What are Embeddings?

Embeddings are **vector representations** of your data that allow the chatbot to:
- 🔍 Understand the meaning of text (not just keywords)
- 🎯 Find relevant information from your database
- 💬 Answer questions based on YOUR specific data

Without embeddings, the chatbot only uses general OpenAI knowledge.
With embeddings, it can answer questions about Jane Smith, John Doe, your courses, etc.

---

## 🚀 How to Generate Embeddings

### Option 1: Windows (Double-click)

1. Navigate to `BACKEND` folder
2. Double-click `generate-embeddings.bat`
3. Wait for completion (2-5 minutes)

### Option 2: Command Line

```bash
cd BACKEND
npm run embeddings:generate
```

### Option 3: From Railway/Cloud

SSH into your Railway instance and run:
```bash
cd BACKEND
node src/scripts/generate-embeddings.js
```

---

## ⚙️ Prerequisites

### 1. Environment Variables

Make sure your `BACKEND/.env` file contains:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
OPENAI_API_KEY=sk-...your-openai-key...
```

### 2. Database Connection

Verify you can connect to your database:
```bash
cd BACKEND
npm run db:studio
```

---

## 📊 What Gets Generated

The script creates embeddings for:

### 1. Users (4 embeddings)
- ✅ John Doe (Engineering, Learner)
- ✅ Jane Smith (HR, HR Manager)
- ✅ Mike Trainer (Training, Trainer)
- ✅ System Admin (IT, Admin)

### 2. Skills (6 embeddings)
- ✅ JavaScript Fundamentals
- ✅ React Development
- ✅ Node.js Backend
- ✅ Leadership Skills
- ✅ Project Management
- ✅ Machine Learning Basics

### 3. Learning Content (6 embeddings)
- ✅ JavaScript Basics Course
- ✅ React Component Development
- ✅ Node.js API Development
- ✅ Leadership Workshop
- ✅ Project Management Fundamentals
- ✅ Introduction to Machine Learning

### 4. User Progress (8 embeddings)
- ✅ All progress records with completion status

**Total: ~24 embeddings**

---

## ⏱️ Time & Cost

### Time
- **Locally**: 2-5 minutes
- **Railway**: 3-7 minutes (depending on connection)

### Cost (OpenAI API)
- Model: `text-embedding-ada-002`
- Cost: ~$0.0001 per 1K tokens
- **Estimated total cost: $0.01 - $0.05** (less than 5 cents!)

---

## 🔍 Verify Embeddings Were Created

### Option 1: Supabase Dashboard

1. Go to **Table Editor**
2. Check `document_embeddings` table
   - Should have ~18 rows
3. Check `skill_embeddings` table
   - Should have 6 rows

### Option 2: SQL Query

```sql
-- Check document embeddings
SELECT 
    content_type,
    COUNT(*) as count
FROM document_embeddings
GROUP BY content_type;

-- Should show:
-- user: 4
-- learning_content: 6
-- user_progress: 8

-- Check skill embeddings
SELECT COUNT(*) FROM skill_embeddings;
-- Should show: 6
```

---

## 🎯 Test the RAG System

After generating embeddings, try these questions in the chatbot:

### Questions About Users
```
✅ "What is Jane Smith's department?"
✅ "What skills does John Doe have?"
✅ "Tell me about Mike Trainer"
✅ "What is the HR manager's name?"
```

### Questions About Skills
```
✅ "What are the prerequisites for React Development?"
✅ "Tell me about JavaScript Fundamentals"
✅ "What skills are in the Programming category?"
✅ "What's the difficulty level of Machine Learning Basics?"
```

### Questions About Courses
```
✅ "How long is the JavaScript Basics Course?"
✅ "What modules are in the Node.js API Development course?"
✅ "Tell me about the Leadership Workshop"
✅ "What courses are available for beginners?"
```

### Questions About Progress
```
✅ "What is John Doe's progress in JavaScript?"
✅ "Which courses has John Doe completed?"
✅ "Show me Jane Smith's learning progress"
```

---

## 🔄 When to Regenerate Embeddings

Run the script again whenever you:
- ✅ Add new users
- ✅ Add new skills
- ✅ Add new learning content
- ✅ Update existing content significantly

The script automatically clears old embeddings before creating new ones.

---

## ❌ Troubleshooting

### Error: "OPENAI_API_KEY environment variable is not set"

**Solution:**
1. Create/edit `BACKEND/.env`
2. Add: `OPENAI_API_KEY=sk-your-key-here`

### Error: "Database connection failed"

**Solution:**
1. Check `DATABASE_URL` in `.env`
2. Verify you can connect to Supabase
3. Make sure your IP is whitelisted in Supabase

### Error: "Rate limit exceeded"

**Solution:**
- Wait 1 minute and try again
- OpenAI has rate limits on free tier
- The script will automatically retry

### Some embeddings failed

**Solution:**
- Check the console output to see which ones failed
- You can re-run the script - it will regenerate all

---

## 📝 Script Output Example

```
🚀 Starting Embedding Generation Process...

✅ OpenAI API Key found

🗑️  Clearing old embeddings...
✅ Old embeddings cleared

📊 Generating embeddings for users...
Found 4 users
  Processing: John Doe...
  ✅ John Doe
  Processing: Jane Smith...
  ✅ Jane Smith
  ...
✅ User embeddings complete!

🎯 Generating embeddings for skills...
Found 6 skills
  Processing: JavaScript Fundamentals...
  ✅ JavaScript Fundamentals
  ...
✅ Skill embeddings complete!

📚 Generating embeddings for learning content...
Found 6 content items
  Processing: JavaScript Basics Course...
  ✅ JavaScript Basics Course
  ...
✅ Content embeddings complete!

📈 Generating embeddings for user progress...
Found 8 progress records
  ...
✅ Progress embeddings complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 EMBEDDING GENERATION COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total Document Embeddings: 18
🎯 Total Skill Embeddings: 6
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Your chatbot is now ready to use RAG with your data!
🤖 Try asking: "What is Jane Smith's department?"
🤖 Or: "What skills does John Doe have?"
🤖 Or: "Tell me about the JavaScript Basics Course"
```

---

## 🔗 Next Steps

After generating embeddings:

1. ✅ Test the chatbot with questions about your data
2. ✅ Check that responses reference specific users/courses
3. ✅ Add more data to your database as needed
4. ✅ Regenerate embeddings when data changes

---

**Created:** October 28, 2025  
**Version:** 1.0

