# 🚀 GitHub Actions - מדריך פריסה אוטומטית

## סקירה כללית

הפרויקט כולל מספר Workflows ל-GitHub Actions לפריסה אוטומטית:

1. **ci-cd.yml** - CI/CD מלא עם בדיקות, בנייה ופריסה
2. **deploy-vercel.yml** - פריסה ל-Vercel (Frontend)
3. **deploy-railway.yml** - פריסה ל-Railway (Full-Stack)
4. **deploy-docker.yml** - בניית והעלאת Docker images

---

## 📝 הגדרת Secrets ב-GitHub

### שלב 1: היכנס ל-GitHub Repository
1. היכנס ל-Repository שלך ב-GitHub
2. לחץ על **Settings** (הגדרות)

### שלב 2: פתח Secrets
1. בתפריט השמאלי, לחץ על **Secrets and variables**
2. בחר **Actions**

### שלב 3: הוסף את ה-Secrets הבאים

לחץ על **New repository secret** והוסף כל אחד מהבאים:

#### 🔐 Vercel Deployment

```
Name: VERCEL_TOKEN
Value: [Get from: https://vercel.com/account/tokens]
```

#### 🚂 Railway Deployment

```
Name: RAILWAY_TOKEN
Value: [Get from: Railway Dashboard → Settings → Tokens]
```

#### 🐳 Docker Hub

```
Name: DOCKER_USERNAME
Value: [Your Docker Hub username]

Name: DOCKER_PASSWORD
Value: [Your Docker Hub password]
```

#### 🌐 API URLs

```
Name: REACT_APP_API_URL
Value: https://your-backend-url.com/api

Name: REACT_APP_SUPABASE_URL
Value: https://your-project.supabase.co

Name: REACT_APP_SUPABASE_ANON_KEY
Value: [Your Supabase anon key]
```

#### 🔑 Secrets נוספים (אופציונלי)

```
Name: OPENAI_API_KEY
Value: [Your OpenAI API key]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Your Supabase service role key]

Name: JWT_SECRET
Value: [Random secret string]

Name: SLACK_WEBHOOK
Value: [For deployment notifications]
```

---

## 🎯 איך להפעיל פריסה

### שיטה 1: Push אוטומטי (מומלץ)

```bash
# כל push ל-main יפרס אוטומטית
git add .
git commit -m "Your changes"
git push origin main
```

### שיטה 2: GitHub Actions UI

1. היכנס ל-Repository ב-GitHub
2. לחץ על **Actions**
3. בחר את ה-Workflow שאתה רוצה להפעיל
4. לחץ על **Run workflow**

---

## 🔧 הגדרת סביבת העבודה

### בדיקות (Tests)
ה-workflows ירוצו בדיקות אוטומטית:
- ✅ Unit tests
- ✅ Linting
- ✅ Security scans

### בנייה (Build)
כל שינוי יעבור:
- 📦 Build של Frontend
- 📦 Build של Backend
- 🐳 יצירת Docker images

### פריסה (Deployment)
לאחר שכל הבדיקות עברו בהצלחה:
- 🚀 פריסה אוטומטית ל-Vercel/Railway
- 🐳 העלאה ל-Docker Hub

---

## 📊 מעקב אחר פריסות

### צפייה בסטטוס

1. היכנס ל-Repository
2. לחץ על **Actions**
3. בחר את ה-Run הרצוי
4. צפה בלוגים בזמן אמת

### התראות

הconfigure התראות ב-GitHub:
1. **Settings** → **Notifications**
2. ציין את ה-preferences שלך
3. קבל עדכונים על:
   - כשלי build
   - פריסות מוצלחות
   - Pull requests

---

## 🐛 פתרון בעיות

### הפריסה נכשלה?

#### 1. בדוק את ה-Logs
```bash
# ב-GitHub Actions UI
Actions → Click on failed run → Check logs
```

#### 2. בדוק Secrets
```bash
# וודא שכל ה-Secrets מוגדרים
Settings → Secrets and variables → Actions
```

#### 3. בדוק את ה-Code
```bash
# הפעל בדיקות מקומית
cd FRONTEND && npm test
cd BACKEND && npm test
```

### Secrets לא עובדים?

1. **וודא שהשם נכון** - Case sensitive!
2. **וודא שה-Value תקין** - ללא רווחים מיותרים
3. **רענן את ה-Workflow** - עדכן את ה-commit

### Docker Build נכשל?

1. **בדוק את ה-Dockerfile** - וודא שהוא תקין
2. **בדוק את ה-Credentials** - Docker Hub username/password
3. **בדוק את ה-Context** - Path נכון ל-Docker build

---

## 🎨 Workflows קיימים

### 1. CI/CD מלא (`ci-cd.yml`)
```yaml
Features:
- ✅ Backend tests
- ✅ Frontend tests
- ✅ Security scanning
- ✅ Docker builds
- ✅ Staging deployment
- ✅ Production deployment
- ✅ Database migrations
- ✅ Performance tests
```

### 2. Vercel Deployment (`deploy-vercel.yml`)
```yaml
Features:
- ✅ Build Frontend
- ✅ Deploy to Vercel
- ✅ Environment variables
- ✅ Production ready
```

### 3. Railway Deployment (`deploy-railway.yml`)
```yaml
Features:
- ✅ Deploy Backend
- ✅ Deploy Frontend
- ✅ Automatic scaling
```

### 4. Docker Hub (`deploy-docker.yml`)
```yaml
Features:
- ✅ Build Docker images
- ✅ Push to Docker Hub
- ✅ Multi-platform support
- ✅ Caching
```

---

## 🚀 Quick Start

### הפריסה הראשונה שלך

```bash
# 1. הוסף את כל ה-Secrets
# (ראה למעלה)

# 2. Commit and push
git add .
git commit -m "Initial deployment setup"
git push origin main

# 3. צפה ב-GitHub Actions
# Repository → Actions → Watch the workflow run

# 4. בדוק את הפריסה
# Vercel: https://your-app.vercel.app
# Railway: Check Railway dashboard
```

---

## 📚 משאבים נוספים

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Railway Documentation](https://docs.railway.app)
- [Docker Hub](https://hub.docker.com)

---

## 🎉 סיכום

כעת יש לך:

1. ✅ Workflows מוכנים ל-GitHub Actions
2. ✅ מדריך להגדרת Secrets
3. ✅ פריסה אוטומטית מוכנה
4. ✅ מעקב וניהול של הפריסות

**הכל מוכן! רק Commit ו-Push!** 🚀

