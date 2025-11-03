# 🚀 Deployment Guide - Railway (Backend) + Vercel (Frontend)

## ✅ מה יש לנו:

### Backend (Railway):
- 📍 URL: `lotusrepo-production.up.railway.app`
- 🎯 Root Directory: `BACKEND`
- 🚀 Start Command: `node src/server.js`
- 🌐 Port: 3001

### Frontend (Vercel):
- 📄 File: `CHATBOT.html`
- 🔗 Backend API: `https://lotusrepo-production.up.railway.app/api`
- ✅ No authentication needed (Mock mode)

---

## 📝 שלב 1: Railway Backend Setup

### ב-Railway Dashboard:

1. **Settings** → **Root Directory**
2. הגדר ל: `BACKEND`
3. **Start Command:** `node src/server.js`
4. **Port:** 3001
5. שמור ו-Redeploy

**או צור Service חדש:**
- Import from GitHub
- Root Directory: **BACKEND**
- Deploy

✅ אחרי זה, ה-Backend יהיה live ב:
`https://lotusrepo-production.up.railway.app`

---

## 📝 שלב 2: Vercel Frontend Setup

### דחוף ל-GitHub:
```bash
Latvisk
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### ב-Vercel Dashboard:

1. לך ל: https://vercel.com/dashboard
2. **Add New Project**
3. Import Repository - בחר את ה-repo שלך
4. **Configure Project:**
   - Framework Preset: **Other** (לא React!)
   - Root Directory: (ריק - השאר default)
   - Build Command: (ריק)
   - Output Directory: (ריק)
5. **Deploy**

✅ אחרי זה, ה-Chatbot יהיה live ב:
`https://your-project.vercel.app`

---

## ✅ בדיקה:

פתח את ה-URL של Vercel ותראה:
- 🤖 Chatbot interface (לא Login!)
- ✅ חיבור ל-Railway Backend
- 💬 אפשרות לשלוח הודעות!

---

## 🔗 URLs:

- **Frontend:** https://your-project.vercel.app
- **Backend:** https://lotusrepo-production.up.railway.app/api
- **Backend Health:** https://lotusrepo-production.up.railway.app/health

---

## 🎉 סיום!

עכשיו יש לך:
- ✅ Backend רץ על Railway
- ✅ Frontend רץ על Vercel
- ✅ Chatbot עובד ללא Login
- ✅ Mock mode - לא צריך database

**הכל מוכן!**

