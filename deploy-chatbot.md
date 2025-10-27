# 🤖 הפריסה ל-Vercel - Chatbot בלבד (ללא Login)

## ✅ פתרון - להפריס רק את ה-CHATBOT.html

### שלב 1: חסימת FRONTEND מה-Deployment

צור פרויקט חדש ב-Vercel:

1. לך ל: https://vercel.com
2. לחץ **Add New Project**
3. בחר את ה-repository

### שלב 2: הגדרות חשובות!

כשיש לך "Configure Project" → שים לב:

```
Framework Preset: [Other ▼]  ← חשוב! לא Create React App!
Root Directory: [. ▼]  ← ריק או נקודה
Build Command: [blank]  ← ריק לגמרי!
Output Directory: [blank]  ← ריק לגמרי!
```

### שלב 3: Deploy!

לחץ **Deploy**

---

## 🎯 מה יקרה?

Vercel ימצא את ה-CHATBOT.html ויציג אותו ישירות!
❌ לא יהיה Login
✅ רק Chatbot!

---

## 📝 אם עדיין רואה Login

1. לך ל-Settings של ה-project
2. רד ל-Build & Development Settings  
3. וודא שהכל ריק ו-Framework הוא "Other"
4. Redeploy

---

## 🚀 URL הסופי:

```
https://your-project.vercel.app
```

יש להציג Chatbot ישירות!

