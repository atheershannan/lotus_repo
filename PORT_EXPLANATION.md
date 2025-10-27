# 🔌 הסבר על PORT ב-Railway

## ❌ לא צריך להגדיר PORT ב-Railway!

### למה?
Railway **מגדיר את זה אוטומטית** דרך משתנה סביבה `$PORT`.

### מה קורה בפועל?
1. Railway נותן לפורטדינמי לכל deployment (למשל: 8080, 3000, וכו')
2. זה מוגדר במשתנה סביבה `PORT` אוטומטית
3. השרת שלך קורא את זה מהקוד:

```javascript
const PORT = process.env.PORT || 3001;  // שורה 47 ב-server.js
```

### מה שאתה רואה בלוגים:
```
info: 🚀 Corporate Learning Assistant Backend running on port 8080
```

זה נורמלי! Railway נתן לשרת פורט 8080.

---

## ✅ משתנים שכן צריך להוסיף ב-Railway

פתח Railway → Variables → + New Variable

### 1️⃣ NODE_ENV
```
Key: NODE_ENV
Value: production
```

### 2️⃣ ALLOWED_ORIGINS
```
Key: ALLOWED_ORIGINS
Value: https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

### 3️⃣ OPENAI_API_KEY (אם לא קיים)
```
Key: OPENAI_API_KEY
Value: sk-... (המפתח שלך)
```

---

## 📌 סיכום

❌ **אל תגדיר**: PORT (Railway עושה את זה אוטומטית)
✅ **כן תגדיר**: NODE_ENV, ALLOWED_ORIGINS

---

## 🔍 איך לבדוק שהכל בסדר?

אחרי שתוסיף את NODE_ENV, ה-Logs אמורים להראות:

```
🌐 CORS Allowed Origins: [ ... ]
info: 🚀 Corporate Learning Assistant Backend running on port 8080
info: 📊 Environment: production ✅ (לא development!)
```

