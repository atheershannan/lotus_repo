# 🚀 Quick Start: Generate Embeddings

## What This Does

Makes your chatbot smart about YOUR data! After running this, the chatbot will know about:
- ✅ Jane Smith (HR Manager)
- ✅ John Doe (Engineer with JavaScript skills)
- ✅ All your courses and skills
- ✅ User progress and learning history

---

## 📋 Prerequisites

### 1. Create `.env` file in BACKEND folder

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
OPENAI_API_KEY="sk-...your-key..."
```

**Where to get these:**
- `DATABASE_URL`: Supabase → Settings → Database → Connection string
- `OPENAI_API_KEY`: https://platform.openai.com/api-keys

---

## 🎯 Run It!

### Windows:
```bash
# Just double-click:
generate-embeddings.bat

# Or in terminal:
npm run embeddings:generate
```

### Mac/Linux:
```bash
cd BACKEND
npm run embeddings:generate
```

---

## ⏱️ Takes 2-5 minutes, costs ~$0.02

---

## ✅ Success Looks Like:

```
🎉 EMBEDDING GENERATION COMPLETE!
📊 Total Document Embeddings: 18
🎯 Total Skill Embeddings: 6
```

---

## 🧪 Test It!

Open chatbot and ask:
- "What is Jane Smith's department?"
- "What skills does John Doe have?"
- "Tell me about the JavaScript Basics Course"

Should get REAL answers from YOUR database! 🎉

---

**Full instructions:** See `DATABASE/GENERATE_EMBEDDINGS.md`

