# 🎭 Mock Mode Setup Guide

## ✅ מה עשיתי:
1. ✅ יצרתי `BACKEND/src/config/mock.js` - קובץ הגדרות mock
2. ✅ עדכנתי את `BACKEND/src/services/ragService.js` - תמיכה ב-mock mode
3. ✅ המערכת תריץ בעצמה עם mock data!

## 🚀 איך להריץ עכשיו:

### **שלב 1: צרי קובץ .env ידנית**

צרי ידנית את הקובץ `BACKEND/.env` עם התוכן הזה:

```env
USE_MOCK_DATA=true
MOCK_OPENAI=true
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

### **שלב 2: הרץ את Backend**

```bash
cd BACKEND
npm run dev
```

### **שלב 3: הרץ את Frontend (בטרמינל נפרד)**

```bash
cd FRONTEND
npm install
npm start
```

## 📊 מה Mock Mode עושה:

✅ **Mock Embeddings** - יוצר embeddings מזויפים  
✅ **Mock RAG Responses** - מחזיר תשובות לפי המפתחים  
✅ **ללא Database** - לא צריך PostgreSQL  
✅ **ללא OpenAI** - לא צריך API key  

## 🧪 נסי את זה:

```bash
# Terminal 1
cd BACKEND
npm run dev

# Terminal 2  
cd FRONTEND
npm start
```

ואז נסי לשאול ב-Chat:
- "What is JavaScript?"
- "Tell me about React"
- "Explain Node.js"

## 🎯 התשובות יהיו ממווקות!

**המשיכי לנסות!** 🚀

