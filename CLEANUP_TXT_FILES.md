# 🗑️ הסרת קבצי .txt זמניים

## מה יוסר:

הסקריפט `remove-txt-files.bat` יסיר את כל קבצי ה-.txt הזמניים מהמאגר:

### רשימת קבצים שיוסרו (16 קבצים):
```
DEPLOY_COMMANDS.txt
DEPLOY_NOW.txt
GIT_FIX_COMMANDS.txt
NO_LOGIN_JUST_CHATBOT.txt
PUSH_AND_DEPLOY.txt
PUSH_COMMANDS.txt
PUSH_DOCKERFIX.txt
PUSH_FINAL.txt
PUSH_OPENSSL_FIX.txt
PUSH_TO_GITHUB.txt
RAILWAY_FIX.txt
RAILWAY_URL.txt
SIMPLE_FIX.txt
VERCEL_ENV_SETUP.txt
VERCEL_SETTINGS.txt
WHERE_TO_UPDATE.txt
```

---

## 🚀 איך להריץ:

### אופציה 1: הרץ את הסקריפט
```bash
remove-txt-files.bat
```

### אופציה 2: מחיקה ידנית
```bash
git rm *.txt
git commit -m "Remove temporary .txt files"
```

---

## ⚠️ חשוב:

- כל קבצי ה-.txt הם **הוראות זמניות** שלא נחוצות
- הסקריפט יוצר גיבוי לפני מחיקה
- קבצים אלה לא שימושיים ולא נחוצים להרצת הפרויקט

---

## ✅ לאחר המחיקה:

```bash
# 1. בדוק מה השתנה
git status

# 2. אם הכל נראה טוב
git commit -m "Remove temporary .txt files"

# 3. דחוף לשרת
git push
```

---

## 📊 סטטיסטיקה:

- **קבצים להסרה:** 16 קבצי .txt
- **מצב:** 100% בטוח למחיקה
- **לא נחוץ להרצת הפרויקט:** כן

