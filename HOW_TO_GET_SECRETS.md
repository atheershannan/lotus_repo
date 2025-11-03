# 🔐 איך להשיג את כל ה-Secrets

## 📝 REACT_APP_API_URL - כתובת ה-Backend

### אופציה 1: יש לך Backend?
אם כבר פירסת Backend (Railway, Render, Heroku וכו'), תוכל להשתמש בכתובת שלו:
```
https://your-backend-app.railway.app/api
https://your-backend-app.render.com/api
https://your-backend-app.herokuapp.com/api
```

### אופציה 2: עדיין לא פירסת Backend?
**אתה יכול להשתמש ב-Mock Mode!**

בקובץ `FRONTEND/src/services/api.js` יש הגדרה:
```javascript
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  ...
});
```

**להתחלה:** השתמש בכתובת הזו:
```
http://localhost:3001/api
```

**או ניתן להשתמש ב-Mock API חינמי:**
```
https://jsonplaceholder.typicode.com
```

---

## 🗄️ REACT_APP_SUPABASE_URL & REACT_APP_SUPABASE_ANON_KEY

### שלב 1: היכנס ל-Supabase
1. היכנס ל: https://supabase.com
2. היכנס/הירשם (חינם!)

### שלב 2: צור פרויקט חדש
1. לחץ על **New Project**
2. מלא את הפרטים:
   - Project Name: `Corporate Learning Assistant`
   - Database Password: בחר סיסמה חזקה
   - Region: בחר קרוב אליך (ישראל = West Europe)
3. לחץ על **Create new project**

### שלב 3: קבל את המפתחות
1. אחרי ש-Supabase יוצר את הפרויקט, לחץ על **Settings** (⚙️)
2. בתפריט השמאלי, לחץ על **API**
3. תראה שני מפתחות:

#### Supabase URL:
```
https://xxxxxx.supabase.co
```

#### Anon Key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3Q...
```
(המפתח הזה ארוך מאוד, העתק את כולו!)

---

## 🚀 שימוש ב-Mock Mode (ללא Backend)

אם עדיין אין Backend, ניתן להפעיל Mock Mode:

### שלב 1: ערוך את הקובץ
```javascript
// FRONTEND/src/services/api.js

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',  // Mock API
  // או
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  ...
});
```

### שלב 2: השתמש ב-Values פשוטים:
```
REACT_APP_API_URL = https://jsonplaceholder.typicode.com
REACT_APP_SUPABASE_URL = https://mock.supabase.co
REACT_APP_SUPABASE_ANON_KEY = mock-key-for-testing
```

---

## ✅ דוגמה לתצורה מלאה

### ל-Development (local):
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://xxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### ל-Production (Vercel):
```
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_SUPABASE_URL=https://xxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## 🎯 שלבים מהירים

### אני רוצה להתחיל מהר:

1. **ללא Backend?** השתמש ב-Mock:
   ```
   REACT_APP_API_URL = https://jsonplaceholder.typicode.com
   REACT_APP_SUPABASE_URL = https://demo.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = demo-key
   ```

2. **יש לך Backend?** השתמש בכתובת שלו:
   ```
   REACT_APP_API_URL = https://your-backend.com/api
   REACT_APP_SUPABASE_URL = [מ-Supabase]
   REACT_APP_SUPABASE_ANON_KEY = [מ-Supabase]
   ```

3. **רוצה להתחיל עם Supabase?**
   - היכנס ל-https://supabase.com
   - צור פרויקט
   - העתק את ה-URL וה-Anon Key

---

## 🆘 עזרה נוספת

### איפה אני מוצא את ה-Secrets?
- Supabase: Settings → API
- Backend URL: Dashboard של הפלטפורמה (Railway/Render וכו')
- Docker: לא נדרש!

### איך אני בודק שזה עובד?
```bash
# בדוק שהמשתנים מוגדרים:
echo $REACT_APP_API_URL
echo $REACT_APP_SUPABASE_URL
```

---

**💡 טיפ:** להתחלה, השתמש ב-Mock values ואז תעדכן לאמיתיים!

