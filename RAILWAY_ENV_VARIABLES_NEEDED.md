# 🔧 משתני סביבה שצריך להוסיף ב-Railway

## ⚠️ בעיות שמצאתי בלוגים

ה-Logs מראים:
```
Environment: development  ❌ (צריך להיות production!)
```

זה אומר שהמשתנה `NODE_ENV` לא מוגדר!

## 📋 רשימת משתנים שצריך להוסיף ב-Railway

פתח Railway → Variables → + New Variable

### 1️⃣ NODE_ENV (חובה!)
```
Key: NODE_ENV
Value: production
```

### 2️⃣ ALLOWED_ORIGINS (חובה!)
```
Key: ALLOWED_ORIGINS
Value: https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

### 3️⃣ OPENAI_API_KEY (אם לא קיים)
```
Key: OPENAI_API_KEY
Value: sk-... (המפתח שלך מ-OpenAI)
```

### 4️⃣ DATABASE_URL (אם לא קיים)
```
Key: DATABASE_URL
Value: postgresql://... (מ-Railway או מהמסד נתונים שלך)
```

---

## 🎯 שלבים

### שלב 1: פוש קוד חדש
1. עדכן את הקוד ב-Git:
   ```bash
   git add .
   git commit -m "Fix CORS configuration"
   git push
   ```

### שלב 2: הוסף משתנים ב-Railway
1. Railway Dashboard
2. Variables → + New המלבאי
3. הוסף את כל המשתנים למעלה
4. שמור

### שלב 3: Redeploy
Railway צריך לעשות Deploy אוטומטי אחרי Push חדש

---

## ✅ מה אמור להיות בלוגים

לאחר התיקון, ה-Logs אמורים להראות:

```
🌐 CORS Allowed Origins: [ 'https://lotus-repo.vercel.app', ... ]
info: 🚀 Corporate Learning Assistant Backend running on port 8080
info: 📊 Environment: production ✅
```

שים לב ל:
- Environment: **production** (לא development!)
- יש שורה של CORS Allowed Origins

---

## 🔍 אם עדיין לא עובד

אם אחרי הוספת המשתנים עדיין רואה `Environment: development`:

1. ודא ששמרת את המשתנה ב-Railway
2. חכה 2-3 דקות
3. בדוק ש-NODE_ENV = production (לא NODE_ENV = "production")
4. נסה Manual Redeploy

