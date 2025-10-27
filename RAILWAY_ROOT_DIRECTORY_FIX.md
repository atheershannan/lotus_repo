# 🚨 Railway: npm command not found

## ❌ Problem
```
npm: command not found
```

Railway can't find npm because it's not installing Node.js dependencies properly.

## ✅ Solution: Set Root Directory in Railway Dashboard

### Steps:

1. **Open Railway Dashboard:**
   https://railway.app/dashboard

2. **Click on your service** (lotusrepo-production)

3. **Go to Settings tab**

4. **Find "Source" section**

5. **Click "Change Root Directory"**

6. **Select: `BACKEND`**

7. **Save**

8. **Redeploy** (or it will auto-deploy)

## 🎯 Why This Works

- Railway will run all commands from `BACKEND/` directory
- It will find `package.json` in `BACKEND/`
- It will install dependencies correctly
- `npm start` will run from the right location

## 🚫 Don't Use railway.json Start Command

The `cd BACKEND` in startCommand doesn't help because:
- Dependencies aren't installed in BACKEND folder
- Railway needs to run `npm install` in BACKEND folder
- Root Directory setting makes Railway do this automatically

---

**Action Required**: Set Root Directory to `BACKEND` in Railway Settings

**This MUST be done in Railway Dashboard, not in code!**

