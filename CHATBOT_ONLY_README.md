# 🚀 הפריסה ל-Vercel עם CHATBOT בלבד

## ⚠️ הוראות חשובות:

כשאתה מפרס ב-Vercel:

### 1️⃣ ב-Vercel Dashboard:

כשאתה עושה **Import Project**:

**Framework Preset:** בחר **"Other"** (לא Create React App!)

**Root Directory:** השאר ריק `""`

**Build Command:** השאר ריק `""`

**Output Directory:** השאר ריק `""`

**Install Command:** השאר ריק `""`

---

### 2️⃣ אחרי שה-Deployment יסתיים:

Vercel יראה את ה-CHATBOT.html ישירות!

---

### 3️⃣ אם עדיין לא עובד:

**Redeploy עם ה-settings האלה:**
- Framework: Other  
- Root: (empty)
- Build Command: (empty)
- Output Directory: (empty)

---

## ✅ בחלון ה-Deployment Settings:

```
Framework Preset: [Other ▼]
Root Directory: [leave empty]
Build Command: [leave empty]  
Output Directory: [leave empty]
```

אחרי זה → **Deploy**

---

## 🎯 התוצאה:

אחרי שה-Deployment מסתיים, תיכנס אל:
```
https://your-project.vercel.app
```

ותראה את ה-🤖 Chatbot!

---

## 📝 הערה:

אם עדיין רואה את ה-Login, אז Vercel לא הקליט את ה-Changes. 
נסה:
1. Redeploy
2. או צור פרויקט חדש

