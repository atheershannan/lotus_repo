# 🎯 הוראות הרצה מסודרות - Corporate Learning Assistant

## ⚠️ לפני שמתחילים - בדוק שיש לך:

1. ✅ **Node.js** מותקן (גרסה 18+)
2. ✅ **npm** מותקן
3. ✅ **PostgreSQL** מותקן (או Supabase account)

## 📋 שלב 1: בדיקת התקנות

```bash
node --version
npm --version
```

## 📋 שלב 2: הגדרת Backend

### 1. התקן dependencies
```bash
cd BACKEND
npm install
```

### 2. צור קובץ .env
צור קובץ `BACKEND/.env` עם התוכן הבא:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/corporate_learning"

# OpenAI (חובה!)
OPENAI_API_KEY="sk-your-actual-key-here"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Logging
LOG_LEVEL=info
```

### 3. הרץ Prisma migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

### 4. הרץ את ה-Backend
```bash
npm run dev
```

ה-Backend יעלה על: **http://localhost:3001**

## 📋 שלב 3: הגדרת Frontend

### 1. פתח terminal חדש
**חשוב**: פתח terminal חדש (שאר את ה-Backend רץ)

### 2. התקן dependencies
```bash
cd FRONTEND
npm install
```

### 3. צור קובץ .env
צור קובץ `FRONTEND/.env` עם התוכן הבא:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 4. הרץ את ה-Frontend
```bash
npm start
```

ה-Frontend יעלה על: **http://localhost:3000**

## 🎉 אחרי שהכל רץ

### נגישות:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### אפשר לנסות:
```bash
# בדוק שהשירות רץ
curl http://localhost:3001/health

# תן רשימת משתמשים
curl http://localhost:3001/api/users

# תן רשימת skills
curl http://localhost:3001/api/skills
```

## 🐛 פתרון בעיות

### בעיה: "Port 3000 already in use"
```bash
# הרג תהליכים על פורטים
npx kill-port 3000
npx kill-port 3001
```

### בעיה: "Cannot find module"
```bash
# נקה והתקן מחדש
rm -rf node_modules package-lock.json
npm install
```

### בעיה: "Database connection error"
```bash
# בדוק ש-PostgreSQL רץ
# בדוק את DATABASE_URL ב-.env
```

### בעיה: "OpenAI API error"
```bash
# ודא שיש לך API key תקף
# בדוק שיש credits בחשבון
```

## 📝 נסה ללא Mock Data (לבחינה מהירה)

אם אין לך database מותקן, אפשר להריץ מודו mock:

```bash
# ב-BACKEND/src/server.js, שנה ל:
const USE_MOCK_DATA = true;
```

## 🚀 Ready to Go!

עכשיו תוכל להתחיל:
1. תבדוק שיש לך Node.js מותקן
2. תתקין dependencies בשני הפרויקטים
3. תריץ את Backend ואז את Frontend
4. תפתח http://localhost:3000 בדפדפן

**המשיך לנסות או שאתה צריך עזרה עם משהו ספציפי?** 🚀

