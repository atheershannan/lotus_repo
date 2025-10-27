# 🚀 הוספת משתנה סביבה ב-Railway - הוראות קצרות

## שלבים מהירים:

### 1️⃣ גש ל-Railway
https://railway.app/dashboard

### 2️⃣ בחר את השירות
לחץ על `lotusrepo-production`

### 3️⃣ פתח Variables
בתפריט השמאלי לחץ על **`Variables`**

### 4️⃣ לחץ על הכפתור הכחול
**`+ New Variable`** או **`+`**

### 5️⃣ הזן את הפרטים

בתחום **`Key`** (שם):
```
ALLOWED_ORIGINS
```

בתחום **`Value`** (ערך):
```
https://lotus-repo.vercel.app,https://lotus-repo-git-main-atheershannan.vercel.app,http://localhost:3000
```

### 6️⃣ уви שמור
לחץ **`Add`** או **`Save`**

### 7️⃣ וזהו! 🎉

Railway יזהה ויבצע Deploy אוטומטית.

---

## 📝 המלצה נוספת - הוסף גם:
Key: `NODE_ENV`  
Value: `production`

---

## ✅ איך לבדוק שזה עובד?
פתח בדפדפן:
```
https://lotusrepo-production.up.railway.app/health
```

צריך לראות:
```json
{"status":"healthy","environment":"production"}
```

