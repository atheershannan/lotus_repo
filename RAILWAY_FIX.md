# 🔧 תיקון Railway - Backend קורס

## הבעיה:
Railway קורס בגלל שהוא מנסה להריץ FRONTEND במקום BACKEND

## ✅ הפתרון:

### ב-Railway Dashboard:

1. **Settings** של ה-service
2. מצא **Root Directory**
3. שנה ל: **`BACKEND`** (בדיוק כך!)
4. **Start Command:** `node src/server.js`
5. **Port:** `3001` (או לא מוגדר - Railway יגלה אוטומטית)

---

## 🔍 אם עדיין לא עובד:

### בדוק את ה-Logs:
ב-Railway → **Deployments** → **View Logs**

אמור לראות:
```
⚠️  Supabase disabled (mock mode)
info: 🚀 Corporate Learning Assistant Backend running on port 3001
```

אם אתה רואה:
```
npm start
cd FRONTEND...
```
→ **Root Directory לא מוגדר נכון!**

---

## ✅ מה צריך להיות ב-Railway:

- **Root Directory:** `BACKEND`
- **Start Command:** `node src/server.js`
- **Framework:** Node.js
- **Port:** 3001

---

## 🔄 Redeploy אחרי שינויים:

בב-Railway → **Deployments** → **Redeploy**

