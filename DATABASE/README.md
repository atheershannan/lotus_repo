# 🗄️ Corporate Learning Assistant - Database Setup

## 📋 תוכן עניינים

- [התקנה מהירה - Supabase](#-התקנה-מהירה---supabase)
- [התקנה מקומית - Local PostgreSQL](#-התקנה-מקומית---local-postgresql)
- [הרצה אוטומטית](#-הרצה-אוטומטית)
- [בדיקה שהכל עובד](#-בדיקה-שהכל-עובד)

---

## ⚡ התקנה מהירה - Supabase

**זמן: 5 דקות**

### 1. צור Project ב-Supabase

1. היכנס ל-[https://supabase.com](https://supabase.com)
2. לחץ **"Start your project"** / **"New Project"**
3. מלא:
   - Project Name: `lotus-learning-assistant`
   - Database Password: (שמור!)
   - Region: `West US`
4. לחץ **"Create new project"**

### 2. התקן pgvector

1. פתח **"SQL Editor"** ב-Supabase
2. הרץ:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. הרץ את הסקריפטים

**שלב 1 - Core Tables:**

1. פתח **"SQL Editor"**
2. העתק את כל התוכן מ-`schema/01_core_tables.sql`
3. הדבק ולחץ **"Run"**

**שלב 2 - Vector Tables:**

1. העתק את כל התוכן מ-`schema/02_vector_tables.sql`
2. הדבק ולחץ **"Run"**

### 4. קבל את DATABASE_URL

1. **Project Settings** ⚙️ → **Connection string**
2. בחר **"URI"** tab
3. העתק את ה-connection string
4. החלף את `[YOUR-PASSWORD]` בסיסמה שלך

### 5. הוסף ל-Railway או .env

**Railway:**
- פתח את ה-Backend service
- **Variables** → **+ New Variable**
- Key: `DATABASE_URL`
- Value: ה-URL שקיבלת
- לחץ **Add**

**קובץ .env מקומי:**
צור `BACKEND/.env`:
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF].supabase.co:5432/postgres?password=[YOUR-PASSWORD]&user=postgres.[PROJECT-REF]
```

---

## 💻 התקנה מקומית - Local PostgreSQL

**זמן: 15 דקות**

### 1. התקן PostgreSQL

**Windows:**
1. הורד: [postgresql.org/download](https://www.postgresql.org/download/windows/)
2. הרץ את ה-installer
3. בחר Port: `5432`
4. בחר סיסמת postgres user (שמור!)
5. התקן **pgAdmin**

### 2. התקן pgvector

**דרך pgAdmin:**

1. פתח **pgAdmin**
2. התחבר ל-PostgreSQL
3. לחץ ימין על Database → **Query Tool**
4. הרץ:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**דרך Command Line:**

```bash
psql -U postgres
```

בתוך psql:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
\q  # לסגור
```

### 3. צור Database

פתח **pgAdmin**:

1. לחץ ימין על **"Databases"**
2. **Create → Database**
3. Name: `corporate_learning`
4. Owner: `postgres`
5. לחץ **Save**

### 4. הרץ את Schema SQL

1. בחר את ה-database `corporate_learning`
2. **Tools → Query Tool**
3. פתח `schema/01_core_tables.sql`
4. העתק-הדבק ולרוץ **Run** ▶️
5. פתח `schema/02_vector_tables.sql`
6. העתק-הדבק ולרוץ **Run** ▶️

### 5. הגדר DATABASE_URL

צור `BACKEND/.env`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@localhost:5432/corporate_learning
```

החלף את `[YOUR-PASSWORD]` בסיסמה שלך!

---

## 🤖 הרצה אוטומטית

### Windows PowerShell:

```powershell
# עבור לתיקיית DATABASE
cd DATABASE

# הרץ את ה-script
.\setup.ps1
```

הסקריפט יבקש:
1. DATABASE_URL
2. יריץ את הסקריפטים אוטומטית
3. יציג את כל הטבלאות שנוצרו

---

## 🧪 בדיקה שהכל עובד

### 1. בדוק חיבור

צור `BACKEND/test-db.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    const count = await prisma.$queryRaw`SELECT COUNT(*) FROM users`;
    console.log('✅ Users table exists!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
```

הרץ:
```bash
cd BACKEND
node test-db.js
```

אמור להדפיס:
```
✅ Database connection successful!
✅ Users table exists!
```

### 2. בדוק את הטבלאות

**ב-Supabase Dashboard**:
- פתח **"Table Editor"**
- אמור לראות את כל הטבלאות

**ב-pgAdmin**:
- פתח **"Schemas" → "public" → "Tables"**
- אמור לראות 13 טבלאות

### 3. בדוק ש-pgvector מותקן

ב-**SQL Editor**, הרץ:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

אמור לחזור עם שורה אחת.

---

## 📊 מה נוצר?

### Core Tables (רגילות):
- ✅ `users` - משתמשים
- ✅ `skills` - כישורים
- ✅ `learning_content` - תוכן למידה
- ✅ `user_progress` - התקדמות משתמש
- ✅ `chat_messages` - הודעות צ'אט
- ✅ `recommendations` - המלצות
- ✅ `learning_analytics` - אנליטיקה

### Vector Tables (וקטוריות):
- ✅ `document_embeddings` - embeddings של תוכן
- ✅ `query_embeddings` - embeddings של שאילתות
- ✅ `skill_embeddings` - embeddings של כישורים
- ✅ `knowledge_nodes` - צמתי גרף ידע
- ✅ `knowledge_edges` - קשרי גרף ידע
- ✅ `vector_search_cache` - מטמון חיפוש

**סה"כ: 13 טבלאות + אינדקסים**

---

## 🎯 השלב הבא

אחרי שה-Database מוכן:

1. ✅ הוסף DATABASE_URL ל-Railway או .env
2. ✅ הרץ: `npm run dev` לראות שהחיבור עובד
3. ✅ הוסף נתונים ראשוניים (seed data)
4. ✅ צור embeddings לתוכן קיים
5. ✅ נסה חיפוש דרך ה-API

---

## 🚨 בעיות נפוצות

### "extension vector does not exist"
- פתרון: הרץ `CREATE EXTENSION vector;`

### "relation already exists"
- פתרון: ה-tables כבר קיימות

### "password authentication failed"
- פתרון: בדוק את הסיסמה ב-DATABASE_URL

### "could not connect to server"
- פתרון: וודא ש-PostgreSQL רץ

---

## 📚 קבצים

- `schema/01_core_tables.sql` - טבלאות בסיסיות
- `schema/02_vector_tables.sql` - טבלאות וקטוריות
- `seed/sample_data.sql` - נתונים לדוגמה
- `setup.ps1` - script אוטומטי (Windows)
- `SETUP_DATABASE.md` - מדריך מפורט

---

## ❓ שאלות?

- 📖 קרא: `SETUP_DATABASE.md` למדריך מפורט
- 🐛 דווח: ב-Issue ב-GitHub
- 💬 שאל: ב-Chat

**בהצלחה! 🚀**
