# ⚡ Quick Start - Database Setup (5 דקות)

## 🎯 מה צריך לעשות?

**צריך:**
1. ✅ Database URL (PostgreSQL עם pgvector)
2. ✅ הרצת 2 קבצי SQL
3. ✅ בדיקה שהכל עובד

---

## 🚀 Option 1: Supabase (הכי קל! 5 דקות)

### שלב 1: צור Project
1. היכנס: https://supabase.com
2. "New Project"
3. Name: `lotus-learning`
4. Password: **שמור את הסיסמה!**
5. "Create"

⏳ מחכים 2 דקות

### שלב 2: התקן pgvector
1. פתח **"SQL Editor"** (למעלה)
2. הדבק והרץ:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. לחץ **"Run"**

### שלב 3: הרץ את ה-Schema

**א. Core Tables:**

1. ב-SQL Editor, פתח את `DATABASE/schema/01_core_tables.sql`
2. **העתק את כל התוכן** (Ctrl+A, Ctrl+C)
3. **הדבק** ב-Supabase SQL Editor
4. לחץ **"Run"**
5. אמור לראות: ✅ Success

**ב. Vector Tables:**

1. פתח את `DATABASE/schema/02_vector_tables.sql`
2. **העתק את כל התוכן**
3. **הדבק** ב-Supabase SQL Editor
4. לחץ **"Run"**
5. אמור לראות: ✅ Success

### שלב 4: קבל את DATABASE_URL

1. לחץ על **⚙️ Project Settings** (למטה)
2. גלול ל-**"Connection string"**
3. בחר **"URI"** tab
4. לחץ על **"Copy"**

דוגמה:
```
postgresql://postgres.[REF].supabase.co:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**חשוב:** החלף את `[PASSWORD]` בסיסמה שבחרת!

### שלב 5: הוסף ל-Railway

1. היכנס ל-[Railway.app](https://railway.app)
2. פתח את ה-Backend service
3. "Variables" → "+ New Variable"
4. Key: `DATABASE_URL`
5. Value: ה-URL שקיבלת מ-Supabase
6. "Add"

### ✅ בוצע!

עכשיו תריץ:
```bash
cd BACKEND
node ../DATABASE/test-connection.js
```

אמור להראות:
```
✅ Connected successfully!
✅ All core tables exist!
✅ pgvector extension installed!
```

---

## 💻 Option 2: Local PostgreSQL (15 דקות)

### שלב 1: התקן PostgreSQL

1. הורד: [postgresql.org/download](https://www.postgresql.org/download/windows/)
2. תתקין - בחר Port `5432`
3. בחר סיסמה ל-postgres user
4. תתקין **pgAdmin**

### שלב 2: התקן pgvector

**במעבר:**
1. הרץ את "pgAdmin"
2. לחץ על "PostgreSQL 15/16" → Enter Master Password
3. לחץ ימין על "Databases" → "Query Tool"

הרץ:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

הרץ את זה (F5)

### שלב 3: צור Database

1. לחץ ימין על "Databases"
2. "Create" → "Database"
3. Name: `corporate_learning`
4. לחץ "Save"

### שלב 4: הרץ את ה-Schema

1. לחץ ימין על `corporate_learning` → "Tools" → "Query Tool"
2. פתח `DATABASE/schema/01_core_tables.sql`
3. **העתק-הדבק** והרץ (F5)
4. פתח `DATABASE/schema/02_vector_tables.sql`
5. **העתק-הדבק** והרץ (F5)

### שלב 5: הגדר .env

צור `BACKEND/.env`:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@localhost:5432/corporate_learning
```

החלף `[YOUR-PASSWORD]` בסיסמה שבחרת!

### ✅ בוצע!

בדוק:
```bash
cd BACKEND
node ../DATABASE/test-connection.js
```

---

## 🤖 Option 3: Script אוטומטי (Windows)

אם יש לך psql מותקן:

```powershell
cd DATABASE
.\setup.ps1
```

הסקריפט יבקש:
1. DATABASE_URL
2. יריץ הכל אוטומטית
3. יציג תוצאות

---

## 🧪 בדיקה

אחרי ההתקנה, הרץ:

```bash
cd BACKEND
node ../DATABASE/test-connection.js
```

**אמור להראות:**
```
✅ Connected successfully!
✅ All core tables exist!
✅ All vector tables exist!
✅ pgvector extension installed!
🎉 Database is ready to use!
```

**אם רואה שגיאות:**

- `❌ DATABASE_URL missing` → הוסף ל-`.env` או Railway Variables
- `⚠️ pgvector not installed` → הרץ `CREATE EXTENSION vector;`
- `⚠️ Tables missing` → הרץ שוב את ה-SQL files

---

## 📁 מה נוצר?

**13 טבלאות:**

**Core (7):**
- users
- skills
- learning_content
- user_progress
- chat_messages
- recommendations
- learning_analytics

**Vector (6):**
- document_embeddings
- query_embeddings
- skill_embeddings
- knowledge_nodes
- knowledge_edges
- vector_search_cache

---

## 🎯 השלב הבא

אחרי שה-Database מוכן:

1. ✅ הוסף DATABASE_URL ל-Railway
2. ✅ בדוק: `node DATABASE/test-connection.js`
3. ✅ הרץ backend: `npm run dev`
4. ✅ הוסף seed data (אופציונלי): `DATABASE/seed/sample_data.sql`

---

**שאלות?** קרא `SETUP_DATABASE.md` למדריך מפורט יותר!

