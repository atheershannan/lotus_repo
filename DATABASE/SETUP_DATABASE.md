# 🗄️ מדריך מפורט להתקנת Database - שלב 1

## 📋 סקירה כללית

צריך:
1. ✅ הצבת DATABASE_URL (PostgreSQL)
2. ✅ התקנת pgvector בדאטאבייס
3. ✅ הרצת 01_core_tables.sql + 02_vector_tables.sql

---

## 🌐 אופציה 1: Supabase (מומלץ! הכי קל)

### למה Supabase?
- ✅ כולל pgvector מובנה
- ✅ חינמי ל-500MB
- ✅ ממשק ניהול נוח
- ✅ הסטינג מהיר (2 דקות)

### שלבים:

#### 1. צור Project ב-Supabase

1. היכנס ל-[https://supabase.com](https://supabase.com)
2. לחץ **"Start your project"**
3. היכנס עם GitHub/Google
4. לחץ **"New Project"**
5. מלא:
   - **Project Name**: `lotus-learning-assistant`
   - **Database Password**: (שמור את הסיסמה!)
   - **Region**: `West US` (או הקרוב ביותר אליך)
6. לחץ **"Create new project"**

⏱️ זה יקח 2 דקות

#### 2. קבל את ה-DATABASE_URL

1. לאחר שה-Project נוצר → לחץ על **"Project Settings"** (⚙️)
2. גלול למטה ל-**"Connection string"**
3. לחץ על **"URI"** tab
4. **העתק** את ה-connection string

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

#### 3. התקן pgvector ב-Supabase

**עדיף דרך Supabase Dashboard:**

1. פתח את ה-Project → לחץ על **"SQL Editor"**
2. בתיבת הטקסט, **הדבק והרץ**:

```sql
-- התקן את pgvector (כבר מותקן ב-Supabase, אבל וודא)
CREATE EXTENSION IF NOT EXISTS vector;
```

3. לחץ **"Run"**
4. אמור לראות: ✅ Success. No rows returned

#### 4. הרץ את Schema SQL

**שלב 1: Core Tables**

1. פתח **"SQL Editor"** ב-Supabase
2. **העתק את כל התוכן** מ-`DATABASE/schema/01_core_tables.sql`
3. **הדבק** ב-SQL Editor
4. לחץ **"Run"**
5. אמור לראות: ✅ Success

**שלב 2: Vector Tables**

1. **העתק את כל התוכן** מ-`DATABASE/schema/02_vector_tables.sql`
2. **הדבק** ב-SQL Editor
3. לחץ **"Run"**
4. אמור לראות: ✅ Success

**שלב 3: בדוק שהכל עובד**

הרץ:
```sql
-- בדוק שכל הטבלאות נוצרו
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

אתה אמור לראות:
- users
- skills
- learning_content
- user_progress
- chat_messages
- recommendations
- learning_analytics
- document_embeddings
- query_embeddings
- skill_embeddings
- knowledge_nodes
- knowledge_edges
- vector_search_cache

#### 5. הכן את ה-DATABASE_URL

התאם את ה-URL שקיבלת מה-Supabase:

**דוגמה:**
```
postgresql://postgres.xxxxx.supabase.co:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

חשוב: החלף את `[YOUR-PASSWORD]` בסיסמה שבחרת!

---

## 💻 אופציה 2: PostgreSQL מקומי (Local)

### למה Local?
- ✅ חינמי לחלוטין
- ✅ למידה מעמיקה
- ⚠️ דורש התקנה ידנית
- ⚠️ יותר מורכב

### שלבים:

#### 1. התקן PostgreSQL

**Windows:**
1. הורד מ-[postgresql.org/download](https://www.postgresql.org/download/windows/)
2. הורד את **PostgreSQL 15** או 16
3. הרץ את ה-installer
4. במהלך ההתקנה:
   - בחר Port: `5432`
   - בחר סיסמת postgres user (שמור אותה!)
   - התקן **pgAdmin** (נוח לניהול)

#### 2. התקן pgvector extension

פתח את **pgAdmin** והרץ:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

או דרך Command Line:

```bash
# התחבר ל-PostgreSQL
psql -U postgres

# בתוך psql, הרץ:
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 3. צור Database חדשה

פתח pgAdmin:
1. לחץ ימין על **"Databases"**
2. **Create → Database**
3. Name: `corporate_learning`
4. Owner: `postgres`
5. לחץ **Save**

#### 4. הרץ את Schema SQL

פתח **Query Tool**:
1. בחר את ה-Database `corporate_learning`
2. **Tools → Query Tool**
3. **העתק את התוכן** מ-`01_core_tables.sql`
4. **הדבק** ו-**Run**
5. **העתק את התוכן** מ-`02_vector_tables.sql`
6. **הדבק** ו-**Run**

#### 5. הגדר את DATABASE_URL

צור קובץ `.env` בתיקיית `BACKEND`:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@localhost:5432/corporate_learning
```

החלף `[YOUR-PASSWORD]` בסיסמה שבחרת!

---

## 🚂 אופציה 3: Railway PostgreSQL (Production)

### למה Railway?
- ✅ חינמי לתקופת ניסיון
- ✅ מוכן ל-P Production
- ✅ תחזוקה פשוטה

### שלבים:

#### 1. צור Railway Account

1. היכנס ל-[https://railway.app](https://railway.app)
2. היכנס עם GitHub

#### 2. צור PostgreSQL Database

1. לחץ **"New Project"**
2. לחץ **"Add Database"**
3. בחר **"PostgreSQL"**
4. Railway ייצור database אוטומטית

#### 3. התקן pgvector

1. לחץ על ה-PostgreSQL service
2. לחץ על **"Data"** tab
3. לחץ על **"Query"**
4. הרץ:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 4. הרץ Schema SQL

1. לחץ **"Data"** tab
2. לחץ **"Query"**
3. **העתק והדבק** את תוכן `01_core_tables.sql`
4. לחץ **"Run"**
5. **העתק והדבק** את תוכן `02_vector_tables.sql`
6. לחץ **"Run"**

#### 5. קבל את DATABASE_URL

1. לחץ על ה-PostgreSQL service
2. לחץ על **"Variables"** tab
3. תמצא **"DATABASE_URL"**
4. **העתק** את הערך

---

## ⚙️ התקנה אוטומטית עם NPM Script

צרתי עבורך script שיריץ את כל זה אוטומטית!

### הכן את הקובץ:

צור קובץ `DATABASE/setup.sh`:

```bash
#!/bin/bash

echo "🚀 Corporate Learning Assistant - Database Setup"
echo "================================================="

# קבל DATABASE_URL
read -p "Enter DATABASE_URL: " DATABASE_URL

# הרץ את הסקריפטים
echo "📋 Running 01_core_tables.sql..."
psql "$DATABASE_URL" -f DATABASE/schema/01_core_tables.sql

echo "📋 Running 02_vector_tables.sql..."
psql "$DATABASE_URL" -f DATABASE/schema/02_vector_tables.sql

echo "✅ Database setup complete!"
```

או **Windows PowerShell**:

```powershell
# save as DATABASE/setup.ps1

Write-Host "🚀 Corporate Learning Assistant - Database Setup" -ForegroundColor Cyan

# קבל DATABASE_URL
$DATABASE_URL = Read-Host "Enter DATABASE_URL"

# הרץ את הסקריפטים
Write-Host "📋 Running 01_core_tables.sql..." -ForegroundColor Yellow
psql $DATABASE_URL -f ".\DATABASE\schema\01_core_tables.sql"

Write-Host "📋 Running 02_vector_tables.sql..." -ForegroundColor Yellow
psql $DATABASE_URL -f ".\DATABASE\schema\02_vector_tables.sql"

Write-Host "✅ Database setup complete!" -ForegroundColor Green
```

---

## 🧪 בדיקה שהכל עובד

### 1. בדוק שהחיבור עובד

**בתיקיית BACKEND**, צור קובץ `test-db.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    // בדוק שהחיבור עובד
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // בדוק שטבלת users קיימת
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

### 2. בדוק ש-pgvector מותקן

הרץ בSQL Editor:
```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

אמור לחזור עם שורה אחת של vector extension.

### 3. בדוק ש-tables קיימות

```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

---

## 🎯 סיכום - מה צריך לעשות

### Supabase (הכי קל) - 5 דקות:
1. ✅ צור Project ב-Supabase
2. ✅ הרץ `CREATE EXTENSION vector;` ב-SQL Editor
3. ✅ הרץ את `01_core_tables.sql`
4. ✅ הרץ את `02_vector_tables.sql`
5. ✅ העתק את ה-DATABASE_URL
6. ✅ הוסף ל-Railway Variables או קובץ `.env`

### Local PostgreSQL - 15 דקות:
1. ✅ התקן PostgreSQL
2. ✅ התקן pgvector extension
3. ✅ צור database
4. ✅ הרץ את ה-SQL files דרך pgAdmin
5. ✅ הגדר DATABASE_URL ב-`.env`

### Railway - 10 דקות:
1. ✅ צור PostgreSQL service
2. ✅ התקן pgvector extension
3. ✅ הרץ את ה-SQL files
4. ✅ העתק DATABASE_URL (מוכן אוטומטית)

---

## 🚨 בעיות נפוצות

### Error: extension "vector" does not exist
- pgvector לא מותקן
- פתרון: הרץ `CREATE EXTENSION vector;`

### Error: relation "users" already exists
- ה-tables כבר קיימות
- פתרון: להריץ את `DROP TABLE` לפני, או לעקוף

### Error: password authentication failed
- הסיסמה לא נכונה
- פתרון: בדוק את ה-DATABASE_URL

---

**השלב הבא**: אחרי שהכל עובד, צריך להוסיף נתונים (seed data) ודאטס

