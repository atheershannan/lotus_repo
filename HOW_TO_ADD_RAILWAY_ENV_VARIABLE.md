# איך להוסיף משתנה סביבה ב-Railway - מדריך בעברית

## 📋 שלבים להוספת משתנה סביבה ב-Railway

### שלב 1: גישה ל-Railway Dashboard
1. פתח את הדפדפן וגש ל: https://railway.app/dashboard
2. התחבר לחשבון שלך

### שלב 2: בחר את השירות שלך
CD תמונה שתיקנת - אצה רואה את דף "Networking" ב-Railway:

**[LOOK AT RAILWAY IMAGE]**

כדי להוסיף משתנה סביבה:

1. **חזור למעלה** - לחץ על "Settings" בחלק השמאלי של התפריט (בלמוקסיות)
   
   או
   
2. **לחץ על הכותרת** "lotusrepo-production" בחלק העליון כדי לחזור לתפריט הראשי

### שלב 3: פתח את הלשונית "Variables"
1. בתפריט השמאלי לחץ על **"Variables"** או **"Environment"**
2. תראה רשימת משתני הסביבה הקיימים (אם יש)

### שלב 4: הוסף משתנה חדש

לחץ על הכפתור **"+ New Variable"** או **"+ Add Variable"**

תראה שדות להזנה:

#### משתנה 1: ALLOWED_ORIGINS
```
Key (Name): ALLOWED_ORIGINS
Value: https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

#### משתנה 2: NODE_ENV (אם לא קיים)
```
Key (Name): NODE_ENV
Value: production
```

#### משתנה 3: OPENAI_API_KEY (אם לא קיים)
```
Key (Name): OPENAI_API_KEY
Value: sk-your-actual-openai-key-here
```

### שלב 5: שמור
לחץ על **"Add"** או **"Save"**

### שלב 6: Redeploy (אופציונלי)
Railway בדרך כלל יזהה את השינויים ויבצע Redeploy אוטומטית, אבל אם לא:
1. לחץ על שירות
2. לחץ על **"Deploy"** או **"Redeploy"**

---

## 🖼️ צילומי מסך (Visual Guide)

### צעד 2: תפריט Settings
```
Navigation Menu (Left Side):
├── 📊 Metrics
├── 📋 Deployments  
├── ⚙️ Settings    ← לחץ כאן
├── 🔐 Variables   ← או כאן
└── 📡 Logs
```

### צעד 4: טופס הוספת משתנה
```
┌────────────────────────────────────┐
│  New Variable                      │
├────────────────────────────────────┤
│  Variable Name:                    │
│  [ALLOWED_ORIGINS            ]     │
│                                     │
│  Variable Value:                   │
│  [https://lotus-repo.ve...   ]     │
│                                     │
│  [ Cancel ]  [ Add Variable ]     │
└────────────────────────────────────┘
```

---

## ✅ סטטורת מצב (לאחר ההזנה)

לאחר הוספת המשתנים, צריך לקבל:

```
ALLOWED_ORIGINS: ✓
NODE_ENV: ✓
OPENAI_API_KEY: ✓
DATABASE_URL: ✓
```

---

## 🔍 איך לוודא שהמשתנים הוזנו נכון?

### דרך 1: בדיקה ב-Logs
1. פתח את ה-**Logs** במערכת
2. חפש את השורה: `🌐 CORS Allowed Origins: [...]`
3. אמור לראות את הדומיינים שהזנו

### דרך 2: בדיקה ב-API
שלח קריאה ל-endpoint:
```bash
curl https://lotusrepo-production.up.railway.app/health
```

צריך להחזיר:
```json
{
  "environment": "production"
}
```

---

## ⚠️ בעיות נפוצות

### הבעיה: המשתנה לא נשמר
**פתרון**: ודא שאין רווחים לפני ואחרי ה-Key וה-Value

### הבעיה: עדיין רואה שגיאת CORS
**פתרון**: 
1. חכה 30 שניות (Railway צריך לפרוש מחדש)
2. רענן את הדפדפן
3. בדוק ש-ALLOWED_ORIGINS כולל בדיוק את הדומיין של Vercel

### הבעיה: לא רואה את הכפתור "Variables"
**פתרון**: 
- ודא שנמצאים ב-**Settings** tab
- סגרויפ את הדפדפן וחבר שוב
- נסה ליחס איגדי ישירות: https://railway.app/project/YOUR_PROJECT_ID/service/YOUR_SERVICE_ID/variables

---

## 📞 תמיכה

אם עדיין נתקל בבעיות:
1. צילם את הלוגים מ-Railway
2. בדוק את קונסולת הדפדפן
3. בדוק שאתה ב- **production** ולא ב-development branch

